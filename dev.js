const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");

app.get("/", (req, res) => {
  const fontAwesomePath = path.join(__dirname, "_lib", "fa-solid-900.ttf");
  res.contentType("html");
  res.send(
    nunjucks.render(path.join(__dirname, "views", "index.html"), {
      hand: JSON.parse(req.query.hand),
      table: JSON.parse(req.query.table),
      fontAwesome: fs.readFileSync(fontAwesomePath).toString("base64"),
      wildBackground: fs
        .readFileSync(path.join(__dirname, "_lib", "wild.svg"))
        .toString("base64"),
    })
  );
});

app.get("/image", (req, res) => {
  require("./api/image")(req, res, true);
});

app.listen(3000, () => console.log("Server started!"));
