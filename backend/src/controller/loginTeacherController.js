import teachersModel from "../models/teachers.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

//Array de funciones
const loginTeacherController = {};

loginTeacherController.login = async (req, res) => {
  const { email, password } = req.body;

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    const teacherFound = await teachersModel.findOne({ email });

    if (!teacherFound) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    if (teacherFound.timeOut && teacherFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, teacherFound.password);

    if (!isMatch) {
      teacherFound.loginAttempts = (teacherFound.loginAttempts || 0) + 1;

      if (teacherFound.loginAttempts >= 5) {
        teacherFound.timeOut = Date.now() + 5 * 60 * 1000;
        teacherFound.loginAttempts = 0;

        await teacherFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por multiples intentos fallidos",
        });
      }

      await teacherFound.save();

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    teacherFound.loginAttempts = 0;
    teacherFound.timeOut = null;

    const token = jsonwebtoken.sign(
      { id: teacherFound._id, userType: "Teacher" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginTeacherController;