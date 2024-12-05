"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FolderSearch } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  total: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  total
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border rounded-[10px] border-gray-300">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto min-w-full">
              <Table>
                <TableHeader>
                  {columns.map((column, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  ))}
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-[10px] border-gray-300">
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto min-w-full">
            <Table>
              <TableHeader className="bg-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="sticky top-0">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          className="bg-gray-200 text-gray-600 font-semibold py-3 px-4"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-b border-gray-100">
                    <TableCell 
                      colSpan={columns.length} 
                      className="h-[200px] text-center py-3 px-4"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FolderSearch className="w-12 h-12 text-primaryColor opacity-40" />
                        <p className="text-lg font-medium text-gray-500">
                          No results found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            total
          )}{" "}
          of {total} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => table.setPageIndex(i)}
                className={`rounded-full hover:bg-gray-100 ${
                  i === 0 
                    ? "text-primaryColor"
                    : ""
                }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}