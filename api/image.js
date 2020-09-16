const nunjucks = require("nunjucks");
const path = require("path");

module.exports = async (req, res, dev) => {
  let browser;
  if (dev) {
    const puppeteer = require("puppeteer");
    browser = await puppeteer.launch();
  } else {
    const puppeteer = require("puppeteer-core");
    const chromium = require("chrome-aws-lambda");
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless,
    });
  }
  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 480,
  });
  await page.setContent(
    nunjucks.render(path.join(__dirname, "../views", "index.html"), {
      hand: JSON.parse(req.query.hand),
      table: JSON.parse(req.query.table),
    }),
    {
      waitUntil: "networkidle0",
    }
  );
  const screenshot = await page.screenshot({ omitBackground: true });

  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );

  res.send(screenshot);

  await browser.close();
};
