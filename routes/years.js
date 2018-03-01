var strava = require("strava-v3");
var express = require("express");

var years = [];

var pages = [1, 2, 3, 4, 5];

for (var i = 0; i < pages.length; i++){
    
    strava.athlete.listActivities({access_token: process.env.ACCESS_TOKEN, page: pages[i], per_page: 200}, function(err, payload, limits){
        if (payload != undefined){
            if (!err) {
                for (var x = 0; x < payload.length; x++){
                        
                    var date = new Date(payload[x].start_date_local);
                    var year = date.getFullYear();
                    
                    if (years.includes(year) == false){
                        years.push(year);
                    }
                }
            }
        }
    });
}

module.exports = years;