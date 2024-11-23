import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";

export const SearchBar: React.FC = () => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6">
      <form className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Search events..."
              className="pl-10 h-12 md:h-14 text-base md:text-lg bg-white/50 border-0 focus:ring-2 ring-indigo-200"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Location"
              className="pl-10 h-12 md:h-14 text-base md:text-lg bg-white/50 border-0 focus:ring-2 ring-indigo-200"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder="Any date"
              className="pl-10 h-12 md:h-14 text-base md:text-lg bg-white/50 border-0 focus:ring-2 ring-indigo-200"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="h-12 md:h-14 px-6 md:px-8 bg-indigo-600 hover:bg-indigo-700 text-base md:text-lg font-semibold w-full md:w-auto"
        >
          Search
        </Button>
      </form>
    </div>
  );
};
