/**
 * Night Owl — Backend Server
 * Express + Socket.io for real-time anonymous peer matching & encrypted message relay.
 * ZERO message storage. The server is a blind relay pipe.
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingInterval: 25000,
  pingTimeout: 60000,
});

// ── Serve static files ──
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(express.static(__dirname));

// ── State (all in-memory, nothing persisted) ──
const waitingQueue = [];        // [{ socketId, mood, role, timestamp }]
const activePairs = new Map();  // socketId → partnerId
const sessionCounts = new Map();// ip → count (max 3 per night)
let activeUsers = 0;

// ── Night window config ──
const NIGHT_START = 22; // 10 PM
const NIGHT_END = 4;    // 4 AM
const SESSION_LIMIT = 3;
const DEV_MODE = process.env.DEV_MODE === 'true' || true; // Set to false for production

function isNightTime() {
  if (DEV_MODE) return true;
  const hour = new Date().getHours();
  return hour >= NIGHT_START || hour < NIGHT_END;
}

// ── Reset session counts at night start ──
function resetSessionCounts() {
  sessionCounts.clear();
}

// Reset every day at 10 PM
setInterval(() => {
  const now = new Date();
  if (now.getHours() === NIGHT_START && now.getMinutes() === 0) {
    resetSessionCounts();
  }
}, 60000);

// ── Matching logic ──
function findMatch(socket, mood, role) {
  // Try to match venter with listener first
  if (role === 'venter') {
    const listenerIdx = waitingQueue.findIndex(w =>
      w.role === 'listener' && w.socketId !== socket.id
    );
    if (listenerIdx !== -1) return waitingQueue.splice(listenerIdx, 1)[0];
  }

  // Try to match listener with any venter
  if (role === 'listener') {
    const venterIdx = waitingQueue.findIndex(w =>
      w.role === 'venter' && w.socketId !== socket.id
    );
    if (venterIdx !== -1) return waitingQueue.splice(venterIdx, 1)[0];
  }

  // Try same mood match
  const sameMoodIdx = waitingQueue.findIndex(w =>
    w.mood === mood && w.socketId !== socket.id
  );
  if (sameMoodIdx !== -1) return waitingQueue.splice(sameMoodIdx, 1)[0];

  // Try any match
  const anyIdx = waitingQueue.findIndex(w => w.socketId !== socket.id);
  if (anyIdx !== -1) return waitingQueue.splice(anyIdx, 1)[0];

  return null;
}

function removeFromQueue(socketId) {
  const idx = waitingQueue.findIndex(w => w.socketId === socketId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

function endPair(socketId) {
  const partnerId = activePairs.get(socketId);
  if (partnerId) {
    activePairs.delete(socketId);
    activePairs.delete(partnerId);
    return partnerId;
  }
  return null;
}

// ── Socket.io connection handling ──
io.on('connection', (socket) => {
  activeUsers++;
  io.emit('active-users', activeUsers);

  const clientIp = socket.handshake.address;

  console.log(`[+] Connected: ${socket.id} (Active: ${activeUsers})`);

  // ── Search for a match ──
  socket.on('search', ({ mood, role }) => {
    if (!isNightTime()) {
      socket.emit('error-msg', { message: 'Night Owl is only active between 10 PM and 4 AM' });
      return;
    }

    // Rate limit: max sessions per night
    const count = sessionCounts.get(clientIp) || 0;
    if (count >= SESSION_LIMIT && !DEV_MODE) {
      socket.emit('error-msg', {
        message: `You've had ${SESSION_LIMIT} sessions tonight. Rest well — we'll be here tomorrow 💛`
      });
      return;
    }

    // Remove from any existing queue
    removeFromQueue(socket.id);

    // Try to find a match
    const match = findMatch(socket, mood, role);

    if (match) {
      // Found a match — pair them
      const partnerSocket = io.sockets.sockets.get(match.socketId);
      if (!partnerSocket) {
        // Partner disconnected, put self in queue
        waitingQueue.push({ socketId: socket.id, mood, role, timestamp: Date.now() });
        return;
      }

      // Create pair
      activePairs.set(socket.id, match.socketId);
      activePairs.set(match.socketId, socket.id);

      // Increment session counts
      sessionCounts.set(clientIp, count + 1);
      const partnerIp = partnerSocket.handshake.address;
      sessionCounts.set(partnerIp, (sessionCounts.get(partnerIp) || 0) + 1);

      // Notify both
      socket.emit('matched', { partnerId: match.socketId, peerMood: match.mood, peerRole: match.role });
      partnerSocket.emit('matched', { partnerId: socket.id, peerMood: mood, peerRole: role });

      console.log(`[♥] Matched: ${socket.id} <-> ${match.socketId}`);
    } else {
      // No match — add to queue
      waitingQueue.push({ socketId: socket.id, mood, role, timestamp: Date.now() });
      socket.emit('waiting');
      console.log(`[~] Waiting: ${socket.id} (Queue: ${waitingQueue.length})`);
    }
  });

  // ── Cancel search ──
  socket.on('cancel-search', () => {
    removeFromQueue(socket.id);
    socket.emit('search-cancelled');
  });

  // ── Key exchange (E2E encryption) ──
  socket.on('public-key', ({ publicKey }) => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('peer-public-key', { publicKey });
      }
    }
  });

  // ── Relay encrypted message (server cannot read this) ──
  socket.on('encrypted-message', ({ ciphertext, iv }) => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('encrypted-message', { ciphertext, iv });
      }
    }
  });

  // ── Typing indicator ──
  socket.on('typing', ({ isTyping }) => {
    const partnerId = activePairs.get(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('peer-typing', { isTyping });
      }
    }
  });

  // ── Leave chat ──
  socket.on('leave-chat', () => {
    const partnerId = endPair(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('peer-left', { reason: 'left' });
      }
    }
    socket.emit('chat-ended', { reason: 'you-left' });
    console.log(`[←] Left: ${socket.id}`);
  });

  // ── Report user ──
  socket.on('report', () => {
    const partnerId = endPair(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('peer-left', { reason: 'disconnected' });
      }
    }
    socket.emit('chat-ended', { reason: 'reported' });
    console.log(`[!] Report from: ${socket.id}`);
  });

  // ── Disconnect ──
  socket.on('disconnect', () => {
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit('active-users', activeUsers);

    // Clean up queue
    removeFromQueue(socket.id);

    // Clean up pair
    const partnerId = endPair(socket.id);
    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (partnerSocket) {
        partnerSocket.emit('peer-left', { reason: 'disconnected' });
      }
    }

    console.log(`[-] Disconnected: ${socket.id} (Active: ${activeUsers})`);
  });
});

// ── Clean stale queue entries every 2 minutes ──
setInterval(() => {
  const now = Date.now();
  const staleTimeout = 5 * 60 * 1000; // 5 minutes
  for (let i = waitingQueue.length - 1; i >= 0; i--) {
    if (now - waitingQueue[i].timestamp > staleTimeout) {
      const staleSocket = io.sockets.sockets.get(waitingQueue[i].socketId);
      if (staleSocket) {
        staleSocket.emit('search-timeout');
      }
      waitingQueue.splice(i, 1);
    }
  }
}, 120000);

// ── Start server ──
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('');
  console.log('  🌙 Night Owl is awake');
  console.log(`  🔗 http://localhost:${PORT}`);
  console.log(`  🛡️  DEV_MODE: ${DEV_MODE}`);
  console.log(`  ⏰ Night window: ${NIGHT_START}:00 — ${NIGHT_END}:00`);
  console.log('');
});
