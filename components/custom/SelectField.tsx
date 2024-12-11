import React from 'react'
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'

interface SelectFieldProps {
    name?: string,
    label?: string,
    className?: string,
    value?: string,
    setValue?: (value: string) => void,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    children?: React.ReactNode
}

export default function SelectField({
    name, label, className, value, setValue, disabled, required, placeholder, children
}: SelectFieldProps) {
  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <Select
            name={name}
            value={value}
            onValueChange={setValue}
            disabled={disabled}
            required={required}
        >
            <SelectTrigger className={cn(
                'w-full h-10 rounded-md',
                className
            )}>
                <SelectValue placeholder={placeholder || 'Select Item'} />
            </SelectTrigger>
            <SelectContent>
                {children}
            </SelectContent>
        </Select>
    </div>
  )
}
