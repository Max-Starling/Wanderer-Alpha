const initDirectionsService = (map, origin, destination) => {
  const directionsRequest = {
    origin,
    destination,
    provideRouteAlternatives: true,
    travelMode: 'WALKING',
    unitSystem: google.maps.UnitSystem.METRIC,
    // avoidTolls: true,
    // region: 'BY',
  };

  const directionsService = new google.maps.DirectionsService();

  const dashedLineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 1.7,
  };

  const pathPolyline = new google.maps.Polyline({
    strokeColor: '#4F4F4F',
    strokeOpacity: 0,
    icons: [{
      icon: dashedLineSymbol,
      offset: '0',
      repeat: '7px'
    }],
    strokeWeight: 2,
  });

  const directionsDisplay = new google.maps.DirectionsRenderer({
    polylineOptions: pathPolyline,
    preserveViewport: true,
    suppressMarkers: true,
  });

  directionsDisplay.setMap(map);
  directionsService.route(directionsRequest, (result, status) => {
    console.log(result);
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
};
