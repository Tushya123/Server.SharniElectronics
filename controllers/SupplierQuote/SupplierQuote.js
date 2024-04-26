const SupplierQuoteSchema=require("../../models/SupplierQuote/SupplierQuote");

exports.createSupplierQuote=async(req,res)=>{
    try{
            let{ProductDetail,Quantity,Grade,SupplierName}=req.body;
            const newsupplierquote=await new SupplierQuoteSchema(
req.body
            ).save();
            res.status(200).json({
                isOk: true,
                data: newsupplierquote,
                message: "New Supplier Quote created successfully",
              });
    }
    catch(error){
        res.status(500).json({ isOk: false, error: error });
    }
}
exports.updateSupplierQuote=async(req,res)=>{
    try{
        let{ProductDetail,Quantity,Grade,SupplierName}=req.body;
        const updatedsupplierquote=await findOneAndUpdate(req.params,req.body,{new:true});
        res.status(200).send(updatedsupplierquote)

    }
    catch(error){
        res.status(500).send(error)
    }
}

exports.listSupplierQuote=async(req,res)=>{
    try{
        const list=await SupplierQuoteSchema.find().sort({createdAt:-1}).exec()
        res.status(200).send(list);
    }
    catch(error){
        res.status(500).send(error)
    }
   
}