materialAdmin.service('SLDOServices', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
  	function prepareParameters(oFilter){
        var sParam = "";
        for(var property in oFilter){
          sParam = sParam +"&"+ property +"="+oFilter[property];
        }
        return sParam;
    }

    this.getAllSLDO = function(oFilter,success) {
    	var url_with_params = URL.SLDO_GET + "?no_of_docs=10" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, success);
	}

	this.updateSLDO = function(data, success,failure) {
		HTTPConnection.put(URL.ROUTE_UPDATE+"/"+data._id, data, success,failure);
	}
	
	this.saveSLDO = function(data, succes,failure) {
		HTTPConnection.post(URL.SLDO_POST, data, succes,failure);
 	}
 	this.getCname = function(sUser,suc,fail) {
    var sURL = URL.SLDO_GET;
        if(sUser){
          sURL = sURL + "?name="+ sUser;
        }
      HTTPConnection.get(sURL, suc,fail);
    };
}]);
