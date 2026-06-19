import mongoose, { Schema, Document } from 'mongoose';

export interface IPageVisit {
  page: string;
  timeSpent: number; // in seconds
  enteredAt: Date;
}

export interface ISession extends Document {
  visitorId: string;
  sessionToken: string;
  entryTime: Date;
  exitTime?: Date;
  duration: number; // accumulated total duration in seconds
  pagesVisited: IPageVisit[];
  trafficSource: string;
  city: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  createdAt: Date;
}

const PageVisitSchema = new Schema({
  page: { type: String, required: true },
  timeSpent: { type: Number, default: 0 },
  enteredAt: { type: Date, default: Date.now }
});

const SessionSchema: Schema = new Schema({
  visitorId: { type: String, required: true },
  sessionToken: { type: String, required: true, unique: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  duration: { type: Number, default: 0 },
  pagesVisited: [PageVisitSchema],
  trafficSource: { type: String, default: 'direct' },
  city: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  device: { type: String, default: 'desktop' },
  browser: { type: String, default: 'unknown' },
  os: { type: String, default: 'unknown' },
  createdAt: { type: Date, default: Date.now }
});

SessionSchema.index({ sessionToken: 1 });
SessionSchema.index({ visitorId: 1 });
SessionSchema.index({ entryTime: -1 });

export const SessionModel = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
