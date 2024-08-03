const User = require("../models/User");
const bcrypt = require('bcrypt');

const saltLength = 10;

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

exports.getUsers = async (req, res) => {
    const roleFilter = req.query.role !== '' && typeof req.query.role !== 'undefined' ? { role: req.query.role } : {};
    const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
    const filterParams = {
        $and: [
            {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } },
                ],
            },
            roleFilter
        ],
    };
    const users = await User.find(filterParams).select('-password -__v');

    return res.send(users);
};

exports.deleteUser = async (req, res) => {
    await User.deleteOne({ _id: req.params.id });
    return res.send({ message: 'User successfully deleted!' });
};

exports.getOneUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    return res.send(user);
};


exports.uploadAvatarFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');

        return res.send({ imageUri });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

exports.uploadProfileFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }

        const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
        const updateAvatar = await User.findOneAndUpdate({ _id: req.user._id }, { avatar: imageUri }, { new: true }).select('-password -__v');

        return res.send({ updateAvatar: updateAvatar })
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

exports.createUser = async (req, res) => {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) { return res.status(400).send('Email already exists'); }

    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let userRegData = {};
    try {
        const { lat, lng } = req.body.address.geometry.location;
        if (req.body.role == 'client' || req.body.role == 'admin') {
            userRegData = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address.formatted_address,
                latitude: lat,
                longitude: lng,
                password: hashPassword,
                role: req.body.role,
                avatar: req.body.avatar,
            }
        } else {
            userRegData = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                businessLicense: req.body.businessLicense,
                address: req.body.address.formatted_address,
                latitude: lat,
                longitude: lng,
                password: hashPassword,
                role: req.body.role,
                avatar: req.body.avatar,
            }
        }
        const user = new User(userRegData);
        const savedUser = await user.save();

        // remove password
        delete savedUser._doc.password;

        return res.send({ user: savedUser, message: 'User successfully created' });
    } catch (err) {
        console.error(err.message);
        return res.status(400).send(err);
    }
};

exports.updateUser = async (req, res) => {
    let userRegData = {};

    try {
        const { name, email, phone, role, avatar, businessLicense } = req.body;
        let formatted_address = '';
        let latitude = null;
        let longitude = null;

        if (typeof req.body.address === 'object' && req.body.address.geometry) {
            const { lat, lng } = req.body.address.geometry.location;
            formatted_address = req.body.address.formatted_address;
            latitude = lat;
            longitude = lng;
        } else {
            // Ensure previous address data does not get removed
            const user = await User.findById(req.params.id);
            if (user && user.address) {
                formatted_address = user.address;
                latitude = user.latitude;
                longitude = user.longitude;
            }
        }

        if (role == 'client' || role == 'admin') {
            userRegData = {
                name,
                email,
                phone,
                address: formatted_address,
                latitude,
                longitude,
                role,
                avatar,
            };
        } else {
            userRegData = {
                name,
                email,
                phone,
                businessLicense,
                address: formatted_address,
                latitude,
                longitude,
                role,
                avatar,
            };
        }

        const updateUser = await User.findOneAndUpdate({ _id: req.params.id }, userRegData, {
            new: true,
        }).select('-__v');

        // remove password
        delete updateUser._doc.password;

        return res.send({ user: updateUser, message: 'User successfully updated' });
    } catch (err) {
        console.error(err.message);
        return res.status(400).send(err);
    }
};


