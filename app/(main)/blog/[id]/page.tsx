'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav } from '@/components/ui/authNavbar';
import { NavLink } from '../../codepass/components/NavLink';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Bookmark, Eye } from 'lucide-react';
import { LoginAlert } from '../../../auth/_components/loginAlert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
// Type definition for blog post
interface BlogPost {
  id: string;
  image: string;
  title: string;
  content: string;
  author: string;
  date: string;
  totalViews: number;
  categories: string[];
  tags: string[];
  comments: number;
  totalLikes: number;
  userHasLiked: boolean;
}

// Mock data matching the API structure
const mockBlog: BlogPost = {
  id: "1",
  image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  title: "The Future of Event Technology: AI-Powered Event Planning",
  content: `
    <h2>Revolutionizing Event Management with AI</h2>
    <p>The events industry is on the cusp of a technological revolution. Artificial Intelligence is transforming how we plan, execute, and experience events...</p>
    
    <h3>Key Innovations in Event Technology</h3>
    <ul>
      <li>Smart Attendee Matching</li>
      <li>Real-time Analytics</li>
      <li>Automated Scheduling</li>
      <li>Personalized Experiences</li>
    </ul>
    
    <blockquote>
      "The future of events lies in the perfect blend of human creativity and artificial intelligence."
    </blockquote>
  `,
  author: "John Doe",
  date: "2024-03-20",
  totalViews: 1234,
  categories: ["Technology", "Event Planning"],
  tags: ["Event Tech", "AI", "Future Events", "Digital Innovation"],
  comments: 56,
  totalLikes: 245,
  userHasLiked: false
};

const navLinks = [
  { label: 'Schedule' },
  { label: 'Speakers' },
  { label: 'Ticket' },
  { label: 'Contact' },
  { label: 'Create Event', isCreate: true },
  { label: 'Login', isButton: true }
];

interface Comment {
  id: string;
  user: string;
  content: string;
  date: string;
}

interface CommentsResponse {
  page: number;
  total: number;
  limit: number;
  data: Comment[];
}

const mockComments: CommentsResponse = {
  page: 0,
  total: 2,
  limit: 10,
  data: [
    {
      id: "1",
      user: "Alice Johnson",
      content: "This is a fantastic analysis of AI in event planning. I particularly enjoyed the section about smart attendee matching.",
      date: "2024-03-19T10:30:00"
    },
    {
      id: "2",
      user: "Mark Wilson",
      content: "Great insights! Would love to see more about how small events can implement these technologies cost-effectively.",
      date: "2024-03-19T09:15:00"
    }
  ]
};

export default function BlogDetailsPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(mockBlog.userHasLiked);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(mockBlog.totalLikes);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // Here you would typically make an API call to update the like status
  };

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

      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src={mockBlog.image}
            alt={mockBlog.title}
            fill
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col items-center justify-center pt-20">
            <div className="flex gap-2 mb-6">
              {mockBlog.categories.map(category => (
                <span key={category} className="inline-block px-4 py-1 bg-indigo-600/90 text-white text-sm font-medium rounded-full">
                  {category}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 leading-tight">
              {mockBlog.title}
            </h1>
            
            <div className="flex items-center gap-4 text-white/90 bg-black/30 p-4 rounded-xl backdrop-blur-sm">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mockBlog.author)}&background=random`}
                alt={mockBlog.author}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-indigo-500"
              />
              <div>
                <div className="font-medium">{mockBlog.author}</div>
                <div className="text-sm text-gray-300">
                  {new Date(mockBlog.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm mb-8 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>{mockBlog.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{mockBlog.totalViews}</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current text-indigo-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-8 pt-8">
            <div className="flex flex-wrap gap-2 mb-8">
              {mockBlog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-8">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-blockquote:border-indigo-500 prose-blockquote:text-gray-700" 
              dangerouslySetInnerHTML={{ __html: mockBlog.content }}>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 
                  transition-colors group"
              >
                <svg 
                  className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform rotate-180" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Back to Blog
              </Link>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Share Article
                </Button>
                <Button size="sm">
                  Follow Author
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments ({mockComments.total})</h2>
          
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={isAuthenticated ? "user-avatar-url" : ""} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"} 
                  disabled={!isAuthenticated}
                  className="mb-2"
                />
                {isAuthenticated && (
                  <Button className="float-right">Post Comment</Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {mockComments.data.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user)}`} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{comment.user}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
