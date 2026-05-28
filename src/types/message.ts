// types.ts

export interface MessageItem {
  id: number;
  text: string;
}

export interface CareData {
  appName: string;
  version: string;
  description: string;
  categories: {
    anniversary: MessageItem[];
    sweet: MessageItem[];
    near_period: MessageItem[];
    in_period: MessageItem[];
  };
  combinatorial_components: {
    openers: string[];
    endings: string[];
  };
}

// Strictly type the valid categories
export type CareCategory = keyof CareData["categories"];

// Strict type for what we push inside the Expo Notification custom data bundle
export interface NotificationPayload {
  category: CareCategory;
  appVersion: string;
  messageId: number;
  [key: string]: unknown;
}
