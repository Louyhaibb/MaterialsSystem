const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getCompanyDetails = async (req, res) => {
    const companyId = req.params.companyId;
    try {
        const company = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(companyId) } },
            {
                $lookup: {
                    from: 'services', // The collection name in the database
                    localField: '_id',
                    foreignField: 'company',
                    as: 'services'
                }
            },
            {
                $lookup: {
                    from: 'additionalservices', // The collection name in the database
                    let: { serviceIds: '$services._id' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$service', '$$serviceIds'] } } }
                    ],
                    as: 'allAdditionalServices'
                }
            },
            {
                $addFields: {
                    services: {
                        $cond: {
                            if: { $isArray: '$services' },
                            then: {
                                $map: {
                                    input: '$services',
                                    as: 'service',
                                    in: {
                                        $mergeObjects: [
                                            '$$service',
                                            {
                                                additionalServices: {
                                                    $filter: {
                                                        input: '$allAdditionalServices',
                                                        as: 'additionalService',
                                                        cond: {
                                                            $eq: ['$$additionalService.service', '$$service._id']
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            else: []
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    latitude: 1,
                    longitude: 1,
                    avatar: 1,
                    services: {
                        $cond: {
                            if: { $gt: [{ $size: '$services' }, 0] },
                            then: '$services',
                            else: []
                        }
                    }
                }
            }
        ]);

        if (!company || company.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).send(company[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

exports.orderRequest = async (req, res) => {
    const { services, additionalServices, totalPrice, orderDate, company } = req.body;
    const { lat, lng } = req.body.address.geometry.location;
    const orderRequestData = {
        services: services,
        additionalServices: additionalServices,
        totalPrice: totalPrice,
        address: req.body.address.formatted_address,
        latitude: lat,
        longitude: lng,
        orderDate: orderDate,
        client: req.user._id,
        company: company
    };
    try {
        const order = new Order(orderRequestData);
        await order.save();

        return res.send({ message: "Order requrestd Successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

exports.getClientOrders = async (req, res) => {
    try {
        const statusFilter = req.query.status !== '' && typeof req.query.status !== 'undefined' ? { status: req.query.status } : {};
        const clientFilter = { client: req.user._id };
        const filterParams = {
            ...statusFilter,
            ...clientFilter,
        };
        const orders = await Order.find(filterParams).populate('client', ['name', 'email']).populate('company', ['name', 'email']).populate('services').populate('additionalServices');
        return res.send(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getCompanyOrders = async (req, res) => {
    try {
        const statusFilter = req.query.status !== '' && typeof req.query.status !== 'undefined' ? { status: req.query.status } : {};
        const clientFilter = { company: req.user._id };
        const filterParams = {
            ...statusFilter,
            ...clientFilter,
        };
        const orders = await Order.find(filterParams).populate('client', ['name', 'email']).populate('company', ['name', 'email']).populate('services').populate('additionalServices');
        return res.send(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getOneOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('client').populate('company').populate('services').populate('additionalServices');
        return res.send(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();
        return res.send({ message: 'Order Status changed Successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};
