const SupplierQuoteSchema=require("../../models/SupplierQuote/SupplierQuote");
const SupplierSetup=require("../../models/Supplier/Supplier")
const nodemailer = require('nodemailer');
require('dotenv').config();
exports.createSupplierQuote=async(req,res)=>{
    try{
            let{ProductDetail,Quantity,SupplierName}=req.body;
            const newsupplierquote=await new SupplierQuoteSchema(
req.body
            ).save();
            res.status(200).json({
                isOk: true,
                data: newsupplierquote,
                message: "New Supplier Quote created successfully",
              });
    }
    catch(error){
        res.status(500).json({ isOk: false, error: error });
    }
}
exports.updateSupplierQuote=async(req,res)=>{
    try{
        let{ProductDetail,Quantity,SupplierName}=req.body;
        const updatedsupplierquote=await findOneAndUpdate(req.params,req.body,{new:true});
        res.status(200).send(updatedsupplierquote)

    }
    catch(error){
        res.status(500).send(error)
    }
}

exports.listSupplierQuote=async(req,res)=>{
    try{
        const list=await SupplierQuoteSchema.find().populate({
            path: "SupplierName", // Populating SupplierName field
            select: "SupplierName"
          }).sort({createdAt:-1}).exec()
        res.status(200).send(list);
    }
    catch(error){
        res.status(500).send(error)
    }
   
}

exports.listSupplierQuoteByParams = async (req, res) => {
    try {
      let { skip, per_page, sorton, sortdir, match } = req.body;
  
      let query = [
       
        {
          $lookup: {
            from: "productdetails",
            localField: "ProductDetail",
            foreignField: "_id",
            as: "ProductDetailTypes",
          },
        },
        {
          $lookup: {
            from: "supplierdetails",
            localField: "SupplierName",
            foreignField: "_id",
            as: "SupplierDetailTypes",
          },
        },
        {
          $match: {
            $or: [
              { "ProductDetailTypes.ProductDetail": new RegExp(match, "i") },
              { "SupplierDetailTypes.SupplierName": new RegExp(match, "i") },
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
              { $skip: parseInt(skip) },
              { $limit: parseInt(per_page) },
            ],
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
  
      const list = await SupplierQuoteSchema.aggregate(query);
      res.json(list);
    } catch (error) {
      console.error("Error in listAssignProductByParams:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  exports.deleteSupplierQuote=async(req,res)=>{
    try{
        const deletedsupplierquote=await SupplierQuoteSchema.findByIdAndDelete(req.params);
        res.status(200).json(deletedsupplierquote)

    }
    catch(error){
        res.status(500).json(error)
    }
  }

exports.forgetPassword = async (req, res) => {
    const { EmailID_Office } = req.body;
    console.log(req.body)

    try {
        // Find the admin user by email
        const admin = await SupplierSetup.findOne({ EmailID_Office });
        console.log(EmailID_Office)
        if (!admin) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a transporter using nodemailer
        const transporter = nodemailer.createTransport({
            // Configure your email transporter here (e.g., SMTP)
            host: "smtp.gmail.com", // or your SMTP host
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Provide your email username
                pass: process.env.EMAIL_PASS // Provide your email password
            }
        });
        
       
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: EmailID_Office,
            subject: 'Password Recovery',
            html: `<p>This is reset paswword</p>`,
        };

        // Send email using nodemailer
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ success: true, msg: "Reset Email Sent" });
            }
        });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};