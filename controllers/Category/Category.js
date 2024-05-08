const CategorySchema = require("../../models/Category/Category");


exports.createCategory = async (req, res) => {
  try {
    const { Category, IsActive } = req.body;
    const addCategory = await new CategorySchema(req.body).save();
    res.status(200).json({ isOk: true, data: addCategory, message: "" });
  } catch (err) {
    res.status(500).json({ isOk: false, message: "Error creating Category" });
  }
};

exports.listCategory = async (req, res) => {
  try {
    const list = await CategorySchema.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveCategory = async (req, res) => {
  try {
    const list = await CategorySchema.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const update = await CategorySchema.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { "Category": req.body.Category, "IsActive": req.body.IsActive } },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const delTL = await CategorySchema.findByIdAndDelete({
      _id: req.params._id,
    });
    // await proddetails.deleteMany({ ProductDetail: req.params._id });

    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getspecificCategory=async(req,res)=>{
    try{
        const spec=await CategorySchema.findOne({_id:req.params});
        res.status(200).json(spec)

    }
    catch(error){
        res.status(500).json(error)
    }
}


exports.listCategoryByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
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
              $skip: skip ? parseInt(skip) : 0,
            },
            {
              $limit: per_page ? parseInt(per_page) : 10,
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
        },
      },
    ];

    if (match) {
      query = [
        {
          $match: {
            $or: [
              {
                Category: { $regex: match, $options: "i" },
              },
            ],
          },
        },
      ].concat(query);
    }

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query = [
        {
          $sort: sort,
        },
      ].concat(query);
    }

    const list = await CategorySchema.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};