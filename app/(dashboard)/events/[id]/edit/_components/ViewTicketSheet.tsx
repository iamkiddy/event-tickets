import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { getTicketsById } from '@/lib/actions/events';
import { getTicketsByIdResponse } from '@/lib/models/_events_models';
import { Skeleton } from '@/components/ui/skeleton';

interface ViewTicketSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
}

export function ViewTicketSheet({ isOpen, onClose, ticketId }: ViewTicketSheetProps) {
  const [ticket, setTicket] = useState<getTicketsByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && ticketId) {
      setLoading(true);
      getTicketsById(ticketId)
        .then((response) => {
          setTicket(response);
        })
        .catch((error) => {
          console.error('Error fetching ticket:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, ticketId]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-semibold text-gray-900">Ticket Details</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : ticket ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Title</label>
                <p className="mt-1 text-base text-gray-900">{ticket.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Price</label>
                <p className="mt-1 text-base text-gray-900">
                  {ticket.currency} {ticket.price}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Quantity</label>
                <p className="mt-1 text-base text-gray-900">{ticket.quantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Start Date</label>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(`${ticket.startDate}T${ticket.startTime}`), 'PPP p')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">End Date</label>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(`${ticket.endDate}T${ticket.endTime}`), 'PPP p')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No ticket details found</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
