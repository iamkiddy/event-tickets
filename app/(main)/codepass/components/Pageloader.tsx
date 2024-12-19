import React from 'react'
import { BlogCardSkeleton, CategorySkeleton, EventCardSkeleton, EventsBannerSkeleton, SectionHeaderSkeleton } from './skeletons'
import { Skeleton } from '@/components/ui/skeleton'

export default function EventPageLoader() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
                <CategorySkeleton key={i} />
            ))}
        </div>

        <div className="my-16">
            <SectionHeaderSkeleton className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <EventCardSkeleton key={i} />
                ))}
            </div>
        </div>
        
        <EventsBannerSkeleton />

        <div className="mt-16">
            <SectionHeaderSkeleton className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>

        <section className="mt-16 mb-16 max-w-xl mx-auto">
            <Skeleton className='w-3/5 h-10 md:h-20 bg-slate-400' />
        </section>
    </div>
  )
}
