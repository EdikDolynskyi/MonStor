'use strict';

module.exports = {
	connect: function(connectionInfo, logger, cb){
		cb()
	},

	disconnect: function(connectionInfo, logger, cb){
		cb()
	},

	testConnection: function(connectionInfo, logger, cb){
	},

	getDbCollectionsNames: function(connectionInfo, logger, cb) {
	}
}

function getKeyspacesList(){
	let query = '/api/v1/keyspaces';
	// return fetchRequest(query).then(res => {
	// 	return res;
	// });
	return ['Keyspace1', 'Keyspace2']
}

function getRequestOptions(){
	let date = new Date().toUTCString();
	let authToken = '';

	let headers = {
		'Cache-Control': 'no-cache',
		'authorization': authToken,
		'x-ms-date': date,
		'x-ms-version': '2017-01-19',
		'Accept': 'application/json'
	};

	return {
		'method': 'GET',
		'headers': headers
	};
}

function fetchRequest(query){
	let options = getRequestOptions(REST, config);

	return fetch(query, options)
		.then(res => {
			return res.text();
		})
		.then(body => {
			body = JSON.parse(body);
			console.log(body);
			return body;
		})
		.catch(err => {
			console.log(err);
		});
}