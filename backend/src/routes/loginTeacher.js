import express from "express";
import loginTeacherController from "../controller/loginTeacherController.js";
const router = express.Router();

router.route("/").post(loginTeacherController.login)

export default router;