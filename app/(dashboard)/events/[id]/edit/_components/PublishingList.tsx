'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEventFinalStage, publishEvent, getOrganiserUtils, getUtilsCategories } from '@/lib/actions/events';
import { PublishEventRequest, GetOrganizerUtils, UtilsCategoriesResponse } from '@/lib/models/_events_models';
import   {MultiSelect} from "@/components/ui/multiSelect"

interface PublishingListProps {
  eventId: string;
  currentStatus?: 'draft' | 'published' | 'private';
}

interface ChecklistItemProps {
  title: string;
  description: string;
  isCompleted: boolean;
}



function ChecklistItem({ title, description, isCompleted }: ChecklistItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1
        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

export function PublishingList({ eventId, currentStatus = 'draft' }: PublishingListProps) {
  const [status, setStatus] = useState<'draft' | 'published' | 'private'>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organisers, setOrganisers] = useState<GetOrganizerUtils[]>([]);
  const [categories, setCategories] = useState<UtilsCategoriesResponse[]>([]);  // State for categories
  const [subCategories, setSubCategories] = useState<string[]>([]); // State for subcategories based on selected category
  const [publishData, setPublishData] = useState<PublishEventRequest>({
    organiser: '',
    category: '',  // This will store the category ID
    subCategories: [],  // Store selected subcategories as an array
    registrationUrl: '',
    isPublished: true,
    isRefundable: true,
    daysBefore: 7
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event data, organisers, and categories
        const [eventData, organiserData, categoryData] = await Promise.all([
          getEventFinalStage(eventId),
          getOrganiserUtils(),
          getUtilsCategories() // Fetch categories
        ]);

        // Ensure organiserData is an array
        if (Array.isArray(organiserData)) {
          setOrganisers(organiserData);
        } else {
          console.error('Expected organiserData to be an array, received:', organiserData);
          setOrganisers([]); // Fallback to empty array
        }

        // Set categories (ensure categoryData is an array)
        if (Array.isArray(categoryData)) {
          setCategories(categoryData); // categoryData should be an array of objects with id, name, subCategories
        } else {
          console.error('Expected categoryData to be an array, received:', categoryData);
          setCategories([]); // Fallback to empty array
        }

        // Set publish data
        setPublishData({
          organiser: eventData.organiser || '',
          category: eventData.category || '',  // category ID should be set here
          subCategories: eventData.subCategories || [],
          registrationUrl: eventData.registrationUrl || '',
          isPublished: eventData.isPublished,
          isRefundable: eventData.isRefundable,
          daysBefore: eventData.daysBefore
        });

        setStatus(eventData.isPublished ? 'published' : 'draft');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch event details');
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  // Update subcategories based on selected category
  const handleCategoryChange = (categoryId: string) => {
    setPublishData({
      ...publishData,
      category: categoryId,
      subCategories: [] // Clear subcategories on category change
    });

    const selectedCategory = categories.find((category) => category.id === categoryId);
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories);
    }
  };

  const handlePublish = async () => {
    if (!publishData.organiser || !publishData.category || publishData.subCategories.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await publishEvent(eventId, publishData);
      setStatus('published');
      toast.success('Event published successfully');
    } catch (error) {
      console.error('Error publishing event:', error);
      toast.error('Failed to publish event');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Details</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer *
              </label>
              <Select
                value={publishData.organiser}
                onValueChange={(value) => setPublishData({ ...publishData, organiser: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organizer" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {organisers.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select
                value={publishData.category}  // This is now the category ID
                onValueChange={handleCategoryChange}  // Update subcategories based on category selection
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>  {/* Use the category ID as the value */}
                      {category.name}  {/* Display the name to the user */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategories *
              </label>
              <MultiSelect
                  value={publishData.subCategories}
                  onValueChange={(value) => setPublishData({ ...publishData, subCategories: value })}
                  options={subCategories}
                  placeholder="Select subcategories"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration URL
              </label>
              <Input
                value={publishData.registrationUrl}
                onChange={(e) => setPublishData({ ...publishData, registrationUrl: e.target.value })}
                className="w-full"
                placeholder="Enter registration URL"
                type="url"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={publishData.isRefundable}
                onChange={(e) => setPublishData({ ...publishData, isRefundable: e.target.checked })}
                className="rounded border-gray-300 text-primaryColor focus:ring-primaryColor"
              />
              <span className="text-sm text-gray-700">Allow Refunds</span>
            </label>
            {publishData.isRefundable && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={publishData.daysBefore}
                  onChange={(e) => setPublishData({ ...publishData, daysBefore: Math.max(0, Number(e.target.value)) })}
                  className="w-20"
                  min={0}
                />
                <span className="text-sm text-gray-700">days before event</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="mt-1">
              {status === 'draft' ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : (
                <Globe className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {status === 'draft' ? 'Draft' : 'Published'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {status === 'draft' ? 
                  'Your event is not visible to the public yet.' :
                  'Your event is live and visible to everyone.'}
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={handlePublish}
              disabled={isSubmitting || status === 'published'}
              className="w-full bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {isSubmitting ? 'Publishing...' : status === 'published' ? 'Published' : 'Publish Event'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Checklist</h2>
        <div className="space-y-4">
          <ChecklistItem
            title="Basic Information"
            description="Add event title, date, and description"
            isCompleted={true}
          />
          <ChecklistItem
            title="Media"
            description="Upload at least one event image"
            isCompleted={true}
          />
          <ChecklistItem
            title="Tickets"
            description="Create at least one ticket type"
            isCompleted={true}
          />
        </div>
      </div>
    </div>
  );
}
