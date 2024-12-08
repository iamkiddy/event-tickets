import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { TicketType } from '@/app/(main)/codepass/types';
import { EventTicketPromotion } from '@/lib/models/_events_models';
interface TicketsSectionProps {
  tickets: TicketType[];
  promotions: EventTicketPromotion[];
  onAddTicket: () => void;
  onDeleteTicket: (ticketId: string) => void;
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
  formatPromotionDetails
}: TicketsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center px-4">
        <Button
          onClick={onAddTicket}
          className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
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
        tickets.map((ticket) => {
          const ticketPromotions = promotions.filter(promo => 
            promo.tickets.includes(ticket.id) && 
            new Date(promo.endDate) > new Date()
          );

          return (
            <div
              key={ticket.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ticket.type}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-primaryColor text-sm font-medium rounded-full">
                        ${ticket.price}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {ticket.available} tickets available
                  </p>
                  
                  {ticketPromotions.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-sm font-medium text-gray-900">Active Promotions:</p>
                      {ticketPromotions.map((promo) => {
                        const details = formatPromotionDetails(promo);
                        return (
                          <div key={promo.id} className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-green-50 text-green-600 font-medium rounded-full">
                              {details.label}
                            </span>
                            <span className="text-gray-600">
                              Code: <span className="font-medium">{details.code}</span>
                            </span>
                            <span className="text-gray-500">({details.remaining})</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
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
                    onClick={() => onDeleteTicket(ticket.id)}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
} 