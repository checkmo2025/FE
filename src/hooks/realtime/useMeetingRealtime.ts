"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client, StompSubscription } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";

import { createMeetingStompClient } from "@/lib/socket/createMeetingStompClient";
import { meetingRealtimeDestinations } from "@/lib/socket/meetingRealtimeDestinations";
import {
  appendChatMessageToChatsCache,
  applyPresentationEventToTopicsCache,
} from "@/lib/socket/meetingRealtimeCache";
import type {
  MeetingChatMessageEvent,
  MeetingPresentationEvent,
  MeetingRealtimeErrorBody,
} from "@/types/groups/meetingRealtime";

type UseMeetingRealtimeParams = {
  clubId: number;
  meetingId: number;
  presentationTeamId: number | null;
  chatTeamId: number | null;
  isChatOpen: boolean;
  isStaff: boolean;
  myTeamId: number | null;
  enabled?: boolean;
  onPresentationEvent?: (event: MeetingPresentationEvent) => void;
  onRealtimeResynced?: () => void;
};

type SubscriptionMap = {
  presentation?: StompSubscription;
  chat?: StompSubscription;
  error?: StompSubscription;
};

export function useMeetingRealtime({
  clubId,
  meetingId,
  presentationTeamId,
  chatTeamId,
  isChatOpen,
  isStaff,
  myTeamId,
  enabled = true,
  onPresentationEvent,
  onRealtimeResynced,
}: UseMeetingRealtimeParams) {
  const queryClient = useQueryClient();

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<SubscriptionMap>({});
  const latestRef = useRef({
    clubId,
    meetingId,
    presentationTeamId,
    chatTeamId,
    isChatOpen,
    isStaff,
    myTeamId,
    onPresentationEvent,
    onRealtimeResynced,
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    latestRef.current = {
      clubId,
      meetingId,
      presentationTeamId,
      chatTeamId,
      isChatOpen,
      isStaff,
      myTeamId,
      onPresentationEvent,
      onRealtimeResynced,
    };
  }, [
    clubId,
    meetingId,
    presentationTeamId,
    chatTeamId,
    isChatOpen,
    isStaff,
    myTeamId,
    onPresentationEvent,
    onRealtimeResynced,
  ]);

  const cleanupSubscriptions = useCallback(() => {
    subscriptionsRef.current.presentation?.unsubscribe();
    subscriptionsRef.current.chat?.unsubscribe();
    subscriptionsRef.current.error?.unsubscribe();
    subscriptionsRef.current = {};
  }, []);

  const invalidateRealtimeQueries = useCallback(async () => {
    const current = latestRef.current;

    if (current.presentationTeamId) {
      await queryClient.invalidateQueries({
        queryKey: [
          "clubs",
          current.clubId,
          "meetings",
          current.meetingId,
          "teams",
          current.presentationTeamId,
          "topics",
        ],
      });
    }

    if (current.isChatOpen && current.chatTeamId) {
      await queryClient.invalidateQueries({
        queryKey: [
          "clubs",
          current.clubId,
          "meetings",
          current.meetingId,
          "teams",
          current.chatTeamId,
          "chats",
        ],
      });
    }

    await queryClient.invalidateQueries({
      queryKey: ["clubs", current.clubId, "meetings", current.meetingId, "detail"],
    });
  }, [queryClient]);

  const resubscribe = useCallback(() => {
    const client = clientRef.current;
    if (!client || !client.connected) return;

    cleanupSubscriptions();

    const current = latestRef.current;

    subscriptionsRef.current.error = client.subscribe(
      meetingRealtimeDestinations.userErrorQueue,
      (message) => {
        let parsed: MeetingRealtimeErrorBody | null = null;
        try {
          parsed = message.body ? JSON.parse(message.body) : null;
        } catch {
          parsed = null;
        }

        console.error("[meeting realtime][error queue]", {
          headers: message.headers,
          body: message.body,
          parsed,
        });
      }
    );

    if (current.presentationTeamId) {
      subscriptionsRef.current.presentation = client.subscribe(
        meetingRealtimeDestinations.subscribePresentation(
          current.clubId,
          current.meetingId,
          current.presentationTeamId
        ),
        (message) => {
          const event = JSON.parse(message.body) as MeetingPresentationEvent;
          applyPresentationEventToTopicsCache(queryClient, event);
          latestRef.current.onPresentationEvent?.(event);
        }
      );
    }

    const canSubscribeChat =
      current.isChatOpen &&
      current.chatTeamId !== null &&
      (current.isStaff || current.chatTeamId === current.myTeamId);

    if (canSubscribeChat && current.chatTeamId) {
      subscriptionsRef.current.chat = client.subscribe(
        meetingRealtimeDestinations.subscribeChatMessages(
          current.clubId,
          current.meetingId,
          current.chatTeamId
        ),
        (message) => {
          const event = JSON.parse(message.body) as MeetingChatMessageEvent;
          appendChatMessageToChatsCache(queryClient, event);
        }
      );
    }
  }, [cleanupSubscriptions, queryClient]);

  useEffect(() => {
    if (!enabled) return;
    if (!Number.isFinite(clubId) || !Number.isFinite(meetingId)) return;

    const client = createMeetingStompClient({
      onConnect: async () => {
        setIsConnected(true);
        resubscribe();
        await invalidateRealtimeQueries();
        latestRef.current.onRealtimeResynced?.();
      },
      onStompError: () => {
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
      onWebSocketError: () => {
        setIsConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      setIsConnected(false);
      cleanupSubscriptions();
      void client.deactivate();
      clientRef.current = null;
    };
  }, [clubId, meetingId, enabled, cleanupSubscriptions, resubscribe, invalidateRealtimeQueries]);

  useEffect(() => {
    if (!clientRef.current?.connected) return;
    resubscribe();
  }, [presentationTeamId, chatTeamId, isChatOpen, isStaff, myTeamId, resubscribe]);

  const publishChatMessage = useCallback(
    (teamId: number, rawContent: string) => {
      const client = clientRef.current;
      const content = rawContent.trim();

      if (!client || !client.connected) {
        throw new Error("웹소켓이 아직 연결되지 않았습니다.");
      }

      if (!content) {
        throw new Error("메시지를 입력해 주세요.");
      }

      if (content.length > 400) {
        throw new Error("채팅은 400자 이하로 입력해 주세요.");
      }

      if (!isStaff && myTeamId !== teamId) {
        throw new Error("본인 팀 채팅만 전송할 수 있습니다.");
      }

      client.publish({
        destination: meetingRealtimeDestinations.publishChatMessage(
          clubId,
          meetingId,
          teamId
        ),
        body: JSON.stringify({ content }),
        headers: {
          "content-type": "application/json",
        },
      });
    },
    [clubId, meetingId, isStaff, myTeamId]
  );

  const publishPresentation = useCallback(
    (teamId: number, topicId: number, isSelected: boolean) => {
      const client = clientRef.current;

      if (!client || !client.connected) {
        throw new Error("웹소켓이 아직 연결되지 않았습니다.");
      }

      if (topicId == null) {
        throw new Error("유효한 발제 ID가 필요합니다.");
      }

      client.publish({
        destination: meetingRealtimeDestinations.publishPresentation(
          clubId,
          meetingId,
          teamId
        ),
        body: JSON.stringify({ topicId, isSelected }),
        headers: {
          "content-type": "application/json",
        },
      });
    },
    [clubId, meetingId]
  );

  const canSubscribeChat =
    isChatOpen &&
    chatTeamId !== null &&
    (isStaff || chatTeamId === myTeamId);

  return {
    isConnected,
    canSubscribeChat,
    publishChatMessage,
    publishPresentation,
  };
}