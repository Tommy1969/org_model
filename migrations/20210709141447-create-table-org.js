'use strict';

var dbm;
var type;
var seed;

const TABLE = 'org'

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
  db.createTable(TABLE, {
    id: {type: 'serial', primaryKey: true},
    parent: {type: 'int', foreignKey: {
      name: 'parent_organization_id', table: 'org', mapping: 'id',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }
    }},
    category: {type: 'int', notNull: true, defaultValue: 1},
    name: {type: 'text', notNull: true},
    disabled: {type: 'boolean', defaultValue: false},
    created_at: {type: 'timestamptz', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')},
    updated_at: {type: 'timestamptz', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')}
  }, () => {
    db.addIndex(TABLE, 'parent_index', ['parent'], false);
    db.addIndex(TABLE, 'parent_name_unique', ['parent', 'name'], true);
  });
  return null;
};

exports.down = function(db) {
  db.dropTable(TABLE);
  return null;
};

exports._meta = {
  "version": 1
};
