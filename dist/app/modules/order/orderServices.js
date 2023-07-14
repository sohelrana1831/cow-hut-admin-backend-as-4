"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cowModel_1 = require("../cow/cowModel");
const userModel_1 = require("../user/userModel");
const orderModel_1 = require("./orderModel");
const ApiError_1 = __importDefault(require("../../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createOrders = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const getCowData = yield cowModel_1.Cow.findById(payload.cow).session(session).exec();
        const getBuyerData = yield userModel_1.User.findById(payload.buyer)
            .session(session)
            .exec();
        const getSellerData = yield userModel_1.User.findById(getCowData === null || getCowData === void 0 ? void 0 : getCowData.seller)
            .session(session)
            .exec();
        if (!getCowData || !getBuyerData || !getSellerData) {
            throw new Error("Unable to find cow data, buyer data, or seller data");
        }
        if (getCowData.label === "sold out") {
            throw new Error("Cow is sold out!");
        }
        if (getBuyerData.budget < getCowData.price) {
            throw new Error("Insufficient balance to buy this Cow!");
        }
        const updateCowLabel = { label: "sold out" };
        const updateSellerIncome = {
            income: getSellerData.income + getCowData.price,
        };
        const updateBuyerBudget = {
            budget: getBuyerData.budget - getCowData.price,
        };
        const options = { new: true, session };
        const cowUpdatePromise = cowModel_1.Cow.findOneAndUpdate({ _id: payload.cow }, updateCowLabel, options).session(session);
        const sellerUpdatePromise = userModel_1.User.findOneAndUpdate({ _id: getCowData.seller }, updateSellerIncome, options).session(session);
        const buyerUpdatePromise = userModel_1.User.findOneAndUpdate({ _id: payload.buyer }, updateBuyerBudget, options).session(session);
        const [cowUpdate, sellerUpdate, buyerUpdate] = yield Promise.all([
            cowUpdatePromise,
            sellerUpdatePromise,
            buyerUpdatePromise,
        ]);
        if (!cowUpdate || !sellerUpdate || !buyerUpdate) {
            throw new Error("Failed to update cow, seller, or buyer data!");
        }
        const createdOrder = yield orderModel_1.Order.create(payload);
        const populatedOrder = yield orderModel_1.Order.findById(createdOrder._id)
            .populate({
            path: "cow",
            populate: [{ path: "seller" }],
        })
            .populate("buyer")
            .lean();
        if (!populatedOrder) {
            throw new Error("Failed to create order!");
        }
        yield session.commitTransaction();
        return populatedOrder;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orderModel_1.Order.find({});
    return result;
});
const getSingleOrder = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: id, role } = payload;
    let query = {};
    if (role === "buyer") {
        query = { _id: orderId, buyer: id }; // Query to match seller or buyer ID
    }
    else if (role === "seller") {
        query = { _id: orderId, "cow.seller": id };
    }
    const result = yield orderModel_1.Order.findOne(query)
        .populate({
        path: "cow",
        populate: [{ path: "seller" }],
    })
        .populate("buyer")
        .lean();
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No order found!");
    }
    return result;
});
exports.OrderServices = {
    createOrders,
    getOrders,
    getSingleOrder,
};
