const ProductGroupSchema = require("../../models/Services/ServiceGroup");
const proddetails = require("../../models/Services/ServiceDetail");
const fs=require("fs");

exports.createAreatype = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ServiceGroupImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/ServiceGroupImages`);
    }
    console.log(req.file)
    let ImageUrl = req.file
    ? `uploads/ServiceGroupImages/${req.file.filename}`
    : null;
    let { ServiceGroup, IsActive } = req.body;
    const addAreatype = await new ProductGroupSchema({
        ServiceGroup,IsActive,ImageUrl:ImageUrl}
    ).save();
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
    let bannerImage = req.file
      ? `uploads/ServiceGroupImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.ImageUrl = bannerImage;
    }
    const update = await ProductGroupSchema.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
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
    await proddetails.deleteMany({ ServiceDetail: req.params._id });

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
                ServiceGroup: { $regex: match, $options: "i" },
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

exports.getProductGroup = async (req, res) => {
  try {
    const find = await ProductGroupSchema.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};


