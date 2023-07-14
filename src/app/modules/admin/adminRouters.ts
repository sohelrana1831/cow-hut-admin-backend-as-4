import express from "express";
import { AdminController } from "./adminController";
import validateRequest from "../../../middleware/validateRequest";
import { AdminValidation } from "./adminValidation";
import auth from "../../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

router.post(
  "/create-admin",
  validateRequest(AdminValidation.createAdminZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.createAdmin
);

router.post(
  "/login",
  validateRequest(AdminValidation.adminLoginZodSchema),
  AdminController.loginAdmin
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), AdminController.getAllAdmin);
router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), AdminController.getSingleAdmin);
router.patch("/:id", auth(ENUM_USER_ROLE.ADMIN), AdminController.updateAdmin);
router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), AdminController.deleteAdmin);

export const AdminRouters = router;
