'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Share2, Heart, ImageIcon, Globe, Phone, Video, Play, Info } from 'lucide-react';
import { getEventDetails } from '@/lib/actions/mainEvent';
import parser from 'html-react-parser';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav, UnauthenticatedNav } from '@/components/ui/authNavbar';
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { AccordionTrigger } from '@radix-ui/react-accordion';
import { BuyTicketsModel } from './components/BuyTicketsModel';

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
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [ticketCounts, setTicketCounts] = useState({ general: 0, vip: 0 });

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', params.id as string],
    queryFn: () => getEventDetails(params.id as string),
  });

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

  const total = (ticketCounts.general * 30) + (ticketCounts.vip * 50);
  const fees = total * 0.1;

  const handleOpenBuyModal = () => {
    setIsBuyModalOpen(true);
  };

  const handleCloseBuyModal = () => {
    setIsBuyModalOpen(false);
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Add Navbar */}
      {isAuthenticated ? (
        <AuthenticatedNav 
          isScrolled={isScrolled}
          showSearchInNav={showSearchInNav}
        />
      ) : (
        <UnauthenticatedNav isScrolled={isScrolled} />
      )}

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
              <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="object-cover w-full h-full"
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
                  {event.locationType === 'online' && (
                    <>
                      <span className="mx-2">•</span>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>Online Event</span>
                      </div>
                    </>
                  )}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Event</h2>
              <div className="prose max-w-none text-gray-600">
                {parser(event.overview)}
              </div>
            </div>

            {/* Date and Location */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 text-gray-900 font-medium mb-4">
                    <Calendar className="w-6 h-6 text-primaryColor" />
                    <span className="text-lg">Date and time</span>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-base">{formatDate(event.startDate).fullDate}</p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primaryColor" />
                      {formatTimeRange(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 text-gray-900 font-medium mb-4">
                    {event.locationType === 'online' ? (
                      <Globe className="w-6 h-6 text-gray-500" />
                    ) : (
                      <MapPin className="w-6 h-6 text-gray-500" />
                    )}
                    <span className="text-lg">Location</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    {event.locationType === 'online' ? (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Online Event</span>
                        </p>
                        {event.videoUrl && (
                          <p className="text-sm text-primaryColor">
                            Event link will be provided after registration
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <p>{event.address1}</p>
                        {event.address2 && <p>{event.address2}</p>}
                        <p>{event.city}, {event.state}</p>
                        <p>{event.country}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda */}
            {event.agendas && event.agendas.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Schedule</h2>
                <div className="space-y-6">
                  {event.agendas.map((agenda, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{agenda.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primaryColor" />
                          {formatTimeRange(agenda.startTime, agenda.endTime)}
                        </span>
                        {agenda.host.length > 0 && (
                          <span className="flex items-center gap-2">
                            <span className="font-medium">Hosted by:</span>
                            {agenda.host.join(', ')}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{parser(agenda.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {event.faqs && event.faqs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">FAQ</h2>
                <Accordion type="single" collapsible className="w-full space-y-6">
                  {event.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className='text-lg font-semibold text-gray-900'>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{parser(faq.answer)}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tickets & Organizer */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Tickets Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Select Tickets</h3>
                
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
                      
                    </div>
                  </div>
                </div>

                {/* Get Tickets Button */}
                <button
                  onClick={handleOpenBuyModal}
                  className="w-full mt-5 bg-primaryColor text-white font-medium rounded-xl py-4 hover:bg-indigo-700 
                    transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-200"
                >
                  Get Tickets
                </button>

                {/* Refund Policy */}
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Refundable up to 7 days before the event
                </p>
              </div>

              {/* Organizer Section */}
              {event.organizer && (
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Event Organizer</h3>
                  <div className="flex items-start gap-4">
                    {event.organizer.profileImage && (
                      <div className='w-16 h-16 relative overflow-hidden rounded-full flex-shrink-0'>
                        <img
                          src={event.organizer.profileImage}
                          alt={event.organizer.name}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.organizer.name}</h4>
                      {event.organizer.bio && (
                        <p className="text-sm text-gray-600 mb-4">{event.organizer.bio}</p>
                      )}
                      <div className="space-y-3">
                        {event.organizer.country && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-primaryColor" />
                            <span>{event.organizer.country}</span>
                          </div>
                        )}
                        {event.organizer.website && (
                          <a
                            href={event.organizer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primaryColor hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            Visit Website
                          </a>
                        )}
                        {event.organizer.phone1 && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-primaryColor" />
                            <span>{event.organizer.phone1}</span>
                          </div>
                        )}
                        {event.organizer.phone2 && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-primaryColor" />
                            <span>{event.organizer.phone2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {event?.videoUrl && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            {/* Header with Icon */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-50">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primaryColor" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Event Preview</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Watch a preview of what to expect</p>
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative group">
              {/* Video Container with Gradient Overlay */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-sm max-w-3xl mx-auto">
                <video
                  controls
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  poster={event.images?.[0]}
                  preload="metadata"
                >
                  <source 
                    src={event.videoUrl} 
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 transform transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-gray-600 max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {formatTime(event.startTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formatDate(event.startDate).fullDate}
                  </span>
                </div>
                
                {/* Share Button */}
                <button 
                  className="flex items-center gap-1.5 text-primaryColor hover:text-indigo-700 transition-colors"
                  onClick={() => {/* Add share functionality */}}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 max-w-3xl mx-auto">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">About this video</h3>
                  <p className="mt-0.5 text-xs text-gray-600">
                    Get a sneak peek of the event atmosphere and what you can expect. 
                    This preview showcases highlights from previous editions or upcoming features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBuyModalOpen && (
        <BuyTicketsModel
          eventId={params.id as string}
          eventTitle={event.title}
          eventImage={event.images[0]}
          onClose={handleCloseBuyModal}
          ticketCounts={ticketCounts}
          setTicketCounts={setTicketCounts}
          onProceedToCheckout={handleOpenCheckout}
        />
      )}

     
    </div>
  );
}