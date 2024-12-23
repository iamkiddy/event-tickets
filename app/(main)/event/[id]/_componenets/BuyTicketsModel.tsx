"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Minus, Plus, Ticket } from "lucide-react";
import { useState } from "react";

interface BuyTicketsModelProps {
  eventTitle: string;
  totalAmount: number;
  serviceFee: number;
  eventImage?: string;
}

const BuyTicketsModel = ({ eventTitle, totalAmount, serviceFee, eventImage }: BuyTicketsModelProps) => {
  const [generalCount, setGeneralCount] = useState(0);
  const [vipCount, setVipCount] = useState(0);

  const updateCount = (type: 'general' | 'vip', increment: boolean) => {
    if (type === 'general') {
      setGeneralCount(prev => increment ? Math.min(prev + 1, 5) : Math.max(prev - 1, 0));
    } else {
      setVipCount(prev => increment ? Math.min(prev + 1, 5) : Math.max(prev - 1, 0));
    }
  };

  const total = (generalCount * 30) + (vipCount * 50);
  const fees = total * 0.1; // 10% service fee

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full bg-primaryColor text-white font-medium rounded-xl py-4 hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-200 mt-5">
          Get Tickets
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[1000px] bg-white p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="flex">
          {/* Left Content */}
          <div className="flex-1 p-6">
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{eventTitle}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
              <div className="flex items-center gap-3 pb-4 border-b">
                <Input 
                  placeholder="Enter promo code" 
                  className="flex-1 text-sm h-9"
                />
                <button className="h-9 px-4 text-sm font-medium text-primaryColor hover:bg-primaryColor/5 rounded-lg transition-colors">
                  Apply
                </button>
              </div>

              {/* Tickets Section */}
              <div className="space-y-3">
                {/* General Admission */}
                <div className="group relative bg-white rounded-xl border border-gray-200 p-4 transition-all hover:border-primaryColor hover:shadow-md">
                  <div className="absolute right-3 top-3">
                    <Ticket className="w-5 h-5 text-primaryColor opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-gray-900">General Admission</h4>
                        <p className="text-base font-bold text-primaryColor">GHS 30</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Regular seating • 20 remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button 
                      onClick={() => updateCount('general', false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                      disabled={generalCount === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{generalCount}</span>
                    <button 
                      onClick={() => updateCount('general', true)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                      disabled={generalCount === 5}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* VIP Access */}
                <div className="group relative bg-white rounded-xl border border-gray-200 p-4 transition-all hover:border-primaryColor hover:shadow-md">
                  <div className="absolute right-3 top-3">
                    <Ticket className="w-5 h-5 text-primaryColor opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-gray-900">VIP Access</h4>
                          <span className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-primaryColor rounded-full">BEST VALUE</span>
                        </div>
                        <p className="text-base font-bold text-primaryColor">GHS 50</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Premium seating + Exclusive perks • 10 remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button 
                      onClick={() => updateCount('vip', false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                      disabled={vipCount === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{vipCount}</span>
                    <button 
                      onClick={() => updateCount('vip', true)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-primaryColor/10 text-gray-600 hover:text-primaryColor transition-colors"
                      disabled={vipCount === 5}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal ({generalCount + vipCount} tickets)</span>
                    <span className="font-medium">GHS {total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-medium">GHS {fees}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primaryColor">GHS {total + fees}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end items-center gap-3 pt-3">
                <AlertDialogCancel className="text-gray-600 font-medium hover:text-gray-900 hover:bg-transparent px-4 py-2 text-sm">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-primaryColor hover:bg-indigo-700 text-white px-6 py-2 text-sm font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  Checkout
                </AlertDialogAction>
              </div>
            </div>
          </div>

          {/* Right Image */}
          {eventImage && (
            <div className="w-[350px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
              <img 
                src={eventImage} 
                alt={eventTitle} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BuyTicketsModel;