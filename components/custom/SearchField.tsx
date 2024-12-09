"use client"
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { Input } from '../ui/input';
import { Search } from 'lucide-react';


interface SearchFieldProps {
    placeholder?: string
    className?: string
}


export default function SearchField({ placeholder, className }: SearchFieldProps) {
    const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  // handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value) {
        params.set("query", e.target.value);
    } else {
        params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  } 


  return (
    <div className={cn(
        "w-full md:w-[385px] h-[40px] relative",
        className
    )}>
        <Search className="absolute left-1 w-5 h-5 top-1 m-2 text-[#666666]" />
        <Input
          onChange={handleSearch}
          defaultValue={searchParams.get("query")?.toString() || ""}
          className="absolute pl-10 rounded-[15px] h-full w-full" 
          placeholder={placeholder || "Search..."} 
        />
    </div>
  )
}
