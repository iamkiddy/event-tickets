'use client'
import LineTabSelectorCard from '@/components/custom/LineTabSelectorCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

interface SettingsSelectorProps {
    activeTab: string;
}

export default function SettingsSelector({ activeTab }: SettingsSelectorProps) {
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
          <LineTabSelectorCard 
              title='My Organization'
              active={tab === 'organization'}
              tab='organization'
              onSelect={handleTabChange}
          />
          <LineTabSelectorCard 
              title='All Roles'
              active={tab === 'roles'}
              tab='roles'
              onSelect={handleTabChange}
          />
        <LineTabSelectorCard 
            title='Team Members'
            active={tab === 'team'}
            tab='team'
            onSelect={handleTabChange}
        />
      </div>
    )
  }
