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
            {data.profileImage ? (
                <div className='w-[40px] h-[40px] rounded-full relative overflow-hidden bg-gray-400'>
                    <Image src={data.profileImage} fill alt={data.name} className='absolute'/>
                </div>
            ): (
                <div className='p-2 rounded-full bg-gray-200'>
                    <User className='w-6 h-6 text-gray-500' />
                </div>
            )}

        <div className='flex flex-col gap-1'>
            <p className='text-lg font-semibold text-gray-900'>{data.name}</p>
            <p className='text-sm text-gray-600'>{data.phone1}</p>
        </div>

        <Popover>
            <PopoverTrigger className='ml-auto'>
                <EllipsisVertical className='w-6 h-6 text-gray-600' />
            </PopoverTrigger>
            <PopoverContent className='rounded-md bg-white flex flex-col w-[120px]'>
                
            </PopoverContent>
        </Popover>
    </div>
  )
}
