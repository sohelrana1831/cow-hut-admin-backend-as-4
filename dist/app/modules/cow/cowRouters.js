"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRouters = void 0;
const express_1 = __importDefault(require("express"));
const cowController_1 = require("./cowController");
const auth_1 = __importDefault(require("../../../middleware/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cowController_1.CowController.createCow);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER), cowController_1.CowController.getAllCows);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER), cowController_1.CowController.getSingleCow);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cowController_1.CowController.updateCow);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), cowController_1.CowController.deleteCow);
exports.CowRouters = router;
