var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended : true
})); 


util = require('util'), 
fs = require('fs'), 
assert = require('assert'),
request = require('request'), 
Glob = require('glob').Glob,
cluster = require('cluster'), 
mysql = require('mysql'),
Converter = require("csvtojson").Converter,
nodemailer = require("nodemailer"), 
json = require('json-update'),
uuid = require('node-uuid'),
		
//Services
securityUtils = require('./utils/SecurityUtils.js'),
configServcice = require('./service/ConfigService.js'),
//Configuration
config = require('./config.js');
//MarkLogic
var marklogic = require('marklogic');
var qb = marklogic.queryBuilder;
var _db = null;


// run server
var server = app.listen(8686, function() {
	if (cluster.isMaster) {
		console.log('Master process ...');
	}
	if (cluster.isWorker) {
		console.log('Worker process ...');
	}

	_db = marklogic.createDatabaseClient(config.connInfo);

	var cpuCount = require('os').cpus().length;
	console.log('CPU nodes = ' + cpuCount);
	var host = server.address().address;
	var port = server.address().port;
	console.log("REST Service is running on http://%s:%s", host, port);
});

//
function supportCrossOriginScript(req, res, next) {
	res.status(200);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, DELETE, PUT, HEAD");
	next();
}

app.get('/reloadRefData/', supportCrossOriginScript, function(req, res, next) {
	configServcice.reloadRefData(req, res, next, _db,qb);
});

function errorHandler(err, req, res, next) {
	console.log(' handle error: ' + err);
	var code = err.code;
	var message = err.message;
	res.writeHead(code, message, {
		'content-type' : 'text/plain'
	});
	res.end(message);
}
