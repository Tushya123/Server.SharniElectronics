const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const { listCategoryByParams, removeCategory, updateCategory, listActiveCategory, listCategory, createCategory,getspecificCategory  } = require("../controllers/Category/Category");

router.post("/auth/create/Category", catchAsync(createCategory));
router.get("/auth/list/Category", catchAsync(listCategory));

router.get(
  "/auth/list-active/Category",
  catchAsync(listActiveCategory)
);router.get(
  "/auth/getbyid/Category/:_id",
  catchAsync(getspecificCategory)
);

router.put(
  "/auth/update/Category/:_id",
  catchAsync(updateCategory)
);

router.delete(
  "/auth/remove/Category/:_id",
  catchAsync(removeCategory)
);
router.post("/auth/list-by-params/Category",listCategoryByParams);

module.exports = router;