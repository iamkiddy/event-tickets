'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { TicketType } from '@/app/codepass/types';
import { getEventTickets } from '@/lib/actions/events';
import { CreateTicketModal } from './CreateTicketsModel';
interface TicketListProps {
  eventId: string;
  initialTickets?: TicketType[];
}

export function TicketList({ eventId, initialTickets = [] }: TicketListProps) {
  const [tickets, setTickets] = useState<TicketType[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await getEventTickets(eventId);
      console.log('Raw server response:', JSON.stringify(response, null, 2));
      
      // Check if response exists and is an array
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response:', response);
        setError('Invalid response from server');
        return;
      }

      const transformedTickets = response.map(ticket => {
        console.log('Processing ticket:', ticket);
        return {
          id: ticket.id || 'unknown',
          type: ticket.name || 'Unnamed Ticket',
          price: Number(ticket.price) || 0,
          available: Number(ticket.quantity) || 0,
          description: ticket.startDate && ticket.endDate 
            ? `Valid from ${new Date(ticket.startDate).toLocaleDateString()} to ${new Date(ticket.endDate).toLocaleDateString()}`
            : 'Date range not specified',
        };
      });
      
      console.log('Transformed tickets:', transformedTickets);
      setTickets(transformedTickets);
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const handleAddTicket = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="text-center py-8">Loading tickets...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <>
          <div className="flex justify-center items-center">
            {tickets.length > 0 && (
              <Button
                onClick={handleAddTicket}
                className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Ticket
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {tickets.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Plus className="w-8 h-8 text-primaryColor" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-900">Create Your First Ticket</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Start selling tickets by creating different ticket types with custom prices and availability.
                    </p>
                  </div>
                  <Button
                    onClick={handleAddTicket}
                    className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white mx-auto"
                    size="lg"
                  >
                    <Plus className="w-5 h-5" />
                    Create Ticket
                  </Button>
                </div>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ticket.type || 'New Ticket'}
                        </h3>
                        <span className="px-3 py-1 bg-indigo-50 text-primaryColor text-sm font-medium rounded-full">
                          ${ticket.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {ticket.available} tickets available
                      </p>
                      <p className="text-gray-600 mt-2">{ticket.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Add edit handler */}}
                        className="text-gray-500 hover:text-primaryColor hover:bg-indigo-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            eventId={eventId}
            onSuccess={fetchTickets}
          />
        </>
      )}
    </div>
  );
} 