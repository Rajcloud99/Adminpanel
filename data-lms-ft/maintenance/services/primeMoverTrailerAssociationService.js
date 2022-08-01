/**
 * Created by manish on 3/2/17.
 */

materialAdmin.service('primeMoverTrailerAssociationService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addPrimeMoverTrailerAssociation = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.PRIMEMOVERTRAILERASSOCIATION_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.PRIMEMOVERTRAILERASSOCIATION_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getPrimeMoverTrailerAssociations = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.PRIMEMOVERTRAILERASSOCIATION_GET + "?sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updatePrimeMoverTrailerAssociation = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.PRIMEMOVERTRAILERASSOCIATION_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.PRIMEMOVERTRAILERASSOCIATION_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deletePrimeMoverTrailerAssociation = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.PRIMEMOVERTRAILERASSOCIATION_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getPrimeMoverTrailerAssociationByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.PRIMEMOVERTRAILERASSOCIATION_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
