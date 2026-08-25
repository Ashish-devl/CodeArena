const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./Config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./Config/redis');

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);




const intiallizeConnection = async () => {
    try {
            await Promise.all([main(), redisClient.connect()]);
            console.log("Connected to MongoDB and Redis successfully");

            app.listen(process.env.PORT || 3000, () => {
             console.log(`Server is running on port ${process.env.PORT || 3000}`);
            })
    }
    catch (err) {
        console.error("Error connecting to MongoDB or Redis:", err);
    }
}


intiallizeConnection();







