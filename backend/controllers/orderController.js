const Order = require('../models/Order');

exports.getOrdersForCompany = async (req, res) => {
  const companyId = req.user.id;

  try {
    const orders = await Order.find({ company: companyId }).populate('client', ['name', 'email']).populate('services').populate('additionalServices');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStats = async (req, res) => {
  const companyId = req.user.id;

  try {
    const totalOrders = await Order.countDocuments({ company: companyId });
    const pendingOrders = await Order.countDocuments({ company: companyId, status: 'Pending' });
    const completedOrders = await Order.countDocuments({ company: companyId, status: 'Completed' });

    res.json({ totalOrders, pendingOrders, completedOrders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
