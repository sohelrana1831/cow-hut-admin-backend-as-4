import express from "express";
import { OrderController } from "./orderController";
import auth from "../../../middleware/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
const router = express.Router();

// Orders routes

router.post("/", auth(ENUM_USER_ROLE.BUYER), OrderController.createOrders);
router.get(
  "/",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  OrderController.getOrders
);
router.get(
  "/:id",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  OrderController.getSingleOrder
);
export const OrderRouters = router;
