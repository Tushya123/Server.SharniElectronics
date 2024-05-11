const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const fs = require("fs");

const { createBlog, listBlogByParams, updateBlog, getBlogById, removeBlog,listBlog } = require("../controllers/Blogs/Blogs");

// Multer storage configuration for handling category image uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/BlogImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

if (!fs.existsSync("uploads/BlogImages")) {
  fs.mkdirSync("uploads/BlogImages", { recursive: true });
}

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/Blog",
  upload.single("BlogImage"),
  catchAsync(createBlog)
);

// // // Route for listing all categories
router.post("/auth/list/Blog", catchAsync(listBlogByParams));
router.get("/auth/listonly/Blog", catchAsync(listBlog));

// // // Route for getting details of a specific category
router.get("/auth/get/Blog/:id", catchAsync(getBlogById));

// // // Route for updating a category
router.put(
  "/auth/update/Blog/:id",
  upload.single("BlogImage"),
  catchAsync(updateBlog)
);

// // // Route for deleting a category
router.delete("/auth/remove/Blog/:id", catchAsync(removeBlog));

// router.get("/auth/getallcategory", catchAsync(getAllCategories));

const multerStorageCK = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = "uploads/BlogCKImages";
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
  "auth/cms-blog/image-upload",
  uploadCk.single("uploadImage"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

module.exports = router;
