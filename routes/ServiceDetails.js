const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const catchAsync = require("../utils/catchAsync");
const {listProjectDetailByParamsSearch, createProjectDetail, listProjectDetail, updateProjectDetail, removeProjectDetail, listProjectDetailByParams,getspecificProductDetail , getProductByDescription } = require("../controllers/Services/ServiceDetails");


const router = express.Router();

router.use(cors());

const uploadDirectory = "uploads/ServiceDetailImages";
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
  "/auth/create/servicedetail",
  upload.single("ProductImage"), 
  catchAsync(createProjectDetail)
);

router.put(
    "/auth/update/servicedetail/:_id",
    upload.single("ProductImage"),
    catchAsync(updateProjectDetail)
  );

router.get(
    "/auth/list/servicedetail",
    catchAsync(listProjectDetail)
  );
  router.get(
    "/auth/getspecific/servicedetail/:_id",
    catchAsync(getspecificProductDetail)
  );

router.delete(
    "/auth/remove/servicedetail/:_id",
    catchAsync(removeProjectDetail)
  );
  

  router.post(
    "/auth/listservicedetailbyparam",
    
    catchAsync(listProjectDetailByParams)
  );

  
  router.post(
    "/auth/listServiceDetailByParamsSearch",
    
    catchAsync(listProjectDetailByParamsSearch)
  );

  const multerStorageCK = multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = "uploads/serviceCkEditor";
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
    "/auth/ckeditorservice/imageupload",
    uploadCk.single("uploadImage"),
    async (req, res) => {
      console.log(req.file.filename);
      res.json({ url: req.file.filename });
    }
  );

  router.get(
    "/auth/get/servicedetail/:description",
    catchAsync(getProductByDescription)
  );
  // router.post("/download-pdf", downloadPdf);

module.exports = router;