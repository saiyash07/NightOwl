# 🌙 Night Owl

> **Anonymous late-night peer support for students. You're not alone at 2 AM.**

Night Owl is a lightweight, zero-dependency, end-to-end encrypted (E2EE) peer-to-peer chat application built specifically for college students seeking safe, anonymous late-night conversations. It is engineered with strict boundary enforcement, rigorous identity protection filters, and a circadian "Time Gate" that aligns with the times of day when students are most vulnerable to loneliness and stress.

---

## ✨ Why Night Owl is Unique

Most chat platforms encourage endless scrolling, identity swapping, and public profiles. Night Owl is designed from the ground up as an anti-social, safety-first utility to support mental health under the cover of night.

### 🕒 1. The Circadian Time Gate
To prevent doomscrolling during daytime lectures and encourage healthy sleep habits, the application is strictly **inactive during the day**.
* **Daily Schedule:** Only opens between **10:00 PM and 4:00 AM** local time.
* **Sleeping State:** During the day, the application displays a tranquil daytime sky with floating clouds and a live countdown timer ticking down to 10 PM.
* **Healthy Limits:** Users are rate-limited to a maximum of **3 sessions per night** to prevent over-attachment or dependency.

### 🛡️ 2. Client-Side "Paranoid Mode" Censor Engine
Before any message is encrypted, it runs through the **Censor Engine (v3)** client-side. The engine operates on the philosophy: **"Better to over-censor than leak identity."**
It protects student identity by intercepting:
* **Direct Names:** Scans against dictionaries of over 10,000 common first names and surnames, replacing matching text with hashes (`####`).
* **Fuzzy Spelling & Leet-speak:** Detects name typos using a Levenshtein distance algorithm ($D \le 3$) and normalizes leet-speak (e.g., `s4iy4sh` $\rightarrow$ `saiyash` $\rightarrow$ `#######`).
* **Social Media Handles:** Automatically strips patterns like `@username`, spaced-out handles, domains, and common social phrasing (e.g., *"my snap is..."*, *"insta:..."*).
* **Location & Institutional Data:** Automatically censors sentences following triggers like *"from..."*, *"studying at..."*, *"living in..."*, or containing class details (e.g., *"class 12B"*, *"section A"*).
* **Direct Communication Info:** Blocks phone numbers (both international and 10-digit formats), email addresses (and spaced-out variants like `user at gmail dot com`), and raw links/URLs.
* **File Uploads & Clipboard Blocks:** Direct event interceptors prevent pasting or dropping images or video files, blocking visual harassment or identification.

### 🔐 3. Zero-Knowledge & End-to-End Encryption (E2EE)
Night Owl employs browser-native **Web Crypto APIs** to guarantee absolute privacy:
* **Session-Keys:** Generating a new ephemeral 256-bit Elliptic Curve Diffie-Hellman (ECDH) key pair on the `P-256` curve for every match.
* **Derivation:** Public keys are exchanged over Socket.io, deriving a shared secret key via AES-GCM encryption on the client.
* **Zero Storage:** Plaintext never leaves the browser. The Node.js/Express server acts as a blind relay pipeline—it receives encrypted base64 strings and distributes them, unable to read or decrypt any message.
* **Destruction:** All keys are wiped from memory immediately upon disconnect.

### 🤝 4. Peer Matching Protocol
Students are matched based on emotional alignment and desired roles:
* **Venters & Listeners:** A prioritized matchmaking queue pairs students seeking to vent (`venter`) directly with students volunteering to listen (`listener`).
* **Mood Matching:** If direct roles aren't specified, the system aligns similar moods (e.g., *Lonely*, *Anxious*, *Cant-sleep*, *Overthinking*, *Feeling low*).
* **Safety Net:** If no ideal match exists, the queue falls back to the next available student to ensure no one is left waiting alone at 3 AM.
* **Breathe & Wait:** While waiting, the client features a rhythmic "breathing circle" animation alongside a carousel of anonymous feedback quotes to calm anxiety.

### ⏳ 5. Healthy Boundaries & Time Limits
* **45-Minute Limit:** Chats are locked to a strict 45-minute countdown to prevent unhealthy emotional codependency or late-night exhaustion.
* **Mutual Extension:** If a connection is deep and positive, users can mutually agree to a one-time 15-minute extension.
* **Proactive Crisis Help:** The client detects self-harm keywords in real-time. If trigger words are detected, it presents a supportive crisis popup with local helpline resources.

---

## 🛠️ Architecture & Tech Stack

Night Owl is built using clean, vanilla web standards for fast, secure performance.

```
├── server.js            # Node.js Express server + Socket.io matching relay
├── app.js               # Client controller (screen state, socket events, encryption flow)
├── crypto.js            # Web Crypto API wrapper (ECDH Key Exchange + AES-GCM)
├── censor.js            # Paranoid-mode Censor Engine & Crisis detection
├── names.js             # Dictionaries of first names, surnames, cities, colleges, subjects
├── particles.js         # Calming canvas-based dynamic firefly animation system
├── styles.css           # Premium vanilla CSS styling with animations
└── index.html           # Main semantic HTML shell
```

* **Frontend:** Vanilla HTML5, CSS3, and ES6 JavaScript. Uses HTML5 Canvas for the ambient firefly system.
* **Backend:** Node.js, Express, and Socket.io.
* **Security:** Native Web Crypto API (`window.crypto.subtle`).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Setup & Run
1. Clone this repository (or copy it locally):
   ```bash
   git clone https://github.com/Saiyash07/NightOwl.git
   cd NightOwl
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server in development mode:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

*Note: In production mode, the server restricts access during the day. In **development mode** (enabled by default), a top banner allows you to toggle between `DEV MODE` and `LIVE MODE` to test the sleeping screen behavior.*

---

## 📄 License
This project is licensed under the MIT License.
