/**
 * Created by manish on 30/8/16.
 */
materialAdmin.service('vendorCourierService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        function prepareParameters(oFilter) {
            var sParam = "";

            for (var property in oFilter) {
                sParam = sParam + "&" + property + "=" + oFilter[property];
            }
            return sParam;
        }

        this.getVendorCouriers = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get vendorCouriers" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get vendorCouriers" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.VENDORCOURIER_GET + utils.prepareQeuryParams(oQuery) ;
            url_with_params = url_with_params + "&no_of_docs=10";
            //console.log("vendorCourier get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateVendorCourier = function(vendorCourier_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update vendorCourier" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update vendorCourier" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorCourier update called" + vendorCourier_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.VENDORCOURIER_UPDATE + vendorCourier_id, data,
                parseSuccessResp, parseFailureResp);
        };

        this.updateCourierOffice = function(CourierOffice, success, failure) {

            HTTPConnection.put(URL.VENDORCOURIER_OFFICES_UPDATE+$rootScope.updateOfficeId, CourierOffice, success, failure);
        };

        this.addVendorCourier = function(vendorCourier, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add vendorCourier" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add vendorCourier" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("vendorCourier add called " + JSON.stringify(vendorCourier));
            HTTPConnection.post(URL.VENDORCOURIER_ADD, vendorCourier, parseSuccessResp, parseFailureResp);
        };

        this.addCourierOffice = function(CourierOffice, success, failure) {

            HTTPConnection.post(URL.VENDORCOURIER_OFFICES_ADD, CourierOffice, success, failure);
        };

        this.deleteVendorCourier = function(vendorCourier, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete vendorCourier" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete vendorCourier" + JSON.stringify(data));
                failure(data.data);
            };
           // console.log("vendorCourier delete called" + vendorCourier._id + " " + vendorCourier.full_name);
            HTTPConnection.delete(URL.VENDORCOURIER_DELETE + vendorCourier._id, vendorCourier, parseSuccessResp, parseFailureResp);
        };

        this.GetCourierOfficeAll = function(data,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.VENDORCOURIER_OFFICES_GET+"?&courier_vendor_id="+data.courier_vendor_id;
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

    }]);
