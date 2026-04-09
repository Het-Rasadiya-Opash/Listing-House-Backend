import mongoose from "mongoose";

let isConnected = false;

export const dbConnection = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    isConnected = true;
    console.log("DB connected Successfully...");
  } catch (error) {
    console.log(`Error in DB Connection: ${error}`);
  }
};
