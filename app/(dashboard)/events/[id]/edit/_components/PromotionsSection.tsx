import { Button } from '@/components/ui/button';
import { Plus, Tag, Pencil, Trash } from 'lucide-react';
import { EventTicketPromotion } from '@/lib/models/_events_models';
import { useState } from 'react';
import { CreatePromotionModal } from './CreatePromotionModal';
import { TicketType } from '@/app/(main)/codepass/types';

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

  const handleCreatePromotion = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center px-4">
        <Button
          onClick={handleCreatePromotion}
          className="flex items-center gap-2 bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </Button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-100/50">
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
        <div className="grid gap-4">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-100"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {promotion.code}
                    </h3>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                      {promotion.valueType === 'percentage' ? `${promotion.value}% OFF` : `$${promotion.value} OFF`}
                    </span>
                    {new Date(promotion.endDate) < new Date() && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Valid:</span>
                      {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Quantity:</span>
                      {promotion.quantity > 0 ? (
                        <span className="text-green-600">{promotion.quantity} remaining</span>
                      ) : (
                        <span className="text-gray-600">Unlimited</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPromotion(promotion.id)}
                    className="text-gray-500 hover:text-primaryColor hover:bg-indigo-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePromotion(promotion.id)}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
} 