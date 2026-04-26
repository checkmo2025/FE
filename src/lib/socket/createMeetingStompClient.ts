import { Client, type IFrame } from "@stomp/stompjs";

type CreateMeetingStompClientParams = {
  brokerURL?: string;
  onConnect?: (frame: IFrame) => void;
  onStompError?: (frame: IFrame) => void;
  onWebSocketClose?: () => void;
  onWebSocketError?: (event: Event) => void;
  debug?: boolean;
};

export function createMeetingStompClient({
  brokerURL = process.env.NEXT_PUBLIC_CHECKMO_WS_URL ?? "wss://api.checkmo.co.kr/ws-stomp",
  onConnect,
  onStompError,
  onWebSocketClose,
  onWebSocketError,
  //debug = process.env.NODE_ENV === "development",
}: CreateMeetingStompClientParams) {
  const client = new Client({
    brokerURL,
    reconnectDelay: 30000,
    heartbeatOutgoing: 25000,
    heartbeatIncoming: 20000,
    connectHeaders: {
      "heart-beat": "25000,20000",
    },
    //debug: debug ? (msg) => console.log("[STOMP]", msg) : () => {},
  });

  client.onConnect = (frame) => {
    //console.log("[STOMP] connected");
    onConnect?.(frame);
  };
  
  client.onStompError = (frame) => {
    //console.error("[STOMP] error frame", frame.headers, frame.body);
    onStompError?.(frame);
  };

  client.onWebSocketClose = () => {
    //console.warn("[STOMP] websocket closed");
    onWebSocketClose?.();
  };

  client.onWebSocketError = (event) => {
    //console.error("[STOMP] websocket error", event);
    onWebSocketError?.(event);
  };

  return client;
}