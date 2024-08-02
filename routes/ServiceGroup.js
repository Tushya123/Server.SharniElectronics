const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const uploadDirectory = "uploads/ServiceGroupImages";
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
const { createAreatype, listAreatype, listActiveAreatype, updateAreatype, removeAreatype, listAreatypesByParams,getProductGroup  } = require("../controllers/Services/ServiceGroup");

router.post("/auth/servicetype",upload.single("ImageUrl"), catchAsync(createAreatype));
router.get("/auth/list/servicetype", catchAsync(listAreatype));
router.get("/auth/get/servicetype/:_id", catchAsync(getProductGroup));

router.get(
  "/auth/list-active/servicetype",
  catchAsync(listActiveAreatype)
);

router.put(
  "/auth/update/servicetype/:_id",upload.single("ImageUrl"),
  catchAsync(updateAreatype)
);

router.delete(
  "/auth/remove/servicetype/:_id",
  catchAsync(removeAreatype)
);
router.post("/auth/listservicetype",listAreatypesByParams);

module.exports = router;