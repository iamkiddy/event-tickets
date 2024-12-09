import React from 'react'
import TabSelector from './_components/TabSelector'

interface TabSelectorProps {
  searchParams: {
    tab?: string;
    page?: string;
    query?: string;
  };
}


export default function MyProfile({ searchParams }: TabSelectorProps) {
  const activeTab = searchParams.tab || 'profile';
  // const page = searchParams.page || 1;
  // const query = searchParams.query || '';


  return (
    <main className="w-full min-h-screen bg-gray-50">
        <div className='flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16'>
          <h1 className='text-2xl md:text-4xl font-bold mt-5 md:mt-10'>My Account</h1>

          <div className='mt-5 gpa-4'>
            <TabSelector activeTab={activeTab} />
            
          </div>
        </div>
    </main>
  )
}
