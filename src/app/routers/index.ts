import express from "express";
import { UserRouters } from "../modules/user/userRoute";
import { CowRouters } from "../modules/cow/cowRouters";
import { OrderRouters } from "../modules/order/orderRoute";
import { AdminRouters } from "../modules/admin/adminRouters";
import { AuthRouters } from "../modules/auth/authRouters";
const router = express.Router();

const modulesRouters = [
  {
    pathName: "/auth",
    routeName: AuthRouters,
  },
  {
    pathName: "/admins",
    routeName: AdminRouters,
  },
  {
    pathName: "/users",
    routeName: UserRouters,
  },
  {
    pathName: "/cows",
    routeName: CowRouters,
  },
  {
    pathName: "/orders",
    routeName: OrderRouters,
  },
];
modulesRouters.forEach((route) => router.use(route.pathName, route.routeName));

export default router;
