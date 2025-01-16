/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import SettingsSelector from './_components/SettingsSelector';
import OrganizerPageTab from './_components/OrganizerPage/OrganizerPageTab';
import { getServerSession, getUserProfile } from '@/lib/actions/auth';
import TeamPageTab from './_components/TeamPage/TeamPageTab';

interface TabSelectorProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    query?: string;
  }>;
}

export default async function SettingsPage({ searchParams }: TabSelectorProps) {
  const params = await searchParams;
  const activeTab = params.tab || 'organization';
  const page = params.page || 1;
  const query = params.query || '';

  const session = await getServerSession();
  const user = session?.userProfileModel;

  return (
    <section className="space-y-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className='flex flex-col gap-2 items-start'>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullname}</h1>
            <p className="text-lg text-gray-600">Manage your organization profile, roles and teams here.</p>
          </div>

          <SettingsSelector activeTab={activeTab} />

          {activeTab === 'organization' && (
            <OrganizerPageTab/>
          )}

          {activeTab === 'teams' && (
            <TeamPageTab/>
          )}
          
        </div>
    </section>
  )
}
