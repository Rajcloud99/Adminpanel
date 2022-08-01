/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('maintenanceVendorService_', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addMaintenanceVendor = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.MAINTENANCEVENDOR_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.MAINTENANCEVENDOR_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getMaintenanceVendors = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MAINTENANCEVENDOR_GET + "?sort=created_at:-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getMaintenanceVendorsAll = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MAINTENANCEVENDOR_GET + "?sort=-1&all=true" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateMaintenanceVendor = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.MAINTENANCEVENDOR_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.MAINTENANCEVENDOR_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteMaintenanceVendor = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.MAINTENANCEVENDOR_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getMaintenanceVendorByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MAINTENANCEVENDOR_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
