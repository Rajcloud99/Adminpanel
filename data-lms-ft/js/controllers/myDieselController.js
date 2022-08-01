materialAdmin.controller("myDieselController", function($rootScope, $localStorage, $scope, $uibModal, $state, Vendor, tripServices, billsService, DateUtils, Vehicle, Routes, customer, Pagination, bookingServices) {
    $scope.aInfo = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.items_per_page = 6;
    $scope.pageChanged = function() {
        $scope.getAllDiesel(true);
    };

    function prepareFilterObject(isPagination) {
        var myFilter = {/*source:"DIESEL"*/};
        /*if (!$scope.selected) {
            myFilter.diesel_stage = true;
        }*/
        if ($scope.trip_no) {
            myFilter.trip_no = $scope.trip_no;
        }
        if ($scope.booking && $scope.booking.length <= 5) {
            myFilter.booking_no = $scope.booking;
        } else if ($scope.booking && $scope.booking.length > 5) {
            myFilter.bookingId = $scope.booking;
        }
        if ($scope.grNumber) {
			myFilter.gr_query = {grNumber : $scope.grNumber};
        }
        /*if($scope.bookingType){
         myFilter.booking_type = $scope.bookingType;
        } */
        if ($scope.customerName && $scope.customerName.name) {
            myFilter.customer_id = $scope.customerName._id;
        }
        if ($scope.vehicle_no) {
            myFilter.vehicle_no = $scope.vehicle_no;
        }
        if ($scope.route_id) {
            myFilter.route = $scope.route_id._id;
        }
        if ($scope.branch) {
            myFilter.branch = $scope.branch;
        }
        if ($scope.start_date) {
            myFilter.from = $scope.start_date;
        }
        if ($scope.end_date) {
            myFilter.to = $scope.end_date;
        }
		if($scope.vendor_id){
			myFilter.vendor = $scope.vendor_id._id;
		}
        if (isPagination && $scope.currentPage) {
            myFilter.skip = $scope.currentPage;
        }
        return myFilter;
    }
    $scope.getAllDiesel = function(isPagination) {
        function success(res) {
            if (res.data.data.data) {
                $scope.aTrip = res.data.data.data;
                $scope.total_pages = res.data.data.pages;
                $scope.totalItems = 15 * res.data.data.pages;
                if (res.data.data.data.length > 0) {
                    setTimeout(function() {
                        listItem = $($('.selectItem')[0]);
                        listItem.addClass('grn');
                    }, 200);
					$scope.tripNo = res.data.data.data[0].trip_no;
					$scope.selectedTrip = res.data.data.data[0];
                }
            }
        }
        var oFilter = prepareFilterObject(isPagination);
        tripServices.getAllTripsWithPagination(oFilter, success)
    };
    $scope.getAllDiesel();

	$scope.getVendorName = function(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vendor.getName({name:viewValue,deleted: false}, oSuc, oFail);
		} else if (viewValue == '') {
			$scope.getAllGR();
		}
	};

    $scope.clearSearch = function(val) {
        switch (val) {
            case "customer":
                $scope.customerName = '';
                $scope.getCname($scope.customerName);
                break;
            case "vehicle":
                $scope.vehicle_no = '';
                $scope.getVname($scope.vehicle_no);
                break;
            case "route":
                $scope.route_id = '';
                $scope.getDname($scope.route_id);
                break;
			case "vendor_id":
				delete $scope.vendor_id;
				$scope.getVendorName($scope.vendor_id)
				break;
            default:
                break;
        }
    };
    $scope.onSelect = function($item, $model, $label) {
        $scope.getAllDiesel();
    };
    $scope.getDname = function(viewValue) {
        function oSucD(response) {
            $scope.aRoute = response.data.data;
        }

        function oFailD(response) {
            //console.log(response);
        }
        if (viewValue && viewValue.toString().length > 2) {
            Routes.getName(viewValue, oSucD, oFailD);
        } else if (viewValue === '') {
            $scope.getAllDiesel();
        }
    };
    $scope.getCname = function(viewValue) {
        if (viewValue && viewValue.toString().length > 2) {
            function oSucC(response) {
                $scope.aCustomer = response.data.data;
            };

            function oFailC(response) {
                //console.log(response);
            }
            customer.getCname(viewValue, oSucC, oFailC);
        } else if (viewValue === '') {
            $scope.getAllDiesel();
        };
    };
    $scope.getVname = function(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            function oSuc(response) {
                $scope.aVehicles = response.data.data;
            }

            function oFail(response) {
                console.log(response);
            }

            Vehicle.getName(viewValue, oSuc, oFail);
        } else if (viewValue === '') {
            $scope.getAllDiesel();
        }
    };

    $scope.infoItem = function(info, index) {
        listItem = $($('.selectItem')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');
        $scope.tripNo = info.trip_no;
        $scope.aInfo = info.diesel_vendors;
        $scope.selectedTrip = info;
    };

    $scope.printDiesel = function(a) {
        if (a.trip_no) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/dieselRender.html',
				controller: 'dieselRendorCtrl',
				resolve: {
					thatTrip: a
				}
			});

        }
    };

	/*$scope.printDiesel = function(a) {
		if (a) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/diesel.html',
				controller: 'dieselCtrl',
				resolve: {
					thatTrip: function() {
						return billsService.prepareDieselData(a, null, null);
					}
				}
			});
		};
	}*/

    $scope.printDriver = function(oTrip) {
        if (oTrip && oTrip.gr[0]) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/bills/driver.html',
                controller: 'driverCtrl',
                resolve: {
                    thatTrip: function() {
                        return billsService.prepareDriverData(oTrip, null, null);
                    }
                }
            });
        }
    };

    $scope.myDieselDeatils = function(oTrip, index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/myDieselSlip/myDieselSlipPopUp.html',
                controller: 'myDieselPopUpCtrl',
                resolve: {
                    thatTrip: function() {
                        return oTrip;
                    }
                }
            });

            modalInstance.result.then(function() {
                $state.reload();
            }, function(data) {
                if (data !== 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }
            });
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
    /*$scope.getAllVehicles = function(){
        function success(data) {
                $rootScope.aVehicles = data.data;
          };
        var oFilter = '';
        Vehicle.getAllVehicles(oFilter,success);

    }
    $scope.getAllVehicles();*/
    /*$scope.getAllRoute = function(){
        function success(data) {
            $scope.aRoute = data.data.data;
        };
        Routes.getAllRoutes({},success);
    }
    $scope.getAllRoute();*/
    /*$scope.getCustomers = function(){
       function success(data) {
          $scope.aCustomer = data.data;
        };
       bookingServices.getAllCustomers(success);
      };
    $scope.getCustomers();*/
});

materialAdmin.controller("dieselRendorCtrl", function($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, tripServices, clientService) {
	$scope.aTemplate = clientConfig.getFeature("Diesel","Diesel Templates")?clientConfig.getFeature("Diesel","Diesel Templates"):[];
	$scope.aDiesel = [];
	$scope.aDieselData = [];

	function arrayRange( start, range ) {
		return Array( range ).fill().map(function( el, idx ){ return start + idx });
	}

	function successEx(res) {
		if (res && res.data && (res.data.status == "OK") && (res.data.data)) {
			$scope.aDieselData = res.data.data;
			$scope.aDiesel = arrayRange(1,res.data.data.length);
			if(($scope.aDiesel && $scope.aDiesel.length>0)){
				$scope.dieselKey = $scope.aDiesel[0];
				$scope.getTemplate();
			}
		}
	}
	function failureEx(res) {
		console.log(res);
	}
	$scope.getDiesel = function () {
		tripServices.getExpenseByTripId({trip_id:thatTrip._id,type:"Diesel"}, successEx, failureEx);
	};
	$scope.getDiesel();
	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};
	function success(res) {
		$scope.html = angular.copy(res.data);
	}
	function fail(res) {

	}

	$scope.getTemplate = function () {
		var oFilter = {};
		if(($scope.aTemplate && $scope.aTemplate.length>0)&&($scope.dieselTemplate && $scope.dieselTemplate.key && ($scope.dieselTemplate.key!="default"))){
			oFilter.templateName = $scope.dieselTemplate.key;
		}
		if(($scope.aDiesel && $scope.aDiesel.length>0) && ($scope.dieselKey)){
			oFilter.expense_id = $scope.aDieselData[$scope.dieselKey-1]._id;
			clientService.getDieselSlip(oFilter, success, fail);
		}
	};

});

materialAdmin.controller("myDieselPopUpCtrl", function($rootScope, $scope, $uibModalInstance,sharedResource, thatTrip, accountingService, tripServices, vendorFuelService) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
	sharedResource.shareThisResourceWith($scope);

    $scope.trip = angular.copy(thatTrip);
    if ($scope.trip.diesel_vendors && $scope.trip.diesel_vendors.length > 0) {
        $scope.aVendor = $scope.trip.diesel_vendors;
    } else {
        $scope.aVendor = [];
    }


	(function (){

		var oFilter = {
			all: true,
			group:'Transaction'
		}; // filter to send
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response){
			$scope.aAccountMasterTransaction = response.data.data;
		}
	})();
	(function(){

		var oFilter = {
			all: true,
			group:'Driver'
		}; // filter to send
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response){
			$scope.aAccountMasterDriver = response.data.data;
		}
	})();

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

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form ******************//

	$scope.aFuelStations = [];
	$scope.aDtype = ['Driver Cash', 'Diesel', 'Toll Tax','Extra Diesel'];
	$scope.diesel_info = {};
	$scope.objDiesel = {};
    //$scope.aVendor = [{vendor_name:"xyz",fuel_type:"abc",rate:50,litres:4,amount:200}];
    $scope.total_diesel_alloted = 0;
    $scope.total_diesel_cost = 0;
    $scope.sendable = false;
    $scope.cashError = false;

    $scope.addMoreCash = false;

    $scope.addDcash = function() {
        if ($scope.addMoreCash === true) {
            $scope.addMoreCash = false;
        } else {
            $scope.addMoreCash = true;
        }
    };

    $scope.$watchGroup(['diesel_info.rate', 'diesel_info.litre', 'diesel_info.amount'], function(newValues, oldValues, scope) {
        // newValues array contains the current values of the watch expressions
        if ($scope.diesel_info) {
            if ($scope.diesel_info.rate && $scope.diesel_info.litre) {
                $scope.diesel_info.amount = Number(($scope.diesel_info.rate * $scope.diesel_info.litre).toFixed(2));
                $scope.objDiesel.amount = $scope.diesel_info.amount;
            } else {
                $scope.diesel_info.amount = null;
            }
        }
    });

    $scope.validateAmount = function (amt) {
    	if($scope.objDiesel.type==='Driver Cash'){
    		if($scope.trip.vendorDeal && $scope.trip.vendorDeal.driver_cash){
				if(amt > $scope.trip.vendorDeal.driver_cash){
					swal('warning','Please enter less then or equal to vendor driver cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
    		}else if($scope.trip.route && $scope.trip.route.rates && $scope.trip.route.rates.allot && $scope.trip.route.rates.allot.cash) {
				if (amt > $scope.trip.route.rates.allot.cash) {
					swal('warning','Please enter less then or equal to route rate allot cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		}else if($scope.objDiesel.type==='Diesel'){
    		if($scope.trip.vendorDeal && $scope.trip.vendorDeal.diesel && $scope.trip.vendorDeal.diesel.amount){
				if(amt > $scope.trip.vendorDeal.diesel.amount){
					swal('warning','Please enter less then or equal to vendor diesel cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
    		}else if($scope.trip.route && $scope.trip.route.rates && $scope.trip.route.rates.allot && $scope.trip.route.rates.allot.cash) {
				if (amt > $scope.trip.route.rates.allot.cash) {
					swal('warning','Please enter less then or equal to route rate allot cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		}else if($scope.objDiesel.type==='Toll Tax'){
			if($scope.trip.vendorDeal && $scope.trip.vendorDeal.toll_tax){
				if(amt > $scope.trip.vendorDeal.toll_tax){
					swal('warning','Please enter less then or equal to vendor toll tax cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}else if($scope.trip.route && $scope.trip.route.rates && $scope.trip.route.rates.allot && $scope.trip.route.rates.allot.cash) {
				if (amt > $scope.trip.route.rates.allot.cash) {
					swal('warning','Please enter less then or equal to route rate allot cash','warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		}

	};

    (function() {
        function fuelSucc(res) {
            if (res.data.data) {
                $scope.aFuelVendor = res.data.data;
            }
        }
        vendorFuelService.getAllFuelVendors({}, fuelSucc);
    })();

    $scope.fuelFunc = function(item) {
        function successGetStation(response) {
            if (response && response.data) {
                $scope.aFuelStations = response.data.data;
            }
        }

        function failGetStation(res) {

        }
        vendorFuelService.GetFuelStationAll(item.vendorId, successGetStation, failGetStation);
    };

    $scope.fuelStationFunc = function(item) {
        if (item.fuel_price) {
            $scope.diesel_info.rate = item.fuel_price;
        }
    };

    $scope.selectBank = function (bankD) {
		if(bankD){
			$scope.banking_detail = bankD;
		}
	};


    $scope.getExpenses = function () {
		function successEx(res) {
			if (res && res.data && (res.data.status === "OK")) {
				//if(!$scope.$$phase) {
					//$scope.$apply(function () {
						$scope.objExp = {};
						$scope.objExp.aTripExpense = res.data.data;
					//});
				//}

			} else {
				//$uibModalInstance.dismiss(res);
			}
		}

		function failureEx(res) {
			$uibModalInstance.dismiss(res);
		}

		tripServices.getExpenseByTripId({trip_id:$scope.trip._id}, successEx, failureEx);
	};
	$scope.getExpenses();

	$scope.typeChange = function (type) {
		$scope.diesel_info.litre = 0;
		$scope.diesel_info.amount = 0;
		$scope.objDiesel.amount = 0;
	};

	$scope.selectData = function (data ,index) {
		$scope.selectedMasterData = data;
	};

    $scope.updateTrip = function() {
		$scope.doneExpense = false;

		$scope.totalDieselExpense = 0;
		$scope.totalExtraDieselExpense = 0;
		$scope.totalCashExpense = 0;
		$scope.totalTollExpense = 0;
    	if($scope.objExp && $scope.objExp.aTripExpense && $scope.objExp.aTripExpense.length>0){
    		for(var t=0;t<$scope.objExp.aTripExpense.length;t++){
				if($scope.objExp.aTripExpense[t].type==='Diesel') {
					if ($scope.objExp.aTripExpense[t].diesel_info) {
						$scope.totalDieselExpense += $scope.objExp.aTripExpense[t].diesel_info.litre || 0;
					}
				}
				if($scope.objExp.aTripExpense[t].type==='Extra Diesel') {
					if ($scope.objExp.aTripExpense[t].diesel_info) {
						$scope.totalExtraDieselExpense += $scope.objExp.aTripExpense[t].diesel_info.litre || 0;
					}
				}
				if($scope.objExp.aTripExpense[t].type==='Driver Cash') {
					$scope.totalCashExpense += $scope.objExp.aTripExpense[t].amount || 0;
				}
				if($scope.objExp.aTripExpense[t].type==='Toll Tax') {
					$scope.totalTollExpense += $scope.objExp.aTripExpense[t].amount || 0;
				}
			}
		}

    	if($scope.objDiesel.type === 'Diesel'){
    		var flag = false;

    		if(!$scope.diesel_info.vendor)
    			flag = true;
			if(!$scope.diesel_info.station)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.rate) || $scope.diesel_info.rate < 0)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.litre) || $scope.diesel_info.litre < 0)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.amount) || $scope.diesel_info.amount < 0)
				flag = true;

			if(flag) {
				swal('All Mandatory Fields are not filled.');
				return;
			}

			//********* validation for master rates ********//
			if($scope.aMasterRate[0].routeData) {
				if ($scope.selectedMasterData && $scope.selectedMasterData.routeData && $scope.selectedMasterData.routeData.allot) {
					if ($scope.selectedMasterData.routeData.allot.diesel >= ($scope.totalDieselExpense + $scope.diesel_info.litre || 0)) {
						$scope.doneExpense = true;
					} else {
						//swal('warning', 'Please add less then master diesel liter', 'warning');
						var extraDiesel = ($scope.totalDieselExpense + $scope.diesel_info.litre || 0) - $scope.selectedMasterData.routeData.allot.diesel;
						var diesel = $scope.diesel_info.litre - extraDiesel;


						swal({
							title: "Are you sure?",
							text: "You want to done diesel! Diesel: "+diesel+" and extra diesel: "+extraDiesel,
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: '#DD6B55',
							confirmButtonText: 'Yes, sure',
							cancelButtonText: "No, cancel it!",
							closeOnConfirm: true,
							closeOnCancel: true
						},
						function(isConfirm) {
							if (isConfirm) {
								//$scope.doneExpense = true;
								$scope.diesel_info.litre = diesel;



								var oSend = {};
								//oSend.banking_detail = $scope.banking_detail;
								oSend = $scope.objDiesel;
								oSend.trip_no = $scope.trip.trip_no;
								oSend.trip = $scope.trip._id;
								oSend.diesel_info = angular.copy($scope.diesel_info);
								oSend.diesel_info.litre = diesel;

								if(oSend.diesel_info.litre && oSend.diesel_info.litre >0) {
									addExpense(true, oSend);
								}


								var oSendExtraDiesel = {};
								//oSend.banking_detail = $scope.banking_detail;
								oSendExtraDiesel = angular.copy($scope.objDiesel);
								oSendExtraDiesel.type = 'Extra Diesel';
								oSendExtraDiesel.trip_no = $scope.trip.trip_no;
								oSendExtraDiesel.trip = $scope.trip._id;
								oSendExtraDiesel.diesel_info = angular.copy($scope.diesel_info);
								oSendExtraDiesel.diesel_info.litre = extraDiesel;

								if(oSendExtraDiesel.diesel_info.litre && oSendExtraDiesel.diesel_info.litre>0) {
									addExpense(true, oSendExtraDiesel);
								}

							} else {
								//swal("Cancelled", "Diesel not done :)", "error");
							}
						});



						//$scope.doneExpense = false;
					}
				} else {
					swal('warning','Select data from top for checking diesel','warning');
					$scope.doneExpense = false;
				}
			}
		}
		if($scope.objDiesel.type === 'Extra Diesel'){
			var flag = false;

			if(!$scope.diesel_info.vendor)
				flag = true;
			if(!$scope.diesel_info.station)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.rate) || $scope.diesel_info.rate < 0)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.litre) || $scope.diesel_info.litre < 0)
				flag = true;
			if(!Number.isFinite($scope.diesel_info.amount) || $scope.diesel_info.amount < 0)
				flag = true;

			if(flag) {
				swal('All Mandatory Fields are not filled.');
				return;
			}

			//********* validation for master rates ********//
			if($scope.aMasterRate[0].routeData) {
				if ($scope.selectedMasterData && $scope.selectedMasterData.routeData && $scope.selectedMasterData.routeData.allot) {
					if (($scope.selectedMasterData.routeData.allot.diesel/2) >= ($scope.totalExtraDieselExpense + $scope.diesel_info.litre || 0)) {
						$scope.doneExpense = true;
					} else {
						swal('warning', 'Please add less then half of master diesel liter', 'warning');
						$scope.doneExpense = false;
					}
				} else {
					swal('warning','Select data from top for checking diesel','warning');
					$scope.doneExpense = false;
				}
			}
		}
		if($scope.objDiesel.type === 'Driver Cash'){
			if($scope.aMasterRate[0].routeData) {
				if ($scope.selectedMasterData && $scope.selectedMasterData.routeData && $scope.selectedMasterData.routeData.allot) {
					if ($scope.selectedMasterData.routeData.allot.cash >= ($scope.totalCashExpense + $scope.objDiesel.amount || 0)) {
						$scope.doneExpense = true;
					} else {
						$scope.doneExpense = false;
						swal('warning', 'Please add less then master cash amount', 'warning');
					}
				} else {
					swal('warning','Select data from top for checking cash','warning');
					$scope.doneExpense = false;
				}
			}
		}
		if($scope.objDiesel.type === 'Toll Tax'){
    		if($scope.aMasterRate[0].routeData) {
				if ($scope.selectedMasterData && $scope.selectedMasterData.routeData && $scope.selectedMasterData.routeData.allot) {
					if ($scope.selectedMasterData.routeData.allot.toll >= ($scope.totalTollExpense + $scope.objDiesel.amount || 0)) {
						$scope.doneExpense = true;
					} else {
						$scope.doneExpense = false;
						swal('warning', 'Please add less then master toll amount', 'warning');
					}
				} else {
					swal('warning','Select data from top for checking toll','warning');
					$scope.doneExpense = false;
				}
			}
		}



		var oSend = {};
		//oSend.banking_detail = $scope.banking_detail;
		oSend = $scope.objDiesel;
		oSend.trip_no = $scope.trip.trip_no;
		oSend.trip = $scope.trip._id;
		if(oSend.type === 'Extra Diesel' || oSend.type === 'Diesel') {
			oSend.diesel_info = $scope.diesel_info;
		}
		addExpense($scope.doneExpense,oSend);
    };

    function addExpense(doneExpense,oSend) {
		function success(res) {
			if (res && res.data && (res.data.status === "OK")) {
				$scope.getExpenses();
				$scope.objDiesel = null;
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			$uibModalInstance.dismiss(res);
		}
		if(doneExpense === true){
			tripServices.addExpenseOnDiesel(oSend, success, failure);
		}else if(!$scope.aMasterRate[0].routeData) {
			tripServices.addExpenseOnDiesel(oSend, success, failure);
		}
	}

	$scope.aMasterRate = $scope.trip.gr.map(function(obj){
		if(obj.booking.contract_id){
			if(obj.booking.routeData) {
				obj.routeData = obj.booking.routeData.data.find(vObj => ((vObj.vehicle_type_id === obj.trip.vehicle.veh_type._id) && (vObj.booking_type === obj.booking.booking_type)));
				return obj;
				// return {
				// 	'booking_no': obj.booking.booking_no,
				// 	'customerName': obj.booking.customer.name,
				// 	'contract': obj.booking.contract_id.name,
				// 	'diesel': obj.routeData.allot.diesel,
				// 	'cash': obj.routeData.allot.cash,
				// 	'toll': obj.routeData.allot.toll,
				// };
			}else{
				return {x: 'y'};
			}
		}else{
			let route = (obj.trip.route.route_time || []).find(obj => {
				return obj.vehicle_type_id === $scope.trip.vehicle.veh_type._id;
			});
			if(route){
				obj.booking.contract_id = {};
				obj.booking.contract_id.name = 'One Time';
				obj.routeData = {};
				obj.routeData.allot = {};
				obj.routeData.allot.diesel = route.diesel_allot;
				obj.routeData.allot.cash = route.cash_allot;
				obj.routeData.allot.toll = route.toll_tax;
				return obj;
			}else
				return {x: 'y'};
		}
	});
	//console.log($scope.aMasterRate)
});
