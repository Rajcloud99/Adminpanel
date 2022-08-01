/**
 * Created by bharath on 29/04/17.
 */

materialAdmin.service('tyreIssueService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

	function prepareQueryParams(objFilter){
		var strParam = "";
		for(var key in objFilter){
			strParam = strParam +"&"+ key +"="+objFilter[key];
		}
		return strParam;
	}

	this.issue = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.ISSUE_TYRE+JSON.stringify(data));
		HTTPConnection.post(URL.ISSUE_TYRE, data, parseSuccessData,parseFailureData);
	};

	this.getIssuedTyreDetail = function(dataT,parseSuccessData, parseFailureData) {
		var urlWithParams = URL.GET_ISSUED_TYRE + "?tyre_number=" + dataT.tyre_number;
		//console.log("called get : "+urlWithParams);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};

	this.getIssuedTyre = function(dataT,parseSuccessData, parseFailureData) {
		var urlWithParams = URL.GET_ISSUED_TYRE + "?_id=" + dataT.issue_id;
		//console.log("called get : "+urlWithParams);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};

	this.downloadIssueSlip = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.ISSUE_TYRE_REPORT+JSON.stringify(data));
		HTTPConnection.post(URL.TYRE_ISSUE_DOWNLOAD, data, parseSuccessData,parseFailureData);
	};


	this.return = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.RETURN_TYRE+JSON.stringify(data));
		HTTPConnection.post(URL.RETURN_TYRE, data, parseSuccessData,parseFailureData);
	};

	this.get = function(objFilter,success, failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		var urlWithParams = URL.GET_ISSUED_TYRE + "?" + prepareQueryParams(objFilter);
		//console.log("called get : "+urlWithParams);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};

	this.downloadRetreadIssueSlip = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		HTTPConnection.post(URL.TYRE_RETREAD_DOWNLOAD, data, parseSuccessData,parseFailureData);
	};

}]);
