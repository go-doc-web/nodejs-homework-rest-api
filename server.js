// AppYuz9qtfkS4l7N;
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const { DB_HOST } = process.env;
const { PORT } = process.env || 3001;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    })
  )
  .catch((error) => console.log(error.message));
