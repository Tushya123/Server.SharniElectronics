const proddetails = require("../../models/ProductDetail/ProductDetail");
const supplierquote=require("../../models/SupplierQuote/SupplierQuote")
const PDFDocument = require("pdfkit");
const path = require('path');
const fs = require("fs");
exports.createProjectDetail = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ProductDetailImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/ProductDetailImages`);
    }
    let bannerImage = req.file ? `uploads/ProductDetailImages/${req.file.filename}` : null;
    let {  ProductDetail, Description, IsActive, ProductDetailDescription } = req.body;
    console.log(typeof ProductDetailDescription)
//     const keyArray = ProductDetailDescriptionKey.split(',').map(typology => typology.trim());
// const valueArray = ProductDetailDescriptionValue.split(',').map(typology => typology.trim());

// // Flatten the arrays
// const flattenedKeyArray = keyArray.flat();
// const flattenedValueArray = valueArray.flat();

// // Assuming you want to remove the escape characters ("\")
//   const sanitizedKeyArray = flattenedKeyArray.map(item => item.replace(/[\[\]"]+/g, ''));
// const sanitizedValueArray = flattenedValueArray.map(item => item.replace(/[\[\]"]+/g, ''));
// console.log(sanitizedKeyArray)
// console.log(sanitizedValueArray)
    // ProductDetailDescriptionValue = ProductDetailDescriptionValue.split(',').map(typology => typology.trim());
    // ProductDetailDescriptionKey = ProductDetailDescriptionKey.split(',').map(typology => typology.trim());
    
    // Assuming ProductDetailDescription is passed as a stringified JSON array
    const newMetalDetails = JSON.parse(ProductDetailDescription);
    const extractedObjects = [];

    newMetalDetails.forEach((nestedArray) => {
      if (nestedArray && nestedArray.length > 0) {
        const extractedObject = nestedArray[0]; // Assuming there's only one object in each nested array
        extractedObjects.push(extractedObject);
      }
    });
 

    const newProject = await new proddetails({
      ProductDetail,
      Description,
      
      ImageUrl: bannerImage,
      IsActive,
      ProductDetailDescription:extractedObjects
    }).save();

    res.status(200).json({
      isOk: true,
      data: newProject,
      message: "New project created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: err });
  }
};


const multer = require('multer');

// Set up multer for handling form data
const upload = multer();

exports.updateProjectDetail = async (req, res) => {
  try {
    let bannerImage = req.file
      ? `uploads/ProductDetailImages/${req.file.filename}`
      : null;
    let fieldvalues = { ...req.body };
    if (bannerImage != null) {
      fieldvalues.ImageUrl = bannerImage;
    }
    const newMetalDetails = JSON.parse(fieldvalues.ProductDetailDescription);
    const extractedObjects = [];
    newMetalDetails.forEach((nestedArray) => {
      if (nestedArray && nestedArray.length > 0) {
        const extractedObject = nestedArray[0]; // Assuming there's only one object in each nested array
        extractedObjects.push(extractedObject);
      }
    });
    fieldvalues["ProductDetailDescription"] = extractedObjects;

    const update = await proddetails.findOneAndUpdate(
      { _id: req.params._id },
      fieldvalues,
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


exports.removeProjectDetail = async (req, res) => {
  try {
    const delTL = await proddetails.findByIdAndDelete({
      _id: req.params._id,
    });
    await supplierquote.deleteMany({ProductDetail:req.params._id});


    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};



exports.listProjectDetailByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
    console.log("Received skip:", skip);
    console.log("Received per_page:", per_page);
    console.log("Received IsActive:", IsActive);

    // if (!skip || !per_page || !IsActive) {
    //   return res.status(400).send("Skip, per_page, and IsActive are required");
    // }

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "productgroups",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "ProductDetailTypes",
        },
      },
      {
        $unwind: {
          path: "$productgroups",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              "ProductDetailTypes.0.ProductGroup": new RegExp(match, "i"),
            },
            {
              Description: new RegExp(match, "i"),
            }
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
          ProductDetailTypes: { $arrayElemAt: ["$ProductDetailTypes", 0] },

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

    const list = await proddetails.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.listProjectDetailByParamsSearch = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
    console.log("Received skip:", skip);
    console.log("Received per_page:", per_page);
    console.log("Received IsActive:", IsActive);

    // if (!skip || !per_page || !IsActive) {
    //   return res.status(400).send("Skip, per_page, and IsActive are required");
    // }

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "productgroups",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "ProductDetailTypes",
        },
      },
      {
        $unwind: {
          path: "$productgroups",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            // {
            //   "ProductDetailTypes.0.ProductGroup": new RegExp(match, "i"),
            // },
            {
              Description: new RegExp(match, "i"),
            }
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
          ProductDetailTypes: { $arrayElemAt: ["$ProductDetailTypes", 0] },

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

    const list = await proddetails.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listProjectDetailByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};


exports.listProjectDetail=async(req,res)=>{
  try{
    const list = await proddetails.find().populate({path:"ProductDetail",select:"ProductGroup"})
    res.status(200).send(list);


  }
  catch(err){
    res.status(500).send(err);

  }
}

exports.getspecificProductDetail=async(req,res)=>{
  try{
const list=await proddetails.findOne({_id:req.params})
res.status(200).send(list)
  }
  catch(err){
    res.status(500).send(err)
  }
}

exports.getProductByDescription = async (req, res) => {
  try {
    const product = await proddetails.findOne({ Description: req.params.description });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
};

const axios = require('axios');





exports.downloadPdf = async (req, res, next) => {
  try {
    const { Description, ImageUrl, ProductDetailDescription } = req.body;

    const doc = new PDFDocument();

    // Set response headers to allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set response headers for PDF content
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${Description}-${Date.now()}.pdf"`);

    // Pipe the PDF content to the response
    doc.pipe(res);
    const logoUrl = 'https://front.shreejipharma.in/static/media/logo.eecbf1c37f0a264bcea6.png'; // Update with the actual logo URL

    // Download the logo image
    const logoResponse = await axios({
      url: logoUrl,
      responseType: 'arraybuffer'
    });

    const tempLogoPath = path.join(__dirname, `temp-logo-${Date.now()}.jpg`);
    fs.writeFileSync(tempLogoPath, logoResponse.data);

    if (fs.existsSync(tempLogoPath)) {
      doc.image(tempLogoPath, {
        fit: [150, 75],
        align: 'left',
      });
      fs.unlinkSync(tempLogoPath);
    }
    

    // Add company name, email, and phone number
    doc.fontSize(16).text("Shreeji Pharma International", 120, 55, { align: 'right' });
doc.fontSize(12).text("contact@shreejipharma.com", 120, 75, { align: 'right' });
doc.fontSize(12).text("+918866002331", 120, 95, { align: 'right' });


    // Add some space after the header section
    doc.moveDown(4);

    // Add the title
    doc.fontSize(30).text(Description, { align: "center",underline:true });
    doc.moveDown();

    // Add the image if available
    if (ImageUrl) {
      const imageUrl = `https://server.shreejipharma.in/${ImageUrl}`;
      console.log("Downloading image from:", imageUrl);

      const response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer'
      });

      const tempImagePath = path.join(__dirname, `temp-image-${Date.now()}.jpg`);
      fs.writeFileSync(tempImagePath, response.data);

      if (fs.existsSync(tempImagePath)) {
        doc.image(tempImagePath, {
          fit: [400, 270],
          align: 'center',
          valign: 'center'
        });
        doc.moveDown();

        // Delete the temp image after use
        fs.unlinkSync(tempImagePath);
      } else {
        console.error("Image not found:", tempImagePath);
      }
    }
    

    // Add some space below the image
    doc.moveDown(8);


    // Add product details in tabular form
    doc.fontSize(20).text("Product Details:", { underline: true,align:'center' });
    doc.moveDown();

    const tableTop = doc.y;
    const tableLeft = 40;
    const keyWidth = 200;
    const valueWidth = 300;
    const rowPadding = 14;

    // Draw table headers with borders

    // doc.rect(tableLeft, tableTop, keyWidth, 25 + rowPadding).stroke();
    // doc.rect(tableLeft + keyWidth + 50, tableTop, valueWidth, 25 + rowPadding).stroke();

    // doc.moveDown();

    // Draw table rows with borders
    ProductDetailDescription.forEach((detail, index) => {
      const keyHeight = doc.heightOfString(detail.ProductKey, {
        width: keyWidth - rowPadding * 2,
      });
      const valueHeight = doc.heightOfString(detail.ProductValue, {
        width: valueWidth - rowPadding * 2,
      });
      const rowHeight = Math.max(keyHeight, valueHeight) + rowPadding * 2;

      // Check if there is enough space for the next row, if not, add a new page
      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        const newTableTop = doc.y;

        // Draw table headers with borders on the new page
       


        doc.moveDown(2);
      }

      const y = doc.y;

      // Draw the Product Key
      doc.fontSize(12).text(detail.ProductKey, tableLeft + rowPadding, y + rowPadding, {
        width: keyWidth - rowPadding * 2,
        align: 'left'
      });

      // Draw the Product Value
      doc.fontSize(12).text(detail.ProductValue, tableLeft + keyWidth + rowPadding, y + rowPadding, {
        width: valueWidth - rowPadding * 2,
        align: 'left'
      });

      // Draw borders for the row
      doc.rect(tableLeft, y, keyWidth, rowHeight).stroke();
      doc.rect(tableLeft + keyWidth, y, valueWidth, rowHeight).stroke();

      doc.moveDown(); // Move down after the row
    });

    // End the document
    doc.end();

    // Handle document errors
    doc.on('error', (err) => {
      next(err);
    });
  } catch (err) {
    next(err);
  }
};