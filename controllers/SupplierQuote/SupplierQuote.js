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
        const list=await SupplierQuoteSchema.find().populate({
            path: "SupplierName", // Populating SupplierName field
            select: "SupplierName"
          }).sort({createdAt:-1}).exec()
        res.status(200).send(list);
    }
    catch(error){
        res.status(500).send(error)
    }
   
}

exports.listSupplierQuoteByParams = async (req, res) => {
    try {
      let { skip, per_page, sorton, sortdir, match } = req.body;
  
      let query = [
       
        {
          $lookup: {
            from: "productdetails",
            localField: "ProductDetail",
            foreignField: "_id",
            as: "ProductDetailTypes",
          },
        },
        {
          $lookup: {
            from: "supplierdetails",
            localField: "SupplierName",
            foreignField: "_id",
            as: "SupplierDetailTypes",
          },
        },
        {
          $match: {
            $or: [
              { "ProductDetailTypes.ProductDetail": new RegExp(match, "i") },
              { "SupplierDetailTypes.SupplierName": new RegExp(match, "i") },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            stage1: [
              {
                $group: {
                  _id: null,
                  count: {
                    $sum: 1,
                  },
                },
              },
            ],
            stage2: [
              { $skip: parseInt(skip) },
              { $limit: parseInt(per_page) },
            ],
          },
        },
        {
          $unwind: "$stage1",
        },
        {
          $project: {
            count: "$stage1.count",
            data: "$stage2",
          },
        },
      ];
  
      if (sorton && sortdir) {
        let sort = {};
        sort[sorton] = sortdir == "desc" ? -1 : 1;
        query.unshift({ $sort: sort });
      } else {
        query.unshift({ $sort: { createdAt: -1 } });
      }
  
      const list = await SupplierQuoteSchema.aggregate(query);
      res.json(list);
    } catch (error) {
      console.error("Error in listAssignProductByParams:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  exports.deleteSupplierQuote=async(req,res)=>{
    try{
        const deletedsupplierquote=await SupplierQuoteSchema.findByIdAndDelete(req.params);
        res.status(200).json(deletedsupplierquote)

    }
    catch(error){
        res.status(500).json(error)
    }
  }

