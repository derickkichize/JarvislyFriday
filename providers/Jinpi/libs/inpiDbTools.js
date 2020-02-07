const Brand 			 = require('../../../models/brand'),
			Publications = require('../../../models/publications');

/**
 * @class InpiDBTools
 * @description Database manipulation tools.
 */
const InpiDbTools = function() {
	return {
		/**
		 * @param {Object}
		 * @return {Promise}
		 * @description creates a brand record in database.
		 */
		createBrand: (brand) => {
			return new Promise(async resolve => await resolve(Brand.create(brand)));
		},
		/**
		 * @param {Object}
		 * @return {Promise}
		 * @description creates a publication record in database.
		 */
		createPublication: (pub) => {
			return new Promise(async resolve => await resolve(Publications.create(pub)));
		},
		/**
		 * @param {Object}
		 * @return {Promise}
		 * @description checks if a publication record exists.
		 */
		has: (find) => {
			return new Promise(async resolve => {
				if (await Publications.findOne({ magazineNumber: find }) == null)
					return resolve(false);
				return resolve(true);
			});
		}
	};
}

module.exports = InpiDbTools;