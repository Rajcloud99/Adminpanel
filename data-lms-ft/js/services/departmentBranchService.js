/**
 * Created by manish on 7/1/17.
 */
materialAdmin.service('departmentBranchService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addDepartmentBranch = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.DEPARTMENTBRANCH_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.DEPARTMENTBRANCH_ADD, data, parseSuccessData, parseFailureData);
    };

    this.updateDepartmentBranch = function(id, data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.DEPARTMENTBRANCH_UPDATE+ id + JSON.stringify(data));
        HTTPConnection.put(URL.DEPARTMENTBRANCH_UPDATE+ id, data, parseSuccessData, parseFailureData);
    };

    this.deleteDepartmentBranch = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.DEPARTMENTBRANCH_DELETE+ id, data, parseSuccessData, parseFailureData);
    };
}]);
