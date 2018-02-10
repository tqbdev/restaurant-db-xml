var express = require("express");
var path = require("path");
var format = require("pretty-data").pd;
var bodyParser = require("body-parser");
var fs = require("fs");
var xpathSelect = require('xpath.js');
var domParser = require('xmldom').DOMParser;
var xmlSerializer = require('xmldom').XMLSerializer;
var app = express();

function Convert_Date(date) {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();

  var mmChars = mm.split("");
  var ddChars = dd.split("");

  return (
    yyyy +
    "-" +
    (mmChars[1] ? mm : mmChars[0]) +
    "-" +
    (ddChars[1] ? dd : ddChars[0])
  );
}

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use(express.static(path.resolve(__dirname, "client")));

app.post("/PostDuLieu", function(req, res) {
  const filePath = path.resolve(__dirname, "client/2-Du_lieu_Luu_tru/Du_lieu.xml");
  try {
    var xmlDocStr = fs.readFileSync(filePath, 'utf-8').toString();
    var xmlDoc = new domParser().parseFromString(xmlDocStr);

    var itemDataNote = xpathSelect(xmlDoc, "/Du_lieu/Danh_sach_Mat_hang/Mat_hang[@Ma_so='" + req.body.itemseri + "']")[0];

    var itemListSale = xpathSelect(xmlDoc, "/Du_lieu/Danh_sach_Mat_hang/Mat_hang[@Ma_so='" + req.body.itemseri + "']/Danh_sach_Ban_hang")[0];

    var iUnitPrice = parseInt(itemDataNote.getAttribute("Don_gia_Ban"));
    var iAmount = parseInt(req.body.amount);

    var newSale = xmlDoc.createElement("Ban_hang");
    newSale.setAttribute("Ngay", Convert_Date(new Date()));
    newSale.setAttribute("Don_gia", iUnitPrice);
    newSale.setAttribute("So_luong", req.body.amount);
    newSale.setAttribute("Tien", iUnitPrice * iAmount);

    itemListSale.appendChild(newSale);

    var formattedXml = format.xml(new xmlSerializer().serializeToString(xmlDoc));
    fs.writeFileSync(filePath, formattedXml);

    console.log("Du_lieu.xml updated at", new Date().toLocaleString());
    res.sendStatus(200);
  } catch (err) {
    console.log("Du_lieu.xml update error(s) at", new Date().toLocaleString(), "with error(s):", err.message);
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
