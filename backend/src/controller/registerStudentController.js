import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import studentModel from "../models/students.js";

import { config } from "../../config.js";

const registerStudentController = {};

registerStudentController.register = async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    birthdate,
    speciality_id,
    carnet,
    phone,
    isVerified,
  } = req.body;

  try {
    const existsStudent = await studentModel.findOne({ email });
    if (existsStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const passwordHashed = await bcryptjs.hash(password, 10);

    const randomNumber = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        randomNumber,
        name,
        lastName,
        email,
        password: passwordHashed,
        birthdate,
        speciality_id,
        carnet,
        phone,
        isVerified,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Código de Verificación de Cuenta",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; text-align: center;">
        <h2 style="color: #b482ecff;">Verificación de Cuenta</h2>
        <p>Utiliza el siguiente código para validar tu acceso:</p>
        <div style="background: #f4f4f7; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">${randomNumber}</span>
        </div>
        <p style="color: #999; font-size: 14px;">Este código <strong>expira en 15 minutos</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #bbb;">Si no intentaste registrarte, ignora este mensaje.</p>
        </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

registerStudentController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;

    const token = req.cookies.registrationCookie;

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
      name,
      lastName,
      email,
      password,
      birthdate,
      speciality_id,
      carnet,
      phone,
      isVerified,
    } = decoded;

    if (verificationCodeRequest != storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const NewStudent = new studentModel({
      name,
      lastName,
      email,
      password,
      birthdate,
      speciality_id,
      carnet,
      phone,
      isVerified: true,
    });

    await NewStudent.save();

    res.clearCookie("registrationCookie");

    return res.status(200).json({ message: "Student registered" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerStudentController;
