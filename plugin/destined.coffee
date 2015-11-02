# Description:
#   Search for Destiny items by name and get back DestinyDb links for matches.
#
# Configuration:
#	N/A
#
# Commands:
#   find <name> - find any item where the name matches the text entered
#   link <name> - find any item where the name matches the text entered
#

plugin = require "../src/plugin"

module.exports = (robot) ->
	plugin( robot );
