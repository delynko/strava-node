var strava = require("strava-v3");
var express = require("express");

var years = [];

var pages = [1, 2, 3, 4, 5];

for (var i = 0; i < pages.length; i++){
    
    strava.athlete.listActivities({access_token: "9692c0d85d42b0be565e2c5964ae3fd22a78adb2", page: pages[i], per_page: 200}, function(err, payload, limits){
        if (payload != undefined){
            if (!err) {
                for (var x = 0; x < payload.length; x++){
                    if (payload[x].type != "Walk"){
                        
                        var date = new Date(payload[x].start_date_local);
                        var year = date.getFullYear();
                        
                        if (years.includes(year) == false){
                            years.push(year);
                        }
                    }
                }
            }
        }
    });
}

module.exports = years;