import bcrypt from 'bcryptjs';

import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { writeUsersSnapshot } from '../utils/userSnapshot.js';

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profile: user.profile,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
  loginCount: user.loginCount,
  token: generateToken(user._id.toString()),
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    profile: { fullName: name.trim() },
  });

  await writeUsersSnapshot();

  res.status(201).json(buildAuthPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save();
  await writeUsersSnapshot();

  user.password = undefined;
  res.json(buildAuthPayload(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profile: req.user.profile,
    createdAt: req.user.createdAt,
    lastLoginAt: req.user.lastLoginAt,
    loginCount: req.user.loginCount,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, fullName, gender, location, birthday, websites, github, linkedin, x, readme, work, education, skills, avatarUrl } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name?.trim()) {
    user.name = name.trim();
  }

  user.profile = {
    ...user.profile,
    ...(fullName !== undefined && { fullName: fullName.trim() }),
    ...(gender !== undefined && { gender: gender.trim() }),
    ...(location !== undefined && { location: location.trim() }),
    ...(birthday !== undefined && { birthday: birthday.trim() }),
    ...(websites !== undefined && { websites: websites.trim() }),
    ...(github !== undefined && { github: github.trim() }),
    ...(linkedin !== undefined && { linkedin: linkedin.trim() }),
    ...(x !== undefined && { x: x.trim() }),
    ...(readme !== undefined && { readme: readme.trim() }),
    ...(work !== undefined && { work: work.trim() }),
    ...(education !== undefined && { education: education.trim() }),
    ...(skills !== undefined && { skills: skills.trim() }),
    ...(avatarUrl !== undefined && { avatarUrl: avatarUrl.trim() }),
  };

  const updated = await user.save();
  await writeUsersSnapshot();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    profile: updated.profile,
    createdAt: updated.createdAt,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400);
    throw new Error('Email and new password are required');
  }

  if (newPassword.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(newPassword)) {
    res.status(400);
    throw new Error('Password must include at least one uppercase letter');
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    res.status(400);
    throw new Error('Password must include at least one symbol');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('No account found with this email');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  await writeUsersSnapshot();

  res.json({ message: 'Password reset successful. Please login with your new password.' });
});
