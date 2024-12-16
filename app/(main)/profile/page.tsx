import React, { Suspense } from 'react'
import TabSelector from './_components/TabSelector'
import ProfilePage from './_components/Profile/ProfilePage';
import MyTickets from './_components/Tickets/MyTickets';
import { getServerSession } from '@/lib/actions/auth';
import ProfileLoader from './_components/Profile/ProfileLoader';
import { UserProfileModel } from '@/lib/models/_auth_models';

interface TabSelectorProps {
  searchParams: {
    tab?: string;
    page?: string;
    query?: string;
  };
}


export default async function MyProfile({ searchParams }: TabSelectorProps) {
  const params = await searchParams;
  const activeTab = params.tab || 'profile';
  const page = params.page || 1;
  const query = params.query || '';

  const userData = await getServerSession();


  return (
    <main className="w-full min-h-screen bg-gray-50">
        <div className='flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
          <h1 className='text-2xl md:text-4xl font-bold mt-5 md:mt-10'>My Account</h1>

          <div className='mt-5 gpa-4'>
            <TabSelector activeTab={activeTab} />
            {activeTab === 'profile' && (
              <Suspense fallback={<ProfileLoader/>}>
                <ProfilePage data={userData?.userProfileModel as UserProfileModel} />
              </Suspense>
            )}
            {activeTab === 'tickets' && <MyTickets query={query} page={page as number} />}
          </div>
        </div>
    </main>
  )
}
