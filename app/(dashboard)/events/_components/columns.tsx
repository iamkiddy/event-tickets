'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Event } from '@/lib/models/_events_models';
import { MoreVertical, Calendar, Users, Trash2, Eye, CheckCircle, CalendarX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {event.image && event.image.trim() !== "" ? (
              <img
                src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            ) : (
              <CalendarX2 className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
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
    accessorKey: 'soldOut',
    header: 'Sold',
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
    header: 'Actions',
    cell: ({ row }) => {
      const event = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white">
            <DropdownMenuItem asChild>
              <Link 
                href={`/events/${event.id}/edit`}
                className="flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1 hover:bg-gray-50 w-full rounded-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1 hover:bg-gray-50 rounded-sm"
              onClick={() => {
                // Add verification logic here
                console.log('Verify event:', event.id);
              }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer transition-all hover:translate-x-1 hover:bg-gray-50 rounded-sm"
              onClick={() => {
                // Add delete logic here
                console.log('Delete event:', event.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
