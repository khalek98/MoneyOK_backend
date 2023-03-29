"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { OAuth2Client } from "google-auth-library";
const validations_1 = require("../validations/validations");
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// Register new user by email
router.post("/signup", validations_1.registerValidation, auth_controller_1.authSignUp);
// Authentication user,
router.post("/login", validations_1.loginValidation, auth_controller_1.authLogin);
// router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/confirm/:token", auth_controller_1.authConfirmToken);
// // Register new user by Google
// router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//   }),
//   async (req: Request, res: Response) => {
//     try {
//       const client = new OAuth2Client({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         redirectUri: "http://localhost:4000/api/auth/google/callback",
//       });
//       const { data } = await client.request({
//         url: "https://www.googleapis.com/oauth2/v1/userinfo",
//         headers: {
//           // @ts-ignore
//           Authorization: `Bearer ${req.user.accessToken}`,
//         },
//       });
//       console.log("req:", req);
//       res.redirect("/");
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Internal Server Error here");
//     }
//   },
// );
// // Register new user by Apple
// router.get(
//   "/apple",
//   passport.authenticate("apple", {
//     scope: ["name", "email"],
//     successRedirect: "/",
//     failureRedirect: "/login",
//   }),
// );
// router.get(
//   "/apple/callback",
//   passport.authenticate("apple", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   }),
//   (req: Request, res: Response) => {
//     res.redirect("/");
//   },
// );
exports.default = router;
