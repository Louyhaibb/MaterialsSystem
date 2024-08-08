const Order = require("../models/Order");
const User = require("../models/User");

// Helper function to get date range for daily statistics
const getDateRange = (period) => {
    const now = new Date();

    if (period === 'daily') {
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
            daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        };
    }
};

// Generic function to aggregate data
const aggregateData = async (Model, start, end, field, period) => {
    const groupByFormat = '%Y-%m-%d';
    const result = await Model.aggregate([
        { $match: { [field]: { $gte: start, $lte: end } }},
        { $group: { _id: { $dateToString: { format: groupByFormat, date: `$${field}` }}, count: { $sum: 1 }}},
        { $sort: { _id: 1 }}
    ]);

    return result;
};

exports.getStatistics = async (req, res) => {
    try {
        const period = 'daily';
        const { start, end, daysInMonth } = getDateRange(period);

        // Aggregate data for each statistic
        const transfersCompleted = await aggregateData(Order, start, end, 'orderDate', period);
        const revenueGenerated = await Order.aggregate([
            { $match: { status: 'Completed', orderDate: { $gte: start, $lte: end } }},
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' }}, totalRevenue: { $sum: '$totalPrice' }}},
            { $sort: { _id: 1 }}
        ]);
        const mostPopularServices = await Order.aggregate([
            { $match: { status: 'Completed', orderDate: { $gte: start, $lte: end } }},
            { $unwind: '$services' },
            { $group: { _id: '$services', count: { $sum: 1 }}},
            { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' }},
            { $unwind: '$service' },
            { $sort: { count: -1 }},
            { $limit: 10 }
        ]);
        const userLogs = await aggregateData(User, start, end, 'lastLogin', period);

        const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1).toISOString().split('T')[0]);

        const organizeCounts = (stats, key = 'count') => {
            const map = {};
            stats.forEach(stat => map[stat._id] = stat[key]); 
            return dates.map(date => map[date] || 0);
        };

        const transferCounts = organizeCounts(transfersCompleted);
        const revenueCounts = organizeCounts(revenueGenerated, 'totalRevenue');
        const serviceCounts = mostPopularServices;
        const userActivityCounts = organizeCounts(userLogs);

        res.status(200).send({
            period,
            dates,
            transferCounts,
            revenueCounts,
            serviceCounts,
            userActivityCounts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};
