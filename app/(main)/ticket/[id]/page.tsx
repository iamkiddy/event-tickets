'use client';

import { Calendar, Clock, Ticket, CheckCircle, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { getOrdersTicketById } from '@/lib/actions/orders';
import { OrderDataById } from '@/lib/models/_orders_models';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TicketLoader from '@/app/(main)/profile/_components/Tickets/TicketLoader';
interface TicketPageProps {
  params: {
    id: string;
  };
}

export default function TicketPage({ params }: TicketPageProps) {
  const [ticket, setTicket] = useState<OrderDataById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrdersTicketById(params.id);
        setTicket(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [params.id]);

  if (loading) return <TicketLoader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 rounded-full p-3 mb-4">
          <span className="text-red-500 font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Event Image and Basic Info */}
        <div className="relative w-full h-64 rounded-2xl overflow-hidden">
          <Image
            src={ticket.eventImage}
            alt={ticket.event}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl font-semibold text-white">{ticket.event}</h1>
            <div className="text-white/80 text-sm mt-2">
              <span>Order #{ticket.orderCode}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Event Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Payment Status */}
            <div className={`p-4 rounded-xl flex items-center justify-between ${
              ticket.isPaid ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'
            }`}>
              <div className="flex items-center gap-3">
                <CreditCard className={`w-5 h-5 ${ticket.isPaid ? 'text-green-600' : 'text-yellow-600'}`} />
                <div>
                  <p className={`font-medium ${ticket.isPaid ? 'text-green-800' : 'text-yellow-800'}`}>
                    {ticket.isPaid ? 'Payment Completed' : 'Payment Pending'}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Total: {ticket.currency} {ticket.total.toFixed(2)}</span>
                    {ticket.total !== ticket.finalTotal && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-600 font-medium">
                          Final: {ticket.currency} {ticket.finalTotal.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {ticket.isRefunded && (
                <div className="px-3 py-1 bg-red-50 rounded-full">
                  <span className="text-xs font-medium text-red-600">Refunded</span>
                </div>
              )}
            </div>

            {/* Event Schedule */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Calendar className="w-4 h-4 text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Schedule</p>
                  <p className="font-medium">
                    {format(new Date(`${ticket.eventDate} ${ticket.eventTime}`), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(`${ticket.eventDate} ${ticket.eventTime}`), 'h:mm a')} 
                    {' - '}
                    {format(new Date(`${ticket.eventDate} ${ticket.eventEndTime}`), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Your Tickets</h2>
              {ticket.tickets.map((ticketItem) => (
                <div
                  key={ticketItem.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${ticketItem.isUsed ? 'bg-green-50' : 'bg-indigo-50'}`}>
                        <Ticket className={`w-5 h-5 ${ticketItem.isUsed ? 'text-green-600' : 'text-primaryColor'}`} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{ticketItem.ticketName}</p>
                        <p className="text-sm text-gray-500">#{ticketItem.ticketNumber}</p>
                        <p className="text-sm text-gray-500">
                          Original Price: {ticket.currency} {ticketItem.ticketPrice.toFixed(2)}
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
                        {ticket.currency} {ticketItem.paidAmount.toFixed(2)}
                      </p>
                      {ticketItem.discountAmount > 0 && (
                        <p className="text-xs font-medium text-green-600">
                          {ticketItem.discountType === 'percentage' 
                            ? `${ticketItem.discountAmount}% off`
                            : `${ticket.currency} ${ticketItem.discountAmount} off`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-4">
              {ticket.qrCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border border-gray-100 p-6 text-center"
                >
                  <p className="text-sm text-gray-600 mb-4">Scan QR code at the event</p>
                  <div className="bg-white rounded-xl shadow-lg p-4 inline-block">
                    <img 
                      src={ticket.qrCode} 
                      alt="Ticket QR Code"
                      className="w-full h-auto"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
