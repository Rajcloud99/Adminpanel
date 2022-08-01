
materialAdmin.controller('cityStateController', function (
	$modal,
	$scope,
	$uibModal,
	$state,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	cityStateService,
) {
	let vm = this;

	vm.getAllCity = getAllCity;
	vm.addPlace = addPlace;
	vm.delPlace = delPlace;
	vm.downloadCity = downloadCity;

	// this function trigger on state refresh
	$scope.onStateRefresh = function () {
		getAllCity();
	};

	// INIT functions
	(function init() {

		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory(); // init lazyload

		if (stateDataRetain.init($scope, vm))
			return;

		vm.oFilter = {};
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: [
				'city',
				'state',
				'PinCode',
				'District',
				'Zone',
				'created By',
				'created At',
				'lastModified By',
				'lastModified At',
			]
		};
		vm.tableHead = [
			{
				'header': 'city',
				'bindingKeys': 'c'
			},
			{
				'header': 'state',
				'bindingKeys': 's'
			},
			{
				'header': 'PinCode',
				'bindingKeys': 'p'
			},
			{
				'header': 'District',
				'bindingKeys': 'd'
			},
			{
				'header': 'Zone',
				'bindingKeys': 'zone'
			},{
				'header': 'created By',
				'bindingKeys': 'createdBy'
			},{
				'header': 'created At',
				'bindingKeys': 'createdAt'
			},{
				'header': 'lastModified By',
				'bindingKeys': 'lastModifiedBy'
			},{
				'header': 'lastModified At',
				'bindingKeys': 'lastModifiedAt'
			},
		];

		getAllCity(true);
	})();

	function getAllCity(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		cityStateService.getCity(oFilter, function (res) {
			if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function downloadCity(download){
		let oFilter = prepareFilter(download);
		cityStateService.getCity(oFilter, onSuccess, onFailure);

		// Handle success response
		function onSuccess(response) {
			if (download) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}
		}

		// Handle Failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}
	}


	function prepareFilter(download) {
		var myFilter = {};
		//myFilter.trip_stage = true;

		if (vm.oFilter.city) {
			myFilter.c = vm.oFilter.city;
		}
		if (vm.oFilter.pinCode) {
			myFilter.p = vm.oFilter.pinCode;
		}
		if (vm.oFilter.district) {
			myFilter.d = vm.oFilter.district;
		}
		if (vm.oFilter.state) {
			myFilter.s = vm.oFilter.state;
		}
		if (vm.oFilter.zone) {
			myFilter.zone = vm.oFilter.zone;
		}
		if (download){
			myFilter.all = true
		    myFilter.download = true
	    }else {
			myFilter.skip = vm.lazyLoad.getCurrentPage();
			myFilter.no_of_docs = 20;
		}

		return myFilter;
	}

	function addPlace(type = 'add') {
		let aSelectedCity = vm.aSelectedCity;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/cityState/addCityState.html',
			controller: 'addCityStateCtrl',
			controllerAs: 'acsVm',
			resolve: {
				data: {
					aSelectedCity,
					type
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
		}, function (data) {

		});
	}

	function delPlace() {
		let aSelectedCity = vm.aSelectedCity;
		swal({
			title: 'Are you sure you want to delete this Place ?',
			// text: '1. GST Not Registerd',
			type: 'warning',
			showCancelButton: true,
			confirmButtonClass: 'btn-danger',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			closeOnConfirm: true,
			closeOnCancel: true,
			allowOutsideClick: true
		},
			function (isConfirm) {
				if (isConfirm) {
					cityStateService.deleteCity({_id: vm.aSelectedCity._id}, successCallback, failureCallback);

					function successCallback(response) {
						if(response) {
							swal("Success", response.message, "success");
							getAllCity();
						}
					}

					function failureCallback(res) {
						if(res) {
							swal('Error', res.data.message, 'error');
						}
					}
				}
			});
	}

});

materialAdmin.controller('addCityStateCtrl', function (
	 $scope,
	 $uibModalInstance,
	 cityStateService,
	 data
) {
	let vm = this;

	vm.submit = submit;
	vm.closeModal = closeModal;
	vm.getCity = getCity;
	vm.onSelect = onSelect;
	vm.stateSelect = stateSelect;

	// INIT functions
	(function init() {

	vm.selectedInfo = angular.copy(data); // initialize datepicker
	vm.type = vm.selectedInfo && vm.selectedInfo.type;
	if(vm.type == 'edit') {
		vm.aSelectedCity = vm.selectedInfo && vm.selectedInfo.aSelectedCity;
		vm.aSelectedCity.s = $scope.$constants.aGSTstates.find(o => o.state === vm.aSelectedCity.s);
	}
	})();

	function closeModal() {
		$uibModalInstance.dismiss('cancel');
	}

	function onSelect(item) {
		vm.state = item.s;
		vm.city = item.c;
		vm.aSelectedCity.s = undefined;
	}
	function stateSelect(item) {
		if(vm.state == item.state) {
			vm.aSelectedCity.s = '';
			if(vm.city != vm.aSelectedCity.c.c)
			vm.state = '';
			return swal('error', 'city with same name already created', 'error');
		}
	}

	 function getCity (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	};


	 function submit(formData) {
	 	console.log(formData);
		 if (formData.$valid){

		var oSend = {};
			oSend.c = vm.aSelectedCity.c.c ? vm.aSelectedCity.c.c : vm.aSelectedCity.c;
			oSend.d = vm.aSelectedCity.d.c ? vm.aSelectedCity.d.c : vm.aSelectedCity.d;
			oSend.s = vm.aSelectedCity.s.state;
			oSend.p = vm.aSelectedCity.p;
			oSend.zone = vm.aSelectedCity.s.zone;
		 if(vm.type == 'edit')
			 oSend._id = vm.aSelectedCity._id;

		    cityStateService.upsertCity(oSend, success, failure);

		 // Handle failure response
		 function failure(response) {
			 console.log(response);
			 swal('Error!', response.message, 'error');
		 }

		 // Handle success response
		 function success(response) {
			 swal('Success', response.message, 'success');
			 $uibModalInstance.dismiss('cancel');
		 }

		}
		else{
			 return swal('error', 'all mandatory fields have to be filled', 'error');
		 }
	 }

});
