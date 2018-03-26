//Global variables declared to use in the functions
var map;
var infowindow;
var marker;
var openInfowindow;

function initMap() {
  //Scripts executed only after Google Maps API Loaded
  //Solution found at https://stackoverflow.com/questions/9228958/how-to-check-if-google-maps-api-is-loaded
  if (
    typeof window.google === "object" &&
    typeof window.google.maps === "object"
  ) {
    // Create a styles array to use with the map.
    //this is used from the udacity lesson on google maps
    //https://github.com/udacity/ud864/blob/master/Project_Code_5_BeingStylish.html
    var styles = [
      {
        featureType: "water",
        stylers: [{ color: "#19a0d8" }]
      },
      {
        featureType: "administrative",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }, { weight: 6 }]
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#e85113" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#efe9e4" }, { lightness: -40 }]
      },
      {
        featureType: "transit.station",
        stylers: [{ weight: 9 }, { hue: "#e85113" }]
      },
      {
        featureType: "road.highway",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ lightness: 100 }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ lightness: -100 }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ visibility: "on" }, { color: "#f0e4d3" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#efe9e4" }, { lightness: -25 }]
      }
    ];

    // Constructor creates a new map , and sets it on the element with the id of  "map"
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(51.509865, -0.118092),
      zoom: 13,
      styles: styles,
      mapTypeControl: false
    });

    //constructor for making Infowindow.
    infowindow = new google.maps.InfoWindow();
  } else {
    // Load error div using knockout if Google Map does not successfully load
    viewModel.mapUnavailable(true);
  }

  //for loop to loop over locations array length
  for (var i = 0; i <= viewModel.locations.length - 1; i++) {
    var self = viewModel.locations[i];
    //Create and initialize each maker
    viewModel.locations[i].marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.lat, self.lng),
      map: map,
      title: self.title,
      id: self.id,
      animation: google.maps.Animation.DROP
    });

    //function to open and infowindow for a marker that is cliked
    openInfowindow = function(marker) {
      console.log(marker);
      map.setZoom(15);
      map.panTo(marker.getPosition());
      infowindow.setContent(marker.title);
      infowindow.open(map, marker);
      var CLIENT_ID_Foursquare =
        "?client_id=R3H3MUUIWWLSFXJ5JUEIBWL5VIXOC5WIIGVM5IUWBCHSYJCV&";
      var CLIENT_SECRET_Foursquare =
        "client_secret=DBV4IWA00JFZRIUUDNPS5K2VIQ33OST5EXNYMLD5QHEQ3ULX&";
      var id = marker.id;
      //the foursquare url to be passed to the 'url' parameter inside the ajax call below
      var foursquareurl =
        "https://api.foursquare.com/v2/venues/" +
        id +
        CLIENT_ID_Foursquare +
        CLIENT_SECRET_Foursquare +
        "v=20170801&" +
        "ll=51.5,-0.12";

      //Asynchronous call to get the information from the Foursquare API
      //populates the infowindow with the information returned in
      //the response object
      $.ajax({
        type: "GET",
        datatype: "jsonp",
        data: {},
        url: foursquareurl,
        success: function(data) {
          console.log(data);
          var address = data.response.venue.location.formattedAddress;
          var phone = data.response.venue.contact.phone;
          var phoneproperty;

          //check to see if phone number is available or
          //this is used from the udacity forum discussion
          //https://discussions.udacity.com/t/handling-venue-with-no-phone/305171
          if (phone !== undefined){
            phoneproperty = phone;
          }else {
            phoneproperty = "phone number unavailable";
          }
          infowindow.setContent(
            "<div>" +
              "<h4>" +
              marker.title +
              "</h4>" +
              "<h6>adress: " +
              address +
              "</h6>" +
              "<h6>phone: " +
              phoneproperty +
              "</h6>" +
              "</div>"
          );
          //animates the maker to bounce
          marker.setAnimation(google.maps.Animation.BOUNCE);
          //sets the time to stop animation
          setTimeout(function() {
            marker.setAnimation(null);
          }, 1500);
        },

        //error handling if information is unable to be retrieved
        //using the err object
        error: function(err) {
          console.log(err);
          infowindow.setContent(
            "<div>" + "<h4> Cannot Load Data </h4>" + "</div>"
          );
        }
      }); //end of ajax
    }; //end of openInfoWindow

    // event listner opens the infowindow when clicked
    this.addListener = google.maps.event.addListener(
      self.marker,
      "click",
      function() {
        openInfowindow(this);
        console.log(this);
      }
    );
  } //end of for loop
} //end of initmap function

// Fallback error handling method for Google Maps
mapError = function() {
  viewModel.mapUnavailable(true);
};
