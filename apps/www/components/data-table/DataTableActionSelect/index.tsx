import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";

export type DataTableActionType = { id: number; label: string; type: string };

export interface DataTableActionSelectProps<TData> {
  table: Table<TData>;
  actions?: DataTableActionType[];
  onActionClick?: (action: DataTableActionType, selectedRows: TData[]) => void;
}

export function DataTableActionSelect<TData>({
  table,
  onActionClick,
  actions = [{ id: 1, label: "Delete", type: "DELETE" }],
}: DataTableActionSelectProps<TData>) {
  const selectedRowModel = table.getSelectedRowModel();
  const selectRows = useMemo(() => {
    return selectedRowModel.rows.map((row) => row.original);
  }, [selectedRowModel]);

  const disabled = useMemo(() => selectRows.length === 0, [selectRows]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <ChevronDown className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, key) => (
          <DropdownMenuItem
            onClick={() => onActionClick?.(action, selectRows)}
            key={key}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
