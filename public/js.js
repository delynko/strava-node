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
    
    map.on('load', function(){
        
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
                yearDiv.innerHTML = '<h1>' + yearOrder[i] + '</h1>'
                
                allYearsDiv.appendChild(yearDiv);
                
            }
        });
        
        var allDataRequest = $.ajax({
            url: "/data",
            dataType: "json"
        });
        
        allDataRequest.done(function(data){
            
            var yearTypes = [];
            
            for (var t = 0; t < data.length; t++){
                
                var yrDv = document.getElementById('year' + data[t].year);
                
                if (!yearTypes.includes(data[t].year + data[t].type)) {
                    
                    yearTypes.push(data[t].year + data[t].type);
                    
                    var typeTitle = document.createElement('p');
                    typeTitle.id = data[t].year + data[t].type;
                    typeTitle.className = 'type-text';
                    typeTitle.innerHTML = "<b>" + data[t].type+ "</b>";
                    typeTitle.style.cursor = 'pointer';
                    yrDv.appendChild(typeTitle);
                }
            }
            
            var yearTypeDistance = [];
            
            for (var t = 0; t < data.length; t++){
                var yrTpDs = {
                    "type": data[t].type,
                    "yearType": data[t].year + data[t].type,
                    "distance": data[t].distance
                }
                yearTypeDistance.push(yrTpDs);
            }
            
            var distanceOutput =
                _(yearTypeDistance)
                .groupBy('yearType')
                .map((objs, key) => ({
                'yearType': key,
                'distance': _.sumBy(objs, 'distance') }))
                .value();
            
            distanceOutput.forEach(function(d){
                
                var pDiv = document.getElementById(d.yearType);
                
                var totalDiv = document.createElement('div');
                totalDiv.innerHTML = (d.distance.toFixed(2) + " total miles");
                totalDiv.id = d.yearType + "Distance";
                pDiv.appendChild(totalDiv);
                
                var activityContainer = document.createElement('div');
                
                activityContainer.id = d.yearType + "Activities";
                activityContainer.className = 'act-cont';
                activityContainer.innerHTML = "Hover here to see all";
                activityContainer.onmouseover = activityContainerHover;
                activityContainer.onmouseout = activityContainerUnHover;
                
                totalDiv.appendChild(activityContainer);
            });
            
            var mapLayer;
            
            for (var a = 0; a < data.length; a++) {
                
                var container = document.getElementById(data[a].year + data[a].type + "Activities");
                var line = data[a].line;
                
                var activity = document.createElement('div');
                activity.id = data[a].id;
                activity.innerHTML = data[a].date + ", " + data[a].name + ", " + data[a].distance.toFixed(2) + " miles";
                activity.className = 'activities-hidden activity';
                activity.onclick = function(){
                    
                    if (map.getLayer(mapLayer) != undefined) {
                        map.removeSource(mapLayer);
                        map.removeLayer(mapLayer);
                    };
                    
                    mapLayer = "_" + this.id;
                    for (var g = 0; g < data.length; g++) {
                        if (data[g].id == this.id){
                            var points = decode(data[g].line);
                            var latlng = [];
                            points.forEach(function(p){
                                var point = [];
                                point.push(p.longitude);
                                point.push(p.latitude);
                                latlng.push(point);
                            });
                            
                            var ids = "_" + this.id;
                            
                            var geojson = {
                                "type": "FeatureCollection",
                                "features": [{
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "LineString",
                                        "coordinates": latlng
                                    }
                                }]
                            };
                            
                            map.addLayer({
                                "id": ids,
                                "type": "line",
                                "source": {
                                    "type": "geojson",
                                    "data": geojson
                                },
                                "layout": {
                                    "line-join": "round",
                                    "line-cap": "round"
                                },
                                "paint": {
                                    "line-color": "#ff0000",
                                    "line-width": 8
                                }
                            });
                            
                            var coordinates = geojson.features[0].geometry.coordinates;
                            var bounds = coordinates.reduce(function(bounds, coords){
                                return bounds.extend(coords);
                            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
                            
                            map.fitBounds(bounds, {padding: 50});
                            
                        }
                    }
                };
                container.appendChild(activity);
            }
        });
    });
    
    
});

function totalToggle(){
    $("#" + this.id + "Distance").toggle();
}

function activityContainerHover(){
    $(this).children().removeClass('activities-hidden');
}

function activityContainerUnHover(){
    $(this).children().addClass('activities-hidden');
}

function decode(encoded){

    var points=[ ]
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
    var b, shift = 0, result = 0;
    do {

    b = encoded.charAt(index++).charCodeAt(0) - 63;
    result |= (b & 0x1f) << shift;
    shift += 5;
    } while (b >= 0x20);
        
    var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
    } while (b >= 0x20);
    var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({latitude:( lat / 1E5),longitude:( lng / 1E5)})  

    }
    return points
}
