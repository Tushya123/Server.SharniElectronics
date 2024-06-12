const express=require("express");
const catchAsync=require("../utils/catchAsync");

const multer = require("multer");

const {createInquiry,listEnquiry,listActiveInquiryDetails,updateInquiryDetail,removeInquiryDetail,listInquiryDetailsByParams,getspecificinquiry,listInquiryDetailsByParamsfordate,downloadProductInquiryByParamsandDate}=require("../controllers/Inquiry/Inquiry")
const router=express.Router();

const upload = multer();
router.post("/auth/create/inquiry",
upload.none(),catchAsync(createInquiry));

router.post("/auth/list-by-params/inquiry",catchAsync(listInquiryDetailsByParams));
router.post("/auth/list-by-params-excel/inquiry",catchAsync(downloadProductInquiryByParamsandDate));
router.post("/auth/list-by-params-date/inquiry",catchAsync(listInquiryDetailsByParamsfordate));
router.get("/auth/list/inquiry",catchAsync(listEnquiry));
router.get("/auth/getbyid/inquiry/:_id",catchAsync(getspecificinquiry));
router.put("/auth/update/inquiry/:_id",catchAsync(updateInquiryDetail)); //Here the _id is to be checked with the _id which is in the controller i.e _id:req.params

router.get("/auth/list-active/inquiry",catchAsync(listActiveInquiryDetails));
router.delete("/auth/remove/inquiry/:_id",catchAsync(removeInquiryDetail));

module.exports=router;