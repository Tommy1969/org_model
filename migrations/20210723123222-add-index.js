"use strict";

var dbm;
var type;
var seed;

const TABLE = "org";

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.addIndex(TABLE, "parent_index", ["parent"], false);
  db.addIndex(TABLE, "parent_name_unique", ["parent", "name"], true);
  return null;
};

exports.down = function (db) {
  db.removeIndex(TABLE, "parent_name_unique");
  db.removeIndex(TABLE, "parent_index");
  return null;
};

exports._meta = {
  version: 1,
};
