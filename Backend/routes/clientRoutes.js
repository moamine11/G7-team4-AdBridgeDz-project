import express from "express";
import { registerClient, loginClient } from "../controllers/clientController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerClient);
router.post("/login", loginClient);



export default router;