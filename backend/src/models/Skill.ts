import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  description: string;
  category: string;
  level: string;
  teachers: mongoose.Types.ObjectId[];
  learners: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  level: { type: String },
  teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  learners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<ISkill>('Skill', SkillSchema); 