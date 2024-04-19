const Subscribe=require("../../models/SubscribeNewspaper/SubscribeModel")
exports.createSubscribe = async (req, res) => {
  try {
    
    const add = await new Subscribe(req.body).save();
    // console.log("create country", addContact);
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error " });
  }
};
exports.updatesubscribers = async (req, res) => {
  try {
    
    const add = await Subscribe.findByIdAndUpdate(req.params,req.body,{new:true});
    // console.log("create country", addContact);
    res.status(200).json({ isOk: true, data: add, message: "" });
  } catch (err) {
    res.status(200).json({ isOk: false, message: "Error " });
  }
};
exports.listSubscribe = async (req, res) => {
  try{
   const list = await Subscribe.find().sort({ createdAt: -1 }).exec();
   res.json(list);
  }catch(err){
   console.log(err);
  }
 };
exports.listSubscribeByParams = async (req, res) => {
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
                email: { $regex: match, $options: "i" },
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

    const list = await Subscribe.aggregate(query);

    res.json(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteSubscribers=async(req,res)=>{
  try{
    
    const deletedsubscriber=await Subscribe.findByIdAndDelete(req.params);
    res.status(200).send(deletedsubscriber)

  }
  catch(error){
    res.status(500).send(error)
  }
}
exports.getSpecificSubscriber=async(req,res)=>{
try{
  const specificsubsriber=await Subscribe.findOne({_id:req.params});
  res.status(200).send(specificsubsriber)

}
catch(err){
  res.status(500).send(err);
}
}









