const jwt=require('jsonwebtoken');
const User=require('../models/user');
const redisClient=require('../Config/redis');






const adminMiddleware = async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Unauthorized: Please login first");
        }

        const payload=jwt.verify(token,process.env.JWT_SECRET);
        
        const{_id}=payload;
        
        if(!_id){
            throw new Error("invalid token");

        }
         
         
        const result= await User.findById(_id);

        if(payload.role !== 'admin'){
            throw new Error("Unauthorized: Admin access required");
        }

        if(!result){
            throw new Error("User doesn't exist");
        }


        //Check redis blocklist


        const isBlocked=await redisClient.get(`token:${token}`);
        if(isBlocked){
            throw new Error("Token is blocked");
        }

        req.result=result;
        next();
    }
     catch(err){
        res.status(401).json({message:err.message});
    }
}

module.exports=adminMiddleware;

