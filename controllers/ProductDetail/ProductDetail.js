const proddetails = require("../../models/ProductDetail/ProductDetail");
const fs = require("fs");
exports.createProjectDetail = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ProductDetailImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/ProductDetailImages`);
    }
    let bannerImage = req.file
    ? `uploads/ProductDetailImages/${req.file.filename}`
    : null;
    let { Detail,ProductDetail, Description, IsActive,ProductDetailDescription } = req.body;

    const newProject = await new proddetails({
      ProductDetail,
      Description,
      Detail,
      ImageUrl:bannerImage,
      IsActive,
      ProductDetailDescription
    
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

const multer = require('multer');

// Set up multer for handling form data
const upload = multer();

exports.updateProjectDetail = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/ProductDetailImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.ImageUrl = bannerImage;
    }

    const update = await proddetails.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
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
              "ProductDetailTypes.0.ProductGroup": new RegExp(match, "i"),
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

exports.listProjectDetail=async(req,res)=>{
  try{
    const list = await proddetails.find().populate({path:"ProductDetail",select:"ProductGroup"})
    res.status(200).send(list);


  }
  catch(err){
    res.status(500).send(err);

  }
}