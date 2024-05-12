"use client";
/**
 * This is an example of how to use the DataTable component
 * Remove this file when you are done
 * NOTE: the use client is only use in next js remove it if you are not using next js
 */
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { DataTableActionSelect } from "./DataTableActionSelect";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableExportButton } from "./DataTableExportButton";
import { DataTableFilterInput } from "./DataTableFilterInput";
import { DataTableHeaderCheckbox } from "./DataTableHeaderCheckbox";
import { DataTableRowCheckbox } from "./DataTableRowCheckbox";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { useDataTable } from "./useDataTable";

type User = { id: number; name: string; email: string };

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => <DataTableHeaderCheckbox table={table} />,
    cell: ({ row }) => <DataTableRowCheckbox row={row} />,
  },
  {
    accessorKey: "id",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "name",
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: (info) => info.getValue(),
  },
];

export interface ExampleDataTableProps<TData> {
  data: User[]; // server data;
}

export function ExampleDataTable<TData>({
  data,
}: ExampleDataTableProps<TData>) {
  const { table } = useDataTable<User>({ columns, data, pageSize: 5 });

  return (
    <DataTable title="Test" description="Hello Test" table={table}>
      <div className="flex flex-row items-center justify-between">
        <div>
          <DataTableFilterInput />
        </div>
        <div className="flex flex-row items-center gap-1">
          <DataTableActionSelect table={table} />
          <DataTableExportButton table={table} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </DataTable>
  );
}
