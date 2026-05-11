/*
    Campos:
        student_id
        amount
        paymentDate
        method
        status
        referenceNumber
 */

import mongoose, { Schema, model } from "mongoose";
const paymentSchema = new Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    amount: { type: Number },
    paymentDate: { type: Date },
    method: { type: String },
    status: { type: Boolean },
    referenceNumber: { type: Number },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Payments", paymentSchema);
