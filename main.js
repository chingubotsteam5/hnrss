const request = require("request");
const FeedParser = require("feedparser");
const crc = require("crc");

const feedUrl = "https://news.ycombinator.com/rss";

const secondsBetweenPolls = 10;

const seenArticles = [];

function processArticle(article) {
  const checksum = crc.crc32(article.guid).toString(16);
  if (seenArticles.indexOf(checksum) === -1) {
    seenArticles.push(checksum);
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
