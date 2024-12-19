/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { NavLink } from './components/NavLink';
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
import { GetCategoryUtilsResponse, GetEventTypeUtilsResponse, GetHomepageUtilsResponse } from '@/lib/models/_main_models';
import { getEventTypeUtils, getHomepageUtils } from '@/lib/actions/main';
import { EventCardSkeleton, BlogCardSkeleton, EventsBannerSkeleton, SectionHeaderSkeleton } from './components/skeletons';
import Image from 'next/image';
import EventPageLoader from './components/Pageloader';
import FilterCard from './components/FilterCard';
import { eventFilterTime } from '@/lib/constants';

export const navLinks = [
  { label: 'Schedule' },
  { label: 'Speakers' },
  { label: 'Ticket' },
  { label: 'Contact' }
];

export default function EventPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [showSearchInNav, setShowSearchInNav] = React.useState(false);
  const [eventTypes, setEventTypes] = React.useState<GetEventTypeUtilsResponse[]>([]);
  const [homeData, setHomeData] = React.useState<GetHomepageUtilsResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      
      // Show search in nav when scrolled past the hero section
      const searchTriggerPosition = window.innerHeight * 0.4;
      setShowSearchInNav(scrollPosition > searchTriggerPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {!isAuthenticated && (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-primaryColor' : 'text-white'}`}>
                CodePass
              </div>
              
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-full 
                transition-all duration-300 px-4 md:px-0 hidden lg:block
                ${showSearchInNav 
                  ? 'opacity-100 visible top-1/2 -translate-y-1/2 max-w-xl' 
                  : 'opacity-0 invisible -translate-y-full'}`}>
                <SearchBar isCompact />
              </div>

              <div className={`hidden md:flex items-center gap-4 lg:gap-8 transition-all duration-300
                ${showSearchInNav ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
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
      )}

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
            <div className={`w-full max-w-4xl transition-opacity duration-300 
              ${showSearchInNav ? 'opacity-0' : 'opacity-100'}`}>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      <Sponsors />
      
      {isLoading ? (
        <EventPageLoader />
      ): (
        <div className='h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
          {/* Categories Section */}
          <Categories categories={homeData?.featuredCategories || []} />

          {/* Filter Section */}
          <div className='flex flex-col gap-4 md:flex-row mt-16'>
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

          {/* Upcoming Events Section */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeData?.upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  month={new Date(event.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}
                  day={new Date(event.startDate).getDate().toString()}
                  title={event.title}
                  description={event.summary}
                  image={event.image}
                />
              ))}
            </div>
          </section>

          {/* Most Viewed Events Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Most Viewed Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeData?.mostViewedEvents.map((event) => (
                <EventCard 
                  key={event.id}
                  id={event.id}
                  month={new Date(event.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}
                  day={new Date(event.startDate).getDate().toString()}
                  title={event.title}
                  description={event.summary}
                  image={event.image}
                />
              ))}
            </div>
          </section>

          {/* Banner Section */}
          <EventsBanner />

          {/* Blog Section */}
          {homeData?.pageBlogs && homeData.pageBlogs.length > 0 && (
            <section className="my-16">
              <h2 className="text-2xl font-bold mb-8">Latest Blog Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {homeData.pageBlogs.map((post) => (
                  <BlogCard 
                    key={post.id}
                    image={post.image}
                    title={post.title}
                    description={post.summary}
                    date={post.date}
                    author={post.author}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Newsletter Section */}
          <Newsletter />
        </div>
      )}

      <Footer />
    </div>
  );
}
