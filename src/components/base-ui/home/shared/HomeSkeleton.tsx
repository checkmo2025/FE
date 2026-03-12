"use client";

import React from "react";

const SkeletonBase = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-zinc-200 rounded ${className}`} />
);

export const NewsSkeleton = () => (
  <section className="w-full">
    <div className="flex flex-col gap-4">
      <SkeletonBase className="h-[200px] t:h-[240px] d:h-[184px] w-full rounded-2xl" />
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonBase key={i} className="w-2 h-2 rounded-full" />
        ))}
      </div>
    </div>
  </section>
);

export const ClubSkeleton = () => (
  <section className="flex flex-col flex-1 d:max-w-[332px]">
    <div className="flex items-center justify-between pb-3">
      <SkeletonBase className="w-24 h-6" />
      <SkeletonBase className="w-16 h-4" />
    </div>
    <div className="flex flex-col gap-3">
      {[1, 2].map((i) => (
        <SkeletonBase key={i} className="w-full h-[68px] rounded-xl" />
      ))}
    </div>
  </section>
);

export const RecommendationSkeleton = () => (
  <section className="flex flex-col flex-1">
    <SkeletonBase className="w-24 h-6 mb-3" />
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <SkeletonBase className="w-20 h-4 mb-2" />
            <SkeletonBase className="w-24 h-3" />
          </div>
          <SkeletonBase className="w-16 h-8 rounded-full" />
        </div>
      ))}
    </div>
  </section>
);

export const StoryCardSkeleton = () => (
  <div className="w-full max-w-[332px] flex flex-col gap-3">
    <SkeletonBase className="w-full aspect-[4/3] rounded-2xl" />
    <div className="space-y-2">
      <SkeletonBase className="w-3/4 h-5" />
      <SkeletonBase className="w-full h-4" />
      <div className="flex items-center gap-2 pt-2">
        <SkeletonBase className="w-8 h-8 rounded-full" />
        <SkeletonBase className="w-20 h-4" />
      </div>
    </div>
  </div>
);

export const HomeStoryListSkeleton = () => (
  <div className="pt-6 grid grid-cols-1 t:grid-cols-2 d:grid-cols-4 gap-5 w-full">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="flex justify-center">
        <StoryCardSkeleton />
      </div>
    ))}
  </div>
);
