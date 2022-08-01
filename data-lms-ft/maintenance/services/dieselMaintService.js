
function prepareQueryParams(objFilter){
    var strParam = "";
    for(var key in objFilter){
        strParam = strParam +"&"+ key +"="+objFilter[key];
    }
    return strParam;
}

materialAdmin.service('dieselMaintService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {
    this.getDieselList = function(oFilter,success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.DIESEL_GET + "?" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };

    this.addDiesel = function(data, succes,failure) {
        HTTPConnection.post(URL.DIESEL_ADD, data, succes,failure);
    };

	this.downloadSlipService = function(data, succes,failure) {
		HTTPConnection.post(URL.DIESEL_SLIP_DOWNLOAD, data, succes,failure);
	}



}]);
