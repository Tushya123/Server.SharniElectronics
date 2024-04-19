const Cmsmodel=require("../../models/Cmsmaster/Cmsmastermodel")
exports.createCms = async (req, res) => {
    try {
      let cmsImage = req.file ? `uploads/cmsImages/${req.file.filename}` : null;
  
      let { cmsname, cmsDesc, cmsThumnailDesc, IsActive } = req.body;
  
      const add = await new Cmsmodel({
        cmsname,
        cmsDesc,
        cmsThumnailDesc,
        cmsImage,
        IsActive,
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };


  exports.listCmsByParams = async (req, res) => {
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
                cmsname: { $regex: match, $options: "i" },
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
  
      const types = await Cmsmodel.aggregate(query);
  
      res.json(types);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };


  exports.getcmsById = async (req, res) => {
    try {
      const type = await Cmsmodel.findById(req.params.id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      res.json(type);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };


  exports.updatecms = async (req, res) => {
    try {
        const { cmsname, cmsDesc, cmsThumnailDesc, IsActive } = req.body;
        let cmsImage = null;

        if (req.file) {
            cmsImage = `uploads/cmsImages/${req.file.filename}`;
        } else {
            // Retrieve the previous image path from the database
            const existingcms = await Cmsmodel.findById(req.params.id);
            if (!existingcms) {
                return res.status(404).json({ message: "cms not found" });
            }
            cmsImage = existingcms.cmsImage; // Corrected variable name
        }

        const updatedType = await Cmsmodel.findByIdAndUpdate(
            req.params.id, {
                cmsname,
                cmsDesc,
                cmsThumnailDesc,
                cmsImage,
                IsActive,
            }, { new: true }
        );

        if (!updatedType) {
            return res.status(404).json({ message: "cms not found" });
        }

        res.json({
            isOk: true,
            data: updatedType,
            message: "cms updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};


  exports.removecms = async (req, res) => {
    try {
      const removedcms = await Cmsmodel.findByIdAndDelete(req.params.id);
      if (!removedcms) {
        return res.status(404).json({ message: "cms not found" });
      }
      res.json({
        isOk: true,
        data: removedcms,
        message: "cms removed successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };

  exports.listCMS = async (req, res) => {
    try{
     const list = await Cmsmodel.find().sort({ createdAt: -1 }).exec();
     res.json(list);
    }catch(err){
     console.log(err);
    }
   };