const express=require("express");
const router=express.Router();
const catchAsync=require("../utils/catchAsync");
const {createSupplierQuote,updateSupplierQuote,listSupplierQuote} =require("../controllers/SupplierQuote/SupplierQuote")
router.post("/auth/create/supplierquote",createSupplierQuote)
router.put("/auth/update/supplierquote/:_id",updateSupplierQuote)
router.get("/auth/list/supplierquote",listSupplierQuote)


module.exports=router;