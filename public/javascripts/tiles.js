var map;
var geocoder;


function initialize() {
  // var mapOptions = {
  //   zoom: 13,
  //   center: new google.maps.LatLng(37.7710374, -122.437206,13)
  // };

  // var map = new google.maps.Map(document.getElementById('mapcanvas'),
  //     mapOptions);

   map = new google.maps.Map(document.getElementById('mapcanvas'), {
    center: new google.maps.LatLng(37.7710374, -122.437206,13),
    zoom: 13
  });

  infoWindow = new google.maps.InfoWindow();

  geocoder = new google.maps.Geocoder();

  google.maps.event.addListenerOnce(map, 'bounds_changed', codeAddress);
}

function codeAddress() {
  var locations = [
                    '1st at mission, san francisco, CA',
                    'Octavia at Page, san francisco, CA',
                    'cole at carl, san francisco, CA',
                    '845 Market Street, san francisco, CA',
                    '833 Market St, san francisco, CA',
                    '865 Market St., san francisco, CA',
                    'Green Street at Sansome, san francisco, CA',
                    '645 Harrison St, san francisco, CA',
                  ];

  var infowindow = new google.maps.InfoWindow();


  var geoLocations = function(i, results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results);
      map.setCenter(results[0].geometry.location);

      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: locations[i]
      });

      google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(this.title);
          infowindow.open(map, this);
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  };

  for (var i = 0; i < 7; i++) {
    var geoCodeObj = {};
    geoCodeObj.address = locations[i];       
    geocoder.geocode(geoCodeObj, geoLocations.bind(this, i));
  }
   
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&AIzaSyCE1jgGFgzeIwmGYUswUxxgvet4EGfjEik&libraries=places&sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
}

// function performSearch() {
//   var sanFran = new google.maps.LatLng(37.7710374, -122.437206,13);
//   var request = {
//     //bounds: map.getBounds(),
//     location:sanFran,
//     radius:2000,
//     keyword: 'att park'
//   };
//   service.radarSearch(request, callback);
// }

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  console.log(results);
  for (var i = 0, result; result = results[i]; i++) {
    var marker = new google.maps.Marker({
      map: map,
      position: result.geometry.location
    });
  }
}

 window.onload = loadScript;
//google.maps.event.addDomListener(window, 'load', initialize);


//****** functions for animating tiles ****\\

var transitionProp = getStyleProperty('transition');
var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProp ];

docReady( function() {

  var container = document.querySelector('.js-masonry');
  var testC = document.querySelector('.test');
  var msnry = new Masonry( container, {
    itemSelector: '.tile',
    columnWidth: '.grid-sizer'
  });

  eventie.bind( container, 'click', function( event ) {
    console.log("evemt",event.target.parentNode);
    // don't proceed if item content was not clicked on
    var target = event.target;
    //TODO: this is a hack..probably should be fixed correctly sometime
    if(target.tagName === 'P'  ){
      target = target.parentNode;
    }

    if ( !classie.has( target, 'tile-content' )  ) {
      return;
    }

    var previousContentSize = getSize( target );
    // disable transition
    target.style[ transitionProp ] = 'none';
    // set current size
    target.style.width = previousContentSize.width + 'px';
    target.style.height = previousContentSize.height + 'px';

    var itemElem = target.parentNode;
    classie.toggleClass( itemElem, 'is-expanded' );

    // force redraw
    var redraw = target.offsetWidth;
    // renable default transition
    target.style[ transitionProp ] = '';

    // reset 100%/100% sizing after transition end
    if ( transitionProp ) {
      var onTransitionEnd = function() {
        target.style.width = '';
        target.style.height = '';
        target.removeEventListener( transitionEndEvent, onTransitionEnd, false );
      };
      target.addEventListener( transitionEndEvent, onTransitionEnd, false );
    }

    // set new size
    var size = getSize( itemElem );
    target.style.width = size.width + 'px';
    target.style.height = size.height + 'px';
    redraw = null; // for JSHint

    msnry.layout();
  });

  
});
