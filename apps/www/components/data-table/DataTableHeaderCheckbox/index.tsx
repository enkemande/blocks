import { Checkbox } from "@/components/ui/checkbox";
import { Table } from "@tanstack/react-table";

export interface DataTableHeaderCheckboxProps<TData> {
  table: Table<TData>;
}

export function DataTableHeaderCheckbox<TData>({
  table,
}: DataTableHeaderCheckboxProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}
