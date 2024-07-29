const Company = require('../models/Company');
const Service = require('../models/Service');
const AdditionalService = require('../models/AdditionalService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { companyName, email, phone, businessLicense, password } = req.body;

  try {
    let company = await Company.findOne({ email });

    if (company) {
      return res.status(400).json({ errors: [{ msg: 'Company already exists' }] });
    }

    company = new Company({
      companyName,
      email,
      phone,
      businessLicense,
      password
    });

    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(password, salt);

    await company.save();

    const payload = {
      user: {
        id: company.id,
        role: 'company'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addTransferService = async (req, res) => {
    const { serviceType, description, basePrice, availability, locationsCovered } = req.body;
    const companyId = req.user.id;
  
    try {
      const newService = new Service({
        company: companyId,
        serviceType,
        description,
        basePrice,
        availability,
        locationsCovered,
      });
  
      const service = await newService.save();
      res.json(service);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
