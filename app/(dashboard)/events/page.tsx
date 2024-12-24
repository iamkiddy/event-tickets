'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllEvents } from '@/lib/actions/events';
import { useAuth } from '@/lib/context/AuthContext';
import { Event } from '@/lib/models/_events_models';
import { toast } from 'sonner';
import { createColumns } from './_components/columns';
import { DataTable } from '@/components/ui/data-table';
import { SearchAndFilter } from './_components/SearchAndFilter';

// Client component that uses searchParams
const EventContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async (params?: { search?: string; category?: string; eventType?: string }) => {
    try {
      setIsLoading(true);
      const response = await getAllEvents(params);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialParams = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      eventType: searchParams.get('eventType') || undefined,
    };
    fetchEvents(initialParams);
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/events?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (value: string) => updateFilters('search', value);
  const handleCategoryChange = (value: string) => updateFilters('category', value);
  const handleTypeChange = (value: string) => updateFilters('eventType', value);

  const eventColumns = createColumns({
    onRefresh: () => fetchEvents({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      eventType: searchParams.get('eventType') || undefined,
    })
  });

  return (
    <>
      <SearchAndFilter 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        initialSearch={searchParams.get('search') || ''}
        initialCategory={searchParams.get('category') || ''}
        initialEventType={searchParams.get('eventType') || ''}
      />

      <DataTable 
        columns={eventColumns}
        data={events}
        isLoading={isLoading}
        total={events.length}
      />
    </>
  );
};

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-xs sm:text-sm text-gray-600">Manage your events and track their performance</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Suspense wrapper around EventContent */}
        <Suspense fallback={<div>Loading events...</div>}>
          <EventContent />
        </Suspense>
      </div>
    </div>
  );
}
