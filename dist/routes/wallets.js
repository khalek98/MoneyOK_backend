"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const wallets_controller_1 = require("../controllers/wallets.controller.");
const wallet_validate_1 = require("../validations/wallet.validate");
const validateKeyInBody_1 = require("../middlewares/validateKeyInBody");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.default, wallet_validate_1.validateCreateWallet, wallets_controller_1.createWallet);
router.get("/", authMiddleware_1.default, wallets_controller_1.readAllUserWallets);
router.patch("/:id", authMiddleware_1.default, validateKeyInBody_1.validateWalletProps, wallet_validate_1.validateUpdateWallet, wallets_controller_1.updateWallet);
router.delete("/:id", authMiddleware_1.default, wallets_controller_1.deleteWallet);
exports.default = router;
