materialAdmin
	.controller("driverCounsellingListController", driverCounsellingListController);

driverCounsellingListController.$inject = [
	'$scope',
	'accountingService',
	'lazyLoadFactory',
	'stateDataRetain',
	'branchService',
    'Vehicle',
    'Driver',
	'$state',
	'$uibModal',
	'growlService',
	'FleetService',
];


function driverCounsellingListController(
	$scope,
	accountingService,
	lazyLoadFactory,
	stateDataRetain,
	branchService,
    Vehicle,
    Driver,
	$state,
	$uibModal,
	growlService,
	FleetService
) {

	// functions Identifiers
	$scope.addCounselling = addCounselling;
	$scope.deleteCounselling = deleteCounselling;
    $scope.getAllVehicle = getAllVehicle;
	$scope.getAllDriverCode = getAllDriverCode;
	$scope.getFleet = getFleet;
	$scope.getCounselling = getCounselling;
	$scope.onStateRefresh = function () {
		getCounselling();
	};

	// INIT functions
	(function init() {
		$scope.oFilter = {}; // initialize filter object
		$scope.maxDate = new Date();
		$scope.myFilter = {};
		$scope.lazyLoad = lazyLoadFactory();
		$scope.selectType = 'index';
		$scope.dateType = [
			{
				key: "Dues Entry",
				value: "created_at"
			}
		];
		$scope.columnSetting = {
			allowedColumn: [
				'Vehicle No',
				'Driver Code',
				'Date Of Entry',
				'Driver Avg Running',
				'Remark',
				'Driver Bal in Copy',
				'Driver Bal in System',
				'Created By',
				'Created At'
			]
		};
		$scope.tableHead = [
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle && vehicle[0] && vehicle[0].vehicle_reg_no'
            },
            {
				'header': 'Driver Code',
				'bindingKeys': 'driverCode && driverCode[0] && driverCode[0].employee_code'
			},
			{
				'header': 'Date Of Entry',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			
			{
				'header': 'Driver Avg Running',
				'bindingKeys': 'avgRun',
			},
			{
				'header': 'Remark',
				'bindingKeys': 'remark',
			},
			{
				'header': 'Driver Bal in Copy',
				'bindingKeys': 'driverBalCopy',
			},
			{
				'header': 'Driver Bal in System',
				'bindingKeys': 'driverBalSystem'
			},
			{
				'header': 'Created By',
				'bindingKeys': 'created_by_name'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			},

		];
	})();

	// Actual Functions
	function addCounselling(type = 'add') {
		$state.go('masters.driverCounselling', {
			data: {
				type
			}
		});
		
	}


	$scope.onSelectVehicle = function (item) {
		if(item) {
			$scope.aVehicle = $scope.aVehicle || [];
			$scope.aVehicle.push(item);
			$scope.oFilter.vehicle = '';
		}
	}

	$scope.removeVehicle = function (select, index) {
		$scope.aVehicle.splice(index, 1);
	}

	// Get vehicle accident from backend
	function getCounselling(isGetActive) {
		if (!$scope.lazyLoad.update(isGetActive))
			return;
		var oFilter = prepareFilterObject();
		Driver.drivCounsellingGet(oFilter, onSuccess, err => {
			console.log(err);
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				$scope.aSelectedCounselling = response && response.data[0];
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);
			}
		}
	}
	$scope.downloadCounselling = function (download) {

		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			return swal('warning', "Both From and To Date should be Filled", 'warning');
		}

		var oFilter = prepareFilterObject(download);
		Driver.drivCounsellingGet(oFilter, onSuccess, err => {
			console.log(err)
		});

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

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', response.data.massage, 'error');
		}
	}

	function prepareFilterObject(download) {
		var filter = {};
		if ($scope.oFilter.from) {
			filter.from = moment($scope.oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if ($scope.oFilter.to) {
			filter.to = moment($scope.oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}


		// if ($scope.oFilter.vehicle) {
		// 	filter.vehicle = $scope.oFilter.vehicle._id;
		// }
		if($scope.aVehicle && $scope.aVehicle.length) {
			filter.vehicle = [];
			$scope.aVehicle.map((v) => {
				filter.vehicle.push(v._id);
			});
		}
		if($scope.oFilter.driverCode) {
			filter.driverCode = $scope.oFilter.driverCode._id;
		}
		if($scope.oFilter.fleet) {
			filter.fleet = $scope.oFilter.fleet.name;
		}
		if (download) {
			filter.download = true;
			filter.no_of_docs = 10000;
		} else {
			filter.skip = $scope.lazyLoad.getCurrentPage();
			filter.no_of_docs = 30;
		}
		return filter;
	}

	function deleteCounselling() {
		if (!$scope.aSelectedCounselling) {
			return swal('Warning', 'Please Select Single Driver', 'warning');
		}
		const currDate = new Date();
		currDate.setHours(0, 0, 0, 0);
		const rowDate = new Date($scope.aSelectedCounselling && $scope.aSelectedCounselling.date);
		rowDate.setHours(0, 0, 0, 0);
		if((new Date(currDate) > new Date(rowDate)) || (new Date(currDate) < new Date(rowDate))) {
			return swal('Warning', 'You can delete entry only current day', 'warning');
		}
		swal({
			title: 'Are you sure you want to delete this Entry?',
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
					Driver.deleteDrivCounselling({
						_id: $scope.aSelectedCounselling._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						getCounselling();
					}
				}
			});
		return;
	}

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
				};
				Vehicle.getAllVehicles(req, oSuc, oFail);
				function oSuc(response) {
					resolve(response.data);
				}
				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
    }
    
    function getAllDriverCode(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {
                req = {
                    name: viewValue
                };
				Driver.getAllDrivers(req, oSuc, oFail);
				function oSuc(response) {
					resolve(response.data);
				}
				function oFail(response) {
					reject([]);
				}
            });
        } else
			return [];
	}
	
	function getFleet(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {
				FleetService.getName(viewValue, oSuc, oFail);
				function oSuc(response) {
					resolve(response.data.data);
				}
				function oFail(response) {
					reject([]);
				}
            });
        } else
			return [];
	}

}




