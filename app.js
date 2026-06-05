/**
 * Night Owl — Main Application Logic
 * Manages screens, socket connection, chat, encryption, and censoring.
 */

import { FireflySystem } from './particles.js';
import { censorMessage, detectCrisis } from './censor.js';
import NightOwlCrypto from './crypto.js';
// ══════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════
// Paste your hosted backend URL here once deployed (e.g. 'https://night-owl-backend.onrender.com')
const BACKEND_URL = '';

// ══════════════════════════════════════════════════

// STATE
// ══════════════════════════════════════════════════
const state = {
  currentScreen: null,
  socket: null,
  crypto: new NightOwlCrypto(),
  fireflies: null,
  sessionTimer: null,
  sessionSeconds: 45 * 60, // 45 minutes
  hasExtended: false,
  typingTimeout: null,
  isTyping: false,
  devMode: true, // Set false for production
  partnerId: null,
  quoteInterval: null,
};

// ── Anonymous quotes ──
const QUOTES = [
  { text: '"Talking to a stranger at 3 AM saved my semester"', attr: '— A Night Owl, 2026' },
  { text: '"I didn\'t need advice. I just needed someone to say \'I get it\'"', attr: '— A Night Owl, 2026' },
  { text: '"Sometimes the best therapist is a stranger who can\'t sleep either"', attr: '— A Night Owl, 2026' },
  { text: '"I came here lonely. I left feeling human again"', attr: '— A Night Owl, 2026' },
  { text: '"No judgement, no names, just two people being real"', attr: '— A Night Owl, 2026' },
  { text: '"I was spiraling. Then someone said \'I feel that too\'. That was enough"', attr: '— A Night Owl, 2026' },
  { text: '"The night is long, but it always ends"', attr: '— Night Owl' },
  { text: '"Being anonymous let me be honest for the first time in months"', attr: '— A Night Owl, 2026' },
];

// ══════════════════════════════════════════════════
// DOM REFERENCES
// ══════════════════════════════════════════════════
const $ = (id) => document.getElementById(id);

const dom = {
  app: $('app'),
  devBanner: $('devBanner'),
  // Screens
  screenSleeping: $('screen-sleeping'),
  screenLanding: $('screen-landing'),
  screenWaiting: $('screen-waiting'),
  screenChat: $('screen-chat'),
  screenEnd: $('screen-end'),
  screenSos: $('screen-sos'),
  // Sleeping
  countdown: $('countdown'),
  // Landing
  activeNumber: $('activeNumber'),
  moodGrid: $('moodGrid'),
  // Waiting
  quoteText: $('quoteText'),
  quoteAttr: $('quoteAttr'),
  cancelSearch: $('cancelSearch'),
  // Chat
  chatMessages: $('chatMessages'),
  chatInput: $('chatInput'),
  sendBtn: $('sendBtn'),
  sessionTimer: $('sessionTimer'),
  typingIndicator: $('typingIndicator'),
  leaveBtn: $('leaveBtn'),
  sosBtn: $('sosBtn'),
  // End
  endTitle: $('endTitle'),
  endMessage: $('endMessage'),
  findAnotherBtn: $('findAnotherBtn'),
  goHomeBtn: $('goHomeBtn'),
  // SOS
  sosClose: $('sosClose'),
  // Crisis
  crisisPopup: $('crisisPopup'),
  crisisHelpBtn: $('crisisHelpBtn'),
  crisisDismissBtn: $('crisisDismissBtn'),
  // Connection
  connectionStatus: $('connectionStatus'),
};

// ══════════════════════════════════════════════════
// SCREEN MANAGEMENT
// ══════════════════════════════════════════════════
function showScreen(screenId) {
  const screens = ['screen-sleeping', 'screen-landing', 'screen-waiting', 'screen-chat', 'screen-end'];
  screens.forEach(id => {
    const el = $(id);
    if (el) el.classList.toggle('active', id === screenId);
  });
  state.currentScreen = screenId;

  // Start/stop fireflies based on screen
  if (screenId === 'screen-landing') {
    if (!state.fireflies) {
      state.fireflies = new FireflySystem('fireflies');
    }
    state.fireflies.start();
  } else if (state.fireflies) {
    state.fireflies.stop();
  }
}

// ══════════════════════════════════════════════════
// TIME GATE
// ══════════════════════════════════════════════════
function isNightTime() {
  if (state.devMode) return true;
  const hour = new Date().getHours();
  return hour >= 22 || hour < 4;
}

function updateCountdown() {
  const now = new Date();
  const hour = now.getHours();

  if (isNightTime()) {
    // Only switch to landing if we're currently on the sleeping screen
    // Don't override waiting, chat, or end screens!
    if (state.currentScreen === 'screen-sleeping' || state.currentScreen === null) {
      showScreen('screen-landing');
    }
    return;
  }

  // Daytime — only go to sleeping if on landing (don't interrupt active sessions)
  if (state.currentScreen === 'screen-landing' || state.currentScreen === null) {
    showScreen('screen-sleeping');
  }

  // Calculate time until 10 PM
  const target = new Date(now);
  if (hour < 22) {
    target.setHours(22, 0, 0, 0);
  } else {
    target.setDate(target.getDate() + 1);
    target.setHours(22, 0, 0, 0);
  }

  const diff = target - now;
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  dom.countdown.textContent =
    `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ══════════════════════════════════════════════════
// SOCKET CONNECTION
// ══════════════════════════════════════════════════
function connectSocket() {
  const connectionUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : BACKEND_URL;

  state.socket = io(connectionUrl, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  const socket = state.socket;

  socket.on('connect', () => {
    console.log('🌙 Connected to Night Owl server');
    hideConnectionStatus();
  });

  socket.on('disconnect', () => {
    showConnectionStatus('Connection lost — reconnecting...', 'disconnected');
  });

  socket.on('reconnecting', () => {
    showConnectionStatus('Reconnecting...', 'reconnecting');
  });

  socket.on('reconnect', () => {
    hideConnectionStatus();
  });

  // ── Active user count ──
  socket.on('active-users', (count) => {
    dom.activeNumber.textContent = count;
  });

  // ── Waiting confirmation ──
  socket.on('waiting', () => {
    showScreen('screen-waiting');
    startQuoteCarousel();
  });

  // ── Matched with someone ──
  socket.on('matched', async ({ partnerId, peerMood, peerRole }) => {
    state.partnerId = partnerId;
    stopQuoteCarousel();

    // Start E2E encryption key exchange
    try {
      const publicKey = await state.crypto.generateKeyPair();
      socket.emit('public-key', { publicKey });
    } catch (err) {
      console.error('Crypto error:', err);
      // Fallback: proceed without encryption
      showChatScreen(peerMood, peerRole);
    }
  });

  // ── Receive peer's public key ──
  socket.on('peer-public-key', async ({ publicKey }) => {
    try {
      await state.crypto.deriveSharedKey(publicKey);
      console.log('🔐 E2E encryption established');

      // If we haven't sent our key yet, do it now
      if (!state.crypto.isReady) {
        const ourKey = await state.crypto.generateKeyPair();
        socket.emit('public-key', { publicKey: ourKey });
      }
    } catch (err) {
      console.error('Key exchange error:', err);
    }

    showChatScreen();
  });

  // ── Receive encrypted message ──
  socket.on('encrypted-message', async ({ ciphertext, iv }) => {
    try {
      if (state.crypto.isReady) {
        const plaintext = await state.crypto.decrypt(
          NightOwlCrypto.base64ToBuffer(ciphertext),
          NightOwlCrypto.base64ToBuffer(iv)
        );
        addMessage(plaintext, 'theirs');
      } else {
        // Fallback if encryption isn't ready
        addMessage('[encrypted message]', 'theirs');
      }
    } catch (err) {
      console.error('Decrypt error:', err);
      addMessage('[could not decrypt]', 'theirs');
    }
  });

  // ── Typing indicator ──
  socket.on('peer-typing', ({ isTyping }) => {
    dom.typingIndicator.classList.toggle('visible', isTyping);
    if (isTyping) {
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    }
  });

  // ── Peer left ──
  socket.on('peer-left', ({ reason }) => {
    endChat(reason === 'left'
      ? 'They\'ve headed to sleep. Hope your night gets better 💜'
      : 'Connection lost. The night goes on.'
    );
  });

  // ── Chat ended (by us) ──
  socket.on('chat-ended', () => {
    endChat('You left the chat. Take care of yourself tonight 💛');
  });

  // ── Search cancelled ──
  socket.on('search-cancelled', () => {
    stopQuoteCarousel();
    showScreen('screen-landing');
  });

  // ── Search timeout ──
  socket.on('search-timeout', () => {
    stopQuoteCarousel();
    showScreen('screen-landing');
  });

  // ── Error ──
  socket.on('error-msg', ({ message }) => {
    alert(message); // Simple for now
  });
}

// ══════════════════════════════════════════════════
// CHAT FUNCTIONALITY
// ══════════════════════════════════════════════════
function showChatScreen(peerMood, peerRole) {
  showScreen('screen-chat');
  dom.chatMessages.innerHTML = '';
  dom.chatInput.value = '';
  dom.chatInput.disabled = false;
  dom.sendBtn.disabled = true;

  // System message
  addMessage('You\'re connected! Say hi 👋', 'system');
  addMessage('Remember: no names, no photos, just kindness', 'system');

  // Start session timer
  state.sessionSeconds = 45 * 60;
  state.hasExtended = false;
  startSessionTimer();

  // Focus input
  setTimeout(() => dom.chatInput.focus(), 300);
}

async function sendMessage() {
  const raw = dom.chatInput.value.trim();
  if (!raw) return;

  // Censor the message
  const censored = censorMessage(raw);

  // Check for crisis keywords (on the raw message)
  const crisis = detectCrisis(raw);
  if (crisis.isCrisis) {
    showCrisisPopup();
  }

  // Show censored message locally
  addMessage(censored, 'mine');
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;

  // Animate send button
  dom.sendBtn.classList.add('sending');
  setTimeout(() => dom.sendBtn.classList.remove('sending'), 500);

  // Encrypt and send
  try {
    if (state.crypto.isReady) {
      const { ciphertext, iv } = await state.crypto.encrypt(censored);
      state.socket.emit('encrypted-message', {
        ciphertext: NightOwlCrypto.bufferToBase64(ciphertext),
        iv: NightOwlCrypto.bufferToBase64(iv),
      });
    } else {
      // Fallback: send censored plaintext (shouldn't happen normally)
      state.socket.emit('encrypted-message', {
        ciphertext: btoa(censored),
        iv: btoa('noencryption'),
      });
    }
  } catch (err) {
    console.error('Send error:', err);
  }

  // Stop typing indicator
  sendTypingStatus(false);
}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  dom.chatMessages.appendChild(msg);
  dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

function endChat(message) {
  // Clean up
  clearSessionTimer();
  state.crypto.destroy();
  state.partnerId = null;
  dom.chatInput.disabled = true;

  // Show end screen
  dom.endMessage.textContent = message;
  showScreen('screen-end');
}

// ══════════════════════════════════════════════════
// SESSION TIMER
// ══════════════════════════════════════════════════
function startSessionTimer() {
  clearSessionTimer();
  updateTimerDisplay();

  state.sessionTimer = setInterval(() => {
    state.sessionSeconds--;

    if (state.sessionSeconds <= 0) {
      if (!state.hasExtended) {
        // Offer extension
        state.sessionSeconds = 0;
        clearSessionTimer();
        offerExtension();
      } else {
        // Time's up
        clearSessionTimer();
        state.socket.emit('leave-chat');
        endChat('Session ended. Rest well tonight 💛');
      }
      return;
    }

    // Warn at 5 minutes
    if (state.sessionSeconds === 300) {
      addMessage('⏰ 5 minutes remaining', 'system');
    }

    updateTimerDisplay();
  }, 1000);
}

function clearSessionTimer() {
  if (state.sessionTimer) {
    clearInterval(state.sessionTimer);
    state.sessionTimer = null;
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(state.sessionSeconds / 60);
  const secs = state.sessionSeconds % 60;
  dom.sessionTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function offerExtension() {
  addMessage('⏰ Session time is up. Would you like to extend by 15 minutes?', 'system');

  const extendBtn = document.createElement('div');
  extendBtn.className = 'message system';
  extendBtn.innerHTML = '<span style="cursor:pointer;text-decoration:underline;color:#FF7E6B;font-weight:700;">Yes, extend 15 min</span> &nbsp;|&nbsp; <span style="cursor:pointer;color:#8A7E7A;">No, end chat</span>';

  const spans = extendBtn.querySelectorAll('span');
  spans[0].addEventListener('click', () => {
    state.hasExtended = true;
    state.sessionSeconds = 15 * 60;
    startSessionTimer();
    extendBtn.remove();
    addMessage('Extended by 15 minutes ✨', 'system');
  });
  spans[1].addEventListener('click', () => {
    extendBtn.remove();
    state.socket.emit('leave-chat');
    endChat('Session ended. Sweet dreams 🌙');
  });

  dom.chatMessages.appendChild(extendBtn);
  dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

// ══════════════════════════════════════════════════
// TYPING INDICATOR
// ══════════════════════════════════════════════════
function sendTypingStatus(typing) {
  if (state.isTyping === typing) return;
  state.isTyping = typing;
  if (state.socket && state.partnerId) {
    state.socket.emit('typing', { isTyping: typing });
  }
}

function handleTyping() {
  sendTypingStatus(true);
  clearTimeout(state.typingTimeout);
  state.typingTimeout = setTimeout(() => {
    sendTypingStatus(false);
  }, 2000);
}

// ══════════════════════════════════════════════════
// QUOTE CAROUSEL
// ══════════════════════════════════════════════════
function startQuoteCarousel() {
  // Prevent duplicate intervals
  stopQuoteCarousel();

  let idx = 0;
  showQuote(idx);

  state.quoteInterval = setInterval(() => {
    idx = (idx + 1) % QUOTES.length;
    showQuote(idx);
  }, 5000);
}

function showQuote(idx) {
  dom.quoteText.style.opacity = '0';
  dom.quoteAttr.style.opacity = '0';

  setTimeout(() => {
    dom.quoteText.textContent = QUOTES[idx].text;
    dom.quoteAttr.textContent = QUOTES[idx].attr;
    dom.quoteText.style.opacity = '1';
    dom.quoteAttr.style.opacity = '1';
  }, 300);
}

function stopQuoteCarousel() {
  if (state.quoteInterval) {
    clearInterval(state.quoteInterval);
    state.quoteInterval = null;
  }
}

// ══════════════════════════════════════════════════
// SOS & CRISIS
// ══════════════════════════════════════════════════
function showSos() {
  dom.screenSos.classList.add('active');
}

function hideSos() {
  dom.screenSos.classList.remove('active');
}

function showCrisisPopup() {
  dom.crisisPopup.classList.add('visible');
}

function hideCrisisPopup() {
  dom.crisisPopup.classList.remove('visible');
}

// ══════════════════════════════════════════════════
// CONNECTION STATUS
// ══════════════════════════════════════════════════
function showConnectionStatus(message, type) {
  dom.connectionStatus.textContent = message;
  dom.connectionStatus.className = `connection-status visible ${type}`;
}

function hideConnectionStatus() {
  dom.connectionStatus.classList.remove('visible');
}

// ══════════════════════════════════════════════════
// SECURITY: Block paste of images/media
// ══════════════════════════════════════════════════
function blockMediaPaste(e) {
  const items = e.clipboardData?.items;
  if (items) {
    for (const item of items) {
      if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
        e.preventDefault();
        return;
      }
    }
  }
}

function blockDrop(e) {
  e.preventDefault();
}

// ══════════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════════
function bindEvents() {
  // ── Mood selection ──
  dom.moodGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood-btn');
    if (!btn) return;

    const mood = btn.dataset.mood;
    const role = btn.dataset.role;

    // Visual feedback
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);

    // Emit search
    state.socket.emit('search', { mood, role });
    showScreen('screen-waiting');
    startQuoteCarousel();
  });

  // ── Cancel search ──
  dom.cancelSearch.addEventListener('click', () => {
    state.socket.emit('cancel-search');
    stopQuoteCarousel();
    showScreen('screen-landing');
  });

  // ── Chat input ──
  dom.chatInput.addEventListener('input', () => {
    dom.sendBtn.disabled = !dom.chatInput.value.trim();
    handleTyping();
  });

  dom.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (dom.chatInput.value.trim()) {
        sendMessage();
      }
    }
  });

  // Block media paste & drop
  dom.chatInput.addEventListener('paste', blockMediaPaste);
  dom.chatInput.addEventListener('drop', blockDrop);

  // ── Send button ──
  dom.sendBtn.addEventListener('click', sendMessage);

  // ── Leave chat ──
  dom.leaveBtn.addEventListener('click', () => {
    if (confirm('Leave this chat?')) {
      state.socket.emit('leave-chat');
      endChat('You left the chat. Take care tonight 💛');
    }
  });

  // ── SOS ──
  dom.sosBtn.addEventListener('click', showSos);
  dom.sosClose.addEventListener('click', hideSos);

  // ── Crisis popup ──
  dom.crisisHelpBtn.addEventListener('click', () => {
    hideCrisisPopup();
    showSos();
  });
  dom.crisisDismissBtn.addEventListener('click', hideCrisisPopup);

  // ── End screen ──
  dom.findAnotherBtn.addEventListener('click', () => {
    showScreen('screen-landing');
  });

  dom.goHomeBtn.addEventListener('click', () => {
    showScreen('screen-landing');
  });

  // ── Dev mode toggle ──
  if (state.devMode) {
    dom.devBanner.style.display = 'block';
    dom.devBanner.addEventListener('click', () => {
      state.devMode = !state.devMode;
      dom.devBanner.textContent = state.devMode ? '🔧 DEV MODE' : '🌙 LIVE MODE';
      updateCountdown();
    });
  }
}

// ══════════════════════════════════════════════════
// QUOTE FADE TRANSITIONS
// ══════════════════════════════════════════════════
function addQuoteTransitionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .quote-text, .quote-attr {
      transition: opacity 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
function init() {
  addQuoteTransitionStyles();

  // Determine initial screen
  if (isNightTime()) {
    showScreen('screen-landing');
  } else {
    showScreen('screen-sleeping');
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Connect to server
  connectSocket();

  // Bind all events
  bindEvents();

  console.log('🌙 Night Owl initialized');
}

// ── Start ──
init();
