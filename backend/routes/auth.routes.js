import express from "express";
import {
	getMe,
	loginController,
	logoutController,
	signupController,
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
const router = express.Router();

router.get("/me", protectedRoute, getMe);

router.post("/signup", signupController);

router.post("/login", loginController);

router.post("/logout", logoutController);

export default router;
