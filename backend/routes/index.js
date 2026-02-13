import express from "express";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js"
import projectRoutes from "./project.js"
import taskRoutes from "./task.js"
import userRoutes from "./user.js"

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/project", projectRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);

export default router; 