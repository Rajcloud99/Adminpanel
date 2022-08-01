function prepareQueryParams(objFilter){
    var strParam = "";
    for(var key in objFilter){
        strParam = strParam +"&"+ key +"="+objFilter[key];
    }
    return strParam;
}

materialAdmin.service('inventoryService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {
    this.getInventories = function(oFilter,success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.INVENTORY_GET + "?no_of_docs=10&sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };

    this.getAggreInventories = function(oFilter,success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.INVENTORY_GET + "?sort=-1&aggregate=true" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };
	this.getInvSnapshot = function(oFilter,success,failure) {
		function parseSuccessData(data){
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		var url_with_params = URL.INV_SNAPSHOT_GET + "?sort=-1" + prepareQueryParams(oFilter);
		HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
	};

	this.getSnapDateService = function(data,success,failure) {
		HTTPConnection.get(URL.SNAP_DATES, success,failure);
	}

    this.getPrServ = function(data,success,failure) {
        HTTPConnection.get(URL.INVENTORY_GET_PR, success,failure);
    }

    this.generatePRservice = function(data, succes,failure) {
        HTTPConnection.post(URL.PR_ADD, data, succes,failure);
    };
    this.updatePRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_UPDATE+"/"+data._id, data, success,failure);
    };
    this.processPRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_PROCESS+"/"+data._id, data, success,failure);
    };
    this.approvePRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_APPROVE+"/"+data._id, data, success,failure);
    };
    this.saveInventory = function(data, succes,failure) {
        HTTPConnection.post(URL.INVENTORY_ADD, data, succes,failure);
    }
}]);
