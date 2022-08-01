/**
 * Created by manish on 21/1/17.
 */

materialAdmin.service('structureMasterService',
    ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addStructureMaster = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.STRUCTUREMASTER_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.STRUCTUREMASTER_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getStructureMasters = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.STRUCTUREMASTER_GET + "?sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateStructureMaster = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.STRUCTUREMASTER_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.STRUCTUREMASTER_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteStructureMaster = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.STRUCTUREMASTER_DELETE+ id, data, parseSuccessData, parseFailureData);
    };
}]);
