const ProductGroupSchema = require("../../models/Services/ServiceGroup");
const proddetails = require("../../models/Services/ServiceDetail");
const fs=require("fs");
const sharp = require("sharp"); // Import the sharp library
exports.createAreatype = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ServiceGroupImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/ServiceGroupImages`);
    }
    console.log(req.file)
    let ImageUrl = req.file?req.file: null;
    let { ServiceGroup, IsActive } = req.body;
    
    if (ImageUrl) {
      const extname = path.extname(ImageUrl.filename).toLowerCase();
      const originalPath = ImageUrl.path;

      let targetPath;
      if (extname !== ".jpeg" && extname !== ".jpg") {
        targetPath = `uploads/ServiceGroupImages/${path.basename(
          ImageUrl.filename,
          extname
        )}.jpeg`;

        await sharp(originalPath)
          .resize({
            width: 250,
            height: 330,
            fit: "contain",
            background: "white",
          })
          .jpeg() // Convert to JPEG format
          .toFile(targetPath);

        await fs.unlink(originalPath); // Remove the original file
        ImageUrl.path = targetPath; // Update the path to the new JPEG image
      } else {
        // If the image is already in JPEG format, create a temporary file to resize
        targetPath = `uploads/ServiceGroupImages/temp_${imageURL.filename}`;

        await sharp(originalPath)
          .resize({
            width: 250,
            height: 330,
            fit: "contain",
            background: "white",
          })
          .toFile(targetPath);

        await fs.unlink(originalPath); // Remove the original file
        await fs.rename(targetPath, originalPath); // Rename the temp file to original file
      }
    }
    const addAreatype = await new ProductGroupSchema({
        ServiceGroup,IsActive,ImageUrl:ImageUrl.path}
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
      ? req.file
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage) {
      const extname = path.extname(bannerImage.filename).toLowerCase();
      const originalPath = bannerImage.path;

      let targetPath;
      if (extname !== ".jpeg" && extname !== ".jpg") {
        targetPath = `uploads/ServiceGroupImages/${path.basename(
          bannerImage.filename,
          extname
        )}.jpeg`;

        await sharp(originalPath)
          .resize({
            width: 250,
            height: 330,
            fit: "contain",
            background: "white",
          })
          .jpeg() // Convert to JPEG format
          .toFile(targetPath);

        await fs.unlink(originalPath); // Remove the original file
        bannerImage = targetPath; // Update imageURL to the new JPEG image path
      } else {
        // If the image is already in JPEG format, create a temporary file to resize
        targetPath = `uploads/ServiceGroupImages/temp_${imageURL.filename}`;

        await sharp(originalPath)
          .resize({
            width: 250,
            height: 330,
            fit: "contain",
            background: "white",
          })
          .toFile(targetPath);

        await fs.unlink(originalPath);
        await fs.rename(targetPath, originalPath); // Rename the temp file to original file
        bannerImage = originalPath; // Update imageURL to the resized JPEG image path
      }
    } else {
      bannerImage = req.body.bannerImage; // Use the existing image URL if no new file is provided
    }
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


