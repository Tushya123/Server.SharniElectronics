const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { createProjectDetail, listProjectDetail, updateProjectDetail, removeProjectDetail, listProjectDetailByParams,getspecificProductDetail } = require("../controllers/ProductDetail/ProductDetail");


const router = express.Router();

const uploadDirectory = "uploads/ProductDetailImages";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });

router.post(
  "/auth/create/projectdetail",
  upload.single("ProductImage"), 
  catchAsync(createProjectDetail)
);

router.put(
    "/auth/update/projectdetail/:_id",
    upload.single("ProductImage"),
    catchAsync(updateProjectDetail)
  );

router.get(
    "/auth/list/projectdetail",
    catchAsync(listProjectDetail)
  );
  router.get(
    "/auth/getspecific/projectdetail/:_id",
    catchAsync(getspecificProductDetail)
  );

router.delete(
    "/auth/remove/projectdetail/:_id",
    catchAsync(removeProjectDetail)
  );
  

  router.post(
    "/auth/listprojectdetailbyparam",
    
    catchAsync(listProjectDetailByParams)
  );

  const multerStorageCK = multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = "uploads/productCkEditor";
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
    "/auth/ckeditorproduct/imageupload",
    uploadCk.single("uploadImage"),
    async (req, res) => {
      console.log(req.file.filename);
      res.json({ url: req.file.filename });
    }
  );
module.exports = router;