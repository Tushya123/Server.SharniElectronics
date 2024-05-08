const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { createGalleryPhoto,listGalleryPhotos,updateGalleryPhotos,removeGalleryPhotos,listGalleryPhotosByParams,getspecificGalleryPhoto } = require("../controllers/GalleryPhotos/GalleryPhotos");


const router = express.Router();

const uploadDirectory = "uploads/GalleryPhoto";
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
  "/auth/create/GalleryPhoto",
  upload.single("imageURL"),
  catchAsync(createGalleryPhoto)
);
router.get(
  "/auth/get/GalleryPhoto/:_id",
  catchAsync(getspecificGalleryPhoto)
);

router.put(
    "/auth/update/GalleryPhoto/:_id",
    upload.single("imageURL"),
    catchAsync(updateGalleryPhotos)
  );

router.get(
    "/auth/list/GalleryPhoto",
    catchAsync(listGalleryPhotos)
  );

router.delete(
    "/auth/remove/GalleryPhoto/:_id",
    catchAsync(removeGalleryPhotos)
  );
  

  router.post(
    "/auth/list-by-params/GalleryPhoto",
    
    catchAsync(listGalleryPhotosByParams)
  );

module.exports = router;