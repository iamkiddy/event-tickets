"use client"
import { OrgProfileViewModel } from '@/lib/models/_org_models'
import React from 'react'
import Image from 'next/image'
import { EllipsisVertical, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'


interface OrgCardProps {
    data: OrgProfileViewModel
}   


export default function OrgCard({ data }: OrgCardProps) {
  return (
    <div className='w-full bg-white flex flex-row gap-4 h-[80px] items-center px-5 rounded-lg mt-5'>
        <div className='w-[60px] h-[60px] rounded-full relative overflow-hidden bg-gray-400'>
            {data.profileImage ? (
                <Image src={data.profileImage} fill alt={data.name} className='absolute'/>
            ): (
                <User className='w-8 h-8 text-gray-600' />
            )}
        </div>  

        <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold text-gray-900'>{data.name}</p>
            <p className='text-sm text-gray-600'>{data.phone1}</p>
        </div>

        <Popover>
            <PopoverTrigger className='ml-auto'>
                <EllipsisVertical className='w-6 h-6 text-gray-600' />
            </PopoverTrigger>
            <PopoverContent className='px-2 rounded-md bg-white flex flex-col'>
                
            </PopoverContent>
        </Popover>
    </div>
  )
}
