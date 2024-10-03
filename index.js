const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("node:fs");
const { copyFileSync } = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    fs.readdir("./files", {encoding: "utf8", recursive: false}, function(err, files) {
        res.render("index.ejs", {files: files});
    })
});

app.get("/files/:fileName", function(req, res) {
    fs.readFile(`./files/${req.params.fileName}`, {encoding: "utf8"}, function(err, data) {
        res.render("card.ejs", {fileName: req.params.fileName, data: data});
    });
});

app.post("/add-task", function(req, res) {
    const heading = req.body.heading;
    const description = req.body.description;
    var text = ""

    for (var i=0; i<heading.length; i++) {
        if (heading[i] === " ") {
            text = text + "_";
        }
        else {
            text = text + heading[i];
        }
    }
    text = "./files/" + text;

    fs.access(text + ".txt", function(err) {
        if (err) {
            fs.appendFile(text + ".txt", description, function(err) {
                if (err) {
                    console.error(err);
                }
            });
            res.redirect("/");
        }
        else {
            res.send("<h1>Note is already present, enter a different note.</h1>");
        }
    });
});

app.get("/:fileName", function(req, res){
    const fileName = req.params.fileName;
    
    if (fileName !== "favicon.ico") {
        fs.unlink("./files/" + fileName, function(err) {
            if (err) {
                console.error(err);
            }
        });
    }

    res.redirect("/");
});

app.listen(port);