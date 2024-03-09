import { Book } from "../models/book";
import { Circulation } from "../models/circulation";
import { Member } from "../models/member";
import { getSpecificBook } from "./books";
import {
  createReservation,
  deleteReservation,
  getBookReserverations,
} from "./reservations";

export const checkOutBookToMember = async (
  bookId: String,
  memberId: String,
  startDate: Date
) => {
  let book = await getSpecificBook(bookId);

  let reservations = await getBookReserverations(bookId);
  let endDate = new Date(startDate);
  if (reservations.length > 0) {
    if (
      book &&
      book.numberOfCopies &&
      book.numberOfCopies > reservations.length
    ) {
      let result = await Circulation.create({
        bookId,
        memberId,
        startDate,
        endDate: endDate.setDate(startDate.getDate() + 7),
      });

      return { type: "Book Circulated", ...result };
    } else {
      let isBookReserved = reservations.map((reservation) => {
        if (reservation.memberId === memberId) return reservation;
      });

      if (reservations[0].memberId == memberId) {
        let reservationOfUser = await deleteReservation(
          reservations[0]._id.toString()
        );

        await Book.updateOne(
          {
            _id: new Object(bookId),
          },
          {
            $inc: {
              numberOfCopies: -1,
            },
          }
        );

        return { type: "Reserved Book was given", ...reservationOfUser };
      }

      if (isBookReserved) {
        return { type: "The Book is reserved for you, please wait!" };
      }
    }
  }

  if (book?.numberOfCopies == 0) {
    let reservation = await createReservation(bookId, memberId, startDate);
    return { type: "Book Reserved", ...reservation };
  } else {
    await Book.updateOne(
      {
        _id: new Object(bookId),
      },
      {
        $inc: {
          numberOfCopies: -1,
        },
      }
    );

    let result = await Circulation.create({
      bookId,
      memberId,
      startDate,
      endDate: endDate.setDate(new Date(startDate).getDate() + 7),
    });

    return { type: "Book Circulated", ...result };
  }
};

export const returnBookFromMember = async (
  bookId: String,
  memberId: String,
  startDate: Date
) => {
  let book = await getSpecificBook(bookId);
  let bookReservations = await getBookReserverations(bookId);

  await Book.updateOne(
    {
      _id: new Object(bookId),
    },
    {
      $inc: {
        numberOfCopies: 1,
      },
    }
  );

  if (bookReservations.length > 0) {
    return { type: "Reserve the book" };
  }

  let userBook = await Circulation.findOne({
    bookId,
    memberId,
  }).sort({ createdAt: -1 });

  let result = await Circulation.create({
    bookId,
    memberId,
    startDate: userBook?.startDate,
    endDate: new Date(),
    circulationType: "Returned",
  });

  if (userBook && userBook.endDate) {
    const today = new Date();
    const endDateOfBOok = new Date(userBook.endDate);
    const diffTime = Math.abs(today.getTime() - endDateOfBOok.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      let dueAmount = 7 * 50;

      await Member.updateOne(
        {
          _id: new Object(memberId),
        },
        {
          $inc: {
            due: +dueAmount,
          },
        }
      );
    }
  }

  return { type: "Book Returned", ...result };
};
