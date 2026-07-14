const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    firstname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:20
    },
    lastname:{
        type:String,
        required:true,
        minlength:3,
        maxlength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim=true,
        lowercase:true,
        immutable:true
    },
    age:{
        type:Number,
        required:true,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    problemSolved:{
        type:[String],
        default:[]
    },
    password:{
        type:String,
        required:true,  
        minlength:8
    },
},{
    timestamps:true
});

const User=mongoose.model("User",userSchema);
module.exports=User;