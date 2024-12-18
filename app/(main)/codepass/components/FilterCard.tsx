import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FilterCardProps {
    title: string;
    prefix: string;
    data: string[];
}

export default function FilterCard({ title, prefix, data }: FilterCardProps) {
  return (
    <Popover>
        <PopoverTrigger className='w-fit'>
            <div className='flex items-center px-2 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm rounded-full bg-indigo-50 text-primaryColor border border-indigo-100'>
                <span>{title}</span>
                <ChevronDown className='w-5 h-5' />
            </div>
        </PopoverTrigger>
        <PopoverContent className='bg-white flex flex-col rounded-lg shadow-lg px-2 gap-1 w-48'>
        {data.map((category) => (
            <Link key={category} href={`/event?${prefix}=${category}`} className='hover:bg-gray-200 px-2 py-1'>
            {category}
            </Link>
        ))}
        </PopoverContent>
    </Popover>
  )
}
