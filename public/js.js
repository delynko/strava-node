mapboxgl.accessToken = 'pk.eyJ1IjoiZGVseW5rbyIsImEiOiJjaXBwZ3hkeTUwM3VuZmxuY2Z5MmFqdnU2In0.ac8kWI1ValjdZBhlpMln3w';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-v9', // stylesheet location
    center: [-95.486052, 38.830348], // starting position [lng, lat]
    zoom: 3 // starting zoom
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-left");

$(function(){
    
    var containerDiv = document.getElementById('data-container');
    
    var allYearsDiv = document.createElement('div');
    allYearsDiv.className = 'years-container'
    
    containerDiv.appendChild(allYearsDiv);
    
    var yearRequest = $.ajax({
        url: "/years",
        dataType: "json"
    });
    
    yearRequest.done(function(years){
        
        var yearOrder = years.sort();
        for (var i = 0; i < yearOrder.length; i++){
            var yearDiv = document.createElement('div');
            yearDiv.id = 'year' + yearOrder[i];
            yearDiv.className = 'yearDiv';
            yearDiv.innerHTML = '<h3>' + yearOrder[i] + '</h3>'
            
            allYearsDiv.appendChild(yearDiv);
        }
        
    });
    
    var allDataRequest = $.ajax({
        url: "/data",
        dataType: "json"
    });
    
    setTimeout(function(){
        allDataRequest.done(function(data){
        
            var types = [];

            for (var t = 0; t < data.length; t++){

                var yrDv = document.getElementById('year' + data[t].year);

                if (!types.includes(data[t].year + data[t].type)){
                    types.push(data[t].year + data[t].type);

                    var typeText = document.createElement('p');
                    typeText.id = data[t].year + data[t].type;
                    typeText.className = 'type-text';
                    typeText.innerHTML = data[t].type;

                    yrDv.appendChild(typeText);



                }
            }
            console.log(data);
        });
    }, 1000)
    
    
        
        

    
});

//    for (var i = 0; i < acts.length; i++){
//
//        if (acts[i].distance > 30){
//            console.log(acts[i]);
//            map.addLayer({
//                "id": "route"+i,
//                "type": "line",
//                "source": {
//                    "type": "geojson",
//                    "data": {
//                        "type": "Feature",
//                        "properties": {},
//                        "geometry": {
//                            "type": "LineString",
//                            "coordinates": [acts[i].geometry[0], acts[i].geometry[1]]
//                        }
//                    }
//                },
//                "layout": {
//                    "line-join": "round",
//                    "line-cap": "round"
//                },
//                "paint": {
//                    "line-color": "#ff0000",
//                    "line-width": 8
//                }
//            });
//        }
//    }

