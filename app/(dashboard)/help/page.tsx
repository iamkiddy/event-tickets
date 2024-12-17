'use client';

import { useState } from 'react';
import {
  Search,
  Book,
  LifeBuoy,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  ChevronRight,
  PlayCircle,
  Calendar,
  CreditCard,
  Users,
  Settings,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const quickStartGuides = [
  {
    title: 'Creating Your First Event',
    description: 'Learn how to create and publish your first event',
    icon: Calendar,
    link: '#',
  },
  {
    title: 'Setting Up Payments',
    description: 'Configure your payment methods and pricing',
    icon: CreditCard,
    link: '#',
  },
  {
    title: 'Managing Attendees',
    description: 'Handle registrations and attendee communications',
    icon: Users,
    link: '#',
  },
  {
    title: 'Event Settings',
    description: 'Customize your event settings and preferences',
    icon: Settings,
    link: '#',
  },
];

const faqs = [
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

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team
        </p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStartGuides.map((guide) => (
          <Card key={guide.title} className="hover:border-primaryColor transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primaryColor/10 flex items-center justify-center">
                  <guide.icon className="w-6 h-6 text-primaryColor" />
                </div>
                <div>
                  <CardTitle className="text-base">{guide.title}</CardTitle>
                  <CardDescription className="mt-1">{guide.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-primaryColor" />
              <CardTitle>Documentation</CardTitle>
            </div>
            <CardDescription>
              Detailed guides and documentation for all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
              Getting Started Guide
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              API Documentation
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              Best Practices
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-primaryColor" />
              <CardTitle>Video Tutorials</CardTitle>
            </div>
            <CardDescription>
              Step-by-step video guides for common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
              Event Creation Tutorial
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              Payment Setup Guide
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              Marketing Tools Overview
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <LifeBuoy className="w-5 h-5 text-primaryColor" />
              <CardTitle>Support</CardTitle>
            </div>
            <CardDescription>
              Get help from our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span>Live chat available 24/7</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>support@eventsphere.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>+1 (555) 123-4567</span>
            </div>
            <Button className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primaryColor" />
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Community Section */}
      <div className="bg-primaryColor/5 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Join Our Community</h2>
        <p className="text-gray-600 mb-4">
          Connect with other event organizers, share experiences, and get tips
        </p>
        <Button variant="outline" className="border-primaryColor text-primaryColor hover:bg-primaryColor/10">
          Join Community Forum
        </Button>
      </div>
    </div>
  );
}