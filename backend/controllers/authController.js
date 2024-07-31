const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginValidation, registerValidation, registerCompanyValidation } = require('../utils/joiValidate');

const saltLength = 10;
let refreshTokens = [];

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '1d',
};

exports.register = async (req, res) => {

    // validate request
    const { error } = req.body.role == 'client' ? registerValidation(req.body) : registerCompanyValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    // check for unique user
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) { return res.status(400).send('Email already exists'); }

    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let userRegData = {};
    try {

        if (req.body.role == 'client') {
            userRegData = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                password: hashPassword,
                role: req.body.role,
            }
        } else {
            userRegData = {
                companyName: req.body.companyName,
                email: req.body.email,
                phone: req.body.phone,
                businessLicense: req.body.businessLicense,
                password: hashPassword,
                role: req.body.role,
            }
        }
        const user = new User(userRegData);

        // create an access token
        const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });
        const savedUser = await user.save();

        // remove password
        delete savedUser._doc.password;

        return res.send({ user: savedUser, accessToken, message: 'User successfully registered' });
    } catch (err) {
        console.error(err.message);
        return res.status(400).send(err);
    }
};

exports.login = async (req, res) => {
    // validate request
    const { error } = loginValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message); }

    const user = await User.findOneAndUpdate({ email: req.body.email }, { lastLogin: new Date() }).select('-__v');
    if (!user) { return res.status(400).send({ message: 'Email provided is not a registered account' }); }
    if (user.role == 'admin') {
        return res.status(400).send({ message: 'User role is not allowed' });
    }

    const tokenExpiry = req.body.remember ? '30d' : authConfig.expireTime;
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Username or password not found!' });

    try {
        // validation passed, create tokens
        const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenExpiry });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
        refreshTokens.push(refreshToken);

        // remove password
        delete user._doc.password;

        const userData = user;
        const response = {
            userData,
            accessToken,
            refreshToken,
            status: 'success'
        };
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        res.cookie('isLoggedIn', true, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        return res.send(response);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

exports.adminlogin = async (req, res) => {
    // validate request
    const { error } = loginValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message); }

    const user = await User.findOneAndUpdate({ email: req.body.email }, { lastLogin: new Date() }).select('-__v');
    if (!user) { return res.status(400).send({ message: 'Email provided is not a registered account' }); }
    if (user.role !== 'admin') {
        return res.status(400).send({ message: 'User role is not allowed' });
    }

    const tokenExpiry = req.body.remember ? '30d' : authConfig.expireTime;
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Username or password not found!' });

    try {
        // validation passed, create tokens
        const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenExpiry });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
        refreshTokens.push(refreshToken);

        // remove password
        delete user._doc.password;

        const userData = user;
        const response = {
            userData,
            accessToken,
            refreshToken,
            status: 'success'
        };
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        res.cookie('isLoggedIn', true, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        return res.send(response);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};
