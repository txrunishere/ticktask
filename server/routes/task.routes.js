import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
router.route("/:id/status").patch(updateTaskStatus);

export default router;
