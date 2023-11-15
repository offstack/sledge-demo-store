/* eslint-disable no-unused-vars */
"use client";

import { SledgeProvider } from "@sledge-app/core";
import "@sledge-app/core/style.css";
import { ReactNode } from "react";

type IProvider = {
  children: ReactNode;
  apiKey: string;
  instantSearchApiKey: string;
  userId: string;
  userEmail: string;
  userFullname: string;
  sledgeSession?: any;
  sledgeSettings?: any;
};

export default function SledgeProviderComponent({
  children,
  apiKey,
  instantSearchApiKey,
  userId,
  userEmail,
  userFullname,
  sledgeSession,
  sledgeSettings,
}: IProvider) {
  return (
    <SledgeProvider
      apiKey={apiKey}
      instantSearchApiKey={instantSearchApiKey}
      userId={userId}
      userEmail={userEmail}
      userFullname={userFullname}
      sledgeSession={sledgeSession}
      sledgeSettings={sledgeSettings}
    >
      {children}
    </SledgeProvider>
  );
}
