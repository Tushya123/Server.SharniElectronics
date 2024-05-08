const express=require("express");
const router=express.Router();
const catchAsync=require("../utils/catchAsync");
const {createSupplierQuote,updateSupplierQuote,listSupplierQuote,listSupplierQuoteByParams, deleteSupplierQuote,forgetPassword} =require("../controllers/SupplierQuote/SupplierQuote")
router.post("/auth/create/supplierquote",createSupplierQuote)
router.delete("/auth/remove/supplierquote/:_id",deleteSupplierQuote)
router.put("/auth/update/supplierquote/:_id",updateSupplierQuote)
router.get("/auth/list/supplierquote",listSupplierQuote)
router.post("/auth/list-by-params/supplierquote",listSupplierQuoteByParams)
router.post("/auth/forget-password",catchAsync(forgetPassword));


module.exports=router;