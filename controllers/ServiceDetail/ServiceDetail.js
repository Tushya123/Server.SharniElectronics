const ServiceDetail = require("../../models/ServiceDetail/ServiceDetail");
exports.createProjectDetail = async (req, res) => {
  
  try {
    let imageURL = req.file
    ? `uploads/ProjectDetailImages/${req.file.filename}`
      : null;
    let { Detail,ServiceName,Description, IsActive } = req.body;

    console.log("rsrsrsrsrsrsrs",imageURL);

    const newProject = await new ServiceDetail({
      ServiceName,
      Description,
      // subtitle,
      Detail,
      IsActive,
      imageURL
    }).save();

    res.status(200).json({
      isOk: true,
      data: newProject,
      message: "New project created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }

};

exports.listProjectDetail = async (req, res) => {
  try {
    const list = await ServiceDetail.aggregate([
        {
          $lookup: {
            from: 'servicetypeschemas',
            localField: 'ServiceName', 
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

exports.listActiveProjectDetail = async (req, res) => {
  try {
    const list = await ServiceDetail.aggregate([
        {
          $lookup: {
            from: 'servicetypeschemas',
            localField: 'ServiceName', 
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
        {
          $match: {
            $or: [
              {
                "specialtyInfo.0.SpecialityName": new RegExp(match, "i"),
              },
              {
                detail: new RegExp(match, "i"),
              },   {
                DoctorName: new RegExp(match, "i"),
              },   {
                specialityNameOther: new RegExp(match, "i"),
              },
            ],
          },
        },
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

exports.updateProjectDetail = async (req, res) => {
    try {
        console.log("kokokkokokokokoko",req.file)
        let imageURL = req.file
        ? `uploads/ProjectDetailImages/${req.file.filename}`
          : req.body.imageURL;
        let {Detail,ServiceName,Description, IsActive} = req.body;
    
        console.log("rsrsrsrsrsrsrs",imageURL);

        const update = await ServiceDetail.findOneAndUpdate(
            { _id: req.params._id },
            { $set: { 
                "ServiceName": ServiceName,
                "IsActive": IsActive,
                "Description": Description,
                "Detail": Detail,
                "imageURL": imageURL

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

exports.removeProjectDetail = async (req, res) => {
  try {
    const delTL = await ServiceDetail.findByIdAndDelete({
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
          from: "servicetypeschemas",
          localField: "ServiceName",
          foreignField: "_id",
          as: "serviceTypeDetails",
        },
      },
      {
        $unwind: {
          path: "$servicetypeschemas",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              "serviceTypeDetails.0.ServiceName": new RegExp(match, "i"),
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
          serviceTypeDetails: { $arrayElemAt: ["$serviceTypeDetails", 0] },

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

    const list = await ServiceDetail.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};