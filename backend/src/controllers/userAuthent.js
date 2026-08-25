const User=require('../models/user');
const validate=require('../utils/validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const redisClient=require('../Config/redis');


const register=async(req,res)=>{
    try{

        //validate the data
        validate(req.body);
        const {firstname,emailId,password}=req.body;

        req.body.password=await bcrypt.hash(password,10);
        req.body.role = 'user'; // Set default role
        //

        const user=await User.create(req.body);

        const token=jwt.sign({_id: user._id, emailId: user.emailId, role: 'user'},process.env.JWT_SECRET,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User registered successfully");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};


const adminRegister=async(req,res)=>{
    try{

        //validate the data
        validate(req.body);
        const {firstname,emailId,password}=req.body;

        req.body.password=await bcrypt.hash(password,10);
        req.body.role = 'admin'; // Set role for admin
        //

        const user=await User.create(req.body);

        const token=jwt.sign({_id: user._id, emailId: user.emailId, role: 'admin'},process.env.JWT_SECRET,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("Admin registered successfully");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};


const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({ _id: user._id, emailId: user.emailId , role: user.role}, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(200).send("Login successful");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

const logout = async (req, res) => {
   

    try{
        const token = req.cookies.token;

    const payload = jwt.decode(token);


    //then add that token to the redis bucket(blocklist)
   

    await redisClient.set(`token:${token}`, 'blocked');
    await redisClient.expire(`token:${token}`, payload.exp); // Set expiration time for the blocked token


    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("Logout successful");
    }
    catch(err){
        res.status(503).send("Error: " + err.message);
    }
   
};

const getProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Unauthorized: Please login first");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
    adminRegister
};

