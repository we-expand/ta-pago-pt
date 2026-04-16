import * as Sentry from "@sentry/react";
import { useEffect } from "react";

export const initMonitoring = () => {
  // Sentry DSN should be provided via environment variable
  // If not present, we can log a warning or just skip initialization
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (dsn) {
    Sentry.init({
      dsn: dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
    console.log("Monitoring initialized with Sentry");
  } else {
    // Silently skip initialization if no DSN is present to avoid console warnings during development
    console.log("Sentry monitoring disabled (no DSN provided)");
  }
};

export const ErrorBoundary = Sentry.ErrorBoundary;

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error("Logged Error:", error);
  Sentry.captureException(error, { extra: context });
};