import { Reservation } from "../models/reservation";

export const createReservation = async (
  bookId: String,
  memberId: String,
  startDate: Date
) => {
  let endDate = new Date(startDate);
  return await Reservation.create({
    bookId,
    memberId,
    startDate,
    endDate: endDate.setDate(startDate.getDate() + 7),
  });
};

export const getBookReserverations = async (bookId: String) => {
  return await Reservation.find({
    bookId,
  }).sort({ createdAt: -1 });
};

export const deleteReservation = async (reservationId: String) => {
  return await Reservation.deleteOne({
    _id: new Object(reservationId),
  });
};

export const getMemberReservations = async (memberId: String) => {
  return await Reservation.find({
    memberId,
  });
};
