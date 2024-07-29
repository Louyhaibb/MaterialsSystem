const Company = require('../models/Company');
const Client = require('../models/Client');
const User = require('../models/User');

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('user', ['name', 'email']);
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('user', ['name', 'email']);
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
