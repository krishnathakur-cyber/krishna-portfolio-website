import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';
import { connectDB, getFallbackStore } from '../config/db';

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password fields are required.' });
    return;
  }

  const isConnected = await connectDB();
  const secret = process.env.JWT_SECRET || 'fallback-portfolio-jwt-secret-string-2026';

  let processedDb = false;
  if (isConnected) {
    try {
      const inputUsername = username.toLowerCase().trim();
      const defaultUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
      const ownerEmail = 'krishnathakur222w@gmail.com';
      const isAllowedDefault = inputUsername === defaultUser || inputUsername === ownerEmail || inputUsername === 'krishna';

      // Find our admin user configuration
      let admin = await (AdminModel as any).findOne({ username: inputUsername });

      // Auto-Seed default admin credentials from .env or default presets if table is empty
      if (!admin && isAllowedDefault) {
        const hashPass = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'secure-default-password', 10);
        admin = await AdminModel.create({
          username: inputUsername,
          password: hashPass,
        });
      }

      if (admin) {
        const passMatch = await bcrypt.compare(password, admin.password);
        if (!passMatch) {
          res.status(401).json({ error: 'Incorrect credentials.' });
          return;
        }

        const token = jwt.sign({ id: admin._id, username: admin.username }, secret, { expiresIn: '12h' });
        res.json({ token, username: admin.username });
        processedDb = true;
      }
    } catch (error: any) {
      console.error('Login database error, falling back to local sandbox validation:', error?.message || error);
    }
  }

  if (!processedDb) {
    // Sandbox Mock Login fallback
    const inputUsername = username.toLowerCase().trim();
    const mockUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const ownerEmail = 'krishnathakur222w@gmail.com';
    const isMockMatched = inputUsername === mockUser || inputUsername === ownerEmail || inputUsername === 'krishna';
    const mockPass = process.env.ADMIN_PASSWORD || 'secure-default-password';

    if (isMockMatched && password === mockPass) {
      const token = jwt.sign({ id: 'mock-admin-id-999', username: inputUsername }, secret, { expiresIn: '12h' });
      res.json({ token, username: inputUsername, isSandbox: true });
    } else {
      res.status(401).json({ error: 'Incorrect credentials in Sandbox Mode (see .env.example)' });
    }
  }
}

/**
 * Custom register route used to establish and protect primary admin accounts
 */
export async function registerAdmin(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const isConnected = await connectDB();

  try {
    const hashPass = await bcrypt.hash(password, 10);

    let processedDb = false;
    if (isConnected) {
      try {
        const existing = await (AdminModel as any).findOne({ username: username.toLowerCase().trim() });
        if (existing) {
          res.status(400).json({ error: 'Administrator already exists with that username.' });
          return;
        }

        await AdminModel.create({
          username: username.toLowerCase().trim(),
          password: hashPass,
        });

        res.status(201).json({ status: 'success', message: 'Admin account provisioned.' });
        processedDb = true;
      } catch (dbErr: any) {
        console.error('⚠️ Database error during registerAdmin, falling back to sandbox storage:', dbErr?.message || dbErr);
      }
    }

    if (!processedDb) {
      const store = getFallbackStore();
      const existing = store.admins.find(s => s.username === username.toLowerCase().trim());
      if (existing) {
        res.status(400).json({ error: 'Administrator already exists in transient sandbox.' });
        return;
      }

      store.admins.push({
        _id: 'sandbox-' + Math.random().toString(36).substr(2, 9),
        username: username.toLowerCase().trim(),
        password: hashPass,
        createdAt: new Date()
      });

      res.status(201).json({ status: 'success', message: 'Admin account provisioned in transient sandbox cache.' });
    }
  } catch (error: any) {
    console.error('Register database error:', error);
    res.status(500).json({ error: 'Database system fault during enrolment.' });
  }
}
