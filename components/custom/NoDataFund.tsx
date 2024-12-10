import { cn } from '@/lib/utils'
import { FolderSearch } from 'lucide-react'
import React from 'react'

interface NoDataFundProps {
    icon?: React.ReactNode
    className?: string
    title?: string
}

export default function NoDataFund({ icon, className, title }: NoDataFundProps) {
  return (
    <div className={cn(
        'flex flex-col items-center justify-center space-y-3 w-full h-full',
        className
    )}>
        {icon || <FolderSearch className="w-12 h-12 text-primaryColor opacity-40" />}
        <h2 className='text-lg md:text-xl font-medium text-gray-500'>{title || 'No data found'}</h2>
    </div>
  )
}