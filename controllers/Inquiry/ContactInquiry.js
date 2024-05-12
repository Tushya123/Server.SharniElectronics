const contact=require("../../models/Inquiry/ContactInquiry")
exports.createInquirySchema = async (req, res) => {
    try {
      let { Remark, Country, Email, Mobile, ContactPerson, IsActive } = req.body;
      console.log(req.body);
      const addContact = await new contact(req.body).save();
      console.log("create country", addContact);
      res.status(200).json({ isOk: true, data: addContact, message: "" });
    } catch (err) {
      console.error("Error creating inquiry schema:", err); // Log the error
      res.status(500).json({ isOk: false, message: "Internal Server Error" });
    }
  };
  
exports.listContactInquiry = async (req, res) => {
  try{
   const list = await contact.find().sort({ createdAt: -1 }).exec();
   res.json(list);
  }catch(err){
   console.log(err);
  }
 };
exports.listContactInquiryByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match,IsActive } = req.body;

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
                ContactPerson: { $regex: match, $options: "i" },
              },{
                Email: { $regex: match, $options: "i" },
              },{
                Mobile: { $regex: match, $options: "i" },
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

    const list = await contact.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.listContactInquiryByParamsdate = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match,IsActive,createdAt } = req.body;

    let query = [
      {
        $match: { IsActive: IsActive },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(createdAt.$gte),
            $lte: new Date(createdAt.$lte),
          },
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
                ContactPerson: { $regex: match, $options: "i" },
              },{
                Email: { $regex: match, $options: "i" },
              },{
                Mobile: { $regex: match, $options: "i" },
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

    const list = await contact.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.updatecontactinquiry=async(req,res)=>{
  try{
const updatedgetintouch=await contact.findByIdAndUpdate(req.params,req.body,{new:true});
res.status(200).send(updatedgetintouch)
  }
  catch(error){
    res.status(500).send(error)
  }
}

exports.getspecificcontactinquiry=async(req,res)=>{
  try{
    const spec=await contact.findOne({_id:req.params});
    res.status(200).send(spec)

  }
  catch(error){
    res.status(500).send(error)
  }
}

exports.removecontactinquiry=async(req,res)=>{
  try{
    const deletedgetintouch=await contact.findByIdAndDelete(req.params);
    res.status(200).send(deletedgetintouch);

  }
  catch(error){
    res.status(500).send(error)
  }
}









