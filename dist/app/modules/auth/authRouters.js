"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../middleware/validateRequest"));
const authValidation_1 = require("./authValidation");
const authController_1 = require("./authController");
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(authValidation_1.AuthValidation.signUpZodSchema), authController_1.AuthController.signUp);
router.post("/login", (0, validateRequest_1.default)(authValidation_1.AuthValidation.loginZodSchema), authController_1.AuthController.loginUser);
router.post("/refresh-token", (0, validateRequest_1.default)(authValidation_1.AuthValidation.refreshTokenZodSchema), authController_1.AuthController.refreshToken);
exports.AuthRouters = router;
