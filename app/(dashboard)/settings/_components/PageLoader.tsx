import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function PageLoader() {
  return (
    <div className='w-full mt-5 flex flex-col gap-4'>
        {/* Page Loader */}
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='w-full flex flex-row gap-3'>
                <Skeleton className='w-12 h-12 rounded-full bg-slate-300' />
                <div className='flex flex-col gap-2'>
                    <Skeleton className='w-32 h-4 bg-slate-300' />
                    <Skeleton className='w-20 h-4 bg-slate-300' />
                </div>
                <Skeleton className='w-5 h-12 ml-auto bg-slate-300' />
            </div>
        ))}
    </div>
  )
}
