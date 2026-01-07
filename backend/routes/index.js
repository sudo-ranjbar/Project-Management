import express from "express";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js"
import projectRoutes from "./project.js"

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/project", projectRoutes);

export default router; 