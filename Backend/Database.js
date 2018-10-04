const sqlite = require('sqlite3');
const errorHandler = require('./ErrorHandler')

const database = new sqlite.Database(".database.sqlite");
exports.db = database;

exports.setup = function()
{
}