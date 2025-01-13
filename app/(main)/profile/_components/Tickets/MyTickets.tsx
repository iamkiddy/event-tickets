'use client'
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar,  Tag, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { getAllOrdersTickets } from '@/lib/actions/orders';
import { OrderData } from '@/lib/models/_orders_models';
import { TicketDetailsSheet } from './TicketDetailsSheet';

interface MyTicketsProps {
  query: string;
  page: number;
}

export default function MyTickets({ query, page }: MyTicketsProps) {
  const [tickets, setTickets] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getAllOrdersTickets();
        setTickets(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [query, page]);

  const handleTicketClick = (ticket: OrderData) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return <div className="w-full text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <section className='w-full flex flex-col gap-6 mt-5'>
      {tickets.map((ticket) => (
        <Card 
          key={ticket.id}
          className="group hover:shadow-xl transition-all duration-300 border-indigo-50/50 overflow-hidden bg-white/50 backdrop-blur-sm hover:bg-white cursor-pointer"
          onClick={() => handleTicketClick(ticket)}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute left-0 top-0 h-full w-1 bg-primaryColor transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          
          <div className="p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              {/* Left Column - Order Info */}
              <div className="space-y-4 flex-1">
                {/* Order ID and Event Name */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-primaryColor text-xs">
                    <Tag className="w-3 h-3" />
                    <span>#{ticket.orderCode}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primaryColor transition-colors">
                    {ticket.eventName}
                  </h3>
                </div>

                {/* Date and Time */}
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                      <Calendar className="w-3 h-3 text-primaryColor" />
                    </div>
                    <span>
                      {format(
                        new Date(`${ticket.eventDate} ${ticket.eventTime}`),
                        'EEEE dd MMMM yyyy h:mm a'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Quantity and Total */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-xs text-primaryColor">
                  <Ticket className="w-3 h-3" />
                  <span>×{ticket.numberOfTickets}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900">
                  GHS {ticket.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {tickets.length === 0 && (
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white" />
          <div className="relative text-center py-12">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50" />
                <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Ticket className="w-6 h-6 text-primaryColor" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">No Tickets Found</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                  You haven&apos;t purchased any tickets yet. Browse our events to find something you&apos;ll love!
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-5 py-2 bg-primaryColor text-white text-sm rounded-full font-medium hover:bg-indigo-700 transition-colors">
                Browse Events
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <TicketDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />
    </section>
  );
}
