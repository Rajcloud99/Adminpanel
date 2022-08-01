/**
 * Created by manish on 21/1/17.
 */

materialAdmin.service('trailerMasterService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addTrailerMaster = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.TRAILERMASTER_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.TRAILERMASTER_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getTrailerMasters = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.VEHICLE + "?category=Trailer&sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getTrailerMastersALL = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.VEHICLE + "?category=Trailer&all=true&sort=-1" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getTrailerMastersAvailable = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.VEHICLE + "?all=true&category=Trailer&sort=-1&associationFlag=false" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateTrailerMaster = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.TRAILERMASTER_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.TRAILERMASTER_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteTrailerMaster = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.TRAILERMASTER_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getTrailerMasterByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //var urlWithParams = URL.TRAILERMASTER_GET + "?name=" + nameSearched;
        var urlWithParams = URL.VEHICLE + "?category=Trailer&vehicle_reg_no=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
