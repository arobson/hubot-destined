var _ = require( "lodash" );
var format = require( "util" ).format;
var rawItems = require( "./data/rawItem" );

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
				reply( res, format( "Guardian, %s items match your search:\n%s", list.length, list ) );
			}
		}
		function onError( err ) {
			reply( res, "Sorry, guardian, the darkness consumed your inquiry." );
		}
		rawItems.searchByName( itemName )
			.then( onList, onError );
	}
};
