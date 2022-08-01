materialAdmin.service('tripLocatioService', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage', function($rootScope, HTTPConnection, URL, $localStorage) {
    function prepareParameters(oFilter){
        var sParam = "";

        for(var property in oFilter){
            sParam = sParam +"&"+ property +"="+oFilter[property];
        }
        return sParam;
    }

    this.getAllTripLocations = function(oFilter, success,fail) {
        var url_with_params = URL.MASTER_TRIP_LOC_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success,fail);
    }

	this.getTripLocations = function(name, success,fail) {
		var url_with_params = URL.MASTER_TRIP_LOC_GET + "?name=" + name;
		HTTPConnection.get(url_with_params, success,fail);
	}

    this.addTripLocation = function(data, succes, failure) {
        HTTPConnection.post(URL.MASTER_TRIP_LOC_ADD, data, succes, failure);
    }

    this.updateTripLocations = function(data, success, failure) {
        HTTPConnection.put(URL.MASTER_TRIP_LOC_UPDATE+$rootScope.tripLocationId,data, success, failure);
    }
	this.getLocName = function(sUser,suc,fail) {
		var sURL = URL.MASTER_TRIP_LOC_GET;
		if(sUser){
			sURL = sURL + "?name="+ sUser;
		}
		HTTPConnection.get(sURL, suc,fail);
	};

    this.getCname = function(sUser,suc,fail) {
    var sURL = URL.CUSTOMER;
        if(sUser){
          sURL = sURL + "?name="+ sUser;
        }
      HTTPConnection.get(sURL, suc,fail);
    };
}]);
