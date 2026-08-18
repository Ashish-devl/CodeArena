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

        const user=await User.create(req.body);

        const token=jwt.sign({_id: user._id, emailId: user.emailId},process.env.JWT_SECRET,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User registered successfully");
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
        const token = jwt.sign({ _id: user._id, emailId: user.emailId }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(200).send("Login successful");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

const logout = async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) });
    res.status(200).send("Logged out successfully");
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
    getProfile
};

