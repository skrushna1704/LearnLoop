import mongoose, { Document, Schema } from 'mongoose';

export interface IExchange extends Document {
  title: string;
  users: {
    user: Schema.Types.ObjectId;
    role: 'teacher' | 'learner' | 'both';
    skill: Schema.Types.ObjectId;
    chatClearedAt?: Date;
  }[];
  offeredSkill: Schema.Types.ObjectId;
  desiredSkill: Schema.Types.ObjectId;
  proposer: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  status: 'pending' | 'active' | 'completed' | 'rejected' | 'scheduled';
  progress: number;
  sessions: {
    date: Date;
    duration: number; // in minutes
    notes?: string;
  }[];
  completedDate?: Date;
  feedback: {
    user: Schema.Types.ObjectId;
    rating: number;
    comment: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeSchema: Schema = new Schema({
  title: { type: String, required: true },
  users: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['teacher', 'learner', 'both'], required: true },
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    chatClearedAt: { type: Date },
  }],
  proposer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'rejected', 'scheduled'], 
    default: 'pending' 
  },
  progress: { type: Number, default: 0 },
  sessions: [{
    date: { type: Date },
    duration: { type: Number },
    notes: { type: String }
  }],
  completedDate: { type: Date },
  feedback: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model<IExchange>('Exchange', ExchangeSchema); 