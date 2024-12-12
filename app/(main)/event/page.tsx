'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Search, Filter, Clock, Tag, Globe, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Event {
  id: string;
  image: string;
  title: string;
  startDate: string;
  summary: string;
  isPublish: boolean;
  price?: string;
  location?: string;
  category?: string;
}

interface EventsResponse {
  page: number;
  total: number;
  limit: number;
  data: Event[];
}

// Mock data with more details
const mockEvents: EventsResponse = {
  page: 1,
  total: 6,
  limit: 12,
  data: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      title: 'Tech Conference 2024',
      startDate: '2024-06-15',
      summary: 'Join us for the biggest tech conference of the year',
      isPublish: true,
      price: 'From $99',
      location: 'San Francisco, CA',
      category: 'Technology'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      title: 'Tech Conference 2024',
      startDate: '2024-06-15',
      summary: 'Join us for the biggest tech conference of the year',
      isPublish: true,
      price: 'From $99',
      location: 'San Francisco, CA',
      category: 'Technology'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      title: 'Tech Conference 2024',
      startDate: '2024-06-15',
      summary: 'Join us for the biggest tech conference of the year',
      isPublish: true,
      price: 'From $99',
      location: 'San Francisco, CA',
      category: 'Technology'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      title: 'Tech Conference 2024',
      startDate: '2024-06-15',
      summary: 'Join us for the biggest tech conference of the year',
      isPublish: true,
      price: 'From $99',
      location: 'San Francisco, CA',
      category: 'Technology'
    }
    // Add more mock events...
  ]
};

type FilterKey = 'category' | 'date' | 'price' | 'type';

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    time: searchParams.get('time') || '',
    where: searchParams.get('where') || '',
    date: searchParams.get('date') || '',
    price: searchParams.get('price') || '',
    page: Number(searchParams.get('page')) || 1
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`/event?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString(),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative h-[600px] mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            alt="Events background"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <span className="inline-block px-4 py-1 bg-indigo-600/90 text-white text-sm font-medium rounded-full mb-6">
              Find Your Next Event
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 max-w-4xl leading-tight">
              Find Your Next Experience
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl leading-relaxed mb-12">
              Discover amazing events happening around you
            </p>

            {/* Enhanced Search Bar */}
            <div className="w-full max-w-4xl">
              <div className="bg-white/95 backdrop-blur-lg rounded-full shadow-xl p-3 md:p-4">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Search Input */}
                  <div className="flex-1 relative group border-r border-gray-200">
                    <div className="px-8 h-full">
                      <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
                        Search Events
                      </label>
                      <div className="flex items-center">
                        <Search className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
                        <input
                          placeholder="Search events..."
                          value={filters.search}
                          onChange={(e) => updateFilters({ search: e.target.value })}
                          className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex-1 relative group border-r border-gray-200">
                    <div className="px-8 h-full">
                      <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
                        Location
                      </label>
                      <div className="flex items-center">
                        <MapPin className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
                        <select
                          value={filters.where}
                          onChange={(e) => updateFilters({ where: e.target.value })}
                          className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0 w-full appearance-none cursor-pointer"
                        >
                          <option value="">Where to?</option>
                          <option value="nearby">Nearby</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex-1 relative group">
                    <div className="px-8 h-full">
                      <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
                        When
                      </label>
                      <div className="flex items-center">
                        <Calendar className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
                        <select
                          value={filters.date}
                          onChange={(e) => updateFilters({ date: e.target.value })}
                          className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0 w-full appearance-none cursor-pointer"
                        >
                          <option value="">Add dates</option>
                          <option value="today">Today</option>
                          <option value="tomorrow">Tomorrow</option>
                          <option value="weekend">This Weekend</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <button 
                      className="h-12 px-8 bg-gradient-to-r from-primaryColor to-indigo-700 
                        hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full 
                        font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Search className="h-4 w-4 mr-2 inline-block" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full 
                bg-white/10 hover:bg-white/20 transition-colors text-sm text-white">
                <Tag className="w-4 h-4" />
                <span>Popular Events</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full 
                bg-white/10 hover:bg-white/20 transition-colors text-sm text-white">
                <MapPin className="w-4 h-4" />
                <span>Near Me</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full 
                bg-white/10 hover:bg-white/20 transition-colors text-sm text-white">
                <Calendar className="w-4 h-4" />
                <span>This Weekend</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters - Enhanced */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4 overflow-x-auto scrollbar-hide">
            <div className="flex-1 flex items-center gap-3">
              {['Category', 'Date', 'Price', 'Type'].map((filter) => {
                const key = filter.toLowerCase() as FilterKey;
                return (
                  <select
                    key={filter}
                    value={filters[key]}
                    onChange={(e) => updateFilters({ [key]: e.target.value })}
                    className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm hover:border-primaryColor/30 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all whitespace-nowrap"
                  >
                    <option value="">{filter}</option>
                  </select>
                );
              })}
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-primaryColor transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockEvents.data.map((event) => {
            const { month, day, fullDate } = formatDate(event.startDate);
            return (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-primaryColor/20 transition-all duration-300"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {event.price && (
                    <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-sm font-medium text-gray-900">{event.price}</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                    <div className="text-center">
                      <div className="text-xs font-medium text-primaryColor">{month}</div>
                      <div className="text-lg font-bold text-gray-900 -mt-1">{day}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primaryColor transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-primaryColor" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{event.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
