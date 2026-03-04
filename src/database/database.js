import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const MONGO_DB_URI = process.env.MONGO_DB_URI;
  const DATABASE_NAME = process.env.DATABASE_NAME;
  const databaseConnectionResponse = await mongoose.connect(
    `${MONGO_DB_URI}/${DATABASE_NAME}`
  );

  console.log(
    `Database connection response :  ${databaseConnectionResponse.connection.host}`
  );

  console.log(`MongoDB database connected successfully !!!`);
  return databaseConnectionResponse;
};

export default connectDB;
