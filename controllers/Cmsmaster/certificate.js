const Certificatemodel = require("../../models/Cmsmaster/Certificate");
const sharp = require("sharp"); // Import the sharp library
const fs = require("fs").promises; // Import the 'fs.promises' module

exports.createCertificate = async (req, res) => {
  try {
    // let CertificateImage = req.file ? `uploads/CertificateImages/${req.file.filename}` : null;
    let CertificateImage = req.file ? req.file : null;
    console.log("cc", CertificateImage);
    let { Title, IsActive } = req.body;

    if (CertificateImage) {
      // const tempResizedImageCP = `uploads/CategoryProducts/tempCP_${req.file.filename}`;
      const tempResizedImageCP = `uploads/CertificateImages/tempCP_${CertificateImage.filename}`;
      const PATH = CertificateImage.path;
      console.log("eeee");
      await sharp(PATH)
        .resize({
          width: 495,
          height: 700,
          fit: "contain",
          background: "white",
        })
        .toFile(tempResizedImageCP);
      console.log("www");

      await fs.unlink(PATH);

      // Rename the temporary resized image to the original image path
      await fs.rename(tempResizedImageCP, PATH);
    }

    const add = await new Certificatemodel({
      Title: Title,
      CertificateImage: CertificateImage.path,
      IsActive: IsActive,
    }).save();
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.listCertificateByParams = async (req, res) => {
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

    const types = await Certificatemodel.aggregate(query);

    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getCertificateById = async (req, res) => {
  try {
    const type = await Certificatemodel.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.json(type);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    // const { Title, IsActive } = req.body;
    // let CertificateImage = null;

    // if (req.file) {
    //   CertificateImage = `uploads/CertificateImages/${req.file.filename}`;
    // } else {
    //   // Retrieve the previous image path from the database
    //   const existingCertificate = await Certificatemodel.findById(
    //     req.params.id
    //   );
    //   if (!existingCertificate) {
    //     return res.status(404).json({ message: "Certificate not found" });
    //   }
    //   CertificateImage = existingCertificate.CertificateImage; // Corrected variable name
    // }

    let CertificateImage = req.file
      ? `uploads/CertificateImages/${req.file.filename}`
      : req.body.CertificateImage;
    let { Title, IsActive } = req.body;

    console.log("rsrsrsrsrsrsrs", CertificateImage);

    if (CertificateImage) {
      // Create a temporary file path for the resized image
      const tempResizedImageCP = `uploads/CertificateImages/tempCP_${CertificateImage.filename}`;
      // const PATH = ProductImage.path;

      await sharp(CertificateImage)
        .resize({
          width: 500,
          height: 500,
          fit: "contain",
          background: "white", // Set background color to white
        })
        .toFile(tempResizedImageCP);

      // Remove the original image
      await fs.unlink(CertificateImage);
      await fs.rename(tempResizedImageCP, CertificateImage);
    }

    const updatedType = await Certificatemodel.findByIdAndUpdate(
      req.params.id,
      {
        Title,
        CertificateImage,
        IsActive,
      },
      { new: true }
    );

    if (!updatedType) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({
      isOk: true,
      data: updatedType,
      message: "Certificate updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.removeCertificate = async (req, res) => {
  try {
    const removedCertificate = await Certificatemodel.findByIdAndDelete(
      req.params.id
    );
    if (!removedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json({
      isOk: true,
      data: removedCertificate,
      message: "Certificate removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.listCertificate = async (req, res) => {
  try {
    const list = await Certificatemodel.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (err) {
    console.log(err);
  }
};
