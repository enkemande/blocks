import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

export interface DataTableOptionsProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  manualPagination?: boolean;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  pageSize?: number;
  pageIndex?: number;
}

export function useDataTable<TData>({
  columns,
  data,
  manualPagination,
  manualFiltering,
  manualSorting,
  pageIndex = 0,
  pageSize = 10,
}: DataTableOptionsProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    manualPagination,
    manualFiltering,
    manualSorting,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const updateGlobalFilter = useCallback(setGlobalFilter, []);

  return useMemo(
    () => ({ table, globalFilter, updateGlobalFilter }),
    [table, globalFilter, updateGlobalFilter],
  );
}
