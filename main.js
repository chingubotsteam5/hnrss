const fs = require("fs");

const request = require("request");
const FeedParser = require("feedparser");
const crc = require("crc");

const feedUrl = "https://news.ycombinator.com/rss";
const secondsBetweenPolls = 30;
const seenArticlesFilename = "seen-articles.json";

let seenArticles = [];

function loadSeenArticles() {
  try {
    const data = fs.readFileSync(seenArticlesFilename);
    seenArticles = JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`${seenArticlesFilename} is missing. First run?`);
    } else {
      console.error(err);
    }
  }
}

function saveSeenArticles() {
  try {
    fs.writeFileSync(seenArticlesFilename, JSON.stringify(seenArticles));
  } catch (err) {
    console.error(err.message);
  }
}

function processArticle(article) {
  const checksum = crc.crc32(article.guid).toString(16);
  if (seenArticles.indexOf(checksum) === -1) {
    seenArticles.push(checksum);
    console.log(`${article.title}: ${article.link}`);
  }
}

function checkFeed() {
  const feedparser = new FeedParser();
  feedparser.on("data", processArticle);

  const req = request(feedUrl);
  req.on("end", () => setTimeout(checkFeed, secondsBetweenPolls * 1000));
  req.pipe(feedparser);
}

process.on("exit", () => saveSeenArticles);
process.on("SIGINT", () => {
  saveSeenArticles();
  process.exit(1);
});

loadSeenArticles();

checkFeed();
