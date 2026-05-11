import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto, { verify } from "crypto";
import nodemailer from "nodemailer";

import { config } from "../../config.js";

import teacherModel from "../models/teachers.js";

const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    const userFound = await teacherModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "user not found" });
    }

    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      { email, randomCode, userType: "teacher", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptons = {
      from: config.email.user_email,
      to: email,
      subject: "Código de Recuperación",
      body: "El código expira en 15 minutos",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; text-align: center;">
        <h2 style="color: #ec8282ff;">Recuperación de Contraseña</h2>
        <p>Utiliza el siguiente código para restaurar tu contraseña:</p>
        <div style="background: #f4f4f7; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${randomCode}</span>
        </div>
        <p style="color: #999; font-size: 14px;">Este código <strong>expira en 15 minutos</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #bbb;">Si no intentaste recuperar tu contraseña, ignora este mensaje.</p>
        </div>
    `,
    };

    transporter.sendMail(mailOptons, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
    });

    return res.status(200).json({ message: "email sent" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Imternal server error" });
  }
};

recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid Code" });
    }

    const newToken = jsonwebtoken.sign(
      { email: decoded.email, userType: "teacher", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified succesfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await teacherModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default recoveryPasswordController;