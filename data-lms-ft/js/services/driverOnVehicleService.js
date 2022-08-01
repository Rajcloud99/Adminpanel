
materialAdmin.service('driverOnVehicleService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

	function prepareQueryParams(objFilter){
		var strParam = "";
		for(var key in objFilter){
			strParam = strParam +"&"+ key +"="+objFilter[key];
		}
		return strParam;
	}

	this.getdriverOnVehicle = function(objFilter,success, failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		var urlWithParams = URL.DRIVER_ON_VEHICLE_GET + "?no_of_docs=10" + prepareQueryParams(objFilter);
		//console.log("called get : "+urlWithParams);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};


	this.driverVehicleAssc = function(objFilter,success, failure) {
		function parseSuccessData(data){
			return success(data);
		}
		function parseFailureData(data){
			return failure(data);
		}
		var urlWithParams = URL.DRIVER_VEHICLE_ASSOC_REPORT + "?no_of_docs=10" + prepareQueryParams(objFilter);
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};
	this.associatedriverOnVehicle = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.DRIVER_ON_VEHICLE_ASSOCIATE+JSON.stringify(data));
		HTTPConnection.post(URL.DRIVER_ON_VEHICLE_ASSOCIATE, data, parseSuccessData,parseFailureData);
	};

	this.disassociatedriverOnVehicle = function(id, data, success, failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called update : "+URL.DRIVER_ON_VEHICLE_DISASSOCIATE+ id + JSON.stringify(data));
		HTTPConnection.post(URL.DRIVER_ON_VEHICLE_DISASSOCIATE+ id, data, parseSuccessData, parseFailureData);
	};

	this.updateDriverOnVehicle = function(id, data, success, failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		HTTPConnection.post(URL.UPDATE_DRIVER_ON_VEHICLE_ASSOCIATE+ id, data, parseSuccessData, parseFailureData);
	};

	this.deletedriverOnVehicle = function(id, data, success, failure) {
		function parseSuccessData(data){
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		HTTPConnection.delete(URL.DRIVERONVEHICLE_DELETE+ id, data, parseSuccessData, parseFailureData);
	};

	this.getdriverOnVehicleByNameSearch = function(nameSearched,success,failure) {
		function parseSuccessData(data){
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		var urlWithParams = URL.DRIVERONVEHICLE_GET + "?name=" + nameSearched;
		HTTPConnection.get(urlWithParams, parseSuccessData, parseFailureData);
	};
// backDate Entry for driver vehicle associaltion
	this.backdateEntry = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.DRIVER_ON_VEHICLE_ASSOCIATE+JSON.stringify(data));
		HTTPConnection.post(URL.BACK_DATE_ENTRY_FOR_DRIVER, data, parseSuccessData,parseFailureData);
	};

	this.assistantAssociate = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.DRIVER_ON_VEHICLE_ASSOCIATE+JSON.stringify(data));
		HTTPConnection.post(URL.ASSISTANT_ASSOCIATE, data, parseSuccessData,parseFailureData);
	};

	this.assistantDisassociate = function(id, data, success, failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called update : "+URL.DRIVER_ON_VEHICLE_DISASSOCIATE+ id + JSON.stringify(data));
		HTTPConnection.post(URL.ASSISTANT_DISASSOCIATE + id, data, parseSuccessData, parseFailureData);
	};
}]);
