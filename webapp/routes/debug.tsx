import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { migrateDb, exportTables, importTables } from "../server-fns/debug";

export const Route = createFileRoute("/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [writeTablesLoading, setWriteTablesLoading] = useState(false);
  const [exportTablesLoading, setExportTablesLoading] = useState(false);

  const handleMigrate = async () => {
    setMigrateLoading(true);
    try {
      await migrateDb();
      toast.success("Migration complete");
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setMigrateLoading(false);
    }
  };

  const handleWriteTables = async () => {
    setWriteTablesLoading(true);
    try {
      const tables = [];
      const decoder = new TextDecoder();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const jsonText = decoder.decode(buf);
        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed)) {
          tables.push(...parsed);
        } else {
          tables.push(parsed);
        }
      }
      await importTables({ data: tables });
      toast.success("Import complete");
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setWriteTablesLoading(false);
    }
  };

  const handleExportTables = async () => {
    setExportTablesLoading(true);
    try {
      const output = await exportTables();

      const blob = new Blob([JSON.stringify(output)], {
        type: "text/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "test_data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Export complete");
    } catch (e) {
      toast.error(`${e}`);
    } finally {
      setExportTablesLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <input
        type="file"
        ref={fileInputRef}
        hidden
        multiple={true}
        onChange={(evt) => {
          setFiles((prev) =>
            [...prev, ...(evt.target.files ?? [])].sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
          );
        }}
      />

      <div className="flex gap-2">
        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          onClick={() => fileInputRef.current?.click()}
        >
          Add File
        </button>

        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          disabled={writeTablesLoading}
          onClick={handleWriteTables}
        >
          Upload
        </button>

        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          disabled={migrateLoading}
          onClick={handleMigrate}
        >
          Migrate DB
        </button>

        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          disabled={exportTablesLoading}
          onClick={handleExportTables}
        >
          Export
        </button>
      </div>

      <div className="flex flex-col p-4 gap-2 overflow-y-scroll min-h-32 max-h-64 border-1 rounded-md bg-slate-700">
        {files.map((f, i) => (
          <div key={i} className="flex p-2 rounded-md border-1 bg-gray-800">
            {f.name}
          </div>
        ))}
      </div>
    </div>
  );
}
