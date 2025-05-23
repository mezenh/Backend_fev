import express from "express";
import {
  getDestinationsByRegion,
  getTopRatedDestinations,
} from "../controllers/destinationController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Public
router.get("/by-region/:region", getDestinationsByRegion);
router.get("/top-rated", getTopRatedDestinations);

// Privé (utilisateurs connectés)
router.post("/:id/reviews", protect, addReview);

export default router;