'use client';

import { useState, useEffect } from 'react';
import { getEventOrders } from '@/lib/actions/events';
import { GetEventOrdersResponse } from '@/lib/models/_events_models';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface OrderListProps {
  eventId: string;
}



export function OrderList({ eventId }: OrderListProps) {
  const [orders, setOrders] = useState<GetEventOrdersResponse['data']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getEventOrders(eventId, currentPage);
        setOrders(response.data);
        setTotal(response.total);
        setLimit(response.limit);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [eventId, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<any, any>[] = [
    {
      header: "Order Code",
      accessorKey: "orderCode",
    },
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Quantity",
      accessorKey: "totalQuantity",
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      cell: ({ row }) => `$${row.original.totalAmount}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "orderDate",
      cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        total={total}
        currentPage={currentPage}
        totalPages={Math.ceil(total / limit)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 