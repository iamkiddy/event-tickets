'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Event } from '@/lib/models/_events_models';
import { MoreVertical, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-500">ID: {event.id}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.original.startDate).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          {row.original.soldOut}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalGross',
    header: 'Total Gross',
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-gray-900">
          ${row.original.totalGross.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </Button>
      );
    },
  },
]; 