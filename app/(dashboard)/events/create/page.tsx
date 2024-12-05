'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Info, X } from 'lucide-react';

interface EventFAQ {
  question: string;
  answer: string;
}

interface EventAgendaItem {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: string[];
}

interface EventFormData {
  title: string;
  summary: string;
  overview: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  totalCapacity: number;
  tags: string[];
  locationType: 'venue' | 'online';
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  eventFAQ: EventFAQ[];
  eventAgenda: EventAgendaItem[];
}

export default function CreateEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    summary: '',
    overview: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    totalCapacity: 0,
    tags: [],
    locationType: 'venue',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    eventFAQ: [],
    eventAgenda: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      eventFAQ: [...prev.eventFAQ, { question: '', answer: '' }]
    }));
  };

  const addAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      eventAgenda: [...prev.eventAgenda, {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        host: []
      }]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create an event</h1>
        <p className="text-sm text-gray-600 mt-1">Fill in the details below to create your event</p>
      </div>

      <form className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Info</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give it a short distinct name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Brief summary of your event"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows={4}
                placeholder="Detailed description of your event"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
              />
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Date and Time</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date/Time */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
              </div>
            </div>

            {/* End Date/Time */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, locationType: 'venue' }))}
                className={`flex-1 p-4 border rounded-lg text-center hover:border-primaryColor
                  ${formData.locationType === 'venue' ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
              >
                <MapPin className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <span className="block text-sm font-medium">Venue</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, locationType: 'online' }))}
                className={`flex-1 p-4 border rounded-lg text-center hover:border-primaryColor
                  ${formData.locationType === 'online' ? 'border-primaryColor bg-indigo-50' : 'border-gray-200'}`}
              >
                <Info className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <span className="block text-sm font-medium">Online Event</span>
              </button>
            </div>

            {formData.locationType === 'venue' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Event FAQ</h2>
            <button
              type="button"
              onClick={addFAQ}
              className="text-primaryColor hover:text-indigo-700 font-medium text-sm"
            >
              + Add Question
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.eventFAQ.map((faq, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const newFAQs = [...formData.eventFAQ];
                      newFAQs[index].question = e.target.value;
                      setFormData(prev => ({ ...prev, eventFAQ: newFAQs }));
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFAQs = [...formData.eventFAQ];
                      newFAQs[index].answer = e.target.value;
                      setFormData(prev => ({ ...prev, eventFAQ: newFAQs }));
                    }}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Agenda Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Event Agenda</h2>
            <button
              type="button"
              onClick={addAgendaItem}
              className="text-primaryColor hover:text-indigo-700 font-medium text-sm"
            >
              + Add Agenda Item
            </button>
          </div>
          
          <div className="space-y-6">
            {formData.eventAgenda.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900">Agenda Item {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newAgenda = [...formData.eventAgenda];
                      newAgenda.splice(index, 1);
                      setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const newAgenda = [...formData.eventAgenda];
                      newAgenda[index].title = e.target.value;
                      setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                    }}
                    placeholder="Session title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newAgenda = [...formData.eventAgenda];
                      newAgenda[index].description = e.target.value;
                      setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                    }}
                    rows={2}
                    placeholder="Session description"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => {
                        const newAgenda = [...formData.eventAgenda];
                        newAgenda[index].startTime = e.target.value;
                        setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => {
                        const newAgenda = [...formData.eventAgenda];
                        newAgenda[index].endTime = e.target.value;
                        setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Host(s)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.host.map((host, hostIndex) => (
                      <div 
                        key={hostIndex}
                        className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200"
                      >
                        <span>{host}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newAgenda = [...formData.eventAgenda];
                            newAgenda[index].host = newAgenda[index].host.filter((_, i) => i !== hostIndex);
                            setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add host"
                      className="flex-1 min-w-[150px] px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            const newAgenda = [...formData.eventAgenda];
                            newAgenda[index].host.push(input.value.trim());
                            setFormData(prev => ({ ...prev, eventAgenda: newAgenda }));
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Press Enter to add a host</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primaryColor text-white rounded-lg 
              hover:bg-indigo-700 transition-colors"
          >
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
