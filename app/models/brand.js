const mongoose = require('../../config/database/database');

const niceClass = {
	code: String,
	especification: String,
	status: String
}
const BrandSchema = new mongoose.Schema({
	magazineNumber: { type: String, required: true },
	magazineDate: { type: String, required: true },
	processNumber: { type: String, required: true },
	dispatches: { type: Object },
	holders: { type: Object },
	attorney: { type: String },
	overstands: { type: Object },
	depositDate: { type: String },
	grantDate: { type: String },
	effectiveDate: { type: String },
	viennaClasses: { type: Object },
	brand: { type: Object },
	handout: { type: Object },
	unionistPriority: { type: Object },
	listNiceClass: [niceClass]
}, { versionKey: false });

const Brand = mongoose.model('Brands', BrandSchema);

module.exports = Brand;
