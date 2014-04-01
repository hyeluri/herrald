function initialize() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(37.7710374, -122.437206,13)
  };

  var map = new google.maps.Map(document.getElementById('mapcanvas'),
      mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&AIzaSyCE1jgGFgzeIwmGYUswUxxgvet4EGfjEik&sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;


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
