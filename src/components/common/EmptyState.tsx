import React from "react";
import Image from "next/image";

type EmptyStateProps = {
  message?: string;
  iconSrc?: string;
  className?: string;
};

export default function EmptyState({
  message = "데이터가 없습니다.",
  iconSrc,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 w-full ${className}`}>
      {iconSrc && (
        <div className="mb-4">
          <Image src={iconSrc} alt="empty" width={48} height={48} />
        </div>
      )}
      <p className="text-Gray-4 body_1_2 text-center whitespace-pre-wrap">
        {message}
      </p>
    </div>
  );
}
