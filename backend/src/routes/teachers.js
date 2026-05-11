import express from "express";
import teachersController from "../controller/teachersController.js";

const router = express.Router();
router.route("/")
    .get(teachersController.getTeachers);

router.route("/:id")
    .put(teachersController.updateTeachers)
    .delete(teachersController.deleteTeacher);

export default router;