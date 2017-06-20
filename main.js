const request = require("request");
const FeedParser = require("feedparser");

const feedUrl = "https://news.ycombinator.com/rss";

const secondsBetweenPolls = 10;

let seenArticles = [];

function processArticle(article) {
  if (seenArticles.indexOf(article.guid) === -1) {
    seenArticles.push(article.guid);
    console.log(article.title);
  }
}

function checkFeed() {
  const feedparser = new FeedParser();
  feedparser.on("data", processArticle);

  const req = request(feedUrl);
  req.on("end", () => setTimeout(checkFeed, secondsBetweenPolls * 1000));
  req.pipe(feedparser);
}

checkFeed();
