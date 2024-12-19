import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { createEventTicket } from '@/lib/actions/events';
import { toast } from 'sonner';
import InputField from '@/components/custom/InputField';
import SelectField from '@/components/custom/SelectField';
import { SelectItem } from '@/components/ui/select';
import { currency } from '@/lib/constants';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

export function CreateTicketModal({ isOpen, onClose, eventId, onSuccess }: CreateTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    quantity: 0,
    currency: 'GHC',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createEventTicket(eventId, formData);
      toast.success('Ticket created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create ticket');
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[95%] p-4 sm:p-6 sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-4 sm:mb-6">
          <SheetTitle className="text-xl sm:text-2xl font-semibold text-gray-900">Create New Ticket</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            <InputField
              label="Title"
              value={formData.name}
              setValue={(value) => setFormData({ ...formData, name: value })}
              required
              disabled={isSubmitting}
              className="w-full"
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Price"
                type="number"
                value={formData.price.toString()}
                setValue={(value) => setFormData({ ...formData, price: Number(value) })}
                required
                disabled={isSubmitting}
                className="w-full"
              />
              <InputField
                label="Quantity"
                type="number"
                value={formData.quantity.toString()}
                setValue={(value) => setFormData({ ...formData, quantity: Number(value) })}
                required
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <SelectField
              label="Currency"
              value={formData.currency}
              setValue={(value) => setFormData({ ...formData, currency: value })}
              required
              disabled={isSubmitting}
              className="w-full"
            >
              {currency.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {curr}
                </SelectItem>
              ))}
            </SelectField>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end  sm:mt-10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="w-full sm:w-auto px-4 mt-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto mt-3 px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}