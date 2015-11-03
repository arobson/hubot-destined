var _ = require( "lodash" );
var commands = require( "./commands" );
var processor = require( "./processor" );
var parser = require( "./parser" );
var format = require( "util" ).format;
var rawItems = require( "./data/rawItem" )();

function formatJSON( obj ) {
	var json = JSON.stringify( _.omit( obj, [ "topic" ] ), null, 2 );
	return json;
}

function listen( robot ) {
	var lists = _.values( commands );
	var patterns = _.flatten( lists );
	_.each( patterns, function( pattern ) {
		robot.respond( pattern, function( res ) {
			if ( !robot.destinyStatus ) {
				res.emote( "_is scouring the galaxy, acquiring the latest information_" );
			} else if ( robot.destinyStatus.error ) {
				res.reply( format( "The Darkness grows, guardian, behold!\n```%s```" ) );
			} else {
				var data = parser( res.match[ 0 ] );
				var args = [ res ].concat( data.args );
				return processor[ data.command ].apply( undefined, args );
			}
		} );
	} );
}

function setup( robot ) {
	listen( robot );
	function onCount( count ) {
		if ( count === 0 ) {
			rawItems.populate()
				.then( function() {
					console.log( "Destiny data populated from source." );
					robot.destinyStatus = { success: true };
				}, function( err ) {
					console.log( "Error getting Destiny data :(", err );
					robot.destinyStatus = { error: err };
				} );
		} else {
			robot.destinyStatus = { success: true };
			console.log( "Destiny data loaded from disk." );
		}
	}
	rawItems.count()
		.then( onCount, function() {} );
}

module.exports = setup;
