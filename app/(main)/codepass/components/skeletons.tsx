import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const EventCardSkeleton = () => (
  <div className="group relative bg-white dark:bg-gray-800/50 rounded-xl shadow-sm transition-shadow hover:shadow-lg overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full object-cover bg-gray-200 dark:bg-gray-700" />
    <div className="p-5">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-14 h-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="group relative bg-white dark:bg-gray-800/50 rounded-xl shadow-sm transition-shadow hover:shadow-lg overflow-hidden">
    <Skeleton className="aspect-[16/9] w-full object-cover bg-gray-200 dark:bg-gray-700" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-[85%] bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-[90%] bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="group flex flex-col items-center p-4 transition-transform hover:scale-105">
    <Skeleton className="h-20 w-20 rounded-full mb-3 bg-gray-200 dark:bg-gray-700" />
    <div className="text-center space-y-1.5">
      <Skeleton className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-3 w-16 mx-auto bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);

export const EventsBannerSkeleton = () => (
  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
    <Skeleton className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
      <div className="h-full flex flex-col justify-center p-8 space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-2/3 bg-gray-300/80 dark:bg-gray-600/80" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-3/4 bg-gray-300/80 dark:bg-gray-600/80" />
          <Skeleton className="h-5 w-1/2 bg-gray-300/80 dark:bg-gray-600/80" />
        </div>
        <div className="pt-4">
          <Skeleton className="h-12 w-36 rounded-full bg-gray-300/80 dark:bg-gray-600/80" />
        </div>
      </div>
    </div>
  </div>
);

export const FilterButtonSkeleton = () => (
  <Skeleton className="h-9 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
);

export const SectionHeaderSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-6", className)}>
    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
      <FilterButtonSkeleton />
      <FilterButtonSkeleton />
      <FilterButtonSkeleton />
    </div>
  </div>
);
