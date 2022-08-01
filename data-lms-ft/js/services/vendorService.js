materialAdmin.service('Vendor', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage',
  function($rootScope, HTTPConnection, URL, $localStorage) {

  function prepareParameters(oFilter){
    var sParam = "";
    for(var property in oFilter){
      sParam = sParam +"&"+ property +"="+oFilter[property];
    }
    return sParam;
  }

  this.getAllVendors = function(vDAta,oFilter,success) {
    this.getAllVendorSuccess = function(data) {
      $localStorage.availableVendors = data.data;
      success(data.data);
    };
    var url_with_params = URL.VENDOR + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
    HTTPConnection.post(url_with_params,vDAta, this.getAllVendorSuccess);
  };
  this.getAllVendorById = function(oFilter,success) {
    var url_with_params = URL.VENDOR_ID + "?" + prepareParameters(oFilter);
    HTTPConnection.get(url_with_params, success);
  };
  this.getAllVendorsList = function(oFilter,success) {
    // var url_with_params = URL.VENDOR + "?all=true" + prepareParameters(oFilter);
    HTTPConnection.post(URL.VENDOR, oFilter, success);
  };
  this.getAllVendorsListText = function(oFilter,success) {
    var url_with_params = URL.GET_VENDOR_ROUTE + "/vendors_route?search=" + oFilter.search;
    HTTPConnection.get(url_with_params, success);
  };

	  this.vendorTrim = function(oFilter,success, failure) {
		  var url_with_params = URL.VENDOR_TRIM + "?" + prepareParameters(oFilter);
		  HTTPConnection.get(url_with_params , success, failure);
	  };

  this.saveVendor = function(vendor, succes,failure) {
      HTTPConnection.post(URL.VENDOR_POST, vendor, succes,failure);
  };

  this.updateVendor = function(data, success,failure) {
    HTTPConnection.put(URL.VENDOR_UPDATE+"/"+data._id, data, success,failure);
  };

   this.deleteVendors = function(data, success,failure) {
    HTTPConnection.delete(URL.VENDOR_DELETE+data._id, data, success,failure);
  };

  this.getAllVendorBranch = function(succes,failure) {
     HTTPConnection.get(URL.VENDOR_BRANCH, succes,failure);
  };
  this.addVendorRoute = function(data, success,failure) {
    HTTPConnection.post(URL.ADD_VENDOR_ROUTE, data, success,failure);
  };

  this.getName = function(oFilter,suc,fail) {
    var sURL = URL.VENDOR;
    /*if(sUser){
      sURL = sURL + "?name="+ sUser;
    }*/
      HTTPConnection.post(sURL, oFilter, suc, fail);
  };
  this.getAllRoute = function(sRoute,suc,fail) {
    var sURL = URL.TransporterRoutes;
    if(sRoute){
      sURL = sURL + "?"+ prepareParameters(sRoute);
    }
      HTTPConnection.get(sURL, suc,fail);
  };
  this.transporterRoutes_ALL = function(sRoute,suc,fail) {
    var sURL = URL.TransporterRoutes_ALL;
    /*if(sRoute){
      sURL = sURL + "/?name="+ sRoute;
    }*/
      HTTPConnection.get(sURL, suc,fail);
  };
  this.getAllVendorRouteService = function(vData,suc,fail) {
    var sURL = URL.GET_VENDOR_ROUTE;
    HTTPConnection.get(sURL, suc,fail);
  };
  this.updateVroute = function(data, success,failure) {
    HTTPConnection.put(URL.UPDATE_VENDOR_ROUTE+"/"+data._id, data, success,failure);
  };
  //Fuel Vendor
  this.getAllVendorFuels = function(success) {
    this.getAllVendorFuelSuccess = function(data) {
      $localStorage.availableVendorFuels = data.data;
      success(data.data);
    };

    HTTPConnection.get(URL.VENDORFUEL, this.getAllVendorFuelSuccess);
  };


  this.saveVendorFuel = function(vendorFuel, succes,failure) {
      HTTPConnection.post(URL.VENDORFUEL_POST, vendorFuel, succes,failure);
  };

  this.updateVendorFuel = function(data, success,failure) {
    HTTPConnection.put(URL.VENDORFUEL_UPDATE+"/"+data._id, data, success,failure);
  };

  this.getAllVendorFuelBranch = function(succes,failure) {
     HTTPConnection.get(URL.VENDORFUEL_BRANCH, succes,failure);
  };

  this.getGroupVehicleType = function(succes,failure) {
      HTTPConnection.get(URL.VEHICLE_GROUPVEHICLE_GET, succes,failure);
  };
  this.regOnTheGo = function(data, succes, failure) {
    HTTPConnection.put(URL.REG_ON_THE_GO +"/"+ data.vendor_id, data, succes, failure);
  }

  /*this.getAllVehicles = function(success, fail) {
    var url_with_params = URL.VEHICLE;
    HTTPConnection.get(url_with_params, success, fail);
  }*/


/*
* Transport Vendor Api's*/
  this.getTransportVendor = function(oFilter,success,failure) {
	  function getTransportVendorSuccess(data) {
		  success(data.data);
	  }
	  function getTransportVendorFailure(data) {
		  failure(data);
	  }
	  HTTPConnection.post(URL.VENDOR, oFilter, getTransportVendorSuccess, getTransportVendorFailure);
  };

  this.putTransportVendor = function(oFilter, success, failure){
  	function putTransportVendorSuccess(data) {
		success(data.data);
	}
	function putTransportVendorFailure(data) {
		failure(data);
	}
	HTTPConnection.post(URL.VENDOR_POST, oFilter, putTransportVendorSuccess, putTransportVendorFailure);
  }

  this.updateTransportVendor = function(oFilter, success, failure){
	  function updateTransportVendorSuccess(data) {
		  success(data.data);
	  }
	  function updateTransportVendorFailure(data) {
		  failure(data);
	  }

	  var url = URL.VENDOR_UPDATE + '/' + oFilter._id;
	  if(oFilter.bank_a_c){
		  url = url+"/"+oFilter.bank_a_c;
	  }else{
		  url = url+"/false";
	  }
	  HTTPConnection.put(url, oFilter, updateTransportVendorSuccess, updateTransportVendorFailure);
  }

}]);
