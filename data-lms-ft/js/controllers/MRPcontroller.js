materialAdmin.controller("customersMRPController", function($rootScope, $scope, $state, $location, $localStorage, $timeout, $uibModal, customer, ReportService, DateUtils) {
	$("p").text("Customer");
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = false;
	$rootScope.wantThis3 = false;
	//console.log("User logged in "+ JSON.stringify($localStorage.userLoggedIn.clientId));

	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	$scope.pageChanged = function() {
		$scope.getCustomers(true);
	};

	$scope.aCustomerStatus = ["Active","Inactive"];

	$scope.downloadReport = function() {
		ReportService.getCustomerReport({}, function(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}
		});
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};
		if ($scope.customerName) {
			myFilter._id = $scope.customerName._id;
		}
		if ($scope.customerType) {
			myFilter.type = JSON.stringify([$scope.customerType]);
		}
		if ($scope.customerStatus) {
			myFilter.status = $scope.customerStatus;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date;
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date;
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		return myFilter;
	}

	$rootScope.getCustomers = function(isPagination) {
		function success(data) {
			$rootScope.customers = data.data;
			$scope.customers = data.data;
			if ($rootScope.customers.length > 0) {
				for (var p = 0; p < $rootScope.customers.length; p++) {
					if ($rootScope.customers[p].last_modified_at) {
						$rootScope.customers[p].last_modified_at = moment($rootScope.customers[p].last_modified_at).format('LLL');
					}
					if ($rootScope.customers[p].created_at) {
						$rootScope.customers[p].created_at = moment($rootScope.customers[p].created_at).format('LLL');
					}
				}
			}
			if (data.data && data.data.length > 0) {
				$rootScope.customer = data.data[0];
				$scope.total_pages = data.pages;
				$scope.totalItems = 15 * data.pages;
				setTimeout(function() {
					listItem = $($('.lv-item')[0]);
					listItem.addClass('grn');
				}, 500);
				// console.log($rootScope.customers);
			}
		}

		$scope.$watch(function() {
			return $rootScope.customer;
		}, function() {
			try {
				$scope.customer = $rootScope.customer;
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		var oFilter = prepareFilterObject(isPagination);
		customer.getAllcustomers(oFilter, success);
	};
	$rootScope.getCustomers(); // get all customer funtion call

	function oSucC(response) {
		$scope.customers = response.data.data;
	}

	function oFailC(response) {
		console.log(response);
	}

	$scope.clearSearch = function() {
		$scope.customerName = '';
		$scope.getCname($scope.customerName);
	};

	$scope.getCname = function(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			customer.getCname(viewValue, oSucC, oFailC);
		} else if (viewValue === '') {
			$scope.currentPage = 1;
			$scope.getCustomers();
		}
	};

	$scope.onSelect = function($item, $model, $label) {
		$scope.currentPage = 1;
		$scope.getCustomers();
	};

	function suc(response) {
		$rootScope.vehicleTypes = response.data.data;
	}

	function fail(response) {
		console.log('failed', response);
	}
	//$scope.cities = dataServices.loadCities();
	$scope.selectMrpCustomer = function(customer, index) {
		var sUrl = "#!/MRP_master/customers/profile";
		$rootScope.redirect(sUrl);
		$rootScope.customer = customer;
		$rootScope.aContractS = [];
		listItem = $($('.lv-item')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');

	};
	$scope.newDriverReg = function() {
		$rootScope.driver = {};
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('grn');
	};
	$rootScope.formateDate = function(date) {
		return new Date(date);
	};

	$scope.addGpsGaadiUser = function () {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/customers/addGpsGaadiUserPopup.html',
			controller: 'addGpsGaadiUserCtrl',
			resolve: {
				thatData: function () {
					return $rootScope.customer;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data !== 'cancel') {
				swal("Oops!", data.message, "error")
			}
		});
	};

	$scope.updateGpsGaadiUser = function () {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/customers/updateGpsGaadiUserPopup.html',
			controller: 'updateGpsGaadiUserCtrl',
			resolve: {
				thatData: function () {
					return $rootScope.customer;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data !== 'cancel') {
				swal("Oops!", data.message, "error")
			}
		});
	};

	$scope.changePassword = function () {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/customers/changePassword.html',
			controller: 'changePasswordCtrl',
			resolve: {
				thatData: function () {
					return $rootScope.customer;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data !== 'cancel') {
				swal("Oops!", data.message, "error")
			}
		});
	};

	$rootScope.$watch(function() {
			return $location.path();
		},
		function(a) {
			//console.log('url has changed: ' + a);
			$rootScope.currentPath = $location.path();
			//$sessionStorage.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno";

			$timeout(function() {
				if ($rootScope.currentPath === '/MRP_master/customers/profile') {
					$scope.hideBtns = false;
				} else {
					$scope.hideBtns = true;
				}
			}, 100);
		});

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;

	//************* New Date Picker for multiple date selection in single form ******************

	$scope.dateChange = function () {
		var endDate;
		var startDate = $scope.start_date;
		endDate = moment(startDate).add(6,'months').format('YYYY-MM-DD');

		if(endDate < (moment(new Date()).format('YYYY-MM-DD'))) {
			$scope.end_date = endDate;
			$scope.mxDate = endDate;
		}else {
			$scope.end_date = new Date();
			$scope.mxDate = new Date();
		}

	};

});

materialAdmin.controller("addGpsGaadiUserCtrl", function(
	$rootScope,
	$scope,
	$state,
	$localStorage,
	$uibModalInstance,
	constants,
	customer,
	DatePicker,
	DateUtils,
	thatData
) {

	// Setting the DatePicker factory to scope for global use in controller and template
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.minDateAct = new Date();
	$scope.minDateRenewal = new Date();

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$rootScope.customer = thatData;

	//$scope.subTypeofUser = true;
	$scope.roles = {availableUserRoles: ['user'],};

	$scope.registration = {role: 'user'};
	$scope.aUserType = ['Customer', 'Dealer', 'Broker','Truck Owner','Transporter'];
	//$scope.bUserType = ['Dealer'];
	$scope.registration.activation_date = new Date();
	$scope.registration.name = $rootScope.customer.name;

	//Minimum 25 characters, at least one letter, one number and one special character:
	//var passwordRegEx = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$";
	$scope.checkPassword = function (pass) {
		if(pass){
			var OK = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/.test(pass);
			if (OK === true)
				$scope.showPassErr = false;
			else
				$scope.showPassErr = true;
		}
	};

	function uSuccess(oRes){
		if(oRes.data.status === 'OK'){
			$scope.isAvailable = oRes.data.isAvailable;
			if(oRes.data.message === 'user_id is available'){
				$scope.msg1 = oRes.data.message;
			}
			else{
				$scope.registration.user_id = '';
				$scope.msg2 = oRes.data.message;

			}
		}
		else if(oRes.status === 'ERROR'){
			swal(oRes.message, "", "error");
		}
	}
	function fail(response){
		$scope.isAvailable = response.data.isAvailable;
		$scope.registration.user_id = '';
		$scope.msg2 = response.data.message;
		//swal(response.data.message, "", "error");
	}
	$scope.hasSpace = false;
	$scope.checkUserID = function(viewValue) {
		if (/\s/.test(viewValue)) {
			console.log("It has any kind of whitespace");
			$scope.hasSpace = true;
			$scope.registration.user_id = '';
		}else{
			$scope.hasSpace = false;
			$scope.user_id = viewValue;
			if($scope.user_id){
				var uId = {};
				uId.user_id = $scope.user_id;
				customer.checkGpsUserId(uId, uSuccess, fail);
			}
		}
	};

	function responseCallback(response){
		if(response.data){
			if(response.data.status === 'OK'){
				swal(response.data.message, "", "success");
				$uibModalInstance.dismiss('cancel');
				$state.reload();
			}
			else if(oRes.status === 'ERROR'){
				swal(response.message, "", "error");
			}
		}
	}


	$scope.createUser = function() {

		//$scope.registration.selected_uid = $localStorage.ft_data.userLoggedIn.userId;
		$scope.registration._id = $rootScope.customer._id;

		if($scope.registration.user_type==='Customer'){
			$scope.registration.type = 'customer';
		}else if($scope.registration.user_type==='Broker'){
			$scope.registration.type = 'broker';
		}else if($scope.registration.user_type==='Truck Owner'){
			$scope.registration.type = 'truck_owner';
		}else if($scope.registration.user_type==='Transporter'){
			$scope.registration.type = 'transporter';
		}else if($scope.registration.user_type==='Dealer'){
			$scope.registration.type = 'dealer';
		}
		customer.registerGpsUser($scope.registration,responseCallback);


	}


});

materialAdmin.controller("updateGpsGaadiUserCtrl", function(
	$rootScope,
	$scope,
	$state,
	$localStorage,
	$uibModalInstance,
	constants,
	customer,
	DatePicker,
	DateUtils,
	thatData
) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	// Setting the DatePicker factory to scope for global use in controller and template
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.minDateAct = new Date();
	$scope.minDateRenewal = new Date();

	$rootScope.customer = thatData;

	//$scope.subTypeofUser = true;
	$scope.roles = {availableUserRoles: ['user'],};

	//$scope.updation = {role: 'user'};
	$scope.updation = $rootScope.customer.gpsgaadi;
	delete $scope.updation.access_history;
	$scope.aUserType = ['Customer', 'Dealer', 'Broker','Truck Owner','Transporter'];
	$scope.aAccessType = [
		{
			access : true,
			value : 'Unblock'
		},
		{
			access : false,
			value : 'Block'
		}
	];
	$scope.accessSelect = function (value) {
		if(value === false){
			$scope.aReason = ['non payment', 'deactivation of account', 'testing over','other'];
		} else {
			$scope.aReason = ['payment done', 'conflict resolved', 'others'];
		}
	};

	function responseCallback(response){
		if(response.data){
			if(response.data.status === 'OK'){
				swal(response.data.message, "", "success");
				$uibModalInstance.dismiss('cancel');
				$state.reload();
			}
			else if(oRes.status === 'ERROR'){
				swal(response.message, "", "error");
			}
		}
	}


	$scope.updateGPSUser = function() {

		//$scope.updation.selected_uid = $localStorage.ft_data.userLoggedIn.userId;
		$scope.updation._id = $rootScope.customer._id;

		/*if($scope.updation.reason || $scope.updation.more_info){
			$scope.updation.access_history = {};
			$scope.updation.access_history.access = $scope.updation.access || true;
			$scope.updation.access_history = $scope.updation.reason || '';
			$scope.updation.access_history = $scope.updation.more_info || '';
		}*/

		if($scope.updation.user_type==='Customer'){
			$scope.updation.type = 'customer';
		}else if($scope.updation.user_type==='Broker'){
			$scope.updation.type = 'broker';
		}else if($scope.updation.user_type==='Truck Owner'){
			$scope.updation.type = 'truck_owner';
		}else if($scope.updation.user_type==='Transporter'){
			$scope.updation.type = 'transporter';
		}else if($scope.updation.user_type==='Dealer'){
			$scope.updation.type = 'dealer';
		}
		customer.updateGpsUser($scope.updation,responseCallback);


	}


});

materialAdmin.controller("changePasswordCtrl", function(
	$rootScope,
	$scope,
	$localStorage,
	$uibModalInstance,
	constants,
	customer,
	DateUtils,
	thatData
) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$rootScope.customer = thatData;

	$scope.oPass = {};

	$scope.getOldPass = function () {
		function successPassGet(response) {
			$scope.oPass.old_password = response.data.password;
			$scope.oPass.new_password = '';
		}
		var objId = {};
		objId.user_id = $rootScope.customer.gpsgaadi.user_id;
		customer.getOldPassword(objId,successPassGet);
	};
	$scope.getOldPass();

	//Minimum 25 characters, at least one letter, one number and one special character:
	//var passwordRegEx = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$";
	$scope.checkPasswordOnChange = function (pass) {
		if(pass){
			var OK = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,25}$/.test(pass);
			if (OK === true)
				$scope.showPassErr = false;
			else
				$scope.showPassErr = true;
		}
	};

	function responseCallback(response){
		if(response.data){
			if(response.data.status === 'OK'){
				swal(response.data.message, "", "success");
				$uibModalInstance.dismiss('cancel');
			}
			else if(oRes.status === 'ERROR'){
				swal(response.message, "", "error");
			}
		}
	}
	function failCallback(response){
		if(response.data.status === 'ERROR'){
			swal(response.data.message, "", "error");
		}
	}

	$scope.changePass = function() {
		if($scope.oPass.new_password === $scope.oPass.confirm_new_password) {
			$scope.oPass.selected_uid = $rootScope.customer.gpsgaadi.userId;
			customer.changePassService($scope.oPass, responseCallback, failCallback);
		} else {
			swal('warning','Password not match. Please re-enter password.','warning');
			$scope.oPass.new_password = '';
			$scope.oPass.confirm_new_password = '';
		}
	}


});


materialAdmin.controller("mrpCustomerProfileCtrl", function($rootScope) {
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
});

materialAdmin.controller("registerMRPCustomerController", function(
	$rootScope,
	$interval,
	$localStorage,
	$scope,
	customer,
	DateUtils,
	otherUtils,
	formValidationgrowlService
) {
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = false;
	$rootScope.wantThis3 = true;
	$scope.customerSel = {};
	$scope.geolocate = function(sUId) {
		googlePlaceAPI.geolocate(sUId);
	};
	$scope.banking = {};

	$scope.aGSTstates = otherUtils.getState();

	$scope.setStateCode = function(state){
		$scope.customerSel.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};

	/*
	* it push the banking object to banking_detail array of objects
	* */
	$scope.addBank = function(bank){
		if(!$scope.customerSel.bank_details) {
			$scope.customerSel.bank_details = [];
		}
		$scope.customerSel.bank_details.push(bank);
		$scope.banking = {};
	};

	/*
	* it splice single object form array of objects with provided index at
	* */
	$scope.removeBank = function(index){
		$scope.customerSel.bank_details.splice(index, 1);
	};

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;

	//$scope.minDate = $scope.dt - 30;
	var mDate = new Date();
	var numberOfDaysToSub = 30;
	$scope.minDate = mDate.setDate(mDate.getDate() - numberOfDaysToSub);
	//$scope.maxDate = $scope.dt + 365;
	var someDate = new Date();
	var numberOfDaysToAdd = 365;
	$scope.maxDate = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
	//************* New Date Picker for multiple date selection in single form **************

	// selected fruits
	$scope.selection = [];

	// toggle selection for a given fruit by name
	$scope.toggleSelection = function toggleSelection(custT) {
		var idx = $scope.selection.indexOf(custT);

		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}

		// is newly selected
		else {
			$scope.selection.push(custT);
		}
	};

	$scope.saveCustomerDetails = function(form) {
		function successPost(response) {
			if (response && response.data && response.data.data) {
				$scope.customerSel = ' ';
				$scope.city = {};
				$rootScope.getCustomers();
				swal("Customer Registered Successfully", "", "success");
				var sUrl = "#!/MRP_master/customers/profile";
				$rootScope.redirect(sUrl);
			}
		}

		function failure(res) {
			console.log("fail: ", res);
		}

		if (form.$valid) {
			if($scope.customerReg.gstin_no.$error.pattern) {
				return;
			}
			if ($scope.selection && $scope.selection.length > 0) {
				$scope.cmsg1 = $scope.cmsg2 = $scope.cmsg3 = $scope.cmsg4 = $scope.cmsg4 = '';
				if ($scope.customerSel && $scope.customerSel.black_listed === true) {
					$scope.customerSel.black_listed = true;
				} else {
					$scope.customerSel.black_listed = false;
				}
				if ($scope.selection && $scope.selection.length > 0) {
					$scope.customerSel.type = $scope.selection;
				}
				if ($localStorage.userLoggedIn && $localStorage.userLoggedIn.clientId) {
					$scope.customerSel.clientId = $localStorage.userLoggedIn.clientId
				}
				// $scope.customerSel.gstin_no = $scope.customerSel.state_code + $scope.customerSel.gstin_no;
				$scope.customerSel.address = {};
				$scope.customerSel.address.line1 = $scope.customerSel.line1 || '';
				$scope.customerSel.address.line2 = $scope.customerSel.line2 || '';
				$scope.customerSel.address.city = $scope.customerSel.city;
				$scope.customerSel.address.district = $scope.customerSel.district;
				$scope.customerSel.address.state = $scope.customerSel.state;
				$scope.customerSel.address.pincode = $scope.customerSel.pincode;
				$scope.customerSel.address.country = $scope.customerSel.country;
				var oSend = Object.assign({}, $scope.customerSel);
				oSend.gstin_no = $scope.customerSel.state_code + $scope.customerSel.gstin_no;
				customer.saveCustomer(oSend, successPost, failure);
			} else {
				$scope.createcustmsg = true;
				$scope.dmsg = 'Please select type';
				setTimeout(function() {
					if ($scope.createcustmsg) {
						$scope.$apply(function() {
							$scope.createcustmsg = false;
						});
					}
				}, 7000);
			}
		} else {
			$scope.dmsg = '';
			$scope.createcustmsg = true;
			$scope.dmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function() {
				if ($scope.createcustmsg) {
					$scope.$apply(function() {
						$scope.createcustmsg = false;
					});
				}
			}, 7000);
		}
	}
});


materialAdmin.controller("documentMrpController", function(
	$rootScope,
	$localStorage,
	$uibModal,
	$scope,
	$timeout,
	$interval,
	customer
) {

	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	// $scope.contract = {};

	$scope.getContract = function() {
		function success(data) {
			var count = 0,flag = true;
			angular.forEach(data.data, function (obj) {
				if(obj.name === "One Time")
					flag = false;

				if(flag)
					count++;
			});
			data.data.splice( count, 1 );
			$rootScope.aContractS = data.data;
			if ($rootScope.aContractS.length > 0) {
				for (var p = 0; p < $rootScope.aContractS.length; p++) {
					if ($rootScope.aContractS[p].last_modified_at) {
						$rootScope.aContractS[p].last_modified_at = moment($rootScope.aContractS[p].last_modified_at).format('LLL');
					}
					if ($rootScope.aContractS[p].created_at) {
						$rootScope.aContractS[p].created_at = moment($rootScope.aContractS[p].created_at).format('LLL');
					}
					if ($rootScope.aContractS[p].contractId === $rootScope.customer.active_contractId) {
						$rootScope.contractS = $rootScope.aContractS[p];
						$scope.selectedContract = $rootScope.aContractS[p];
					}
				}
			}
			if (data.data && data.data.length > 0) {
				$scope.contractUpdate = $rootScope.contractS;
				$scope.contractUpdate.usesWeight = $scope.contractUpdate.do_weight - $scope.contractUpdate.remaining_weight;
			} else {
				$rootScope.contractS = ' ';
			}
		};

		$scope.$watch(function() {
			return $rootScope.contractS;
		}, function() {
			try {
				$scope.contractS = $rootScope.contractS;
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		customer.getAllContracts(success);
	};

	$scope.getContract();

	$scope.selectedItemChanged = function(dataS) {
		$rootScope.contractS = dataS;
		$scope.contractUpdate = dataS;
	}

	$scope.docPreview = function(doc) {
		$scope.preview(doc);
	}

	function success(response) {
		if(response && response.data){
			$scope.selectedContract.upload_document = response.data.data.upload_document;
			$scope.contractCopy = undefined;
			var msg = response.message;
			// console.log("Updated Driver "+ JSON.stringify($scope.driver));
			swal("Updated",msg,"success");
		}
	}

	function fail(response){
		if (response.message){
			growlService.growl(response.message, "danger",2);
		}
	}

	$scope.uploadContractDoc = function(form) {
		if(form.$valid) {
			var fd = new FormData();
			if($scope.contractCopy){
				fd.append('upload_document', $scope.contractCopy);
			}
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = $scope.contractS._id;
			customer.updateDoc(data, success,fail);
		}
	}
});

materialAdmin.controller("editMRPCustomerController", function(
	$rootScope,
	$localStorage,
	$scope,
	$state,
	$interval,
	customer,
	DateUtils,
	formValidationgrowlService,
	otherUtils,
	growlService
) {
	$("p").text("Customer");
	$rootScope.wantThis = true;
	$rootScope.wantThis2 = false;
	$rootScope.wantReg = false;
	$rootScope.wantThis3 = false;

	$scope.geolocate = function(sUId) {
		googlePlaceAPI.geolocate(sUId);
	};

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form **************

	$scope.banking = {};

	/*
	* it push the banking object to banking_detail array of objects
	* */
	$scope.addBank = function(bank){
		if(!$scope.customer.bank_details) {
			$scope.customer.bank_details = [];
		}
		$scope.customer.bank_details.push(bank);
		$scope.banking = {};
	};

	/*
	* it splice single object form array of objects with provided index at
	* */
	$scope.removeBank = function(index){
		$scope.customer.bank_details.splice(index, 1);
	};

	$scope.$watch(function() {
		return $rootScope.customer;
	}, function() {
		try {
			$scope.customer = $rootScope.customer;
			//$scope.city = {};
			$scope.city = $scope.customer.address.city;
			$scope.district = $scope.customer.address.district;
			$scope.state = $scope.customer.address.state;
			$scope.pincode = $scope.customer.address.pincode;
			$scope.country = $scope.customer.address.country;
		} catch (e) {
			//console.log('catch in truckIdentificationController');
		}
	}, true);

	// custTypes
	//$scope.custTypes = ['Customer', 'Consignee', 'Consignor', 'Billing party', 'CHA', 'Transporter', 'Others'];

	// selected customer
	$scope.selection = ($rootScope.customer && $rootScope.customer.type) || [];

	// toggle selection for a given customer by name
	$scope.toggleSelection = function toggleSelection(custT) {
		var idx = $scope.selection.indexOf(custT);

		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}

		// is newly selected
		else {
			$scope.selection.push(custT);
		}
	};

	$scope.saveEditCustDetails = function(vform) {
		function success(response) {
			if (response && response.data && response.data.data) {
				$rootScope.customer = response.data.data;
				growlService.growl(response.data.message, "success");
				$state.go('MRP_master.customers.profile');
			}
		}

		function failure(response) {
			console.error("fail: ", response);
		}


		//$scope.customer.address = {};
		//$scope.customer.address.line1 = $scope.customer.address.line1;
		//$scope.customer.address.line2 = $scope.customer.address.line2;
		$scope.customer.address.city = $scope.city;
		$scope.customer.address.district = $scope.district;
		$scope.customer.address.state = $scope.state;
		$scope.customer.address.pincode = $scope.pincode;
		$scope.customer.address.country = $scope.country;


		//if (vform.$valid) {
		$scope.customer.type = $scope.selection;
		delete $scope.customer.sap_id;
		customer.updateCustomer($scope.customer, success, failure);
		/*} else {
			$scope.dmsg = '';
			$scope.updatecustmsg = true;
			$scope.dmsg = formValidationgrowlService.findError(vform.$error);
			setTimeout(function() {
				if ($scope.updatecustmsg) {
					$scope.$apply(function() {
						$scope.updatecustmsg = false;
					});
				}
			}, 7000);
		}*/

	}
});

