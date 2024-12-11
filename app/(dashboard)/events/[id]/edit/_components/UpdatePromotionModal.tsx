import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { EventTicketPromotion, UpdateEventTicketPromotionRequest, GetEventUtils } from '@/lib/models/_events_models';
import { updateEventTicketPromotion, getEventsUtils } from '@/lib/actions/events';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: EventTicketPromotion | null;
  onSuccess: () => void;
  availableTickets: { id: string; name: string }[];
}

export function UpdatePromotionModal({
  isOpen,
  onClose,
  promotion,
  onSuccess,
  availableTickets
}: UpdatePromotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventUtils, setEventUtils] = useState<GetEventUtils[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [formData, setFormData] = useState<UpdateEventTicketPromotionRequest>({
    id: '',
    code: '',
    promotionType: 'discount',
    value: 0,
    valueType: 'percentage',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    quantity: 0,
    isActive: true,
    tickets: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchEventUtils();
    }
  }, [isOpen]);

  const fetchEventUtils = async () => {
    try {
      const response = await getEventsUtils();
      setEventUtils(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching event utils:', error);
      toast.error('Failed to fetch event options');
    }
  };

  useEffect(() => {
    if (promotion) {
      setFormData({
        id: promotion.id,
        code: promotion.code,
        promotionType: promotion.promotionType,
        value: promotion.value,
        valueType: promotion.valueType,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        startTime: promotion.startTime,
        endTime: promotion.endTime,
        quantity: promotion.quantity,
        isActive: promotion.isActive,
        tickets: promotion.tickets
      });
    }
  }, [promotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotion?.id) return;
    
    setIsSubmitting(true);

    try {
      await updateEventTicketPromotion(promotion.id, formData);
      toast.success('Promotion updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast.error('Failed to update promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-semibold text-gray-900">Update Promotion</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
              <Select
                value={selectedEvent}
                onValueChange={setSelectedEvent}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectGroup>
                    <SelectLabel>Available Events</SelectLabel>
                    {eventUtils.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                placeholder="e.g., SUMMER2024"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <Select
                  value={formData.valueType}
                  onValueChange={(value) => setFormData({ ...formData, valueType: value as 'percentage' | 'amount' })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.valueType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
                </label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (0 for unlimited)</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apply to Tickets</label>
              <Select
                value={formData.tickets[0] || ''} // Since it's multiple, we'll handle array in onChange
                onValueChange={(value) => {
                  const selectedTickets = [...formData.tickets];
                  if (selectedTickets.includes(value)) {
                    // Remove if already selected
                    const index = selectedTickets.indexOf(value);
                    selectedTickets.splice(index, 1);
                  } else {
                    // Add if not selected
                    selectedTickets.push(value);
                  }
                  setFormData({ ...formData, tickets: selectedTickets });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tickets to apply promotion" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectGroup>
                    <SelectLabel>Available Tickets</SelectLabel>
                    {availableTickets.map(ticket => (
                      <SelectItem 
                        key={ticket.id} 
                        value={ticket.id}
                        className={formData.tickets.includes(ticket.id) ? 'bg-primary/10' : ''}
                      >
                        <div className="flex items-center gap-2">
                          <span>{ticket.name}</span>
                          {formData.tickets.includes(ticket.id) && (
                            <span className="text-xs bg-primary/20 px-2 py-0.5 rounded">Selected</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Selected Tickets Display */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <DateTimePicker
                  date={formData.startDate ? new Date(formData.startDate) : undefined}
                  setDate={(date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        startDate: format(date, 'yyyy-MM-dd'),
                        startTime: format(date, 'HH:mm')
                      });
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
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
              {isSubmitting ? 'Updating...' : 'Update Promotion'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}