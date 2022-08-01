materialAdmin.service('FleetService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {
    function prepareParameters(oFilter) {
        var sParam = "";
        for (var property in oFilter) {
            sParam = sParam + "&" + property + "=" + oFilter[property];
        }
        return sParam;
    }

    this.getFleetWithPagination = function(oFilter, success) {
        this.getFleet = function(data) {
            success(data.data);
        };
        var url_with_params = URL.FLEET_GET + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getFleet);
    };

    this.updateFleet = function(data, success, failure) {
        HTTPConnection.put(URL.FLEET_UPDATE + "/" + data._id, data, success, failure);
    };

    this.deleteFleet = function(data, success, failure) {
        HTTPConnection.delete(URL.FLEET_DELETE + "/" + data._id, data, success, failure);
    };

    this.saveFleet = function(data, succes, failure) {
        HTTPConnection.post(URL.FLEET_SAVE, data, succes, failure);
    };

    this.fleetSegment = function(data, succes, failure) {
		HTTPConnection.post(URL.VEHICLE_FLEET_SEGMENT, data, succes, failure);
	};

    this.getName = function(sName, suc, fail) {
        var sURL = URL.FLEET_GET;
        if (sName) {
            sURL = sURL + "?name=" + sName;
        }
        HTTPConnection.get(sURL, suc, fail);
    };
}]);