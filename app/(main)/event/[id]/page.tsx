'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Tag, Share2, DollarSign, Heart, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getEventDetails } from '@/lib/actions/mainEvent';
import { EventDetails } from '@/lib/models/_main_event_models';
import parser from 'html-react-parser';
import { useAuth } from '@/lib/context/AuthContext';
import { NavLink } from '../../codepass/components/NavLink';
import { LoginAlert } from '@/app/auth/_components/loginAlert';
import { AuthenticatedNav } from '@/components/ui/authNavbar';
import { navLinks } from "@/app/(main)/codepass/EventickPage";
import { SearchBar } from '../../codepass/components/SearchBar';

interface FormattedDate {
  fullDate: string;
  month: string;
  day: string;
}

const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return '';
  
  // Parse the time string
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours);
  
  // Convert to 12-hour format
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const displayHours = hourNum % 12 || 12;
  
  return `${displayHours}:${minutes} ${period}`;
};

const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const formatDate = (dateString: string | undefined): FormattedDate => {
  if (!dateString) {
    return {
      fullDate: '',
      month: '',
      day: '',
    };
  }
  
  try {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    };
  } catch {
    return {
      fullDate: '',
      month: '',
      day: '',
    };
  }
};

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!params.id || typeof params.id !== 'string') {
        toast.error('Invalid event ID');
        return;
      }

      try {
        const response = await getEventDetails(params.id);
        setEvent(response);
      } catch (error) {
        toast.error('Failed to load event details');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      
      const searchTriggerPosition = window.innerHeight * 0.4;
      setShowSearchInNav(scrollPosition > searchTriggerPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Navbar */}
      {isAuthenticated ? (
        <AuthenticatedNav 
          isScrolled={isScrolled}
          showSearchInNav={showSearchInNav}
        />
      ) : (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className={`text-lg sm:text-xl font-bold ${isScrolled ? 'text-primaryColor' : 'text-white'}`}>
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
              <div className="flex items-center gap-2 sm:gap-4">
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
            </div>
          </div>
        </nav>
      )}

      <LoginAlert 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={() => setShowLoginDialog(false)}
      />

      {/* Hero Section with Image */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] min-h-[250px] sm:min-h-[350px] md:min-h-[400px] overflow-hidden">
        {/* Background blur effect from the image */}
        {event.images && event.images.length > 0 ? (
          <>
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${event.images[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.7)',
              transform: 'scale(1.1)'
            }} />
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
        
        {/* Content container with padding */}
        <div className="relative h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
            {/* Main image */}
            {event.images && event.images.length > 0 ? (
              <div className="absolute inset-0">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg" />
              </div>
            ) : (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <ImageIcon className="h-20 w-20 text-white/50" />
              </div>
            )}

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="flex items-center gap-2 text-white/90 mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{formatDate(event.startDate).fullDate}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeRange(event.startTime, event.endTime)}</span>
                </div>
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
                  {parser(event.title)}
                </h1>
                <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-3xl line-clamp-2 sm:line-clamp-none">
                  {parser(event.summary)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 xs:px-4">
          <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16">
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-6">
              <h2 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-xs">
                {event.title}
              </h2>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primaryColor" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Event details sections */}
            {/* About Section */}
            <div className="bg-white p-3 xs:p-4 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-3 xs:mb-4 sm:mb-6">
                About This Event
              </h2>
              <div className="prose max-w-none text-gray-600 text-xs xs:text-sm sm:text-base">
                {parser(event.overview)}
              </div>
            </div>

            {/* Date and Location */}
            <div className="bg-white p-3 xs:p-4 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="grid xs:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <Calendar className="w-6 h-6 text-primaryColor" />
                    <span>Date and time</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{formatDate(event.startDate).fullDate}</p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primaryColor" />
                      {formatTimeRange(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-medium mb-4">
                    <MapPin className="w-6 h-6 text-primaryColor" />
                    <span>Location</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>{event.address1}</p>
                    {event.address2 && <p>{event.address2}</p>}
                    <p>{event.city}, {event.state}</p>
                    <p>{event.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            {event.agendas && event.agendas.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Schedule</h2>
                <div className="space-y-6">
                  {event.agendas.map((agenda, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="font-semibold text-gray-900">{agenda.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatTimeRange(agenda.startTime, agenda.endTime)}</span>
                        <span>Hosted by: {agenda.host.join(', ')}</span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        {parser(agenda.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {event.faqs && event.faqs.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">FAQ</h2>
                <div className="space-y-6">
                  {event.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-gray-600">
                        {parser(faq.answer)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket selection - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Tickets</h3>
                  
                  {/* Ticket types */}
                  <div className="space-y-4">
                    {/* Afro Nation Ticket */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primaryColor transition-colors">
                      <div>
                        <h4 className="font-medium text-gray-900">Afro Nation</h4>
                        <p className="text-sm text-gray-600">20 remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">GHS30</p>
                        <select className="mt-1 text-sm border-gray-200 rounded-md focus:ring-primaryColor focus:border-primaryColor">
                          <option value="0">0</option>
                          {[...Array(5)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Promo 2024 Ticket */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primaryColor transition-colors">
                      <div>
                        <h4 className="font-medium text-gray-900">Promo 2024</h4>
                        <p className="text-sm text-gray-600">10 remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">GHS10</p>
                        <select className="mt-1 text-sm border-gray-200 rounded-md focus:ring-primaryColor focus:border-primaryColor">
                          <option value="0">0</option>
                          {[...Array(5)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Get Tickets Button */}
                  <button className="w-full mt-6 px-6 py-3 bg-primaryColor text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    Get Tickets
                  </button>

                  {/* Refund Policy */}
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Refundable up to 7 days before the event
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}