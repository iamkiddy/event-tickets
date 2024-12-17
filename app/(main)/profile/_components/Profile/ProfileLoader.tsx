import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function ProfileLoader() {
  return (
    <section className='w-full flex flex-col gap-4 mt-5'>
        <Skeleton className='w-1/2 h-5 bg-slate-200' />
        <div className='w-full flex flex-col gap-4 md:flex-row'>
            <Skeleton className='w-1/2 h-10 bg-slate-200' />
            <Skeleton className='w-1/2 h-10 bg-slate-200' />
        </div>
        <div className='w-full flex flex-col gap-4 md:flex-row'>
            <Skeleton className='w-1/2 h-10 bg-slate-200' />
            <Skeleton className='w-1/2 h-10 bg-slate-200' />
        </div>
        <div className='w-full flex gap-4 flex-row justify-between'>
            <div>
                <Skeleton className='w-1/3 h-10 bg-slate-200' />
                <Skeleton className='w-1/3 h-5 bg-slate-200' />
                <Skeleton className='w-[100px] h-5 bg-slate-200' />
            </div>
            <Skeleton className='w-10 h-5 bg-slate-200' />
        </div>
        <Skeleton className='w-full md:w-[200px] h-5 bg-slate-200 ml-auto' />
    </section>
  )
}
