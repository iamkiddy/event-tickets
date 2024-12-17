'use client';

import { ArrowRight, BookOpen, Wallet, UserCircle2, PlusCircle, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function DashboardHome() {
  const { userProfile } = useAuth();

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Welcome & Getting Started */}
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900r">
          Welcome, {userProfile?.fullname || 'User'}
        </h1>
        
        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Get discovered</h2>
            <p className="mt-2 text-gray-600">
              Set up your organizer profile to increase discovery on search engines, highlight your brand and build trust with attendees.
            </p>
            <Link 
              href="/home/profile" 
              className="inline-flex items-center gap-2 mt-4 text-primaryColor hover:text-indigo-700 font-medium"
            >
              Set up your profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Start from scratch</h2>
            <p className="mt-2 text-gray-600">
              Add all your event details, create new tickets, or recreate an old event.
            </p>
            <div className="flex gap-4 mt-4">
              <Link 
                href="/events/create" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg 
                  hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                Create event
              </Link>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your checklist</h2>
          <p className="text-gray-600 mb-6">We make it easy to plan successful events. Here&apos;s how to start!</p>
          
          <div className="space-y-4">
            <ChecklistItem
              icon={PlusCircle}
              title="Create event"
              description="Publish an event to reach millions of people on CodePass."
              href="/events/create"
            />
            <ChecklistItem
              icon={UserCircle2}
              title="Set up your organizer profile"
              description="Highlight your brand by adding your organizer name, image, and bio"
              href="/home/profile"
            />
            <ChecklistItem
              icon={Wallet}
              title="Add your bank account"
              description="Get paid for future ticket sales by entering your bank details"
              href="/home/payments"
            />
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Top resources for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ResourceCard
              title="Digital Marketing Guide for Events"
              category="Marketing Experts"
              href="/resources/marketing-guide"
            />
            <ResourceCard
              title="Safety Playbook for Events"
              category="Event Planning"
              href="/resources/safety-guide"
            />
            <ResourceCard
              title="10 Best Ways to Market and Sell Out Your Event"
              category="Marketing Experts"
              href="/resources/marketing-tips"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChecklistItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

function ChecklistItem({ icon: Icon, title, description, href }: ChecklistItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Icon className="w-5 h-5 text-primaryColor" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
    </Link>
  );
}

interface ResourceCardProps {
  title: string;
  category: string;
  href: string;
}

function ResourceCard({ title, category, href }: ResourceCardProps) {
  return (
    <Link 
      href={href}
      className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 
        hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <BookOpen className="w-4 h-4" />
        {category}
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <span className="inline-flex items-center gap-1 text-primaryColor text-sm mt-3">
        Read article
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}