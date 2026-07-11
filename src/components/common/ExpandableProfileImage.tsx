"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import { getProfileImageSrc } from "@/utils/profileImage";

type ExpandableProfileImageProps = {
  imageUrl?: string | null;
  alt: string;
  className: string;
  sizes?: string;
};

const DEFAULT_PROFILE_PATH_PATTERN =
  /^\/(?:profile\d*|default_profile_\d+)\.(?:svg|png|jpe?g|webp)$/i;

function isUploadedProfileImage(imageUrl: string) {
  try {
    const parsedUrl = new URL(imageUrl);
    return (
      (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") &&
      !DEFAULT_PROFILE_PATH_PATTERN.test(parsedUrl.pathname)
    );
  } catch {
    return false;
  }
}

export default function ExpandableProfileImage({
  imageUrl,
  alt,
  className,
  sizes = "(max-width: 767px) 80px, 138px",
}: ExpandableProfileImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const imageSrc = getProfileImageSrc(imageUrl);
  const hasUploadedImage = isUploadedProfileImage(imageSrc);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [isOpen]);

  const image = (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );

  return (
    <>
      {hasUploadedImage ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`${alt} 크게 보기`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`relative cursor-zoom-in overflow-hidden p-0 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-2 ${className}`}
        >
          {image}
        </button>
      ) : (
        <div className={`relative overflow-hidden ${className}`}>{image}</div>
      )}

      {isOpen && hasUploadedImage && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 cursor-zoom-out bg-black/90"
            aria-label="프로필 사진 닫기"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} 크게 보기`}
            className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="pointer-events-auto absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-[32px] leading-none text-White transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-White"
              style={{ top: "max(0px, env(safe-area-inset-top))" }}
              aria-label="프로필 사진 닫기"
            >
              <span aria-hidden="true">×</span>
            </button>

            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.45 }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 700) {
                  setIsOpen(false);
                }
              }}
              whileDrag={{ scale: 0.98 }}
              className="pointer-events-auto relative h-[min(80vh,900px)] w-[min(92vw,900px)]"
              style={{ touchAction: "pinch-zoom" }}
            >
              <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="92vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
