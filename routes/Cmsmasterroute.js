const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { createCms, listCmsByParams, updatecms, getcmsById, removecms,listCMS } = require("../controllers/Cmsmaster/Cmsmastercontroller");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cmsImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/cmsImages")) {
  fs.mkdirSync("uploads/cmsImages", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/cms",
  upload.single("myFile"),
  catchAsync(createCms)
);

// // // Route for listing all categories
router.post("/auth/list/cms", catchAsync(listCmsByParams));
router.get("/auth/listonly/cms", catchAsync(listCMS));

// // // Route for getting details of a specific category
router.get("/auth/get/cms/:id", catchAsync(getcmsById));

// // // Route for updating a category
router.put(
  "/auth/update/cms/:id",
  upload.single("myFile"),
  catchAsync(updatecms)
);

// // // Route for deleting a category
router.delete("/auth/remove/cms/:id", catchAsync(removecms));

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
