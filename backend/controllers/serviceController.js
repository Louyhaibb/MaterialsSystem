const Service = require('../models/Service');
const User = require('../models/User');
const { getDistanceFromLatLonInKm } = require('../utils/utils');

exports.getServices = async (req, res) => {
    try {
        // Determine the filter based on user role
        const filter = req.user.role === 'company' 
            ? { company: req.user._id } 
            : {};
        
        let minDistance = 0;
        let maxDistance = Infinity;

        // Handling distance range filter
        if (req.query.distance) {
            const distanceRange = req.query.distance.split(',').map(Number);
            if (!isNaN(distanceRange[0])) minDistance = distanceRange[0];
            if (!isNaN(distanceRange[1])) maxDistance = distanceRange[1];
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ message: 'User not found' });

        const { latitude, longitude } = user;

        // Handling price range filter
        if (req.query.price) {
            const [minPrice, maxPrice] = req.query.price.split(',').map(Number);
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                filter.basePrice = { $gte: minPrice, $lte: maxPrice };
            }
        }

        // Handling service type filter
        if (req.query.serviceType) {
            const serviceTypes = req.query.serviceType.split(',');
            filter.serviceType = { $in: serviceTypes };
        }

        // Handling availability range filter
        if (req.query.availabilityStart && req.query.availabilityEnd) {
            const startDate = new Date(req.query.availabilityStart);
            const endDate = new Date(req.query.availabilityEnd);
            filter['availability.startDate'] = { $lte: endDate };
            filter['availability.endDate'] = { $gte: startDate };
        }

        // Fetch services and populate company details
        let services = await Service.find(filter).populate({
            path: 'company',
            select: '_id name email businessLicense'
        });

        // Filtering services by distance
        services = services.filter(service => {
            if (service.latitude != null && service.longitude != null) {
                const distance = getDistanceFromLatLonInKm(latitude, longitude, service.latitude, service.longitude);
                return distance >= minDistance && distance <= maxDistance;
            }
            return false;
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
            availability: {
                startDate: new Date(availability.startDate),
                endDate: new Date(availability.endDate)
            },
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
        availability: {
            startDate: new Date(availability.startDate),
            endDate: new Date(availability.endDate)
        },
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