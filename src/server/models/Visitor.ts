import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  ip: string;
  userAgent: string;
  device: string;
  browser: string;
  os: string;
  city: string;
  country: string;
  returning: boolean;
  createdAt: Date;
}

const VisitorSchema: Schema = new Schema({
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  device: { type: String, required: true, default: 'desktop' },
  browser: { type: String, required: true, default: 'unknown' },
  os: { type: String, required: true, default: 'unknown' },
  city: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  returning: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Indexing for analytics query speed
VisitorSchema.index({ ip: 1 });
VisitorSchema.index({ createdAt: -1 });

export const VisitorModel = mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);
