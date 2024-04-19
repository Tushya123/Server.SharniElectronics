const express = require("express");

const router = express.Router();
//catchAsync is used for simplyfying the error handling process
const catchAsync = require("../utils/catchAsync");

//const { createGetInTouch, listGetInTouchByParams } = require("../controllers/GetInTouch/GetInTouchController");
const { createSubscribe, listSubscribeByParams,listSubscribe,updatesubscribers,deleteSubscribers,getSpecificSubscriber } = require("../controllers/Subscribe/SubscribeController");
router.post("/auth/create/subscribe",catchAsync(createSubscribe))
router.delete("/auth/delete/subscribe/:_id",catchAsync(deleteSubscribers))
router.get("/auth/list/subscribe",catchAsync(listSubscribe))
router.get("/auth/getbyid/subscriber/:_id",catchAsync(getSpecificSubscriber));
router.put("/auth/update/subscribe/:_id",catchAsync(updatesubscribers))
router.post(
    "/auth/list-by-params/subscribe",
    catchAsync(listSubscribeByParams)
  );
module.exports = router;