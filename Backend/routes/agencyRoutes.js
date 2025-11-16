import express from "express";
import { registerAgency, loginAgency,  } from "../controllers/agencyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Import the middleware

const router = express.Router();

// 🔓 Public routes - NO middleware needed
router.post("/register", registerAgency);
router.post("/login", loginAgency);


export default router;