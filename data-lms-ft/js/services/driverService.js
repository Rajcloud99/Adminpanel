materialAdmin.service('Driver', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage', function($rootScope, HTTPConnection, URL, $localStorage) {
    function prepareParameters(oFilter){
	    var sParam = "";
	    for(var property in oFilter){
	      sParam = sParam +"&"+ property +"="+oFilter[property];
	    }
	    return sParam;
	  }

    this.getAllDrivers = function(oFilter,success) {
		this.getAllDriverSuccess = function(data) {
			//$localStorage.availableDrivers = data.data;
			success(data.data);
		};
        var url_with_params = URL.DRIVER + "?no_of_docs=10" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllDriverSuccess);
	};

	this.driversReport = function(oFilter,success) {
		this.getAllDriverSuccess = function(data) {
			//$localStorage.availableDrivers = data.data;
			success(data.data);
		};
		var url_with_params = URL.DRIVER_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllDriverSuccess);
	};

	this.getAllDriversForList = function(oFilter,success) {
		this.getAllDriversForListSuccess = function(data) {
			success(data);
		};
		var url_with_params = URL.DRIVER_TRIM + "?all=true" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllDriversForListSuccess);
	};
    this.getAllDriversForDropdown = function(oFilter,success) {
        this.getAllDriverSuccess = function(data) {
            //$localStorage.availableDrivers = data.data;
            success(data.data);
        };
        var url_with_params = URL.DRIVER + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getAllDriverSuccess);
    };

	this.updateDriver = function(data, success,failure) {
		HTTPConnection.put(URL.DRIVER_UPDATE+"/"+data._id, data, success,failure);
	};

	this.deleteStatus = function (data, success, failure) {
		HTTPConnection.post(URL.UPDATE_DRIVER_STATUS + data._id, data, success, failure);
	};

	this.upload_documents = function(documents, suc, failure) {
		HTTPConnection.post(URL.UPLOAD+"/driver/"+documents._id, documents, suc, failure);
	};

	this.saveDriver = function(driver, succes,failure) {
			HTTPConnection.post(URL.DRIVER_POST, driver, succes,failure);
 	};

	this.driverHappayAttach = function(driver, successCallback, failureCallback) {
			HTTPConnection.post(URL.DRIVER_ATTACH_HAPPAY + driver._id, driver, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
 	};

	const serialize = function (obj, prefix) {
		var str = [], p;
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push((v !== null && !(v instanceof Date) && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	};

	this.uploadCommon = (qp = {}, p = {}) => new Promise((rs, rj) => (
		HTTPConnection.post(`${URL.COMMON_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
	));

 	this.getAll = function(suc,fail) {
	    var sURL = URL.DRIVER_ALL;
	    HTTPConnection.get(sURL, suc,fail);
  	};

  	this.getName = function(sUser,suc,fail) {
    var sURL = URL.DRIVER;
	    if(sUser){
	      sURL = sURL + "?name="+ sUser;
	    }
		sURL+= '&no_of_docs=10';
		sURL+= '&deleted=false';
			HTTPConnection.get(sURL, suc,fail);
	};

	// driver counselling api start
	this.drivCounsellingAdd = function (data, successCallback, failureCallback) {
		const sURL = URL.MASTER_COUNSELLING_ADD;
		if(sURL) {
			HTTPConnection.post(sURL, data, onSuccess, onFailure);
		}
		function onFailure(data) {
			if (typeof failureCallback === 'function')
				failureCallback(data.data);
		}

		function onSuccess(data) {
			if (typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	this.drivCounsellingGet = function(request, successCallback, failureCallback) {
		var urlWithParams = URL.MASTER_COUNSELLING_GET ;
		HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	this.deleteDrivCounselling = function(request, successCallback, failureCallback) {

		var url = URL.MASTER_COUNSELLING_DELETE + request._id; // modify url

		HTTPConnection.delete(url , request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}
	// driver counselling api end
}]);
