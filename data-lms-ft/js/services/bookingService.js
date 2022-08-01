materialAdmin.service('bookingServices', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
	function prepareParameters(oFilter) {
		var sParam = "";

		for (var property in oFilter) {
			sParam = sParam + "&" + property + "=" + oFilter[property];
		}
		return sParam;
	}

	this.getAllCustomers = function(success) {
		this.getAllCustomerSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.CUSTOMER + "/?all=true&sort=-1", this.getAllCustomerSuccess);
	}
	this.getAllContracts = function(success) {
		this.getAllContractsSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.CONTRACT, this.getAllContractsSuccess);
	}
	this.getAllContracts22 = function(data, success) {
		this.getAllContractsSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.CONTRACT+ "/?customer__id=" + data, this.getAllContractsSuccess);
	}
	this.getBranch = function(success) {
		this.getBranchSuccess = function(data) {
			success(data.data);
		};
		HTTPConnection.get(URL.BRANCH_GET, this.getBranchSuccess);
	};
	this.getAllUsersService = function(success) {
		this.getUsersSuccess = function(data) {
			success(data.data);
		};
		HTTPConnection.get(URL.USER_GET, this.getUsersSuccess);
	};
	this.getAllRoutesForCusrtomer = function(contract_id, success) {
		this.getAllRatesSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.RATES + "/?contract__id=" + contract_id, this.getAllRatesSuccess);
	}
	this.getAllRoutesForOneTime = function(oFilter, success) {
		this.getAllRatesSuccess = function(data) {
			success(data.data);
		}
		var url_with_params = URL.RATES + "/?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllRatesSuccess);
	}
	this.getAllIcdService = function(success) {
		this.getAllIcdServiceSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.ICD_GET, this.getAllIcdServiceSuccess);
	}

	this.getAllVehTypeServ = function(oFilter,success) {
		this.getAllSuccess = function(data) {
			success(data.data);
		}
		HTTPConnection.get(URL.VEH_TYPE_ALL, this.getAllSuccess);
	}
	this.getAllVehTypeService = function(oFilter,success) {
		this.getAllSuccess = function(data) {
			success(data.data);
		}
		var url_with_params = URL.VEH_TYPE_ALL + "?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllSuccess);
	}

	this.getAllBookings = function(oFilter, success, failure) {
		var url_with_params = URL.BOOKING_GET;
		HTTPConnection.post(url_with_params,oFilter, success, failure);
	}

	this.deleteBooking = function(oFilter, success, failure) {
		var url_with_params = URL.DELETE_BOOKING;
		HTTPConnection.post(url_with_params + oFilter._id, oFilter, success, failure);
	}

	this.getBookingsForDate = function(start_date, end_date, success, failure) {
		HTTPConnection.get(URL.BOOKING_GET + '?start_date=' + start_date + '&end_date=' + end_date, success, failure);
	}

	this.getBookingsForCustomerAndDate = function(customer_id, start_date, end_date, success, failure) {
		HTTPConnection.get(URL.BOOKING_GET + '?start_date=' + start_date + '&end_date=' + end_date + '&customerId=' + customer_id, success, failure);
	}

	this.getBookingByTrip = function(trip, success, failure) {
		HTTPConnection.get(URL.BOOKING_GET + '?trip_no=' + trip, success, failure);
	}

	this.getAllTrips = function(success, failure) {
		HTTPConnection.get(URL.TRIP_GET, success, failure);
	}

	this.approveUpdateBooking = function(data, success, failure) {
			HTTPConnection.put(URL.APPROVE_UPDATE + "/" + $rootScope.selectedBooking._id, data, success, failure);
		}
		/*this.updateBooking222 = function(data, success, failure) {
			HTTPConnection.put(URL.BOOKING_UPDATE + "/" + $rootScope.selectedBookingInfoForService._id, data, success, failure);
		}*/
	this.addMyBooking = function(data, succes, failure) {
		data.booking_status = {};
		data.booking_status.status = 'Pending';
		data.booking_status.date = new Date();
		if($rootScope.logInUser && $rootScope.logInUser.full_name){
			data.booking_status.person = $rootScope.logInUser.full_name;
		}
		HTTPConnection.post(URL.BOOKING_ADD, data, succes, failure);
	}
	this.updateBooking = function(data, success, failure) {
		HTTPConnection.put(URL.BOOKING_UPDATE + "/" + data._id, data, success, failure);
	}
	this.updateBasicFullBooking = function(data, success, failure) {
		HTTPConnection.put(URL.BOOKING_UPDATE + "/" + data._id, data, success, failure);
	}
	this.updateBooking222 = function(data, success, failure) {
		HTTPConnection.put(URL.BOOKING_UPDATE + "/" + $rootScope.selectedBookingInfoForService._id, data, success, failure);
	}
	/*this.addBooking = function(data, succes, failure) {
		HTTPConnection.post(URL.BOOKING_ADD, data, succes, failure);
	}*/

	this.getBookingReport = function(oFilter,success, failure){
		var url_with_params = URL.BOOKING_GET + "/getReport" + "/?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, success, failure);
	}

	//Changes By Abhi
	this.getAllCustomersforDetails = function(oFilter, success) {
		this.getAllCustomerSuccess = function(data) {
			success(data.data);
		}
		var url_with_params = URL.CUSTOMER_SEARCH + "/?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, this.getAllCustomerSuccess);
	}
	this.getAllMaterial = function(success, failure) {
		HTTPConnection.get(URL.GET_MATERIAL, success, failure);
	}
	this.getAllTripLocation = function(data,success, failure) {
		HTTPConnection.get(URL.TRIP_LOCATION_GET + '?' + prepareParameters(data), success, failure);
	}


	this.updateMyBooking = function(data, success, failure) {
		HTTPConnection.put(URL.BOOKING_UPDATE + "/" + data._id, data, success, failure);
	}
	// assign traffic manager on booking for MMP Client
	this.updateTrafficMAnager = function(data, success, failure) {
		HTTPConnection.put(URL.ADD_TRAFFIC_MANAGER_ON_BOOKING + "/" + data._id, data, success, failure);
	}

	// Get Vendor quotation
	this.getVendorQuotation = function(data, success, failure) {
		HTTPConnection.post(URL.QUOTATION_GET, data, success, failure);
	}

	// Add Vendor Quotation
	this.addVendorQuotation = function(data, succes, failure) {
		HTTPConnection.post(URL.QUOTATION_ADD, data, succes, failure);
	}

	// Update Vendor Quotation
	this.updateVendorQuotation = function(data, succes, failure) {
		HTTPConnection.put(URL.QUOTATION_UPDATE + "/" + data._id, data, succes, failure);
	}

	// Finalize the Vendor quotation
	this.finalizeVendorQuotation = function (data, succes, failure) {
		HTTPConnection.put(URL.QUOTATION_FINALIZE + "/" + data._id, data, succes, failure);
	}

	// Revert the finalize quotation
	this.revertFinalizeVendorQuotation = function (data, succes, failure) {
		HTTPConnection.put(URL.REVERT_QUOTATION_FINALIZE + "/" + data._id, data, succes, failure);
	}

	// delete Vendor Quotation
	this.deleteVendorQuotation = function(data, success, failure) {
		HTTPConnection.put(URL.QUOTATION_DELETE + "/" + data._id, data, success, failure);
	}

	//  Quotation Remark
	this.quotationRmkUpdate = function(data, success, failure) {
		HTTPConnection.post(URL.QUOTATION_REMARK + "/" + data._id, data, success, failure);
	}

}]);
