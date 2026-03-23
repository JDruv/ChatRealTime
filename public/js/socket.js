export let socket = null;

export const initSocket = (token, callbacks) => {
  socket = io({
    auth: { token }
  });

  socket.on('connect', () => {
    callbacks.onConnect?.();
  });

  socket.on('connect_error', (err) => {
    callbacks.onError?.(err.message);
  });

  socket.on('past_messages', (messages) => {
    callbacks.onPastMessages?.(messages);
  });

  socket.on('new_message', (message) => {
    callbacks.onNewMessage?.(message);
  });

  socket.on('user_typing', (data) => {
    callbacks.onUserTyping?.(data.username);
  });
};

export const sendMessage = (content) => {
  if (socket) socket.emit('send_message', { content });
};

export const sendTyping = () => {
  if (socket) socket.emit('typing');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
