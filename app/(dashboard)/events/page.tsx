'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllEvents } from '@/lib/actions/events';
import { useAuth } from '@/lib/context/AuthContext';
import { Event } from '@/lib/models/_events_models';
import { toast } from 'sonner';
import { columns } from './_components/columns';
import { DataTable } from '@/components/ui/data-table';

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getAllEvents();
        setEvents(response.data);
      } catch (error) {
        toast.error('Failed to fetch events');
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, router]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-sm text-gray-600">Manage your events and track their performance</p>
      </div>

      <DataTable 
        columns={columns}
        data={events}
        isLoading={isLoading}
        total={events.length}
      />
    </div>
  );
}