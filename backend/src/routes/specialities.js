import express from "express";
import specialityController from "../controller/specialitiesController.js";

const router = express.Router();
router.route("/")
    .get(specialityController.getSpeciality)
    .post(specialityController.insertSpeciality);

router.route("/:id")
    .put(specialityController.updateSpeciality)
    .delete(specialityController.deleteSpeciality);

export default router;