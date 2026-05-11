/*
    Campos:
        specialityName
        isAvailable
 */

import mongoose, { Schema, model } from "mongoose";
const specialitySchema = new Schema(
  {
    specialityName: { type: String },
    isAvailable: { type: Boolean }
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Specialities", specialitySchema);