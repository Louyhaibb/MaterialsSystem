const Service = require('../models/Service');
const { ObjectId } = require('mongodb');

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ company: req.user._id });
        return res.send(services);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: "error", message: err.message });
    }
};

exports.createTransferService = async (req, res) => {
    const { serviceType, description, basePrice, availability, location } = req.body;

    try {
        const newService = new Service({
            company: req.user._id,
            serviceType,
            description,
            basePrice,
            availability,
            location,
        });

        await newService.save();
        return res.send({ status: "success", message: "Service created successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
};

exports.updateTransferService = async (req, res) => {
    const updateValues = req.body;

    try {
        const updatedService = await Service.findOneAndUpdate({ _id: req.params.id }, updateValues, {
            new: true,
        });

        if (!updatedService) {
            return res.status(404).send({ message: 'Service not found' });
        }

        return res.send({ status: "success", message: "Service updated successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
};

exports.deleteTransferService = async (req, res) => {
    try {
        await Service.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).send({ status: "error", message: "Service not found!" });
        }
        return res.send({ status: "success", message: "Service deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
};