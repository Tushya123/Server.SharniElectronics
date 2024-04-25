const SupplierDetailSchema = require("../../models/Supplier/Supplier");


exports.createSupplier = async (req, res) => {
  try {
    let { IsActive,Website1,EmailID_Sales,EmailID_Office,EmailID_Support,ContactNo_Office,ContactNo_Support,ContactNo_Sales,Pincode,Country,State,City,Address2,Address1,SupplierName } = req.body;

    const newProject = await new SupplierDetailSchema({
        IsActive,Website1,EmailID_Sales,EmailID_Office,EmailID_Support,ContactNo_Office,ContactNo_Support,ContactNo_Sales,Pincode,Country,State,City,Address2,Address1,SupplierName
    }).save();

    res.status(200).json({
      isOk: true,
      data: newProject,
      message: "New Supplier created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: err });
  }
};


exports.updateSupplier = async (req, res) => {
  try {
    let { IsActive,Website1,EmailID_Sales,EmailID_Office,EmailID_Support,ContactNo_Office,ContactNo_Support,ContactNo_Sales,Pincode,Country,State,City,Address2,Address1,SupplierName } = req.body;

    const update = await SupplierDetailSchema.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );

    res.status(200).json({
      isOk: true,
      data: update,
      message: "Project updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};


exports.removeSupplier = async (req, res) => {
  try {
    const delTL = await SupplierDetailSchema.findByIdAndDelete({
      _id: req.params._id,
    });
    


    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getspecificSupplier=async(req,res)=>{
try{
    const spec=await SupplierDetailSchema.findOne({_id:req.params});
    res.status(200).send(spec)

}
catch(error){
    res.status(500).send(error)
}
}
exports.listsupplier=async(req,res)=>{
    try{
        const list=await SupplierDetailSchema.find().sort({createdAt:-1}).exec();
        res.status(200).send(list)

    }
    catch(err){
        res.status(500).send(err)
    }
}



exports.listSupplierDetailByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
    console.log("Received skip:", skip);
    console.log("Received per_page:", per_page);
    console.log("Received IsActive:", IsActive);

    // if (!skip || !per_page || !IsActive) {
    //   return res.status(400).send("Skip, per_page, and IsActive are required");
    // }

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      
     
      {
        $match: {
          $or: [
            {
                SupplierName: new RegExp(match, "i"),
            },
            {
                City: new RegExp(match, "i"),
            }
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
            {
              $skip: parseInt(skip),
            },
            {
              $limit: parseInt(per_page),
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$stage1",
        },
      },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
          ProductDetailTypes: { $arrayElemAt: ["$ProductDetailTypes", 0] },

        },
      },
    ];

   
    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query.unshift({
        $sort: sort,
      });
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query.unshift({
        $sort: sort,
      });
    }

    const list = await SupplierDetailSchema.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};