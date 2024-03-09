import { Member } from "../models/member";

export const createMemberEntry = async (data: {
  age: Number;
  firstName: String;
  lastName: String;
}) => {
  return await Member.create({
    age: data.age,
    firstName: data.firstName,
    lastName: data.lastName,
  });
};

export const getSpecificMember = async (id: String) => {
  return await Member.findById({
    _id: new Object(id),
  });
};

export const getAllMembers = async () => {
  return await Member.find({});
};
