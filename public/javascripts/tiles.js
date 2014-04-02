// var map;
// var geocoder;

//initialize google map
// function initialize() {
//   // var mapOptions = {
//   //   zoom: 13,
//   //   center: new google.maps.LatLng(37.7710374, -122.437206,13)
//   // };

//   // var map = new google.maps.Map(document.getElementById('mapcanvas'),
//   //     mapOptions);

//    map = new google.maps.Map(document.getElementById('mapcanvas'), {
//     center: new google.maps.LatLng(37.7710374, -122.437206,13),
//     zoom: 13
//   });

  
//   console.log(geocoder);

//   google.maps.event.addListenerOnce(map, 'bounds_changed', codeAddress);
// }

// //geocode addresses and display markers on google map
// function codeAddress(allData) {
//   var locations = [
//                     '1st at mission, san francisco, CA',
//                     'Octavia at Page, san francisco, CA',
//                     'cole at carl, san francisco, CA',
//                     '845 Market Street, san francisco, CA',
//                     '833 Market St, san francisco, CA',
//                     '865 Market St., san francisco, CA',
//                     'Green Street at Sansome, san francisco, CA',
//                     '645 Harrison St, san francisco, CA',
//                   ];

//   var infowindow = new google.maps.InfoWindow();


//   var geoLocations = function(i, results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       //map.setCenter(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location,
//         title: locations[i]
//       });

//       google.maps.event.addListener(marker, 'click', function() {
//           infowindow.setContent(this.title);
//           infowindow.open(map, this);
//       });
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   };

//   for (var i = 0; i < 7; i++) {
//     var geoCodeObj = {};
//     geoCodeObj.address = locations[i];       
//     geocoder.geocode(geoCodeObj, geoLocations.bind(this, i));
//   }
   
// }

// function loadScript() {
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&AIzaSyCE1jgGFgzeIwmGYUswUxxgvet4EGfjEik&libraries=places&sensor=false&' +
//       'callback=initialize';
//   document.body.appendChild(script);
// }
// window.onload = loadScript;
//google.maps.event.addDomListener(window, 'load', initialize);

$( function() { 
  //google map variables
  var map;
  var geocoder;

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&AIzaSyCE1jgGFgzeIwmGYUswUxxgvet4EGfjEik&libraries=places&sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
  console.log("1");
}

 loadScript();

  //initialize google map
  var initialize = function() {
     map = new google.maps.Map(document.getElementById('mapcanvas'), {
      center: new google.maps.LatLng(37.7710374, -122.437206,13),
      zoom: 13
    });

    geocoder = new google.maps.Geocoder();
    console.log("2");
   // google.maps.event.addListenerOnce(map, 'bounds_changed', codeAddress);
    console.log("3");

    parseData();

  };

  //geocode addresses and display markers on google map
  var codeAddress = function(allData) {
    console.log("4");
    var locationAndDesc = [];

    //create an array. Append city and state to correctly geocode. Also include title and body text in array for map infobox
    for (var j = 0; j < allData.length; j++) {
      locationAndDesc.push([allData[j].map+",San Francisco, CA",allData[j].title+allData[j].mapDesc]);
    }
   
    var infowindow = new google.maps.InfoWindow();

    var geoLocations = function(i, results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: locationAndDesc[i][1]
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.title);
            infowindow.open(map, this);
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    };

    for (var i = 0; i < 30; i++) {
      var geoCodeObj = {};
      geoCodeObj.address = locationAndDesc[i][0];
      //throttle calls to google api because otherwise it hits limit after 10calls/sec
      setTimeout((function(i, geoCodeObj){
        return function(){
          geocoder.geocode(geoCodeObj, geoLocations.bind(this, i));
        };
      })(i, geoCodeObj), i*700);
    }
     
  };

  //attach call back function for google maps to window and kick off initializing.

  window.initialize = initialize;
  
  //parsing data sent from server which is currently stored in a script tag of the index page
  var parseData = function(){
    var allData = $('#allData').html();
    allData = JSON.parse(allData);
    codeAddress(allData);
  };

  //****** functions for animating tiles ****\\
  var transitionProp = getStyleProperty('transition');
  var transitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'otransitionend',
    transition: 'transitionend'
  }[ transitionProp ];


  var container = document.querySelector('.js-masonry');
  var testC = document.querySelector('.test');
  var msnry = new Masonry( container, {
    itemSelector: '.tile',
    columnWidth: '.grid-sizer'
  });

  eventie.bind( container, 'click', function( event ) {
    // don't proceed if item content was not clicked on
    var target = event.target;
    //TODO: this is a hack..probably should be fixed correctly sometime
    if(target.tagName === 'P'|| target.tagName === 'H4'  ){
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

  var top = $('#notePad').offset().top - parseFloat($('#notePad').css('marginTop').replace(/auto/, 100));
  $(window).scroll(function (event) {
    // what the y position of the scroll is
    var y = $(this).scrollTop();

    // whether that's below the form
    if (y >= top) {
      // if so, ad the fixed class
      $('#notePad').addClass('fixed');
    } else {
      // otherwise remove it
      $('#notePad').removeClass('fixed');
    }
  });

  
});
