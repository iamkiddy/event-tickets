/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams } from 'next/navigation';
import { EventForm } from '@/app/(dashboard)/events/[id]/_components/eventForm';
import { updateEventFAQ, updateEventAgenda, getEventById, updateEvent } from '@/lib/actions/events';
import { toast } from 'sonner';
import { Check, Image as ImageIcon, Info, Tag, Users, LayoutDashboard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetEventByIdResponse } from '@/lib/models/_events_models';
import { FileList } from './_components/FileList';
import { TicketList } from './_components/TicketList';
import { PublishingList } from './_components/PublishingList';
import { DashboardOverview } from './_components/DashboardOverview';
import { OrderList } from './_components/OrderList';
import { useRouter } from 'next/navigation';

interface StepProps {
  icon: React.ElementType;
  title: string;
  isCompleted?: boolean;
  isActive?: boolean;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

type ActiveForm = 'basic' | 'media' | 'tickets' | 'publishing' | 'dashboard' | 'orders';

const Step = ({ icon: Icon, title, isCompleted, isActive, href, onClick }: StepProps) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
      ${isActive ? 'bg-indigo-50 text-primaryColor font-medium' : 
        isCompleted ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    <div className="relative">
      <Icon className={`w-5 h-5 ${isActive ? 'text-primaryColor' : 'text-gray-500'}`} />
      {isCompleted && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
    <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{title}</span>
  </Link>
);

const BottomNavItem = ({ icon: Icon, title, isActive, onClick }: {
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center px-1 sm:px-2 py-1 ${
      isActive ? 'text-primaryColor' : 'text-gray-500'
    }`}
  >
    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">{title}</span>
  </button>
);

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<GetEventByIdResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<ActiveForm>('tickets');
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch event details');
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // First update the main event data
      const eventUpdateData = {
        title: data.title,
        summary: data.summary,
        overview: data.overview,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        totalCapacity: data.totalCapacity,
        tags: data.tags,
        locationType: data.locationType,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      };

      // Update the main event
      await updateEvent(eventId, eventUpdateData);

      // Update FAQs
      if (data.eventFAQ && data.eventFAQ.length > 0) {
        const faqPromises = data.eventFAQ.map((faq: any) => 
          updateEventFAQ({
            faqId: faq.id || '',
            eventId: eventId,
            question: faq.question,
            answer: faq.answer
          })
        );
        await Promise.all(faqPromises);
      }

      // Update Agenda Items
      if (data.eventAgenda && data.eventAgenda.length > 0) {
        const agendaPromises = data.eventAgenda.map((agenda: any) =>
          updateEventAgenda({
            id: agenda.id || '',
            eventId: eventId,
            title: agenda.title,
            description: agenda.description,
            startTime: agenda.startTime,
            endTime: agenda.endTime,
            host: agenda.host
          })
        );
        await Promise.all(agendaPromises);
      }

      toast.success('Event updated successfully');
      router.refresh(); // Refresh the page to show updated data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepClick = (e: React.MouseEvent<HTMLAnchorElement>, step: string) => {
    e.preventDefault();
    if (step === 'media') {
      setActiveForm('media');
    } else if (step === 'tickets') {
      setActiveForm('tickets');
    } else if (step === 'publishing') {
      setActiveForm('publishing');
    } else if (step === 'dashboard') {
      setActiveForm('dashboard');
    } else if (step === 'orders') {
      setActiveForm('orders');
    } else {
      setActiveForm('basic');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex justify-center items-center min-h-screen">Event not found</div>;
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0 relative">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto p-2 sm:p-4 lg:px-8 lg:py-8">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
          <div className="sticky top-8 space-y-6 lg:space-y-8 bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Event Management Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 lg:mb-4 pb-2 border-b">
                Event Management
              </h3>
              <Step
                icon={LayoutDashboard}
                title="Dashboard"
                isActive={activeForm === 'dashboard'}
                href={`/events/${eventId}/dashboard`}
                onClick={(e) => handleStepClick(e, 'dashboard')}
              />
              <Step
                icon={ShoppingCart}
                title="Orders"
                isActive={activeForm === 'orders'}
                href={`/events/${eventId}/orders`}
                onClick={(e) => handleStepClick(e, 'orders')}
              />
            </div>

            {/* Event Setup Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 lg:mb-4 pb-2 border-b">
                Event Setup
              </h3>
              <Step
                icon={Info}
                title="Basic Info"
                isCompleted={true}
                isActive={activeForm === 'basic'}
                href={`/events/${eventId}/edit`}
                onClick={(e) => handleStepClick(e, 'basic')}
              />
              <Step
                icon={ImageIcon}
                title="Media"
                isActive={activeForm === 'media'}
                href={`/events/${eventId}/upload`}
                onClick={(e) => handleStepClick(e, 'media')}
              />
              <Step
                icon={Tag}
                title="Tickets"
                isActive={activeForm === 'tickets'}
                href={`/events/${eventId}/tickets`}
                onClick={(e) => handleStepClick(e, 'tickets')}
              />
              <Step
                icon={Users}
                title="Publishing"
                isActive={activeForm === 'publishing'}
                href={`/events/${eventId}/publish`}
                onClick={(e) => handleStepClick(e, 'publishing')}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white p-3 sm:p-4 lg:p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-8 pb-2 lg:pb-4 border-b">
              {activeForm === 'basic' ? 'Edit Event' : 
               activeForm === 'dashboard' ? 'Dashboard' :
               activeForm === 'orders' ? 'Orders' :
               activeForm === 'media' ? 'Event Media' :
               activeForm === 'tickets' ? 'Event Tickets' : 'Publishing'}
            </h1>
            
            <div className="space-y-4 lg:space-y-8">
              {activeForm === 'dashboard' ? (
                <DashboardOverview eventId={eventId} />
              ) : activeForm === 'orders' ? (
                <OrderList />
              ) : activeForm === 'publishing' ? (
                <PublishingList eventId={eventId} currentStatus={event.status} />
              ) : activeForm === 'tickets' ? (
                <TicketList eventId={eventId} initialTickets={event.tickets} />
              ) : activeForm === 'basic' ? (
                <EventForm 
                  mode="edit" 
                  initialData={event}
                  onSubmit={handleSubmit}
                  eventId={eventId}
                />
              ) : (
                <FileList eventId={eventId} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex justify-around items-center h-14 sm:h-16 px-1 sm:px-2 max-w-7xl mx-auto">
          <BottomNavItem
            icon={LayoutDashboard}
            title="Dashboard"
            isActive={activeForm === 'dashboard'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'dashboard')}
          />
          <BottomNavItem
            icon={ShoppingCart}
            title="Orders"
            isActive={activeForm === 'orders'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'orders')}
          />
          <BottomNavItem
            icon={Info}
            title="Basic"
            isActive={activeForm === 'basic'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'basic')}
          />
          <BottomNavItem
            icon={ImageIcon}
            title="Media"
            isActive={activeForm === 'media'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'media')}
          />
          <BottomNavItem
            icon={Tag}
            title="Tickets"
            isActive={activeForm === 'tickets'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'tickets')}
          />
          <BottomNavItem
            icon={Users}
            title="Publish"
            isActive={activeForm === 'publishing'}
            onClick={() => handleStepClick({ preventDefault: () => {} } as any, 'publishing')}
          />
        </div>
      </div>
    </div>
  );
} 