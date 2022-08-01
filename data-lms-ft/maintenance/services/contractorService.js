/**
 * Created by manish on 23/12/16.
 */
/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('contractorService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addContractor = function(data, success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.post(URL.CONTRACTOR_ADD, data, parseSuccessData, parseFailureData);
    };

    this.getContractorServ = function(objFilter,success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.CONTRACTOR_GET + "?all=true&sort=-1" + prepareQueryParams(objFilter);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateContract = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.put(URL.CONTRACTOR_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

}]);
