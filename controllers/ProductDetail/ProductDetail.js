const proddetails = require("../../models/ProductDetail/ProductDetail");
// exports.createProjectDetail = async (req, res) => {
  
//   try {
//     // let imageURL = req.file
//     // ? `uploads/ProjectDetailImages/${req.file.filename}`
//     //   : null;
//     let { ProductDetail,Description, IsActive,BP,USP,EP,Other } = req.body;

//     // console.log("rsrsrsrsrsrsrs",imageURL);

//     const newProject = await new proddetails({
//       ProductDetail,
//       Description,
//       // subtitle,
//       // Detail,
//       IsActive,
//       BP,USP,EP,Other,
//       // imageURL
//     }).save();

//     res.status(200).json({
//       isOk: true,
//       data: newProject,
//       message: "New project created successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ isOk: false, error: err });
//   }

// };

exports.createProjectDetail = async (req, res) => {
  try {
    let { ProductDetail, Description, IsActive, BP, USP, EP, Other } = req.body;

    const newProject = await new proddetails({
      ProductDetail,
      Description,
      IsActive,
      BP,
      USP,
      EP,
      Other
    }).save();

    res.status(200).json({
      isOk: true,
      data: newProject,
      message: "New project created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: err });
  }
};



// exports.listProjectDetail = async (req, res) => {
//   try {
//     const list = await proddetails.aggregate([
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

// exports.listActiveProjectDetail = async (req, res) => {
//   try {
//     const list = await proddetails.aggregate([
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

// exports.updateProjectDetail = async (req, res) => {
//     try {
//         // console.log("kokokkokokokokoko",req.file)
//         // let imageURL = req.file
//         // ? `uploads/ProjectDetailImages/${req.file.filename}`
//         //   : req.body.imageURL;
//         let {ProductDetail,Description, IsActive,BP,USP,EP,Other} = req.body;
    
//         console.log("rsrsrsrsrsrsrs",imageURL);

//         const update = await proddetails.findOneAndUpdate(
//             { _id: req.params._id },
//             { $set: { 
//                 "ProductDetail": ProductDetail,
//                 "IsActive": IsActive,
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
//           message: "Project updated successfully",
//         });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ isOk: false, error: "Internal server error" });
//       }
// };
const multer = require('multer');

// Set up multer for handling form data
const upload = multer();

exports.updateProjectDetail = async (req, res) => {
  try {
    let { ProductDetail, Description, IsActive, BP, USP, EP, Other } = req.body;

    const update = await proddetails.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          "ProductDetail": ProductDetail,
          "IsActive": IsActive,
          "BP": BP,
          "USP": USP,
          "EP": EP,
          "Other": Other,
          "Description": Description,
        }
      },
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


exports.removeProjectDetail = async (req, res) => {
  try {
    const delTL = await proddetails.findByIdAndDelete({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};



exports.listProjectDetailByParams = async (req, res) => {
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
        $lookup: {
          from: "productgroups",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "ProductDetailTypes",
        },
      },
      {
        $unwind: {
          path: "$productgroups",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              "ProductDetailTypes.0.ProductDetail": new RegExp(match, "i"),
            },
            {
              Description: new RegExp(match, "i"),
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

    const list = await proddetails.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};