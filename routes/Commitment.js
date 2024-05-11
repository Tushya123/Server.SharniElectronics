const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { createCommitment, listCommitmentByParams, updateCommitment, getCommitmentById, removeCommitment,listCommitment } = require("../controllers/Cmsmaster/Commitment");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/CommitmentImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/CommitmentImages")) {
  fs.mkdirSync("uploads/CommitmentImages", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Commitment",
  upload.single("CommitmentImage"),
  catchAsync(createCommitment)
);

// // // Route for listing all categories
router.post("/auth/list/Commitment", catchAsync(listCommitmentByParams));
router.get("/auth/listonly/Commitment", catchAsync(listCommitment));

// // // Route for getting details of a specific category
router.get("/auth/get/Commitment/:id", catchAsync(getCommitmentById));

// // // Route for updating a category
router.put(
  "/auth/update/Commitment/:id",
  upload.single("CommitmentImage"),
  catchAsync(updateCommitment)
);

// // // Route for deleting a category
router.delete("/auth/remove/Commitment/:id", catchAsync(removeCommitment));

// router.get("/auth/getallcategory", catchAsync(getAllCategories));

const multerStorageCK = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = "uploads/cmsckImages";
    // Ensure the directory exists
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const uploadCk = multer({ storage: multerStorageCK });

//upload images
router.post(
  "/auth/cmsckkkkk/imageupload",
  uploadCk.single("uploadImage"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

module.exports = router;
