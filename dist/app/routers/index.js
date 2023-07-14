"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = require("../modules/user/userRoute");
const cowRouters_1 = require("../modules/cow/cowRouters");
const orderRoute_1 = require("../modules/order/orderRoute");
const adminRouters_1 = require("../modules/admin/adminRouters");
const authRouters_1 = require("../modules/auth/authRouters");
const router = express_1.default.Router();
const modulesRouters = [
    {
        pathName: "/auth",
        routeName: authRouters_1.AuthRouters,
    },
    {
        pathName: "/admins",
        routeName: adminRouters_1.AdminRouters,
    },
    {
        pathName: "/users",
        routeName: userRoute_1.UserRouters,
    },
    {
        pathName: "/cows",
        routeName: cowRouters_1.CowRouters,
    },
    {
        pathName: "/orders",
        routeName: orderRoute_1.OrderRouters,
    },
];
modulesRouters.forEach((route) => router.use(route.pathName, route.routeName));
exports.default = router;
