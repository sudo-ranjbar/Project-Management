import express from "express";
import { validateRequest } from "zod-express-middleware";
import authMiddleware from "../middlewares/auth-middleware.js";
import { z } from "zod"
import { createProject } from "../controllers/project-controller.js";
import { projectSchema } from "../libs/validate-schema.js";

const router = express.Router();

router.post(
    "/:workspaceId/create-project",
    authMiddleware,
    validateRequest({
        params: z.object({
            workspaceId: z.string()
        }),
        body: projectSchema
    }),
    createProject
)


export default router