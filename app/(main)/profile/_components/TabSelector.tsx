'use client'
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'


interface TabSelectorProps {
  activeTab: string;
}


export default function TabSelector({ activeTab }: TabSelectorProps) {
  const [tab, setTab] = React.useState(activeTab);

  const { replace } = useRouter();
  const tabParams = useSearchParams();
  const pathName = usePathname();

  // handle tab change
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(tabParams);
    params.set("tab", tab);
    params.delete("page");
    params.delete("query");
    setTab(tab)
    replace(`${pathName}?${params.toString()}`);
  }

  React.useEffect(() => {
    setTab(activeTab);

  }, [activeTab]);

  return (
    <div className='w-full flex flex-row gap-4 border-b-2'>
        <TabSelectorCard 
            title='My Profile'
            active={tab === 'profile'}
            tab='profile'
            onSelect={handleTabChange}
        />
        <TabSelectorCard 
            title='All Tickets'
            active={tab === 'tickets'}
            tab='tickets'
            onSelect={handleTabChange}
        />
    </div>
  )
}


interface TabSelectorCardProps {
    title: string;
    active: boolean;
    onSelect: (tab: string) => void;
    tab: string;
}


const TabSelectorCard = ({title, active, onSelect, tab}: TabSelectorCardProps) => {
    
  return (
    <div onClick={()=>onSelect(tab)} className='w-fit px-3 h-14 flex items-center justify-center relative'>
        <span className={cn(
            'cursor-pointer text-sm md:text-lg text-gray-700 font-semibold',
            active && 'text-primaryColor'
        )}>{title}</span>
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-primaryColor ${active ? 'block' : 'hidden'}`}/>
    </div>
  )
}
