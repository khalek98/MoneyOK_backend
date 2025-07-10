import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { IUser } from "../models/User";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.office365.com",
  port: +process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendConfirmationEmail = async (user: IUser, token: string) => {
  const link = `${process.env.APP_URL}/api/auth/confirm/${token}`;

  await transporter
    .sendMail({
      from: process.env.EMAIL_USERNAME,
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
};
