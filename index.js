const express = require('express');
const path = require('path');
const { connection } = require('./config/db');
const { userRouter } = require("./routes/user.route");
const { authenticate } = require("./middleware/auth.middleware");
const { uploadedFileRouter } = require("./routes/uploadFile.route");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));


cloudinary.config({
  cloud_name: "djuaj2nbx",
  api_key: "274449754319941",
  api_secret: "PUKU8YMrMgGguP24mBzOeGGl0rg",
});
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/auth", userRouter);

app.use(authenticate);

app.use("/uploadfiles", uploadedFileRouter);



app.listen(port, async ()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err.message);
    }
    console.log(`Server is running at port ${port}`);
})