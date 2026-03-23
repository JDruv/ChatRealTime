const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

// Helper to ensure file exists
async function ensureFile() {
  try {
    await fs.access(dataPath);
  } catch (error) {
    await fs.writeFile(dataPath, JSON.stringify([]), 'utf8');
  }
}

class User {
  static async _readAll() {
    await ensureFile();
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data || '[]');
  }

  static async _writeAll(users) {
    // Write safely by catching potential issues
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf8');
  }

  static async findOne(condition) {
    const users = await this._readAll();
    return users.find(u => {
      for (let key in condition) {
        if (u[key] !== condition[key]) return false;
      }
      return true;
    });
  }

  static async create(userData) {
    const users = await this._readAll();
    
    // Check if user already exists
    if (users.find(u => u.username === userData.username)) {
      throw new Error('Username already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      _id: crypto.randomUUID(),
      username: userData.username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await this._writeAll(users);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}

module.exports = User;
