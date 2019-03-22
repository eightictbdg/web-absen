module.exports.name = 'default_role';

module.exports.callback = async function(db) {
  var Config = db.Config;
  var default_role = await require('../roles/initiate').init(db);

  var query_result = await Config.findOne({where: {name: module.exports.name}});

  query_result.value = default_role.id;
  query_result.save();
}