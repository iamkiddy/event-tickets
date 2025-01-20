/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Share2, Heart, ImageIcon, Globe, Phone, Video, Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getEventDetails } from '@/lib/actions/mainEvent';
import parser from 'html-react-parser';
import { useAuth } from '@/lib/context/AuthContext';
import { AuthenticatedNav, UnauthenticatedNav } from '@/components/ui/authNavbar';
import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { AccordionTrigger } from '@radix-ui/react-accordion';
import { BuyTicketsModel } from './_components/BuyTicketsModel';
import { formatDate2, formatTime, formatTimeRange } from '@/lib/utils';





export default function EventPage() {
  const params = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleOpenBuyModal = () => {
    setIsBuyModalOpen(true);
  };

  const handleCloseBuyModal = () => {
    setIsBuyModalOpen(false);
  };

  const nextImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }
  };

  const previousImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
    }
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
        {/* Background blur effect from the current image */}
        {event.images && event.images.length > 0 ? (
          <>
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${event.images[currentImageIndex]})`,
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
            {/* Main image slider */}
            {event.images && event.images.length > 0 ? (
              <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
                <img
                  src={event.images[currentImageIndex]}
                  alt={`${event.title} - Image ${currentImageIndex + 1}`}
                  className="object-cover w-full h-full transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-lg" />
                
                {/* Navigation arrows - only show if there are multiple images */}
                {event.images.length > 1 && (
                  <>
                    {/* Previous button */}
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all transform hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    {/* Next button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all transform hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {event.images.length}
                    </div>

                    {/* Image dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {event.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
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
                  <span>{formatDate2(event.startDate).fullDate}</span>
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
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 xs:px-4">
          <div className="flex justify-between items-center h-14 xs:h-16 sm:h-18">
            <div className="flex items-center gap-3 xs:gap-4 sm:gap-6">
              {/* Enhanced back button */}
              <button
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full 
                  text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 
                  transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>

              <div className="h-5 w-px bg-gray-200 hidden sm:block" />

              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-xs">
                {event.title}
              </h2>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base 
                  ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'} 
                  transition-colors`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">
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
                    <p className="text-base">{formatDate2(event.startDate).fullDate}</p>
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Buy Tickets</h3>
                
                {/* Ticket types */}
                <div className="space-y-4">
                  {event.tickets && event.tickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primaryColor transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                        <p className="text-sm text-gray-600">{ticket.quantity} remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{ticket.currency} {ticket.price}</p>
                      </div>
                    </div>
                  ))}
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
                {event.isRefundable && (
                  <p className="mt-4 text-sm text-gray-600 text-center">
                    Refundable up to {event.refundDaysBefore} days before the event
                  </p>
                )}
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
                  playsInline
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  poster={event.images?.[0]}
                  preload="metadata"
                  id="eventVideo"
                >
                  <source 
                    src={event.videoUrl} 
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Play Button Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all cursor-pointer"
                  onClick={() => {
                    const video = document.getElementById('eventVideo') as HTMLVideoElement;
                    if (video) {
                      if (video.paused) {
                        video.play().catch(err => console.error('Error playing video:', err));
                      } else {
                        video.pause();
                      }
                    }
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 backdrop-blur-sm rounded-full 
                    flex items-center justify-center border-2 border-white/50 
                    transform transition-transform hover:scale-110"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
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
                    {formatDate2(event.startDate).fullDate}
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
          tickets={event.tickets}
          onClose={handleCloseBuyModal}
          ticketCounts={ticketCounts}
          setTicketCounts={setTicketCounts}
          startDate={formatDate2(event.startDate).fullDate}
          startTime={formatTimeRange(event.startTime, event.endTime)}
        />
      )}

     
    </div>
  );
}