const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { postFile } = require("../controllers/uploadFile.controller");

const uploadedFileRouter = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = "./uploadedfiles";
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//Multer Upload
const uploadedFile = multer({ storage: storage }).single("filename");

// uploadedFileRouter.get("", getFiles);

uploadedFileRouter.post(
  "/upload",
  (req, res, next) => {
    console.log(req.body); // Log request body
    console.log(req.file); // Log uploaded file
    uploadedFile(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: "Multer error", error: err });
      }
      next();
    });
  },
  postFile
);

module.exports = { uploadedFileRouter };
