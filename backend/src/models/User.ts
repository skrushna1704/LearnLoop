import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  isProfileComplete: boolean;
  googleId?: string;
  authProvider: 'local' | 'google';
  profile: {
    name?: string;
    profilePicture?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    website?: string;
    availability?: {
      day: string;
      timeSlots: string[];
    }[];
  };
  skills_offered: {
    skillId: mongoose.Types.ObjectId;
    proficiency: number;
    verified: boolean;
    portfolio: string[];
    experience: string;
    description: string;
    endorsements: number;
  }[];
  skills_needed: {
    skillId: mongoose.Types.ObjectId;
    priority: number;
    learning_goals: string;
    experience: string;
    description: string;
  }[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  isProfileComplete: { type: Boolean, default: false },
  googleId: { type: String, sparse: true, unique: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  profile: {
    name: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    location: { type: String },
    timezone: { type: String },
    website: { type: String },
    availability: [
      {
        day: { type: String },
        timeSlots: [String],
      },
    ],
  },
  skills_offered: [
    {
      skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
      proficiency: { type: Number },
      verified: { type: Boolean, default: false },
      portfolio: [String],
      experience: { type: String },
      description: { type: String },
      endorsements: { type: Number, default: 0 },
    },
  ],
  skills_needed: [
    {
      skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
      priority: { type: Number },
      learning_goals: { type: String },
      experience: { type: String },
      description: { type: String },
    },
  ],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true });

UserSchema.index({ googleId: 1, authProvider: 1 });

export default mongoose.model<IUser>('User', UserSchema); 