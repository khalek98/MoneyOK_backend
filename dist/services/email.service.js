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
exports.sendConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
        user: "xalek.islam@outlook.com",
        pass: "17supusaH",
    },
});
const sendConfirmationEmail = (user, token) => __awaiter(void 0, void 0, void 0, function* () {
    const link = `${process.env.APP_URL}:${process.env.PORT}/api/auth/confirm/${token}`;
    yield transporter
        .sendMail({
        from: "xalek.islam@outlook.com",
        to: user.email,
        subject: "Please confirm your registration",
        html: `
      <style>
      .link {
        margin: 10px 0; 
        width: max-content;
        height: 40px;
        padding: 10px 15px;
        background-color: lightgreen;
        color: green;
        display: block;
        border-radius: 10px;
      }
      </style>
        <p>Hello</p>
        <p>Thank you for registering. Please confirm your registration by clicking the following link:</p>
        <p><a target="_blank" class="link" href="${link}">Follow the link</a></p>
        <p>Best regards,</p>
        <p>MonetOk</p>
      `,
    })
        .then((res) => console.log("Message sent success"))
        .catch((err) => console.log(err));
});
exports.sendConfirmationEmail = sendConfirmationEmail;
