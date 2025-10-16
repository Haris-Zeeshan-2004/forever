import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DB Connected successfully");
  } catch (error) {
    console.log(error.message);
  }
}
export default connectDB;
