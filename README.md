# 💜 Unforgotten (H & S) — Private Couple Space

A beautifully designed, private, offline-first mobile application built for couples to stay in harmony. Named Hourglass to symbolize the gentle rhythm of time, it features a shared anniversary countdown and an intuitive cycle tracker to foster deeper understanding, empathy, and connection.

Designed with a sleek, romantic aesthetic utilizing a Pink & Violet color palette, the app balances intimate health tracking with celebratory relationship milestones.

---

## 🚀 Key Features

*   Offline-First Architecture: Complete local-first functionality. Data loads instantly and seamlessly queues changes when network connectivity is lost.
*   Dual-Purpose Dashboard: 
    *   *Her Space:* A private, secure monthly cycle and period tracker.
    *   *Our Space:* A shared anniversary and milestone countdown tracker.
*   Real-Time Synchronization: Seamless, secure data syncing across both partners' devices.
*   Extensible Design: Built with a modular database schema to easily support future features (e.g., shared wishlists, daily mood tracking, photo memories).

---

## 🛠 Tech Stack

*   Frontend: React Native (Expo / Bare Workflow)
*   Styling: Tailwind CSS (via NativeWind)
*   Local Database: SQLite (for instantaneous offline reads/writes)
*   Backend & Sync Engine: Supabase (PostgreSQL, Realtime Sync, and Auth)

---

## 🎨 Design & Color Palette

The user interface leverages a premium, calming, and romantic palette optimized for a dark/light hybrid theme:

| Component / Use Case | Color Role | Tailwind Color | Hex Code |
| :--- | :--- | :--- | :--- |
| Main UI & Backgrounds | Deep Violet (Calm & Trust) | violet-950 | #4c1d95 |
| Primary Actions / Cycle Logs | Vibrant Pink (Intimacy & Energy) | berry-500 | #f43f5e |
| Anniversaries & Milestones | Gentle Gold (Celebration) | milestone-500| #f59e0b |

---

## 🏗 Architecture & Database Flow

[ React Native UI ]
│
▼ (Instant Read/Write)
[ Local SQLite DB ]
│
▼ (Background Sync Engine)
[ Supabase Backend ] <───(Realtime Sync)───> [ Partner's Device ]


1. Local Writes: All user logs (period tracking, anniversary updates) are written instantly to the local SQLite database.
2. Background Sync: A sync manager detects network availability and pushes changes to Supabase via Postgres Changes/Websockets.
3. Conflict Resolution: Simple timestamp-based conflict resolution handles concurrent updates gracefully.

---

## 🔒 Security & Privacy

Privacy is paramount for this project. 
* All sensitive health data is isolated to the specific user profile before sync.
* Secure Row-Level Security (RLS) policies are enforced in Supabase to ensure only authenticated partners can access the shared database cluster.

---
Created with 💜 by S for H.
