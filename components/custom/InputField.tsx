import { cn } from '@/lib/utils';
import React from 'react'
import { Input } from '../ui/input';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    label?: string;
    type?: string;
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    iconLeft?: LucideIcon;
    iconRight?: LucideIcon;
}

export default function InputField({ 
    label, type, placeholder, value, setValue, 
    error, required, disabled, className, iconLeft, iconRight
}: InputFieldProps) {
    const IconLeft = iconLeft;
    const IconRight = iconRight;
  return (
    <div className={cn(
        'w-full flex flex-col gap-4',
        className
    )}>
        {label && (
            <label className='text-base md:text-lg font-medium text-gray-700'>
                {label}
            </label>
        )}
        <div className='w-full relative h-10'>
            {IconLeft && <IconLeft className='w-6 h-6 absolute left-1 text-gray-600'/>}
            <Input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                required={required}
                disabled={disabled}
                className={cn(
                    'w-full',
                    iconLeft && 'pl-10',
                    iconRight && 'pr-10'
                )}
            />
            {IconRight && <IconRight className='w-6 h-6 absolute right-1 text-gray-600'/>}
        </div>
        <Input 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            required={required}
            disabled={disabled}
            className='w-full'
        />
        {error && (
            <span className='text-sm font-semibold text-red-600'>
                {error}
            </span>
        )}
    </div>
  )
}
