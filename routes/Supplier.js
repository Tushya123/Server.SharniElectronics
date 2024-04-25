const express=require("express")
const router=express.Router()

const catchAsync = require("../utils/catchAsync");

const { listSupplierDetailByParams,listsupplier,getspecificSupplier, updateSupplier,createSupplier,removeSupplier} = require("../controllers/Supplier/Supplier");
router.post("/auth/create/supplier",catchAsync(createSupplier))
router.get("/auth/list/supplier",catchAsync(listsupplier))
router.get("/auth/getbyid/supplier/:_id",catchAsync(getspecificSupplier))
router.put("/auth/update/supplier/:_id",catchAsync(updateSupplier))

router.delete("/auth/delete/supplier/:_id",catchAsync(removeSupplier))
router.post(
    "/auth/list-by-params/supplier",
    catchAsync(listSupplierDetailByParams)
  );
module.exports = router;