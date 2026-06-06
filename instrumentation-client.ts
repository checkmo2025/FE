import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://415293b2a74c82af51a4d9b6f9436fbb@o4511437350436864.ingest.us.sentry.io/4511518360141824",
  environment: process.env.NODE_ENV,

  // 성능 모니터링: 페이지 로딩, API 응답 시간 등 100% 수집
  // production 배포 시 0.1~0.2 (10~20%)로 낮추는 것을 권장
  tracesSampleRate: 1.0,

  // Session Replay: 에러 발생 시 직전 화면 녹화본 100% 수집
  replaysOnErrorSampleRate: 1.0,

  // Session Replay: 일반 세션 10% 수집
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration(),
  ],
});

// 클라이언트 사이드 라우터 전환(페이지 이동) 성능 트래킹 (v10 필수 export)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
