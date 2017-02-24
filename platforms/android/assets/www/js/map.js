var map;
var mapNs = {
    // device APIs are available
    onDeviceReady: function() {
        var options = {
            maximumAge: 0,
            timeout: 10000,
            enableHighAccuracy: true
        };
        if (api.checkOnline()) {
            mapNs.geocoder = new google.maps.Geocoder();
            navigator.geolocation.getCurrentPosition(mapNs.onSuccess, mapNs.onError, options);
        } else {
            location.href = 'index.html';
        }
        $("#search-f").submit(function(e){
            e.preventDefault();
        });

    },

    initMap: function() {

        map = new google.maps.Map(document.getElementById('full-height'), {
            zoom: 16,
            clickableIcons: false,
            center: mapNs.currentLocation,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

    },

    // Display `Position` properties from the geolocation
    onSuccess: function(position) {
        mapNs.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        mapNs.initMap();

        mapNs.addYourLocationButton(mapNs.currentLocation);
        mapNs.addSearch();
        api.loadPoints(map, position.coords.latitude, position.coords.longitude);
    },
    // Show an alert if there is a problem getting the geolocation
    onError: function() {

        //console.log('unable to get the current location');
        if (!mapNs.searchInput) {
            var address = window.prompt("Unable to get your location, please check your GPS settings and retry, or manually enter your closest tube station", "");
            if (!address) {
                document.location.href="index.html";
            }

            mapNs.searchInput = address;
        }
        var geocoderHandler = function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat(); //51.823872;
                var lng = results[0].geometry.location.lng(); //-3.019166;
                mapNs.onSuccess({"coords":{"latitude": lat, "longitude": lng}});
            } else {
                return mapNs.onError();
            }
        };
        mapNs.searchByAddress(mapNs.searchInput, geocoderHandler);
    },
    searchByAddress: function (address, handler) {
        mapNs.geocoder.geocode({'address': address + 'Station, London, GB'}, handler.bind(this));

    },
    addSearch: function () {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('search');

        input.addEventListener ("search", function (e) {
            var handler = function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat(); //51.823872;
                    var lng = results[0].geometry.location.lng(); //-3.019166;
                    var loc = new google.maps.LatLng(lat, lng);
                    map.setCenter(loc);
                    api.loadPoints(map, lat, lng);
                } else {
                    alert("Unable to find that addres, please retry");
                }
            };
            if (this.value) {
                mapNs.searchByAddress(this.value, handler);
            }
            $(this).blur();
            return false;
        });
        var form = document.getElementById('search-form');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(form);
        setTimeout(function() { $('#search-form').show() }, 1500);

    },
    addYourLocationButton: function (currentLocation)
    {
        var image = 'img/location.gif';
        var marker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            icon: image
        });
        var controlDiv = document.createElement('div');

        var firstChild = document.createElement('button');
        firstChild.style.backgroundColor = '#fff';
        firstChild.style.border = 'none';
        firstChild.style.outline = 'none';
        firstChild.style.width = '28px';
        firstChild.style.height = '28px';
        firstChild.style.borderRadius = '2px';
        firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
        firstChild.style.cursor = 'pointer';
        firstChild.style.marginRight = '10px';
        firstChild.style.padding = '0px';
        firstChild.title = 'Your Location';
        controlDiv.appendChild(firstChild);

        var secondChild = document.createElement('div');
        secondChild.style.margin = '5px';
        secondChild.style.width = '18px';
        secondChild.style.height = '18px';
        secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
        secondChild.style.backgroundSize = '180px 18px';
        secondChild.style.backgroundPosition = '0px 0px';
        secondChild.style.backgroundRepeat = 'no-repeat';
        secondChild.id = 'you_location_img';
        firstChild.appendChild(secondChild);

        google.maps.event.addListener(map, 'dragend', function() {
            $('#you_location_img').css('background-position', '0px 0px');
        });

        firstChild.addEventListener('click', function() {
            var imgX = '0';
            var animationInterval = setInterval(function(){
                if(imgX == '-18') imgX = '0';
                else imgX = '-18';
                $('#you_location_img').css('background-position', imgX+'px 0px');
            }, 500);
            console.log('in');
            if(navigator.geolocation) {
                console.log('in 2');
                console.log(mapNs.currentLocation);
                marker.setPosition(mapNs.currentLocation);
                map.setCenter(mapNs.currentLocation);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            }
            else{
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '0px 0px');
            }
        });

        controlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    }
};

// wait for device API libraries to load
document.addEventListener("deviceready", mapNs.onDeviceReady, false);
//google.maps.event.addDomListener(window, 'load', mapNs.onDeviceReady);
