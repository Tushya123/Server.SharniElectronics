const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { listNewsletter,removeNewsletter,updateNewsletter,getNewsletterById,listNewsletterByParams,createNewsletter } = require("../controllers/NewsLetter/Newsletter");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/NewsletterImage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/NewsletterImage")) {
  fs.mkdirSync("uploads/NewsletterImage", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Newsletter",
  upload.single("NewsletterImage"),
  catchAsync(createNewsletter)
);

// // // Route for listing all categories
router.post("/auth/list/Newsletter", catchAsync(listNewsletterByParams));
router.get("/auth/listonly/Newsletter", catchAsync(listNewsletter));

// // // Route for getting details of a specific category
router.get("/auth/get/Newsletter/:id", catchAsync(getNewsletterById));

// // // Route for updating a category
router.put(
  "/auth/update/Newsletter/:id",
  upload.single("NewsletterImage"),
  catchAsync(updateNewsletter)
);

// // // Route for deleting a category
router.delete("/auth/remove/Newsletter/:id", catchAsync(removeNewsletter));

// router.get("/auth/getallcategory", catchAsync(getAllCategories));

// const multerStorageCK = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dest = "uploads/cmsckImages";
//     // Ensure the directory exists
//     fs.mkdirSync(dest, { recursive: true });
//     cb(null, dest);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });
// const uploadCk = multer({ storage: multerStorageCK });

// //upload images
// router.post(
//   "/auth/cmsckkkkk/imageupload",
//   uploadCk.single("uploadImage"),
//   async (req, res) => {
//     console.log(req.file.filename);
//     res.json({ url: req.file.filename });
//   }
// );

module.exports = router;
