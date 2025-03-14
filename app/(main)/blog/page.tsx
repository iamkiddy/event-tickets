'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/context/AuthContext';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { getAllBlogs } from '@/lib/actions/blog';
import { GetAllBlogsResponse } from '@/lib/models/_blogs_models';
import { BlogCardSkeleton } from '../codepass/components/skeletons';
import parser from 'html-react-parser';
import { useQuery } from '@tanstack/react-query';
import { getBannerUtils } from '@/lib/actions/main';
import { GetBannerUtilsResponse } from '@/lib/models/_main_models';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const BlogHeader = dynamic(
  () => import('./_components/BlogHeader').then(mod => mod.BlogHeader),
  { ssr: false }
);

const LoginAlert = dynamic(
  () => import('../../auth/_components/loginAlert').then(mod => ({ default: mod.LoginAlert })),
  { ssr: false }
);

const BlogCard = dynamic(
  () => import('../codepass/components/BlogCard').then(mod => ({ default: mod.BlogCard })),
  { ssr: false }
);

const categories = [
  'All',
  'Event Planning',
  'Marketing',
  'Technology',
  'Tips & Tricks'
];

export default function BlogPage() {
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [blogs, setBlogs] = React.useState<GetAllBlogsResponse['data']>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);

  const { data: bannerData } = useQuery<GetBannerUtilsResponse[]>({
    queryKey: ['banner'],
    queryFn: getBannerUtils,
  });

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

  React.useEffect(() => {
    setIsClient(true);
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (!isClient) {
    return <BlogCardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setShowLoginDialog(true)}
      />

      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />

      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] mb-8 sm:mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            alt="Event background"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col items-center justify-center pt-16 sm:pt-20">
            <span className="inline-block px-3 sm:px-4 py-1 bg-indigo-600/90 text-white text-xs sm:text-sm font-medium rounded-full mb-4 sm:mb-6">
              The Event Planning Blog
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 sm:mb-8 max-w-4xl leading-tight px-4">
              Insights and Stories from the World of Events
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 text-center max-w-2xl leading-relaxed px-4">
              Expert tips, industry trends, and success stories to help you create unforgettable experiences
            </p>
          </div>
        </div>
      </div>

      {bannerData && bannerData.length > 0 && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
          <Link 
            href={`/event/${bannerData[currentBannerIndex].id}`}
            className="block transition-transform hover:scale-[1.01] duration-300"
          >
            <div className="relative h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
              <div 
                className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url(${bannerData[currentBannerIndex].image})`,
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              {bannerData.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      previousBanner();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                      text-white p-2 rounded-full transition-all transform hover:scale-110 z-10"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextBanner();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                      text-white p-2 rounded-full transition-all transform hover:scale-110 z-10"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 
                    rounded-full text-sm z-10">
                    {currentBannerIndex + 1} / {bannerData.length}
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {bannerData.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentBannerIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
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

              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 bg-primaryColor rounded-full">
                    <span className="text-xs sm:text-sm font-medium text-white">
                      Featured Event
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 
                  line-clamp-2">
                  {bannerData[currentBannerIndex].title}
                </h2>

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
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Browse by Category
          </h2>

          <div className="mb-8">
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">Featured Post</h2>
          {isLoading ? (
            <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-full">
                  <div className="w-full h-full">
                    <div className="absolute top-6 left-6">
                      <div className="bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded-full animate-pulse" />
                    </div>
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ) : blogs.length > 0 && (
            <article className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.01] group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[300px] lg:h-[400px]">
                  <Image
                    fill
                    src={blogs[0].image}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center relative">
                  <div className="space-y-4">
                    <span className="text-sm text-indigo-600 font-medium">
                      {new Date(blogs[0].date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {blogs[0].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {parser(blogs[0].summary)}
                    </p>
                    <Link 
                      href={`/blog/${blogs[0].id}`}
                      className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 
                        transition-colors group/link pt-2"
                    >
                      Read More 
                      <svg 
                        className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>

        <div className="mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">Latest Posts</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {blogs.slice(1).map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  image={post.image}
                  title={post.title}
                  description={post.summary}
                  date={post.date}
                  author={post.author}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
