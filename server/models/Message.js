const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'messages.json');

// Helper to ensure file exists
async function ensureFile() {
  try {
    await fs.access(dataPath);
  } catch (error) {
    await fs.writeFile(dataPath, JSON.stringify([]), 'utf8');
  }
}

class Message {
  static async _readAll() {
    await ensureFile();
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data || '[]');
  }

  static async _writeAll(messages) {
    await fs.writeFile(dataPath, JSON.stringify(messages, null, 2), 'utf8');
  }

  static async find() {
    return await this._readAll();
  }

  static async findLast(limit) {
    const messages = await this._readAll();
    return messages.slice(-limit);
  }

  static async insertOne(messageData) {
    const messages = await this._readAll();
    
    // Server-side timestamp
    const now = new Date().toISOString();

    const newMessage = {
      _id: crypto.randomUUID(),
      userId: messageData.userId,
      username: messageData.username,
      content: messageData.content,
      createdAt: now,
      updatedAt: now
    };

    messages.push(newMessage);
    await this._writeAll(messages);
    return newMessage;
  }
}

module.exports = Message;
