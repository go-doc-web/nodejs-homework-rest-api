// AppYuz9qtfkS4l7N;
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 3001;

const DB_HOST =
  "mongodb+srv://GoDoc:AppYuz9qtfkS4l7N@cluster0.kmqezx3.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));

// app.listen(PORT, () => {
//   console.log(`Server running. Use our API on port: ${PORT}`);
// });
