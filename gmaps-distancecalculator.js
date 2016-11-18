// Displays a button to remove all the points previously created in click drawing
var distanceBoxLabel = 'Measure distance'

// Customization options for the Stroke/Line
var lineStrokeColor = "#f0573b";
var lineStrokeOpacity = 1;
var lineStrokeWeight = 2;

var map = null;
var distanceText = null;
var distanceMeters = 0;
var markers = [];

function initMap() {
  var position = {lat: 48.856579, lng: 2.330389};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: position,
    clickableIcons: false
  });
  initCalculations(map);
  var removeMarkersDiv = document.createElement('div');
  var centerControl = new clearMarkers(removeMarkersDiv, map);

  removeMarkersDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(removeMarkersDiv);
}

function clearMarkers(controlDiv, map) {

        // Set CSS for the control border.
        controlDiv.style.width = '152px';
        controlDiv.style.height = '75px';
        controlDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlDiv.style.marginBottom = '50px';

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#f0573b';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.style.height = '36.3px';
        controlDiv.appendChild(controlUI);

        var titleText = document.createElement('div');
        titleText.style.color = '#ffffff';
        titleText.style.fontWeight = 'bold';
        titleText.style.fontFamily = 'Roboto,Arial,sans-serif';
        titleText.style.fontSize = '13px';
        titleText.style.lineHeight = '38px';
        titleText.style.paddingLeft = '5px';
        titleText.style.paddingRight = '5px';
        titleText.innerHTML = distanceBoxLabel;
        controlUI.appendChild(titleText);

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        distanceText = document.createElement('div');
        distanceText.style.color = '#3c3c3b';
        distanceText.style.fontWeight = 'bold';
        distanceText.style.fontFamily = 'Roboto,Arial,sans-serif';
        distanceText.style.fontSize = '13px';
        distanceText.style.lineHeight = '38px';
        distanceText.style.paddingLeft = '5px';
        distanceText.style.paddingRight = '5px';
        distanceText.innerHTML = '0 km';
        controlUI.appendChild(distanceText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          deleteMarkers();
          clickableDrawPolygon.setMap(null);
          clickableDrawPolygon = new google.maps.Polyline({ map: map, path: [], strokeColor: lineStrokeColor, strokeOpacity: lineStrokeOpacity, strokeWeight: lineStrokeWeight });
          isPolygonClosed = false;
        });

      }

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function deleteMarkers() {
        setMapOnAll(null);
        markers = [];
      }

      function recalculateDistance() {
        distanceMeters = 0;
        for (var i = 1; i < markers.length; i++) {
          distanceMeters += google.maps.geometry.spherical.computeDistanceBetween (markers[i - 1].position, markers[i].position);
        }
        distanceText.innerHTML = Math.round(distanceMeters / 1000 * 100) / 100 + ' km';
      }

      function initCalculations() {
        var update_timeout = null;

        clickableDrawPolygon = new google.maps.Polyline({ map: map, path: [], strokeColor: lineStrokeColor, strokeOpacity: lineStrokeOpacity, strokeWeight: lineStrokeWeight });
        google.maps.event.addListener(map, 'click', function (clickEvent) {
          update_timeout = setTimeout(function(){
            var markerIndex = clickableDrawPolygon.getPath().length;
            var isFirstMarker = markerIndex === 0;
            var marker = new google.maps.Marker({ map: map, position: clickEvent.latLng, draggable: true });
            markers.push(marker);
            if (!isFirstMarker) {
              distanceMeters += google.maps.geometry.spherical.computeDistanceBetween (clickEvent.latLng, markers[markerIndex - 1].position);
              distanceText.innerHTML = Math.round(distanceMeters / 1000 * 100) / 100 + ' km';
            }
            google.maps.event.addListener(marker, 'drag', function (dragEvent) {
              clickableDrawPolygon.getPath().setAt(markerIndex, dragEvent.latLng);
              recalculateDistance();
            });
            clickableDrawPolygon.getPath().push(clickEvent.latLng);
          }, 200);  
        });

      // Add an event to prevent adding a marker when double-clicking (zooming)
      google.maps.event.addListener(map, 'dblclick', function(doubleClickEvent) {
        clearTimeout(update_timeout);
      });
    }
