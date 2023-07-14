"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("./userController");
const validateRequest_1 = __importDefault(require("../../../middleware/validateRequest"));
const userValidation_1 = require("./userValidation");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(userValidation_1.UserValidation.createUserZodSchema), userController_1.UserController.createUser);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), userController_1.UserController.getAllUres);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), userController_1.UserController.getSingleUser);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(userValidation_1.UserValidation.createUserZodSchema), userController_1.UserController.updateUser);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), userController_1.UserController.deleteUser);
exports.UserRouters = router;
