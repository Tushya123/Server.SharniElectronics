const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const {
  listCountryInquiryByParams,
  downloadCountryInquiryByParams,
} = require("../controllers/Report/CountryWiseReport");
router.post(
  "/auth/list/Countryinquiry/:country",
  catchAsync(listCountryInquiryByParams)
);

router.post(
  "/auth/list/downloadexcel/:country",
  catchAsync(downloadCountryInquiryByParams)
);

module.exports = router;
