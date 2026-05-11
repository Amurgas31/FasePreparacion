import express from "express";
import registerStudentsController from "../controller/registerStudentController.js";

const router = express.Router();
router.route("/")
    .post(registerStudentsController.register);

router.route("/verifyCodeEmail")
    .post(registerStudentsController.verifyCode);

export default router;