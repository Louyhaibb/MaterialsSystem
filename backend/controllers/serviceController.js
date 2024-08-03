const Service = require('../models/Service');

exports.getServices = async (req, res) => {
    try {
        const filter = req.user.role == 'company' ? { company: req.user._id, status: 'pending' } : { status: 'pending' };
        let minDistance;
        let maxDistance;
        console.log(req.query)
        if (req.query.distance) {
            const distanceRange = req.query.distance?.split(',');
            minDistance = distanceRange[0];
            maxDistance = distanceRange[1];
        }
        const services = await Service.find(filter).populate({
            path: 'company',
            select: {
                _id: 1, name: 1, email: 1, businessLicense: 1
            },
        });
        return res.send(services);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: "error", message: err.message });
    }
};

exports.getOneService = async (req, res) => {
    const service = await Service.findOne({ _id: req.params.id });
    return res.send(service);
};

exports.createTransferService = async (req, res) => {
    const { serviceType, description, basePrice, availability } = req.body;
    const { lat, lng } = req.body.address.geometry.location;
    try {
        const newService = new Service({
            company: req.user._id,
            serviceType,
            description,
            basePrice,
            availability,
            address: req.body.address.formatted_address,
            latitude: lat,
            longitude: lng,
            status: 'pending'
        });

        await newService.save();
        return res.send({ status: "success", message: "Service created successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
};

exports.updateTransferService = async (req, res) => {
    const { serviceType, description, basePrice, availability } = req.body;
    let formatted_address = '';
    let latitude = null;
    let longitude = null;
    if (typeof req.body.address === 'object' && req.body.address.geometry) {
        const { lat, lng } = req.body.address.geometry.location;
        formatted_address = req.body.address.formatted_address;
        latitude = lat;
        longitude = lng;
    } else {
        const service = await Service.findById(req.params.id);
        if (service && service.address) {
            formatted_address = service.address;
            latitude = service.latitude;
            longitude = service.longitude;
        }
    }

    const serviceData = {
        serviceType,
        description,
        basePrice,
        availability,
        address: formatted_address,
        latitude,
        longitude,
    }
    try {
        const updatedService = await Service.findOneAndUpdate({ _id: req.params.id }, serviceData, {
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
    await Service.deleteOne({ _id: req.params.id });
    return res.send({ message: 'Service successfully deleted!' });
};