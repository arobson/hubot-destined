var _ = require( "lodash" );
var format = require( "util" ).format;
var rawItems = require( "./data/rawItem" )();

function formatError( err ) {
	return err.stack ? err.stack.replace( "\n", "\n > " ) : err.message;
}

function reply( res ) {
	var args = Array.prototype.slice.call( arguments, 1 );
	var message = format.apply( undefined, args );
	return res.reply( message );
}

function send( res ) {
	var args = Array.prototype.slice.call( arguments, 1 );
	var message = format.apply( undefined, args );
	return res.send( message );
}

module.exports = {
	"name.search": function searchByName( res, itemName ) {
		function onList( list ) {
			if ( list.length === 0 ) {
				reply( res, "That which you seek could not be found, LaGuardian." );
			} else {
				reply( res, format( "Guardian, %s items match your search!", list.length ) );
				_.each( list, function( item ) {
					res.reply( item );
				} );
			}
		}
		function onError( err ) {
			console.log( "Error during search", err.stack );
			reply( res, "Sorry, guardian, The Darkness consumed your inquiry." );
		}
		rawItems.searchByName( itemName )
			.then( onList, onError );
	},
	"populate": function populateSource( res ) {
		function onDone() {
			reply( res, "Latest data was downloaded and processed." );
		}
		function onError( err ) {
			res.emote( "sad boop" );
			res.reply( "The Darkness grows: %s", err );
		}
		rawItems.populate()
			.then( onDone, onError );
		res.emote( "is off to fetch the latest feed" );
	}
};
