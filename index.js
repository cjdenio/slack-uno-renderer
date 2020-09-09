const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const puppeteer = require("puppeteer");

nunjucks.configure(path.join(__dirname, "views"), {
  watch: true,
});

const app = express();

app.get("/", (req, res) => {
  res.contentType("html");
  res.send(
    nunjucks.render("index.html", {
      hand: JSON.parse(req.query.hand),
      table: JSON.parse(req.query.table),
    })
  );
});

app.get("/image", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 480,
  });
  await page.setContent(
    nunjucks.render("index.html", {
      hand: JSON.parse(req.query.hand),
      table: JSON.parse(req.query.table),
    })
  );
  const screenshot = await page.screenshot();

  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );

  res.send(screenshot);

  await browser.close();
});

app.listen(8080, () => console.log("woot"));
