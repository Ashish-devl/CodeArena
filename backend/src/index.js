const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./Config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);

main()
    .then(async () => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })





