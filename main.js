const request = require("request");
const FeedParser = require("feedparser");

const feedUrl = "https://news.ycombinator.com/rss";

function processArticle(article) {
  console.log(article.title);
}

function checkFeed() {
  const feedparser = new FeedParser();
  feedparser.on("data", processArticle);

  const req = request(feedUrl);
  req.on("end", () => setTimeout(checkFeed, 10000));
  req.pipe(feedparser);
}

checkFeed();
