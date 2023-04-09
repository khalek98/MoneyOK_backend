import express, { Request, Response } from "express";
import passport from "passport";
// import { OAuth2Client } from "google-auth-library";

import { loginValidation, registerValidation } from "../validations/validations";
import { authSignUp, authSignIn, authConfirmToken, getUser } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// Register new user by email
router.post("/signup", registerValidation, authSignUp);

// Authentication user,
router.post("/signIn", loginValidation, authSignIn);

// Get User
router.get("/", authMiddleware, getUser);

// router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/confirm/:token", authConfirmToken);

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

export default router;
