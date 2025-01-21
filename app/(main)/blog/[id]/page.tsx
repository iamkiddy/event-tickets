/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from 'date-fns';
import { getBlogById, likeBlog, addBlogComment } from '@/lib/actions/blog';
import { useParams } from 'next/navigation';
import parser from 'html-react-parser';
import { toast } from 'sonner';
import {navLinks} from "@/app/(main)/codepass/EventickPage"

// Type definitions
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

interface Comment {
  id: string;
  user: string;
  content: string;
  date: string;
}

export default function BlogDetailsPage() {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [blog, setBlog] = React.useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentText, setCommentText] = React.useState('');
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const params = useParams();

  // Action that triggered login dialog
  const [pendingAction, setPendingAction] = React.useState<'like' | 'comment' | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const fetchBlog = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const response = await getBlogById(params.id as string);
        setBlog(response);
        setIsLiked(response.userHasLiked);
        setLikeCount(response.totalLikes);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setPendingAction('like');
      setShowLoginDialog(true);
      return;
    }

    if (!blog) return;

    try {
      const response = await likeBlog(blog.id);
      setIsLiked(response.success);
      setLikeCount(prev => response.success ? prev + 1 : prev - 1);
      toast.success(response.success ? 'Added to your likes' : 'Removed from your likes');
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      setPendingAction('comment');
      setShowLoginDialog(true);
      return;
    }

    if (!blog || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addBlogComment(blog.id, { content: commentText.trim() });
      setCommentText('');
      toast.success('Comment posted successfully');
      // Optionally refresh comments here
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    // Execute pending action after successful login
    if (pendingAction === 'like') {
      handleLike();
    } else if (pendingAction === 'comment') {
      handleComment();
    }
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-12 w-3/4 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Return to blog list
          </Link>
        </div>
      </div>
    );
  }

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
        onClose={() => {
          setShowLoginDialog(false);
          setPendingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
        {/* Background blur effect */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: `url(${blog.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.7)',
              transform: 'scale(1.1)'
            }} 
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Main image */}
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div className="flex gap-2 mt-auto">
              {blog.categories.map(category => (
                <span key={category} className="inline-block px-4 py-1 bg-indigo-600/90 text-white text-sm font-medium rounded-full">
                  {category}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-white/90 bg-black/30 p-4 rounded-xl backdrop-blur-sm mt-4">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author)}&background=random`}
                alt={blog.author}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-indigo-500"
              />
              <div>
                <div className="font-medium">{blog.author}</div>
                <div className="text-sm text-white/75">
                  {formatDistanceToNow(new Date(blog.date), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {parser(blog.content)}
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <div className="flex items-center gap-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                } transition-colors`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span>{blog.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors">
                <Eye className="w-6 h-6" />
                <span>{blog.totalViews}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors">
                <Share2 className="w-6 h-6" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 ${
                  isBookmarked ? 'text-indigo-500' : 'text-gray-500 hover:text-indigo-500'
                } transition-colors`}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>
          
          {isAuthenticated ? (
            <div className="mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-[100px] mb-4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button 
                className="bg-primaryColor text-white"
                onClick={handleComment}
                disabled={isSubmittingComment || !commentText.trim()}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
              <p className="text-gray-600 mb-4">Join the discussion</p>
              <Button className="bg-primaryColor text-white" onClick={() => {
                setPendingAction('comment');
                setShowLoginDialog(true);
              }}>
                Log in to comment
              </Button>
            </div>
          )}

          <div className="space-y-8">
            {/* Comments will be implemented in the next phase */}
          </div>
        </div>
      </div>
    </div>
  );
}
