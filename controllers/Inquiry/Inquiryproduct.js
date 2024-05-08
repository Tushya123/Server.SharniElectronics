const InquiryProduct = require("../../models/Inquiry/Inquiryproduct");
exports.createInquiryProduct = async (req, res) => {
  try {
    let { IsActive ,ProductDetail2, Quantity , SupplierName,ProductDetailLabel,BasePrice,Group,RFQ_Status2, RFQ_Date
       } = req.body;

    const newInquiryProduct = await new InquiryProduct({
        IsActive ,Quantity,  ProductDetail:ProductDetail2  ,Group , ProductDetailLabel,BasePrice,RFQ_Status2, RFQ_Date,SupplierName
    }).save();

    res.status(200).json({
      isOk: true,
      data: newInquiryProduct,
      message: "New InquiryProduct created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};


exports.listEnquiry = async (req, res) => {
  try {
    const list = await InquiryProduct.aggregate([
        {
          $lookup: {
            from: 'servicetypeschemas',
            localField: 'product', 
            foreignField: '_id',  
            as: 'serviceTypeDetails'
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveInquiryProductDetails = async (req, res) => {
  try {
    const list = await InquiryProduct.aggregate([
        {
          $lookup: {
            from: 'servicetypeschemas',
            localField: 'product', 
            foreignField: '_id',  
            as: 'serviceTypeDetails'
          }
        },
        
        {
          $unwind: {
            path: "$specialitymanagements",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $match: {
        //     $or: [
        //       {
        //         "specialtyInfo.0.SpecialityName": new RegExp(match, "i"),
        //       },
        //       {
        //         Name: new RegExp(match, "i"),
        //       },   {
        //         email: new RegExp(match, "i"),
        //       },   {
        //         specialityNameOther: new RegExp(match, "i"),
        //       },
        //     ],
        //   },
        // },
        {
          $sort: { createdAt: -1 }
        }
      ]);
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateInquiryProductDetail = async (req, res) => {
    try {
        // console.log("kokokkokokokokoko",req.file)
        // let imageURL = req.file
        // ? `uploads/ProjectDetailImages/${req.file.filename}`
        //   : req.body.imageURL;
        let {  IsActive ,Quantity,  ProductDetail2  ,Group , ProductDetailLabel,BasePrice,RFQ_Status2, RFQ_Date,SupplierName} = req.body;
        req.body.ProductDetail=ProductDetail2
       

        const update = await InquiryProduct.findOneAndUpdate(
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

exports.removeInquiryProductDetail = async (req, res) => {
  try {
    const delTL = await InquiryProduct.findByIdAndDelete(
     req.params);
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};



exports.listInquiryProductDetailsByParams = async (req, res) => {
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
      // {
      //   $lookup: {
      //     from: "inquiryproducts",
      //     localField: "ProductDetail",
      //     foreignField: "_id",
      //     as: "ProductDetailTypes",
      //   },
      // },
     
      {
        $match: {
          $or: [
            
            {
              Quantity: new RegExp(match, "i"),
            }, {
              ProductDetailLabel: new RegExp(match, "i"),
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

    const list = await InquiryProduct.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};



exports.getspecificInquiryProduct=async(req,res)=>{
    try{
        const specificinquity=await InquiryProduct.findOne({_id:req.params});
        res.status(200).send(specificinquity)

    }
    catch(error){
        res.status(500).send(error)
    }
}