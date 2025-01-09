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
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  total,
  currentPage,
  totalPages,
  onPageChange
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-4">
        <div className="border rounded-[10px] border-gray-300">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto min-w-full">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <Skeleton className="h-4 w-36 sm:w-48" />
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
    <div className="space-y-2 sm:space-y-4">
      <div className="border rounded-[10px] border-gray-300">
        <div className="overflow-x-auto">
          <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto min-w-full">
            <Table>
              <TableHeader className="bg-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="sticky top-0">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          className="bg-gray-200 text-gray-600 font-semibold py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm"
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
                        <TableCell key={cell.id} className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-b border-gray-100">
                    <TableCell 
                      colSpan={columns.length} 
                      className="h-[150px] sm:h-[200px] text-center py-2 px-2 sm:py-3 sm:px-4"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                        <FolderSearch className="w-8 h-8 sm:w-12 sm:h-12 text-primaryColor opacity-40" />
                        <p className="text-base sm:text-lg font-medium text-gray-500">
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Showing {((currentPage - 1) * 10) + 1} to{" "}
          {Math.min(currentPage * 10, total)}{" "}
          of {total} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page)}
                className={`rounded-full hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm ${
                  page === currentPage 
                    ? "text-primaryColor bg-primaryColor/10"
                    : ""
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}