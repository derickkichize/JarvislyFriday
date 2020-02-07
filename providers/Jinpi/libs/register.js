const Debug	= require('../../../libs/Dialogs/Debug/Debug'),
      InpiDbTools = require('./inpiDbTools');

module.exports = function (json) {
  const magazineNumber = json['revista']['numero'],
        magazineDate   = json['revista']['data'],
        debug          = new Debug();
        inpiDb         = new InpiDbTools();

  debug.log('> coletando processos...');
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

      (async () => await inpiDb.createBrand(data));
      await h.sleep(3000);
    })();
  }

  (async () => await inpiDb.createPublication({ 
    magazineNumber: magazineNumber, 
    magazineDate	: magazineDate 
  }))();

	debug.info('revista '+magazineNumber+' publicada');
}