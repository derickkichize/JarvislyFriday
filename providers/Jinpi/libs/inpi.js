const	qs					= require('querystring');
			InpiTools  	= require('./inpiTools'),
			InpiDbTools = require('./inpiDbTools');
			Dialog			= require('./JinpiDialog');
			Debug				= require('../../../libs/Dialogs/Debug/Debug'),
			register 		= require('../libs/register'),
			parser  		= require('xml2json'),
			h						= require('../../../libs/helpers');
			
const Inpi = function() {

	/**
	 * @constant _vm
	 * @type  {Object}
	 * @description stores global scope data
	 */
	const _vm = this;

	return {

		/**
		 * @param {Object} config
		 * @return {Object} _vm.url
		 * @description set the date to download the inpi data list.
		 */
		setDate: (config) => {

			/**
			 * @constant config
			 * @type {Object}
			 * @description stores date data in an argument list
			 */
			const { startDate, endDate } = config;

			return _vm.url = { 
				host: 		 'http://revistas.inpi.gov.br', 
				path: 		 '/rpi/busca/data?',
				startDate:   'revista.dataInicial='+qs.escape(config.startDate)+'&',
				endDate: 	 'revista.dataFinal='+qs.escape(config.endDate)+'&',
				type: 		 'revista.tipoRevista.id=5' 
			};
		},

		/**
		 * @param {void} 
		 * @description update inpi brand magazines.
		 */
		update: async function() {
			
			const inpiTools = new InpiTools(),
						inpiDb    = new InpiDbTools(),
						debug     = new Debug,
						list = await inpiTools.getList(Object.values(_vm.url).join(''));

			try {

				if(!_vm.hasOwnProperty('url')) 
					 throw new Error('url is not set');

				Dialog();

				for ( let prop in list ) {
					debug.info('revista '+list[prop].numero);

					if(! await inpiDb.has(list[prop].numero)) {
						debug.log(list[prop].nomeArquivoEscritorio);
						let zippedFile = await inpiTools.getFile(_vm.url.host+'/txt/'+list[prop].nomeArquivoEscritorio);
						debug.log('descompactando '+list[prop].nomeArquivoEscritorio);
						let xml  = await h.unzip(zippedFile),
								json = JSON.parse(parser.toJson(xml.toString()));
						register(json);
					} else {
						debug.warn('ignorando revista '+list[prop].numero+' revista ja esta publicada');
					}

					debug.log('-------------------------------------------------');
				}
			} catch (error) {
				debug.warn(error.message);
			}
		}
	};
}

module.exports = Inpi;