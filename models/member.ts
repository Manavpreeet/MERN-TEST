import mongoose from "mongoose";

const { Schema } = mongoose;

const memberSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  due: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Member = mongoose.model("Members", memberSchema);
