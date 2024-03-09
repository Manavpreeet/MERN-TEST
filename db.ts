import mongoose from "mongoose";
const dbUri = "mongodb://localhost:27017/myMernApp";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};
