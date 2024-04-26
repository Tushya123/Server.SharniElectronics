const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { getrolebyid,deleterole,listRoleByParams,listRoles,updateRole,createrole} = require("../controllers/OtherProducts/OtherProducts");


const router = express.Router();

// const uploadDirectory = "uploads/ProjectDetailImages";
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDirectory);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

const upload = multer();

router.post(
  "/auth/create/otherproducts",
  upload.none(), 
  catchAsync(createrole)
);

router.put(
    "/auth/update/otherproducts/:_id",
    upload.none(),
    catchAsync(updateRole)
  );

  router.get("/auth/listbyid/otherproducts/:_id",catchAsync(getrolebyid));
router.get(
    "/auth/list/otherproducts",
    catchAsync(listRoles)
  );

router.delete(
    "/auth/remove/otherproducts/:_id",
    catchAsync(deleterole)
  );
  

  router.post(
    "/auth/listotherproductsbyparam",
    
    catchAsync(listRoleByParams)
  );
  const multerStorageCK = multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = "uploads/otherproductsCKImage";
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
    "/auth/otherproducts/imageupload",
    uploadCk.single("uploadImage"),
    async (req, res) => {
      console.log(req.file.filename);
      res.json({ url: req.file.filename });
    }
  );
module.exports = router;