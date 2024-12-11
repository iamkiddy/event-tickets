'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Event {
  id: string;
  image: string;
  title: string;
  startDate: string;
  summary: string;
  isPublish: boolean;
}

interface EventsResponse {
  page: number;
  total: number;
  limit: number;
  data: Event[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('any');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement getEvents action
        // const response = await getEvents();
        // setEvents(response);
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString()
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/events-hero.jpg"
            alt="Events background"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Events
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Find amazing events happening around you
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  />
                </div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primaryColor text-gray-600"
                >
                  <option value="any">Any Time</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events?.data.map((event) => {
            const { month, day } = formatDate(event.startDate);
            return (
              <Link 
                key={event.id} 
                href={`/event/${event.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={event.image || '/placeholder.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 text-center">
                    <span className="text-xs font-medium text-primaryColor">{month}</span>
                    <p className="text-lg font-bold text-gray-900 -mt-1">{day}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primaryColor transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{event.summary}</p>
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-12 flex justify-center">
          {/* Add pagination component here */}
        </div>
      </div>
    </div>
  );
}
