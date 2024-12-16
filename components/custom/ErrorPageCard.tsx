import { cn } from '@/lib/utils'
import { ShieldAlert } from 'lucide-react'
import React from 'react'


interface ErrorPageCardProps {
    icon?: React.ReactNode
    className?: string
    title?: string
}

export default function ErrorPageCard({ icon, className, title }: ErrorPageCardProps) {
  return (
    <div className={cn(
        'flex flex-col items-center justify-center space-y-3 w-full h-full',
        className
    )}>
        {icon || <ShieldAlert className="w-12 h-12 text-red-500 opacity-40" />}
        <h2 className='text-lg md:text-xl font-medium text-gray-500 text-center'>
            {title || 'Something went wrong!. Please try again later.'}
        </h2>
    </div>
  )
}
