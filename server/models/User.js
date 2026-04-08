import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: '' },
    gender: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    birthday: { type: String, trim: true, default: '' },
    websites: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    x: { type: String, trim: true, default: '' },
    readme: { type: String, trim: true, default: '' },
    work: { type: String, trim: true, default: '' },
    education: { type: String, trim: true, default: '' },
    skills: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    profile: {
      type: profileSchema,
      default: () => ({}),
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
