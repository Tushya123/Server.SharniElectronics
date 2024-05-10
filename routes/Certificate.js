const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { createCertificate, listCertificateByParams, updateCertificate, getCertificateById, removeCertificate,listCertificate } = require("../controllers/Cmsmaster/certificate");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/CertificateImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/CertificateImages")) {
  fs.mkdirSync("uploads/CertificateImages", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Certificate",
  upload.single("CertificateImage"),
  catchAsync(createCertificate)
);

// // // Route for listing all categories
router.post("/auth/list/Certificate", catchAsync(listCertificateByParams));
router.get("/auth/listonly/Certificate", catchAsync(listCertificate));

// // // Route for getting details of a specific category
router.get("/auth/get/Certificate/:id", catchAsync(getCertificateById));

// // // Route for updating a category
router.put(
  "/auth/update/Certificate/:id",
  upload.single("CertificateImage"),
  catchAsync(updateCertificate)
);

// // // Route for deleting a category
router.delete("/auth/remove/Certificate/:id", catchAsync(removeCertificate));

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
