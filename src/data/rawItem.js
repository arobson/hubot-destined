var rawUrl = "http://destiny.plumbing/raw/mobileWorldContent/en/DestinyInventoryItemDefinition.json";
var thumbTemplate = "https://www.bungie.net%s";
var urlTemplate = "http://destinydb.com/items/%s-%s";
var _ = require( "lodash" );
var request = require( "request" );
var when = require( "when" );
var db = require( "./db" )( "rawItems" );
var format = require( "util" ).format;

function createApi() {
	return {
		count: db.count,
		db: db,
		populate: populate,
		searchByName: searchByName
	};
}

function createNameRegex( name ) {
	return new RegExp( name, "ig" );
}

function get( url ) {
	return when.promise( function( resolve, reject ) {
		request.get( { url: url, json: true, gzip: true }, function( err, data ) {
			if ( err ) {
				reject( err );
			} else {
				resolve( data.body );
			}
		} );
	} );
}

function load() {
	return createApi();
}

function populate() {
	return get( rawUrl )
		.then( function( rawJson ) {
			return when.all( _.map( rawJson, function( item, id ) {
					item.id = id;
					return db.upsert( { id: id }, item );
				} ) );
		} );
}

function searchByName( name ) {
	return db.fetch( { itemName: { $regex: createNameRegex( name ) }, equippable: true } )
		.then( function( items ) {
			var list = _.map( items, function( item, index ) {
				var number = index + 1;
				var name = item.itemName.toLowerCase().split( " " ).join( "-" );
				var id = item.itemHash;
				var thumbUrl = format( thumbTemplate, item.icon );
				var url = format( urlTemplate, id, name );
				return {
					fallback: url,
					title: item.itemName,
					title_link: url,
					thumb_url: thumbUrl,
					text: item.itemDescription
				};
			} );
			return { attachments: list };
		} );
}

module.exports = load;
