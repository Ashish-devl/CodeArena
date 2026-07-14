const User=require('../models/user');
const validate=require('../utils/validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const register=async(req,res)=>{
    try{

        //validate the data
        validate(req.body);
        const {firstname,emailId,password}=req.body;

        req.body.password=await bcrypt.hash(password,10);
        //
        const token=jwt.sign({emailId},process.env.JWT_SECRET,{expiresIn: 60*60});

        const user=await User.create(req.body);
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
}

