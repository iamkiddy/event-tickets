/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Search, Filter, Clock, Tag, Globe, ArrowRight, DollarSign, Layout, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { navLinks } from "@/app/(main)/codepass/EventickPage";
import { useAuth } from '@/lib/context/AuthContext';
import { NavLink } from '../codepass/components/NavLink';
import { LoginAlert } from '@/app/auth/_components/loginAlert';
import { AuthenticatedNav } from '@/components/ui/authNavbar';
import { getAllMainEvents, GetMainEventsParams } from '@/lib/actions/mainEvent';
import { EventListItem, EventListResponse } from '@/lib/models/_main_event_models';
import parser from 'html-react-parser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getUtilsCategories, getUtilsEventTypes } from '@/lib/actions/events';
import { UtilsCategoriesResponse, UtilsEventTypesResponse } from '@/lib/models/_events_models';
type FilterKey = 'category' | 'date' | 'type';

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [events, setEvents] = useState<EventListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<UtilsCategoriesResponse[]>([]);
  const [eventTypes, setEventTypes] = useState<UtilsEventTypesResponse[]>([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    time: searchParams.get('time') || '',
    where: searchParams.get('where') || '',
    date: searchParams.get('date') || '',
    page: Number(searchParams.get('page')) || 1
  });

  const fetchEvents = async () => { 
    try {
      setIsLoading(true);
      const params: GetMainEventsParams = {
        search: filters.search || undefined,
        category: filters.category || undefined,
        eventType: filters.type || undefined,
        date: filters.date || undefined,
        where: filters.where || undefined,
        page: filters.page,
        limit: 12
      };

      const response = await getAllMainEvents(params);
      setEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = () => {
    fetchEvents();
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`/event?${params.toString()}`, { scroll: false });
    
    // Fetch new events with updated filters
    fetchEvents();
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clearFilters = () => {
    // Reset all filters to their default values
    const defaultFilters = {
      search: '',
      category: '',
      type: '',
      time: '',
      where: '',
      date: '',
      page: 1
    };
    
    // Update the state and URL
    setFilters(defaultFilters);
    
    // Clear URL parameters
    const params = new URLSearchParams();
    router.push('/event', { scroll: false });
    
    // Fetch events with cleared filters
    fetchEvents();
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      updateFilters({ date: formattedDate });
    } else {
      updateFilters({ date: '' });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getUtilsCategories();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await getUtilsEventTypes();
        setEventTypes(Array.isArray(response) ? response : [response]);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    fetchEventTypes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                CodePass
              </div>
              
              <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.label}
                    {...link} 
                    isScrolled={isScrolled}
                    onLoginClick={() => setShowLoginDialog(true)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <NavLink 
                  label="Create Event"
                  isCreate={true}
                  isScrolled={isScrolled}
                />
                <NavLink 
                  label="Login"
                  isButton={true}
                  isScrolled={isScrolled}
                  onLoginClick={() => setShowLoginDialog(true)}
                />
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <AuthenticatedNav isScrolled={isScrolled} showSearchInNav={false} />
      )}
      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />
      {/* Hero Section with Search */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] mb-8 sm:mb-16">
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
          <div className="h-full flex flex-col items-center justify-center pt-24 sm:pt-20">
            <span className="hidden sm:inline-block px-3 sm:px-4 py-1 bg-indigo-600/90 text-white text-xs sm:text-sm font-medium rounded-full mb-4 sm:mb-6">
              Find Your Next Event
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white text-center mb-4 sm:mb-8 max-w-4xl leading-tight mt-8 sm:mt-0">
              Find Your Next Experience
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 text-center max-w-2xl leading-relaxed mb-8 sm:mb-12 px-4">
              Discover amazing events happening around you
            </p>

            {/* Enhanced Search Bar - Responsive */}
            <div className="w-full max-w-4xl px-4 sm:px-6">
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-full shadow-xl">
                {/* Mobile Layout */}
                <div className="block lg:hidden p-4 space-y-4">
                  {/* Search Input */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      placeholder="Search events..."
                      value={filters.search}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-transparent text-sm focus:outline-none focus:ring-0"
                    />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={filters.where}
                      onChange={(e) => updateFilters({ where: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-full text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer bg-transparent"
                    >
                      <option value="">Where to?</option>
                      <option value="nearby">Nearby</option>
                      <option value="online">Online</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <DatePicker
                      selected={filters.date ? new Date(filters.date) : null}
                      onChange={handleDateChange}
                      dateFormat="MMM dd, yyyy"
                      placeholderText="Select date"
                      className="w-full pl-10 pr-4 py-3 rounded-full text-sm focus:outline-none focus:ring-0 cursor-pointer bg-transparent"
                    />
                  </div>

                  {/* Search Button */}
                  <button 
                    onClick={handleSearch}
                    className="w-full py-3 bg-gradient-to-r from-primaryColor to-indigo-700 
                      hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full 
                      font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Search className="h-4 w-4 mr-2 inline-block" />
                    Search
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block p-3 md:p-4">
                  <div className="flex gap-3">
                    {/* Search Input */}
                    <div className="flex-1 relative group border-r border-gray-200">
                      <div className="px-6">
                        <label className="block text-xs font-semibold text-gray-800 mb-1">
                          Search Events
                        </label>
                        <div className="flex items-center">
                          <Search className="text-primaryColor h-4 w-4" />
                          <input
                            placeholder="Search events..."
                            value={filters.search}
                            onChange={(e) => updateFilters({ search: e.target.value })}
                            className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex-1 relative group border-r border-gray-200">
                      <div className="px-6">
                        <label className="block text-xs font-semibold text-gray-800 mb-1">
                          Location
                        </label>
                        <div className="flex items-center">
                          <MapPin className="text-primaryColor h-4 w-4" />
                          <select
                            value={filters.where}
                            onChange={(e) => updateFilters({ where: e.target.value })}
                            className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Where to?</option>
                            <option value="nearby">Nearby</option>
                            <option value="online">Online</option>
                          </select>
                          <ChevronDown className="text-gray-400 h-4 w-4 ml-auto pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex-1 relative group">
                      <div className="px-6">
                        <label className="block text-xs font-semibold text-gray-800 mb-1">
                          When
                        </label>
                        <div className="flex items-center">
                          <Calendar className="text-primaryColor h-4 w-4" />
                          <DatePicker
                            selected={filters.date ? new Date(filters.date) : null}
                            onChange={handleDateChange}
                            dateFormat="MMM dd, yyyy"
                            placeholderText="Select date"
                            className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="px-2">
                      <button 
                        onClick={handleSearch}
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
            </div>

            {/* Quick Links */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
              <button 
                onClick={() => {
                  updateFilters({ type: 'popular' });
                  handleSearch();
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                  bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm text-white"
              >
                <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Popular Events</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm text-white"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Near Me</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm text-white"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>This Weekend</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {/* Center aligned filters with better spacing */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { name: 'Category', icon: <Tag className="w-4 h-4 text-primaryColor" /> },
                { name: 'Date', icon: <Calendar className="w-4 h-4 text-primaryColor" /> },
                { name: 'Type', icon: <Layout className="w-4 h-4 text-primaryColor" /> }
              ].map((filter) => {
                const key = filter.name.toLowerCase() as FilterKey;
                const filterValue = filters[key];
                
                return (
                  <div key={filter.name} className="relative group">
                    <select
                      value={filterValue}
                      onChange={(e) => updateFilters({ [key]: e.target.value })}
                      className="appearance-none pl-10 pr-10 py-2.5 rounded-full bg-gray-50 
                        border border-gray-200 text-sm font-medium text-gray-700
                        hover:border-primaryColor/30 focus:outline-none focus:ring-2 
                        focus:ring-primaryColor/20 transition-all cursor-pointer
                        min-w-[140px] sm:min-w-[160px]"
                    >
                      <option value="">{filter.name}</option>
                      {key === 'category' && categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                      {key === 'type' && eventTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {/* Icon */}
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                      {filter.icon}
                    </div>
                    {/* Custom arrow */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Filters */}
            {Object.entries(filters).some(([key, value]) => value && key !== 'page') && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'page') return null;
                  return (
                    <button
                      key={key}
                      onClick={() => updateFilters({ [key]: '' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                        bg-primaryColor/10 text-primaryColor text-sm hover:bg-primaryColor/15 
                        transition-colors"
                    >
                      {value}
                      <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {/* Clear all filters - Only show if there are active filters */}
                {Object.values(filters).some(value => value && typeof value !== 'number') && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events?.data.map((event) => {
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
                      {parser(event.title)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primaryColor" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {parser(event.summary)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
