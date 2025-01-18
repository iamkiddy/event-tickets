/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createEvent } from '@/lib/actions/events';
import { EventForm } from '@/app/(dashboard)/events/[id]/_components/eventForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      console.log('Submitting event data:', data);
      const response = await createEvent(data);
      console.log('Create event response:', response);
      
      if (!response?.eventId) {
        throw new Error('No event ID received from server');
      }
      
      toast.success('Event created successfully');
      router.push(`/events/${response.eventId}/upload`);
    } catch (error: any) {
      const errorMessage = typeof error === 'object' ? 
        error.message || JSON.stringify(error) : 
        'Failed to create event';
      console.error('Error details:', {
        originalError: error,
        formattedMessage: errorMessage
      });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <EventForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
