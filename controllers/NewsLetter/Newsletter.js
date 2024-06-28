
const NewsletterSchema=require("../../models/NewsLetter/Newsletter")
exports.createNewsletter = async (req, res) => {
    try {
      let NewsletterImage = req.file ? `uploads/NewsletterImage/${req.file.filename}` : null;
  
      let { Title, Description, IsActive,NewsDate } = req.body;
  
      const add = await new NewsletterSchema({
        Title, Description,NewsletterImage, IsActive ,NewsDate
       
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };


  exports.listNewsletterByParams = async (req, res) => {
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
              },{
                Description: { $regex: match, $options: "i" },
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
  
      const types = await NewsletterSchema.aggregate(query);
  
      res.json(types);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };


  exports.getNewsletterById = async (req, res) => {
    try {
      const type = await NewsletterSchema.findById(req.params.id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      res.json(type);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };


  exports.updateNewsletter = async (req, res) => {
    try {
        const {   Title, Description, IsActive,NewsDate  } = req.body;
        let NewsletterImage = null;

        if (req.file) {
            NewsletterImage = `uploads/NewsletterImage/${req.file.filename}`;
        } else {
            // Retrieve the previous image path from the database
            const existingCommitment = await NewsletterSchema.findById(req.params.id);
            if (!existingCommitment) {
                return res.status(404).json({ message: "Commitment not found" });
            }
            NewsletterImage = existingCommitment.NewsletterImage; // Corrected variable name
        }

        const updatedType = await NewsletterSchema.findByIdAndUpdate(
            req.params.id, {
                Title, Description,NewsletterImage, IsActive ,NewsDate
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


  exports.removeNewsletter = async (req, res) => {
    try {
      const removedCommitment = await NewsletterSchema.findByIdAndDelete(req.params.id);
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

  exports.listNewsletter = async (req, res) => {
    try{
     const list = await NewsletterSchema.find().sort({ createdAt: -1 }).exec();
     res.json(list);
    }catch(err){
     console.log(err);
    }
   };