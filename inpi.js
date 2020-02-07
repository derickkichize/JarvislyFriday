const request 		 = require('request'),
			http    		 = require('http'),
			fs					 = require('fs'),
			AdmZip			 = require('adm-zip'),
			qs					 = require('querystring'),
			parser  		 = require('xml2json'),
			Brand		 	 	 = require('./models/brand.js'),
			Publications = require('./models/publications.js'),
			h			 			 = require('./libs/helpers.js');

async function inpiUpdate(config) {

	const { startDate, endDate} = config,
	url = { 
		host: 		 'http://revistas.inpi.gov.br', 
		path: 		 '/rpi/busca/data?',
		startDate: 'revista.dataInicial='+qs.escape(config.startDate)+'&',
		endDate: 	 'revista.dataFinal='+qs.escape(config.endDate)+'&',
		type: 		 'revista.tipoRevista.id=5' 
	};

	try {
		const list = await inpiGet({ url: Object.values(url).join(''), encoding: 'utf-8' }),
					magazines = JSON.parse(list);

		console.clear();
		console.log('Jinpi v1.0 \n\n');

		for (let prop in magazines ) {
			console.log('---------------------------------------------------------');
			console.log('# revista: '+magazines[prop].numero);
			await h.sleep(3000);
			if(! await hasData(magazines[prop].numero) ) {
				console.log('> baixando '+magazines[prop].nomeArquivoEscritorio+'...');
				let xml = await inpiGet({ url: url.host+'/txt/'+magazines[prop].nomeArquivoEscritorio, encoding: null }, false);
				await prepareProcess(xml);
			} else {
				console.warn('> ignorando revista '+magazines[prop].numero+' revista ja esta publicada');
			}
		}

		console.log('# banco de dados atualizado');
	} catch (error) {
		console.warn('#error >'+error);
	}

}

function inpiGet(config, list = true) {
	const { url, encoding } = config;
	return new Promise((resolve, reject) => {
		request.get({ url: config.url, encoding: config.encoding }, (error, response, body) => {	
			if (error) return reject (error);		

			if ( list == true ) 
				return resolve(body);

			console.log('> descompactando...')
			let zip 			 = new AdmZip(body),
					zipEntries = zip.getEntries();

			for ( let entry in zipEntries ) {
				if(zipEntries[entry].entryName.substr(-3) === 'xml') {
					console.log('> arquivo em memoria: '+zipEntries[entry].entryName+' ['+h.readableBytes(zipEntries[entry].header.size)+']');
					return resolve(zip.readAsText(zipEntries[entry]));
				}
			}
		});				 
	});
}

function dbCreateBrand(brand) {
	return new Promise( async resolve => await resolve(Brand.create(brand)));
}

function dbCreatePublication(pub) {
	console.log('> publicando: '+pub.magazineNumber);
	return new Promise( async resolve => await resolve(Publications.create(pub)));
}


function hasData(find) {
	return new Promise( async resolve => { 
		if( await Publications.findOne({ magazineNumber : find }) == null) { 
			resolve(false);
		}
		resolve(true);
	});
}

function prepareProcess(xml) {
	let json 					 = JSON.parse(parser.toJson(xml)),
			magazineNumber = json['revista']['numero'],
			magazineDate   = json['revista']['data'];

	console.log('> coletando processos...');
	
	for (let i in json['revista']['processo']) {
		(async () => {

			let data = await {
				magazineNumber	 : magazineNumber,
				magazineDate		 : magazineDate,
				processNumber 	 : json['revista']['processo'][i]['numero'],
				dispatches	  	 : json['revista']['processo'][i]['despachos'],
				holders					 : json['revista']['processo'][i]['titulares'],
				attorney				 : json['revista']['processo'][i]['procurador'],
				overstands			 : json['revista']['processo'][i]['sobrestadores'],
				depositDate	 		 : json['revista']['processo'][i]['data-deposito'],
				grantDate				 : json['revista']['processo'][i]['data-concessao'],
				effectiveDate 	 : json['revista']['processo'][i]['data-vigencia'],
				niceClass		  	 : json['revista']['processo'][i]['classe-nice'],
				viennaClasses 	 : json['revista']['processo'][i]['classes-vienna'],
				brand						 : json['revista']['processo'][i]['marca'],
				handout					 : json['revista']['processo'][i]['apostila'],
				unionistPriority : json['revista']['processo'][i]['prioridade-unionista'],
				listNiceClass    : json['revista']['processo'][i]['lista-classe-nice'],
			};

			(async () => await dbCreateBrand(data));
			await h.sleep(3000);
		})();
	}		

	(async () => await dbCreatePublication({ magazineNumber: magazineNumber, magazineDate	: magazineDate }))();
	console.log('> revista '+magazineNumber+' publicada');
}

inpiUpdate({startDate: '01/01/2000', endDate: '05/02/2020'});
