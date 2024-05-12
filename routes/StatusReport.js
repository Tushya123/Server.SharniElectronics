const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
    downloadProductInquiryByParamsandDate,downloadContactInquiryByParamsandDate
} = require("../controllers/Report/StatusReport");


router.post(
  "/auth/list/downloadexcelstatusreport",
  catchAsync(downloadProductInquiryByParamsandDate)
);router.post(
  "/auth/list/downloadexcelstatusreportforcontact",
  catchAsync(downloadContactInquiryByParamsandDate)
);

module.exports = router;
