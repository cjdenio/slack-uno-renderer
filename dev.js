const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const path = require("path");

app.get("/", (req, res) => {
  res.contentType("html");
  res.send(
    nunjucks.render(path.join(__dirname, "views", "index.html"), {
      hand: JSON.parse(req.query.hand),
      table: JSON.parse(req.query.table),
    })
  );
});

app.get("/image", (req, res) => {
  require("./api/image")(req, res, true);
});

app.listen(3000, () => console.log("Server started!"));
