import * as React from "react";
import { BlogCardProps } from "../types";

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  description,
  date,
  author,
}) => {
  return (
    <article className="flex flex-col grow max-md:mt-7">
      <img
        loading="lazy"
        src={image}
        alt={title}
        className="object-contain w-full rounded-3xl aspect-[1.63]"
      />
      <h3 className="self-start mt-5 text-xl font-bold leading-8 text-blue-950">
        {title}
      </h3>
      <p className="mt-5 text-base leading-6 text-black">{description}</p>
      <time className="self-start mt-5 text-sm text-neutral-400">
        {date} - {author}
      </time>
    </article>
  );
};
