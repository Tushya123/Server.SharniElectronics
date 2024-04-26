const OtherProductSchema=require("../../models/OtherProducts/OtherProducts");



exports.createrole=async(req,res)=>{
    try{
        // let imageURL=req.file?`uploads/RoleImages/${req.file.filename}`:null;
        let {ProductName,Detail,IsActive}=req.body;
        const newuser=await new OtherProductSchema({
            ProductName,Detail,IsActive
        }).save();
        res.status(200).json({
            isOK:true,
            data:newuser,
            message:"OtherProduct Created Succesfully"

        })


    }
    catch(error){
        console.error("Error in Creating OtherProduct:",error);
        res.status(500).json({
            isOK:false,
            message:error
            });
    }
}

exports.updateRole=async(req,res)=>{
    try{
        // const imageURL=req.file?`uploads/RoleImages/${req.file.filename}`:req.body.imageURL;
        let {ProductName,Detail,IsActive}=req.body;
const updateduser=await OtherProductSchema.findOneAndUpdate(req.params,{ $set: { 
    "ProductName": ProductName,
    "Detail": Detail,
    // "imageURL": imageURL,

    "IsActive": IsActive

     } },
     { new: true });
     res.status(200).json({
        isOk: true,
        data: updateduser,
        message: "Project updated successfully",
      });
    }
    catch(error){
        res.status(500).send(error)
    }
}
exports.listRoles = async (req, res) => {
    try{
     const list = await OtherProductSchema.find().sort({ createdAt: -1 }).exec();
     res.json(list);
    }catch(err){
     console.log(err);
    }
   };

  //  exports.listRoleByParams = async (req, res) => {
  //   try {
  //     let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
  //     console.log("Received skip:", skip);
  //     console.log("Received per_page:", per_page);
  //     console.log("Received IsActive:", IsActive);
  
  //     // if (!skip || !per_page || !IsActive) {
  //     //   return res.status(400).send("Skip, per_page, and IsActive are required");
  //     // }
  
  //     let query = [
  //       {
  //         $match: { IsActive: IsActive },
  //       },
        
  //       {
  //         $match: {
  //           $or: [
              
  //             {
  //               Name: new RegExp(match, "i"),
  //             },{
  //               Detail: new RegExp(match, "i"),
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $sort: { createdAt: -1 },
  //       },
  //       {
  //         $facet: {
  //           stage1: [
  //             {
  //               $group: {
  //                 _id: null,
  //                 count: {
  //                   $sum: 1,
  //                 },
  //               },
  //             },
  //           ],
  //           stage2: [
  //             {
  //               $skip: parseInt(skip),
  //             },
  //             {
  //               $limit: parseInt(per_page),
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$stage1",
  //         },
  //       },
        
  //     ];
  
     
  //     if (sorton && sortdir) {
  //       let sort = {};
  //       sort[sorton] = sortdir == "desc" ? -1 : 1;
  //       query.unshift({
  //         $sort: sort,
  //       });
  //     } else {
  //       let sort = {};
  //       sort["createdAt"] = -1;
  //       query.unshift({
  //         $sort: sort,
  //       });
  //     }
  
  //     const list = await role.aggregate(query);
  //     res.json(list);

  //   } catch (error) {
  //     console.error("Error in listProjectDetailByParams:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // };
  exports.listRoleByParams = async (req, res) => {
    try {
      let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
  
      let query = [
        {
          $match: { IsActive: IsActive },
        },
        // Additional stages as needed for your requirements
      ];
  
      if (match) {
        query.unshift({
          $match: {
            $or: [
              {
                Name: { $regex: match, $options: "i" },
              }, {
                Detail: { $regex: match, $options: "i" },
              },
              // Add additional fields to match on as needed
            ],
          },
        });
      }
  
      if (sorton && sortdir) {
        let sort = {};
        sort[sorton] = sortdir == "desc" ? -1 : 1;
        query.push({
          $sort: sort,
        });
      } else {
        query.push({
          $sort: { createdAt: -1 },
        });
      }
  
      query.push({
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
              $skip: skip,
            },
            {
              $limit: per_page,
            },
          ],
        },
      });
  
      query.push({
        $unwind: "$stage1",
      });
  
      query.push({
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      });
  
      const types = await OtherProductSchema.aggregate(query);
  
      res.json(types);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

exports.deleterole=async(req,res)=>{
    try{
const deletedrole=await OtherProductSchema.findByIdAndDelete(req.params);
res.status(200).send(deletedrole)
    }
    catch(error){
        res.status(500).send(error)
    }
}

exports.getrolebyid=async(req,res)=>{
  try{
// const id =req.params;
const reqrole=await OtherProductSchema.findOne({_id:req.params});
res.status(200).send(reqrole);
  }
  catch(error){
    res.status(500).send(error)
  }
}