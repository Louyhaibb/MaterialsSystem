const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const { company, services, additionalServices, date, time, pickupLocation, dropOffLocation } = req.body;
  const clientId = req.user.id;

  try {
    const newOrder = new Order({
      client: clientId,
      company,
      services,
      additionalServices,
      date,
      time,
      pickupLocation,
      dropOffLocation,
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
