/**
 * Created by manish on 29/8/16.
 */
/**
 * Created by manish on 26/8/16.
 */

materialAdmin.service('departmentService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        this.getDepartments = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get departments" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get departments" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.DEPARTMENT_GET +utils.prepareQeuryParams(oQuery);
            //console.log("department get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.addDepartment = function( departmentData, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add department" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add department" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("department add called  clientId"  + JSON.stringify(departmentData));
            HTTPConnection.post(URL.DEPARTMENT_ADD, departmentData, parseSuccessResp, parseFailureResp);
        };

        this.updateDepartment = function(department_id, departmentData, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update department" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update department" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("department update called department_id" + department_id  + JSON.stringify(departmentData));
            HTTPConnection.put(URL.DEPARTMENT_UPDATE +department_id, departmentData, parseSuccessResp, parseFailureResp);
        };

        this.deleteDepartment = function(department_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete department" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete department" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("department delete called id " + department_id );
            var url_with_params = URL.DEPARTMENT_DELETE + department_id;
            HTTPConnection.delete(url_with_params, data, parseSuccessResp, parseFailureResp);
        };

        this.getDepartmentTrims = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.DEPARTMENT_GET_TRIM + utils.prepareQeuryParams(oQuery);
            //console.log("department get names called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

    }]);
