const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define the PoiMarker schema
const schemaPoiMarker = new Schema({
    id: String,
    type: String,
    properties: Schema.Types.Mixed, // or define a more specific structure if desired
    geometry: {
        type: { type: String, enum: ['Point', 'Polygon'], required: true },
        coordinates: Schema.Types.Mixed
    },
    rating: Number
});

// Define the GroupedMarkers schema
const schemaGroupedMarkers = new Schema({
    name: String,
    markers: [schemaPoiMarker],
    groupRating: Number
});

// Define the main LocationReport schema
const schemaLocationReport = new Schema({
    userId: String,
    location: {
        coordinates: [Number]
    },
    categories: {
        Zdravje: { type: schemaGroupedMarkers, default: {} },
        Okolje: { type: schemaGroupedMarkers, default: {} },
        Transport: { type: schemaGroupedMarkers, default: {} },
        Izobrazevanje: { type: schemaGroupedMarkers, default: {} }
    },
    overall_rating: Number,
    created_at: { type: Date, default: Date.now }
});

// Validation for the geometry
schemaPoiMarker.pre('validate', function(next) {
    if (this.geometry.type.toString() === 'Point' && !Array.isArray(this.geometry.coordinates)) {
        next(new Error('Point geometry must have an array of coordinates.'));
    } else if (this.geometry.type.toString() === 'Polygon' && !(Array.isArray(this.geometry.coordinates) && Array.isArray(this.geometry.coordinates[0]))) {
        next(new Error('Polygon geometry must have an array of arrays of coordinates.'));
    } else {
        next();
    }
});

mongoose.model('LocationReport', schemaLocationReport, 'LocationReport');