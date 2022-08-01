/**
 * Created by manish on 30/8/16.
 */
materialAdmin.service('vendorMaintenanceService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        this.getVendorMaintenances = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get vendorMaintenances" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get vendorMaintenances" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.VENDORMAINTENANCE_GET + utils.prepareQeuryParams(oQuery) ;
            url_with_params = url_with_params + "&no_of_docs=10";
            //console.log("vendorMaintenance get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateVendorMaintenance = function(vendorMaintenance_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update vendorMaintenance" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update vendorMaintenance" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorMaintenance update called" + vendorMaintenance_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.VENDORMAINTENANCE_UPDATE + vendorMaintenance_id, data,
                parseSuccessResp, parseFailureResp);
        };

        this.addVendorMaintenance = function(vendorMaintenance, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add vendorMaintenance" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add vendorMaintenance" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorMaintenance add called " + JSON.stringify(vendorMaintenance));
            HTTPConnection.post(URL.VENDORMAINTENANCE_ADD, vendorMaintenance, parseSuccessResp, parseFailureResp);
        };

        this.deleteVendorMaintenance = function(vendorMaintenance, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete vendorMaintenance" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete vendorMaintenance" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorMaintenance delete called" + vendorMaintenance._id + " " + vendorMaintenance.full_name);
            HTTPConnection.delete(URL.VENDORMAINTENANCE_DELETE + vendorMaintenance._id, vendorMaintenance, parseSuccessResp, parseFailureResp);
        };

        this.getVendorMaintenanceNames = function(clientId,name,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.VENDORMAINTENANCE_GET_TRIM + "?name=" + name +"&" +"clientId="+clientId;
            //console.log("vendorMaintenance get names called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

    }]);
