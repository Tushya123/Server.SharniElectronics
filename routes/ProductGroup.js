const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const uploadDirectory = "uploads/ProductGroupImages";
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

const catchAsync = require("../utils/catchAsync");
const { createAreatype, listAreatype, listActiveAreatype, updateAreatype, removeAreatype, listAreatypesByParams,getProductGroup  } = require("../controllers/ProductGroup/ProductGroup");

router.post("/auth/areatype",upload.single("ImageUrl"), catchAsync(createAreatype));
router.get("/auth/list/areatype", catchAsync(listAreatype));
router.get("/auth/get/areatype/:_id", catchAsync(getProductGroup));

router.get(
  "/auth/list-active/areatype",
  catchAsync(listActiveAreatype)
);

router.put(
  "/auth/update/areatype/:_id",upload.single("ImageUrl"),
  catchAsync(updateAreatype)
);

router.delete(
  "/auth/remove/areatype/:_id",
  catchAsync(removeAreatype)
);
router.post("/auth/listarea",listAreatypesByParams);

module.exports = router;