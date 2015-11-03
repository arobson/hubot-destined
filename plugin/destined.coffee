# Description:
#   Search for Destiny items by name and get back DestinyDb links for matches.
#
# Configuration:
#	N/A
#
# Commands:
#   find <name> - find any item where the name matches the text entered
#   link <name> - find any item where the name matches the text entered
#   refresh data - download and update data from latest destiny plumbing feed

plugin = require "../src/plugin"

module.exports = (robot) ->
	plugin( robot );
