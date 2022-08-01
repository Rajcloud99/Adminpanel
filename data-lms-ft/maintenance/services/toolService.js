/**
 * Created by pratik on 12/04/17.
 */
materialAdmin.service('toolService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

    function prepareQueryParams(objFilter){
        var strParam = "";
        for(var key in objFilter){
            strParam = strParam +"&"+ key +"="+objFilter[key];
        }
        return strParam;
    }

    this.addToolInward = function(data, success,failure) {
        HTTPConnection.post(URL.TOOL_ADD, data, success,failure);
    };

    this.getToolMasters = function(objFilter,success, failure) {
        var urlWithParams = URL.TOOL_GET + "?sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
        HTTPConnection.get(urlWithParams, success, failure);
    };

	this.getAllToolMasters = function(objFilter,success, failure) {
		var urlWithParams = URL.TOOL_GET + "?all=true&sort=-1&no_of_docs=10" + prepareQueryParams(objFilter);
		HTTPConnection.get(urlWithParams, success, failure);
	};

    this.getAllUser = function(objFilter,success, failure) {
    	var filter = prepareQueryParams(objFilter);
    	if(filter)
			filter = '?' + filter;

        var urlWithParams = URL.USER_GET + filter;
        HTTPConnection.get(urlWithParams, success, failure);
    };

    this.getRegVeh = function(data,success, failure) {
        var urlWithParams = URL.VEHICLE;
        HTTPConnection.get(urlWithParams, success, failure);
    };

    this.issueTool = function(data, success,failure) {
        HTTPConnection.post(URL.ISSUE_TOOL, data, success,failure);
    };

    this.getIssuedTool = function(objFilter,success, failure) {
        var urlWithParams = URL.ISSUED_TOOL_GET +"?" + prepareQueryParams(objFilter);
        HTTPConnection.get(urlWithParams, success, failure);
    };
    this.returnToolService = function(data, success,failure) {
        HTTPConnection.post(URL.RETURN_TOOL + data.post_id, data, success,failure);
    };
}]);
