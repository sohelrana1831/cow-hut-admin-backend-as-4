import express from "express";
import validateRequest from "../../../middleware/validateRequest";
import { AuthValidation } from "./authValidation";
import { AuthController } from "./authController";
const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUp
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);
export const AuthRouters = router;
