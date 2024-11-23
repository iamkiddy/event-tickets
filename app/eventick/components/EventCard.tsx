import * as React from "react";
import { EventCardProps } from "../types";
import Link from "next/link";
import Image from "next/image";

export const EventCard: React.FC<EventCardProps & { id?: string }> = ({
  id = "1",
  month,
  day,
  title,
  description,
  image,
}) => {
  return (
    <Link href={`/eventick/${id}`}>
      <article className="group flex flex-col bg-white rounded-2xl overflow-hidden 
        hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="flex flex-col items-center justify-center bg-white/90 
              backdrop-blur-sm rounded-lg p-2 w-16 h-16">
              <span className="text-xs font-semibold text-indigo-600">{month}</span>
              <span className="text-2xl font-bold text-gray-900">{day}</span>
            </div>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 
            group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <span className="text-sm font-semibold text-indigo-600 
              group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
