var _ = require( "lodash" );
var request = require( "request" );
var when = require( "when" );
var format = require( "util" ).format;
var querystring = require( "querystring" );
var webpage = require( "webpage" );
var system = require( "system" );

var urlTemplate = "http://destinydb.com/items/tooltip/%s";
var pageTemplate = "<html><body>%s</body></html>";

function get( url ) {
	return when.promise( function( resolve, reject ) {
		request.get( { url: url, gzip: true }, function( err, data ) {
			if ( err ) {
				reject( err );
			} else {
				resolve( data.body );
			}
		} );
	} );
}

function getItemTooltip( itemHash ) {
	var url = format( urlTemplate, itemHash );
	return get( url )
		.then( getTooltipHtml )
		.then( renderTooltipHtml );
}

function getTooltipHtml( rawContent ) {
	var scrubbed = rawContent.replace( "$ZamTooltips.onTooltip([", "" ).replace( /\]\)[;]/, "" );
	var json = JSON.parse( scrubbed );
	var tooltipRaw = json.tooltip;
	var tooltipHtml = querystring.unescape( tooltipRaw );
}

function renderTooltipHtml( tooltipHtml ) {
	var page = webpage.create();
	var html = format( pageTemplate, tooltipHtml );
	page.content = html;
	page.render( "tooltip.png", { format: "png", quality: 100 } );
	phantom.exit();
}

var itemHash = system.args[ 0 ];
getItemTooltip( itemHash );
