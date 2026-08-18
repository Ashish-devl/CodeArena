const express = require('express');
const authRouter = express.Router();
const { register, login, logout, getProfile } = require('../controllers/userAuthent');

// Auth routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/getProfile', getProfile);

module.exports = authRouter;
