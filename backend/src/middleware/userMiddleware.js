const jwt=require('jsonwebtoken');






const userMiddleware = async(req,res,next)=>{
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

        if(!result){
            throw new Error("User doesn't exist");
        }


        //Check redis blocklist
    }
     catch{
        
    }
}