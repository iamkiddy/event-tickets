import * as React from 'react';
import { Button } from '@/components/ui/button';
import { TicketType } from '../types';

interface TicketSelectionProps {
  tickets: TicketType[];
  onSelect: (ticketId: string, quantity: number) => void;
}

export const TicketSelection: React.FC<TicketSelectionProps> = ({
  tickets,
  onSelect,
}) => {
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [ticketId]: quantity }));
    onSelect(ticketId, quantity);
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-bold">{ticket.type}</h3>
            <p className="text-sm text-gray-600">{ticket.description}</p>
            <p className="text-lg font-semibold">${ticket.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) - 1)}
              disabled={(quantities[ticket.id] || 0) <= 0}
            >
              -
            </Button>
            <span className="w-8 text-center">{quantities[ticket.id] || 0}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(ticket.id, (quantities[ticket.id] || 0) + 1)}
              disabled={(quantities[ticket.id] || 0) >= ticket.available}
            >
              +
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}; 