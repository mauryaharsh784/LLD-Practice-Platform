import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { getProblem, listAttemptsForProblem, listProblems } from "../controllers/problemsController";

const router = Router();

router.get("/", asyncHandler(async (req, res) => listProblems(req, res)));
router.get("/:id", asyncHandler(async (req, res) => getProblem(req, res)));
router.get("/:id/attempts", asyncHandler(async (req, res) => listAttemptsForProblem(req, res)));

export default router;
