'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";

export const SearchBar: React.FC<{ isCompact?: boolean }> = ({ isCompact }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Compact styles for nav version
  const containerClasses = isCompact
    ? "w-full bg-white rounded-full shadow-sm border h-10"
    : "w-full bg-white rounded-full shadow-lg";

  const formClasses = isCompact
    ? "flex items-center h-10"
    : "flex items-center h-16";

  // Hide labels and adjust spacing for compact version
  const inputContainerClasses = isCompact
    ? "px-4 h-full"
    : "px-8 h-full";

  const labelClasses = isCompact
    ? "hidden"
    : "block text-xs font-semibold text-gray-800 mb-1 pt-2";

  const iconClasses = isCompact
    ? "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
    : "absolute left-8 top-8 text-gray-400 h-4 w-4";

  const inputClasses = isCompact
    ? "border-0 p-0 pl-6 h-full text-sm bg-transparent focus:ring-0"
    : "border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0";

  // Adjust button size for compact version
  const buttonClasses = isCompact
    ? "h-8 px-4 bg-gradient-to-r from-primaryColor to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full text-sm"
    : "h-12 px-8 bg-gradient-to-r from-primaryColor to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200";

  return (
    <>
      {/* Desktop Version */}
      <div className={`hidden lg:block ${containerClasses}`}>
        <form className={formClasses}>
          {/* Search Events */}
          <div className="flex-1 relative group border-r border-gray-200">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>
                Search Events
              </label>
              <div className="flex items-center">
                <Search className={iconClasses} />
                <Input 
                  placeholder="Search events..."
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex-1 relative group border-r border-gray-200">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>
                Location
              </label>
              <div className="flex items-center">
                <MapPin className={iconClasses} />
                <Input 
                  placeholder="Where to?"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 relative group">
            <div className={inputContainerClasses}>
              <label className={labelClasses}>
                When
              </label>
              <div className="flex items-center">
                <Calendar className={iconClasses} />
                <Input 
                  placeholder="Add dates"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div className="px-2">
            <Button type="submit" className={buttonClasses}>
              <Search className="h-4 w-4 mr-2" />
              {!isCompact && "Search"}
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden w-full px-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white rounded-full shadow-lg px-6 py-3 flex items-center"
        >
          <Search className="h-4 w-4 text-gray-500 mr-3" />
          <span className="text-gray-600 text-sm">Where to?</span>
        </button>

        {/* Mobile Search Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mb-4 text-gray-600"
              >
                ← Back
              </button>
              
              {/* Mobile Search Fields */}
              <div className="space-y-4">
                {/* Search Events */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-gray-800 mb-2">
                    Search Events
                  </label>
                  <div className="flex items-center">
                    <Search className="text-gray-400 h-4 w-4 mr-2" />
                    <Input 
                      placeholder="Search events..."
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-gray-800 mb-2">
                    Location
                  </label>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 h-4 w-4 mr-2" />
                    <Input 
                      placeholder="Where to?"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-gray-800 mb-2">
                    When
                  </label>
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 h-4 w-4 mr-2" />
                    <Input 
                      placeholder="Add dates"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primaryColor to-indigo-700 
                    hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
