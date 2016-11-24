var locations = [
    {lat: 46.4940505, lng: 30.7237315, title: "Одесса", type_shop: "map_1"},
    {lat: 46.4302487, lng: 30.7628252, title: "Киев",   type_shop: "map_2"},
    {lat: 46.5770408, lng: 30.7933132, title: "3",      type_shop: "map_3"},
    {lat: 46.427954,  lng: 30.7235933, title: "4",      type_shop: "map_1"},
    {lat: 46.5856755, lng: 30.786342,  title: "5",      type_shop: "map_2"},
    {lat: 46.4540245, lng: 30.7514887, title: "Одесса", type_shop: "map_1"},
    {lat: 46.4261375, lng: 30.7144358, title: "7",      type_shop: "map_1"},
    {lat: 46.3877787, lng: 30.7286445, title: "8",      type_shop: "map_1"},
    {lat: 46.4340795, lng: 30.7567459, title: "9",      type_shop: "map_1"},
    {lat: 46.440116,  lng: 30.7022843, title: "10",     type_shop: "map_1"},
    {lat: 46.476108,  lng: 30.7180663, title: "11",     type_shop: "map_3"},
    {lat: 46.4697225, lng: 30.7162174, title: "12",     type_shop: "map_1"},
    {lat: 46.4289275, lng: 30.7094283, title: "13",     type_shop: "map_3"}
];

var hashMap = {}, map, markerCluster,
    currentType = "map_1",
    currentStateMap = {lat: 48.295752, lng: 26.6976857},
    search = document.getElementById('search'),
    listLocations = document.querySelector('.listLocation'),
    buttons = document.getElementsByClassName('button');

locations.forEach(function(el) {
    if(hashMap[el.type_shop] === undefined) {
        hashMap[el.type_shop] = [];
    }
    hashMap[el.type_shop].push(el);
});

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: currentStateMap
    });

    var inputBlock = document.querySelector('.input-block');
    var searchBox = new google.maps.places.SearchBox(inputBlock);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputBlock);

    renderMarkersByType(currentType);
}

function clearMarkers() {
    markerCluster.clearMarkers();
}

function renderMarkersByType(type) {
    var markers = [];
    hashMap[type].forEach(function(location) {
        var newMarker = new google.maps.Marker({
            position: location
        });

        markers.push(newMarker);

        var infoWindow = renderInfoWindow(location);

        newMarker.addListener('click', function() {
            infoWindow.open(location.type_shop, newMarker);
        });
    });

    markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

[].forEach.call(buttons, function(button){
    button.addEventListener('click', function() {
        currentType = this.getAttribute('id-map');
        clearMarkers();
        renderMarkersByType(currentType);
    });
});

function searchMarkers(value) {
     return hashMap[currentType].filter(function(el) {
        return (el.title.indexOf(value) && el.type_shop.indexOf(value)) != -1;
    });
}

function renderInfoWindow(loc) {
    var infoMarker = '<div id="content">' +
            '<div id="siteNotice">' + '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + loc.title + '</h1>' +
            '<div id="bodyContent">' +
            '<p>' + loc.title + '</p>' +
            '</div>' +
            '</div>';

    return new google.maps.InfoWindow({
        content: infoMarker
    });
}

function renderSugesstion(sugesstion) {
    var listSugesstion = '';
    if(sugesstion != ''){
        sugesstion.forEach(function(loc) {
            listSugesstion += '<li location-id="'+ loc.title + '" lat="' + loc.lat + '" lng="' + loc.lng + '" type-id="' + loc.type_shop + '"' + '>' + loc.title + '</li>';
        });
    }

    listLocations.innerHTML = listSugesstion;

    var li = listLocations.getElementsByTagName('li');
    [].forEach.call(li, function(el) {
        el.addEventListener('click', function(e) {
            listLocations.classList.remove('search-list--visible');
            var thisEl = e.target;
            map.setZoom(17);
            map.setCenter(new google.maps.LatLng(thisEl.getAttribute('lat'), thisEl.getAttribute('lng')));
            search.value = thisEl.innerHTML;
        });
    });
}

search.addEventListener('input', function(ev) {
    var value = ev.target.value;
    var found = searchMarkers(value);
    if(value.length > 0){
        renderSugesstion(found);
        listLocations.classList.add('search-list--visible');
    }else{
        found = '';
        renderSugesstion(found);
        listLocations.classList.remove('search-list--visible');
    }
});
