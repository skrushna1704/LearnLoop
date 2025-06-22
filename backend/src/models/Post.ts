import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  type: 'success_story' | 'skill_offer' | 'learning_request';
  content: string;
  skillsExchanged?: {
    taught: string;
    learned: string;
  };
  skillOffered?: string;
  skillSeeking?: string;
  sessions?: number;
  duration?: string;
  image?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  tags: string[];
  featured: boolean;
  urgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['success_story', 'skill_offer', 'learning_request'], 
    required: true 
  },
  content: { type: String, required: true, trim: true },
  skillsExchanged: {
    taught: { type: String },
    learned: { type: String }
  },
  skillOffered: { type: String },
  skillSeeking: { type: String },
  sessions: { type: Number },
  duration: { type: String },
  image: { type: String },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false }
}, { timestamps: true });

// Index for better query performance
PostSchema.index({ type: 1, createdAt: -1 });
PostSchema.index({ featured: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });

export default mongoose.model<IPost>('Post', PostSchema); 