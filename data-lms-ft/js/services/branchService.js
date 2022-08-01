/**
 * Created by manish on 1/8/16.
 */
materialAdmin.service('branchService', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage','otherUtils',
    function($rootScope, HTTPConnection, URL, $localStorage, otherUtils) {

        this.getAllBranches = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.BRANCH_GET + "" + otherUtils.prepareQeuryParams(oQuery);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.getBranches = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.BRANCH_GET + otherUtils.prepareQeuryParams(oQuery);
            url_with_params = url_with_params + "&no_of_docs=10";
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };


        this.updateBranch = function(branch, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.put(URL.BRANCH_UPDATE+branch._id, branch, parseSuccessResp, parseFailureResp);
        };

        this.addBranch = function(branch, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.BRANCH_ADD, branch, parseSuccessResp, parseFailureResp);
        };

        this.enableDisableBranch = function(branch, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.ENABLE_DISABLE + branch._id, branch, parseSuccessResp, parseFailureResp);
        };

        this.deleteBranch = function(branch, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.delete(URL.BRANCH_DELETE +branch._id, branch, parseSuccessResp, parseFailureResp);
        };

        this.getBranchesTrim = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.BRANCH_GET_TRIM + otherUtils.prepareQeuryParams(oQuery);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.getMaintenancesBranchesTrim = function(success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.BRANCH_MAINTENANCE_GET;
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };
    }
]);
