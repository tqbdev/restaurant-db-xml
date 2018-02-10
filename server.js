var express = require("express");
var path = require("path");
var format = require("pretty-data").pd;
var concat = require("concat-stream");
var fs = require("fs");

var app = express();

app.use(function(req, res, next) {
  req.pipe(
    concat(function(data) {
      req.body = data;
      next();
    })
  );
});

//app.use("/", express.static("./"));
app.use(express.static(path.resolve(__dirname, "client")));

app.post("/PostDuLieu", function(req, res) {
  var formattedXml = format.xml(req.body.toString());

  try {
    fs.writeFileSync(
      path.resolve(__dirname, "client/2-Du_lieu_Luu_tru/Du_lieu.xml"),
      formattedXml
    );
    console.log("Du_lieu.xml updated at", new Date().toLocaleString());
    res.sendStatus(200);
  } catch (err) {
    console.log("Du_lieu.xml update error(s) at", new Date().toLocaleString());
    res.sendStatus(403);
  }
});

var server = app.listen(
  process.env.PORT || 80,
  process.env.IP || "localhost",
  function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Ung dung dang chay o: http://%s:%s", host, port);
  }
);
