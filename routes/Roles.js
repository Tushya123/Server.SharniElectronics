const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { createrole, updateRole,listRoles,listRoleByParams, deleterole,getrolebyid } = require("../controllers/Role/Role");


const router = express.Router();

const uploadDirectory = "uploads/RoleImages";
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
  "/auth/create/role",
  upload.single("imageURL"),
  catchAsync(createrole)
);
router.put(
  "/auth/update/role/:_id",
  upload.single("imageURL"),
  catchAsync(updateRole)
);
router.get("/auth/list/role",listRoles);
router.get("/auth/listbyid/role/:_id",getrolebyid);
router.delete("/auth/delete/role/:_id",deleterole);
router.post("/auth/list-by-params/role",listRoleByParams);

const multerStorageCK = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = "uploads/rolesCKImage";
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
  "/auth/role/imageupload",
  uploadCk.single("uploadImage"),
  async (req, res) => {
    console.log(req.file.filename);
    res.json({ url: req.file.filename });
  }
);

module.exports=router;