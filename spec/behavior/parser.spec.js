require( "../setup" );
var parser = require( "../../src/parser" );

describe( "Parser", function() {
	describe( "host command", function() {
		it( "should match 'find an item with spaces' to 'name.search'", function() {
			parser( "find a weapon with spaces" ).should.eql(
			{ command: "name.search", args: [ "a weapon with spaces" ] }
			);
		} );

		it( "should match 'link an item with spaces' to 'name.search'", function() {
			parser( "link a weapon with spaces" ).should.eql(
			{ command: "name.search", args: [ "a weapon with spaces" ] }
			);
		} );
	} );
} );
