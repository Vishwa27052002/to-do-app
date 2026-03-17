"use client";

import React from "react";
import { LogLevel, StatsigProvider } from "@statsig/react-bindings";

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  // In a real app, you'd get the actual userID from your auth system (Clerk)
  // For now, we'll use a placeholder as per instructions
  const id = "a-user";

  const user = {
    userID: id,
  };

  return (
    <StatsigProvider
      sdkKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!}
      user={user}
      options={{ logLevel: LogLevel.Debug }}
    >
      {children}
    </StatsigProvider>
  );
}
