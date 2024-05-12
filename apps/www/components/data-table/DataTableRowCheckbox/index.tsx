import { Checkbox } from "@/components/ui/checkbox";
import { Row } from "@tanstack/react-table";

export interface DataTableRowCheckboxProps<TData> {
  row: Row<TData>;
}

export function DataTableRowCheckbox<TData>({
  row,
}: DataTableRowCheckboxProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
