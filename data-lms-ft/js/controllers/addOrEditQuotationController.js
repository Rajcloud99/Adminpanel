materialAdmin
	.controller("addOrEditQuotationController", addOrEditQuotationController);

addOrEditQuotationController.$inject = [
	'$scope',
	'$rootScope',
	'accountingService',
	'lazyLoadFactory',
	'stateDataRetain',
	'branchService',
	'Vehicle',
	'$state',
	'$uibModal',
    'growlService',
    'bookingServices',
    '$stateParams',
	'$modal',
	'Vendor',
];


function addOrEditQuotationController(
	$scope,
	$rootScope,
	accountingService,
	lazyLoadFactory,
	stateDataRetain,
	branchService,
	Vehicle,
	$state,
	$uibModal,
    growlService,
    bookingServices,
    $stateParams,
	$modal,
	Vendor
) {

	// functions Identifiers
	$scope.getAllVehicle = getAllVehicle;
	$scope.accountMaster = accountMaster;
    $scope.getAllBranch = getAllBranch;
    $scope.getIdData = getIdData;
    $scope.getQuotationData = getQuotationData;
	$scope.deleteQuotation = deleteQuotation;
	$scope.finalQuotation = finalQuotation;
	$scope.revertFinalQuotation = revertFinalQuotation;
	$scope.getVendorName = getVendorName;
	$scope.closingReason = closingReason;
	$scope.someFun = someFun;
	$scope.downloadQuot = downloadQuot;


	// INIT functions
	(function init() {
        $scope.edit = false;
        if($stateParams && $stateParams.id) {
			$scope.storeParamid = $stateParams.id;
            // update mode
            $scope.edit = true;
            $scope.getIdData($stateParams.id);
            $scope.getQuotationData($stateParams.id);
        } else {
            // add mode
            $scope.edit = false;
        }
		$scope.oFilter = {}; // initialize filter object
		$scope.maxDate = new Date();
		$scope.selectType = 'index';

    })();



    // get the id from param and get the data
    function getIdData(id) {
        bookingServices.getAllBookings({_id: id}, onSuccess, err => {
            console.log(err);
        });

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				$scope.receivedIdData = response.data.data[0];
				$rootScope.receivedIdData = $scope.receivedIdData; // pass the data in quotation modal and prefill vehicle type
			}
		}
    }

    function getQuotationData (id) {
		const oFilter = prepareFilterObject();
		oFilter.booking = id;
        bookingServices.getVendorQuotation(oFilter, onSuc, err => {
            console.log(err);
        });
        function onSuc(response) {
            if(response) {
				$scope.receivedQuotation = response && response.data && response.data.data;
				$scope.selectedRowVal = '';
            }
		}
    }

	function downloadQuot (id) {
		const oFilter = prepareFilterObject();
		oFilter.booking = id;
		oFilter.download = true;

		bookingServices.getVendorQuotation(oFilter, onSuc, err => {
			console.log(err);
		});

		function onSuc(d) {
			if(d.data.url) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', d.data.message, 'success');
			}
		}
	}

    function deleteQuotation() {
        if(!$scope.selectedRowVal) {
            return swal('Error!', 'Please select Quotation', 'error');
		}
		const isFinalQuotExist = $scope.receivedQuotation.some(quot => quot.finalised.status);
		if(isFinalQuotExist) {
			return swal('Error!', 'You cannot delete the Quotation because Quotation is already finalize ', 'error');
		}
		swal({
			title: 'Are you sure you want to delete this Quotation?',
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
					bookingServices.deleteVendorQuotation({_id: $scope.selectedRowVal._id}, onSuc, err => {
						console.log(err);
					});
					function onSuc(response) {
						if(response) {
							getQuotationData($stateParams.id);
						}
					}
				}
			});
	}

	function finalQuotation( ){
		if(!$scope.selectedRowVal) {
            return swal('Error!', 'Please select Quotation', 'error');
		}
		const isFinalQuotExist = $scope.receivedQuotation.some(quot => quot.finalised.status);
		if(isFinalQuotExist) {
			return swal('Error!', 'You cannot final the Quotation because Quotation is already finalize ', 'error');
		}

		swal({
			title: 'Are you sure you want to finalize this Quotation?',
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
					bookingServices.finalizeVendorQuotation({_id: $scope.selectedRowVal._id}, success, failure);

					function success(response) {
						if(response) {
							swal("Success", 'Quotation finalize successfully', "success");
							getQuotationData($stateParams.id);
						}
					}

					function failure(res) {
						swal('Error', res.data.message, 'error');
					}
				}
			});
	}

	function closingReason(){

		if(!$scope.selectedRowVal) {
			return swal('Error!', 'Please select Quotation', 'error');
		}

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myBookings/quotationRemark.html',
			controller: ['$scope', '$uibModalInstance', 'selectedRow', 'bookingServices', quotationRemarkController],
			controllerAs: 'rVm',
			resolve: {
				selectedRow: function () {
					return $scope.selectedRowVal;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			getQuotationData($stateParams.id);
		}, function (data) {

		});
	}

	function revertFinalQuotation() {
		if(!$scope.selectedRowVal) {
            return swal('Error!', 'Please select Quotation', 'error');
		}
		if(!($scope.selectedRowVal.finalised && $scope.selectedRowVal.finalised.status)) {
			return swal('Error!', 'You cannot revert the Quotation because Quotation is not finalize ', 'error');
		}


		swal({
				title: 'Are you sure you want to revert the finalize Quotation?',
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
					bookingServices.revertFinalizeVendorQuotation({_id: $scope.selectedRowVal._id}, success, failure);

					function success(response) {
						if(response) {
							swal("Success", 'Quotation revert successfully', "success");
							getQuotationData($stateParams.id);
						}
					}

					function failure(res) {
						swal('Error', res.data.message, 'error');
					}
				}
			});
	}

    function someFun(value) {
        $scope.selectedRowVal = value;
    }

	function getAllBranch(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				branchService.getAllBranches(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function accountMaster(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {
				accountingService.getAccountMaster({
					name: viewValue,
					no_of_docs: 6,
					sort: {
						name: 1
					}
				}, res => {
					resolve(res.data.data)
				}, err => {
					console.log`${err}`;
					reject([])
				});
			});
		} else
			return [];
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

    $scope.addQuotation = function(oBooking) {
		const isFinalQuotExist = $scope.receivedQuotation.some(quot => quot.finalised.status);
		if(isFinalQuotExist) {
			return swal('Error!', 'You cannot add the Quotation because Quotation is already finalize', 'error');
		}
		let selectedInfo = $scope.receivedIdData;
		var modalInstance = $modal.open({
            templateUrl: 'views/myBookings/quotationModal.html',
            size: 'xl',
            controller: 'addQuotationController',
            controllerAs: 'ackDealVm',
			resolve: {
				selectedInfo,
				isEdit: false
			}
		});

		modalInstance.result.then(function (response) {
			if (response) {
				// $scope.account = response._id;
			}
		}, function (data) {
			getQuotationData($stateParams.id);
		});
	}

	$scope.EditQuotation = function () {
		if(!$scope.selectedRowVal) {
            return swal('Error!', 'Please select Quotation', 'error');
		}
		const isFinalQuotExist = $scope.receivedQuotation.some(quot => quot.finalised.status);
		if(isFinalQuotExist) {
			return swal('Error!', 'You cannot modify the Quotation because Quotation is already finalize ', 'error');
		}
		$scope.selectedRowVal.total_expense = $scope.selectedRowVal.rate;
		let vd = $scope.selectedRowVal;
		let selectedInfo = {};
		selectedInfo['vendorDeal'] = vd;
		selectedInfo['vendorDeal']['selectedVendor'] = vd.vendor.name;
		var modalInstance = $modal.open({
            templateUrl: 'views/myBookings/quotationModal.html',
            size: 'xl',
            controller: 'addQuotationController',
            controllerAs: 'ackDealVm',
			resolve: {
				selectedInfo,
				isEdit: true
			}
		});

		modalInstance.result.then(function (response) {
			if (response) {

				// $scope.account = response._id;
			}
			console.log('close', response);
		}, function (data) {
			getQuotationData($stateParams.id);
		});
	}

	function prepareFilterObject() {
		var filter = {};
		// console.log('$scope.oFilter', $scope.oFilter);
		if($scope.oFilter && $scope.oFilter.vendor) {
			filter.vendor = $scope.oFilter.vendor._id;
		}
		if($scope.oFilter && $scope.oFilter.frmdt && !($scope.oFilter && $scope.oFilter.todt)) {
			return swal('Error!', 'Please enter Start and End Date', 'error');
		}

		if($scope.oFilter && $scope.oFilter.frmdt) {
			filter.from = moment($scope.oFilter.frmdt, 'DD/MM/YYYY').startOf('day').toISOString();
		}

		if($scope.oFilter && $scope.oFilter.todt) {
			filter.to = moment($scope.oFilter.todt, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		return filter;
	}


	function getVendorName(viewValue, elseObj = false){
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
			}

			let res = {
				deleted: false
			};

			if (elseObj)
				Object.assign(res, elseObj);
			else
				res.name = viewValue;

			Vendor.getName(res, oSuc, oFail);
		});
    }

}

/*
* Add the Quotation
*/
materialAdmin.controller('addQuotationController', function (
	$scope,
	$rootScope,
	selectedInfo,
	isEdit,
	$uibModalInstance,
	DatePicker,
	userService,
    bookingServices,
    Vendor,
	billsService,
	$stateParams,
	formulaFactory,
	Vehicle,
) {
    let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.getAllUsers = getAllUsers;


	// functions Identifiers
	$scope.submit = submit;
    $scope.closeModal = closeModal;
    vm.getVendorName = getVendorName;
	vm.getTDSRate = getTDSRate;
	vm.getVname = getVname;
	vm.getQuotationData = getQuotationData;
	vm.changeAdvance = changeAdvance;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.changeAcPayment = changeAcPayment;
	vm.formulaCommonCalFun = formulaCommonCalFun;
	vm.changePayType = changePayType;
	vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
	vm.resetAll = resetAll;
	vm.autoMunsiyanaCal = autoMunsiyanaCal;
	// INIT functions
    (function init() {

		vm.aTripData = angular.copy(selectedInfo);
		vm.recVehType = $rootScope.receivedIdData && $rootScope.receivedIdData.preference &&
			$rootScope.receivedIdData.preference[0] && $rootScope.receivedIdData.preference[0]._id;
		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
		}

		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.percentage) {
			vm.aWeightTypes.push('Percentage');
		}


		if (!vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.totWithMunshiyana)
			formulaCommonCalFun();

		$scope.$watchGroup(['ackDealVm.aTripData.vendorDeal.munshiyana', 'ackDealVm.aTripData.vendorDeal.total_expense', 'ackDealVm.aTripData.vendorDeal.otherExp'], function (...aMod) {
			formulaCommonCalFun();
		});

	})();

	(function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				vm.aVehicleTypes = res.data.data;
				let findItem;
				if(vm.recVehType) {
					findItem = vm.aVehicleTypes.find(item => item._id === vm.recVehType);
					if(findItem) {
						vm.aTripData.vendorDeal = {
							...vm.aTripData.vendorDeal,
						}
						vm.aTripData['vendorDeal']['vehicle'] = findItem;
						if(vm.recVehType) {
							vm.isDisableVehType = true;
						}
					} else {
						vm.isDisableVehType = false;
					}
				} else {
					findItem = vm.aVehicleTypes.find(item => item._id === vm.aTripData.vendorDeal.vt);
					if(findItem) {
						// vm.aTripData.vendorDeal = {};
						vm.aTripData.vendorDeal.vehicle = findItem;
						if(vm.recVehType) {
							vm.isDisableVehType = true;
						}
					} else {
						vm.isDisableVehType = false;
					}
				}

			}
		}

		function failType(res) {
			vm.aVehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	})();

	// Operations
	if (typeof oBooking !== 'undefined' && oBooking !== null) {
		$scope.oTest = angular.copy(oBooking); //initialize with param

	}

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}


	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.munshiyana,
			'total_expense': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.total_expense,
			'otherExp': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.otherExp
		});
		vm.aTripData.vendorDeal.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
	}

		// auto Munsiyana calculate from vm.aTripData.vendorDeal.total_expense or total expense
	function autoMunsiyanaCal(){
       if($scope.$configs.tripAdv && $scope.$configs.tripAdv.autoCalMunsiyana) {
		   if (vm.aTripData.vendorDeal.total_expense < 10000) {
			   vm.aTripData.vendorDeal.munshiyana = 100;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 10000 && vm.aTripData.vendorDeal.total_expense < 20000) {
			   vm.aTripData.vendorDeal.munshiyana = 200;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 20000 && vm.aTripData.vendorDeal.total_expense < 30000) {
			   vm.aTripData.vendorDeal.munshiyana = 300;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 30000 && vm.aTripData.vendorDeal.total_expense < 40000) {
			   vm.aTripData.vendorDeal.munshiyana = 400;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 40000 && vm.aTripData.vendorDeal.total_expense < 50000) {
			   vm.aTripData.vendorDeal.munshiyana = 500;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 50000 && vm.aTripData.vendorDeal.total_expense < 100000) {
			   vm.aTripData.vendorDeal.munshiyana = 600;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 100000 && vm.aTripData.vendorDeal.total_expense < 110000) {
			   vm.aTripData.vendorDeal.munshiyana = 1100;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 110000 && vm.aTripData.vendorDeal.total_expense < 120000) {
			   vm.aTripData.vendorDeal.munshiyana = 1200;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 120000 && vm.aTripData.vendorDeal.total_expense < 130000) {
			   vm.aTripData.vendorDeal.munshiyana = 1300;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 130000 && vm.aTripData.vendorDeal.total_expense < 140000) {
			   vm.aTripData.vendorDeal.munshiyana = 1400;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 140000 && vm.aTripData.vendorDeal.total_expense < 150000) {
			   vm.aTripData.vendorDeal.munshiyana = 1500;
		   } else if (vm.aTripData.vendorDeal.total_expense >= 150000 && vm.aTripData.vendorDeal.total_expense < 200000) {
			   vm.aTripData.vendorDeal.munshiyana = 1600;
		   } else {
			   vm.aTripData.vendorDeal.munshiyana = 0;
		   }
	   }
	}

    function getVendorName(viewValue, elseObj = false) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
			}

			let res = {
				deleted: false
			};

			if (elseObj)
				Object.assign(res, elseObj);
			else
				res.name = viewValue;

			if ((vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId))
				res.cClientId = vm.aTripData.vendor && vm.aTripData.vendor.clientId || vm.aTripData.vendor_id.clientId;

			Vendor.getName(res, oSuc, oFail);
		});
    }

    function getTDSRate() {
		if (vm.tdsVerify && vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && vm.aTripData.vendorDeal.deal_at) {
			let oReq = {
				date: vm.aTripData.vendorDeal.deal_at,
				cClientId: $scope.selectedClient
			};
			let isGetTDS = true;
			if(vm.aTripData.vendor && vm.aTripData.vendor.exeRate && vm.aTripData.vendor.exeFrom && vm.aTripData.vendor.exeTo){
				if(new Date(vm.aTripData.vendorDeal.deal_at) >= new Date(vm.aTripData.vendor.exeFrom) && new Date(vm.aTripData.vendorDeal.deal_at) <= new Date(vm.aTripData.vendor.exeTo)) {
					vm.aTripData.vendorDeal.tdsPercent = vm.aTripData.vendor.exeRate;
					isGetTDS = false;
				}
			}

			if(isGetTDS)
			billsService.getTDSRate(oReq, onSuccess, onFailure);


			function onSuccess(res) {
				if (res.data && res.data.data && res.data.data.length) {
					vm.allTDSRate = res.data.data[0];
					vm.allTDSRate.aRate.forEach(obj => {
						if (obj.sources === vm.tdsSources) {
							switch (vm.tdsCategory) {
								case 'Individuals or HUF': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.ipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.nipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.niwpRate;
								}
								default:
									return vm.aTripData.vendorDeal.tdsPercent = 0;
							}
						}
					});
				}
			}

			function onFailure(err) {

			}
		}

	}

	function getAllUsers(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				userService.getUsers({all: true, full_name: viewValue, user_type: 'Trip Manager'}, oSuc, oFail);
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

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			// let req = {
			// 	veh_type_name: viewValue
			// };
			return new Promise(function (resolve, reject) {
				Vehicle.getNameTrim(viewValue, oSuc, oFail);

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

	function changePayType(pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0);
			vm.aTripData.vendorDeal.advance = 0;
			if (vm.aTripData.vendorDeal.diesel) {
				vm.aTripData.vendorDeal.diesel.quantity = 0;
				vm.aTripData.vendorDeal.diesel.rate = 0;
				vm.aTripData.vendorDeal.diesel.amount = 0;
			}
			vm.aTripData.vendorDeal.driver_cash = 0;
			vm.aTripData.vendorDeal.toll_tax = 0;
			vm.aTripData.vendorDeal.other_charges = 0;
			vm.aTripData.vendorDeal.other_charges_remark = '';
			vm.aTripData.vendorDeal.account_payment = 0;
		}
	}

	function calculateTotalPMT() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.pmtWeight || 0) * (vm.aTripData.vendorDeal.pmtRate || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function calculateTotalPUnit() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.perUnitPrice || 0) * (vm.aTripData.vendorDeal.totalUnits || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function resetAll() {
		vm.aTripData.vendorDeal.total_expense = undefined;
		vm.aTripData.vendorDeal.munshiyana = undefined;
		vm.aTripData.vendorDeal.advance = undefined;
		vm.aTripData.vendorDeal.toPay = undefined;
		vm.aTripData.vendorDeal.pmtWeight = undefined;
		vm.aTripData.vendorDeal.pmtRate = undefined;
		vm.aTripData.vendorDeal.perUnitPrice = undefined;
		vm.aTripData.vendorDeal.totalUnits = undefined;
	}

	function changeAcPayment() {
		vm.aTripData.vendorDeal.account_payment = (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.diesel ? (vm.aTripData.vendorDeal.diesel.amount || 0) : 0) - (vm.aTripData.vendorDeal.driver_cash || 0) - (vm.aTripData.vendorDeal.toll_tax || 0) - (vm.aTripData.vendorDeal.other_charges || 0);
	}

	function changeAdvance(type) {
		// var tot_exp = angular.copy(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.total_expense);
		// var joint_exp = (vm.aTripData.vendorDeal.toPay || 0) + (vm.aTripData.vendorDeal.advance || 0);
		// if (type === 'munshiyana') {
		// 	if (vm.aTripData.vendorDeal.munshiyana > vm.aTripData.vendorDeal.total_expense) {
		// 		vm.aTripData.vendorDeal.munshiyana = vm.aTripData.vendorDeal.total_expense;
		// 	}
		// 	if (vm.aTripData.vendorDeal.toPay >= vm.aTripData.vendorDeal.munshiyana) {
		// 		vm.aTripData.vendorDeal.toPay = vm.aTripData.vendorDeal.toPay - vm.aTripData.vendorDeal.munshiyana;
		// 		changeAdvance('topay');
		// 	} else if (vm.aTripData.vendorDeal.advance >= vm.aTripData.vendorDeal.munshiyana) {
		// 		vm.aTripData.vendorDeal.advance = vm.aTripData.vendorDeal.advance - vm.aTripData.vendorDeal.munshiyana;
		// 		changeAdvance('advance');
		// 	}
		// }
		// if (type === 'advance') {
		// 	vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0);
		// }
		// if (type === 'topay') {
		// 	vm.aTripData.vendorDeal.advance = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.toPay || 0);
		// }
		// if (vm.aTripData.vendorDeal.payment_type === 'To pay' || vm.aTripData.vendorDeal.payment_type === 'To be billed') {
		// 	vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0);
		// 	vm.aTripData.vendorDeal.advance = 0;
		// }
		var tot_exp = angular.copy(vm.aTripData.vendorDeal.total_expense);
		var joint_exp = (vm.aTripData.vendorDeal.toPay || 0) + (vm.aTripData.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (type === 'advance') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (vm.aTripData.vendorDeal.payment_type === 'To pay' || vm.aTripData.vendorDeal.payment_type === 'To be billed') {
			// vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
			vm.aTripData.vendorDeal.advance = 0;
		}

		if(vm.aTripData.vendorDeal.weight_type === 'Percentage' && vm.aTripData.vendorDeal.weightPercent){
			vm.aTripData.vendorDeal.advance = ((vm.aTripData.vendorDeal.total_expense || 0)*(vm.aTripData.vendorDeal.weightPercent))/100
		}

		if (vm.aTripData.vendorDeal.payment_type != 'Advance & to pay' && vm.aTripData.vendorDeal.payment_type != 'Advance & to be billed'&& vm.aTripData.vendorDeal.payment_type != 'Advance & chit') {
			vm.aTripData.vendorDeal.advance = 0;
		}
	}

	$scope.removeUser = function (select, index) {
		$scope.aTrafficManager.splice(index, 1);
	}

	function getQuotationData (id) {
        bookingServices.getVendorQuotation({booking: id}, onSuc, err => {
            console.log(err);
        });
        function onSuc(response) {
            if(response) {
                $scope.receivedQuotation = response && response.data && response.data.data;
            }
		}
    }

	// add or modify traffic manager
	function submit(formData) {
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.selectedVendor)) {
			return swal('Error!', 'Vendor is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.date)) {
			return swal('Error!', 'Date is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.vehicle)) {
			return swal('Error!', 'Vehicle is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.payment_type)) {
			return swal('Error!', 'Payment Type is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.weight_type)) {
			return swal('Error!', 'Payment Basis is required', 'error');
		}
		if (vm.aTripData.vendorDeal) {

			if (vm.aTripData.vendorDeal.total_expense <= vm.aTripData.vendorDeal.munshiyana) {
				return swal('Error', 'Total Expense should be greater than Munshiyana', 'error');
			}
			if(!vm.aTripData.vendorDeal.total_expense) {
				return swal('Error', 'Please Enter Total', 'error');
			}

			vm.aTripData.vendorDeal.total_expense = vm.aTripData.vendorDeal.total_expense || 0;
			vm.aTripData.vendorDeal.munshiyana = vm.aTripData.vendorDeal.munshiyana || 0;
			vm.aTripData.vendorDeal.advance = vm.aTripData.vendorDeal.advance || 0;
			vm.aTripData.vendorDeal.totalCharges = vm.aTripData.vendorDeal.totalCharges || 0;
			vm.aTripData.vendorDeal.totalDeduction = vm.aTripData.vendorDeal.totalDeduction || 0;
			vm.aTripData.vendorDeal.totWithMunshiyana = vm.aTripData.vendorDeal.totWithMunshiyana || 0;
			vm.aTripData.vendorDeal.toPay = vm.aTripData.vendorDeal.toPay || 0;
			vm.aTripData.vendorDeal.tdsAmount = vm.aTripData.vendorDeal.tdsAmount || 0;
			if(vm.aTripData.vendorDeal.advance > vm.aTripData.vendorDeal.totWithMunshiyana) {
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
		}
		vm.aTripData.vendorDeal['booking'] = $stateParams.id;
		vm.aTripData.vendorDeal['rname'] = selectedInfo && selectedInfo.route && selectedInfo.route[0] && selectedInfo.route[0].name;
		vm.aTripData.vendorDeal['route'] = selectedInfo && selectedInfo.route && selectedInfo.route[0] && selectedInfo.route[0]._id;
		vm.aTripData.vendorDeal['vendor'] = vm.aTripData.vendorDeal.selectedVendor._id;
		vm.aTripData.vendorDeal['vehicleType'] = vm.aTripData.vendorDeal.vehicle.code;
		vm.aTripData.vendorDeal['vt'] = vm.aTripData.vendorDeal.vehicle._id;
		vm.aTripData.vendorDeal['rate'] = vm.aTripData.vendorDeal.total_expense;
		vm.aTripData.vendorDeal['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;

		if(isEdit) {
			bookingServices.updateVendorQuotation(vm.aTripData.vendorDeal, onSucc, err => {
				console.log(err);
			});
			function onSucc(response) {
				if(response) {
					var msg = response.data.message;
					if(response && response.data && response.data.status === 'ERROR') {
						return swal('Error!', msg, 'error');
					}
					swal("Success", msg, "success");
					$uibModalInstance.dismiss();
					getQuotationData($stateParams.id);
				}
			}
		} else {
			bookingServices.addVendorQuotation(vm.aTripData.vendorDeal, onSucc, err => {
				console.log(err);
			});
			function onSucc(response) {
				if(response) {
					var msg = response.data.message;
					if(response && response.data && response.data.status === 'ERROR') {
						return swal('Error!', msg, 'error');
					}
					swal("Success", msg, "success");
					$uibModalInstance.dismiss();
					getQuotationData($stateParams.id);
				}
			}
		}


	}

});

function quotationRemarkController(
	$scope,
	$uibModalInstance,
	selectedRow,
	bookingServices,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;

	// init
	(function init() {
		vm.oBooking = angular.copy(selectedRow);
	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit() {
		function success(res) {
			var msg = res.data.message;
			swal('Update', msg, 'success');
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.data.message;
			swal('Error', msg, 'error');
			$uibModalInstance.dismiss(res);
		}

		let request = {
			closedReason: vm.oBooking.closedReason,
			status: vm.oBooking.status,
			_id: vm.oBooking._id,
		};
		bookingServices.quotationRmkUpdate(request, success, failure);
	}

}
