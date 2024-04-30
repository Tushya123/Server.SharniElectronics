const Inquiry = require("../../models/Inquiry/Inquiry");
exports.createInquiry = async (req, res) => {
  try {
    let { IsActive , Mobile, ProductDetail, Email, CompanyName, ContactPerson, Reference, Address, Country, Phone, Fax, Comments ,Status,
      RFQ_Status,
      Quote} = req.body;
      if(Country===""){
        Country="INDIA"
      }
    const newInquiry = await new Inquiry({
      ProductDetail ,
       
      ContactPerson,
      CompanyName,
      Reference,
      Address,
      Country,
      Phone,
      Fax,
      Mobile,
      Email,
      Comments,
      IsActive,
      Status,
      RFQ_Status,
      Quote
    }).save();

    res.status(200).json({
      isOk: true,
      data: newInquiry,
      message: "New Inquiry created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};


exports.listEnquiry = async (req, res) => {
  try {
    const list = await Inquiry.aggregate([
        
        {
          $sort: { createdAt: -1 }
        }
      ]);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveInquiryDetails = async (req, res) => {
  try {
    const list = await Inquiry.aggregate([
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

exports.updateInquiryDetail = async (req, res) => {
    try {
        // console.log("kokokkokokokokoko",req.file)
        // let imageURL = req.file
        // ? `uploads/ProjectDetailImages/${req.file.filename}`
        //   : req.body.imageURL;
        let {IsActive,mobile_no,product,email,Name} = req.body;
    
       

        const update = await Inquiry.findOneAndUpdate(
            { _id: req.params._id },
            { $set: { 
                "mobile_no": req.body.mobile_no,
                "IsActive": req.body.IsActive,
                "product": req.body.product,
                // "Detail": Detail,
                "email": req.body.email,
                "Name":req.body.Name

                 } },
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

exports.removeInquiryDetail = async (req, res) => {
  try {
    const delTL = await Inquiry.findByIdAndDelete(
     req.params);
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


 
exports.listInquiryDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "inquiryproducts",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "InquiryDetails",
        },
      },
       
      // {
      //   $match: {
      //     $or: [
      //       { "InquiryDetails.0.ContactPerson": new RegExp(match, "i") },
             
      //     ],
      //   },
      // },
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

    const list = await Inquiry.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listAssignProductByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};


// exports.getspecificinquiry=async(req,res)=>{
//     try{
//         const specificinquity=await Inquiry.findOne({_id:req.params}).populate({
//           path:"ProductDetail",select: "-_id"
//         });
//         res.status(200).send(specificinquity)

//     }
//     catch(error){
//         res.status(500).send(error)
//     }
// }

// exports.getspecificinquiry = async (req, res) => {
//   try {
//       const specificinquiry = await Inquiry.aggregate([
//           { 
//               $match: {
//                   _id: req.params // Assuming req.params contains the ID of the specific inquiry
//               }
//           },
//           // { 
//           //     $lookup: {
//           //         from: "inquiryproducts",
//           //         localField: "ProductDetail",
//           //         foreignField: "_id",
//           //         as: "InquiryDetails"
//           //     }
//           // }
//       ]);
      
//       res.status(200).send(specificinquiry);
//   } catch(error) {
//       res.status(500).send(error);
//   }
// }

exports.getspecificinquiry = async (req, res) => {
  try {
      const specificinquiry = await Inquiry.findById(req.params) // Assuming req.params contains the ID of the specific inquiry
                                      .populate('ProductDetail'); // Use populate to perform a lookup on the ProductDetail field
      
      if (!specificinquiry) {
          return res.status(404).send("Inquiry not found");
      }
      
      res.status(200).send(specificinquiry);
  } catch(error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
}

