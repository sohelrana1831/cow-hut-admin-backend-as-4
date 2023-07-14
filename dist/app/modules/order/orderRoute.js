"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouters = void 0;
const express_1 = __importDefault(require("express"));
const orderController_1 = require("./orderController");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// Orders routes
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER), orderController_1.OrderController.createOrders);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER), orderController_1.OrderController.getOrders);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER), orderController_1.OrderController.getSingleOrder);
exports.OrderRouters = router;
