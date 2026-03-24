const validateFile = require("../utils/validateFile");
const { compressAndUpload } = require("../services/upload.service");

exports.uploadImage = async (req, res) => {
  try {
    const { context } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    validateFile(file, context);

    const imageUrl = await compressAndUpload(file.buffer, context);

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
