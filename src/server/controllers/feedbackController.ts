import { Request, Response } from 'express';
import { FeedbackModel } from '../models/Feedback';
import { connectDB, getFallbackStore } from '../config/db';

export async function submitFeedback(req: Request, res: Response): Promise<void> {
  let { rating, liked, improvement, recommend } = req.body;

  if (rating === undefined) {
    res.status(400).json({ error: 'Star rating (1-5) is a required metric.' });
    return;
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    res.status(400).json({ error: 'Star rating must be a valid number between 1 and 5.' });
    return;
  }

  // Sanitizing inputs
  liked = String(liked || '').replace(/<[^>]*>/g, '').trim().substring(0, 1000);
  improvement = String(improvement || '').replace(/<[^>]*>/g, '').trim().substring(0, 1000);
  recommend = String(recommend || 'Yes').trim().substring(0, 10);

  const isConnected = await connectDB();

  try {
    const payload = {
      rating: numRating,
      liked,
      improvement,
      recommend,
      createdAt: new Date()
    };

    let processedDb = false;
    if (isConnected) {
      try {
        await FeedbackModel.create(payload);
        processedDb = true;
      } catch (dbErr: any) {
        console.error('⚠️ Database error during submitFeedback, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }

    if (!processedDb) {
      const store = getFallbackStore();
      store.feedback.push({
        _id: 'sandbox-' + Math.random().toString(36).substr(2, 9),
        ...payload
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully. Thank you for your constructive recommendation!'
    });
  } catch (err: any) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Could not record visual feedback.' });
  }
}

export async function getFeedbackStatistics(req: Request, res: Response): Promise<void> {
  const isConnected = await connectDB();

  try {
    let processedDb = false;
    if (isConnected) {
      try {
         const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 });
         res.json(feedbacks);
         processedDb = true;
      } catch (dbErr: any) {
        console.error('⚠️ Database error during getFeedbackStatistics, falling back to in-memory store:', dbErr?.message || dbErr);
      }
    }

    if (!processedDb) {
      const store = getFallbackStore();
      res.json([...store.feedback].reverse());
    }
  } catch (error: any) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to access feedback records.' });
  }
}
