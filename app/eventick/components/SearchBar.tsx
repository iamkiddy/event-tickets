import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";

export const SearchBar: React.FC = () => {
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

  return (
    <div className="w-full bg-white rounded-full shadow-lg">
      <form className="flex items-center h-16">
        {/* Search Events */}
        <div className="flex-1 relative group border-r border-gray-200">
          <div 
            className={`px-8 h-full ${
              focusedInput === 'search' ? 'bg-gray-50' : ''
            } rounded-l-full transition-colors`}
          >
            <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
              Search Events
            </label>
            <div className="flex items-center">
              <Search className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search events..."
                className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0"
                onFocus={() => setFocusedInput('search')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex-1 relative group border-r border-gray-200">
          <div 
            className={`px-8 h-full ${
              focusedInput === 'location' ? 'bg-gray-50' : ''
            } transition-colors`}
          >
            <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
              Location
            </label>
            <div className="flex items-center">
              <MapPin className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Where to?"
                className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0"
                onFocus={() => setFocusedInput('location')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex-1 relative group">
          <div 
            className={`px-8 h-full ${
              focusedInput === 'date' ? 'bg-gray-50' : ''
            } transition-colors`}
          >
            <label className="block text-xs font-semibold text-gray-800 mb-1 pt-2">
              When
            </label>
            <div className="flex items-center">
              <Calendar className="absolute left-8 top-8 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Add dates"
                className="border-0 p-0 pl-6 h-6 text-sm bg-transparent focus:ring-0"
                onFocus={() => setFocusedInput('date')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
        </div>

        <div className="px-2">
          <Button 
            type="submit" 
            className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 
              hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full 
              font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};
