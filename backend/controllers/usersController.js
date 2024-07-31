const User = require("../models/User");

exports.getPersonalMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');
        return res.send({ user: user });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie('refreshToken', '', { maxAge: 1 });
        res.cookie('isLoggedIn', '', { maxAge: 1 });
        return res.status(200).send({ message: 'Successfully logout' });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};