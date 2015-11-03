# hubot-destined

Destiny item search for slack-integrated hubot. Uses a raw feed acquired from Josh Hunt's [destiny.plumbing](https://github.com/joshhunt/destinyPlumbing) and provides item links to [destinydb](http://destinydb.com).

It will likely grow over time and may not always use the same data source or only link there, but hey, gotta start somewhere.

## Use
The commands presently support refreshing data (use very sparingly) and search for an item by name/name fragment:

```
hubot find invect
hubot link conspiracy theory
hubot refresh data
```

The search is case insensitive and _technically_ using regex. Get fancy and you'll probably blow something up or get nothing back.

## Installation

In hubot project repo, run:

`npm install hubot-destined --save`

Then add **hubot-destined** to your `external-scripts.json`:

```json
[
  "hubot-destined"
]
```

## Technical notes

### How it gets/stores data
This is pulling the raw JSON file for the full item list* and then creating/refreshing a local NeDB file. This could be the worst idea ever but I had stuff I could borrow from other projects to throw this together quickly and I only had a few hours to spend on it. It only does automatically the first time.

* The processed feeds don't have the latest weapons or gear. I have no idea why. Instead of pestering Josh Hunt who already did us all a solid, I just use the raw feed he has also made available as JSON.

### How it processes commands
So uh, at first glance a lot of this probably seems like overkill. I'm using another of my hubot project's structure partly because it was there, partly because it's easier to test and partly because I plan to add more stuff over time and I prefer this.

Hopefully that doesn't make it hard for anyone with time/interest to contribute to.

The `command.js` file is a hash of command names with an array of patterns that will activate that command. When a match is found, the command that defined the match is invoked in `processor` where the matching function is always passed the hubot response object and then any captured groups from the pattern in order they appeared in the pattern.

## Contributing
I'd like to think I'll get to add more stuff myself, but hey, it's free software and I have a lot of other stuff going on. So if you can JavaScript, <3 Destiny and want more features/fixes - quickest path to those is contributing.

Please be sure to add at least one test to cover any new commands. Even with that, I often screw up regex by making the matches too broad and hubot ends up trying to be helpful when you least expect.


