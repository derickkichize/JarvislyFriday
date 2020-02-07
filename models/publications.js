const mongoose = require('../database/database.js');

const PublicationSchema = new mongoose.Schema({
	magazineNumber: { type: String, required: true},
	magazineDate	: { type: String, required: true},
	migrationDate	: { type: Date, default: Date.now }
},{ versionKey: false });

const Publications = mongoose.model('Publications', PublicationSchema);

module.exports = Publications;
