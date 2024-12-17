'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { NavLink } from '../codepass/components/NavLink';
import { LoginAlert } from '../../auth/_components/loginAlert';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav } from '../../../components/ui/authNavbar';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { getAllBlogs } from '@/lib/actions/blog';
import { GetAllBlogsResponse } from '@/lib/models/_blogs_models';
import { BlogCardSkeleton } from '../codepass/components/skeletons';
import parser from 'html-react-parser';
import {navLinks} from "@/app/(main)/codepass/EventickPage"

const categories = [
  'All',
  'Event Planning',
  'Marketing',
  'Technology',
  'Tips & Tricks'
];

export default function BlogPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [blogs, setBlogs] = React.useState<GetAllBlogsResponse['data']>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        // You might want to add error state handling here
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                CodePass
              </div>
              
              <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.label}
                    {...link} 
                    isScrolled={isScrolled}
                    onLoginClick={() => setShowLoginDialog(true)}
                  />
                ))}
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <AuthenticatedNav isScrolled={isScrolled} showSearchInNav={false} />
      )}

      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />

      <div className="relative h-[600px] mb-16">
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
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <span className="inline-block px-4 py-1 bg-indigo-600/90 text-white text-sm font-medium rounded-full mb-6">
              The Event Planning Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 max-w-4xl leading-tight">
              Insights and Stories from the World of Events
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-center max-w-2xl leading-relaxed">
              Expert tips, industry trends, and success stories to help you create unforgettable experiences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
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

          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6 py-2 text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Post</h2>
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
            <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-full">
                  <Image
                    fill
                    src={blogs[0].image}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                      {blogs[0].title}
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{new Date(blogs[0].date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {blogs[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {parser(blogs[0].summary)}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      fill
                      src="https://ui-avatars.com/api/?name=John+Doe"
                      alt={blogs[0].author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{blogs[0].author}</div>
                      <div className="text-sm text-gray-500">Event Specialist</div>
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${blogs[0].id}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 
                      transition-colors group"
                  >
                    Read Full Article 
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(1).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                    transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-56">
                    <Image
                      fill
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {parser(post.summary)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          fill
                          src="https://ui-avatars.com/api/?name=John+Doe"
                          alt={post.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900">{post.author}</span>
                      </div>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-indigo-600 font-medium hover:text-indigo-700 
                          transition-colors inline-flex items-center gap-1 group"
                      >
                        Read More 
                        <svg 
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
