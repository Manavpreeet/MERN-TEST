import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    index: {
      unique: true,
      sparse: true,
    },
  },
  author: {
    type: String,
    index: {
      unique: false,
      sparse: true,
    },
  },
  numberOfCopies: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Book = mongoose.model("Books", bookSchema);
