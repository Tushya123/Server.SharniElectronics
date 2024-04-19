const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { createFeature, updateFeature, removeFeature, getFeature, listFeatureByParams,listFeature } = require("../controllers/Feature/FeatureController");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/featureImages");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    // cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerStorage });
router.post("/auth/create/feature",upload.single("myFile"), catchAsync(createFeature));



router.post("/auth/listByparams/feature", catchAsync(listFeatureByParams));
router.get("/auth/list/feature", catchAsync(listFeature));

router.get("/auth/get/feature/:_id", catchAsync(getFeature));

router.put("/auth/update/feature/:_id",upload.single("myFile"), catchAsync(updateFeature));

router.delete("/auth/remove/feature/:_id", catchAsync(removeFeature));



module.exports = router;
