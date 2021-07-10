'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.all('create view vw_org as (select * from org where disabled=false)')
  return null;
};

exports.down = function(db) {
  db.all('drop view vw_org')
  return null;
};

exports._meta = {
  "version": 1
};
