import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { updateEventTicket } from '@/lib/actions/events';
import { toast } from 'sonner';
import { TicketType } from '@/app/(main)/codepass/types';
import { UpdateEventTicket } from '@/lib/models/_events_models';
import InputField from '@/components/custom/InputField';
import { SelectItem } from '@/components/ui/select';
import SelectField from '@/components/custom/SelectField';
import { currency } from '@/lib/constants';

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
    currency: 'GHC',
    isActive: true
  });

  useEffect(() => {
    if (ticket) {

      setFormData({
        name: ticket.type,
        price: ticket.price,
        quantity: ticket.available,
        currency: 'GHC',
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
            <InputField
              label="Title"
              value={formData.name}
              setValue={(value) => setFormData({ ...formData, name: value })}
              required
              disabled={isSubmitting}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Price"
                type="number"
                value={formData.price.toString()}
                setValue={(value) => setFormData({ ...formData, price: Number(value) })}
                required
                disabled={isSubmitting}
              />
              <InputField
                label="Quantity"
                type="number"
                value={formData.quantity.toString()}
                setValue={(value) => setFormData({ ...formData, quantity: Number(value) })}
                required
                disabled={isSubmitting}
              />
            </div>
            <SelectField
              label="Currency"
              value={formData.currency}
              setValue={(value) => setFormData({ ...formData, currency: value })}
              required
              disabled={isSubmitting}
            >
              {currency.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectField>
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