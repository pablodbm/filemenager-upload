var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var path = require("path");
var hbs = require("express-handlebars");
var formidable = require("formidable");
app.use(express.static("static"));
let form = formidable({});
form.multiples = true;
form.keepExtensions = true;
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");
let counter = 1;
let tab = [];

function DeleteOne(value) {
  for (i = 0; i < tab.length; i++) {
    if (value == tab[i].id) {
      tab.splice(i, 1);
    }
  }
}

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

app.get("/", function (req, res) {
  res.render("index.hbs");
});
app.get("/deletedata", function (req, res) {
  tab = [];
  let data = { tab };
  res.render("filemanager.hbs", data);
});
app.get("/info", function (req, res) {
  res.render("info.hbs");
});
app.get("/filemanager", function (req, res) {
  let data = { tab };
  res.render("filemanager.hbs", data);
});
app.get("/upload", function (req, res) {
  res.render("upload.hbs");
});
app.get("/delete", function (req, res) {
  let id = req.query.p;
  DeleteOne(id);
  let data = { tab };
  res.render("filemanager.hbs", data);
});

app.post("/filemanager", function (req, res) {
  let form = formidable({});
  form.keepExtensions = true;
  form.multiples = true;
  form.uploadDir = __dirname + "/static/upload/";

  form.parse(req, function (err, fields, files) {
    if (!files.imageupload.length) {
      if (files.imageupload.type == "image/jpeg") {
        source = "jpg.png";
      } else if (files.imageupload.type == "text/plain") {
        source = "txt.jpg";
      } else if (files.imageupload.type == "image/png") {
        source = "png.png";
      } else {
        source = "brak.jpg";
      }
      const temp = {
        name: files.imageupload.name,
        size: files.imageupload.size,
        type: files.imageupload.type,
        id: counter,
        source: source,
      };
      tab.push(temp);
      counter++;
    } else {
      files.imageupload.map((file) => {
        if (file.type == "image/jpeg") {
          source = "jpg.png";
        } else if (file.type == "text/plain") {
          source = "txt.jpg";
        } else if (file.type == "image/png") {
          source = "png.png";
        } else {
          source = "brak.jpg";
        }
        const temp = {
          name: file.name,
          size: file.size,
          type: file.type,
          id: counter,
          source: source,
        };
        tab.push(temp);
        counter++;
      });
    }
  });

  form.parse(req, function (err, fields, files) {
    let data = { tab };
    res.render("filemanager.hbs", data);
  });
});
