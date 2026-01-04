"use client";

import { useState } from "react";
import Image from "next/image";

const banners = [
  "/news_sample.svg",
  "/news_sample2.png",
  "/news_sample3.png",
  "/news_sample.svg",
];

export default function NewsBannerSlider() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative h-[424px] w-[1040px] overflow-hidden rounded-[10px]">
      <Image
        src={banners[index]}
        alt="소식 배너"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute top-[27px] left-[33px] flex gap-2">
        {banners.map((_, i) => {
          const active = i === index;

          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`배너 ${i + 1}`}
              className={[
                "transition-all",
                active
                  ? "w-6.5 h-2.5 rounded-[100px] bg-[color:var(--primary_1)]"
                  : "w-2.5 h-2.5 rounded-full bg-[color:var(--Subbrown_2)]",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
