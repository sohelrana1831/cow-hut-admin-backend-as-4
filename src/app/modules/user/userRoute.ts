import express from "express";
import { UserController } from "./userController";
import validateRequest from "../../../middleware/validateRequest";
import { UserValidation } from "./userValidation";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../../middleware/auth";
const router = express.Router();

router.post(
  "/signup",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUres);
router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserZodSchema),
  UserController.updateUser
);
router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRouters = router;
