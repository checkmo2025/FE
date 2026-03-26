export const meetingRealtimeDestinations = {
  subscribeChatMessages: (clubId: number, meetingId: number, teamId: number) =>
    `/sub/clubs/${clubId}/meetings/${meetingId}/teams/${teamId}/chat/messages`,

  subscribePresentation: (clubId: number, meetingId: number, teamId: number) =>
    `/sub/clubs/${clubId}/meetings/${meetingId}/teams/${teamId}/presentation`,

  publishChatMessage: (clubId: number, meetingId: number, teamId: number) =>
    `/pub/clubs/${clubId}/meetings/${meetingId}/teams/${teamId}/chat/message`,

  publishPresentation: (clubId: number, meetingId: number, teamId: number) =>
    `/pub/clubs/${clubId}/meetings/${meetingId}/teams/${teamId}/presentation`,

  userErrorQueue: "/user/queue/errors",
} as const;