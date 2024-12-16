import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function TicketLoader() {
  return (
    <section className='w-full flex flex-col gap-4 mt-5'>
        <Skeleton className='w-1/2 h-5 bg-slate-200' />
        <div className='w-full flex flex-col gap-4'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='w-full h-10 bg-slate-200' />
          ))}
        </div>
    </section>
  )
}
