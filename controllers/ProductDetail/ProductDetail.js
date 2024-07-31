const proddetails = require("../../models/ProductDetail/ProductDetail");
const supplierquote=require("../../models/SupplierQuote/SupplierQuote")
const PDFDocument = require("pdfkit");
const path = require('path');
const fs = require("fs");


const handlebars = require('handlebars'); 
const img1 = path.join(__dirname, 'header.png');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

exports.createProjectDetail = async (req, res) => {
  try {
    if (!fs.existsSync(`${__basedir}/uploads/ProductDetailImages`)) {
      fs.mkdirSync(`${__basedir}/uploads/ProductDetailImages`);
    }
    let bannerImage = req.file ? `uploads/ProductDetailImages/${req.file.filename}` : '';
    let { ProductDetail, Description, IsActive, ProductDetailDescription } = req.body;
    console.log(typeof ProductDetailDescription);

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
      ProductDetailDescription: extractedObjects
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
      : '';
    let fieldvalues = { ...req.body };
    if (bannerImage !== '') {
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
    console.log("req.body", req.body);
    const { Description, ImageUrl, ProductDetailDescription } = req.body;

    // Fetch and save the logo image temporarily
    const logoUrl = `https://server-sharni-electronics.vercel.app/uploads/header.png`;

    // Fetch and save the product image temporarily
    const productImageUrl = ImageUrl!==""?`https://server-sharni-electronics.vercel.app/${ImageUrl}`:`https://server.sharnielectronics.com/uploads/Image_not_available.jpg`;

    console.log("Logo URL:", logoUrl);
    console.log("Product Image URL:", productImageUrl);

    // Read and compile the HTML template
    const templateHtml = fs.readFileSync(path.join(__dirname, 'templet.html'), 'utf8');
    const template = handlebars.compile(templateHtml);

    // Replace placeholders with actual data
    const html = template({
      logoUrl,
      Description,
      ImageUrl1: productImageUrl,
      ProductDetailDescription,
    });

    // Launch Puppeteer and create the PDF
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      timeout: 60000 // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();
    
    // Set content to the HTML template
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

    // Generate PDF with custom header
    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', // Blank header for the first page
     
      margin: {
        top: '20px', // Top margin of 20px for subsequent pages
        bottom: '20px',
        
      }
    });

    // Close browser after PDF generation
    await browser.close();

    // Set response headers and send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${Description}-${Date.now()}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF:', err); // Improved error logging
    next(err);
  }
};


 
// exports.downloadPdf = async (req, res, next) => {
//   try {
//     const { Description, ImageUrl, ProductDetailDescription } = req.body;

//     const doc = new PDFDocument();

//     // Set response headers to allow CORS
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

//     // Set response headers for PDF content
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="${Description}-${Date.now()}.pdf"`);

//     // Pipe the PDF content to the response
//     doc.pipe(res);
//     const logoUrl = 'https://front.shreejipharma.in/static/media/logo.eecbf1c37f0a264bcea6.png'; // Update with the actual logo URL

//     // Download the logo image
//     const logoResponse = await axios({
//       url: logoUrl,
//       responseType: 'arraybuffer'
//     });

//     const tempLogoPath = path.join(__dirname, `temp-logo-${Date.now()}.jpg`);
//     fs.writeFileSync(tempLogoPath, logoResponse.data);

//     if (fs.existsSync(tempLogoPath)) {
//       doc.image(tempLogoPath, {
//         fit: [100, 100],
//         align: 'left',
//       });
//       fs.unlinkSync(tempLogoPath);
//     }

//     // Add the bold text
//     doc.font('Helvetica-Bold').fontSize(20).fillColor('#16436f').text("Shreeji Pharma International", 120, 75, { align: 'right' });
//     doc.font('Helvetica-Bold').fontSize(11).fillColor('#16436f').text("contact@shreejipharma.com", 120, 105, { align: 'right' });
//     doc.font('Helvetica-Bold').fontSize(11).fillColor('#16436f').text("+918866002331", 120, 125, { align: 'right' });
//     doc.moveDown(4);
  
//     // Set font size and color for description text and align to the left
//     doc.font('Helvetica-Bold').fontSize(23).fillColor('#16436f').text(Description, {
//       align: 'center'
//     });

//     if (ImageUrl) {
//       const imageUrl = `https://server.shreejipharma.in/${ImageUrl}`;
//       console.log("Downloading image from:", imageUrl);

//       const response = await axios({
//         url: imageUrl,
//         responseType: 'arraybuffer'
//       });

//       const tempImagePath = path.join(__dirname, `temp-image-${Date.now()}.jpg`);
//       fs.writeFileSync(tempImagePath, response.data);

//       if (fs.existsSync(tempImagePath)) {
//         // Calculate horizontal position to center the image
//         const maxWidth = doc.page.width;
//         const imageWidth = maxWidth; // Slightly less than the max width of the page

//         // Calculate horizontal position to center the image
//         const x = (doc.page.width - imageWidth) / 2;

//         // Calculate vertical position to place the image below the text
//         const y = doc.y + 15; // Assuming some space between text and image

//         doc.image(tempImagePath, x, y, {
//           fit: [imageWidth, 300],
//           align: 'center'
//         });

//         // Delete the temp image after use
//         fs.unlinkSync(tempImagePath);
//       } else {
//         console.error("Image not found:", tempImagePath);
//       }
//     }

//     // Add some space below the image 
//     doc.moveDown(14);

//     // Add product details in tabular form
//     // Center align the "Product Details:" text
//     // doc.fontSize(20).fillColor('#16436f').text("Product Details:", { underline: true, align: 'center' });
//     // doc.moveDown();

//     // Calculate table dimensions
//     const tableTop = doc.y;
//     const tableLeft = 40;
//     const keyWidth = 200;
//     const valueWidth = 300;
//     const rowPadding = 14;

//     // Draw table headers with borders
//     // (Commented out because they're not being used in this code snippet)

//     // Draw table rows with borders
//     doc.font('Helvetica-Bold').fontSize(12).fillColor('#16436f')
//       .text("Name", tableLeft + rowPadding, tableTop + rowPadding, { width: keyWidth - rowPadding * 2 })
//       .text("Detail", tableLeft + keyWidth + 30 + rowPadding, tableTop + rowPadding, { width: valueWidth - rowPadding * 2 });
//     doc.moveDown(1);
//     // Draw borders for headers
//     const headerHeight = doc.heightOfString("Name", { width: keyWidth - rowPadding * 2 }) + rowPadding * 2;
//     doc.rect(tableLeft, tableTop, keyWidth, headerHeight).strokeColor('#16436f').stroke();
//     doc.rect(tableLeft + keyWidth, tableTop, valueWidth + 58, headerHeight).strokeColor('#16436f').stroke();

//     ProductDetailDescription.forEach((detail, index) => {
//       const keyHeight = doc.heightOfString(detail.ProductKey, {
//         width: keyWidth - rowPadding * 2,
//       });
//       const valueHeight = doc.heightOfString(detail.ProductValue, {
//         width: valueWidth - rowPadding * 2,
//       });
//       const rowHeight = Math.max(keyHeight, valueHeight) + rowPadding * 2;

//       // Check if there is enough space for the next row, if not, add a new page
//       if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
//         doc.addPage();
//         const newTableTop = doc.y;

//         // Draw table headers with borders on the new page
//         // (You may include this part if needed)

//         doc.moveDown(2); // Move down after adding a new page
//       }

//       const y = doc.y;

//       // Draw the Product Key
//       doc.font('Helvetica').fontSize(12).fillColor('#16436f').text(detail.ProductKey, tableLeft + rowPadding, y + rowPadding, {
//         width: keyWidth - rowPadding * 2,
//       });

//       // Draw the Product Value
//       doc.font('Helvetica').fontSize(12).fillColor('#16436f').text(detail.ProductValue, tableLeft + keyWidth + 30 + rowPadding, y + rowPadding, {
//         width: valueWidth - rowPadding * 2,
//       });

//       // Draw borders for the row
//       doc.rect(tableLeft, y, keyWidth, rowHeight).strokeColor('#16436f').stroke();
//       doc.rect(tableLeft + keyWidth, y, valueWidth + 58, rowHeight).strokeColor('#16436f').stroke();

//       doc.moveDown(); // Move down after the row
//     });

//     // End the document
//     doc.end();

//     // Handle document errors
//     doc.on('error', (err) => {
//       next(err);
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// exports.downloadPdf = async (req, res, next) => {
//   try {
//     const { Description, ImageUrl, ProductDetailDescription } = req.body;




//     // Render the EJS template to HTML
//     const templatePath = path.join(__dirname, 'brocher.ejs');
//     const html = await ejs.renderFile(templatePath, {
//       headerImage: `${process.env.REACT_APP_API_URL_SHREEJI_PHARMACY}/uploads/header.png`,
//       productImage: `${process.env.REACT_APP_API_URL_SHREEJI_PHARMACY}/${ImageUrl}`,
//       productName: Description,
//       productDetails: ProductDetailDescription
//     });

//     // Debugging the rendered HTML
//     console.log('Rendered HTML:', html);

//     // Convert the rendered HTML to PDF using Puppeteer
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' });

//     const pdfBuffer = await page.pdf({ format: 'A4' });
//     await browser.close();

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${Description}-${Date.now()}.pdf"`);
//     res.send(pdfBuffer);

//     // Clean up temporary files
//     fs.unlinkSync(tempHeaderImagePath);
//     fs.unlinkSync(tempProductImagePath);
//   } catch (err) {
//     console.error('Error generating PDF:', err);
//     next(err);
//   }
// };
