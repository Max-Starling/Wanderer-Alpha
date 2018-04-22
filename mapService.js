function initMap() { 
  const Minsk = new google.maps.LatLng(53.9, 27.55);
  const mapContainer = document.querySelector('.map');
  const map = new google.maps.Map(mapContainer,
    {
    // center: {
    //   lat: 53.9,
    //   lng: 27.55,
    // },
    center: Minsk,
    zoom: 11,
    gestureHandling: 'cooperative', // for mobile
    styles: mapStyles,
    // disableDefaultUI: true,
    ...controlPanelOptions,
    }
  );
  console.log(map);
  map.addListener('click', (event) => {
    placeMarkerAndPanTo(event.latLng, map);
  }); 

  google.maps.event.addDomListener(mapContainer, 'click', (event) => {
    console.log(event);
  });

  const infoWindow = new google.maps.InfoWindow({ map });

  // HTML5 geolocation
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
      
      // map.addListener('center_changed', () => {
      //   window.setTimeout(() => {
      //     map.panTo(personMarker.getPosition());
      //   }, 5000);
      // });

      const onStart = (r) => {
        const directionAngle = Math.random() * 2 * Math.PI;
        const targetMarkerPos = {
          lat: currentPos.lat + r * Math.sin(directionAngle),
          lng: currentPos.lng + 2 * r * Math.cos(directionAngle),
        }

        const targetNarkerIcon = {
          url: 'https://i.imgur.com/REOaN41.png',
          size: new google.maps.Size(84, 120),
          scaledSize: new google.maps.Size(42, 60),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 60)
        }

        const targetMarker = new google.maps.Marker(
          {
            map,
            position: targetMarkerPos,
            title: 'It\'s your target',
            icon: targetNarkerIcon,
          }
        )
  
        map.panTo(
          {
            lat: (targetMarkerPos.lat + currentPos.lat) / 2,
            lng: (targetMarkerPos.lng + currentPos.lng) / 2,
          }
        )
      };

      const startButton = document.querySelector('.start-button');
      startButton.addEventListener('click', () => onStart(0.03))
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }, {
      timeout: 10000,
    },
  );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, currentPos) {
  infoWindow.setPosition(currentPos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.'
  );
}

function placeMarkerAndPanTo(position, map) {
  var marker = new google.maps.Marker({
    position,
    map
  });
  map.panTo(position);
}
