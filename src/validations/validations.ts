import { body } from "express-validator";

export const registerValidation = [
  body("email", "Wrong form email").isEmail(),
  body("username", "Firstname must be at least 2 characters long").isLength({
    min: 2,
  }),
  body("password").isLength({ min: 8 }),
];

export const loginValidation = [
  body("email", "Wrong form email").isEmail(),
  body("password", "Password length must be at least 8 characters long").isLength({ min: 8 }),
];
