'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PublishingListProps {
  eventId: string;
  currentStatus?: 'draft' | 'published' | 'private';
}

export function PublishingList({ eventId, currentStatus = 'draft' }: PublishingListProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      // Add your publish API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setStatus('published');
      toast.success('Event published successfully');
    } catch (error) {
      toast.error('Failed to publish event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakePrivate = async () => {
    setIsSubmitting(true);
    try {
      // Add your make private API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setStatus('private');
      toast.success('Event set to private');
    } catch (error) {
      toast.error('Failed to make event private');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Status</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="mt-1">
              {status === 'draft' ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : status === 'published' ? (
                <Globe className="w-5 h-5 text-green-500" />
              ) : (
                <Lock className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {status === 'draft' ? 'Draft' : 
                 status === 'published' ? 'Published' : 'Private'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {status === 'draft' ? 
                  'Your event is not visible to the public yet.' :
                 status === 'published' ? 
                  'Your event is live and visible to everyone.' :
                  'Only people with the link can view this event.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handlePublish}
              disabled={isSubmitting || status === 'published'}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {status === 'published' ? 'Published' : 'Publish Event'}
            </Button>
            <Button
              onClick={handleMakePrivate}
              disabled={isSubmitting || status === 'private'}
              variant="outline"
              className="flex-1"
            >
              {status === 'private' ? 'Private' : 'Make Private'}
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