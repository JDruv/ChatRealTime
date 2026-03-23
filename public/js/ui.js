export const ui = {
  toastContainer: document.getElementById('toast-container'),
  authView: document.getElementById('auth-view'),
  chatView: document.getElementById('chat-view'),
  chatMessages: document.getElementById('chat-messages'),
  typingIndicator: document.getElementById('typing-indicator'),
  typingUser: document.getElementById('typing-user'),

  showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  showChat() {
    this.authView.classList.remove('active');
    this.chatView.classList.add('active');
  },

  showAuth() {
    this.chatView.classList.remove('active');
    this.authView.classList.add('active');
  },

  formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Oggi, ${timeString}`;
    if (isYesterday) return `Ieri, ${timeString}`;
    return `${date.toLocaleDateString()} ${timeString}`;
  },

  renderMessage(msg, currentUserId) {
    const isSelf = msg.userId === currentUserId;
    const div = document.createElement('div');
    div.className = `message ${isSelf ? 'self' : 'other'}`;
    
    // Escape HTML from content to prevent XSS
    const safeContent = document.createElement('div');
    safeContent.textContent = msg.content;

    div.innerHTML = `
      <div class="msg-bubble">${safeContent.innerHTML}</div>
      <div class="msg-info">
        <span class="msg-author">${msg.username}</span>
        <span class="msg-time">${this.formatTime(msg.createdAt)}</span>
      </div>
    `;
    this.chatMessages.appendChild(div);
    this.scrollToBottom();
  },

  renderPastMessages(messages, currentUserId) {
    this.chatMessages.innerHTML = '';
    messages.forEach(msg => this.renderMessage(msg, currentUserId));
  },

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },

  showTyping(username) {
    this.typingUser.textContent = username;
    this.typingIndicator.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.typingIndicator.classList.add('hidden');
    }, 3000);
  }
};
