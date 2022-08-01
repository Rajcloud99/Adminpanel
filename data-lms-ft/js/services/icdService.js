/**
 * Created by manish on 31/8/16.
 */
/**
 * Created by manish on 30/8/16.
 */
materialAdmin.service('icdService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        this.getICDs = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get icds" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get icds" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.ICD_GET + utils.prepareQeuryParams(oQuery) ;
            //url_with_params = url_with_params + "&no_of_docs=2";
            //console.log("icd get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateICD = function(icd_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update icd" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update icd" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("icd update called" + icd_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.ICD_UPDATE + icd_id, data,
                parseSuccessResp, parseFailureResp);
        };

        this.addICD = function(icd, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add icd" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add icd" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("icd add called " + JSON.stringify(icd));
            HTTPConnection.post(URL.ICD_ADD, icd, parseSuccessResp, parseFailureResp);
        };

        this.deleteICD = function(icd, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete icd" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete icd" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("icd delete called" + icd._id + " " + icd.full_name);
            HTTPConnection.delete(URL.ICD_DELETE + icd._id, icd, parseSuccessResp, parseFailureResp);
        };

        this.getICDNames = function(clientId,name,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.ICD_GET + "?name=" + name +"&" +"clientId="+clientId;
            //console.log("icd get names called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

    }]);
