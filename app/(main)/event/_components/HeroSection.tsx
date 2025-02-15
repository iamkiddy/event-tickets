"use client"
import { Calendar, ChevronDown, MapPin, Search, X} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import DatePicker from 'react-datepicker';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function HeroSection() {
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const pathName = usePathname();

    //handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set("search", e.target.value);
        } else {
            params.delete("search");
        }
        replace(`${pathName}?${params.toString()}`);
    } 

    // handle date change
    const handleDateChange = (date: Date) => {
        const params = new URLSearchParams(searchParams);
        if (date) {
            params.set("date", date.toISOString());
        } else {
            params.delete("date");
        }
        replace(`${pathName}?${params.toString()}`);
    }

    // filter by where
    const handleWhereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set("where", e.target.value);
        } else {
            params.delete("where");
        }
        replace(`${pathName}?${params.toString()}`);
    }

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("search");
        params.delete("where");
        params.delete("date");
        replace(`${pathName}?${params.toString()}`);
    }

    return (
        <div className="relative h-[350px] xs:h-[400px] sm:h-[500px] lg:h-[600px] mb-6 xs:mb-8 sm:mb-16 bg-slate-950 overflow-hidden">
            {/* Background Beams - Lower z-index */}
            <div className="absolute inset-0 z-0">
                <BackgroundBeams />
            </div>
            
            {/* Content - Higher z-index */}
            <div className="relative h-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 z-50">
                <div className="h-full flex flex-col items-center justify-center pt-16 xs:pt-20 sm:pt-24">
                    <span className="hidden xs:inline-block px-2 xs:px-3 sm:px-4 py-1 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full mb-3 xs:mb-4 sm:mb-6">
                        Discover Events
                    </span>
                    <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-6xl font-bold text-white text-center mb-3 xs:mb-4 sm:mb-8 max-w-4xl leading-tight mt-6 xs:mt-8 sm:mt-0">
                        Find Amazing Events Near You
                    </h1>
                    <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-neutral-300 text-center max-w-2xl leading-relaxed mb-6 xs:mb-8 sm:mb-12 px-3 xs:px-4">
                        Discover and book tickets for concerts, festivals, conferences, and more exciting events
                    </p>

                    {/* Enhanced Search Bar - Responsive */}
                    <div className="w-full max-w-4xl px-3 xs:px-4 sm:px-6">
                        <div className="bg-white/95 backdrop-blur-lg rounded-xl xs:rounded-2xl sm:rounded-full shadow-xl relative">
                            {/* Mobile Layout */}
                            <div className="block lg:hidden p-3 xs:p-4 space-y-3 xs:space-y-4">
                                {/* Search Input */}
                                <div className="relative flex items-center">
                                    <Search className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3 xs:h-4 xs:w-4" />
                                    <input
                                        placeholder="Search events..."
                                        value={searchParams.get("search")?.toString() || ""}
                                        onChange={handleSearch}
                                        className="w-full pl-8 xs:pl-10 pr-3 xs:pr-4 py-2 xs:py-3 rounded-full bg-transparent text-xs xs:text-sm focus:outline-none focus:ring-0"
                                    />
                                </div>

                                {/* Location */}
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <select
                                        value={searchParams.get("where")?.toString() || ""}
                                        onChange={handleWhereChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-full text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer bg-transparent"
                                    >
                                        <option value="">Where to?</option>
                                        <option value="venue">venue</option>
                                        <option value="online">Online</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                </div>

                                {/* Date */}
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <DatePicker
                                        selected={searchParams.get("date") ? new Date(searchParams.get("date") as string) : null}
                                        onChange={(date) => handleDateChange(date as Date)}
                                        dateFormat="MMM dd, yyyy"
                                        placeholderText="Select date"
                                        className="w-full pl-10 pr-4 py-3 rounded-full text-sm focus:outline-none focus:ring-0 cursor-pointer bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:block p-3 md:p-4">
                                <div className="flex gap-3">
                                    {/* Search Input */}
                                    <div className="flex-1 relative group border-r border-gray-200">
                                        <div className="px-6">
                                            <label className="block text-xs font-semibold text-gray-800 mb-1">
                                                Search Events
                                            </label>
                                            <div className="flex items-center w-full">
                                                <Search className="text-primaryColor h-4 w-4" />
                                                <input
                                                    placeholder="Search events..."
                                                    value={searchParams.get("search")?.toString() || ""}
                                                    onChange={handleSearch}
                                                    className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex-1 relative group border-r border-gray-200">
                                        <div className="px-6">
                                            <label className="block text-xs font-semibold text-gray-800 mb-1">
                                                Location
                                            </label>
                                            <div className="flex items-center w-full">
                                                <MapPin className="text-primaryColor h-4 w-4" />
                                                <select
                                                    value={searchParams.get("where")?.toString() || ""}
                                                    onChange={handleWhereChange}
                                                    className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="">Where to?</option>
                                                    <option value="venue">venue</option>
                                                    <option value="online">Online</option>
                                                </select>
                                                <ChevronDown className="text-gray-400 h-4 w-4 ml-auto pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex-1 relative group">
                                        <div className="px-6">
                                            <label className="block text-xs font-semibold text-gray-800 mb-1">
                                                When
                                            </label>
                                            <div className="flex items-center w-full">
                                                <Calendar className="text-primaryColor h-4 w-4" />
                                                <DatePicker
                                                    selected={searchParams.get("date") ? new Date(searchParams.get("date") as string) : null}
                                                    onChange={(date) => handleDateChange(date as Date)}
                                                    dateFormat="MMM dd, yyyy"
                                                    placeholderText="Select date"
                                                    className="w-full border-0 p-0 pl-3 h-6 text-sm bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clear All Button */}
                                    {(searchParams.get("search") || searchParams.get("where") || searchParams.get("date")) && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 
                                            bg-rose-50 hover:bg-rose-100/80 rounded-full transition-all duration-200 
                                            backdrop-blur-sm border border-rose-200/50 shadow-sm 
                                            group transform hover:scale-105 active:scale-95"
                                        >
                                            <X className="h-4 w-4 text-rose-500 group-hover:text-rose-600 transition-colors duration-200" />
                                            <span className="sr-only">Clear filters</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
