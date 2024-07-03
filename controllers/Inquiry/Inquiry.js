const Inquiry = require("../../models/Inquiry/Inquiry");
const ExcelJS = require("exceljs");
exports.createInquiry = async (req, res) => {
  try {
    let {
      IsActive,
      Mobile,
      ProductDetail,
      Email,
      CompanyName,
      ContactPerson,
      Reference,
      Address,
      Country,
      Phone,
      Fax,
      Comments,
      Status,
      RFQ_Status,
      Quote,
    } = req.body;
    if (Country === "") {
      Country = "INDIA";
    }
    const newInquiry = await new Inquiry({
      ProductDetail,

      ContactPerson,
      CompanyName,
      Reference,
      Address,
      Country,
      Phone,
      Fax,
      Mobile,
      Email,
      Comments,
      IsActive,
      Status,
      RFQ_Status,
      Quote,
    }).save();

    res.status(200).json({
      isOk: true,
      data: newInquiry,
      message: "New Inquiry created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: "Internal server error" });
  }
};

exports.listEnquiry = async (req, res) => {
  try {
    const list = await Inquiry.aggregate([
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.listActiveInquiryDetails = async (req, res) => {
  try {
    const list = await Inquiry.aggregate([
      {
        $lookup: {
          from: "servicetypeschemas",
          localField: "product",
          foreignField: "_id",
          as: "serviceTypeDetails",
        },
      },

      {
        $unwind: {
          path: "$specialitymanagements",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $match: {
      //     $or: [
      //       {
      //         "specialtyInfo.0.SpecialityName": new RegExp(match, "i"),
      //       },
      //       {
      //         Name: new RegExp(match, "i"),
      //       },   {
      //         email: new RegExp(match, "i"),
      //       },   {
      //         specialityNameOther: new RegExp(match, "i"),
      //       },
      //     ],
      //   },
      // },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    console.log("list avi", list);
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.updateInquiryDetail = async (req, res) => {
  try {
    // console.log("kokokkokokokokoko",req.file)
    // let imageURL = req.file
    // ? `uploads/ProjectDetailImages/${req.file.filename}`
    //   : req.body.imageURL;
    let {
      IsActive,
      Mobile,
      ProductDetail,
      Email,
      CompanyName,
      ContactPerson,
      Reference,
      Address,
      Country,
      Phone,
      Fax,
      Comments,
      Status,
      RFQ_Status,
      Quote,
    } = req.body;

    const update = await Inquiry.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
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

exports.removeInquiryDetail = async (req, res) => {
  try {
    const delTL = await Inquiry.findByIdAndDelete(req.params);
    res.json(delTL);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.listInquiryDetailsByParamsfordate = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive, createdAt } =
      req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      // Add a match stage for createdAt
      {
        $match: {
          createdAt: {
            $gte: new Date(createdAt.$gte),
            $lte: new Date(createdAt.$lte),
          },
        },
      },
      {
        $lookup: {
          from: "inquiryproducts",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "InquiryDetails",
        },
      },
      // {
      //   $match: {
      //     $or: [
      //       { "InquiryDetails.0.ContactPerson": new RegExp(match, "i") },

      //     ],
      //   },
      // },
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
          stage2: [{ $skip: parseInt(skip) }, { $limit: parseInt(per_page) }],
        },
      },
      {
        $unwind: "$stage1",
      },
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
        },
      },
    ];

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query.unshift({ $sort: sort });
    } else {
      query.unshift({ $sort: { createdAt: -1 } });
    }

    const list = await Inquiry.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listAssignProductByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.listInquiryDetailsByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "inquiryproducts",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "InquiryDetails",
        },
      },

      // {
      //   $match: {
      //     $or: [
      //       { "InquiryDetails.0.ContactPerson": new RegExp(match, "i") },

      //     ],
      //   },
      // },
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
          stage2: [{ $skip: parseInt(skip) }, { $limit: parseInt(per_page) }],
        },
      },
      {
        $unwind: "$stage1",
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
                ContactPerson: { $regex: match, $options: "i" },
              },
              {
                Email: { $regex: match, $options: "i" },
              },
              {
                Mobile: { $regex: match, $options: "i" },
              },
              {
                CompanyName: { $regex: match, $options: "i" },
              },
            ],
          },
        },
      ].concat(query);
    }

    if (sorton && sortdir) {
      let sort = {};
      sort[sorton] = sortdir == "desc" ? -1 : 1;
      query.unshift({ $sort: sort });
    } else {
      query.unshift({ $sort: { createdAt: -1 } });
    }

    const list = await Inquiry.aggregate(query);
    res.json(list);
  } catch (error) {
    console.error("Error in listAssignProductByParams:", error);
    res.status(500).send("Internal Server Error");
  }
};

// exports.getspecificinquiry=async(req,res)=>{
//     try{
//         const specificinquity=await Inquiry.findOne({_id:req.params}).populate({
//           path:"ProductDetail",select: "-_id"
//         });
//         res.status(200).send(specificinquity)

//     }
//     catch(error){
//         res.status(500).send(error)
//     }
// }

// exports.getspecificinquiry = async (req, res) => {
//   try {
//       const specificinquiry = await Inquiry.aggregate([
//           {
//               $match: {
//                   _id: req.params // Assuming req.params contains the ID of the specific inquiry
//               }
//           },
//           // {
//           //     $lookup: {
//           //         from: "inquiryproducts",
//           //         localField: "ProductDetail",
//           //         foreignField: "_id",
//           //         as: "InquiryDetails"
//           //     }
//           // }
//       ]);

//       res.status(200).send(specificinquiry);
//   } catch(error) {
//       res.status(500).send(error);
//   }
// }

exports.getspecificinquiry = async (req, res) => {
  try {
    const specificinquiry = await Inquiry.findById(req.params) // Assuming req.params contains the ID of the specific inquiry
      .populate("ProductDetail"); // Use populate to perform a lookup on the ProductDetail field

    if (!specificinquiry) {
      return res.status(404).send("Inquiry not found");
    }

    res.status(200).send(specificinquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.downloadProductInquiryByParamsandDate = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, IsActive, createdAt } =
      req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $lookup: {
          from: "inquiryproducts",
          localField: "ProductDetail",
          foreignField: "_id",
          as: "InquiryDetails",
        },
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
                ContactPerson: { $regex: match, $options: "i" },
              },
              {
                Email: { $regex: match, $options: "i" },
              },
              {
                Mobile: { $regex: match, $options: "i" },
              },
              {
                CompanyName: { $regex: match, $options: "i" },
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

    const list = await Inquiry.aggregate(query);

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Status Report");

    // Add headers to the worksheet
    worksheet.columns = [
      { header: "Contact Person", key: "ContactPerson", width: 20 },
      { header: "Company Name", key: "CompanyName", width: 30 },
      { header: "Country", key: "Country", width: 15 },

      { header: "Email", key: "Email", width: 25 },
      { header: "Mobile", key: "Mobile", width: 35 },
      // { header: "Inquiry Number", key: "InquiryNumber", width: 30 },

      { header: "Product Detail", key: "ProductDetailLabel", width: 40 },
      { header: "Product Group", key: "Group", width: 40 },
      { header: "Product Quantity", key: "Quantity", width: 10 },
    ];

    // Adding data to the worksheet
    list[0].data.forEach((item) => {
      let firstEntry = true;
      item.InquiryDetails.forEach((detail) => {
        worksheet.addRow({
          ContactPerson: firstEntry ? item.ContactPerson : "",
          CompanyName: firstEntry ? item.CompanyName : "",
          Mobile: firstEntry ? item.Mobile : "",
          // InquiryNumber: firstEntry ? item._id : '',
          Email: firstEntry ? item.Email : "",
          Country: firstEntry ? item.Country : "",

          ProductDetailLabel: detail.ProductDetailLabel,
          Group: detail.Group,
          Quantity: detail.Quantity,
        });
        firstEntry = false;
      });
      worksheet.addRow({});
      worksheet.addRow({});
    });

    // Send the Excel file to the client
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename='report.xlsx'");

    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
