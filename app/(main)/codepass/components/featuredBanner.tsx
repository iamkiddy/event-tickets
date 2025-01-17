'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FeaturedBannerProps {
  bannerData: {
    image: string;
    title: string;
    event: string;
  }[];
}

export default function FeaturedBanner({ bannerData }: FeaturedBannerProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const nextBanner = () => {
    if (bannerData) {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerData.length);
    }
  };

  const previousBanner = () => {
    if (bannerData) {
      setCurrentBannerIndex((prev) => (prev - 1 + bannerData.length) % bannerData.length);
    }
  };

  if (!bannerData || bannerData.length === 0) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8 mt-10">
      <Link 
        href={`/event/${bannerData[currentBannerIndex].event}`}
        className="block transition-transform hover:scale-[1.01] duration-300"
      >
        <div className="relative h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
            style={{
              backgroundImage: `url(${bannerData[currentBannerIndex].image})`,
            }}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          {/* Navigation arrows - only show if there are multiple banners */}
          {bannerData.length > 1 && (
            <>
              {/* Previous button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  previousBanner();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                  text-white p-1.5 sm:p-2 rounded-full transition-all transform hover:scale-110 z-10"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              
              {/* Next button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nextBanner();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                  text-white p-1.5 sm:p-2 rounded-full transition-all transform hover:scale-110 z-10"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Banner counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 sm:px-3 py-1 
                rounded-full text-xs sm:text-sm z-10">
                {currentBannerIndex + 1} / {bannerData.length}
              </div>

              {/* Banner dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                {bannerData.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentBannerIndex(index);
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                      index === currentBannerIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Content Container */}
          <div className="relative h-full flex flex-col justify-end p-3 sm:p-6 lg:p-8">
            {/* Featured Tag */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primaryColor rounded-full">
                <span className="text-xs sm:text-sm font-medium text-white">
                  Featured Event
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 
              line-clamp-2">
              {bannerData[currentBannerIndex].title}
            </h2>

            {/* Call to Action */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-xs sm:text-base">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                View Event Details
              </span>
              <span className="text-white/60">•</span>
              <span className="inline-flex items-center text-primaryColor font-medium group">
                Book Now
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
