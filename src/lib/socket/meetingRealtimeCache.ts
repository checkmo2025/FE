import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
  MeetingChatMessageEvent,
  MeetingPresentationEvent,
} from "@/types/groups/meetingRealtime";

type TopicsQueryData = {
  existingTeams: number[];
  requestedTeam: number;
  topics: Array<{
    topicId: number;
    content: string;
    createdAt: string;
    author: unknown;
    isSelected: boolean;
  }>;
};

type ChatPageData = {
  chats: Array<{
    messageId: number;
    content: string;
    sendAt: string;
    sender: {
      memberId: string;
      nickname: string;
      profileImageUrl: string | null;
    };
  }>;
  hasNext: boolean;
  nextCursor: number | null;
};

export function applyPresentationEventToTopicsCache(
  queryClient: QueryClient,
  event: MeetingPresentationEvent
) {
  const queryKey = [
    "clubs",
    event.clubId,
    "meetings",
    event.meetingId,
    "teams",
    event.teamId,
    "topics",
  ];

  queryClient.setQueryData<TopicsQueryData | undefined>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      topics: oldData.topics.map((topic) =>
        topic.topicId === event.topicId
          ? { ...topic, isSelected: event.isSelected }
          : topic
      )
    };
  });
}

export function appendChatMessageToChatsCache(
  queryClient: QueryClient,
  event: MeetingChatMessageEvent
) {
  const queryKey = [
    "clubs",
    event.clubId,
    "meetings",
    event.meetingId,
    "teams",
    event.teamId,
    "chats",
  ];

  queryClient.setQueryData<InfiniteData<ChatPageData> | undefined>(
    queryKey,
    (oldData) => {
      if (!oldData || oldData.pages.length === 0) return oldData;

      const alreadyExists = oldData.pages.some((page) =>
        page.chats.some((chat) => chat.messageId === event.messageId)
      );

      if (alreadyExists) return oldData;

      const newMessage = {
        messageId: event.messageId,
        content: event.content,
        sendAt: event.sendAt,
        sender: {
          memberId: event.senderMemberId,
          nickname: event.senderNickname,
          profileImageUrl: event.senderProfileImageUrl,
        },
      };

      const lastPageIndex = oldData.pages.length - 1;
      const lastPage = oldData.pages[lastPageIndex];

      const newPages = [...oldData.pages];
      newPages[lastPageIndex] = {
        ...lastPage,
        chats: [...lastPage.chats, newMessage],
      };

      return {
        ...oldData,
        pages: newPages,
      };
    }
  );
}