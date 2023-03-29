"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("email", "Wrong form email").isEmail(),
    (0, express_validator_1.body)("username", "Firstname must be at least 2 characters long").isLength({
        min: 2,
    }),
    (0, express_validator_1.body)("password").isLength({ min: 8 }),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email", "Wrong form email").isEmail(),
    (0, express_validator_1.body)("password", "Password length must be at least 8 characters long").isLength({ min: 8 }),
];
