const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { createBlog, listBlogByParams, updateBlog, getBlogById, removeBlog,listBlog } = require("../controllers/Banner/Banner");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/BannerImage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/BannerImage")) {
  fs.mkdirSync("uploads/BannerImage", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Banner",
  upload.single("bannerImage"),
  catchAsync(createBlog)
);

// // // Route for listing all categories
router.post("/auth/list/Banner", catchAsync(listBlogByParams));
router.get("/auth/listonly/Banner", catchAsync(listBlog));

// // // Route for getting details of a specific category
router.get("/auth/get/Banner/:id", catchAsync(getBlogById));

// // // Route for updating a category
router.put(
  "/auth/update/Banner/:id",
  upload.single("bannerImage"),
  catchAsync(updateBlog)
);

// // // Route for deleting a category
router.delete("/auth/remove/Banner/:id", catchAsync(removeBlog));

// router.get("/auth/getallcategory", catchAsync(getAllCategories));





module.exports = router;
