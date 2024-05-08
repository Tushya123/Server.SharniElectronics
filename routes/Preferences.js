const express = require("express");

const router = express.Router();
//catchAsync is used for simplyfying the error handling process
const catchAsync = require("../utils/catchAsync");

//const { createGetInTouch, listGetInTouchByParams } = require("../controllers/GetInTouch/GetInTouchController");
const { createPreference, listSubscribeByParams,listSubscribe,updatesubscribers,deleteSubscribers,getSpecificSubscriber } = require("../controllers/Preferences/Preferences");
router.post("/auth/create/preferences",catchAsync(createPreference))
router.delete("/auth/delete/preferences/:_id",catchAsync(deleteSubscribers))
router.get("/auth/list/preferences",catchAsync(listSubscribe))
router.get("/auth/getbyid/preferences/:_id",catchAsync(getSpecificSubscriber));
router.put("/auth/update/preferences/:_id",catchAsync(updatesubscribers))
router.post(
    "/auth/list-by-params/preferences",
    catchAsync(listSubscribeByParams)
  );
module.exports = router;