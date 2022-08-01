/**
 * Created by manish on 30/8/16.
 */
/**
 * Created by manish on 30/8/16.
 */
materialAdmin.service('vendorFuelService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        this.getVendorFuels = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get vendorFuels" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get vendorFuels" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.VENDORFUEL_GET  + utils.prepareQeuryParams(oQuery) ;
            url_with_params = url_with_params + "&no_of_docs=10";
            //console.log("vendorFuel get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.getAllFuelVendors = function(sUser,success) {
            var sUR = URL.VENDORFUEL_GET + "?all=true";

            HTTPConnection.get(sUR, success);
        }

        this.getAllVendorFuels = function(sUser,success) {
            var sURL = URL.VENDORFUEL_GET;
            if(sUser){
              sURL = sURL + "?name="+ sUser;
            }
            HTTPConnection.get(sURL, success);
        }

        this.updateVendorFuel = function(vendorFuel_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update vendorFuel" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update vendorFuel" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorFuel update called" + vendorFuel_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.VENDORFUEL_UPDATE + vendorFuel_id, data,
                parseSuccessResp, parseFailureResp);
        };

        this.addVendorFuel = function(vendorFuel, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add vendorFuel" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add vendorFuel" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorFuel add called " + JSON.stringify(vendorFuel));
            HTTPConnection.post(URL.VENDORFUEL_ADD, vendorFuel, parseSuccessResp, parseFailureResp);
        };

        this.deleteVendorFuel = function(vendorFuel, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete vendorFuel" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete vendorFuel" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorFuel delete called" + vendorFuel._id + " " + vendorFuel.full_name);
            HTTPConnection.delete(URL.VENDORFUEL_DELETE + vendorFuel._id, vendorFuel, parseSuccessResp, parseFailureResp);
        };

        this.getVendorFuelNames = function(clientId,name,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.VENDORFUEL_GET_TRIM + "?name=" + name +"&" +"clientId="+clientId;
            //console.log("vendorFuel get names called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.addFuelStation = function(data, succes, failure) {
            HTTPConnection.post(URL.ADD_FUEL_STATION, data, succes, failure);
        }
        this.GetFuelStationAll = function(vendorId,success, failure) {
            HTTPConnection.get(URL.FUEL_STATION_GET + '?vendorId=' + vendorId, success, failure);
        };

		this.GetFuelStationObj = function(oQuery, success, failure) {
			HTTPConnection.get(URL.FUEL_STATION_GET + utils.prepareQeuryParams(oQuery), success, failure);
		};

        this.updateFuelStation = function(data, success, failure) {
            HTTPConnection.put(URL.FUEL_STATION_UPDATE + "/" + data._id, data, success, failure);
        }
        this.deleteFuelStation = function(data, success, failure) {
            HTTPConnection.delete(URL.FUEL_STATION_DELETE + "/" + data._id, data, success, failure);
        }
        this.editVendorFuel = function(data, success, failure) {
            HTTPConnection.put(URL.FUEL_VENDOR_UPDATE + "/" + data._id, data, success, failure);
        }

    }]);
