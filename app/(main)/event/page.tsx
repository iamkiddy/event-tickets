/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Layout, Dice3 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav, UnauthenticatedNav } from '@/components/ui/authNavbar';
import { getAllMainEvents } from '@/lib/actions/mainEvent';
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery } from '@tanstack/react-query';
import HeroSection from './_components/HeroSection';
import EventFilterCard, { EventFilterList } from './_components/EventFilter';
import { getCategoryUtils,getEventTypeUtils } from '@/lib/actions/main';
import { eventFilterTime } from '@/lib/constants';
import { EventCard } from '../codepass/components/EventCard';

interface EventPageProps {
  searchParams: {
    search?: string;
    category?: string;
    type?: string;
    time?: string;
    where?: string;
    date?: string;
    page?: number;
  };
}

export default function EventsPage({ searchParams }: EventPageProps) {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  // params
  const category = searchParams.category || '';
  const time = searchParams.time || '';
  const type = searchParams.type || '';
  const date = searchParams.date || '';
  const where = searchParams.where || '';
  const search = searchParams.search || '';
  const page = searchParams.page || 1;

  // get all events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', category, time, type, date, where, search, page],
    queryFn: () => getAllMainEvents({ category, time, type, date, where, search, page }),
  });

  // get all categories
  const { data: categories, isLoading: isMainLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoryUtils(),
  });

  // get all event types
  const { data: eventTypes } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => getEventTypeUtils(),
  });


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <UnauthenticatedNav isScrolled={isScrolled} />
      ) : (
        <AuthenticatedNav isScrolled={isScrolled} showSearchInNav={false} />
      )}
      
      {/* Hero Section with Search */}
      <HeroSection/>
      
      {(isMainLoading && isLoading ) ? (<div>...loading</div>): (
        <>
          {/* Enhanced Filters Section - Made more responsive */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm pb-2 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 py-2 md:justify-center">
                <EventFilterCard 
                  icon={<Tag className="w-3 h-3 sm:w-4 sm:h-4 text-primaryColor mr-1 sm:mr-2" />}
                  name="Category" 
                  activeName={category} 
                  query="category"
                  data={categories?.map((category) => category.name) as string[]} 
                />
                <EventFilterCard 
                  icon={<Dice3 className="w-3 h-3 sm:w-4 sm:h-4 text-primaryColor mr-1 sm:mr-2" />}
                  name="Any Time" 
                  activeName={time} 
                  query="time" 
                  data={eventFilterTime}
                />
                <EventFilterCard 
                  icon={<Layout className="w-3 h-3 sm:w-4 sm:h-4 text-primaryColor mr-1 sm:mr-2" />}
                  name="Event Type" 
                  activeName={type} 
                  query="type" 
                  data={eventTypes?.map((type) => type.name) as string[] || []}
                />
              </div>
              <EventFilterList params={{category, type, time}} />
            </div>
          </div>

          {/* Events Grid - Enhanced responsiveness */}
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/3] rounded-t-xl" />
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {events?.data.map((event) => (
                  <EventCard 
                    key={event.id} 
                    data={event}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
    </div>
  );
}