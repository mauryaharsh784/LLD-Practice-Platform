import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import {
  createAttempt,
  evaluateAttempt,
  getAttempt,
  listAttempts,
  updateAttempt,
} from "../controllers/attemptsController";

const router = Router();

router.post("/", asyncHandler(createAttempt));
router.get("/", asyncHandler(async (req, res) => listAttempts(req, res)));
router.get("/:id", asyncHandler(async (req, res) => getAttempt(req, res)));
router.patch("/:id", asyncHandler(updateAttempt));
router.post("/:id/evaluate", asyncHandler(evaluateAttempt));

export default router;
