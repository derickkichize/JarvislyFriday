const Debug	      = require('../../../libs/Dialogs/Debug/Debug'),
      h           = require('../../../libs/helpers'),
      InpiDbTools = require('./inpiDbTools');

module.exports = async function (json) {
  const magazineNumber = json['revista']['numero'],
        magazineDate   = json['revista']['data'],
        debug          = new Debug();
    debug.log('revista '+magazineNumber);
    console.log('--------------------------------------------------');
    for  (let i in json['revista']['processo']) { 
      await InpiDbTools().createBrand({
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
      });
      debug.info('processo '+json['revista']['processo'][i]['numero']+' migrado');
      await h.sleep(300);
    }

    await h.sleep(3000);
    await InpiDbTools().createPublication({ 
      magazineNumber: magazineNumber, 
      magazineDate	: magazineDate 
    });
    debug.info('revista '+magazineNumber+' publicada');
}