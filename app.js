var strava = require("strava-v3");
var express = require("express");
var path = require("path");
var polyline = require("polyline");
var data = require("./routes/strava.js");
var years = require("./routes/years.js");

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get("/data", function(req, res){
    res.send(data);
});

app.get("/years", function(req, res){
    res.send(years);
});

app.listen(port, function(){
    console.log("Here we go...")
});