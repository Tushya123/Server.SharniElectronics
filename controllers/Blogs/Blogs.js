
const Blogmodel=require("../../models/Blogs/Blog")
exports.createBlog = async (req, res) => {
    try {
      let BlogImage = req.file ? `uploads/BlogImages/${req.file.filename}` : null;
  
      let { Title, Description,Category, IsActive } = req.body;
  
      const add = await new Blogmodel({
        Title, Description,Category,BlogImage, IsActive 
       
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };


  exports.listBlogByParams = async (req, res) => {
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
  
      const types = await Blogmodel.aggregate(query);
  
      res.json(types);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };


  exports.getBlogById = async (req, res) => {
    try {
      const type = await Blogmodel.findById(req.params.id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      res.json(type);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };


  exports.updateBlog = async (req, res) => {
    try {
        const {   Title, Description,Category, IsActive  } = req.body;
        let BlogImage = null;

        if (req.file) {
            BlogImage = `uploads/BlogImages/${req.file.filename}`;
        } else {
            // Retrieve the previous image path from the database
            const existingBlog = await Blogmodel.findById(req.params.id);
            if (!existingBlog) {
                return res.status(404).json({ message: "Blog not found" });
            }
        BlogImage = existingBlog.BlogImage; // Corrected variable name
        }

        const updatedType = await Blogmodel.findByIdAndUpdate(
            req.params.id, {
                Title, Description,Category,BlogImage, IsActive 
            }, { new: true }
        );

        if (!updatedType) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({
            isOk: true,
            data: updatedType,
            message: "Blog updated successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};


  exports.removeBlog = async (req, res) => {
    try {
      const removedBlog = await Blogmodel.findByIdAndDelete(req.params.id);
      if (!removedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json({
        isOk: true,
        data: removedBlog,
        message: "Blog removed successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };

  exports.listBlog = async (req, res) => {
    try{
     const list = await Blogmodel.find().sort({ createdAt: -1 }).exec();
     res.json(list);
    }catch(err){
     console.log(err);
    }
   };