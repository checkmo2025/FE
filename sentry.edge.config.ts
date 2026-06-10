import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://415293b2a74c82af51a4d9b6f9436fbb@o4511437350436864.ingest.us.sentry.io/4511518360141824",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
