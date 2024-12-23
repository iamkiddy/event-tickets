import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { getEventTicketPromotionById } from '@/lib/actions/events';
import { getEventTicketPromotionByIdResponse } from '@/lib/models/_events_models';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ViewPromotionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  promotionId: string;
}

const formatDateTime = (date?: string, time?: string) => {
  try {
    if (!date || !time) return '';
    const dateTime = new Date(`${date}T${time}`);
    if (isNaN(dateTime.getTime())) return '';
    return format(dateTime, 'PPP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatValue = (value: number, valueType: string, currency?: string) => {
  if (valueType === 'percentage') return `${value}%`;
  return `${currency || 'USD'} ${value.toFixed(2)}`;
};

export function ViewPromotionSheet({ isOpen, onClose, promotionId }: ViewPromotionSheetProps) {
  const [promotion, setPromotion] = useState<getEventTicketPromotionByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && promotionId) {
      setLoading(true);
      getEventTicketPromotionById(promotionId)
        .then((response) => {
          setPromotion(response);
        })
        .catch((error) => {
          console.error('Error fetching promotion:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, promotionId]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="mb-6 border-b pb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">
            Promotion Details
          </h3>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          ) : promotion ? (
            <div className="space-y-6">
              {/* Main Info Section */}
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {promotion.promotionType === 'discount' ? 'Discount' : 'Promotion Code'}
                      </label>
                      <p className="mt-1 text-lg font-semibold text-primaryColor">
                        {promotion.promotionType === 'discount' ? 'Discount' : promotion.code}
                      </p>
                    </div>
                    <Badge
                      variant={promotion.isActive ? "default" : "secondary"}
                      className={`${
                        promotion.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      } px-3 py-1 text-sm font-medium rounded-full`}
                    >
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Promotion Type
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {promotion.promotionType.charAt(0).toUpperCase() + 
                      promotion.promotionType.slice(1)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Value</label>
                  <p className="mt-1 text-base text-gray-900">
                    {formatValue(promotion.value, promotion.valueType, promotion.promotionType)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Value Type
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {promotion.valueType.charAt(0).toUpperCase() + 
                      promotion.valueType.slice(1)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Quantity
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {promotion.quantity === 0 ? 'Unlimited' : promotion.quantity}
                  </p>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Validity Period
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-base text-gray-900">
                      {formatDateTime(promotion.startDate, promotion.startTime)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      End Date & Time
                    </label>
                    <p className="text-base text-gray-900">
                      {formatDateTime(promotion.endDate, promotion.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Applied Tickets Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Applied Tickets
                </h3>
                {promotion.tickets && promotion.tickets.length > 0 ? (
                  <div className="space-y-2">
                    {promotion.tickets.map((ticketId) => (
                      <div
                        key={ticketId}
                        className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-700 
                          hover:bg-gray-100 transition-colors"
                      >
                        {ticketId}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tickets applied</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No promotion details found</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
