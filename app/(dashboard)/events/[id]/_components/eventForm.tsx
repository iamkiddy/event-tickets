/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { MapPin, Info, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  updateEventFAQ, 
  updateEventAgenda, 
  deleteEventFAQ,
  deleteEventAgenda 
} from '@/lib/actions/events';
import { Editor } from '@/components/ui/editor';
import { CreateEvent } from '@/lib/models/_events_models';

interface EventFAQ {
  id: string;
  question: string;
  answer: string;
}

interface EventAgendaItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: string[]; 
}

interface EventFormProps {
  initialData?: Partial<CreateEvent>;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateEvent) => Promise<void>;
  eventId?: string;
}

export function EventForm({ initialData, mode, onSubmit, eventId }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEvent>({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    overview: initialData?.overview || '',
    startDate: initialData?.startDate || '',
    startTime: initialData?.startTime || '',
    endDate: initialData?.endDate || '',
    endTime: initialData?.endTime || '',
    totalCapacity: initialData?.totalCapacity || 0,
    tags: initialData?.tags || [],
    locationType: initialData?.locationType || 'venue',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || '',
    postalCode: initialData?.postalCode || '',
    eventFAQ: initialData?.eventFAQ || [],
    eventAgenda: initialData?.eventAgenda || [],
  });

  const addFAQ = () => {
    setFormData({
      ...formData,
      eventFAQ: [...formData.eventFAQ, { 
        id: '', // Empty ID for new FAQs
        question: '', 
        answer: '' 
      }]
    });
  };

  const removeFAQ = async (index: number) => {
    const faq = formData.eventFAQ[index];
    const newFAQ = [...formData.eventFAQ];
    newFAQ.splice(index, 1);
    setFormData({ ...formData, eventFAQ: newFAQ });

    // If in edit mode and FAQ has an ID, delete it from the server
    if (mode === 'edit' && eventId && faq.id) {
      try {
        await deleteEventFAQ({
          eventId,
          faqId: faq.id
        });
        toast.success('FAQ deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete FAQ');
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQ = [...formData.eventFAQ];
    newFAQ[index] = { ...newFAQ[index], [field]: value };
    setFormData({ ...formData, eventFAQ: newFAQ });
  };

  const addAgendaItem = () => {
    setFormData({
      ...formData,
      eventAgenda: [...formData.eventAgenda, {
        id: '', // Empty ID for new agenda items
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        host: []
      }]
    });
  };

  const removeAgendaItem = async (index: number) => {
    const agenda = formData.eventAgenda[index];
    const newAgenda = [...formData.eventAgenda];
    newAgenda.splice(index, 1);
    setFormData({ ...formData, eventAgenda: newAgenda });

    // If in edit mode and agenda item has an ID, delete it from the server
    if (mode === 'edit' && eventId && agenda.id) {
      try {
        await deleteEventAgenda({
          eventId,
          agendaId: agenda.id
        });
        toast.success('Agenda item deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete agenda item');
        console.error('Error deleting agenda item:', error);
      }
    }
  };

  const updateAgendaItem = (index: number, field: string, value: any) => {
    const newAgenda = [...formData.eventAgenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };
    setFormData({ ...formData, eventAgenda: newAgenda });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        // For create mode, submit all data including new FAQs and agenda items
        await onSubmit(formData);
      } else {
        // For edit mode, handle existing items differently
        const mainFormData = {
          ...formData,
          eventFAQ: formData.eventFAQ.filter(faq => faq.id),
          eventAgenda: formData.eventAgenda.filter(agenda => agenda.id)
        };

        await onSubmit(mainFormData);

        // Handle new FAQs and agenda items for edit mode
        if (eventId) {
          const faqPromises = formData.eventFAQ.map(async faq => {
            if (!faq.id) {
              await updateEventFAQ({
                eventId,
                question: faq.question,
                answer: faq.answer
              });
            }
          });

          const agendaPromises = formData.eventAgenda.map(async agenda => {
            if (!agenda.id) {
              await updateEventAgenda({
                eventId,
                title: agenda.title,
                description: agenda.description,
                startTime: agenda.startTime,
                endTime: agenda.endTime,
                host: agenda.host || []
              });
            }
          });

          await Promise.all([...faqPromises, ...agendaPromises]);
        }
      }

      toast.success(`Event ${mode === 'create' ? 'created' : 'updated'} successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} event`);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleOverviewChange = (value: string) => {
    setFormData(prev => ({ ...prev, overview: value }));
  };

  const handleFAQUpdate = async (faq: EventFAQ & { id: string }) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }

      console.log('Updating FAQ:', { eventId, faqId: faq.id }); // Debug log
      
      await updateEventFAQ({
        eventId: eventId,
        faqId: faq.id,
        question: faq.question,
        answer: faq.answer
      });
      toast.success('FAQ updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update FAQ');
      console.error('Error updating FAQ:', error);
    }
  };

  const handleAgendaUpdate = async (agenda: EventAgendaItem & { id: string }) => {
    try {
      if (!eventId) {
        toast.error('Event ID is missing');
        return;
      }
      
      await updateEventAgenda({
        id: agenda.id,
        eventId: eventId,
        title: agenda.title,
        description: agenda.description,
        startTime: agenda.startTime,
        endTime: agenda.endTime,
        host: agenda.host
      });
      toast.success('Agenda item updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update agenda item');
      console.error('Error updating agenda:', error);
    }
  };

  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) {
        const tag = value.startsWith('#') ? value : `#${value}`;
        if (!formData.tags.includes(tag)) {
          setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter event title..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary
          </label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleSummaryChange}
            placeholder="Enter event summary..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
          />
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overview
          </label>
          <Editor
            value={formData.overview}
            onChange={handleOverviewChange}
            placeholder="Enter event overview..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                    bg-primaryColor/10 text-primaryColor"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primaryColor hover:text-primaryColor/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a tag and press Enter (e.g., #hiphop)"
              onKeyDown={handleTagsChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
            />
          </div>
        </div>

        {/* Total Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Capacity
          </label>
          <input
            type="number"
            name="totalCapacity"
            value={formData.totalCapacity === 0 ? '' : formData.totalCapacity}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value));
              setFormData({ ...formData, totalCapacity: value });
            }}
            min="0"
            placeholder="Enter total capacity"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Date and Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <DateTimePicker
              label="Start Date and Time"
              date={formData.startDate && formData.startTime ? 
                new Date(`${formData.startDate}T${formData.startTime}`) : undefined}
              setDate={(date) => {
                if (date) {
                  setFormData({
                    ...formData,
                    startDate: format(date, 'yyyy-MM-dd'),
                    startTime: format(date, 'HH:mm')
                  });
                }
              }}
            />
          </div>

          <div className="space-y-4">
            <DateTimePicker
              label="End Date and Time"
              date={formData.endDate && formData.endTime ? 
                new Date(`${formData.endDate}T${formData.endTime}`) : undefined}
              setDate={(date) => {
                if (date) {
                  setFormData({
                    ...formData,
                    endDate: format(date, 'yyyy-MM-dd'),
                    endTime: format(date, 'HH:mm')
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Location</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, locationType: 'venue' })}
              className={`flex-1 p-3 sm:p-4 border rounded-lg text-center hover:border-primaryColor
                ${formData.locationType === 'venue' ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
            >
              <MapPin className="mx-auto h-6 w-6 text-gray-400 mb-2" />
              <span className="block text-sm font-medium">Venue</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, locationType: 'online' })}
              className={`flex-1 p-3 sm:p-4 border rounded-lg text-center hover:border-primaryColor
                ${formData.locationType === 'online' ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
            >
              <Info className="mx-auto h-6 w-6 text-gray-400 mb-2" />
              <span className="block text-sm font-medium">Online Event</span>
            </button>
          </div>

          {formData.locationType === 'venue' && (
            <div className="space-y-4">
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="Address Line 1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Address Line 2"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Postal Code"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          <button
            type="button"
            onClick={addFAQ}
            className="w-full sm:w-auto px-4 py-2 text-sm text-primaryColor hover:bg-indigo-50 rounded-lg border border-indigo-200"
          >
            <Plus className="w-4 h-4 inline-block mr-1" />
            Add FAQ
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.eventFAQ.map((faq: EventFAQ & { id: string }, index: number) => (
            <div key={faq.id || index} className="relative border border-gray-200 rounded-lg p-4">
              <div className="flex justify-end gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {mode === 'edit' && faq.id && (
                  <button
                    type="button"
                    onClick={() => handleFAQUpdate(faq)}
                    className="px-3 py-1 text-xs bg-primaryColor text-white rounded-md 
                      hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  placeholder="Question"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  placeholder="Answer"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agenda Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Event Agenda</h2>
          <button
            type="button"
            onClick={addAgendaItem}
            className="w-full sm:w-auto px-4 py-2 text-sm text-primaryColor hover:bg-indigo-50 rounded-lg border border-indigo-200"
          >
            <Plus className="w-4 h-4 inline-block mr-1" />
            Add Agenda Item
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.eventAgenda.map((item: EventAgendaItem & { id: string }, index: number) => (
            <div key={item.id || index} className="relative border border-gray-200 rounded-lg p-4">
              <div className="flex justify-end gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => removeAgendaItem(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {mode === 'edit' && item.id && (
                  <button
                    type="button"
                    onClick={() => handleAgendaUpdate(item)}
                    className="px-3 py-1 text-xs bg-primaryColor text-white rounded-md 
                      hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateAgendaItem(index, 'description', e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={item.startTime}
                    onChange={(e) => updateAgendaItem(index, 'startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <input
                    type="time"
                    value={item.endTime}
                    onChange={(e) => updateAgendaItem(index, 'endTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  value={item.host.join(', ')}
                  onChange={(e) => updateAgendaItem(index, 'host', e.target.value.split(',').map(h => h.trim()))}
                  placeholder="Host names (comma-separated)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-indigo-700 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}