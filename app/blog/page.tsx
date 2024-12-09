'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { NavLink } from '../codepass/components/NavLink';
import { LoginAlert } from '../auth/_components/loginAlert';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav } from '../../components/ui/authNavbar';
import Image from 'next/image';

const navLinks = [
  { label: 'Schedule' },
  { label: 'Speakers' },
  { label: 'Ticket' },
  { label: 'Contact' },
  { label: 'Create Event', isCreate: true },
  { label: 'Login', isButton: true }
];

const blogPosts = [
  {
    image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b2905736e4c054874f5000c449195259afc5d4fbd743c2793853105f0c6b05d4',
    title: '6 Strategies to Find Your Conference Keynote and Other Speakers',
    description: 'Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.',
    date: '12 Mar',
    author: 'Jhon Doe',
    category: 'Event Planning',
    readTime: '5 min read'
  },
  // ... add more blog posts
];

const categories = ['All', 'Event Planning', 'Marketing', 'Technology', 'Tips & Tricks'];

export default function BlogPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  React.useEffect(() => {
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
          <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-[400px] lg:h-full">
                <Image
                  fill
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    {blogPosts[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>{blogPosts[0].date}</span>
                  <span>•</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {blogPosts[0].description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    fill
                    src="https://ui-avatars.com/api/?name=John+Doe"
                    alt={blogPosts[0].author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{blogPosts[0].author}</div>
                    <div className="text-sm text-gray-500">Event Specialist</div>
                  </div>
                </div>
                <Link 
                  href={`/blog/${blogPosts[0].title.toLowerCase().replace(/ /g, '-')}`}
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
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <article
                key={index}
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
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.description}
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
                      href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`}
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
        </div>
      </div>
    </div>
  );
}
