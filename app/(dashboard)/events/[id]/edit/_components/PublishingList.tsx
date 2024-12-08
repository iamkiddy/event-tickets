'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface PublishEventRequest {
  organizer: string;
  category: string;
  subcategory: string;
  registrationUrl: string;
  isPublished: boolean;
  isRefundable: boolean;
  daysBefore: number;
}

interface PublishingListProps {
  eventId: string;
  currentStatus?: 'draft' | 'published' | 'private';
}

export function PublishingList({ eventId, currentStatus = 'draft' }: PublishingListProps) {
  const [status, setStatus] = useState<'draft' | 'published' | 'private'>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishData, setPublishData] = useState<PublishEventRequest>({
    organizer: '',
    category: '',
    subcategory: '',
    registrationUrl: '',
    isPublished: true,
    isRefundable: true,
    daysBefore: 7
  });

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      // Add your publish API call here with publishData
      await new Promise(resolve => setTimeout(resolve, 1000)); // Replace with actual API call
      setStatus('published');
      toast.success('Event published successfully');
    } catch (error) {
      toast.error('Failed to publish event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Details</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer
              </label>
              <Input
                value={publishData.organizer}
                onChange={(e) => setPublishData({ ...publishData, organizer: e.target.value })}
                className="w-full"
                placeholder="Enter organizer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Input
                value={publishData.category}
                onChange={(e) => setPublishData({ ...publishData, category: e.target.value })}
                className="w-full"
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <Input
                value={publishData.subcategory}
                onChange={(e) => setPublishData({ ...publishData, subcategory: e.target.value })}
                className="w-full"
                placeholder="Enter subcategory"
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
                  onChange={(e) => setPublishData({ ...publishData, daysBefore: Number(e.target.value) })}
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
              {status === 'published' ? 'Published' : 'Publish Event'}
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