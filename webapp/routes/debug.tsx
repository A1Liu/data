import { createFileRoute } from "@tanstack/react-router";
import { useRequest } from "ahooks";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { gql, GraphQLClient } from "graphql-request";

const migrateDoc = gql`
  mutation WriteData {
    migrateDb
  }
`;

const writeTablesDoc = gql`
  mutation WriteData($tables: [TableImportInput!]!) {
    debug {
      writeTables(tables: $tables)
    }
  }
`;

const exportTablesDoc = gql`
  query ExportTables {
    debug {
      tables {
        name
        dumbFullExport {
          name
          version
          rows
        }
      }
    }
  }
`;

const endpoint = "http://localhost:8080/graphql";
const client = new GraphQLClient(endpoint);

export const Route = createFileRoute("/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { run: migrate, loading: migrateLoading } = useRequest(
    async () => {
      return await client.request(migrateDoc);
    },
    {
      manual: true,
      onError: (e) => {
        toast.error(`${e}`);
      },
    },
  );
  const { run: writeTables, loading: writeTablesLoading } = useRequest(
    async (tables: any[]) => {
      return await client.request(writeTablesDoc, { tables });
    },
    {
      manual: true,
      onError: (e) => {
        toast.error(`${e}`);
      },
    },
  );
  const { run: exportTables, loading: exportTablesLoading } = useRequest(
    async () => {
      const exportData: any = await client.request(exportTablesDoc);

      const output = exportData.debug.tables.map((t: any) => t.dumbFullExport);

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
      URL.revokeObjectURL(url); // Clean up the temporary URL
    },
    {
      manual: true,
      onError: (e) => {
        toast.error(`${e}`);
      },
    },
  );

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
          onClick={async () => {
            const decoder = new TextDecoder();
            const tables = [];
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

            writeTables(tables);
          }}
        >
          Upload
        </button>

        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          disabled={migrateLoading}
          onClick={() => migrate()}
        >
          Migrate DB
        </button>

        <button
          className="flex p-2 cursor-pointer rounded-md border-1 bg-slate-900"
          disabled={exportTablesLoading}
          onClick={() => exportTables()}
        >
          Export
        </button>
      </div>

      <div className="flex flex-col p-4 gap-2 overflow-y-scroll min-h-32 max-h-64 border-1 rounded-md bg-slate-700">
        {files.map((f) => (
          <div className="flex p-2 rounded-md border-1 bg-gray-800">
            {f.name}
          </div>
        ))}
      </div>
    </div>
  );
}
