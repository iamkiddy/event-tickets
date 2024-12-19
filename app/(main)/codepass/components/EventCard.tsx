import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import parser from 'html-react-parser';
import {EventListItem } from "@/lib/models/_main_event_models"
import { formatDate } from "@/lib/utils";

interface EventCardProps{
  data: EventListItem;
}

export const EventCard =({
  data
}: EventCardProps ) => {

  const { month, day, fullDate } = formatDate(data.startDate);
 
  return (
    <Link href={`/event/${data.id}`}>
      <article className="group flex flex-col bg-white rounded-lg sm:rounded-2xl overflow-hidden 
        border border-gray-100 shadow-sm
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        hover:border-primaryColor/20
        transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2">
            <div className="flex flex-col items-center justify-center bg-white/90 
              backdrop-blur-sm rounded-lg p-1.5 sm:p-2 w-14 h-14 sm:w-16 sm:h-16 shadow-sm">
              <span className="text-[10px] sm:text-xs font-semibold text-primaryColor">{month}</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{day}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-2 
            group-hover:text-primaryColor transition-colors">
            {data.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
            {parser(data.summary)}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
              <span className="text-xs sm:text-sm text-gray-600">Available</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-primaryColor 
              group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
