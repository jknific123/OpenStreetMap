const mongoose = require('mongoose');
const LocationReport = mongoose.model('LocationReport');


const saveLocationReport = async (req, res) => {
    console.log('Saving location report: ', req.body)
    try {
        const report = new LocationReport({
            reportName: req.body.reportName,
            reportType: req.body.reportType,
            userId: req.body.userId,
            minDistance: req.body.minDistance,
            maxDistance: req.body.maxDistance,
            location: req.body.location,
            categories: req.body.categories,
            savedPreferences: req.body.savedPreferences,
            number_of_selected_categories: req.body.number_of_selected_categories,
            overall_rating: req.body.overall_rating
        });
        await report.save();
        res.status(201).send({ success: true, message: 'Report saved successfully', report });
    } catch (error) {
        console.log('Error occurred when creating new location report: ', error);
        res.status(500).send({ success: false, message: error.message });
    }
}

const getLocationReportsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reports = await LocationReport.find({ userId: userId });
        res.status(200).json(reports);
    } catch (error) {
        console.log('Error occurred when fetching location reports: ', error);
        res.status(500).send({ message: error.message});
    }
}

const getLocationReportByReportId = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const report = await LocationReport.findById(reportId);
        res.status(200).json(report);
    } catch (error) {
        console.log('Error occurred when fetching location report for id: ', error);
        res.status(500).send({ message: error.message});
    }
}

const locationReportDelete = (req, res) => {
    LocationReport.findOneAndRemove({_id: req.params.id}, function(err, locationReport) {
            if (err || !locationReport) {
                res.status(404).json({message: err});
            }
            else {
                console.log(`Successfully removed locationReport wit id ${req.params.id}`);
                res.status(200).json(locationReport);
            }
        });
};

module.exports = {
    saveLocationReport,
    getLocationReportsForUser,
    locationReportDelete,
    getLocationReportByReportId
}