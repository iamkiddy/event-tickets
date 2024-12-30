/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { EventCard } from './components/EventCard';
import { BlogCard } from './components/BlogCard';
import { SearchBar } from './components/SearchBar';
import { Newsletter } from './components/Newsletter';
import { Sponsors } from './components/sponsors';
import { Categories } from './components/Categories';
import { Footer } from './components/Footer';
import { LoginAlert } from '@/app/auth/_components/loginAlert';
import { useAuth } from '@/lib/context/AuthContext';
import { EventsBanner } from './components/EventsBanner';
import { GetEventTypeUtilsResponse, GetHomepageUtilsResponse } from '@/lib/models/_main_models';
import { getEventTypeUtils, getHomepageUtils } from '@/lib/actions/main';
import Image from 'next/image';
import EventPageLoader from './components/Pageloader';
import FilterCard from './components/FilterCard';
import { eventFilterTime } from '@/lib/constants';
import Link from 'next/link';
import { EventPageHeader } from './components/EventPageHeader';
import { useState } from 'react';

export const navLinks = [
  { label: 'Schedule' },
  { label: 'Speakers' },
  { label: 'Ticket' },
  { label: 'Contact' }
];

export default function EventPage() {
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [eventTypes, setEventTypes] = React.useState<GetEventTypeUtilsResponse[]>([]);
  const [homeData, setHomeData] = React.useState<GetHomepageUtilsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventTypesData, homeData] = await Promise.all([
          getEventTypeUtils(),
          getHomepageUtils()
        ]);
        setEventTypes(eventTypesData);
        setHomeData(homeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <EventPageHeader 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setShowLoginDialog(true)}
        navLinks={navLinks}
      />

      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />

      {/* Hero Banner with Search */}
      <div id="hero-section" className="relative h-[600px] -mt-[88px]">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
            poster="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
          >
            <source 
              src="https://vod-progressive.akamaized.net/exp=1711081446~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4182%2F14%2F371433846%2F1548843980.mp4~hmac=9c0c171c8f1e0f91e3c359c0c8bce9d0d36e21c6e0d5f0b9b36873c3e2c0c0d0/vimeo-prod-skyfire-std-us/01/4182/14/371433846/1548843980.mp4" 
              type="video/mp4"
            />
            {/* Fallback for browsers that don't support video */}
            <div className='relative h-full w-full'>
              <Image
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
                alt="Event background"
                fill
                className="object-cover"
              />
            </div>
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center max-w-4xl mb-6">
              Discover Amazing Events Near You
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-12">
              Find and book tickets for concerts, festivals, conferences, and more exciting events
            </p>
            <div className="w-full max-w-4xl">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <Sponsors />
    
      <div className='h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
        {/* Categories Section */}
        <Categories categories={homeData?.featuredCategories || []} />

        {/* Upcoming Events Section with Filters */}
        
        <section className="my-8 mt-10">
          <div className="flex gap-4 mb-5">
            <FilterCard
              title='Any Category'
              prefix='category'
              data={homeData?.featuredCategories.map((category) => category.name) || []}
            />
            <FilterCard
              title='Event Type'
              prefix='type'
              data={eventTypes.map((type) => type.name) || []}
            />
            <FilterCard
              title='Any Time'
              prefix='time'
              data={eventFilterTime}
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Upcoming Events</h2>
            <Link 
              href="/event" 
              className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg 
                text-primaryColor hover:bg-primaryColor/10 font-medium text-sm md:text-base
                transition-all duration-300 group"
            >
              View All Events
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <EventPageLoader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeData?.upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  data={event}
                />
              ))}
            </div>
          )}
        </section>

        {/* Most Viewed Events Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Most Viewed Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData?.mostViewedEvents.map((event) => (
              <EventCard 
                key={event.id}
                data={event}
              />
            ))}
          </div>
        </section>

        {/* Banner Section */}
        <EventsBanner />


        {/* Blog Section */}
        <section className="my-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold">Latest Blog Posts</h2>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg 
                text-primaryColor hover:bg-primaryColor/10 font-medium text-sm md:text-base
                transition-all duration-300 group"
            >
              View All Blog Posts
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeData?.pageBlogs?.map((post) => (
              <BlogCard 
                key={post.id}
                id={post.id}
                image={post.image}
                title={post.title}
                description={post.summary}
                date={post.date}
                author={post.author}
              />
            )) || (
              // Fallback content when no blogs are available
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />
      </div>

      <Footer />
    </div>
  );
}
