import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { format } from 'date-fns';
import { updateEventTicket } from '@/lib/actions/events';
import { toast } from 'sonner';
import { TicketType } from '@/app/(main)/codepass/types';
import { UpdateEventTicket } from '@/lib/models/_events_models';

interface UpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticket: TicketType | null;
  onSuccess: () => void;
}

export function UpdateTicketModal({ 
  isOpen, 
  onClose, 
  eventId, 
  ticket,
  onSuccess 
}: UpdateTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<UpdateEventTicket, 'id'>>({
    name: '',
    price: 0,
    quantity: 0,
    currency: 'USD',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isActive: true
  });

  useEffect(() => {
    if (ticket) {
      const dateMatch = ticket.description?.match(/Valid from (.*) to (.*)/) || [];
      const startDate = dateMatch[1] ? new Date(dateMatch[1]) : new Date();
      const endDate = dateMatch[2] ? new Date(dateMatch[2]) : new Date();

      setFormData({
        name: ticket.type,
        price: ticket.price,
        quantity: ticket.available,
        currency: 'USD',
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        startTime: format(startDate, 'HH:mm'),
        endTime: format(endDate, 'HH:mm'),
        isActive: true
      });
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket?.id) return;
    
    setIsSubmitting(true);

    try {
      await updateEventTicket(eventId, ticket.id, formData);
      toast.success('Ticket updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update ticket');
      console.error('Error updating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-semibold text-gray-900">Update Ticket</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                />
              </div>
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
              {isSubmitting ? 'Updating...' : 'Update Ticket'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 