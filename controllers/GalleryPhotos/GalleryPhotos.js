const GalleryPhotoSchema = require("../../models/Gallery Photos/GalleryPhotos");
const sharp = require("sharp"); // Import the sharp library
const fs = require("fs").promises; // Import the 'fs.promises' module

exports.createGalleryPhoto = async (req, res) => {
  try {
    // let imageURL = req.file
    // ? `uploads/GalleryPhoto/${req.file.filename}`
    //   : null;
    let imageURL = req.file ? req.file : null;
    console.log("cc", imageURL);
    let { Category, IsActive } = req.body;

    if (imageURL) {
      const tempResizedImageCP = `uploads/GalleryPhoto/tempGP_${imageURL.filename}`;
      const PATH = imageURL.path;
      await sharp(PATH)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: "white",
        })
        .toFile(tempResizedImageCP);

      await fs.unlink(PATH);
      await fs.rename(tempResizedImageCP, PATH);
    }

    const newProject = await new GalleryPhotoSchema({
      Category: Category,
      IsActive: IsActive,
      imageURL: imageURL.path,
    }).save();

    res.status(200).json({
      isOk: true,
      data: newProject,
      message: "New Gallery Photo created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};

exports.listGalleryPhotos = async (req, res) => {
  try {
    const list = await GalleryPhotoSchema.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "GalleryTypeDetails",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateGalleryPhotos = async (req, res) => {
  try {
    let imageURL = req.file
      ? `uploads/GalleryPhoto/${req.file.filename}`
      : req.body.imageURL;
    let { Category, IsActive } = req.body;

    console.log("rsrsrsrsrsrsrs", imageURL);

    if (imageURL) {
      // Create a temporary file path for the resized image
      const tempResizedImageCP = `uploads/GalleryPhoto/tempGP_${imageURL.filename}`;
      // const PATH = ProductImage.path;

      await sharp(imageURL)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: "white", // Set background color to white
        })
        .toFile(tempResizedImageCP);

      // Remove the original image
      await fs.unlink(imageURL);
      await fs.rename(tempResizedImageCP, imageURL);
    }

    const update = await GalleryPhotoSchema.findOneAndUpdate(
      { _id: req.params },
      {
        $set: {
          Category: Category,
          IsActive: IsActive,

          imageURL: imageURL,
        },
      },
      { new: true }
    );

    res.status(200).json({
      isOk: true,
      data: update,
      message: "Project updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};

exports.removeGalleryPhotos = async (req, res) => {
  try {
    const delTL = await GalleryPhotoSchema.findByIdAndDelete({
      _id: req.params._id,
    });
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.listGalleryPhotosByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
    console.log("Received skip:", skip);
    console.log("Received per_page:", per_page);
    console.log("Received IsActive:", IsActive);

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "categories",
          localField: "Category",
          foreignField: "_id",
          as: "GalleryTypeDetails",
        },
      },
      {
        $unwind: {
          path: "$GalleryTypeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              "GalleryTypeDetails.Category": new RegExp(match, "i"),
            },
            {
              Description: new RegExp(match, "i"),
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
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
              $skip: parseInt(skip),
            },
            {
              $limit: parseInt(per_page),
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
          //   GalleryTypeDetails: { $arrayElemAt: ["$GalleryTypeDetails", 0] },
        },
      },
    ];

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query.unshift({
        $sort: sort,
      });
    } else {
      let sort = {};
      sort["createdAt"] = -1;
      query.unshift({
        $sort: sort,
      });
    }

    const list = await GalleryPhotoSchema.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getspecificGalleryPhoto = async (req, res) => {
  try {
    const spec = await GalleryPhotoSchema.findOne({ _id: req.params });
    res.status(200).json(spec);
  } catch (error) {
    res.status(500).json(error);
  }
};
