const request = require("request");
const FeedParser = require("feedparser");

const req = request("https://news.ycombinator.com/rss");
const feedparser = new FeedParser();

req.on("error", (error) => console.log(error));

req.on("response", function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit("error", new Error("Bad status code"));
  } else {
    stream.pipe(feedparser);
  }
});

feedparser.on("error", (error) => console.log(error));

feedparser.on("readable", function () {
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;

  while (item = stream.read()) {
    console.log(`${item.title}: ${item.link}`);
  }
});
