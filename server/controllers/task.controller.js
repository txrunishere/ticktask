import { Task } from "../models/task.model.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTasks = asyncHandler((req, res) => {});

const getTaskById = asyncHandler((req, res) => {});

const createTask = asyncHandler((req, res) => {});

const updateTask = asyncHandler((req, res) => {});

const updateTaskStatus = asyncHandler((req, res) => {});

const deleteTask = asyncHandler((req, res) => {});

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
