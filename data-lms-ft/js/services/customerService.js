materialAdmin.service('customer', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage', function($rootScope, HTTPConnection, URL, $localStorage) {
    function prepareParameters(oFilter){
        var sParam = "";
        for(var property in oFilter){
          sParam = sParam +"&"+ property +"="+ encodeURIComponent(oFilter[property]);
        }
        return sParam;
    }

    this.getAllcustomers = function(oFilter, success) {
        this.getAllCustomerSuccess = function(data) {
            success(data.data);
        }
        var url_with_params = URL.CUSTOMER + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getAllCustomerSuccess);
    };

	this.getAllcustomersCustom = function(oFilter, success) {
		var url_with_params = URL.CUSTOMER + "?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, function(data) {
			if(oFilter.src === 'quotation') {
				data = data.data.data/*.map(function (item) {
					return {
						id: item._id,
						name: item.name
					};
				})*/;
			} else {
				data = data.data.data;
			}
			success(data);
		});
	};

	this.getCname = function(sUser,suc,fail) {
		var sURL = URL.CUSTOMER;
		if(sUser && !Array.isArray(sUser)){
			sURL = sURL + "?name="+ encodeURIComponent(sUser);
		} else if(sUser && Array.isArray(sUser)) {
			sURL = sURL + "?name="+ encodeURIComponent(sUser[0])+'&src='+encodeURIComponent(sUser[1]);
		}
		HTTPConnection.get(sURL, suc,fail);
	};

	this.getCustomerSearch = function(name, success) {
		this.getCustomerSuccess = function(data) {
			success(data.data);
		}
		var url_with_params = URL.CUSTOMER_SEARCH + '?name='+ name;
		HTTPConnection.get(url_with_params, this.getCustomerSuccess);
	}

    this.getCustomer = function(id, success, failure) {
		this.getCustomerSuccess = function(data) {
			success(data.data);
		}
        HTTPConnection.get(URL.CUSTOMER + '?customerId=' + id, this.getCustomerSuccess, failure);
    }

    this.saveCustomer = function(data, succes, failure) {
        HTTPConnection.post(URL.CUSTOMER_ADD, data, succes, failure);
    }
    this.updateCustomer = function(data, success, failure) {
        HTTPConnection.put(URL.CUSTOMER_UPDATE + "/" + $rootScope.customer._id, data, success, failure);
    }

	this.updateTheCustomer = function(data, success, failure) {
		HTTPConnection.put(URL.CUSTOMER_UPDATE + "/" + data._id, data, success, failure);
	}

    this.getAllContracts = function(success) {
        this.getAllContractsSuccess = function(data) {
            $localStorage.availableContracts = data.data;
            success(data.data);
        }
        if($rootScope.customer && $rootScope.customer._id){
           HTTPConnection.get(URL.CONTRACT + "/?customer__id=" + $rootScope.customer._id + '&all=true', this.getAllContractsSuccess);
        } else {
            $rootScope.cmsg7 = 'Please register customer';
            //console.log($rootScope.cmsg7);
        }
    }

    this.addContract = function(data, succes, failure) {
        HTTPConnection.post(URL.CONTRACT_ADD, data, succes, failure);
    }

    this.updateContract = function(data, success, failure) {
        HTTPConnection.put(URL.CONTRACT_UPDATE + "/" + data._id, data, success, failure);
    }

    this.getAllRates = function(success) {
        this.getAllRatesSuccess = function(data) {
            $localStorage.availableRates = data.data;
            success(data.data);
        }
        if($rootScope.selectedContractRate && $rootScope.selectedContractRate._id){
           HTTPConnection.get(URL.RATES + "/?all=true&contract__id=" + $rootScope.selectedContractRate._id, this.getAllRatesSuccess);
        } else {
            $rootScope.cmsg8 = 'Please register Contract';
            //console.log($rootScope.cmsg8);
        }
    }

    this.addRates = function(data, succes, failure) {
        HTTPConnection.post(URL.RATES_ADD, data, succes, failure);
    }

	this.deleteConfig = function(data, succes, failure) {
		HTTPConnection.post(URL.DELETE_CONFIG + "/" + data._id, data, succes, failure);
	}

    this.updateRates = function(data, success, failure) {
        HTTPConnection.put(URL.RATE_UPDATE + "/" + data._id, data, success, failure);
    }

    this.getAllRoutesForContract = function(contract_id, success) {
        contractSuccess = function(data) {
            success(data.data);
        }
        HTTPConnection.get(URL.RATES + "/?contract__id=" + contract_id, contractSuccess);
    }

    /*this.updateDriver = function(data, success,failure) {
      HTTPConnection.put(URL.DRIVER_UPDATE+"/"+data._id, data, success,failure);
    }

    this.upload_documents = function(documents, suc, failure) {
      HTTPConnection.put(URL.UPLOAD+"/driver/"+documents._id, documents, suc, failure);
    }

    this.saveDriver = function(driver, succes,failure) {
        HTTPConnection.post(URL.DRIVER_POST, driver, succes,failure);
    }*/

    this.getAllRouteDataOfContract = function(oFilter,success) {
        this.getAllSuccess = function(data) {
            success(data.data);
        }
        var url_with_params = URL.RATES + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getAllSuccess);
    }
    this.getAllRoutes = function(oFilter,success) {
        this.getAllIcdServiceSuccess = function(data) {
            success(data.data);
        }
        var url_with_params  = URL.TransporterRoutes + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getAllIcdServiceSuccess);
    }
    this.getAllContractsOfCustomer = function(oFilter,success) {
        this.getAllSuccess = function(data) {
            success(data.data);
        }
        var url_with_params = URL.CONTRACT + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, this.getAllSuccess);
    }

    this.cloneContractService = function(data, succes, failure) {
        HTTPConnection.post(URL.CONTRACT_CLONE, data, succes, failure);
    }

    this.newRateService = function(oFilter,success) {
        var url_with_params = URL.NEW_RATES + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

	this.updateDoc = function(data, success,failure) {
		HTTPConnection.put(URL.CONTRACT_UPDATE+"/"+data._id, data, success,failure);
	};

    //////////////////////////////////////////////////////

	this.getAllCustomersNew = function(oFilter, success) {
		function getAllCustomerSuccess(data) {
			success(data.data);
		}
		var url_with_params = URL.CUSTOMER + '?' + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, getAllCustomerSuccess);
	};

	// Add gpsgaadi user by customer LMS
	this.registerGpsUser = function(data, succes) {
		HTTPConnection.post(URL.REGISTER_GPS_USER, data, succes);
	};

	// update gpsgaadi user by customer LMS
	this.updateGpsUser = function(data, succes) {
		HTTPConnection.post(URL.UPDATE_GPS_USER, data, succes);
	};

	// cehck gpsgaadi user by user id
	this.checkGpsUserId = function(data, succes, failure) {
		HTTPConnection.post(URL.CHECK_GPS_USER_ID, data, succes, failure);
	};

	// cehck gpsgaadi user Pass by id
	this.getOldPassword = function(data, succes, failure) {
		HTTPConnection.post(URL.GET_GPS_USER_PASS, data, succes, failure);
	};

	// change password  user id
	this.changePassService = function(data, succes, failure) {
		HTTPConnection.post(URL.CHANGE_GPS_USER_PASS, data, succes, failure);
	};
    // enble disable customer
	this.deleteStatus = function (data, success, failure) {
		HTTPConnection.post(URL.UPDATE_CUSTOMER_STATUS + data._id, data, success, failure);
	};
}]);



