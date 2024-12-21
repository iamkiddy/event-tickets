'use client';

import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  FileText,
  Users,
  ChevronDown,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuickLink {
  title: string;
  description: string;
  icon: LucideIcon;
}

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
];

const quickLinks: QuickLink[] = [
  {
    title: 'Getting Started Guide',
    description: 'Learn how to create and publish your first event',
    icon: Book,
  },
  {
    title: 'API Documentation',
    description: 'Detailed guides and documentation for all features',
    icon: FileText,
  },
  {
    title: 'Best Practices',
    description: 'Tips and best practices for event organizers',
    icon: Users,
  },
];

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (question: string) => {
    setExpandedFAQ(expandedFAQ === question ? null : question);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for help..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link: QuickLink) => (
            <div
              key={link.title}
              className="p-4 border border-gray-200 rounded-lg hover:border-primaryColor 
                hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <link.icon className="h-5 w-5 text-primaryColor" />
                <h3 className="font-medium">{link.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">{link.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq: FAQ) => (
            <div
              key={faq.question}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
                onClick={() => toggleFAQ(faq.question)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedFAQ === faq.question ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFAQ === faq.question && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Need More Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="h-5 w-5 text-primaryColor" />
              <h3 className="font-medium">Email Support</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Get in touch with our support team for personalized help
            </p>
            <Button className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white">
              Send Email
            </Button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <MessageCircle className="h-5 w-5 text-primaryColor" />
              <h3 className="font-medium">Live Chat</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Chat with our support team in real-time
            </p>
            <Button className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white">
              Start Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}