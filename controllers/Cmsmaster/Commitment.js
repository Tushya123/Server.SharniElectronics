
const Commitmentmodel=require("../../models/Cmsmaster/Commitment")
exports.createCommitment = async (req, res) => {
    try {
      let CommitmentImage = req.file ? `uploads/CommitmentImages/${req.file.filename}` : null;
  
      let { Title, Description, IsActive } = req.body;
  
      const add = await new Commitmentmodel({
        Title, Description,CommitmentImage, IsActive 
       
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };


  exports.listCommitmentByParams = async (req, res) => {
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
                Title: { $regex: match, $options: "i" },
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
  
      const types = await Commitmentmodel.aggregate(query);
  
      res.json(types);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };


  exports.getCommitmentById = async (req, res) => {
    try {
      const type = await Commitmentmodel.findById(req.params.id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      res.json(type);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };


  exports.updateCommitment = async (req, res) => {
    try {
        const {   Title, Description, IsActive  } = req.body;
        let CommitmentImage = null;

        if (req.file) {
            CommitmentImage = `uploads/CommitmentImages/${req.file.filename}`;
        } else {
            // Retrieve the previous image path from the database
            const existingCommitment = await Commitmentmodel.findById(req.params.id);
            if (!existingCommitment) {
                return res.status(404).json({ message: "Commitment not found" });
            }
        CommitmentImage = existingCommitment.CommitmentImage; // Corrected variable name
        }

        const updatedType = await Commitmentmodel.findByIdAndUpdate(
            req.params.id, {
                Title, Description,CommitmentImage, IsActive 
            }, { new: true }
        );

        if (!updatedType) {
            return res.status(404).json({ message: "Commitment not found" });
        }

        res.json({
            isOk: true,
            data: updatedType,
            message: "Commitment updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};


  exports.removeCommitment = async (req, res) => {
    try {
      const removedCommitment = await Commitmentmodel.findByIdAndDelete(req.params.id);
      if (!removedCommitment) {
        return res.status(404).json({ message: "Commitment not found" });
      }
      res.json({
        isOk: true,
        data: removedCommitment,
        message: "Commitment removed successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };

  exports.listCommitment = async (req, res) => {
    try{
     const list = await Commitmentmodel.find().sort({ createdAt: -1 }).exec();
     res.json(list);
    }catch(err){
     console.log(err);
    }
   };