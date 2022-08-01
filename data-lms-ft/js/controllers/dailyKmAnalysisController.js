materialAdmin
	.controller("dailyKmAnalysisController", dailyKmAnalysisController);

dailyKmAnalysisController.$inject = [
	'$scope',
	'lazyLoadFactory',
	'stateDataRetain',
    'Vehicle',
    'Driver',
	'$state',
	'$uibModal',
	'growlService',
    'FleetService',
    'customer',
    'ReportService'
];


function dailyKmAnalysisController(
	$scope,
	lazyLoadFactory,
	stateDataRetain,
    Vehicle,
    Driver,
	$state,
	$uibModal,
	growlService,
    FleetService,
    customer,
    ReportService
) {

	// functions Identifiers
    $scope.getAllVehicle = getAllVehicle;
    $scope.getFleet = getFleet;
    $scope.getCustomer = getCustomer;

	// INIT functions
	(function init() {
		$scope.oFilter = {}; // initialize filter object
		$scope.maxDate = new Date();
		$scope.myFilter = {};
		$scope.lazyLoad = lazyLoadFactory();
		$scope.selectType = 'index';
	})();


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
    
    $scope.onSelectFleet = function (item) {
        if(item) {
			$scope.aFleet = $scope.aFleet || [];
			$scope.aFleet.push(item);
			$scope.oFilter.fleet = '';
		}
    }

    $scope.removeFleet = function (select, index) {
		$scope.aFleet.splice(index, 1);
    }

    $scope.onSelectCustomer = function (item) {
        if(item) {
			$scope.aCustomer = $scope.aCustomer || [];
			$scope.aCustomer.push(item);
			$scope.oFilter.customer = '';
		}
    }

    $scope.removeCustomer = function (select, index) {
		$scope.aCustomer.splice(index, 1);
    }

	$scope.downloadReport = function (download) {

		var oFilter = prepareFilterObject(download);
		ReportService.dailyKmAnalysisReport(oFilter, onSuccess, err => {
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
		if ($scope.oFilter && $scope.oFilter.segment_type &&  $scope.oFilter.segment_type.length) {
			filter.segment_type = $scope.oFilter.segment_type;
		}

		if($scope.aVehicle && $scope.aVehicle.length) {
			filter.vehicle = [];
			$scope.aVehicle.map((v) => {
				filter.vehicle.push(v._id);
			});
		}
		if($scope.aFleet && $scope.aFleet.length) {
			filter.fleet = [];
			$scope.aFleet.map((v) => {
				filter.fleet.push(v._id);
			});
        }
        if($scope.aCustomer && $scope.aCustomer.length) {
			filter.customer = [];
			$scope.aCustomer.map((v) => {
				filter.customer.push(v._id);
			});
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

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				req = {
                    status: 'In Trip',
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
    
    function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				customer.getCustomerSearch(viewValue, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

}




