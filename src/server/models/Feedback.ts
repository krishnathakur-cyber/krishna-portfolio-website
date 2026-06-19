import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  rating: number; // 1-5
  liked: string;
  improvement: string;
  recommend: string; // "Yes" or "No"
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  liked: { type: String, default: '' },
  improvement: { type: String, default: '' },
  recommend: { type: String, default: 'Yes' },
  createdAt: { type: Date, default: Date.now }
});

FeedbackSchema.index({ createdAt: -1 });

export const FeedbackModel = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
