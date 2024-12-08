'use client';

import { createEvent } from '@/lib/actions/events';
import { EventForm } from '@/app/(dashboard)/events/[id]/_components/eventForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateEventResponse } from '@/lib/models/_events_models';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await createEvent(data);
      toast.success('Event created successfully');
      // Navigate to the upload page with the new event ID
      router.push(`/events/${response.eventId}/upload`);
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <EventForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
