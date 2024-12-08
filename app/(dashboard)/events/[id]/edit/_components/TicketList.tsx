'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Tag } from 'lucide-react';
import { TicketType } from '@/app/(main)/codepass/types';
import { getEventTickets, getEventTicketPromotions } from '@/lib/actions/events';
import { CreateTicketModal } from './CreateTicketsModel';
import { PromotionsSection } from './PromotionsSection';
import { TicketsSection } from './TicketsSection';
import { EventTicketPromotion } from '@/lib/models/_events_models';

interface TicketListProps {
  eventId: string;
  initialTickets?: TicketType[];
}

export function TicketList({ eventId, initialTickets = [] }: TicketListProps) {
  const [tickets, setTickets] = useState<TicketType[]>(initialTickets);
  const [promotions, setPromotions] = useState<EventTicketPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          isPromotion: ticket.isPromotion,
          originalPrice: ticket.originalPrice,
          promotionLabel: ticket.promotionLabel,
        };
      });
      
      console.log('Transformed tickets:', transformedTickets);
      setTickets(transformedTickets);
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to load tickets');
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await getEventTicketPromotions(eventId);
      console.log('Promotions response:', response);
      if (response && response.promotions) {
        setPromotions(response.promotions);
      }
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to load promotions');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchTickets(), fetchPromotions()]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [eventId]);

  const handleAddTicket = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  // Helper function to get promotion details for a ticket
  const getTicketPromotion = (ticketId: string) => {
    return promotions.find(promo => 
      promo.isActive && promo.tickets.includes(ticketId)
    );
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountValue: number,
    discountType: 'percentage' | 'amount'
  ): number => {
    if (discountType === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    }
    return Math.max(0, originalPrice - discountValue);
  };

  // Add this helper function to format promotion details
  const formatPromotionDetails = (promotion: EventTicketPromotion) => {
    const isActive = new Date(promotion.endDate) > new Date();
    const remaining = promotion.quantity > 0 ? `${promotion.quantity} left` : 'Unlimited';
    
    return {
      label: promotion.valueType === 'percentage' 
        ? `${promotion.value}% OFF` 
        : `$${promotion.value} OFF`,
      code: promotion.code,
      remaining: remaining,
      isActive: isActive
    };
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="inline-flex h-14 items-center justify-center rounded-lg bg-indigo-50/50 p-1 text-gray-600">
          <TabsTrigger 
            value="tickets" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm hover:bg-indigo-50 hover:text-primaryColor"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Tickets</span>
              {tickets.length > 0 && (
                <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-primaryColor">
                  {tickets.length}
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="promotions"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primaryColor data-[state=active]:shadow-sm hover:bg-indigo-50 hover:text-primaryColor"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="font-semibold">Promotions</span>
              {promotions.length > 0 && (
                <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-primaryColor">
                  {promotions.length}
                </span>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="tickets" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
                <span className="font-medium">{error}</span>
              </div>
            ) : (
              <>
                <TicketsSection
                  tickets={tickets}
                  promotions={promotions}
                  onAddTicket={handleAddTicket}
                  onDeleteTicket={handleDeleteTicket}
                  formatPromotionDetails={formatPromotionDetails}
                />
                <CreateTicketModal
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  eventId={eventId}
                  onSuccess={fetchTickets}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="promotions" className="space-y-6">
            <PromotionsSection
              promotions={promotions}
              onCreatePromotion={() => {/* Add promotion handler */}}
              onEditPromotion={(id) => {/* Add edit handler */}}
              onDeletePromotion={(id) => {/* Add delete handler */}}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 