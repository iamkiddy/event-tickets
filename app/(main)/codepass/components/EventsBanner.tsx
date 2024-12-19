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
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
          alt="Events background"
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Discover Amazing Events
          </h2>
          
          <p className="mt-3 text-lg max-w-2xl">
            Find and book tickets for concerts, festivals, conferences, and more exciting events happening near you.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Events in your city</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Upcoming this month</span>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/event">
              <Button
                className="bg-white text-indigo-600 hover:bg-gray-100"
                size="lg"
              >
                Browse Events
              </Button>
            </Link>
            <Link href="/dashboard/events/create">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                size="lg"
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