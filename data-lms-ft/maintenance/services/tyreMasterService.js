/**
 * Created by manish on 21/1/17.
 */
/**
 * Created by manish on 22/12/16.
 */
materialAdmin.service('tyreMasterService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addTyreMaster = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.TYREMASTER_ADD+JSON.stringify(data));
        HTTPConnection.post(URL.TYREMASTER_ADD, data, parseSuccessData,parseFailureData);
    };

    this.getTyreMasters = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYREMASTER_GET + "?sort=-1&no_of_docs=15" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getAllTyreMasters = function(data,success, failure) {
        function parseSuccessData(data){
           // console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYREMASTER_GET + "?sort=-1&all=true";
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };


    this.getAllTyre = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYREMASTER_GET + "?sort=-1&all=true" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.getAllTyreRepoBin = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYREMASTER_GET + "?sort=-1&status=Repository Bin" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

	this.getStructureByVehicleNo = function(objFilter,success, failure) {
		function parseSuccessData(data){
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		var urlWithParams = URL.GET_ASSO_VEH + "?" + prepareQueryParams(objFilter);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};


    this.updateTyreMaster = function(data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.TYREMASTER_UPDATE+'/'+data.id + JSON.stringify(data));
        HTTPConnection.put(URL.TYREMASTER_UPDATE+'/'+data.id , data, parseSuccessData, parseFailureData);
    };

    this.deleteTyreMaster = function(id, data, success, failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.delete(URL.TYREMASTER_DELETE+ id, data, parseSuccessData, parseFailureData);
    };

    this.getTyreMasterByNameSearch = function(nameSearched,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYREMASTER_GET + "?name=" + nameSearched;
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.addTyreInward = function(data, succes,failure) {
        HTTPConnection.post(URL.ADD_TYRE, data, succes,failure);
    };

    this.issueTyreRetreat = function(data, success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called add : " + URL.TYRE_ISSUE_RETREATED+JSON.stringify(data));
        HTTPConnection.post(URL.TYRE_ISSUE_RETREATED, data, parseSuccessData,parseFailureData);
    };

    this.getAllReIssueTyr = function(objFilter,success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var urlWithParams = URL.TYRE_ISSUE_RETREATED_GET + "?sort=-1&all=true" + prepareQueryParams(objFilter);
        //console.log("called get : "+urlWithParams);
        HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
    };

    this.returnTyreRetreat = function(data, success, failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        //console.log("called update : "+URL.TYRE_RETURN_RETREATED+"/"+data._id + JSON.stringify(data));
        HTTPConnection.put(URL.TYRE_RETURN_RETREATED+"/"+data._id, data, parseSuccessData, parseFailureData);
    };

}]);
