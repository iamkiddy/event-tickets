"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Minus, Plus, Ticket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTicketsDiscount } from "@/lib/actions/orders";
import { toast } from "sonner";

interface BuyTicketsModelProps {
  eventId: string;
  eventTitle: string;
  eventImage?: string;
  tickets: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    discountValue?: number;
    discountType?: string;
  }>;
  onClose: () => void;
  ticketCounts: Record<string, number>;
  setTicketCounts: (counts: Record<string, number>) => void;
}

export function BuyTicketsModel({ 
  eventId,
  eventTitle, 
  eventImage,
  tickets,
  onClose,
  ticketCounts,
  setTicketCounts
}: BuyTicketsModelProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [discount, setDiscount] = useState<{
    type?: 'percentage' | 'fixed';
    value?: number;
    message?: string;
  }>({});

  const calculateDiscountedPrice = (price: number) => {
    if (!discount.value || !discount.type) return price;
    
    if (discount.type === 'percentage') {
      return price * (1 - discount.value / 100);
    } else {
      return Math.max(0, price - discount.value);
    }
  };

  const updateCount = (type: string, increment: boolean) => {
    setTicketCounts({
      ...ticketCounts,
      [type]: increment ? ticketCounts[type] + 1 : Math.max(ticketCounts[type] - 1, 0)
    });
  };

  const handleCheckout = () => {
    const ticketParams = tickets.map(ticket => 
      `${ticket.id}=${ticketCounts[ticket.id] || 0}`
    ).join('&');
    
    router.push(`/event/${eventId}/checkout?${ticketParams}`);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setIsApplying(true);
      const response = await getTicketsDiscount({ coupon: couponCode.trim() });
      
      setDiscount({
        type: response.discountType,
        value: response.discountValue,
        message: response.message
      });
      
      toast.success(response.message);
    } catch (error: unknown) {
      console.error(error);
      toast.error('Invalid coupon code');
      setDiscount({});
    } finally {
      setIsApplying(false);
    }
  };

  // Calculate totals with discounts
  const calculateTotal = () => {
    let subtotal = 0;
    tickets.forEach(ticket => {
      const count = ticketCounts[ticket.id] || 0;
      const originalPrice = ticket.price;
      const discountedPrice = calculateDiscountedPrice(originalPrice);
      subtotal += count * discountedPrice;
    });
    return subtotal;
  };

  const total = calculateTotal();
  const fees = total * 0.1; // 10% service fee

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-[95vw] md:max-w-[800px] lg:max-w-[1000px] w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col lg:flex-row h-[90vh] lg:h-[600px]">
          {/* Left Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Event Image for Mobile */}
            {eventImage && (
              <div className="relative h-48 lg:hidden">
                <img 
                  src={eventImage} 
                  alt={eventTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}

            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Select Tickets</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">{eventTitle}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primaryColor" />
                    <span>Sunday, January 5, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primaryColor" />
                    <span>10:00 PM GMT</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Enter coupon code" 
                  className="flex-1 text-sm h-10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={isApplying}
                  className="h-10 px-6 text-sm font-medium text-primaryColor hover:bg-primaryColor/5 
                    rounded-lg transition-colors border border-primaryColor disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {/* Tickets Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Available Tickets</h4>
                
                {tickets.map((ticket) => {
                  const originalPrice = ticket.price;
                  const discountedPrice = calculateDiscountedPrice(originalPrice);
                  const hasDiscount = discountedPrice < originalPrice;

                  return (
                    <div 
                      key={ticket.id}
                      className="group bg-white rounded-xl border border-gray-200 p-5 
                        transition-all hover:border-primaryColor hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-primaryColor" />
                            <div>
                              <h5 className="text-base font-semibold text-gray-900">
                                {ticket.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {ticket.quantity} remaining
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            {hasDiscount && (
                              <p className="text-sm line-through text-gray-400">
                                {ticket.currency} {originalPrice}
                              </p>
                            )}
                            <p className="text-lg font-bold text-primaryColor">
                              {ticket.currency} {discountedPrice.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateCount(ticket.id, false)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                                hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                              disabled={ticketCounts[ticket.id] === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-lg">
                              {ticketCounts[ticket.id] || 0}
                            </span>
                            <button 
                              onClick={() => updateCount(ticket.id, true)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                                hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                              disabled={ticket.quantity > 0 && ticketCounts[ticket.id] >= ticket.quantity}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 text-sm">
                {tickets.map(ticket => {
                  const count = ticketCounts[ticket.id] || 0;
                  if (count === 0) return null;
                  
                  const originalPrice = ticket.price;
                  const discountedPrice = calculateDiscountedPrice(originalPrice);
                  const hasDiscount = discountedPrice < originalPrice;
                  
                  return (
                    <div key={ticket.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {ticket.name} × {count}
                      </span>
                      <div className="text-right">
                        {hasDiscount && (
                          <span className="line-through text-gray-400 mr-2">
                            {ticket.currency} {(count * originalPrice).toFixed(2)}
                          </span>
                        )}
                        <span className="font-medium">
                          {ticket.currency} {(count * discountedPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {discount.value && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied</span>
                    <span>
                      {discount.type === 'percentage' ? `-${discount.value}%` : 
                        `${tickets[0]?.currency} -${discount.value}`}
                    </span>
                  </div>
                )}
                
                {total > 0 && (
                  <>
                    <div className="flex justify-between text-gray-600 pt-2 border-t">
                      <span>Service Fee</span>
                      <span>GHS {fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>GHS {(total + fees).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Event Image and Order Summary */}
          <div className="w-full lg:w-[400px] flex flex-col">
            {/* Event Image for Desktop */}
            {eventImage && (
              <div className="hidden lg:block relative h-[200px]">
                <img 
                  src={eventImage} 
                  alt={eventTitle}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}

            {/* Order Summary */}
            <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50">
              <div className="sticky top-0 p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-3 text-sm">
                    {ticketCounts.general > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">General Admission x {ticketCounts.general}</span>
                        <span className="font-medium">GHS {ticketCounts.general * 30}</span>
                      </div>
                    )}
                    {ticketCounts.vip > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">VIP Admission x {ticketCounts.vip}</span>
                        <span className="font-medium">GHS {ticketCounts.vip * 50}</span>
                      </div>
                    )}
                    {(ticketCounts.general > 0 || ticketCounts.vip > 0) && (
                      <>
                        <div className="flex justify-between text-gray-600 pt-2 border-t">
                          <span>Service Fee</span>
                          <span>GHS {fees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                          <span>Total</span>
                          <span>GHS {(total + fees).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {(ticketCounts.general > 0 || ticketCounts.vip > 0) ? (
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primaryColor text-white font-medium rounded-xl py-4 
                      hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                      shadow-lg hover:shadow-indigo-200"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button className="w-full bg-gray-100 text-gray-400 font-medium rounded-xl py-4 cursor-not-allowed">
                    Select Tickets to Continue
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyTicketsModel;