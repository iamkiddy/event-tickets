'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEventFinalStage, publishEvent, getOrganiserUtils, getUtilsCategories, getUtilsEventTypes } from '@/lib/actions/events';
import { GetOrganizerUtils, UtilsCategoriesResponse, UtilsEventTypesResponse } from '@/lib/models/_events_models';
import { Switch } from "@/components/ui/switch";

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
  const [categories, setCategories] = useState<UtilsCategoriesResponse[]>([]);
  const [eventTypes, setEventTypes] = useState<UtilsEventTypesResponse[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [publishData, setPublishData] = useState({
    organizer: "",
    category: "",
    subcategory: "",
    eventType: "",
    isPublished: true,
    isRefundable: true,
    daysBefore: 7
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel for better performance
        const [eventData, organiserData, categoryData, eventTypeData] = await Promise.all([
          getEventFinalStage(eventId),
          getOrganiserUtils(),
          getUtilsCategories(),
          getUtilsEventTypes()
        ]);

        // Set the utils data
        setOrganisers(Array.isArray(organiserData) ? organiserData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setEventTypes(Array.isArray(eventTypeData) ? eventTypeData : []);

        // Set subcategories based on the category from server
        if (eventData.category) {
          const selectedCategory = categoryData.find(cat => cat.id === eventData.category);
          if (selectedCategory?.subCategories) {
            setSubCategories(selectedCategory.subCategories);
          }
        }

        // Set all form data from server using the exact field names from the API response
        const formData = {
          organizer: eventData.organizer || '',
          category: eventData.category || '',
          subcategory: eventData.subcategory || '',
          eventType: eventData.eventType || '',
          isPublished: eventData.isPublished ?? true,
          isRefundable: eventData.isRefundable ?? true,
          daysBefore: eventData.daysBefore ?? 7
        };
        
        console.log('Setting form data:', formData); // Debug log
        setPublishData(formData);

        // Set publication status
        setStatus(eventData.isPublished ? 'published' : 'draft');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch event details');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find((category) => category.id === categoryId);
    
    setPublishData({
      ...publishData,
      category: categoryId,
      subcategory: selectedCategory?.subCategories?.includes(publishData.subcategory) 
        ? publishData.subcategory 
        : selectedCategory?.subCategories?.[0] || ''
    });

    if (selectedCategory?.subCategories) {
      setSubCategories(selectedCategory.subCategories);
    } else {
      setSubCategories([]);
    }
  };

  const handlePublish = async () => {
    // Check if organizer and category are filled
    if (!publishData.organizer || !publishData.category) {
      toast.error('Please fill in all required fields (Organizer and Category)');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToPublish = {
        ...publishData,
        subcategory: subCategories.length === 0 ? '' : publishData.subcategory
      };
      
      console.log('Updating event with data:', dataToPublish);

      const response = await publishEvent(eventId, dataToPublish);
      
      setStatus(publishData.isPublished ? 'published' : 'draft');
      toast.success(response.message || 'Event updated successfully');
    } catch (error) {
      let errorMessage = 'Failed to update event';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        console.error('API Error details:', error);
        const apiError = error as { message?: string };
        errorMessage = apiError.message || errorMessage;
      }
      
      toast.error(errorMessage);
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
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Details</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer *
              </label>
              <Select
                value={publishData.organizer}
                onValueChange={(value) => setPublishData({ ...publishData, organizer: value })}
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
                Event Type *
              </label>
              <Select
                value={publishData.eventType}
                onValueChange={(value) => setPublishData({ ...publishData, eventType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type (e.g., Conference, Workshop)" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
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
                value={publishData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              {subCategories.length > 0 ? (
                <Select
                  value={publishData.subcategory}
                  onValueChange={(value) => setPublishData({ ...publishData, subcategory: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {subCategories.map((subCategory) => (
                      <SelectItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-gray-500 p-2 border rounded-md bg-gray-50">
                  No subcategories available for this category
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              <div className="flex items-center gap-2 w-full sm:w-auto">
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
            <div className="mt-1 flex-shrink-0">
              {status === 'draft' ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : (
                <Globe className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {status === 'draft' ? 'Draft' : 'Published'}
                </h3>
                <Switch
                  checked={status === 'published'}
                  onCheckedChange={async (checked) => {
                    try {
                      setIsSubmitting(true);
                      const dataToUpdate = {
                        ...publishData,
                        isPublished: checked,
                        subcategory: subCategories.length === 0 ? '' : publishData.subcategory
                      };
                      
                      console.log('Updating publish status with data:', dataToUpdate);
                      
                      const response = await publishEvent(eventId, dataToUpdate);
                      
                      setStatus(checked ? 'published' : 'draft');
                      setPublishData({ ...publishData, isPublished: checked });
                      toast.success(response.message || 'Status updated successfully');
                    } catch (error) {
                      let errorMessage = 'Failed to update status';
                      
                      if (error instanceof Error) {
                        errorMessage = error.message;
                      } else if (typeof error === 'object' && error !== null) {
                        console.error('API Error details:', error);
                        const apiError = error as { message?: string };
                        errorMessage = apiError.message || errorMessage;
                      }
                      
                      toast.error(errorMessage);
                      // Revert the UI state on error
                      setStatus(publishData.isPublished ? 'published' : 'draft');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {status === 'draft' ? 
                  'Your event is not visible to the public yet.' :
                  'Your event is live and visible to everyone.'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="w-full bg-primaryColor hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Steps</h2>
        <div className="space-y-3 sm:space-y-4">
          <ChecklistItem
            title="Basic Information"
            description="Add event title, date, time, and description"
            isCompleted={true}
          />
          <ChecklistItem
            title="Media"
            description="Upload event images and videos"
            isCompleted={true}
          />
          <ChecklistItem
            title="Tickets"
            description="Create and configure ticket types"
            isCompleted={true}
          />
          <ChecklistItem
            title="Publishing Details"
            description="Set organizer, category, and registration options"
            isCompleted={!!publishData.organizer && !!publishData.category}
          />
        </div>
      </div>
    </div>
  );
}