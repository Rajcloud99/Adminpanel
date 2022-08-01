/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('mechanicService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addMechanic = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.MECHANIC_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.MECHANIC_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getMechanics = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET + "?sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getMechanicsAll = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET + "?sort=-1" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getMechanicsByUser = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET_BY_USER + "?user_type=Mechanic" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getSupervisorByUser = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET_BY_USER + "?user_type=Superviser" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getSupervisorByUser = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET_BY_USER + "?user_type=Supervisor" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateMechanic = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.MECHANIC_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.MECHANIC_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteMechanic = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.MECHANIC_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getMechanicByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MECHANIC_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
