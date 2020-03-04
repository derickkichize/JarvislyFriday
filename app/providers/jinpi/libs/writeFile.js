const fs = require('fs');
const h = require('../../../../libs/helpers');

module.exports = async (brand) => {
  let _process = brand['revista']['processo'];
  
  for (let i in _process) {
    let data = JSON.stringify(_process[i]);
    await h.sleep(200);
    fs.writeFile('json/'+_process[i]['numero']+'.json', data, err => {
      (err) ? console.log(err) : console.log(_process[i]['numero']+' saved');
    })
  }
}