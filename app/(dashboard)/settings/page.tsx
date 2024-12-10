/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import SettingsSelector from './_components/SettingsSelector';
import OrganizerPageTab from './_components/OrganizerPage/OrganizerPageTab';

interface TabSelectorProps {
  searchParams: {
    tab?: string;
    page?: string;
    query?: string;
  };
}

export default async function SettingsPage({ searchParams }: TabSelectorProps) {
  const activeTab = searchParams.tab || 'organization';
  const page = searchParams.page || 1;
  const query = searchParams.query || '';

  return (
    <section className="space-y-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className='flex flex-col gap-2 items-start'>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Denzel</h1>
            <p className="text-lg text-gray-600">Manage your organization profile, roles and teams here.</p>
          </div>

          <SettingsSelector activeTab={activeTab} />

          {activeTab === 'organization' && (
            <OrganizerPageTab/>
          )}

          {activeTab === 'roles' && (
            <div>RolePageTab</div>
          )}

          {activeTab === 'teams' && (
            <div>TeamsPageTab</div>
          )}
          
        </div>
    </section>
  )
}
