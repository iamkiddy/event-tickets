'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I create a new event?',
    answer: 'To create a new event, click the "Create Event" button in your dashboard. Fill in the event details including title, date, location, and description. You can also add custom tickets, promotional images, and set up registration forms.',
  },
  {
    question: 'How do I process refunds?',
    answer: 'To process a refund, go to the Orders section, find the order you want to refund, and click "View Details". Then click the "Refund" button and follow the prompts. You can choose to refund the full amount or a partial amount.',
  },
  {
    question: 'Can I customize email notifications?',
    answer: 'Yes, you can customize all email notifications in the Settings > Email Templates section. You can modify the content, design, and timing of confirmation emails, reminders, and other automated communications.',
  },
  {
    question: 'How do I export attendee data?',
    answer: 'To export attendee data, go to the Attendees section of your event, click the "Export" button, and choose your preferred format (CSV or Excel). You can select which data fields to include in the export.',
  },
  {
    question: 'What payment methods do you support?',
    answer: 'We support various payment methods including credit/debit cards (Visa, Mastercard) and mobile money payments (MTN, Vodafone, AirtelTigo). All transactions are secure and processed through our trusted payment partners.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team through multiple channels: email support, live chat, or by submitting a ticket through your dashboard. We aim to respond to all inquiries within 24 hours.',
  }
];

const categories = [
  'All',
  'Getting Started',
  'Payments',
  'Event Management',
  'Tickets',
  'Account Settings',
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about using our platform
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for answers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-primaryColor text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-base font-medium text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 pt-2">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No matching questions found.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="/help" className="text-primaryColor hover:text-primaryColor/90 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
