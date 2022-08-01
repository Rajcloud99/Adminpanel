/**
 * Created by manish on 23/12/16.
 */
/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('partCategoryService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addPartCategory = function(data, success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.post(URL.PARTCATEGORY_ADD, data, parseSuccessData, parseFailureData);
    };

    this.getPartCategories = function(objFilter,success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.PARTCATEGORY_GET + "?all=true&sort=-1" + prepareQueryParams(objFilter);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updatePartCategory = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.put(URL.PARTCATEGORY_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deletePartCategory = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.PARTCATEGORY_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getPartCategoryByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.PARTCATEGORY_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getPartCategoryTrim = function(success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.PARTCATEGORY_GET + "?all=true&trim=true";
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
