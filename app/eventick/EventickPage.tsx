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
import { AuthenticatedNav } from '@/app/(dashboard)/home/_components/authNavbar';
import { useAuth } from '@/lib/context/AuthContext';

const navLinks = [
  { label: 'Schedule' },
  { label: 'Speakers' },
  { label: 'Ticket' },
  { label: 'Contact' }
];

const events = [
  {
    month: 'APR',
    day: '14',
    title: 'Wonder Girls 2010 Wonder Girls World Tour San Francisco',
    description: "We'll get you directly seated and inside for you to enjoy the show.",
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'AUG',
    day: '20',
    title: 'JYJ 2011 JYJ Worldwide Concert Barcelona',
    description: 'Directly seated and inside for you to enjoy the show.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'SEP',
    day: '05',
    title: 'Live Concert Singing Competition 2024',
    description: 'Join us for an amazing night of musical talent and competition.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'OCT',
    day: '15',
    title: 'International Music Festival 2024',
    description: 'A celebration of diverse musical genres from around the world.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'NOV',
    day: '25',
    title: 'Rock & Roll Hall of Fame Concert',
    description: 'Experience the legends of rock music live on stage.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'NOV',
    day: '25',
    title: 'Rock & Roll Hall of Fame Concert',
    description: 'Experience the legends of rock music live on stage.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'NOV',
    day: '25',
    title: 'Rock & Roll Hall of Fame Concert',
    description: 'Experience the legends of rock music live on stage.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'NOV',
    day: '25',
    title: 'Rock & Roll Hall of Fame Concert',
    description: 'Experience the legends of rock music live on stage.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    month: 'NOV',
    day: '25',
    title: 'Rock & Roll Hall of Fame Concert',
    description: 'Experience the legends of rock music live on stage.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
];

const blogPosts = [
  {
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b2905736e4c054874f5000c449195259afc5d4fbd743c2793853105f0c6b05d4?placeholderIfAbsent=true&apiKey=343ef0e5af634a268a7f26dcf5b09d31',
    title: '6 Strategies to Find Your Conference Keynote and Other Speakers',
    description: 'Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.',
    date: '12 Mar',
    author: 'Jhon Doe'
  },
  {
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6a9227dd6d09750c569d0aed6a58d64fd762ee214a9363e1b6019f1bc897e2d6?placeholderIfAbsent=true&apiKey=343ef0e5af634a268a7f26dcf5b09d31',
    title: 'How Successfully Used Paid Marketing to Drive Incremental Ticket Sales',
    description: 'Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.',
    date: '12 Mar',
    author: 'Jhon Doe'
  },
  {
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/77bf3d839341449773d8a565f8488283d4450b428fd8b5852d37a76922d95aad?placeholderIfAbsent=true&apiKey=343ef0e5af634a268a7f26dcf5b09d31',
    title: 'Introducing Workspaces: Work smarter, not harder with new navigation',
    description: 'Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.',
    date: '12 Mar',
    author: 'Jhon Doe'
  }
];

export default function EventickPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [showSearchInNav, setShowSearchInNav] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      setShowLoginDialog(false);
    }
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated && (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
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

              <div className={`hidden md:flex items-center gap-4 ${showSearchInNav ? 'ml-auto' : ''}`}>
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

              <button className="md:hidden p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
              alt="Event background"
              className="object-cover w-full h-full"
            />
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

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <Categories />
      </div>

      {/* Rest of the content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mt-16">
          <div className="flex flex-col mb-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            
            <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <select 
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-indigo-50 
                  text-indigo-600 border border-indigo-100 focus:outline-none 
                  focus:ring-2 focus:ring-indigo-200 whitespace-nowrap flex-shrink-0"
              >
                <option value="any">Any Category</option>
                <option value="weekend">Weekend Events</option>
                <option value="weekday">Weekday Events</option>
              </select>

              <select 
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-indigo-50 
                  text-indigo-600 border border-indigo-100 focus:outline-none 
                  focus:ring-2 focus:ring-indigo-200 whitespace-nowrap flex-shrink-0"
              >
                <option value="any">Event Type</option>
                <option value="concert">Concerts</option>
                <option value="conference">Conferences</option>
                <option value="workshop">Workshops</option>
              </select>

              <select 
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-indigo-50 
                  text-indigo-600 border border-indigo-100 focus:outline-none 
                  focus:ring-2 focus:ring-indigo-200 whitespace-nowrap flex-shrink-0"
              >
                <option value="any">Any Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="thisWeek">This Week</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <EventCard 
                key={`${event.month}-${event.day}-${index}`} 
                {...event} 
                id={String(index + 1)}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Latest Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.title} {...post} />
            ))}
          </div>
        </section>

        <section className="mt-16 mb-16 max-w-xl mx-auto">
          <Newsletter />
        </section>
      </div>
      <Footer />
    </div>
  );
}

