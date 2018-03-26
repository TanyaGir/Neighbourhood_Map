//Object Constructor Class for Locations
var Locations = function(title, lat, lng, id, marker) {
  this.title = title;
  this.lat = lat;
  this.lng = lng;
  this.id = id;
  this.marker = marker;
};

//the viewmodel with all the observables placed on the view
var viewModel = {
  //locations array with the locations name, lat, lng and id
  locations: [
    new Locations(
      "The Corner Cafe",
      51.495678785334476,
      -0.11500365969823187,
      "4ad48899f964a52021e820e3"
    ),
    new Locations(
      "Scooter Caffe",
      51.50050110129609,
      -0.11393191896812872,
      "4ace5183f964a520d5cf20e3"
    ),
    new Locations(
      "Starbucks",
      51.501962,
      -0.117661,
      "4bc0539e920eb71357ca182c"
    ),
    new Locations(
      "Greensmiths",
      51.500994602547856,
      -0.1124067731852665,
      "4ad74e64f964a5205c0921e3"
    ),
    new Locations(
      "The White Hart",
      51.50471254796318,
      -0.11066542492674517,
      "4ac518c0f964a5209ba320e3"
    )
  ],

  //observable on the search box to run search on the locations array
  searchBox: ko.observable(""),

  //obsevable on the menu inorder to make toggling of the menu happen
  visibleMenu: ko.observable(false),

  //this is a observalbe to handle the click event on the list item
  clickEventHandlerFunction: function() {
    openInfowindow(this.marker);
  },

  //observable to determine if error div should be shown
  mapUnavailable: ko.observable(false)
};

//function to toggle the menu bar on the side
viewModel.clickToggleButton = function() {
  var self = this;
  this.visibleMenu(!this.visibleMenu());
};

//function to perform search and filter from locations array and to set the marker on the map as per the serach
//solution for this search found at
//https://www.codeproject.com/Articles/822879/Searching-filtering-and-sorting-with-KnockoutJS-in
viewModel.search = ko.computed(function() {
  var self = this;
  var searchResult = this.searchBox().toLowerCase();
  return ko.utils.arrayFilter(self.locations, function(markerLocation) {
    var title = markerLocation.title.toLowerCase();
    var matched = title.indexOf(searchResult) > -1;
    var marker = markerLocation.marker;
    if (marker) {
      marker.setVisible(matched);
    }
    console.log(markerLocation.marker);
    return matched;
  });
}, viewModel);

ko.applyBindings(viewModel);
