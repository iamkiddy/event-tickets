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
    <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <div className={cn(
                    "flex flex-row border border-gray-200 items-center appearance-none px-2 sm:px-3 py-2 sm:py-2.5 rounded-full bg-gray-50",
                    "text-xs sm:text-sm font-medium text-gray-700 min-w-[100px] sm:min-w-[140px] md:min-w-[160px] hover:border-primaryColor/30",
                    "focus:outline-none focus:ring-2 focus:ring-primaryColor/20 transition-all"
                )}>
                    {icon}
                    <span className="truncate">{activeName ? activeName : name}</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] sm:w-full max-h-[300px] overflow-y-auto flex flex-col bg-white shadow-lg rounded-lg px-1 sm:px-2 gap-0.5 sm:gap-1">
                {data.map((item) => (
                    <Button 
                        key={item} 
                        onClick={() => handleFilterChange(item)} 
                        variant='ghost' 
                        className="text-xs sm:text-sm py-1.5 h-auto hover:bg-primaryColor/20"
                    >
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
        type?: string;
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
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 px-2">
            {params.category && <EventFilterCardButton name={params.category} remove={() => removeFilter("category")} />}
            {params.type && <EventFilterCardButton name={params.type} remove={() => removeFilter("eventType")} />}
            {params.time && <EventFilterCardButton name={params.time} remove={() => removeFilter("time")} />}
            {(params.category || params.type || params.time) && (
                <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full 
                    bg-primaryColor/10 text-red-500 text-xs sm:text-sm hover:bg-red-500/15 
                    transition-colors"
                >
                    CLEAR ALL
                </button>
            )}
        </div>
    )
}

// EventFilterCardButton
const EventFilterCardButton = ({remove, name}: {name: string, remove: ()=> void}) => {
    return (
        <button
            onClick={remove}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full 
            bg-primaryColor/10 text-primaryColor text-xs sm:text-sm hover:bg-primaryColor/15 
            transition-colors truncate max-w-[150px] sm:max-w-none"
        >
            <span className="truncate">{name}</span>
            <X className="w-3 h-3 flex-shrink-0" />
        </button>
    )
}