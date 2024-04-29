const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { createAssignProduct,  updateAssignProduct, removeAssignProduct, listAssignProductByParams,listAssignProduct } = require("../controllers/Supplier/AssignSupplier");


const router = express.Router();

// const uploadDirectory = "uploads/AssignProductImages";
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
  "/auth/create/AssignProduct",
  upload.none(), 
  catchAsync(createAssignProduct)
);

router.put(
    "/auth/update/AssignProduct/:_id",
    upload.none(),
    catchAsync(updateAssignProduct)
  );

router.get(
    "/auth/list/AssignProduct",
    catchAsync(listAssignProduct)
  );

router.delete(
    "/auth/remove/AssignProduct/:_id",
    catchAsync(removeAssignProduct)
  );
  

  router.post(
    "/auth/listAssignProductbyparam",
    
    catchAsync(listAssignProductByParams)
  );

module.exports = router;