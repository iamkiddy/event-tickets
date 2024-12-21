/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CreateEventTicketPromotionRequest, GetEventUtils, EventTicketPromotion } from '@/lib/models/_events_models';
import { createEventTicketPromotion, getEventsUtils, getEventTicketPromotions } from '@/lib/actions/events';
import {SelectItem} from "@/components/ui/select";
import InputField from '@/components/custom/InputField';
import SelectField from '@/components/custom/SelectField';
import { cn } from "@/lib/utils";
import { Tag, PercentIcon } from 'lucide-react';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
  availableTickets: { id: string; name: string }[];
}

export function CreatePromotionModal({ 
  isOpen, 
  onClose, 
  eventId, 
  onSuccess,
  availableTickets 
}: CreatePromotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventUtils, setEventUtils] = useState<GetEventUtils[]>([]);
  const [promotionTab, setPromotionTab] = useState<'promo' | 'discount'>('promo');
  const [existingPromotions, setExistingPromotions] = useState<EventTicketPromotion[]>([]);
  const [formData, setFormData] = useState<CreateEventTicketPromotionRequest>({
    code: '',
    promotionType: 'discount',
    value: 0,
    valueType: 'percentage',
    endDate: '',
    endTime: '',
    quantity: 0,
    isActive: true,
    tickets: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchEventUtils();
      fetchExistingPromotions();
    }
  }, [isOpen]);

  const fetchEventUtils = async () => {
    try {
      const response = await getEventsUtils();
      setEventUtils(Array.isArray(response) ? response : [response]);
    } catch (error: unknown) {
      console.error('Error fetching event utils:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to fetch event options');
      } else {
        toast.error('Failed to fetch event options');
      }
    }
  };

  const fetchExistingPromotions = async () => {
    try {
      const response = await getEventTicketPromotions(eventId);
      setExistingPromotions(response.promotions || []);
    } catch (error: unknown) {
      console.error('Error fetching promotions:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to fetch promotions');
      } else {
        toast.error('Failed to fetch promotions');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (promotionTab === 'discount') {
      const existingDiscount = existingPromotions.find(
        (promo) => promo.promotionType === 'discount'
      );
      
      if (existingDiscount) {
        toast.error('Only one discount is allowed. Please edit the existing discount instead.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await createEventTicketPromotion(eventId, formData);
      console.log('Promotion created:', response);
      toast.success('Promotion created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast.error('Failed to create promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-semibold text-gray-900">Create New Promotion</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <div className="bg-gray-50/50 p-2 rounded-2xl">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPromotionTab('promo')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300",
                    "text-lg hover:text-primaryColor/80",
                    promotionTab === 'promo' 
                      ? "bg-white text-primaryColor shadow-lg scale-[1.02]" 
                      : "text-gray-600"
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Tag className="w-5 h-5" />
                    Promo Code
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPromotionTab('discount')}
                  className={cn(
                    "flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300",
                    "text-lg hover:text-primaryColor/80",
                    promotionTab === 'discount' 
                      ? "bg-white text-primaryColor shadow-lg scale-[1.02]" 
                      : "text-gray-600"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3">
                      <PercentIcon className="w-5 h-5" />
                      Direct Discount
                    </div>
                    <span className="text-xs text-gray-500 mt-1">(Only one discount allowed)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {promotionTab === 'promo' && (
              <InputField
                label="Promotion Code"
                value={formData.code}
                setValue={(value) => setFormData({ ...formData, code: value })}
                required
                placeholder="e.g., SUMMER2024"
                disabled={isSubmitting}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label='Discount Type'
                value={formData.valueType}
                setValue={(value) => setFormData({ ...formData, valueType: value as 'percentage' | 'amount' })}
              >
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="amount">Fixed Amount</SelectItem>
              </SelectField>

              <InputField
                label={formData.valueType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
                value={formData.value.toString()}
                setValue={(value) => setFormData({ ...formData, value: Number(value) })}
                required
                placeholder={formData.valueType === 'percentage' ? '10' : '5.00'}
                disabled={isSubmitting}
              />
            </div>

            <InputField
              label="Quantity (0 for unlimited)"
              value={formData.quantity.toString()}
              setValue={(value) => setFormData({ ...formData, quantity: Number(value) })}
              required
              type="number"
              disabled={isSubmitting}
            />

            <div className='w-full flex flex-col gap-4 mb-4'>
              <SelectField
                label='Apply to Tickets'
                value={formData.tickets[0] || ''}
                setValue={(value) => {
                  const selectedTickets = [...formData.tickets];
                  if (selectedTickets.includes(value)) {
                    const index = selectedTickets.indexOf(value);
                    selectedTickets.splice(index, 1);
                  } else {
                    selectedTickets.push(value);
                  }
                  setFormData({ ...formData, tickets: selectedTickets });
                }}
              >
                {availableTickets.map(ticket => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    {ticket.name}
                  </SelectItem>
                ))}
              </SelectField>

              {formData.tickets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tickets.map(ticketId => {
                    const ticket = availableTickets.find(t => t.id === ticketId);
                    return ticket ? (
                      <span
                        key={ticket.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded"
                      >
                        {ticket.name}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTickets = formData.tickets.filter(id => id !== ticketId);
                            setFormData({ ...formData, tickets: updatedTickets });
                          }}
                          className="hover:text-primary/80"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">End Date</label>
                <DateTimePicker
                  date={formData.endDate ? new Date(formData.endDate) : undefined}
                  setDate={(date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        endDate: format(date, 'yyyy-MM-dd'),
                        endTime: format(date, 'HH:mm')
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Promotion'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 