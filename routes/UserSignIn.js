const express = require("express");

const router = express.Router();

const {CreateUser,LoginUser,listUser,listSignInUser,deleteUser,updateUser,getspecificuser} = require("../controllers/UserSignIn/UserSignin");
const catchAsync = require("../utils/catchAsync");

router.post('/auth/add/addUser',CreateUser);
router.post('/auth/login', LoginUser);
router.post('/list/listUser',catchAsync(listUser) )
router.delete('/auth/delete/deleteuser/:_id',catchAsync(deleteUser) )
router.get('/listonly/listUser',catchAsync(listSignInUser))
router.put('/auth/update/user/:_id',catchAsync(updateUser))
router.get('/auth/get/user/:_id',catchAsync(getspecificuser))
module.exports = router;