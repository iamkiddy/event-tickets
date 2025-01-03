"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Minus, Plus, Ticket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getTicketsDiscount, getTicketsCheckout } from "@/lib/actions/orders";
import { toast } from "sonner";
import { TicketCheckoutRequest } from "@/lib/models/_orders_models";

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
    id?: string;
  }>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const calculateDiscountedPrice = (price: number): number => {
    if (!discount.value || !discount.type) return price;
    
    if (discount.type === 'percentage') {
      return price * (1 - discount.value / 100);
    } else {
      return Math.max(0, price - discount.value);
    }
  };

  const updateCount = (ticketId: string, increment: boolean) => {
    const currentCount = ticketCounts[ticketId] || 0;
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    let newCount;
    if (increment) {
      // Don't exceed available quantity
      newCount = Math.min(currentCount + 1, ticket.quantity);
    } else {
      // Don't go below 0
      newCount = Math.max(currentCount - 1, 0);
    }

    setTicketCounts({
      ...ticketCounts,
      [ticketId]: newCount
    });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Prepare the ticket items array - ensure it's not empty
      const ticketItems = tickets
        .filter(ticket => (ticketCounts[ticket.id] || 0) > 0)
        .map(ticket => ({
          ticket: ticket.id,
          quantity: ticketCounts[ticket.id]
        }));

      if (ticketItems.length === 0) {
        toast.error('Please select at least one ticket');
        return;
      }

      // Prepare the checkout request according to API schema
      const checkoutRequest: TicketCheckoutRequest = {
        event: eventId,
        tickets: ticketItems,
        ...(discount.id ? { coupon: discount.id } : {}) // Only include coupon if it exists
      };

      // Call the checkout API
      const response = await getTicketsCheckout(checkoutRequest);
      
      if (response.orderCode) {
        // Show success message with order code
        toast.success(`Order initiated! Order Code: ${response.orderCode}`);
        
        // Construct URL with ticket parameters
        const ticketParams = tickets
          .filter(ticket => ticketCounts[ticket.id] > 0)
          .map(ticket => `${ticket.id}=${ticketCounts[ticket.id]}`)
          .join('&');
        
        // Navigate to checkout page with parameters
        router.push(`/event/${eventId}/checkout?${ticketParams}`);
      } else {
        throw new Error('No order code received');
      }
    } catch (error: unknown) {
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : 'Failed to process checkout. Please try again.';
      toast.error(errorMessage);
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
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
        id: response.id,
        type: response.discountType === 'amount' ? 'fixed' : 'percentage',
        value: response.discountAmount,
        message: 'Coupon applied successfully!'
      });
      
      toast.success('Coupon applied successfully!');
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
    let hasTickets = false;
    
    tickets.forEach(ticket => {
      const count = ticketCounts[ticket.id] || 0;
      if (count > 0) {
        hasTickets = true;
        const originalPrice = ticket.price;
        const discountedPrice = calculateDiscountedPrice(originalPrice);
        subtotal += count * discountedPrice;
      }
    });
    
    return { subtotal, hasTickets }; 
  };

  const { subtotal, hasTickets } = calculateTotal();
  const fees = subtotal * 0.1; // 10% service fee

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
                  
                  return (
                    <div key={ticket.id} className="flex justify-between">
                      <span className="text-gray-600">{ticket.name} x {count}</span>
                      <span className="font-medium">{ticket.currency} {(count * discountedPrice).toFixed(2)}</span>
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
                
                {hasTickets && (
                  <>
                    <div className="flex justify-between text-gray-600 pt-2 border-t">
                      <span>Service Fee</span>
                      <span>GHS {fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>GHS {(subtotal + fees).toFixed(2)}</span>
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
                    {tickets.map(ticket => {
                      const count = ticketCounts[ticket.id] || 0;
                      if (count === 0) return null;
                      
                      const originalPrice = ticket.price;
                      const discountedPrice = calculateDiscountedPrice(originalPrice);
                      
                      return (
                        <div key={ticket.id} className="flex justify-between">
                          <span className="text-gray-600">{ticket.name} x {count}</span>
                          <span className="font-medium">{ticket.currency} {(count * discountedPrice).toFixed(2)}</span>
                        </div>
                      );
                    })}
                    
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
                          <span>GHS {(subtotal + fees).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {hasTickets ? (
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-primaryColor text-white font-medium rounded-xl py-4 
                      hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] 
                      shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      "Processing..."
                    ) : (
                      `Proceed to Checkout (${tickets[0]?.currency} ${(subtotal + fees).toFixed(2)})`
                    )}
                  </button>
                ) : (
                  <button 
                    className="w-full bg-gray-100 text-gray-400 font-medium rounded-xl py-4 cursor-not-allowed"
                    disabled
                  >
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