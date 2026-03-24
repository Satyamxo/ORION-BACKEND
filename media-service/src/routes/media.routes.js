const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth.middleware");
const { uploadImage } = require("../controllers/media.controller");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", auth , upload.single("file"), uploadImage);

module.exports = router;
