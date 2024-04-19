const express = require("express");

const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const { createGetInTouch, listGetInTouchByParams,listGetinTouch,getspecificgetintouch,updategetintouch,removegetintouch } = require("../controllers/GetInTouch/GetInTouchController");
router.post("/auth/create/getintouch",catchAsync(createGetInTouch))
router.get("/auth/list/getintouch",catchAsync(listGetinTouch))
router.get("/auth/getbyid/getintouch/:_id",catchAsync(getspecificgetintouch))
router.put("/auth/update/getintouch/:_id",catchAsync(updategetintouch))

router.delete("/auth/delete/getintouch/:_id",catchAsync(removegetintouch))
router.post(
    "/auth/list-by-params/getintouch",
    catchAsync(listGetInTouchByParams)
  );
module.exports = router;