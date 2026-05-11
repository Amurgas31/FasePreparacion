import express from "express";
import subjectController from "../controller/subjectsController.js";

const router = express.Router();
router.route("/")
    .get(subjectController.getSubjects)
    .post(subjectController.insertSubject);

router.route("/:id")
    .put(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);

export default router;