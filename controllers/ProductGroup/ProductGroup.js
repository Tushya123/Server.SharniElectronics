const ProductGroupSchema = require("../../models/ProductGroup/ProductGroup");

exports.createAreatype = async (req, res) => {
  try {
    const { ProductGroup, IsActive } = req.body;
    const addAreatype = await new ProductGroupSchema(req.body).save();
    res.status(200).json({ isOk: true, data: addAreatype, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error creating Product Group" });
  }
};

exports.listAreatype = async (req, res) => {
  try {
    const list = await ProductGroupSchema.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveAreatype = async (req, res) => {
  try {
    const list = await ProductGroupSchema.find({ IsActive: true })
      .sort({ createdAt: -1 })
      .exec();
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateAreatype = async (req, res) => {
  try {
    const update = await ProductGroupSchema.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { "ProductGroup": req.body.ProductGroup, "IsActive": req.body.IsActive } },
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeAreatype = async (req, res) => {
  try {
    const delTL = await ProductGroupSchema.findByIdAndDelete({
      _id: req.params._id,
    });
    await ProductGroupSchema.deleteMany({ ProductGroup: req.params._id });

    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};


exports.listAreatypesByParams = async (req, res) => {
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
                ProductGroup: { $regex: match, $options: "i" },
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

    const list = await ProductGroupSchema.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};