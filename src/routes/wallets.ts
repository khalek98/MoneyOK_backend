import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware";
import {
  createWallet,
  deleteWallet,
  readAllUserWallets,
  updateWallet,
} from "../controllers/wallets.controller.";
import { validateCreateWallet, validateUpdateWallet } from "../validations/wallet.validate";
import { validateWalletProps } from "../middlewares/validateKeyInBody";

const router = Router();

router.post("/", authMiddleware, validateCreateWallet, createWallet);

router.get("/", authMiddleware, readAllUserWallets);

router.patch("/:id", authMiddleware, validateWalletProps, validateUpdateWallet, updateWallet);

router.delete("/:id", authMiddleware, deleteWallet);

export default router;
