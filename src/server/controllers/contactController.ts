import { Request, Response } from 'express';
import { MessageModel } from '../models/Message';
import { connectDB, getFallbackStore } from '../config/db';
import { handleContactFormEmails } from '../services/emailService';

export async function submitContactForm(req: Request, res: Response): Promise<void> {
  let { name, email, subject, message } = req.body;

  // Basic Validation
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
    return;
  }

  // Sanitize Inputs from HTML injection tags
  name = String(name).replace(/<[^>]*>/g, '').trim().substring(0, 100);
  email = String(email).trim().substring(0, 150);
  subject = String(subject).replace(/<[^>]*>/g, '').trim().substring(0, 200);
  message = String(message).replace(/<[^>]*>/g, '').trim().substring(0, 2000);

  // Email format structure regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please submit a valid email address.' });
    return;
  }

  const isConnected = await connectDB();

  try {
    const recordPayload = {
      name,
      email,
      subject,
      message,
      createdAt: new Date()
    };

    let processedDb = false;
    if (isConnected) {
      try {
        await MessageModel.create(recordPayload);
        processedDb = true;
      } catch (dbErr: any) {
        console.error('⚠️ Database error during submitContactForm, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }

    if (!processedDb) {
      // In-memory fallback
      const store = getFallbackStore();
      store.messages.push({
        _id: 'sandbox-' + Math.random().toString(36).substr(2, 9),
        ...recordPayload
      });
    }

    // Trigger dual asynchronous email responses via SMTP or log simulated outputs
    // Execute independently so email lag does not block faster client UI response codes
    handleContactFormEmails(name, email, subject, message).catch(err => {
      console.error('⚠️ Contact form background email process error:', err);
    });

    res.status(201).json({
      status: 'success',
      message: 'Your inquiry transmission was delivered successfully. Confirmation emails sent.'
    });
  } catch (err: any) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to record transmission. Please try again later.' });
  }
}

/**
 * Endpoint for authenticated master list inquiries retrieval
 */
export async function getContactMessages(req: Request, res: Response): Promise<void> {
  const isConnected = await connectDB();

  try {
    let processedDb = false;
    if (isConnected) {
      try {
        const messages = await MessageModel.find().sort({ createdAt: -1 });
        res.json(messages);
        processedDb = true;
      } catch (dbErr: any) {
        console.error('⚠️ Database error during getContactMessages, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }

    if (!processedDb) {
      const store = getFallbackStore();
      // Reverse copy list to mimic sort index ordering
      res.json([...store.messages].reverse());
    }
  } catch (error: any) {
    console.error('Get messages DB fault:', error);
    res.status(500).json({ error: 'Could not fetch records from catalog.' });
  }
}
