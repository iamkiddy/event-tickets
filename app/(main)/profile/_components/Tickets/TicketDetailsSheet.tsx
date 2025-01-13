'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar, Clock,  Ticket, CheckCircle, XCircle, CreditCard, Eye } from 'lucide-react';
import { OrderData, OrderDataById } from '@/lib/models/_orders_models';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getOrdersTicketById } from '@/lib/actions/orders';
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

interface TicketDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: OrderData | null;
}

export function TicketDetailsSheet({ isOpen, onClose, ticket }: TicketDetailsSheetProps) {
  const [detailedTicket, setDetailedTicket] = useState<OrderDataById | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticket?.id || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getOrdersTicketById(ticket.id);
        setDetailedTicket(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticket?.id, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white/95 backdrop-blur-sm">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primaryColor to-indigo-600 bg-clip-text text-transparent">
            Ticket Details
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="bg-red-50 rounded-full p-3 mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </motion.div>
          ) : detailedTicket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Event Image and Basic Info */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
                <Image
                  src={detailedTicket.eventImage}
                  alt={detailedTicket.event}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white">{detailedTicket.event}</h3>
                  <div className="text-white/80 text-sm">
                    <span>Order #{detailedTicket.orderCode}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className={`p-4 rounded-xl flex items-center justify-between ${
                detailedTicket.isPaid 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-yellow-50 border border-yellow-100'
              }`}>
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-5 h-5 ${
                    detailedTicket.isPaid ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      detailedTicket.isPaid ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {detailedTicket.isPaid ? 'Payment Completed' : 'Payment Pending'}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Total: {detailedTicket.currency} {detailedTicket.total.toFixed(2)}</span>
                      {detailedTicket.total !== detailedTicket.finalTotal && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 font-medium">
                            Final: {detailedTicket.currency} {detailedTicket.finalTotal.toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {detailedTicket.isRefunded && (
                  <div className="px-3 py-1 bg-red-50 rounded-full">
                    <span className="text-xs font-medium text-red-600">Refunded</span>
                  </div>
                )}
              </div>

              {/* Event Date and Time */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Calendar className="w-4 h-4 text-primaryColor" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Schedule</p>
                    <p className="font-medium">
                      {format(new Date(`${detailedTicket.eventDate} ${detailedTicket.eventTime}`), 
                        'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(`${detailedTicket.eventDate} ${detailedTicket.eventTime}`), 'h:mm a')} 
                      {' - '}
                      {format(new Date(`${detailedTicket.eventDate} ${detailedTicket.eventEndTime}`), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Your Tickets</h4>
                {detailedTicket.tickets.map((ticketItem) => (
                  <motion.div
                    key={ticketItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            ticketItem.isUsed ? 'bg-green-50' : 'bg-indigo-50'
                          }`}>
                            <Ticket className={`w-5 h-5 ${
                              ticketItem.isUsed ? 'text-green-600' : 'text-primaryColor'
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{ticketItem.ticketName}</p>
                            <p className="text-sm text-gray-500">#{ticketItem.ticketNumber}</p>
                            <p className="text-sm text-gray-500">
                              Original Price: {detailedTicket.currency} {ticketItem.ticketPrice.toFixed(2)}
                            </p>
                            {ticketItem.isUsed ? (
                              <div className="flex items-center gap-1.5 text-xs text-green-600">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Used on {format(new Date(ticketItem.isUsedAt), 'PPp')}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Not used yet</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {detailedTicket.currency} {ticketItem.paidAmount.toFixed(2)}
                          </p>
                          {ticketItem.discountAmount > 0 && (
                            <p className="text-xs font-medium text-green-600">
                              {ticketItem.discountType === 'percentage' 
                                ? `${ticketItem.discountAmount}% off`
                                : `${detailedTicket.currency} ${ticketItem.discountAmount} off`}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => window.open(`/ticket/${ticketItem.id}`, '_blank')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 
                          bg-indigo-50 rounded-lg text-sm font-medium text-primaryColor
                          hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Ticket Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* QR Code */}
              {detailedTicket.qrCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <p className="text-sm text-gray-600">Scan QR code at the event</p>
                  <div className="p-4 bg-white rounded-2xl shadow-lg">
                    <img 
                      src={detailedTicket.qrCode} 
                      alt="Ticket QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
} 