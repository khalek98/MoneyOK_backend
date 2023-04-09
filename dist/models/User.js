"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true },
    password: String,
    username: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: String,
    accessToken: { type: String },
    refreshToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
