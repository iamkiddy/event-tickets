'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export const SearchBar: React.FC<{ isCompact?: boolean }> = ({ isCompact }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [location, setLocation] = React.useState("");

  // Base container styles
  const containerClasses = isCompact
    ? "w-full bg-white rounded-full shadow-sm border h-10"
    : "w-full bg-white rounded-lg sm:rounded-2xl lg:rounded-full shadow-md sm:shadow-lg";

  // Form layout styles
  const formClasses = isCompact
    ? "flex items-center h-10"
    : "flex flex-col sm:flex-row items-stretch sm:items-center h-auto sm:h-14 lg:h-16";

  // Input container styles
  const inputContainerClasses = isCompact
    ? "px-3 sm:px-4 h-full"
    : "px-3 sm:px-4 lg:px-6 py-2 sm:py-0 h-full relative";

  // Label styles
  const labelClasses = isCompact
    ? "hidden"
    : "block text-xs font-semibold text-gray-800 mb-1";

  // Icon styles - Adjusted for better alignment
  const iconClasses = isCompact
    ? "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
    : "absolute left-3 top-[50%] -translate-y-[50%] text-primaryColor h-4 w-4";

  // Input field styles - Removed ring and adjusted padding
  const inputClasses = isCompact
    ? "border-0 p-0 pl-8 h-full text-sm bg-transparent focus:ring-0 focus:outline-none"
    : "border-0 p-0 pl-8 h-9 text-sm bg-transparent focus:ring-0 focus:outline-none w-full";

  // Button styles
  const buttonClasses = isCompact
    ? "h-8 px-4 bg-gradient-to-r from-primaryColor to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full text-sm"
    : "w-full sm:w-auto h-10 sm:h-11 lg:h-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primaryColor to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full font-medium sm:font-semibold shadow-md hover:shadow-lg transition-all duration-200";

  // Mobile input styles - Adjusted for consistency
  const mobileInputClasses = "w-full pl-9 pr-4 py-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-primaryColor/30 bg-transparent";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    if (selectedDate) {
      params.set("date", selectedDate.toISOString());
    }
    
    if (location) {
      params.set("where", location);
    }

    // Navigate to events page with search params
    router.push(`/event?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop & Tablet Version */}
      <div className={`hidden sm:block ${containerClasses}`}>
        <form onSubmit={handleSearch} className={formClasses}>
          {/* Search Events */}
          <div className="flex-1 relative group border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>Search Events</label>
              <div className="relative flex items-center h-full">
                <Search className={iconClasses} />
                <Input 
                  placeholder="Search events..."
                  className={inputClasses}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex-1 relative group border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>Location</label>
              <div className="relative flex items-center h-full">
                <MapPin className={iconClasses} />
                <select 
                  className="w-full border-0 p-0 pl-8 h-9 text-sm bg-transparent focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Where to?</option>
                  <option value="venue">Venue</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 relative group">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>When</label>
              <div className="relative flex items-center h-full">
                <Calendar className={iconClasses} />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Select date"
                  className="w-full border-0 p-0 pl-8 h-9 text-sm bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-2 sm:p-3 lg:px-2">
            <Button type="submit" className={buttonClasses}>
              <Search className="h-4 w-4 mr-2" />
              {!isCompact && "Search"}
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile Version */}
      <div className="sm:hidden w-full">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white rounded-full shadow-md px-4 py-3 flex items-center border border-gray-100"
        >
          <Search className="h-4 w-4 text-gray-500 mr-3" />
          <span className="text-gray-600 text-sm">Search events...</span>
        </button>

        {/* Mobile Search Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white z-50 animate-in slide-in-from-bottom">
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
                <span className="text-base font-semibold">Search Events</span>
                <div className="w-6" />
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSearch} className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Search Events */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      Search Events
                    </label>
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search events..."
                        className={mobileInputClasses}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      Location
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        className={mobileInputClasses}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="">Where to?</option>
                        <option value="venue">Venue</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      When
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="MMM dd, yyyy"
                        placeholderText="Select date"
                        className={mobileInputClasses}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t bg-white">
                  <Button 
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primaryColor to-indigo-700 
                      hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full font-medium"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
