const ProductInquiry=require("../../models/Inquiry/Inquiry")

exports.downloadProductInquiryByParamsandDate = async (req, res) => {
    try {
      let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
  
      let query = [
        {
          $match: { IsActive: IsActive, Country: country },
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
  
      const list = await countryReport.aggregate(query);
  
      console.log("list", list);
  
      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet("Country Report");
  
      // Add headers to the worksheet
      console.log("Preparing columns for the worksheet");
  
      worksheet.columns = [
        { header: "Contact Person", key: "ContactPerson" },
        { header: "Mobile", key: "Mobile" },
        { header: "Email", key: "Email" },
        { header: "Country", key: "Country" },
        { header: "Remark", key: "Remark" },
      ];
  
      console.log("Columns prepared");
  
      console.log("Adding data to the worksheet");
  
      list[0].data.forEach((item) => {
        console.log("Adding row for item:", item);
        worksheet.addRow({
          ContactPerson: item.ContactPerson,
          Mobile: item.Mobile,
          Email: item.Email,
          Country: item.Country,
          Remark: item.Remark,
        });
      });
  
      console.log("Data added to the worksheet");
  
      console.log("Preparing to send the Excel file to the client");
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