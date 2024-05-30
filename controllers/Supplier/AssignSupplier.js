const assignproduct = require("../../models/Supplier/AssignSupplier");
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const path=require('path')
const fs=require("fs");

exports.createAssignProduct = async (req, res) => {
  try {
    let { SupplierName, ProductDetail, isActive  } = req.body;
    console.log("productDetail",typeof ProductDetail)
    if (!ProductDetail || ProductDetail.length === 0) {
      ProductDetail = [];
    } else if (typeof ProductDetail === 'string') {
      ProductDetail = ProductDetail.split(',').map(typology => typology.trim());
    }
    const newsupplierassign = await new assignproduct({
        SupplierName, ProductDetail, isActive
    }).save();

    res.status(200).json({
      isOk: true,
      data: newsupplierassign,
      message: "New supplierassign created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: err });
  }
};



 
//   try {
//     const list = await assignproduct.aggregate([
//         {
//           $lookup: {
//             from: 'servicetypeschemas',
//             localField: 'ProductDetail', 
//             foreignField: '_id',  
//             as: 'serviceTypeDetails'
//           }
//         },
//         {
//           $sort: { createdAt: -1 }
//         }
//       ]);
//     res.json(list);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// exports.listActiveAssignProduct = async (req, res) => {
//   try {
//     const list = await assignproduct.aggregate([
//         {
//           $lookup: {
//             from: 'servicetypeschemas',
//             localField: 'ProductDetail', 
//             foreignField: '_id',  
//             as: 'serviceTypeDetails'
//           }
//         },
        
//         {
//           $unwind: {
//             path: "$specialitymanagements",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             $or: [
//               {
//                 "specialtyInfo.0.SpecialityName": new RegExp(match, "i"),
//               },
//                  {
//                 Description: new RegExp(match, "i"),
//               },  
//             ],
//           },
//         },
//         {
//           $sort: { createdAt: -1 }
//         }
//       ]);
//     console.log("list avi", list);
//     res.json(list);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// exports.updateAssignProduct = async (req, res) => {
//     try {
//         // console.log("kokokkokokokokoko",req.file)
//         // let imageURL = req.file
//         // ? `uploads/AssignProductImages/${req.file.filename}`
//         //   : req.body.imageURL;
//         let {ProductDetail,Description, isActive,BP,USP,EP,Other} = req.body;
    
//         console.log("rsrsrsrsrsrsrs",imageURL);

//         const update = await assignproduct.findOneAndUpdate(
//             { _id: req.params._id },
//             { $set: { 
//                 "ProductDetail": ProductDetail,
//                 "isActive": isActive,
//                 "BP": BP,
//                 "USP": USP,
//                 "EP": EP,
//                 "Other": Other,
//                 "Description": Description,
//                 // "Detail": Detail,
//                 // "imageURL": imageURL

//                  } },
//             { new: true }
//           );
    
//         res.status(200).json({
//           isOk: true,
//           data: update,
//           message: "supplierassign updated successfully",
//         });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ isOk: false, error: "Internal server error" });
//       }
// };
const multer = require('multer');
const ProductDetail = require("../../models/ProductDetail/ProductDetail");

// Set up multer for handling form data
const upload = multer();

exports.updateAssignProduct = async (req, res) => {
  try {
    let { SupplierName, ProductDetail, isActive  } = req.body;
    if (typeof ProductDetail === 'string') {
      ProductDetail = ProductDetail.split(',').map(typology => typology.trim());
    }
    const update = await assignproduct.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          "ProductDetail": ProductDetail,
          "isActive": isActive,
          
          "SupplierName": SupplierName,
        }
      },
      { new: true }
    );

    res.status(200).json({
      isOk: true,
      data: update,
      message: "supplierassign updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};


exports.removeAssignProduct = async (req, res) => {
  try {
    const delTL = await assignproduct.findByIdAndDelete({
      _id: req.params._id,
    });
    


    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};



exports.listAssignProductByParamsforReport = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive, SupplierName: new mongoose.Types.ObjectId(req.params) },
      },
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
        $addFields: {
          productDetailCount: { $size: "$ProductDetailTypes" },
        },
      },
      {
        $match: {
          $or: [
            { "ProductDetailTypes.0.Description": { $regex: match, $options: "i" } },
            
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
                count: { $sum: 1 },
              },
            },
          ],
          stage2: [
            {
              $addFields: {
                ProductDetailTypes: {
                  $slice: ["$ProductDetailTypes", parseInt(skip), parseInt(per_page)],
                },
              },
            },
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
      sort[sorton] = sortdir === "desc" ? -1 : 1;
      query.unshift({ $sort: sort });
    } else {
      query.unshift({ $sort: { createdAt: -1 } });
    }

    const list = await assignproduct.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listAssignProductByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.listAssignProductByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive },
      },
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

    const list = await assignproduct.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listAssignProductByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};



exports.listAssignProduct=async(req,res)=>{
  try{
    const list=await assignproduct.find() .populate({
      path: "SupplierName", // Populating SupplierName field
      select: "SupplierName"
    })
    .populate({
      path: "ProductDetail", // Populating ProductDetail field
      select: "Description" // Selecting only the _id field
    }).sort({createdAt:-1}).exec();
    res.status(200).send(list);
  }
  catch(error){
    res.status(500).send(error)
  }
}
 

exports.getAssignProductById=async(req,res)=>{
  try{
      const spec=await assignproduct.findOne({_id:req.params});
      res.status(200).send(spec)
  
  }
  catch(error){
      res.status(500).send(error)
  }
  }
  exports.getAssignProductBySupplierNameId=async(req,res)=>{
  try{
      const spec = await assignproduct.findOne({SupplierName:req.params})  .populate({
        path: 'ProductDetail',
        populate: { path: 'ProductDetail' } });
      
      res.status(200).send(spec)
  
  }
  catch(error){
      res.status(500).send(error)
  }
  }

  exports.generateSupplierWiseProductReportExcel = async (req, res) => {
    
  
    try {
      const inquiries = await assignproduct.findOne({SupplierName:req.params})
      .populate({
        path: 'ProductDetail',
        populate: { path: 'ProductDetail' } })
        .sort({ createdAt: -1 });
  
      // Prepare the data for the Excel report
      console.log(inquiries.ProductDetail)
      const excelData = inquiries.ProductDetail.map((inquiry) => {
        const productDetail = {
          ProductName: inquiry.Description,
          ProductGroup: inquiry.ProductDetail.ProductGroup
        };
  
        return {
        
          // Adding Description and ProductGroup to the excelData
          ...productDetail // Assuming there is only one ProductDetail per inquiry
        };
      });
  
      // Create the Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Supplier Wise Product");
      worksheet.columns = [
        { header: "ProductName", key: "ProductName", width: 20 }, // Add Description column
        { header: "Product Group", key: "ProductGroup", width: 20 } // Add ProductGroup column
      ];
  
      // Add the data to the worksheet
      excelData.forEach((data) => {
        worksheet.addRow(data);
      });
  
      // Generate the Excel file
      const filePath = path.join(__dirname, "Publish_media.xlsx");
      await workbook.xlsx.writeFile(filePath);
  
      // Send the Excel file as a response
      res.download(filePath, "Publish_media.xlsx", () => {
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while generating the report" });
    }
  };
  

  
