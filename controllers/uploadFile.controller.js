const { Upload } = require("../models/uploadFile.model");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const pathfile = require("../path");

const getFiles = async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    jwt.verify(token, "mobigic", async (err, decoded) => {
      if (decoded) {
        const userId = decoded.userID;

        const userUploadedFiles = await Upload.find({ user: userId });
        res.send({ userUploadedFiles });
      } else {
        res.send({ message: err.message });
      }
    });
  } else {
    res.send({ msg: "Something really wrong" });
  }
};

const postFile = async (req, res) => {
  try {
    const filename = req.file.filename;
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

    const upload = new Upload({
      filename,
      cloudinaryurl: cloudinaryResult.secure_url,
      code: Math.floor(100000 + Math.random() * 900000),
      user: req.user,
    });

    await upload.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", upload, file: req.file });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFile = async (req, res) => {
  try {
    const id = req.params.id;

    const userUploadedFiles = await Upload.findOne({ _id: id });

    res.send({ userUploadedFiles });
  } catch (error) {
    console.log(error);
    res.send({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  const id = req.params.id;

  const upload = await Upload.findOne({ _id: id });

  const filePath = path.join(pathfile, "uploadedfiles", upload.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });

  const userID_of_upload = upload.user;

  const userID_request = req.user;

  try {
    if (userID_request !== userID_of_upload) {
      res.send({ msg: "You are not Authorized" });
    } else {
      await Upload.findByIdAndDelete({ _id: id });
      res.send("Deleted the Blog");
    }
  } catch (err) {
    console.log(err.message);
    res.send({ msg: "Something went wrong" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const userId = req.user;
    const fileId = req.body.fileId;
    const code = req.body.code;

    const file = await File.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (code !== file.code) {
      return res.status(401).json({ error: "Invalid access code" });
    }

    const filePath = path.join(pathfile, "../uploads/", file.filename);
    res.download(filePath, file.originalname);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { postFile, getFiles, getFile, deleteFile, downloadFile };
