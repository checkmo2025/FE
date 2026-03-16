"use client";

import React, { useEffect, useMemo } from "react";
import MyNotificationItem from "./items/MyNotificationItem";
import { useInfiniteNotificationsQuery } from "@/hooks/queries/useNotificationQueries";
import { useInView } from "react-intersection-observer";

const MyNotificationList = () => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteNotificationsQuery();

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.notifications) || [];
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-Gray-4 text-sm font-medium">
        불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 w-full text-red-500 text-sm font-medium">
        알림을 불러오는 데 실패했습니다.
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <p className="text-Gray-4 text-sm font-medium whitespace-pre-wrap text-center">
          새로운 알림이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-[8px] w-full max-w-[1048px] mx-auto px-[18px] md:px-[40px] lg:px-0">
      {notifications.map((notification) => (
        <MyNotificationItem key={notification.notificationId} notification={notification} />
      ))}
      <div ref={ref} className="h-10" />
      {isFetchingNextPage && (
        <div className="w-full text-center py-4 text-sm text-gray-500">
          추가 알림을 불러오는 중...
        </div>
      )}
    </div>
  );
};

export default MyNotificationList;
