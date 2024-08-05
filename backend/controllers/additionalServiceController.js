const AdditionalService = require("../models/AdditionalService");

exports.getAdditionalServices = async (req, res) => {
    try {
        const additionalServices = await AdditionalService.find({ company: req.user._id }).populate({
            path: 'company',
            select: '_id name email businessLicense'
        }).populate({
            path: 'service',
            select: '_id serviceType'
        });

        return res.send(additionalServices);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: "error", message: err.message });
    }
};


exports.getOneAdditionalService = async (req, res) => {
    const additionalService = await AdditionalService.findOne({ _id: req.params.id });
    return res.send(additionalService);
};

exports.createAdditionalService = async (req, res) => {
    const { serviceName, description, unitPrice, service } = req.body;
    try {
        const newAdditionalService = new AdditionalService({
            company: req.user._id,
            serviceName,
            description,
            unitPrice,
            service,
        });

        await newAdditionalService.save();
        return res.send({ status: "success", message: "Additional Service created successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
};

exports.updateAdditionalService = async (req, res) => {
    const { serviceName, description, unitPrice, service } = req.body;

    const additionalServiceData = {
        serviceName,
        description,
        unitPrice,
        service
    }
    try {
        const updatedAdditionalService = await AdditionalService.findOneAndUpdate({ _id: req.params.id }, additionalServiceData, {
            new: true,
        });

        if (!updatedAdditionalService) {
            return res.status(404).send({ message: 'Additional Service not found' });
        }

        return res.send({ status: "success", message: "Additional Service updated successfully!" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
};

exports.deleteAdditionalService = async (req, res) => {
    await AdditionalService.deleteOne({ _id: req.params.id });
    return res.send({ message: 'Additional Service successfully deleted!' });
};