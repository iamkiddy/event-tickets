'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { getBannerUtils } from '@/lib/actions/main';
import { GetBannerUtilsResponse } from '@/lib/models/_main_models';
import { toast } from 'sonner';

export const EventsBanner: React.FC = () => {
  const [banners, setBanners] = React.useState<GetBannerUtilsResponse[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBannerUtils();
        setBanners(response);
      } catch (error) {
        console.error('Error fetching banners:', error);
        toast.error('Failed to load event banners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  React.useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gradient-to-r from-indigo-500 to-purple-600">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-700/90 z-10" />
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="h-full w-full object-cover transition-opacity duration-500"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="md:ml-auto md:w-3/4 md:pl-10">
          {/* Title with animation */}
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl animate-fade-in">
            {currentBanner.title}
          </h2>
          
          <p className="mt-3 text-lg text-white/90">
            Find and book tickets for concerts, festivals, conferences, and more exciting events happening near you.
          </p>
          
          {/* Features */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center text-sm bg-white/10 px-4 py-2 rounded-full">
              <MapPin className="mr-2 h-5 w-5" />
              <span>Events in your city</span>
            </div>
            <div className="flex items-center text-sm bg-white/10 px-4 py-2 rounded-full">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Upcoming this month</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              className="bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-300"
              size="lg"
            >
              Browse Events
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 transition-all duration-300"
              size="lg"
            >
              Create Event
            </Button>
          </div>

          {/* Banner Navigation Dots */}
          {banners.length > 1 && (
            <div className="mt-8 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentBannerIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};