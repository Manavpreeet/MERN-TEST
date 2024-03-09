import mongoose from "mongoose";

const { Schema } = mongoose;

const circulationSchema = new Schema({
  bookId: String,
  memberId: String,
  startDate: Date,
  endDate: Date,
  circulationType: { type: String, default: "Circulated" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}).index(
  { bookId: 1, memberId: 1, circulationType: 1, startDate: 1 },
  { unique: true }
);

export const Circulation = mongoose.model("Circulations", circulationSchema);
