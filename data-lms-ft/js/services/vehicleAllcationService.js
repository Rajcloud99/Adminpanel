materialAdmin.service('vehicleAllcationService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

  function prepareParameters(oFilters){
    var sParam = "";
    for(var property in oFilters){
      sParam = sParam +"&"+ property +"="+oFilters[property];
    }
    return sParam;
  }

  this.getAllVehicles = function(success, fail) {
    var url_with_params = URL.VEHICLE;
    HTTPConnection.get(url_with_params, success, fail);
  }
  this.getAllBookingsItems = function(oFilter,oFilters,success,failure) {
    if(oFilter && oFilter.allocated && oFilter.unAllocated){
      var url_with_params = URL.BOOKING_ITEMS+"?"+prepareParameters(oFilters);
    } else if(oFilter && oFilter.allocated ){
      var url_with_params = URL.BOOKING_ITEMS + "?allocated=true"+prepareParameters(oFilters);
    } else if(oFilter && oFilter.unAllocated){
      var url_with_params = URL.BOOKING_ITEMS + "?allocated=false"+prepareParameters(oFilters);
    } else if (!oFilter.allocated && !oFilter.unAllocated){
      var url_with_params = URL.BOOKING_ITEMS + "?" +prepareParameters(oFilters);
    }

    HTTPConnection.get(url_with_params, success,failure);
   }

   this.getBookingItem = function(oFilter,success,failure) {
    var url_with_params = URL.BOOKING_ITEMS + "?"+prepareParameters(oFilter);

    HTTPConnection.get(url_with_params, success,failure);
   }
  this.postAllocate = function(Allote, succes,failure) {
      HTTPConnection.post(URL.ALLOTE_VEHICLE, Allote, succes,failure);
  };
  this.postDeAllocate = function(DeAllote, succes,failure) {
      HTTPConnection.post(URL.DEALLOTE_VEHICLE, DeAllote, succes,failure);
  };
  this.getAllBookings = function(oFilter,success,failure) {
        HTTPConnection.get(URL.BOOKING_GET+"?bookingId="+oFilter.bookingId, success,failure);
  }

	this.vehicleAllocationServ = function(Allote, succes,failure) {
		HTTPConnection.post(URL.VEHICLE_ALLOCATE, Allote, succes,failure);
	};

  this.createTrip = function(Allote, succes,failure) {
		HTTPConnection.post(URL.CREATE_TRIP, Allote, succes,failure);
	};
}]);
