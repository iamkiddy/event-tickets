import * as React from "react";
import { BlogCardProps } from "../types";
import parser from 'html-react-parser';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

export const BlogCard: React.FC<BlogCardProps & { id?: string }> = ({
  id = "1",
  image,
  title,
  description,
  date,
  author,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${id}`}>
      <article className="group flex flex-col bg-white rounded-2xl overflow-hidden 
        border border-gray-100 shadow-sm
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
        hover:border-primaryColor/20
        transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 
            group-hover:text-primaryColor transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {parser(description)}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`}
                alt={author}
                width={24}
                height={24}
                className="rounded-full ring-2 ring-gray-100"
              />
              <span className="text-sm text-gray-600">{author}</span>
            </div>
            <span className="text-sm font-semibold text-primaryColor 
              group-hover:translate-x-1 transition-transform">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
