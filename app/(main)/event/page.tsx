/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { Tag, Layout, Dice3 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav, UnauthenticatedNav } from '@/components/ui/authNavbar';
import { getAllMainEvents } from '@/lib/actions/mainEvent';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import HeroSection from './_components/HeroSection;
import EventFilterCard, { EventFilterList } from './_components/EventFilter;
import { getCategoryUtils } from '@/lib/actions/main';
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
  
  // get all events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', searchParams],
    queryFn: () => getAllMainEvents(searchParams),
  });

  // get all categories
  const { data: categories, isLoading: isMainLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoryUtils(),
  });

  // get all event types
  const { data: eventTypes } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => getCategoryUtils(),
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
          {/* Enhanced Filters Section */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm pb-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <EventFilterCard 
                  icon={<Tag className="w-4 h-4 text-primaryColor mr-2" />}
                  name="Category" 
                  activeName={searchParams.category} 
                  query="category" data={categories?.map((category) => category.name) as string[]} 
                />
                <EventFilterCard 
                  icon={<Dice3 className="w-4 h-4 text-primaryColor mr-2" />}
                  name="Any Time" 
                  activeName={searchParams.time} 
                  query="time" 
                  data={eventFilterTime}
                />
                <EventFilterCard 
                  icon={<Layout className="w-4 h-4 text-primaryColor mr-2" />}
                  name="Event Type" 
                  activeName={searchParams.type} 
                  query="type" 
                  data={eventTypes?.map((type) => type.name) as string[] || []}
                />
              </div>
              <EventFilterList params={searchParams} />
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
                {events?.data.map((event) => (
                  <EventCard 
                    key={event.id} 
                    id={event.id}
                    month={formatDate(event.date, 'MMM')}
                    day={formatDate(event.date, 'DD')}
                    title={event.title}
                    description={event.description}
                    image={event.image}
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
