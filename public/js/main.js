import { api } from './api.js';
import { initSocket, sendMessage, sendTyping, disconnectSocket } from './socket.js';
import { ui } from './ui.js';

let currentUser = null;
let token = null;

// DOM Elements
const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// Initialize
function init() {
  const storedToken = localStorage.getItem('chat_token');
  const storedUser = localStorage.getItem('chat_user');
  
  if (storedToken && storedUser) {
    token = storedToken;
    currentUser = JSON.parse(storedUser);
    connectChat();
  }
}

function handleAuthSuccess(data) {
  token = data.token;
  currentUser = data.user;
  localStorage.setItem('chat_token', token);
  localStorage.setItem('chat_user', JSON.stringify(currentUser));
  ui.showToast('Login successful!', 'success');
  connectChat();
}

// Event Listeners
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    const data = await api.login(username, password);
    handleAuthSuccess(data);
  } catch (err) {
    ui.showToast(err.message, 'error');
  }
});

registerBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    return ui.showToast('Username and password are required', 'error');
  }
  
  try {
    const data = await api.register(username, password);
    handleAuthSuccess(data);
  } catch (err) {
    ui.showToast(err.message, 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('chat_token');
  localStorage.removeItem('chat_user');
  token = null;
  currentUser = null;
  disconnectSocket();
  ui.showAuth();
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (content) {
    sendMessage(content);
    messageInput.value = '';
  }
});

let typingTimer;
messageInput.addEventListener('input', () => {
  if (!typingTimer) {
    sendTyping();
    // Only send typing event once every 2 seconds max
    typingTimer = setTimeout(() => { typingTimer = null; }, 2000);
  }
});

function connectChat() {
  ui.showChat();
  
  initSocket(token, {
    onConnect: () => console.log('Connected to real-time server'),
    onError: (err) => {
      ui.showToast(`Authentication Error: ${err}`, 'error');
      logoutBtn.click(); // force logout on auth error with sockets
    },
    onPastMessages: (messages) => {
      ui.renderPastMessages(messages, currentUser._id);
    },
    onNewMessage: (message) => {
      ui.renderMessage(message, currentUser._id);
      if (message.userId !== currentUser._id) {
        // Hide typing indicator immediately when a new message arrives
        ui.typingIndicator.classList.add('hidden');
      }
    },
    onUserTyping: (username) => {
      ui.showTyping(username);
    }
  });
}

// Start app
init();
