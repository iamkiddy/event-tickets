/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Plus, Tag, Pencil, Trash, Calendar, Ticket, PercentIcon } from 'lucide-react';
import { EventTicketPromotion } from '@/lib/models/_events_models';
import { useState } from 'react';
import { CreatePromotionModal } from './CreatePromotionModal';
import { TicketType } from '@/app/(main)/codepass/types';
import { Card } from '@/components/ui/card';
import { UpdatePromotionModal } from './UpdatePromotionModal';
import { toast } from 'react-hot-toast';
import { deleteEventTicketPromotion } from '@/lib/actions/events';
import { DeletePromotionAlert } from './DeletePromotionAlert';
import { ViewPromotionSheet } from './ViewPromotionSheet';
import { format } from 'date-fns';

interface PromotionsSectionProps {
  promotions: EventTicketPromotion[];
  tickets: TicketType[];
  eventId: string;
  onCreatePromotion: () => void;
  onEditPromotion: (promotionId: string) => void;
  onDeletePromotion: (promotionId: string) => void;
}

export function PromotionsSection({
  promotions,
  tickets,
  eventId,
  onCreatePromotion,
  onEditPromotion,
  onDeletePromotion
}: PromotionsSectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<EventTicketPromotion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<EventTicketPromotion | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>('');

  const handleCreatePromotion = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditPromotion = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (promotion) {
      setSelectedPromotion(promotion);
      setIsEditModalOpen(true);
    }
  };

  const handleDeletePromotion = (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId);
    if (promotion) {
      setPromotionToDelete(promotion);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCardClick = (promotionId: string) => {
    setSelectedPromotionId(promotionId);
    setIsViewSheetOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;
    
    try {
      await deleteEventTicketPromotion(promotionToDelete.id);
      toast.success('Promotion deleted successfully');
      onCreatePromotion(); // Refresh the list
      setIsDeleteModalOpen(false);
      setPromotionToDelete(null);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Failed to delete promotion');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center px-2 sm:px-4">
        <Button
          onClick={handleCreatePromotion}
          className="w-full sm:w-auto flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </Button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-8 sm:py-16 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-100/50 mx-2 sm:mx-0">
          <div className="max-w-md mx-auto space-y-6 px-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto transform transition-transform hover:scale-110 duration-200">
              <Tag className="w-8 h-8 text-primaryColor" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Create Your First Promotion</h3>
              <p className="text-gray-600 leading-relaxed">
                Drive more sales by offering special discounts, early bird rates, or exclusive promotional codes.
              </p>
            </div>
            <Button
              onClick={handleCreatePromotion}
              className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white mx-auto shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Create Promotion
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 px-2 sm:px-0">
          {promotions.map((promotion) => {
            const isExpired = new Date(promotion.endDate) < new Date();
            const appliedTickets = tickets.filter(ticket => promotion.tickets.includes(ticket.id));

            return (
              <Card
                key={promotion.id}
                className={`group hover:shadow-lg transition-all duration-300 border-indigo-50 cursor-pointer
                  ${isExpired ? 'bg-gray-50' : 'bg-white'}`}
                onClick={() => handleCardClick(promotion.id)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                    <div className="space-y-4 flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <PercentIcon className={`w-5 h-5 ${isExpired ? 'text-gray-400' : 'text-primaryColor'}`} />
                          <h3 className={`text-lg sm:text-xl font-semibold ${isExpired ? 'text-gray-500' : 'text-gray-900'} 
                            group-hover:text-primaryColor transition-colors`}>
                            {promotion.code}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full
                            ${isExpired 
                              ? 'bg-gray-100 text-gray-600' 
                              : 'bg-green-50 text-green-600'}`}>
                            {promotion.valueType === 'percentage' ? `${promotion.value}% OFF` : `$${promotion.value} OFF`}
                          </span>
                          {isExpired && (
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                              Expired
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 text-xs sm:text-sm">
                            {promotion.endDate && promotion.endTime
                              ? `Expired on ${format(new Date(`${promotion.endDate}T${promotion.endTime}`), 'PPP p')}`
                              : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 text-xs sm:text-sm">
                            {promotion.quantity > 0 ? (
                              <span className="text-green-600 font-medium">{promotion.quantity} remaining</span>
                            ) : (
                              <span className="text-gray-600">Unlimited</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {appliedTickets.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Applied to:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {appliedTickets.map(ticket => (
                              <span
                                key={ticket.id}
                                className="px-2 sm:px-3 py-1 bg-indigo-50 text-primaryColor text-xs sm:text-sm font-medium rounded-full"
                              >
                                {ticket.type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 sm:self-start w-full sm:w-auto justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPromotion(promotion.id);
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
                          handleDeletePromotion(promotion.id);
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

      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventId={eventId}
        onSuccess={() => {
          onCreatePromotion();
          setIsCreateModalOpen(false);
        }}
        availableTickets={tickets.map(ticket => ({
          id: ticket.id,
          name: ticket.type
        }))}
      />

      <UpdatePromotionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromotion(null);
        }}
        promotion={selectedPromotion}
        onSuccess={onCreatePromotion}
        availableTickets={tickets.map(ticket => ({
          id: ticket.id,
          name: ticket.type
        }))}
      />

      <DeletePromotionAlert
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPromotionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        promotionCode={promotionToDelete?.code || ''}
      />

      <ViewPromotionSheet
        isOpen={isViewSheetOpen}
        onClose={() => setIsViewSheetOpen(false)}
        promotionId={selectedPromotionId}
      />
    </div>
  );
}
