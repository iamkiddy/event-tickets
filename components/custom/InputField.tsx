import { cn } from '@/lib/utils';
import React from 'react'
import { Input } from '../ui/input';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    label?: string;
    type?: string;
    name?: string;
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
    label, type, placeholder, value, setValue, name,
    error, required, disabled, className, iconLeft, iconRight
}: InputFieldProps) {
    const IconLeft = iconLeft;
    const IconRight = iconRight;
  return (
    <div className={cn(
        'w-full flex flex-col gap-3',
        className
    )}>
        {label && (
            <label className='text-base font-semibold text-gray-500'>
                {label}
            </label>
        )}
        <div className='w-full relative h-10 rounded-md'>
            {IconLeft && <IconLeft className='w-5 h-5 absolute left-2 text-gray-500 my-2'/>}
            <Input 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                name={name}
                onChange={(e) => setValue(e.target.value)}
                required={required}
                disabled={disabled}
                className={cn(
                    'w-full h-full',
                    iconLeft && 'pl-10',
                    iconRight && 'pr-10'
                )}
            />
            {IconRight && <IconRight className='w-5 h-5 absolute right-2 text-gray-500 my-2'/>}
        </div>
        {error && (
            <span className='text-sm font-semibold text-red-600'>
                {error}
            </span>
        )}
    </div>
  )
}
