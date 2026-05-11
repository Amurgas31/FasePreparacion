import express from "express";
import paymentController from "../controller/paymentsController.js";

const router = express.Router();
router.route("/")
    .get(paymentController.getPayments)
    .post(paymentController.insertPayment);

router.route("/:id")
    .put(paymentController.updatePayment)
    .delete(paymentController.deletePayment);

export default router;