const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { createInquirySchema, listContactInquiryByParams,listContactInquiry,getspecificcontactinquiry,updatecontactinquiry,removecontactinquiry,listContactInquiryByParamsdate } = require("../controllers/Inquiry/ContactInquiry");
router.post("/auth/create/contactinquiry",catchAsync(createInquirySchema))
router.get("/auth/list/contactinquiry",catchAsync(listContactInquiry))
router.get("/auth/getbyid/contactinquiry/:_id",catchAsync(getspecificcontactinquiry))
router.put("/auth/update/contactinquiry/:_id",catchAsync(updatecontactinquiry))

router.delete("/auth/delete/contactinquiry/:_id",catchAsync(removecontactinquiry))
router.post(
    "/auth/list-by-params/contactinquiry",
    catchAsync(listContactInquiryByParams)
  );router.post(
    "/auth/list-by-params-date/contactinquiry",
    catchAsync(listContactInquiryByParamsdate)
  );
module.exports = router;