const express=require("express");
const catchAsync=require("../utils/catchAsync");

const multer = require("multer");

const {createInquiryProduct,listEnquiry,listActiveInquiryProductDetails,updateInquiryProductDetail,removeInquiryProductDetail,listInquiryProductDetailsByParams,getspecificInquiryProduct}=require("../controllers/Inquiry/Inquiryproduct")
const router=express.Router();

const upload = multer();
router.post("/auth/create/InquiryProduct",
upload.none(),catchAsync(createInquiryProduct));

router.post("/auth/list-by-params/InquiryProduct",catchAsync(listInquiryProductDetailsByParams));
router.get("/auth/list/InquiryProduct",catchAsync(listEnquiry));
router.get("/auth/getbyid/InquiryProduct/:_id",catchAsync(getspecificInquiryProduct));
router.put("/auth/update/InquiryProduct/:_id",catchAsync(updateInquiryProductDetail)); //Here the _id is to be checked with the _id which is in the controller i.e _id:req.params

router.get("/auth/list-active/InquiryProduct",catchAsync(listActiveInquiryProductDetails));
router.delete("/auth/remove/InquiryProduct/:_id",catchAsync(removeInquiryProductDetail));

module.exports=router;