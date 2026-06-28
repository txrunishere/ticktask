import { Task } from "../models/task.model.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ALLOWED_STATUS = ["todo", "in-progress", "done"];
const ALLOWED_PRIORITY = ["low", "medium", "high"];
const ALLOWED_SORT_FIELDS = ["createdAt", "dueData", "priority"];

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy, order } = req.query;
  let filter = {};

  if (status) {
    if (!ALLOWED_STATUS.includes(status))
      throw new AppError(`Invalid status filter: ${status}`);
    filter.status = status;
  }

  if (priority) {
    if (!ALLOWED_PRIORITY.includes(priority))
      throw new AppError(`Invalid priority filter: ${priority}`);
    filter.priority = priority;
  }

  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  let tasks;

  if (sortField === "priority") {
    const priorityRank = {
      low: 1,
      medium: 2,
      high: 3,
    };
    tasks = await Task.find(filter).lean();
    tasks.sort((a, b) => {
      const diff = priorityRank[a.priority] - priorityRank[b.priority];
      return sortOrder === 1 ? diff : -diff;
    });
  } else {
    tasks = await Task.find(filter).sort({
      [sortField]: sortOrder,
    });
  }

  AppResponse(res, 200, {
    message: "Tasks fetched successfully",
    success: true,
    data: {
      tasks,
    },
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) throw new AppError("Task not found", 404);

  AppResponse(res, 200, {
    message: `Task fetched successfully`,
    success: true,
    data: {
      task,
    },
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    status,
    priority,
  });

  AppResponse(res, 201, {
    message: "Task created successfully",
    success: true,
    data: {
      task,
    },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      status,
      priority,
      dueDate,
    },
    {
      returnDocument: "after",
      runValidators: true,
      context: "query",
    },
  );

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  AppResponse(res, 200, {
    message: "Task updated successfully",
    success: true,
    data: {
      task,
    },
  });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!ALLOWED_STATUS.includes(status)) {
    throw new AppError(`Invalid status: ${status}`, 400);
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: "after", runValidators: true },
  );

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  AppResponse(res, 200, {
    message: "Task status updated successfully",
    success: true,
    data: {
      task,
    },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete(req.params.id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  AppResponse(res, 200, {
    message: "Task deleted successfully",
    success: true,
    data: {
      id: req.params.id,
    },
  });
});

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
