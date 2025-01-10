/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Layout, Dice3, Calendar, ChevronRight } from 'lucide-react';
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
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { EventCardSkeleton } from '../codepass/components/skeletons';
import { getBannerUtils } from '@/lib/actions/main';
import { GetBannerUtilsResponse } from '@/lib/models/_main_models';
import Link from 'next/link';

// Add banner type definition
interface BannerData {
  id: string;
  image: string;
  title: string;
}

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();

  // params
  const category = searchParams.get('category') || '';
  const time = searchParams.get('time') || '';
  const type = searchParams.get('type') || '';
  const date = searchParams.get('date') || '';
  const where = searchParams.get('where') || '';
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  // get all events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', category, time, type, date, where, search, page],
    queryFn: () => getAllMainEvents({ category, time, type, date, where, search, page }),
  });

  // get all categories
  const { data: categories, isLoading: isMainLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoryUtils,
  });

  // get all event types
  const { data: eventTypes } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: getEventTypeUtils,
  });

  // Update the banner query to use the correct type
  const { data: bannerData } = useQuery<GetBannerUtilsResponse[]>({
    queryKey: ['banner'],
    queryFn: getBannerUtils,
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
      
      {/* Banner Section */}
      {bannerData && bannerData[0] && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
          <Link 
            href={`/event/${bannerData[0].id}`}
            className="block transition-transform hover:scale-[1.01] duration-300"
          >
            <div 
              className="relative h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url(${bannerData[0].image})`,
                }}
              />
              
              {/* Gradient Overlays - Enhanced for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              {/* Content Container */}
              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                {/* Featured Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 bg-primaryColor rounded-full">
                    <span className="text-xs sm:text-sm font-medium text-white">
                      Featured Event
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 
                  line-clamp-2">
                  {bannerData[0].title}
                </h2>

                {/* Call to Action */}
                <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    View Event Details
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="inline-flex items-center text-primaryColor font-medium group">
                    Book Now
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-primaryColor/10 opacity-0 hover:opacity-100 
                transition-opacity duration-300" />
            </div>
          </Link>
        </div>
      )}

      {(isMainLoading && isLoading ) ? (
        <>
          {/* Enhanced Filters Section Skeleton */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm pb-2 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 py-2 md:justify-center">
                {[...Array(3)].map((_, i) => (
                  <Skeleton 
                    key={i}
                    className="h-9 w-32 rounded-full bg-gray-200" 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Events Grid Skeleton */}
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </>
      ) : (
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