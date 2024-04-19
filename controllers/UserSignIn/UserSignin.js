const signin = require("../../models/UserSignIn/UserSignIn");

// const CreateUser = async (req, res) => {
//   try {
//     // const existingEmail = await signin.findOne({ email: req.body.email });
//     // const existingMobile = await signin.findOne({
//     //   mobile_no: req.body.mobile_no,
//     // });

//     // if (existingEmail) {
//     //   return res.status(500).json({
//     //     isOK: false,
//     //     field: "email",
//     //     message: "Email already exists!",
//     //   });
//     // }

//     // if (existingMobile) {
//     //   return res.status(501).json({
//     //     isOK: false,
//     //     field: "mobile_no",
//     //     message: "Mobile number already exists!",
//     //   });
//     // }

//     const newUser = await signin.create(req.body);
//     res.status(200).json({
//       isOK: true,
//       data: newUser,
//     });
//   } catch (error) {
//     console.log("Error creating new user", error);
//     return res.status(500).send("Create new user failed");
//   }
// };
const CreateUser = async (req, res) => {
  try {
    const newUser = await signin.create(req.body);
    res.status(200).json({
      isOK: true,
      data: newUser,
    });
  } catch (error) {
    console.log("Error creating new user", error);
    return res.status(500).send("Create new user failed");
  }
};
const deleteUser=async(req,res)=>{
  try{
    const _id=req.params;
    const deleted=await signin.findByIdAndDelete(_id);
    res.status(200).json(deleted);

  }
  catch(error){
    console.log("Error Deletting User",error);
    return res.status(500).send("Delete User Failed")
  }
}

const listSignInUser = async (req, res) => {
  try {
    const list = await signin.find().sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const LoginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const existingUser = await signin.findOne({ email });
  
      // Check if the user exists and the password is correct
      if (existingUser && existingUser.password === password) {
        // You can also perform additional checks, such as verifying the user's role
  
        // For simplicity, you can just send a success response
        res.status(200).json({
          isOK: true,
          data: existingUser,
          message: "Login successful",
        });
      } else {
        res.status(401).json({
          isOK: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        isOK: false,
        message: "Internal server error",
      });
    }
  };
  
 const listUser = async (req, res) => {
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
                  email: { $regex: match, $options: "i" },
                }, {
                  firstName: { $regex: match, $options: "i" },
                } ,{
                  lastName: { $regex: match, $options: "i" },
                }, {
                  password: { $regex: match, $options: "i" },
                },{
                  mobile_no: { $regex: match, $options: "i" },
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
  
      const list = await signin.aggregate(query);
  
      res.json(list);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  const updateUser=async(req,res)=>{
    try{
      const user =await signin.findByIdAndUpdate(req.params,req.body,{new:true});
      res.status(200).send(user);
    }
    catch(error){
      console.log("Error While Updating:",error);
      res.status(500).send("Error While Updating")
    }
    
  }

  const getspecificuser=async(req,res)=>{
    try{
const specificuser=await signin.findOne({_id:req.params}).exec();
res.status(200).send(specificuser);

    }
    catch(error){
      console.log("Error in Fetching Specific User",error);
      res.status(500).send(error)
    }
  }
module.exports = { CreateUser,LoginUser,listUser,listSignInUser,deleteUser,updateUser,getspecificuser };