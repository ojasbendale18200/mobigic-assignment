const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema({
  filename: { type: String, required: true },
  cloudinaryurl: { type: String, required: true },
  code: { type: String, required: true },
  user: { type: String, required: true },
});

const Upload = mongoose.model("uploadedFile", uploadSchema);

module.exports = { Upload };
