import app from "./app.js";
import connectDB from "./database/database.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening to port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      `Error occurred during the process of connecting database : ${error}`
    );
    process.exit(1);
  });
