import { Project } from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, techStack } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  const project = await Project.create({
    user: req.user._id,
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    dueDate: dueDate || null,
    techStack: Array.isArray(techStack)
      ? techStack.map((item) => item.trim()).filter(Boolean)
      : [],
  });

  res.status(201).json(project);
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(projects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  if (!validateObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid project id');
  }

  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  if (!validateObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid project id');
  }

  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, status, priority, dueDate, techStack } = req.body;

  if (title !== undefined) project.title = title.trim();
  if (description !== undefined) project.description = description.trim();
  if (status !== undefined) project.status = status;
  if (priority !== undefined) project.priority = priority;
  if (dueDate !== undefined) project.dueDate = dueDate || null;
  if (techStack !== undefined) {
    project.techStack = Array.isArray(techStack)
      ? techStack.map((item) => item.trim()).filter(Boolean)
      : [];
  }

  const updatedProject = await project.save();
  res.json(updatedProject);
});

export const deleteProject = asyncHandler(async (req, res) => {
  if (!validateObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid project id');
  }

  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.deleteOne();
  res.json({ message: 'Project deleted successfully' });
});
