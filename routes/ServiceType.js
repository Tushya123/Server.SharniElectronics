const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { createAreatype, listAreatype, listActiveAreatype, updateAreatype, removeAreatype, listAreatypesByParams  } = require("../controllers/ServiceType/ServiceType");

router.post("/auth/areatype", catchAsync(createAreatype));
router.get("/auth/list/areatype", catchAsync(listAreatype));

router.get(
  "/auth/list-active/areatype",
  catchAsync(listActiveAreatype)
);

router.put(
  "/auth/update/areatype/:_id",
  catchAsync(updateAreatype)
);

router.delete(
  "/auth/remove/areatype/:_id",
  catchAsync(removeAreatype)
);
router.post("/auth/listarea",listAreatypesByParams);

module.exports = router;