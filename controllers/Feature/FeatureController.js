const Feature = require("../../models/Feature/FeatureModel");
const fs = require("fs");

exports.getFeature = async (req, res) => {
  try {
    const find = await Feature.findOne({ _id: req.params._id }).exec();
    res.json(find);
  } catch (error) {
    return res.status(500).send(error);
  }
};
exports.listFeature = async (req, res) => {
  try {
    const list = await Feature.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.createFeature = async (req, res) => {
  try {

    if (!fs.existsSync(`${__basedir}/uploads/featureImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/featureImages`);
    }

    let bannerImage = req.file
      ? `uploads/featureImages/${req.file.filename}`
      : null;


      let { title, description, IsActive } = req.body;  
    
      
      const add = await new Feature({
        title, 
        description,
        bannerImage,
        IsActive,
      }).save();
      res.status(200).json({ isOk: true, data: add, message: "" });
    }
   catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};



exports.listFeatureByParams = async (req, res) => {
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
              $skip: skip,
            },
            {
              $limit: per_page,
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
                title: { $regex: match, $options: "i" },
              },
              {
                description: { $regex: match, $options: "i" },
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

    const list = await Feature.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.updateFeature = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/featureImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.bannerImage = bannerImage;
    }
    const update = await Feature.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
      { new: true }
    );
    res.json(update);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.removeFeature = async (req, res) => {
  try {
    const del = await Feature.findByIdAndDelete({
      _id: req.params._id,
    });
    res.json(del);
  } catch (err) {
    res.status(400).send(err);
  }
};


