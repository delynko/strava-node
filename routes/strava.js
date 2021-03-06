require('dotenv').config()
var strava = require("strava-v3");
var express = require("express");
var polyline = require("polyline");

var activities = [];

var pages = [1, 2, 3, 4, 5];

for (var i = 0; i < pages.length; i++){
    
    strava.athlete.listActivities({access_token: process.env.ACCESS_TOKEN, page: pages[i], per_page: 200}, function(err, payload, limits){
    
        if (payload != undefined){
            if (!err) {
                for (var x = 0; x < payload.length; x++){
                        
                    var date = new Date(payload[x].start_date_local);
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDay();
                    
                    var dateArray = date.toDateString().split(" ");
                    
                    dateArray.pop()
                    
                    var activity = {
                        id: payload[x].id,
                        type : payload[x].type,
                        line : payload[x].map.summary_polyline,
                        name: payload[x].name,
                        elevation_gain: payload[x].total_elevation_gain,
                        distance: (payload[x].distance * 0.000621371),
                        year: year,
                        month: month + 1,
                        day: day + 1,
                        date: dateArray.join(" ")
                    }
                    activities.push(activity);
                    
                }
            } else {
                console.log(err);
            }
        }
    });
}

module.exports = activities;
