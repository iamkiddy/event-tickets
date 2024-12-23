'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Event } from '@/lib/models/_events_models';
import { MoreVertical, Calendar, Users, Loader2, CalendarX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from 'next/link';
import { useState } from 'react';
import { toast } from "sonner";
import { deleteEvent } from "@/lib/actions/events";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Image from 'next/image';

interface EventsTableProps {
  onRefresh: () => void;
}

interface ActionsCellProps {
  event: Event;
  onRefresh: () => void;
}

function ActionsCell({ event, onRefresh }: ActionsCellProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent(event.id);
      toast.success("Event deleted successfully");
      onRefresh(); // Call the refresh function after successful deletion
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40 bg-white">
          <Link href={`/events/${event.id}/edit`} className="w-full cursor-pointer block p-2 hover:bg-gray-100">
            View Details
          </Link>
          <div className="border-b border-gray-200 my-2" />
          <div
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600 block p-2 hover:bg-gray-100 cursor-pointer"
          >
            Delete
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const createColumns = ({ onRefresh }: EventsTableProps): ColumnDef<Event>[] => [
  {
    accessorKey: 'title',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {event.image && event.image.trim() !== "" ? (
              <div className='w-full h-full relative overflow-hidden'>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 text-gray-400" />
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
    cell: ({ row }) => <ActionsCell event={row.original} onRefresh={onRefresh} />
  },
];
