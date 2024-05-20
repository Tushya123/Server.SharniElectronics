const express = require("express");
const multer = require("multer");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const { createAssignProduct,  updateAssignProduct, removeAssignProduct, listAssignProductByParams,listAssignProduct,getAssignProductById,getAssignProductBySupplierNameId,generateSupplierWiseProductReportExcel,listAssignProductByParamsforReport } = require("../controllers/Supplier/AssignSupplier");


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
router.get("/auth/get/getAssignProductById/:_id", upload.none(),catchAsync(getAssignProductById))
router.get("/auth/get/getAssignProductBySupplierNameId/:_id", upload.none(),catchAsync(getAssignProductBySupplierNameId))
router.get("/auth/get/generateSupplierWiseProductReportExcel/:_id", upload.none(),catchAsync(generateSupplierWiseProductReportExcel))



router.delete(
    "/auth/remove/AssignProduct/:_id",
    catchAsync(removeAssignProduct)
  );
  

  router.post(
    "/auth/list/AssignProductByParamsforReport/:id",
    
    catchAsync(listAssignProductByParamsforReport)
  );  router.post(
    "/auth/list/AssignProductByParams",
    
    catchAsync(listAssignProductByParams)
  );

module.exports = router;