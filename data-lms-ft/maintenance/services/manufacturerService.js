/**
 * Created by manish on 23/12/16.
 */
/**
 * Created by manish on 23/12/16.
 */
/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('manufacturerService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addManufacturer = function(data, success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.post(URL.MANUFACTURER_ADD, data, parseSuccessData, parseFailureData);
    };

    this.getManufacturers = function(objFilter,success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MANUFACTURER_GET + "?no_of_docs=10&sort=-1" + prepareQueryParams(objFilter);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateManufacturer = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.put(URL.MANUFACTURER_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteManufacturer = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.MANUFACTURER_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getManufacturerByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.MANUFACTURER_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
