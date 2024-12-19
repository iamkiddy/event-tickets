"use client"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, X } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventFilterCardProps {
    name: string;
    activeName?: string;
    query: string;
    data: string[];
    icon: React.ReactNode;
}

export default function EventFilterCard({ name, activeName, query, data, icon }: EventFilterCardProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { replace } = useRouter();
    const filterParams = useSearchParams();
    const pathName = usePathname();

    // handle filter change
    const handleFilterChange = (value: string) => {
        const params = new URLSearchParams(filterParams);
        params.set(query, value);
        params.delete("page");
        replace(`${pathName}?${params.toString()}`);
    }

  return (
    <div className="relative group">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <div className={cn(
                    "flex flex-row border border-gray-200 items-center appearance-none pl-3 pr-3 py-2.5 rounded-full bg-gray-50",
                    "text-sm font-medium text-gray-700 min-w-[140px] sm:min-w-[160px] hover:border-primaryColor/30 focus:outline-none focus:ring-2",
                    "focus:ring-primaryColor/20 transition-all"
                )}>
                    {icon}
                    <span>{activeName ? activeName : name}</span>
                    <ChevronDown className="w-4 h-4 ml-10" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full flex flex-col bg-white shadow-lg rounded-lg px-2 gap-1">
                {data.map((item) => (
                    <Button key={item} onClick={() => handleFilterChange(item)} variant='ghost' className="hover:bg-primaryColor/20">
                        {item}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    </div>
  )
}


export interface EventFilterListProps {
    params: {
        category?: string;
        eventType?: string;
        time?: string;
    }
  }


export const EventFilterList = ({params}: EventFilterListProps) => {
    const { replace } = useRouter();
    const filterParams = useSearchParams();
    const pathName = usePathname();

    // remove filter
    const removeFilter = (query: string) => {
        const params = new URLSearchParams(filterParams);
        params.delete(query);
        params.delete("page");
        replace(`${pathName}?${params.toString()}`);
    }

    // clear all filters
    const clearAllFilters = () => {
        const params = new URLSearchParams(filterParams);
        params.delete("page");
        replace(`${pathName}?${params.toString()}`);
    }
    return (
        <div className="flex items-center justify-center gap-2 mt-3">
            {params.category && <EventFilterCardButton name={params.category} remove={() => removeFilter("category")} />}
            {params.eventType && <EventFilterCardButton name={params.eventType} remove={() => removeFilter("eventType")} />}
            {params.time && <EventFilterCardButton name={params.time} remove={() => removeFilter("time")} />}
            {(params.category || params.eventType || params.time) && <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                bg-primaryColor/10 text-red-500 text-sm hover:bg-red-500/15 
                transition-colors"
            >
                CLEAR ALL
            </button>}
        </div>
    )
}

// EventFilterCardButton
const EventFilterCardButton = ({remove, name}: {name: string, remove: ()=> void}) => {
    return (
        <button
            onClick={remove}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
            bg-primaryColor/10 text-primaryColor text-sm hover:bg-primaryColor/15 
            transition-colors"
        >
            {name.toUpperCase()}
            <X className="w-3 h-3" />
        </button>
    )
}