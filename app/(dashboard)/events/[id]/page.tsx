'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Users, DollarSign, Share2, Tag, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export const dummyEvent = {
  id: "1",
  title: "Tech Conference 2024",
  summary: "Join us for the biggest tech conference of the year",
  overview: "Experience three days of cutting-edge technology, inspiring speakers, and networking opportunities. This conference brings together industry leaders, innovators, and developers from around the world.",
  startDate: "2024-06-15",
  startTime: "09:00",
  endDate: "2024-06-17",
  endTime: "18:00",
  totalCapacity: 500,
  soldOut: 350,
  totalGross: 175000,
  status: 'published' as const,
  tags: ["Technology", "Innovation", "Networking", "AI", "Web3"],
  locationType: "venue",
  address1: "Convention Center",
  address2: "Suite 100",
  city: "San Francisco",
  state: "CA",
  country: "United States",
  postalCode: "94105",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
  eventFAQ: [
    {
      id: "1",
      question: "What's included in the ticket price?",
      answer: "Full access to all keynotes, workshops, networking events, and meals during the conference."
    },
    {
      id: "2",
      question: "Is there a dress code?",
      answer: "Business casual is recommended for all conference sessions and events."
    }
  ],
  eventAgenda: [
    {
      id: "1",
      title: "Opening Keynote",
      description: "Welcome address and future of technology keynote speech",
      startTime: "09:00",
      endTime: "10:30",
      host: ["Sarah Johnson", "Mike Chen"]
    },
    {
      id: "2",
      title: "AI in Enterprise",
      description: "Panel discussion on implementing AI in enterprise environments",
      startTime: "11:00",
      endTime: "12:30",
      host: ["Dr. Emily White", "Alex Kumar"]
    }
  ]
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const [event] = useState(dummyEvent);
  const [isLoading, setIsLoading] = useState(false);

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
      } catch  {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor your event</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/events/${params.id}/edit`)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            Edit Event
          </button>
          <button className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-indigo-700">
            View Public Page
          </button>
        </div>
      </div>

      {/* Event Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
              {event?.image ? (
                <Image
                  src={event.image}
                  alt={event.title || 'Event'}
                  fill
                  priority
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image Status Badge */}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded-full">
                <span className="text-xs font-medium text-white">
                  {event?.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            {/* Image Info */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Event Image</h3>
                <p className="text-xs text-gray-500 mt-1">
                  This image will be used as the cover image for your event
                </p>
              </div>
              <button
                onClick={() => router.push(`/events/${params.id}/upload`)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                  border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{event?.title}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">{event?.summary}</p>
              <div className="flex flex-wrap gap-2">
                {event?.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    <Tag className="w-4 h-4 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date and Time</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Start</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{formatDate(event?.startDate || '')}</span>
                    <Clock className="w-5 h-5 text-gray-400 ml-2" />
                    <span>{event?.startTime}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>{formatDate(event?.endDate || '')}</span>
                    <Clock className="w-5 h-5 text-gray-400 ml-2" />
                    <span>{event?.endTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {event?.locationType}
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">{event?.address1}</p>
                {event?.address2 && <p className="text-gray-600">{event?.address2}</p>}
                <p className="text-gray-600">
                  {event?.city}, {event?.state} {event?.postalCode}
                </p>
                <p className="text-gray-600">{event?.country}</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About this event</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{event?.overview}</p>
          </div>

          {/* Agenda */}
          {event?.eventAgenda && event.eventAgenda.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Agenda</h3>
              <div className="space-y-6">
                {event.eventAgenda.map((agenda) => (
                  <div key={agenda.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900">{agenda.title}</h4>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {event.eventFAQ.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Total Capacity</span>
                </div>
                <span className="font-semibold">{event?.totalCapacity}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Sold</span>
                </div>
                <span className="font-semibold">{event?.soldOut || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Total Gross</span>
                </div>
                <span className="font-semibold">${event?.totalGross || 0}</span>
              </div>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Share2 className="w-5 h-5" />
              <span>Share this event</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}