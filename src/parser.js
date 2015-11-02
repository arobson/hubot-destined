var _ = require( "lodash" );
var patterns = require( "./commands" );

function isMatch( msg, rgx ) {
	return rgx.exec( msg );
}

function hasMatches( list ) {
	return list.length === 0;
}

function matcher( msg ) {
	return _.reduce( patterns, function( acc, expressions, command ) {
		var match = isMatch.bind( undefined, msg );
		var matches = _.filter( _.map( expressions, match ) );
		if ( matches.length ) {
			acc.command = command;
			acc.args = _.map( matches[ 0 ].slice( 1 ) );
		}
		return acc;
	}, {} );
}

module.exports = matcher;
