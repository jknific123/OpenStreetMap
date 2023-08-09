const mongoose = require('mongoose');
const LocationReport = mongoose.model('LocationReport');


const saveLocationReport = async (req, res) => {
    console.log('Saving location report: ', req.body)
    try {
        const report = new LocationReport({
            reportName: req.body.reportName,
            userId: req.body.userId,
            location: req.body.location,
            categories: req.body.categories,
            overall_rating: req.body.overall_rating
        });
        await report.save();
        res.status(201).send({ success: true, message: 'Report saved successfully', report });
    } catch (error) {
        console.log('Error occurred when creating new location report: ', error);
        res.status(500).send({ success: false, message: error.message });
    }
}


module.exports = {
    saveLocationReport
}