import * as React from "react"
import { cn } from "@/lib/utils"
import {   
  Select,   
  SelectContent,   
  SelectItem,   
  SelectTrigger,   
  SelectValue 
} from "@/components/ui/select"

interface MultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select options",
  className
}: MultiSelectProps) {
  const handleValueChange = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : [...value, selectedValue];
    
    onValueChange(newValue);
  };

  return (
    <div className={cn("relative", className)}>
      <Select 
        value={value.length > 0 ? value[value.length - 1] : undefined}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map(selectedValue => (
                  <span
                    key={selectedValue}
                    className="bg-gray-100 px-2 py-0.5 rounded-md text-xs mr-1"
                  >
                    {selectedValue}
                  </span>
                ))}
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map(option => (
            <SelectItem
              key={option}
              value={option}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}