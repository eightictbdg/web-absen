const crypto = require('crypto');

const name = 'Gaming'

async function init(db) {
  var User = db.User;
  var Division = db.Division;

  var query_result = await Division.findOrCreate({where: {name: name}});
  var division_not_exist = query_result[1];
  var division = query_result[0];

  if (division_not_exist) {
    ;
  }

  return division;
}

async function get(db){
  var Division = db.Division;
  division = await Division.findOne({where: {name: name}});
  return division;
}

module.exports = {
  init,
  get
}