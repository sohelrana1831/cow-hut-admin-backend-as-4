"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouters = void 0;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("./adminController");
const validateRequest_1 = __importDefault(require("../../../middleware/validateRequest"));
const adminValidation_1 = require("./adminValidation");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/create-admin", (0, validateRequest_1.default)(adminValidation_1.AdminValidation.createAdminZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), adminController_1.AdminController.createAdmin);
router.post("/login", (0, validateRequest_1.default)(adminValidation_1.AdminValidation.adminLoginZodSchema), adminController_1.AdminController.loginAdmin);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), adminController_1.AdminController.getAllAdmin);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), adminController_1.AdminController.getSingleAdmin);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), adminController_1.AdminController.updateAdmin);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), adminController_1.AdminController.deleteAdmin);
exports.AdminRouters = router;
