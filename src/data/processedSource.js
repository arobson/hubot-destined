var _ = require( "lodash" );
var request = require( "request" );
var when = require( "when" );
var dbFn = require( "./db" );
var dbs = {};

var destinyPlumbingRoot = "http://destiny.plumbing/";
var language = "en";
var root = "resources";
var items = "items";

function get( url ) {
	return when.promise( function( resolve, reject ) {
		request.get( { url: url, json: true, gzip: true }, function( err, data ) {
			if ( err ) {
				reject( err );
			} else {
				console.log( data.body );
				resolve( data.body );
			}
		} );
	} );
}

function getTypes() {
	return get( destinyPlumbingRoot )
		.then( function( data ) {
			console.log( "got it", data );
			return data[ root ][ items ][ language ];
		} );
}

function getType( type, url ) {
	if ( !dbs[ type ] ) {
		dbs[ type ] = dbFn( type );
	}
	var db = dbs[ type ];
	return get( url )
		.then( function( data ) {
			when.all( _.map( data.items, function( item, id ) {
				item.id = id;
				return db.upsert( { id: id }, item );
			} ) );
		} );
}

function populate() {
	dbs.types = dbFn( "types" );
	return getTypes()
		.then( function( types ) {
			var typeList = _.keys( types );
			var list = { id: "list", types: typeList };
			dbs.typeList = typeList;
			dbs.types.upsert( { id: "list" }, _.merge( { id: "list" }, list ) );
			return when.all( _.map( types, function( url, type ) {
				return getType( type, url );
			} ) ).then( function() {
				return dbs;
			} );
		} );
}

module.exports = populate;
