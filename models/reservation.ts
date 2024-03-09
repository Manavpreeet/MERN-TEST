import mongoose from "mongoose";

const { Schema } = mongoose;

const reservationSchema = new Schema({
  bookId: String,
  memberId: String,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}).index({ bookId: 1, memberId: 1 }, { unique: true });

export const Reservation = mongoose.model("Reservations", reservationSchema);
