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
import { UpdateTicketModal } from './UpdateTicketModal';
import { DeleteTicketAlert } from './DeleteTicketAlert';
import { toast } from 'react-hot-toast';
import { deleteEventTicket } from '@/lib/actions/events';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<TicketType | null>(null);

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
      console.log('Raw promotions response:', response);
      
      // Check if response exists
      if (!response) {
        console.error('No response received from getEventTicketPromotions');
        return;
      }
      
      // Check if promotions array exists in response
      if (Array.isArray(response)) {
        // If response is directly an array
        setPromotions(response);
      } else if (response.promotions && Array.isArray(response.promotions)) {
        // If response has a promotions property
        setPromotions(response.promotions);
      } else {
        console.error('Invalid promotions data structure:', response);
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

  const handleDeleteTicket = (ticket: TicketType) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    
    try {
      await deleteEventTicket(eventId, ticketToDelete.id);
      toast.success('Ticket deleted successfully');
      await fetchTickets();
    } catch (error) {
      toast.error('Failed to delete ticket');
      console.error('Error deleting ticket:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
    }
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

  const handleEditTicket = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
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
                  onEditTicket={handleEditTicket}
                  formatPromotionDetails={formatPromotionDetails}
                />
                <CreateTicketModal
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  eventId={eventId}
                  onSuccess={fetchTickets}
                />
                <UpdateTicketModal
                  isOpen={isEditModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTicket(null);
                  }}
                  eventId={eventId}
                  ticket={selectedTicket}
                  onSuccess={fetchTickets}
                />
                <DeleteTicketAlert
                  isOpen={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTicketToDelete(null);
                  }}
                  onConfirm={handleConfirmDelete}
                  ticketName={ticketToDelete?.type || ''}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="promotions" className="space-y-6">
            <PromotionsSection
              promotions={promotions}
              tickets={tickets}
              eventId={eventId}
              onCreatePromotion={fetchPromotions}
              onEditPromotion={(id) => {/* Add edit handler */}}
              onDeletePromotion={(id) => {/* Add delete handler */}}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 