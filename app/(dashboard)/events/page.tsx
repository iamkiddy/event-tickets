'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllEvents } from '@/lib/actions/events';
import { useAuth } from '@/lib/context/AuthContext';
import { Event } from '@/lib/models/_events_models';
import { toast } from 'sonner';
import { columns } from './_components/columns';
import { DataTable } from '@/components/ui/data-table';
import { SearchAndFilter } from './_components/SearchAndFilter';

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
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
    if (isAuthenticated) {
      const initialParams = {
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        eventType: searchParams.get('eventType') || undefined,
      };

      fetchEvents(initialParams);
    }
  }, [isAuthenticated, searchParams]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Update URL without refreshing the page
    router.push(`/events?${params.toString()}`, { scroll: false });
    
    // Fetch events with all current params
    const currentParams = {
      search: params.get('search') || undefined,
      category: params.get('category') || undefined,
      eventType: params.get('eventType') || undefined,
    };
    
    fetchEvents(currentParams);
  };

  const handleSearch = (value: string) => updateFilters('search', value);
  const handleCategoryChange = (value: string) => updateFilters('category', value);
  const handleTypeChange = (value: string) => updateFilters('eventType', value);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-sm text-gray-600">Manage your events and track their performance</p>
      </div>

      <SearchAndFilter 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
        initialSearch={searchParams.get('search') || ''}
        initialCategory={searchParams.get('category') || ''}
        initialEventType={searchParams.get('eventType') || ''}
      />

      <DataTable 
        columns={columns}
        data={events}
        isLoading={isLoading}
        total={events.length}
      />
    </div>
  );
}