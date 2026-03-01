import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../db";

export const migrateDb = createServerFn({ method: "POST" }).handler(
  async () => {
    // Prisma handles migrations via `prisma migrate deploy` CLI command.
    // This server function runs it programmatically using Prisma's migrate engine.
    const { execSync } = await import("child_process");
    try {
      execSync("npx prisma migrate deploy", {
        stdio: "pipe",
        env: process.env as Record<string, string | undefined>,
      });
      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Migration failed: ${message}`);
    }
  },
);

interface TableExport {
  name: string;
  rows: Record<string, JsonValue>[];
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const exportTables = createServerFn({ method: "GET" }).handler(
  async () => {
    // Dynamically query all public tables and export their contents
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename != '_prisma_migrations'
      ORDER BY tablename
    `;

    const result: TableExport[] = [];

    for (const table of tables) {
      const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT * FROM "${table.tablename}"`,
      );

      // Convert BigInt values and other non-JSON-serializable types
      const serializedRows = rows.map(
        (row: Record<string, unknown>): Record<string, JsonValue> => {
          const serialized: Record<string, JsonValue> = {};
          for (const [key, value] of Object.entries(row)) {
            serialized[key] = (
              typeof value === "bigint" ? Number(value) : value
            ) as JsonValue;
          }
          return serialized;
        },
      );

      result.push({
        name: table.tablename,
        rows: serializedRows,
      });
    }

    return result;
  },
);

interface TableImport {
  name: string;
  rows: Record<string, unknown>[];
}

export const importTables = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as TableImport[])
  .handler(async ({ data: tables }) => {
    for (const table of tables) {
      if (table.rows.length === 0) continue;

      // Clear existing data
      await prisma.$executeRawUnsafe(`DELETE FROM "${table.name}"`);

      // Insert rows one at a time using raw SQL
      for (const row of table.rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const columnNames = columns.map((c: string) => `"${c}"`).join(", ");

        await prisma.$executeRawUnsafe(
          `INSERT INTO "${table.name}" (${columnNames}) VALUES (${placeholders})`,
          ...values,
        );
      }
    }

    return { success: true, count: tables.length };
  });

export const listTables = createServerFn({ method: "GET" }).handler(
  async () => {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename != '_prisma_migrations'
      ORDER BY tablename
    `;

    const result = [];

    for (const table of tables) {
      const columns = await prisma.$queryRaw<
        { column_name: string; data_type: string }[]
      >`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${table.tablename}
        ORDER BY ordinal_position
      `;

      result.push({
        name: table.tablename,
        columns: columns.map(
          (c: { column_name: string; data_type: string }) => ({
            name: c.column_name,
            dataType: c.data_type,
          }),
        ),
      });
    }

    return result;
  },
);
