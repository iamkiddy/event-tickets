'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export const EventsBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-700/90" />
        <div className='w-full h-full relative overflow-hidden'>
          {/* <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
            alt="Events background"
            fill
            className="object-cover"
          /> */}
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Discover Amazing Events
          </h2>
          
          <p className="mt-2 sm:mt-3 text-base sm:text-lg max-w-2xl">
            Find and book tickets for concerts, festivals, conferences, and more exciting events happening near you.
          </p>
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center text-xs sm:text-sm">
              <MapPin className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>Events in your city</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm">
              <Calendar className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span>Upcoming this month</span>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/event">
              <Button
                className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100"
                size="default"
                variant="default"
              >
                Browse Events
              </Button>
            </Link>
            <Link href="/dashboard/events/create">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                size="default"
              >
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}