/**
 * Created by manish on 29/12/16.
 */
/**
 * Created by manish on 28/12/16.
 */

materialAdmin.service('taskService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addTask = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.TASKMASTER_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.TASKMASTER_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getTasks = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TASKMASTER_GET + "?sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getTasksAll = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TASKMASTER_GET + "?sort=-1&all=true" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.updateTask = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.TASKMASTER_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.TASKMASTER_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteTask = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.TASKMASTER_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getTaskByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TASKMASTER_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };
}]);
