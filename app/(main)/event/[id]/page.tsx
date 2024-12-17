/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Tag, Share2, DollarSign, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { dummyEvent } from '@/app/(dashboard)/events/[id]/page';

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<any>(dummyEvent);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        // TODO: Add getEventById to your events actions
        // const response = await getEventById(params.id as string);
        // setEvent(response);
      } catch (error) {
        toast.error('Failed to fetch event details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={event?.image || '/placeholder.jpg'}
          alt={event?.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-white/80 mb-4">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(event?.startDate)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event?.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{event?.summary}</p>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{event?.title}</h2>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 text-sm ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            <button className="px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Get Tickets
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Event</h2>
              <div className="prose max-w-none text-gray-600">
                {event?.overview}
              </div>
            </div>

            {/* Date and Location */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <Calendar className="w-6 h-6 text-primaryColor" />
                    <span>Date and time</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{formatDate(event?.startDate)}</p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event?.startTime} - {event?.endTime}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <MapPin className="w-6 h-6 text-primaryColor" />
                    <span>Location</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{event?.address1}</p>
                    {event?.address2 && <p>{event?.address2}</p>}
                    <p>{event?.city}, {event?.state} {event?.postalCode}</p>
                    <p>{event?.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            {event?.eventAgenda && event.eventAgenda.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Schedule</h2>
                <div className="space-y-6">
                  {event.eventAgenda.map((agenda: any) => (
                    <div key={agenda.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="font-semibold text-gray-900">{agenda.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>{agenda.startTime} - {agenda.endTime}</span>
                        <span>Hosted by: {agenda.host.join(', ')}</span>
                      </div>
                      <p className="mt-2 text-gray-600">{agenda.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {event?.eventFAQ && event.eventFAQ.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">FAQ</h2>
                <div className="space-y-6">
                  {event.eventFAQ.map((faq: any) => (
                    <div key={faq.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Tickets Section */}
          <div className="lg:sticky lg:top-20 space-y-6 h-fit">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Tickets</h2>
              <div className="space-y-4">
                {event?.tickets?.map((ticket: any) => (
                  <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg hover:border-primaryColor transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.name}</h3>
                        <p className="text-sm text-gray-600">{ticket.quantity} remaining</p>
                      </div>
                      <span className="font-semibold text-lg text-primaryColor">
                        {ticket.currency}{ticket.price}
                      </span>
                    </div>
                    {ticket.discountValue > 0 && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {ticket.discountType === 'percentage' ? `${ticket.discountValue}% off` : 
                         `${ticket.currency}${ticket.discountValue} off`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 px-6 py-3 bg-primaryColor text-white rounded-lg 
                hover:bg-indigo-700 transition-colors font-medium">
                Get Tickets
              </button>

              {event?.isRefundable && (
                <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Refundable up to {event.refundDaysBefore} days before the event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}