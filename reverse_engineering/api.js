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
		getKeyspacesList((err, res) => {
			let keyspacesNames = res.data.map(ks => ks.name);
			handleKeyspace(connectionInfo, keyspacesNames, cb);
		};
	}
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

function handleKeyspace(connectionInfo, keyspacesNames, cb){
	async.map(keyspacesNames, (keyspaceName, keyspaceItemCallback) => {
		readKeyspaceByName(keyspaceName, (err, keySpace) => {
			if(err){
				console.log(err);
				logger.log('error', err);
				keyspaceItemCallback(err);
			} else {
				let size = /*getSampleDocSize(amount, connectionInfo.recordSamplingSettings) ||*/ 1000;

				getCollectionsList(keyspaceName, size, (err, collectionList) => {
					if(err){
						console.log(err);
						return keyspaceItemCallback(err);
					} else {
						let collectionNames = collectionList.data.map(coll => coll.name);
						let dataItem = prepareConnectionDataItem(keyspaceName, collectionNames);
						return keyspaceItemCallback(err, dataItem);
					}
				});
			}
		});
	}, (err, items) => {
		if(err){
			console.log(err);
			logger.log('error', err);
		}
		return cb(err, items);
	});
}

function getKeyspacesList(cb){
	let query = '/api/v1/keyspaces';
	// return fetchRequest(query).then(res => {
	// 	return res;
	// });
	
	let data = {
	  "apiVersion": "v1",
	  "kind": "KeyspaceList",
	  "data": [{name: 'Keyspace1'}, {name: 'Keyspace2'}]
	};

	return cb(null, data);
}

function readKeyspaceByName(keyspaceName, cb){
	let query = `/api/v1/keyspaces/${keyspaceName}`;
	// return fetchRequest(query).then(res => {
	// 	return res;
	// });

	let data = {
	  "apiVersion": "v1",
	  "kind": "KeyspaceList",
	  "data": { name: keyspaceName }
	};

	return cb(null, data);
}

function getCollectionsList(keyspaceName){
	let query = `/api/v1/keyspaces/${keyspaceName}`;
	// return fetchRequest(query).then(res => {
	// 	return res;
	// });
	
	let data = {
		"apiVersion": "v1",
		"kind": "CollectionList",
		"data": [
			{
				"id": 0,
				"name": "string",
				"keyType": "LONG",
				"children": [
					null
				],
				"indices": [
					{
						"name": "string",
						"fields": [
							{
								"name": "string",
								"order": "Asc"
							}
						],
						"cardinality": "Unique"
					}
				]
			},
			{
				"id": 0,
				"name": "string",
				"keyType": "LONG",
				"children": [
					null
				],
				"indices": [
					{
						"name": "string",
						"fields": [
							{
								"name": "string",
								"order": "Asc"
							}
						],
						"cardinality": "Unique"
					}
				]
			}
		]
	};

	return cb(null, data);
}

function prepareConnectionDataItem(keyspaceName, collectionNames){
	let connectionDataItem = {
		dbName: keyspaceName,
		dbCollections: collectionNames
	};

	return connectionDataItem;
}