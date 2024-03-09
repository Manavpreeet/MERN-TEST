import { title } from "process";
import { Book } from "../models/book";

export const createBookEntry = async (data: {
  title: String;
  author: String;
  numberOfCopies: Number;
}) => {
  let book = await Book.findOne({
    title: data.title,
    author: data.author,
  });

  if (book) {
    return await Book.updateOne(
      {
        _id: book._id,
      },
      {
        $inc: {
          numberOfCopies: +data.numberOfCopies,
        },
      }
    );
  }
  return await Book.create({
    author: data.author,
    title: data.title,
    numberOfCopies: data.numberOfCopies,
  });
};

export const getSpecificBook = async (id: String) => {
  return await Book.findById({
    _id: new Object(id),
  });
};

export const getAllBooks = async () => {
  return await Book.find({});
};
