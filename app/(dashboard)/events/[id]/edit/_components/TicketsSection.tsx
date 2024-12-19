import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Clock, Tag, Users } from 'lucide-react';
import { TicketType } from '@/app/(main)/codepass/types';
import { EventTicketPromotion } from '@/lib/models/_events_models';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ViewTicketSheet } from './ViewTicketSheet';

interface TicketsSectionProps {
  tickets: TicketType[];
  promotions: EventTicketPromotion[];
  onAddTicket: () => void;
  onDeleteTicket: (ticket: TicketType) => void;
  onEditTicket: (ticket: TicketType) => void;
  formatPromotionDetails: (promotion: EventTicketPromotion) => {
    label: string;
    code: string;
    remaining: string;
    isActive: boolean;
  };
}

export function TicketsSection({
  tickets,
  promotions,
  onAddTicket,
  onDeleteTicket,
  onEditTicket,
  formatPromotionDetails
}: TicketsSectionProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleCardClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center px-4 w-full">
        <Button
          onClick={onAddTicket}
          className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Ticket
        </Button>
      </div>

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
              onClick={onAddTicket}
              className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white mx-auto"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Create Ticket
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 px-4 sm:px-0">
          {tickets.map((ticket) => {
            const ticketPromotions = promotions.filter(promo => 
              promo.tickets.includes(ticket.id) && 
              new Date(promo.endDate) > new Date()
            );

            return (
              <Card
                key={ticket.id}
                className="group hover:shadow-lg transition-all duration-300 border-indigo-50 cursor-pointer"
                onClick={() => handleCardClick(ticket.id)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-4 flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primaryColor transition-colors">
                          {ticket.type}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-4 py-1.5 bg-indigo-50 text-primaryColor text-sm font-medium rounded-full">
                            ${ticket.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{ticket.available} tickets available</span>
                        </div>
                       
                      </div>

                      {ticketPromotions.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-900">Active Promotions</span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {ticketPromotions.map((promo) => {
                              const details = formatPromotionDetails(promo);
                              return (
                                <div 
                                  key={promo.id}
                                  className="flex flex-wrap items-center gap-2 px-3 py-2 bg-green-50/50 border border-green-100 rounded-lg w-full sm:w-auto"
                                >
                                  <span className="text-green-600 font-medium text-sm">
                                    {details.label}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    Code: <span className="font-medium">{details.code}</span>
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    ({details.remaining})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTicket(ticket);
                        }}
                        className="text-gray-500 hover:text-primaryColor hover:bg-indigo-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTicket(ticket);
                        }}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ViewTicketSheet
        isOpen={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        ticketId={selectedTicketId || ''}
      />
    </div>
  );
}
