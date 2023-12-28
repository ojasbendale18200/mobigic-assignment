const { Upload } = require("../models/uploadFile.model");
const cloudinary = require("cloudinary").v2;

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

module.exports = { postFile };
