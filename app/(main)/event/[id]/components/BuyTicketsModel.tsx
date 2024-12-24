"use client";

import { Input } from "@/components/ui/input";
import { Calendar, Clock, Minus, Plus, Ticket, X } from "lucide-react";

interface BuyTicketsModelProps {
  eventTitle: string;
  eventImage?: string;
  onClose: () => void;
  ticketCounts: {
    general: number;
    vip: number;
  };
  setTicketCounts: (counts: { general: number; vip: number }) => void;
  onProceedToCheckout: () => void;
}

export function BuyTicketsModel({ 
  eventTitle, 
  eventImage,
  onClose,
  ticketCounts,
  setTicketCounts,
  onProceedToCheckout
}: BuyTicketsModelProps) {
  const updateCount = (type: 'general' | 'vip', increment: boolean) => {
    setTicketCounts({
      ...ticketCounts,
      [type]: increment ? ticketCounts[type] + 1 : Math.max(ticketCounts[type] - 1, 0)
    });
  };

  const total = (ticketCounts.general * 30) + (ticketCounts.vip * 50);
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

              {/* Promo Code */}
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Enter promo code" 
                  className="flex-1 text-sm h-10"
                />
                <button className="h-10 px-6 text-sm font-medium text-primaryColor hover:bg-primaryColor/5 
                  rounded-lg transition-colors border border-primaryColor">
                  Apply
                </button>
              </div>

              {/* Tickets Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Available Tickets</h4>
                
                {/* General Admission */}
                <div className="group bg-white rounded-xl border border-gray-200 p-5 transition-all 
                  hover:border-primaryColor hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primaryColor" />
                        <div>
                          <h5 className="text-base font-semibold text-gray-900">General Admission</h5>
                          <p className="text-sm text-gray-600">Regular seating • 20 remaining</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Access to all general areas and standard amenities
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-primaryColor">GHS 30</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateCount('general', false)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                            hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                          disabled={ticketCounts.general === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-lg">{ticketCounts.general}</span>
                        <button 
                          onClick={() => updateCount('general', true)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                            hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIP Admission */}
                <div className="group bg-white rounded-xl border border-gray-200 p-5 transition-all 
                  hover:border-primaryColor hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-primaryColor" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-semibold text-gray-900">VIP Admission</h5>
                            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-primaryColor rounded-full">
                              BEST VALUE
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Premium seating • 10 remaining</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Premium seating, exclusive access, and complimentary refreshments
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-primaryColor">GHS 50</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateCount('vip', false)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                            hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                          disabled={ticketCounts.vip === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-lg">{ticketCounts.vip}</span>
                        <button 
                          onClick={() => updateCount('vip', true)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 
                            hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                    onClick={onProceedToCheckout}
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