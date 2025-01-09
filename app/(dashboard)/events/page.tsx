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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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

  const handlePageChange = (page: number) => {
    updateFilters('page', page.toString());
  };

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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default function EventsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    if (!authLoading && !isAuthenticated) {
      // Store the current path before redirecting
      sessionStorage.setItem('previousPath', window.location.pathname);
      router.push('/sign-in');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primaryColor border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-xs sm:text-sm text-gray-600">Manage your events and track their performance</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Suspense fallback={<div>Loading events...</div>}>
          <EventContent />
        </Suspense>
      </div>
    </div>
  );
}
