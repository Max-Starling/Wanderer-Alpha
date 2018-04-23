const createTarget = (map, currentPos, r) => {
  const directionAngle = Math.random() * 2 * Math.PI;

  const targetMarkerPos = {
    lat: currentPos.lat + r * Math.sin(directionAngle),
    lng: currentPos.lng + 2 * r * Math.cos(directionAngle),
  };

  const targetMarkerIcon = {
    url: 'https://i.imgur.com/REOaN41.png',
    size: new google.maps.Size(84, 120),
    scaledSize: new google.maps.Size(42, 60),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 60)
  };

  const targetMarker = new google.maps.Marker(
    {
      map,
      position: targetMarkerPos,
      title: 'It\'s your target',
      icon: targetMarkerIcon,
    }
  );

  map.panTo(
    {
      lat: (targetMarkerPos.lat + currentPos.lat) / 2,
      lng: (targetMarkerPos.lng + currentPos.lng) / 2,
    }
  );

  return targetMarkerPos;
};

const onStart = (map, currentPos, r) => {
  const targetMarkerPos = createTarget(map, currentPos, r);

  const directionsRequest = {
    origin: currentPos,
    destination: targetMarkerPos,
    provideRouteAlternatives: true,
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.METRIC,
    // avoidTolls: true,
    // region: 'BY',
  };

  const directionsService = new google.maps.DirectionsService();

  const pathPolyline = new google.maps.Polyline({
    strokeColor: '#4F4F4F',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  const directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: pathPolyline,
    preserveViewport: true,
  });

  directionsDisplay.setMap(map);
  directionsService.route(directionsRequest, (result, status) => {
    console.log(result);
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
};


const handleLocationError = (browserHasGeolocation, infoWindow, currentPos) => {
  infoWindow.setPosition(currentPos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.'
  );
};

const placeMarkerAndPanTo = (position, map) => {
  const marker = new google.maps.Marker({ position, map });
  map.panTo(position);
};

const startNavigation = (map) => {
  const infoWindow = new google.maps.InfoWindow({ map });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // infoWindow.setPosition(currentPos);
      infoWindow.setContent('You are here.');
      map.setCenter(currentPos);
      // map.panTo(currentPos);
      map.setZoom(13);

      const personMarker = new google.maps.Marker(
        {
          map,
          position: currentPos,
          title: 'You are here',
        }
      );

      personMarker.addListener('click', () => {
        infoWindow.open(map, personMarker);
      });

      document.querySelector('.start-button').addEventListener('click', () => {
        onStart(map, currentPos, 0.03);
      });
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }, {
      timeout: 10000,
    },
  );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
};

function initMap() { 
  const Minsk = new google.maps.LatLng(53.9, 27.55);
  const mapContainer = document.querySelector('.map');
  const map = new google.maps.Map(mapContainer,
    {
      center: Minsk,
      zoom: 11,
      gestureHandling: 'cooperative', // for pc & mobile
      styles: mapStyles,
      ...controlPanelOptions,
    }
  );

  map.addListener('click', (event) => {
    placeMarkerAndPanTo(event.latLng, map);
  }); 

  google.maps.event.addDomListener(mapContainer, 'click', (event) => {
    console.log(event);
  });

  startNavigation(map);
}
