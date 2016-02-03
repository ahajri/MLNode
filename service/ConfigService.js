//This file is user to populate reference collections like countries and languages, station list ...
var securityUtils = require('../utils/SecurityUtils.js'), 
assert = require('assert'), 
fs = require('fs'), 
async = require('async'), 
path = require('path');

var _this = this;
var _db = null;

// Document descriptors to pass to write().

module.exports.reloadRefData = function(req, res, next, db,qb) {

	_db = db;
	var jsonUser = req.body;
	var p = path.dirname(require.main.filename) + '\\data\\';
	
	var dataFiles = [];
	var fName;
	async.series([ function(callback) {
		var i = 1;
		fs.readdir(p, function(error, files) {
			if (error) {
				callback(error,null);
			}
			var fileCount = files.length;
			files.forEach(function(filename) {
				fName=filename;
				fs.readFile(p + filename, 'utf-8', function(err, content) {
					if (err) {
						callback(err,null);
					}
					dataFiles[i] = {
						uri : 'app/' + filename,
						contentType : 'application/json',
						content : JSON.parse(content),
					};
					if (i === fileCount) {
						callback();
					}
					i++;
				});
			});
		});
	}, 
	function(callback){
		//check collection exist
		//console.log(qb.collection('app/AllCards.json'));
//		db.documents.query( qb.where(qb.collection(fName));
		for (var int = 0; int < dataFiles.length; int++) {
			
//			console.log(JSON.stringify(dataFiles[int]))
			//db.documents.query( qb.where(qb.collection(collName));
		}
		callback();
	}
	,function(callback) {
		var names = '';
		dataFiles.map(function(el) {
			names += el.uri + ',';
			return el.uri;
		});
		_db.documents.remove(names).result(function(response) {
			callback();
		});
	}, function(callback) {
		_db.documents.write(JSON.stringify(dataFiles)).result(function(response) {
			console.log('Loaded the following documents:');
			response.documents.forEach(function(document) {
				console.log('  ' + document.uri);
			});
			callback(null,{"status":1,"msg":"Ref Data Reloaded"});
		}, function(error) {
			console.log(JSON.stringify(error, null, 2));
			callback(error, null);
		});

	} ], function(err, result) {
		if (result) {
			return res.status(200).json(msg);
		}
		if (err) {
			return res.status(500).json(err);
		}
	});

}
