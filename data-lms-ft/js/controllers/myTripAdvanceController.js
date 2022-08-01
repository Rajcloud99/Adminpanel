materialAdmin
	.controller("myTripAdvanceController", myTripAdvanceController)
	.controller("TripAdvanceUpsertController", TripAdvanceUpsertController)
	.controller("multiTripPaymentController", multiTripPaymentController)
	.controller("tripPerfBuiltyRendorCtrl", tripPerfBuiltyRendorCtrl)
	.controller("multiVendRendorCtrl", multiVendRendorCtrl);

myTripAdvanceController.$inject = [
	'$scope',
	'$modal',
	'$uibModal',
	'$state',
	'branchService',
	'customer',
	'cityStateService',
	'DatePicker',
	'Driver',
	'lazyLoadFactory',
	'objToCsv',
	'Routes',
	'Vehicle',
	'Vendor',
	'tripServices',
	'stateDataRetain',
	'Pagination',
	'URL',
	'dmsService'
];
TripAdvanceUpsertController.$inject = [
	'$modal',
	'$rootScope',
	'$scope',
	'$state',
	'$stateParams',
	'$uibModal',
	'accountingService',
	'DatePicker',
	'Driver',
	'FleetService',
	'otherUtils',
	'tripServices',
	'growlService',
	'Vehicle',
	'Vendor',
	'vendorFuelService',
	'URL'
];
multiTripPaymentController.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'accountingService',
	'branchService',
	'billBookService',
	'DatePicker',
	'narrationService',
	'tripServices',
	'growlService',
	'Vendor',
];
withoutTripBuiltyRendorCtrl.$inject = [
	$rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService
];

function vendorDealPopUpController(
	$scope,
	$uibModalInstance,
	accountingService,
	billBookService,
	branchService,
	billsService,
	bookingServices,
	callback,
	constants,
	DateUtils,
	DatePicker,
	formulaFactory,
	growlService,
	oTrip,
	sharedResource,
	tripServices,
	userService,
	Vendor) {

	let vm = this;

	vm.applyTDSOnExtraCharges = applyTDSOnExtraCharges;
	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.formulaCommonCalFun = formulaCommonCalFun;
	vm.autoMunsiyanaCal = autoMunsiyanaCal;
	vm.getBranch = getBranch;
	vm.getAllUsers = getAllUsers;
	vm.getVendorName = getVendorName;
	vm.onSelect = onSelect;
	vm.onTDSSelect = onTDSSelect;
	vm.getVendor = getVendor;
	vm.getTDSRate = getTDSRate;
	vm.onVendorSelect = onVendorSelect;
	vm.changePayType = changePayType;
	vm.changeAmount = changeAmount;
	vm.changeTotal = changeTotal;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.resetAll = resetAll;
	vm.changeAdvance = changeAdvance;
	vm.changeAcPayment = changeAcPayment;
	vm.getBillBookNo = getBillBookNo;
	vm.updateSelection = updateSelection;
	vm.hireSlipOnSelect = hireSlipOnSelect;
	vm.validateObj = validateObj;
	vm.remove = remove;
	vm.getAccount = getAccount;
	vm.ChargesConfig = ChargesConfig;
	vm.deductionConfig = deductionConfig;
	vm.getAc = getAc;
	vm.getQuot = getQuot;
	vm.updated_status = {};
	vm.aType = ['Liter', 'Amount'];
	vm.isDisable = false;
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
	//init
	(function init() {
		vm.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};
		vm.dealAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		vm.vendorDealPayment = $scope.$configs.vendorDeal;
		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
		}
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.percentage) {
			vm.aWeightTypes.push('Percentage');
		}

		vm.aTripData = angular.copy(oTrip);
		sharedResource.shareThisResourceWith(vm);
		if (vm.aTripData.vendor)
			vm.aTripData.vendor = vm.aTripData.vendor;
		vm.panNumber = vm.aTripData.vendor && vm.aTripData.vendor.pan_no;
		vm.dealdate = vm.aTripData.vendor && vm.aTripData.vendorDeal.deal_at;

		vm.aDeduction = [];
		vm.aExtraCharges = [];
		vm.aCharges = [];
		vm.aDeductionCharges = [];
		vm.aTripData.vendorDeal = vm.aTripData.vendorDeal || {};
		vm.aTripData.vendorDeal.charges = vm.aTripData.vendorDeal.charges || {};
		vm.aTripData.vendorDeal.deduction = vm.aTripData.vendorDeal.deduction || {};
		if (vm.aTripData.vendorDeal.lsStationaryId)
			vm.selectedStationary = {
				_id: vm.aTripData.vendorDeal.lsStationaryId,
				bookNo: vm.aTripData.vendorDeal.loading_slip
			};

		if (vm.aTripData.vendorDeal.broker && vm.aTripData.vendorDeal.broker.id)
			vm.aTripData.vendorDeal.broker._id = vm.aTripData.vendorDeal.broker.id;

		if (vm.aTripData.vendorDeal.lorryAc && vm.aTripData.vendorDeal.lorryAc.id)
			vm.aTripData.vendorDeal.lorryAc._id = vm.aTripData.vendorDeal.lorryAc.id;

		vm.isAcknowledge = vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.acknowledge && vm.aTripData.vendorDeal.acknowledge.status;

		if(!vm.isAcknowledge)
	    	getQuot();

		if (vm.aTripData.vendor)
			onVendorSelect(vm.aTripData.vendor);
		// if (vm.aTripData.vendorDeal.lorryAc)
		// 	Object.assign(vm.lorryAc, {
		// 		_id: vm.aTripData.vendorDeal.lorryAc.id,
		// 		name: vm.aTripData.vendorDeal.lorryAc.name
		// 	});

		vm.oDeduction = {};
		// vm.oDeduction.from = {};
		vm.oExtraCharges = {};
		// vm.oExtraCharges.to = {};
		// vm.aTripData.branch = vm.aTripData.branch || {};
		vm.aTripData.vendorDeal.tdsPercent = vm.aTripData.vendorDeal.tdsPercent;
		// vm.aToGroup = vm.$constants.aCharges.find(o => o.name === 'Detention Charges').a2;
		// vm.aFromGroup = vm.$constants.aDeductionCharges.find(o => o.name === 'TDS').a1;

		// getBranch();
		// getAllUsers();
		vm.oExtraCharges.date = new Date();
		vm.oDeduction.date = new Date();

		if (!vm.aTripData.vendorDeal.totWithMunshiyana)
			formulaCommonCalFun();

		$scope.$watchGroup(['ackDealVm.aTripData.vendorDeal.munshiyana', 'ackDealVm.aTripData.vendorDeal.total_expense', 'ackDealVm.aTripData.vendorDeal.otherExp'], function (...aMod) {
			// console.log(aMod);
			vm.aTripData.vendorDeal.total_expense = Math.round(vm.aTripData.vendorDeal.total_expense);
			formulaCommonCalFun();
		});

	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}



	function getQuot(){
		if(vm.aTripData && vm.aTripData.gr && vm.aTripData.gr.length) {
			let bookingId =  vm.aTripData.gr[0].booking;

			bookingServices.getVendorQuotation({
				booking: bookingId}, onSuccess, err => {
				console.log(err);
			});

			// Handle success response
			function onSuccess(response) {
				if (response && response.data && response.data.data) {
					vm.finalQuotData = response.data.data.find(obj=> obj.finalised.status === true);

				}
				if(vm.finalQuotData){

					vm.aTripData.vendorDeal.deal_at = new Date(vm.finalQuotData.date),
						vm.aTripData.vendorDeal.payment_type = vm.finalQuotData.payment_type,
						vm.aTripData.vendorDeal.weight_type= vm.finalQuotData.weight_type,
						vm.aTripData.vendorDeal.munshiyana= vm.finalQuotData.munshiyana,
						vm.aTripData.vendorDeal.advance= vm.finalQuotData.advance,
						vm.aTripData.vendorDeal.total_expense= vm.finalQuotData.rate,
						vm.aTripData.vendorDeal.totWithMunshiyana= vm.finalQuotData.total,
						vm.aTripData.vendorDeal.pmtWeight= vm.finalQuotData.pmtWeight,
						vm.aTripData.vendorDeal.pmtRate= vm.finalQuotData.pmtRate,
						vm.aTripData.vendorDeal.otherExp= vm.finalQuotData.otherExp,
						vm.aTripData.vendorDeal.perUnitPrice= vm.finalQuotData.perUnitPrice,
						vm.aTripData.vendorDeal.totalUnits= vm.finalQuotData.totalUnits
					formulaCommonCalFun();
				}
			}
		}
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

	//.callCommCal
	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.aTripData.vendorDeal.munshiyana,
			'total_expense': vm.aTripData.vendorDeal.total_expense,
			'otherExp': vm.aTripData.vendorDeal.otherExp
		});
		vm.aTripData.vendorDeal.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
	}

	function ChargesConfig(type) {
		for (let key in vm.dealAcc.vDeal) {
			if (vm.dealAcc.vDeal.hasOwnProperty(key)) {
				if (key === type.value) {
					vm.oExtraCharges.to = {
						_id: vm.dealAcc.vDeal[key]._id,
						name: vm.dealAcc.vDeal[key].name
					};
				}
			}
		}
	}

	vm.onBranchSelect = function () {
		vm.aTripData.vendorDeal.loading_slip = undefined;
	};

	function deductionConfig(type) {
		for (let key in vm.dealAcc.vDeal) {
			if (vm.dealAcc.vDeal.hasOwnProperty(key)) {
				if (key === type.value) {
					vm.oDeduction.from = {
						_id: vm.dealAcc.vDeal[key]._id,
						name: vm.dealAcc.vDeal[key].name
					};
				}
			}
		}
	}

	function getAc(viewValue, aGroup) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 20,
					group: aGroup,
					cClientId: (vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId),
				};

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}


	function getAccount(key, aGroup, name) {

		if (!aGroup)
			return;

		var oFilter = {
			all: true,
			no_of_docs: 10,
			cClientId: (vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId),
			group: aGroup
		}; // filter to send

		if (name)
			oFilter.name = name;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
		}

		// Handle success response
		function onSuccess(response) {
			vm[key] = response.data.data;

			let accType = key == 'aToAccount' ? 'to' : key == 'aFromAccount' ? 'from' : 'lorryAc';
			if (key == 'aToAccount') {
				let id = vm.oExtraCharges && vm.oExtraCharges[accType] && vm.oExtraCharges[accType]._id || false;
				if (id && !(vm[key].find(o => id === o._id)))
					vm[key].push(vm.oExtraCharges[accType]);
			} else if (key == 'aFromAccount') {
				let id = vm.oDeduction && vm.oDeduction[accType] && vm.oDeduction[accType]._id || false;
				if (id && !(vm[key].find(o => id === o._id)))
					vm[key].push(vm.oDeduction[accType]);
			} else {
				let id = vm.aTripData && vm.aTripData.vendorDeal[accType] && vm.aTripData.vendorDeal[accType]._id || false;
				if (id && !(vm[key].find(o => id === o._id)))
					vm[key].push(vm.aTripData.vendorDeal[accType]);
			}

		}
	}

	function updateSelection(position, entities) {
		vm.aTripData.vendorDeal.bankingDetail = vm.aTripData.vendor.banking_details[position];
		angular.forEach(entities, function (bank, index) {
			if (position != index)
				bank.checked = false;
		});
	}

	function hireSlipOnSelect($item, $model) {
		vm.selectedStationary = $item;
	}

	function getBillBookNo(viewValue) {

		if (viewValue !== 'centrailized' && !vm.aTripData.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}

		if (viewValue !== 'centrailized' && !vm.aTripData.branch.lsBook) {
			swal('Error', `No Hire Slip Book Linked to ${vm.aTripData.branch.name} branch`, 'error');
			return [];
		}

		if (!vm.aTripData.vendorDeal.deal_at) {
			swal('Error', 'Deal Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.aTripData.branch && Array.isArray(vm.aTripData.branch.lsBook) && vm.aTripData.branch.lsBook.map(o => o.ref),
				type: 'Hire Slip',
				useDate: moment(vm.aTripData.vendorDeal.deal_at, 'DD/MM/YYYY', true).startOf('day').toISOString(),
				status: "unused"
			};

			if (getClientId())
				requestObj.cClientId = getClientId();

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized') {
					if (response.data[0]) {
						vm.aTripData.vendorDeal.loading_slip = response.data[0].bookNo;
						vm.selectedStationary = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getClientId(){
		if ((vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId))
			return vm.aTripData.vendor && vm.aTripData.vendor.clientId || vm.aTripData.vendor_id.clientId;
	}

	function validateObj(obj, type) {

		if (!(obj.type && obj.amount && obj.from && obj.to))
			return swal('Error', 'All Mandatory Fields should be filled', 'error');

		// if (type != 'deduction' && obj.type.name != 'Other Charges' && obj.type.name != 'Chalan Charges RTO') {
		// 	obj.applyTDS = true;
		// 	obj.tdsAmount = Math.round((obj.amount * vm.aTripData.vendorDeal.tdsPercent) / 100);
		// }

		if (obj.date)
			obj.date = moment(obj.date, 'DD/MM/YYYY').toISOString();

		if (type == 'deduction') {
			vm.totalDeduction = (vm.totalDeduction || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalDeduction = vm.totalDeduction;
		} else {
			vm.totalExtraCharges = (vm.totalExtraCharges || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalCharges = vm.totalExtraCharges;
			// obj.tdsAmount =  Math.ceil((obj.amount * vm.aTripData.vendorDeal.tdsPercent)/100);
			if (vm.dealAcc) {
				obj.tdsAccountObj = {
					_id: vm.dealAcc.vDealTDSAcc,
					name: vm.dealAcc.vDealTDSAccName
				};
			}
		}

		vm.aTripData.vendorDeal[type] = vm.aTripData.vendorDeal[type] || {};
		vm.aTripData.vendorDeal[type][obj.type.value] = angular.copy({
			...obj,
			typ: obj.type.name,
			fromName: obj.from.name,
			toName: obj.to.name,
			narration: obj.narration || obj.amount + ' ' + obj.type.name + ' Added'
		});
	}

	function onTDSSelect(model, oCharge) {
		oCharge.tdsAccount = model._id;
		oCharge.tdsAccountName = model.name;
	}


	function applyTDSOnExtraCharges(oCharge) {
		if (oCharge.toApplyTDS) {

			if(!oCharge.tdsPercent)
			     getExtraTDSRate(oCharge.date, oCharge);
			else
				oCharge.tdsAmount = Math.round((oCharge.amount * oCharge.tdsPercent) / 100);
		} else {
			oCharge.tdsAmount = 0;
			delete oCharge.tdsAccount;
			delete oCharge.tdsAccountName;
		}
	}

	function remove(obj, key, type) {
		if (type == 'deduction') {
			vm.totalDeduction -= obj[key].amount;
			vm.aTripData.vendorDeal.totalDeduction = vm.totalDeduction;
		} else {
			vm.totalExtraCharges -= obj[key].amount;
			vm.aTripData.vendorDeal.totalCharges = vm.totalExtraCharges;
		}
		delete vm.aTripData.vendorDeal[type][key];
	}

	function getBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				if (getClientId())
					req.cClientId = getClientId();

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

	function getAllUsers() {
		function succGetUsers(response) {
			console.log(response.data);
			if (response.data && response.data.length > 0) {
				vm.aUsers = response.data;
				for (var m = 0; m < vm.aUsers.length; m++) {
					if (vm.aTripData.trip_manager) {
						if (vm.aTripData.trip_manager === vm.aUsers[m]._id) {
							vm.aTripData.oTripManager = vm.aUsers[m];
						}
					}
				}
			}
		}

		function failGetUsers(response) {
			console.log(response);
		}

		userService.getUsers({all: true, user_type: 'Trip Manager'}, succGetUsers, failGetUsers);
	}

	function getVendorName(viewValue, elseObj = false) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
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

	function onSelect($item, $model, $label) {
		vm.aTripData.vendor = $item;
		vm.aTripData._vendor_ = $item;
	}

	function getVendor() {
		getVendorName(false, {_id: vm.aTripData._vendor_._id}).then(function (aVendor) {
			vm.aTripData.vendorDeal.tdsPercent = aVendor[0].tdsRate;

			// for(let key in vm.aTripData.vendorDeal.charges){
			// 	let value = vm.aTripData.vendorDeal.charges[key];

			// 	let isTDS = !!$scope.$constants.aCharges.find(o => o.value === key).tds; //edit

			// 	if(isTDS)
			// 		value.tdsAmount = (value.amount * vm.aTripData.vendorDeal.tdsPercent)/100;
			// }
		});
	}

	function onVendorSelect($item, $model, $label) {
		vm.aTripData.vendor = $item;
		vm.aTripData._vendor_ = $item;
		if (vm.vendorDealPayment && vm.vendorDealPayment.accountCr == 'vendor')
			if (vm.aTripData._vendor_.account)
				if (vm.aTripData._vendor_.account[0])
					vm.aTripData.vendorDeal.lorryAc = vm.aTripData._vendor_.account[0].ref;
				else
					vm.aTripData.vendorDeal.lorryAc = vm.aTripData._vendor_.account;
			else
				vm.aTripData.vendorDeal.lorryAc = null;

		vm.panNumber = $item.pan_no;
		if ($item.clientId != $scope.$clientConfigs.clientId) {
			vm.aTripData.branch = '';
			vm.aTripData.vendorDeal.loading_slip = '';
			vm.aTripData.vendorDeal.lorryAc = '';
		}
		// vm.lorryAc = {};
		// vm.aBroker = [];
		// vm.aTripData.vendorDeal.charges = {};
		// vm.aTripData.vendorDeal.deduction = {};
		// vm.aTripData.vendorDeal.toPay = 0;
		// vm.aTripData.vendorDeal.munshiyana = 0;
		// vm.aTripData.vendorDeal.advance = 0;
		// vm.aTripData.vendorDeal.total_expense = 0;

		vm.vendorAccnt = vm.aTripData.vendor.account;
		vm.tdsVerify = $item.tdsVerify;
		vm.tdsCategory = $item.tdsCategory;
		vm.tdsSources = $item.tdsSources;

		if(!vm.isAcknowledge) {
			vm.aTripData.vendorDeal.tdsPercent = 0;
			if (vm.tdsSources && vm.tdsCategory && vm.tdsVerify){
				getTDSRate();
			}
		}
		// else
		// 	vm.aTripData.vendorDeal.tdsPercent = 0

		// vm.aTripData.vendorDeal.tdsPercent = $item.tdsSources &&  $item.tdsSources.tdsRate;
		vm.aTripData.vendorDeal.deductTDS = !!($item.tdsRate && $item.tdsRate > 0);
	}

	function getTDSRate() {

		if (vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && vm.aTripData.vendorDeal.deal_at) {
			let oReq = {
				// date: moment(vm.aTripData.vendorDeal.deal_at, 'DD/MM/YYYY', true).startOf('day').toISOString(),
				date: (vm.dealdate && (vm.dealdate == vm.aTripData.vendorDeal.deal_at))?vm.aTripData.vendorDeal.deal_at: moment(vm.aTripData.vendorDeal.deal_at, 'DD/MM/YYYY', true).startOf('day').toISOString(),
				cClientId: $scope.$configs.clientOps,
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
				if (res.data && res.data.data && res.data.data.length && vm.tdsVerify) {
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
				else{
					vm.aTripData.vendorDeal.tdsPercent = 0;
				}
			}

			function onFailure(err) {

			}
		}

	}

	function getExtraTDSRate(date, charges) {
		if (vm.tdsVerify && vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && date) {
			let oReq = {
				date: date,
				cClientId: $scope.$configs.clientOps,
			};
			vm.tdsPercent = 0;
			let isGetTDS = true;
			if(vm.aTripData.vendor && vm.aTripData.vendor.exeRate && vm.aTripData.vendor.exeFrom && vm.aTripData.vendor.exeTo){
				if(new Date(date) >= new Date(vm.aTripData.vendor.exeFrom) && new Date(date) <= new Date(vm.aTripData.vendor.exeTo)) {
					vm.tdsPercent = vm.aTripData.vendor.exeRate;
					isGetTDS = false;
				}
			}

			charges.tdsAmount = Math.round((charges.amount * vm.tdsPercent) / 100);
			charges.tdsPercent = vm.tdsPercent;


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
										return vm.tdsPercent = obj.ipRate;
									else
										return vm.tdsPercent = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.panNumber)
										return vm.tdsPercent = obj.nipRate;
									else
										return vm.tdsPercent = obj.niwpRate;
								}
								default:
									return vm.tdsPercent = 0;
							}
						}
					});

					charges.tdsAmount = Math.round((charges.amount * vm.tdsPercent) / 100);
					charges.tdsPercent = vm.tdsPercent;
				}
			}

			function onFailure(err) {

			}
		}

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

	function changeAmount() {
		if (vm.aTripData.vendorDeal.diesel.quantity && vm.aTripData.vendorDeal.diesel.rate) {
			vm.aTripData.vendorDeal.diesel.amount = vm.aTripData.vendorDeal.diesel.quantity * vm.aTripData.vendorDeal.diesel.rate;
		} else {
			vm.aTripData.vendorDeal.diesel.amount = 0;
		}
	}

	function changeTotal() {
		if (vm.aTripData.vendorDeal.diesel.amount >= 0) {
			vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.diesel.amount || 0) + (vm.aTripData.vendorDeal.driver_cash || 0) + (vm.aTripData.vendorDeal.toll_tax || 0) + (vm.aTripData.vendorDeal.other_charges || 0);
		} else {
			//vm.aTripData.deal.total_expense = 0;
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

	function changeAdvance(type) {
		// vm.aTripData.vendorDeal.tdsAmount = ((vm.aTripData.vendorDeal.total_expense || 0) * (vm.aTripData.vendorDeal.tdsPercent || 0) / 100);
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

	function changeAcPayment() {
		vm.aTripData.vendorDeal.account_payment = (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.diesel ? (vm.aTripData.vendorDeal.diesel.amount || 0) : 0) - (vm.aTripData.vendorDeal.driver_cash || 0) - (vm.aTripData.vendorDeal.toll_tax || 0) - (vm.aTripData.vendorDeal.other_charges || 0);
	}

	function submit(formData) {

		if(vm.aTripData.vendor &&  vm.aTripData.vendor._id === '5c6f9e9df786f51597645e8d' || vm.aTripData.vendor._id === '5c6d2eaa3881b010c368cff6')
			return swal('Error', 'Deal not allow on selected vendor', 'error');

		if (vm.isAcknowledge) {
			if (vm.aTripData.vendorDeal.broker && !vm.aTripData.vendorDeal.broker._id)
				return swal('Error', 'Please Select Appropriate Broker', 'error');
		} else if (!(vm.aTripData.vendorDeal.broker && vm.aTripData.vendorDeal.broker._id))
			return swal('Error', 'Please Select Appropriate Broker', 'error');


		if (!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.lorryAc && vm.aTripData.vendorDeal.lorryAc._id)) {
			if (vm.vendorDealPayment && vm.vendorDealPayment.accountCr == 'vendor')
				return swal('Error', 'Acount not linked with this vendor, Please choose another one', 'error');
			else
				return swal('Error', 'Please Select Lorry Hire A/c', 'error');
		}


		if (vm.aTripData.vendorDeal) {

			if (vm.aTripData.vendorDeal.total_expense <= vm.aTripData.vendorDeal.munshiyana) {
				return swal('Error', 'Total Expense should be greater than Munshiyana', 'error');
			}

			vm.aTripData.vendorDeal.total_expense = vm.aTripData.vendorDeal.total_expense || 0;
			vm.aTripData.vendorDeal.munshiyana = vm.aTripData.vendorDeal.munshiyana || 0;
			vm.aTripData.vendorDeal.advance = vm.aTripData.vendorDeal.advance || 0;
			vm.aTripData.vendorDeal.totalCharges = vm.aTripData.vendorDeal.totalCharges || 0;
			vm.aTripData.vendorDeal.totalDeduction = vm.aTripData.vendorDeal.totalDeduction || 0;
			vm.aTripData.vendorDeal.totWithMunshiyana = vm.aTripData.vendorDeal.totWithMunshiyana || 0;
			vm.aTripData.vendorDeal.toPay = vm.aTripData.vendorDeal.toPay || 0;
			vm.aTripData.vendorDeal.tdsAmount = vm.aTripData.vendorDeal.tdsAmount || 0;
		}

		if(vm.aTripData.vendorDeal.deal_at)
			// vm.aTripData.vendorDeal.deal_at = moment(vm.aTripData.vendorDeal.deal_at, 'DD/MM/YYYY', true).startOf('day').toISOString();
			vm.aTripData.vendorDeal.deal_at = (vm.dealdate && (vm.dealdate == vm.aTripData.vendorDeal.deal_at))?vm.aTripData.vendorDeal.deal_at: moment(vm.aTripData.vendorDeal.deal_at, 'DD/MM/YYYY', true).startOf('day').toISOString();
		if (vm.totalPayable < vm.aTripData.tAdv)
			return swal('Error', 'Total payment should be greater than or equal to payment amount', 'error');

		let oSend = {
			_id: vm.aTripData._id,
			branch: vm.aTripData.branch._id,
			vendor: (vm.aTripData.vendor && vm.aTripData.vendor._id) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id._id),
			vendorDeal: angular.copy(vm.aTripData.vendorDeal),
			cClientId: (vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId)
		};

		if (vm.selectedStationary && vm.selectedStationary.bookNo === vm.aTripData.vendorDeal.loading_slip)
			oSend.vendorDeal.lsStationaryId = vm.selectedStationary._id;
		else if($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.blockManualHSNo)
			return swal('Error', 'Invalid Hire Slip selected', 'error');

		if (vm.aTripData.vendorDeal.broker && vm.aTripData.vendorDeal.broker._id)
			oSend.vendorDeal.broker.id = vm.aTripData.vendorDeal.broker._id;

		oSend.vendorDeal.lorryAc = {};
		oSend.vendorDeal.lorryAc.id = vm.aTripData.vendorDeal.lorryAc._id;
		oSend.vendorDeal.lorryAc.name = vm.aTripData.vendorDeal.lorryAc.name;

		for (let k in oSend.vendorDeal.charges) {
			if (oSend.vendorDeal.charges.hasOwnProperty(k)) {
				let val = oSend.vendorDeal.charges[k];
				if (!val.amount)
					return swal('Error', 'Charges Amount can not be zero!!!', 'error');
				val.tdsAmount = val.tdsAmount;
				val.from = val.from && val.from._id || val.from;
				val.fromName = val.from && val.from.name || val.fromName;
				val.to = val.to && val.to._id || val.to;
				val.toName = val.to && val.to.name || val.toName;
				val.tdsAccount = val.tdsAccount && val.tdsAccount._id || val.tdsAccount || val.tdsAccountObj && val.tdsAccountObj._id;
				val.tdsAccountName = val.tdsAccountName && val.tdsAccountName.name || val.tdsAccountName || val.tdsAccountObj && val.tdsAccountObj.name;
				if (val.toApplyTDS) {
					if (!val.tdsAccount)
						return swal('Error', 'TDS Account required!!!', 'error');
				}
			}
		}

		for (let k in oSend.vendorDeal.deduction) {
			if (oSend.vendorDeal.deduction.hasOwnProperty(k)) {
				let val = oSend.vendorDeal.deduction[k];
				val.from = val.from && val.from._id || val.from;
				val.fromName = val.from && val.from.name || val.fromName;
				val.to = val.to && val.to._id || val.to;
				val.toName = val.to && val.to.name || val.toName;
			}
		}
		vm.isDisable = true;
		if (typeof callback === 'function') {
			callback(oSend)
				.then(function () {
					$uibModalInstance.close();
				})
				.catch(function (err) {
					console.log(err);
				});

			return;
		}
		tripServices.vendorDealUpdate(oSend, success, failure);

		function success(res) {
			vm.isDisable = false;
			swal('', res.data.message, 'success');
			if (res.data.status === 'Success') {
				let obj = {
					...vm.aTripData
				};

				obj.vendorDeal = obj.vendorDeal || {};
				obj.vendorDeal.acknowledge = obj.vendorDeal.acknowledge || {};
				obj.vendorDeal.acknowledge.status = true;
				obj.vendorDeal.user = vm.$user.full_name;
				obj.vendorDeal.date = new Date();
				$uibModalInstance.close(obj);
			}
		}

		function failure(res) {
			vm.isDisable = false;
			swal('Error', res.data.message, 'error');
			$uibModalInstance.dismiss(res);
			// growlService.growl(msg, 'danger', 2);
		}
	}
}

function acknowledgeDealController(
	$scope,
	$uibModalInstance,
	accountingService,
	constants,
	DateUtils,
	DatePicker,
	growlService,
	oTrip,
	sharedResource,
	tripServices) {

	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.changePayType = changePayType;
	vm.changeAmount = changeAmount;
	vm.getAccount = getAccount;
	vm.changeTotal = changeTotal;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.resetAll = resetAll;
	vm.changeAdvance = changeAdvance;
	vm.changeAcPayment = changeAcPayment;
	vm.ackAccount = ackAccount;
	vm.tdsAccount = tdsAccount;
	vm.updated_status = {};
	vm.isDisable = false;
	vm.aType = ['Liter', 'Amount'];
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination

	function closeModal() {
		$uibModalInstance.dismiss();
	}


	vm.selectAccountSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		selectionLimit: 1,
		smartButtonTextConverter: function (itemText, originalItem) {
			return itemText;
		}
	};

	//init

	(function init() {
		vm.oTrip = oTrip;
		sharedResource.shareThisResourceWith(vm);

		vm.account_data = {};
		vm.account_data.from = {};
		vm.account_data.to = {};

		vm.account_data.from._id = oTrip.vendorDeal.lorryAc.id;

		let defAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];

		if (vm.oTrip.vendorDeal.acknowledge.ackToAc && vm.oTrip.vendorDeal.acknowledge.ackToAc._id)
			ackAccount(vm.oTrip.vendorDeal.acknowledge.ackToAc._id);
		else if (defAcc) {
			vm.oTrip.vendorDeal.acknowledge.ackToAc = (defAcc.vDealPurAcc && defAcc.vDealPurAccName) ? {
				_id: defAcc.vDealPurAcc,
				name: defAcc.vDealPurAccName
			} : '';
		}

		if(vm.oTrip.vendorDeal.tdsAmount && defAcc.vDealPurAccwtds && defAcc.vDealPurAccwtdsName){
			vm.oTrip.vendorDeal.acknowledge.ackToAc = {
				_id: defAcc.vDealPurAccwtds,
				name: defAcc.vDealPurAccwtdsName
			}
		}else if(defAcc.vDealPurAccwotds && defAcc.vDealPurAccwotdsName){
			vm.oTrip.vendorDeal.acknowledge.ackToAc = {
				_id: defAcc.vDealPurAccwotds,
				name: defAcc.vDealPurAccwotdsName
			}
		}

		if (vm.oTrip.vendorDeal.tdsFromAc && vm.oTrip.vendorDeal.tdsFromAc._id)
			tdsAccount(vm.oTrip.vendorDeal.tdsFromAc);
		else if (defAcc) {
			vm.oTrip.vendorDeal.tdsFromAc = (defAcc.vDealTDSAcc && defAcc.vDealTDSAccName) ? {
				_id: defAcc.vDealTDSAcc,
				name: defAcc.vDealTDSAccName
			} : '';
		}

	})();

	function getAccount(viewValue, group) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				if (group)
					req.group = group;

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function ackAccount(id) {
		if (id) {
			return new Promise(function (resolve, reject) {

				let req = {
					_id: id,
					no_of_docs: 10,
					group: "Purchase",
				};


				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
					vm.oTrip.vendorDeal.acknowledge.ackToAc = res.data.data[0];
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function tdsAccount(id) {
		if (id) {
			return new Promise(function (resolve, reject) {

				let req = {
					_id: id,
					no_of_docs: 10,
					group: "Vendor TDS",
				};


				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
					vm.oTrip.vendorDeal.tdsFromAc = res.data.data[0];
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function changePayType(pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			vm.oTrip.vendorDeal.toPay = (vm.oTrip.vendorDeal.total_expense || 0) - (vm.oTrip.vendorDeal.munshiyana || 0);
			vm.oTrip.vendorDeal.advance = 0;
			if (vm.oTrip.vendorDeal.diesel) {
				vm.oTrip.vendorDeal.diesel.quantity = 0;
				vm.oTrip.vendorDeal.diesel.rate = 0;
				vm.oTrip.vendorDeal.diesel.amount = 0;
			}
			vm.oTrip.vendorDeal.driver_cash = 0;
			vm.oTrip.vendorDeal.toll_tax = 0;
			vm.oTrip.vendorDeal.other_charges = 0;
			vm.oTrip.vendorDeal.other_charges_remark = '';
			vm.oTrip.vendorDeal.account_payment = 0;
		}
	}

	function changeAmount() {
		if (vm.oTrip.vendorDeal.diesel.quantity && vm.oTrip.vendorDeal.diesel.rate) {
			vm.oTrip.vendorDeal.diesel.amount = vm.oTrip.vendorDeal.diesel.quantity * vm.oTrip.vendorDeal.diesel.rate;
		} else {
			vm.oTrip.vendorDeal.diesel.amount = 0;
		}
	}

	function changeTotal() {
		if (vm.oTrip.vendorDeal.diesel.amount >= 0) {
			vm.oTrip.vendorDeal.total_expense = (vm.oTrip.vendorDeal.diesel.amount || 0) + (vm.oTrip.vendorDeal.driver_cash || 0) + (vm.oTrip.vendorDeal.toll_tax || 0) + (vm.oTrip.vendorDeal.other_charges || 0);
		} else {
			//vm.oTrip.deal.total_expense = 0;
		}
	}

	function calculateTotalPMT() {
		vm.oTrip.vendorDeal.total_expense = (vm.oTrip.vendorDeal.pmtWeight || 0) * (vm.oTrip.vendorDeal.pmtRate || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function calculateTotalPUnit() {
		vm.oTrip.vendorDeal.total_expense = (vm.oTrip.vendorDeal.perUnitPrice || 0) * (vm.oTrip.vendorDeal.totalUnits || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function resetAll() {
		vm.oTrip.vendorDeal.total_expense = undefined;
		vm.oTrip.vendorDeal.munshiyana = undefined;
		vm.oTrip.vendorDeal.advance = undefined;
		vm.oTrip.vendorDeal.toPay = undefined;
		vm.oTrip.vendorDeal.pmtWeight = undefined;
		vm.oTrip.vendorDeal.pmtRate = undefined;
		vm.oTrip.vendorDeal.perUnitPrice = undefined;
		vm.oTrip.vendorDeal.totalUnits = undefined;
	}

	function changeAdvance(type) {
		var tot_exp = angular.copy(vm.oTrip.vendorDeal.total_expense);
		var joint_exp = (vm.oTrip.vendorDeal.toPay || 0) + (vm.oTrip.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			if (vm.oTrip.vendorDeal.munshiyana > vm.oTrip.vendorDeal.total_expense) {
				vm.oTrip.vendorDeal.munshiyana = vm.oTrip.vendorDeal.total_expense;
			}
			if (vm.oTrip.vendorDeal.toPay >= vm.oTrip.vendorDeal.munshiyana) {
				vm.oTrip.vendorDeal.toPay = vm.oTrip.vendorDeal.toPay - vm.oTrip.vendorDeal.munshiyana;
				changeAdvance('topay');
			} else if (vm.oTrip.vendorDeal.advance >= vm.oTrip.vendorDeal.munshiyana) {
				vm.oTrip.vendorDeal.advance = vm.oTrip.vendorDeal.advance - vm.oTrip.vendorDeal.munshiyana;
				changeAdvance('advance');
			}
		}
		if (type === 'advance') {
			vm.oTrip.vendorDeal.toPay = ((vm.oTrip.vendorDeal.total_expense || 0) - (vm.oTrip.vendorDeal.munshiyana || 0)) - (vm.oTrip.vendorDeal.advance || 0);
		}
		if (type === 'topay') {
			vm.oTrip.vendorDeal.advance = ((vm.oTrip.vendorDeal.total_expense || 0) - (vm.oTrip.vendorDeal.munshiyana || 0)) - (vm.oTrip.vendorDeal.toPay || 0);
		}
		if (vm.oTrip.vendorDeal.payment_type === 'To pay' || vm.oTrip.vendorDeal.payment_type === 'To be billed') {
			vm.oTrip.vendorDeal.toPay = (vm.oTrip.vendorDeal.total_expense || 0) - (vm.oTrip.vendorDeal.munshiyana || 0);
			vm.oTrip.vendorDeal.advance = 0;
		}
	}

	function changeAcPayment() {
		vm.oTrip.vendorDeal.account_payment = (vm.oTrip.vendorDeal.advance || 0) - (vm.oTrip.vendorDeal.diesel ? (vm.oTrip.vendorDeal.diesel.amount || 0) : 0) - (vm.oTrip.vendorDeal.driver_cash || 0) - (vm.oTrip.vendorDeal.toll_tax || 0) - (vm.oTrip.vendorDeal.other_charges || 0);
	}

	function submit(formData) {

		console.log(formData);

		var total_deduction;
		if (vm.oTrip.vendorDeal.deductTDS) {
			total_deduction = oTrip.vendorDeal.tdsRate * (oTrip.vendorDeal.total_expense - oTrip.vendorDeal.munshiyana) / 100}
		if (vm.account_data && !(vm.account_data.from._id && vm.oTrip.vendorDeal.acknowledge.ackToAc._id)) {
			swal('Error', 'All Mandatory Fields should be filled', 'error');
			return;
		}




		const oRequest = {};

		oRequest._id = oTrip._id;
		oRequest.account_data = {};
		oRequest.tdsAccountData = {};
		oRequest.account_data.from = vm.account_data.from._id;
		oRequest.account_data.fromName = oTrip.vendorDeal.lorryAc.name;
		oRequest.account_data.to = vm.oTrip.vendorDeal.acknowledge.ackToAc._id;
		oRequest.account_data.toName = vm.oTrip.vendorDeal.acknowledge.ackToAc.name;
		oRequest.tdsAccountData.from = vm.oTrip.vendorDeal.tdsFromAc._id;
		oRequest.tdsAccountData.fromName = vm.oTrip.vendorDeal.tdsFromAc.name;
		oRequest.tdsAccountData.to = vm.account_data.from._id;
		oRequest.tdsAccountData.toName = oTrip.vendorDeal.lorryAc.name;
		oRequest.remainingAmount = vm.oTrip.vendorDeal.remainingAmount;
		oRequest.vendorDeal = {
			...oTrip.vendorDeal,
			tds_deduction: total_deduction,
		};

		vm.isDisable = true;
		tripServices.acknowledgeDeal(oRequest, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.data.message, 'error');
			vm.isDisable = false;
		}

		function successCallback(response) {
			swal('', response.data.message, 'success');
			vm.isDisable = false;
			if (response.data.status === 'OK') {
				let obj = {
					...oTrip
				};

				obj.vendorDeal = obj.vendorDeal || {};
				obj.vendorDeal.acknowledge = obj.vendorDeal.acknowledge || {};
				obj.vendorDeal.acknowledge.status = true;
				obj.vendorDeal.user = vm.$user.full_name;
				obj.vendorDeal.date = new Date();
				$uibModalInstance.close(obj);
			}
		}

		// }else{
		// 	console.log(formData.required);
		// 	swal('','All Mandatory Field are not Filled','error');
		// }
	}
}

	function myTripAdvanceController(
	$scope,
	$modal,
	$uibModal,
	$state,
	branchService,
	customer,
	cityStateService,
	DatePicker,
	Driver,
	lazyLoadFactory,
	objToCsv,
	Routes,
	Vehicle,
	Vendor,
	tripServices,
	stateDataRetain,
	Pagination,
	URL,
	dmsService
) {

	let vm = this;

	vm.oFilter = {};
	vm.approvedPaymentFilter = {};
	vm.aTripAdvance = [];
	vm.pagination = angular.copy(Pagination); // initialize pagination
	vm.pagination.currentPage = 1;
	vm.pagination.maxSize = 3;
	vm.pagination.itemsPerPage = 15;
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.lazyLoad = lazyLoadFactory(); // init lazyload
	vm.printBuilty = printBuilty;

	vm.columnSetting = {
		allowedColumn: [
			'Trip Start',
			'Trip End',
			'Trip No',
			'Category',
			'Gr No',
			'Consignor',
			'Vehicle No',
			'Vehicle Type',
			'Customer',
			'Route',
			'Route Km',
			'Deal Total',
			'Total Advance',
			'Revenue',
			//'Revenue/KM',
			'Profit',
			//'Profit/KM',
			//'Budget',
			//'Cash Adv',
			'Vendor Deal',
			'Vendor Charges',
			'Vendor Deduction',
			'Balance',
			'tds extra',
			'TDS Percentage',
			'Adv/KM',
			//'Settled Amt',
			'Driver Name',
			'Driver No.',
			'Vendor Name',
			'Pan Card No.',
			'Trip Status',
			'Ownership',
			'hire slip',
			'Branch',
			'Vendor Company',
			'Last Update Time',
			'Vendor Advance Paid',
			'Pay by Cheque',
			'Pay by Broker',
			'Pay by Diesel',
			'Pay by Cash',
			'Remaining Amount',
			'Trip Entry'
		]
	};

	vm.tableHead = [
		{
			'header': 'Trip Entry',
			'bindingKeys': 'allocation_date',
			'date': true,
			'date': 'dd-MMM-yyyy'
		},
		{
			'header': 'Trip Start',
			'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
			'date': 'dd-MMM-yyyy'
		},
		{
			'header': 'Trip End',
			'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
			'date': 'dd-MMM-yyyy'
		},
		{
			'header': 'Trip No',
			'bindingKeys': 'trip_no'
		},
		{
			'header': 'Category',
			'bindingKeys': 'category'
		},
		{
			'header': 'Gr No',
			'filter': {
				'name': 'arrayOfGrToString',
				'aParam': [
					'gr',
				]
			}
		},
		{
			'header': 'Consignor',
			'bindingKeys': 'gr[0].consignor.name'
		},
		{
			'header': 'Vehicle No',
			'bindingKeys': 'vehicle.vehicle_reg_no',
			'date': false
		},
		{
			'header': 'Vehicle Type',
			'bindingKeys': 'vehicle.veh_type_name',
			'date': false
		},
		{
			'header': 'Customer',
			'bindingKeys': 'gr[0].customer.name'

		},
		{
			'header': 'Branch',
			'bindingKeys': 'branch.name'
		},
		{
			'header': 'Route',
			'bindingKeys': 'route_name || rName'
		},
		{
			'header': 'Route Km',
			'bindingKeys': 'rKm || totalKm'
		},
		/*{
			'header': 'Budget',
			'bindingKeys': "(netBudget.toFixed(2) || vendorDeal.total_expense || 0)"
		},*/
		{
			'header': 'Vendor Deal',
			'bindingKeys': '(vendorDeal && vendorDeal.totWithMunshiyana || 0)'
		},
		{
			'header': 'Vendor Charges',
			'bindingKeys': '(vendorDeal && vendorDeal.totalCharges.toFixed(2) || 0)'
		},
		{
			'header': 'Vendor Deduction',
			'bindingKeys': '(vendorDeal && vendorDeal.totalDeduction.toFixed(2) || 0)'
		},
		{
			'header': 'Deal Total',
			'bindingKeys': '(vendorDeal && vendorDeal.totalDeal.toFixed(2) || 0)'
		},
		{
			'header': 'Cash Adv',
			'bindingKeys': '(totalCash.toFixed(2) || 0)'
		},
		{
			'header': 'Total Advance',
			'bindingKeys': '(tAdv.toFixed(2)||0)'
		},
		{
			'header': 'Balance',
			'bindingKeys': '(this.vendorDeal && this.vendorDeal.totalDeal || 0) - (this.tAdv || 0)',
			'eval': true
		},
		{
			'header': 'tds extra',
			'bindingKeys': '(this.vendorDeal && this.vendorDeal.charges|sumObjKey:"tdsAmount")',
			'eval': true
		},
		{
			'header': 'TDS Percentage',
			'bindingKeys': '(this.vendorDeal.tdsPercent=== 0? "0": this.vendorDeal.tdsPercent)',
			'eval':true

		},
		{
			'header': 'Adv/KM',
			'bindingKeys': 'advPKM'
		},
		{
			'header': 'Revenue',
			'bindingKeys': 'totRev.toFixed(2) || 0'
		},
		// {
		// 	'header': 'Revenue/KM',
		// 	'bindingKeys': 'internal_freightPKM || actaul_freightPKM'
		// },
		{ //charan
			'header': 'Profit',
			'bindingKeys': '(intial_profit.toFixed(2) || freight_profit.toFixed(2) || 0)'
		},
		// {
		// 	'header': 'Profit',
		// 	'bindingKeys': '(totRev.toFixed(2) || 0) - (vendorDeal && vendorDeal.totalDeal.toFixed(2) || 0)'
		// },
		// {
		// 	'header': 'Profit/KM',
		// 	'bindingKeys': 'profitPKM || frProfitPKM'
		// },
		/*{
			'header': 'Settled Amt',
			'bindingKeys': '(actual_expense.toFixed(2) || 0)'
		},*/
		{
			'header': 'Driver Name',
			'bindingKeys': 'driver.nameCode || driver.name'
		},
		{
			'header': 'Driver No.',
			'bindingKeys': 'driver.prim_contact_no'
		},
		{
			'header': 'Vendor Name',
			'bindingKeys': 'vendor.name'
		},
		{
			'header': 'Pan Card No.',
			'bindingKeys': 'vendor.pan_no'
		},
		{
			'header': 'Trip Status',
			'bindingKeys': 'status'
		},
		{
			'header': 'Ownership',
			'bindingKeys': 'ownershipType'
		},
		{
			'header': 'hire slip',
			'bindingKeys': 'vendorDeal.loading_slip',
			'date': false
		},
		{
			'header': 'Vendor Company',
			'bindingKeys': '(($user.client_allowed|filter:{"clientId":this.vendor.clientId})[0].name)',
			'eval': true
		},
		{
			'header': 'Last Update Time',
			'bindingKeys': 'last_modified_at'
		},
		{
			'header': 'Vendor Advance Paid',
			'bindingKeys': 'vendorAdvancePaid'
		},
		{
			'header': 'Pay by Cheque',
			'bindingKeys': 'payByCheque'
		},
		{
			'header': 'Pay by Broker',
			'bindingKeys': 'payByBroker'
		},
		{
			'header': 'Pay by Diesel',
			'bindingKeys': 'payByDiesel'
		},
		{
			'header': 'Pay by Cash',
			'bindingKeys': 'payByCash'
		},
		// {
		// 	'header': 'Remaining Amount',
		// 	'bindingKeys': 'remainingAmt'
		// }
		{
			'header': 'Remaining Amount',
			'bindingKeys': '(((this.vendorDeal.totWithMunshiyana || 0) + (this.vendorDeal.totalCharges || 0) - (this.vendorDeal.totalDeduction || 0) - (this.vendorDeal.tdsAmount || 0) - (extraTdsAmt || 0)) - this.tAdv || 0)'
		}
	];


	//function identifier
	vm.add = add;
	vm.getCustomer = getCustomer;
	vm.dateChange = dateChange;
	vm.downloadCacheCSV = downloadCacheCSV;
	vm.getTrips = getTrips;
	vm.downloadVehicleProfitCSV = downloadVehicleProfitCSV;
	vm.getRoute = getRoute;
	vm.getTripsRecoRep = getTripsRecoRep;
	vm.upload = uploadHandler;
	vm.getGr = getGr;
	vm.getVname = getVname;
	vm.setRouteKm = setRouteKm;
	vm.getDname = getDname;
	vm.getVendorName = getVendorName;
	vm.getDriver = getDriver;
	vm.getAllBranch = getAllBranch;
	vm.onBranchSelect = onBranchSelect;
	vm.removeBranch = removeBranch;
	vm.onSelect = onSelect;
	vm.downloadCsv = downloadCsv;
	vm.multiTripPayment = multiTripPayment;
	vm.editGrNumber = editGrNumber;
	vm.uploadDocs = uploadDocs;
	vm.previewDocs = previewDocs;
	vm.toggleApprovedPaymentReportUI = toggleApprovedPaymentReportUI;
	// this function trigger on state refresh
	$scope.onStateRefresh = function () {
		getTrips();
	};


	//init
	(function init() {

		vm.selectType = 'index';
		vm.aSelectedTrips = [];
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		vm.aAdvanceType = [
			{name: "Happay", value: 'H'},
			{name: "Fastag", value: 'F'},
			{name: "Driver Cash", value: 'DC'},
			{name: "Diesel", value: 'D'}
		];

		if (stateDataRetain.init($scope, vm))
			return;

		// vm.start_date = new Date();
		// vm.end_date = new Date();
		// dateChange();
		// getTrips(true);
		vm.maxEndDate = new Date();
		getAllVendorsList();
		vm.start = {};
		vm.end = {};
	})();

	//Actual Function
	vm.aStatusChange = ['Trip not started', 'Trip started', 'Trip ended'];
	vm.aAdvance = ["Advance Done", "Not Done", "All"];
	vm.aApproved = ["Deal Approved", "Not Approved", "All"];
	vm.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
	if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
		Array.prototype.push.apply(vm.aCategory, $scope.$configs.customer.category);
	}

	function toggleApprovedPaymentReportUI(filters, downloadType) {

		// if(!(vm.approvedPaymentFilter.startDate && vm.approvedPaymentFilter.endDate)){
		// 	swal('Warning','Start_Date & End_Date should be filled','warning');
		// 	return;
		// }

		tripServices.getApprovedPaymentReport({...filters, downloadType}, function (data) {
			var $a = document.createElement('a');
			$a.setAttribute("type", "hidden");
			$a.setAttribute('href', data.data.data);
			$a.setAttribute('target', '_blank');
			document.body.appendChild($a);
			$a.click();
			document.body.removeChild($a);
		}, function (err) {
			console.error(err);
		});
	}

	function getRoute (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	}

	function setRouteKm() {
		if ($scope.vm.oFilter.source && $scope.vm.oFilter.destination && $scope.vm.oFilter.source.location && $scope.vm.oFilter.destination.location) {
			if (google && google.maps && google.maps.DistanceMatrixService) {
				new google.maps.DistanceMatrixService()
					.getDistanceMatrix(
						{
							origins: [$scope.vm.oFilter.source.location],
							destinations: [$scope.vm.oFilter.destination.location],
							travelMode: 'DRIVING',
						}, (response) => {
							console.log(response)
							if(response && Array.isArray(response.rows) && response.rows[0]){
								let element = response.rows[0].elements;
								$scope.vm.oFilter.rKm = Math.round2(element[0].distance.value / 1000, 2);
								$scope.$apply();
							}
						});
			}
		}

	}

	function getAllVendorsList() {
		function fuelSucc(res) {
			if (res.data.data) {
				vm.vendor = res.data.data;
			}
		}

		Vendor.getTransportVendor({deleted: false}, fuelSucc);
	}

	function uploadHandler(files, file, newFiles, duplicateFiles, invalidFiles, event) {

		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('advancesExcel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			tripServices.uploadTripAdvances({}, data)
				.then(function (d) {
					if (d.stats && d.stats.length > 0) {
						const header = ['ADVANCE DATE', 'ADVANCE TYPE', 'REFERENCE NO', 'VEHICLE NO', 'STATUS', 'REJECTION REASON'];
						const body = d.stats.map(o => header.map(s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));
						objToCsv('AdvancesLog', header, body);
					}
					swal({
						title: 'Info',
						text: d.message,
						type: "info"
					});
					$uibModalInstance.close();
				}).catch(function (err) {
				swal(err.data.message, err.data.error, 'error');
			});
		}
	}

	function getGr(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1
				};
				tripServices.getAllGRItem(req, res => {
					resolve(res.data.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function downloadCacheCSV() {
		let oFilter = prepareFilterObject();

		if (!(vm.start_date && vm.end_date)) {
			swal('Warning', 'AllocationDate From and To should be filled', 'warning');
			return;
		}

		let allowedTime = ['1', 'year'];

		if(moment(vm.end_date).isAfter(moment(vm.start_date).add(...allowedTime)))
			return swal('Error', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

		delete oFilter.skip;
		delete oFilter.no_of_docs;
		oFilter.all = true;
		oFilter.reportType = 'TripPerformance';

			tripServices.getUnSettlementCSV(oFilter, success);

		function success(d) {
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


	function getTripsRecoRep(download) {

		let request = prepareFilterObject(download);
		if (download === 'onTripRecoReport') {
			if (!(vm.start_date && vm.end_date)) {
				swal('Warning', 'AllocationDate From and To should be filled', 'warning');
				return;
			}
			tripServices.getTripRecoReportsNew(request, function (d) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			});
		}
	}

	function getTrips(isGetActive, download, isCSV) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let request = prepareFilterObject(download);
		if (download === 'onTripAdvance') {
			if (!(vm.start_date && vm.end_date)) {
				swal('Warning', 'AllocationDate From and To should be filled', 'warning');
				return;
			}
			let allowedTime = ['3', 'month'];
			if(isCSV) {
				request.downloadCSV = true;
				allowedTime[0] = '6';
			}


			if(moment(vm.end_date).isAfter(moment(vm.start_date).add(...allowedTime)))
				return swal('Error', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

			tripServices.getTripReportsNew(request, function (d) {
				if(d.data.url) {
					var a = document.createElement('a');
					a.href = d.data.url;
					a.download = d.data.url;
					a.target = '_blank';
					a.click();
				}else{
					swal('', d.data.message, 'success');
				}
			});
		} else {
			tripServices.getAllTripsWithPagination(request, success, failure)

			function success(res) {

				if (download) {
					var a = document.createElement('a');
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = '_blank';
					a.click();
					return;
				}

				res = res.data.data;
				for (let i = 0; i < res.data.length; i++) {
					res.data[i].totRev = 0;
					for (let j = 0; j < res.data[i].gr.length; j++) {
						res.data[i].totRev = res.data[i].totRev + (res.data[i].gr[j].totalFreight || 0);
					}
				}

				let sVendor = vm.oFilter.vendor || vm.oFilter.broker;
				if (!!(sVendor && sVendor._id) && $scope.selectedClient === sVendor.clientId)
					vm.selectType = 'multiple';
				else
					vm.selectType = 'index';

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);

				vm.aSelectedTrips = res.data[0];

			}

			function failure(res) {
				swal("Failed!", res.data.data.data, "error");
			}
		}
	}

	function downloadVehicleProfitCSV(isGetActive, download) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let request = prepareFilterObject(download);

		if (download === 'onTripAdvance') {
			if (!(vm.start_date && vm.end_date)) {
				swal('Warning', 'AllocationDate From and To should be filled', 'warning');
				return;
			}

			if(request.ownershipType === 'Market'){
				request.tripHireMarketCSV = true;
				request.downloadCSV = false;
			}else{
				request.tripHireOwnCSV = true;
				request.downloadCSV = false;
			}
			let allowedTime = ['1', 'month'];

			if(moment(vm.end_date).isAfter(moment(vm.start_date).add(...allowedTime)))
				return swal('Error', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

			tripServices.getTripReportsNew(request, function (d) {
				if(d.data.url) {
					var a = document.createElement('a');
					a.href = d.data.url;
					a.download = d.data.url;
					a.target = '_blank';
					a.click();
				}else{
					swal('', d.data.message, 'success');
				}
			});
		} else {
			tripServices.getAllTripsWithPagination(request, success, failure)

			function success(res) {

				if (download) {
					var a = document.createElement('a');
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = '_blank';
					a.click();
					return;
				}

				res = res.data.data;
				for (let i = 0; i < res.data.length; i++) {
					res.data[i].totRev = 0;
					for (let j = 0; j < res.data[i].gr.length; j++) {
						res.data[i].totRev = res.data[i].totRev + (res.data[i].gr[j].totalFreight || 0);
					}
				}

				let sVendor = vm.oFilter.vendor || vm.oFilter.broker;
				if (!!(sVendor && sVendor._id) && $scope.selectedClient === sVendor.clientId)
					vm.selectType = 'multiple';
				else
					vm.selectType = 'index';

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);

				vm.aSelectedTrips = res.data[0];

			}

			function failure(res) {
				swal("Failed!", res.data.data.data, "error");
			}
		}
	}

	// function dateChange(dateType) {
	// 	if (dateType === 'startDate' && vm.start_date) {
	// 		vm.start_date = new Date(vm.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	// 		var month = new Date(vm.start_date).setMonth(vm.start_date.getMonth() + 3); // select month based on selected start date
	// 		vm.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	// 	} else if (dateType === 'endDate' && vm.end_date) {
	// 		vm.end_date = new Date(vm.end_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	// 		var month = new Date(vm.end_date).setMonth(vm.end_date.getMonth() - 3); // select month based on selected start date
	// 		vm.start_date = new Date(new Date(month).setHours(23, 59, 59));
	//
	// 	}
	// }

	// function dateChange(dateType) {
	//
	// 	if (dateType === 'startDate' && vm.end_date && vm.start_date) {
	//
	// 		let isDate = vm.end_date instanceof Date,
	// 			monthRange = vm.end_date.getMonth() - vm.start_date.getMonth(),
	// 			dateRange = vm.end_date.getDate() - vm.start_date.getDate(),
	// 			isNotValid = false;
	// 		monthRange += (vm.end_date.getFullYear() - vm.start_date.getFullYear()) * 12;
	//
	// 		if (monthRange === 0)
	// 			isNotValid = dateRange < 0;
	// 		else if (monthRange === 1 && !vm.oFilter.vehicle_id && !vm.oFilter.vendor)
	// 			isNotValid = monthRange < 0 ? true : (30 - vm.start_date.getDate() + vm.end_date.getDate() > 30 ? true : false);
	// 		else if (monthRange <= 3 && !vm.oFilter.vehicle_id && !vm.oFilter.vendor)
	// 			isNotValid = true;
	// 		else if (monthRange === 3 && (vm.start_date.getDate() < vm.end_date.getDate()))
	// 			isNotValid = true;
	// 		else if (monthRange === 1 || monthRange === 2 || monthRange === 3)
	// 			isNotValid = false;
	// 		else
	// 			isNotValid = true;
	//
	// 		if (isDate && isNotValid && (vm.oFilter.vehicle_id || vm.oFilter.vendor)) {
	// 			let date = new Date(vm.start_date);
	// 			vm.end_date = new Date(date.setMonth(date.getMonth() + 3));
	// 		} else if (isDate && isNotValid) {
	// 			let date = new Date(vm.start_date);
	// 			vm.end_date = new Date(date.setMonth(date.getMonth() + 1));
	// 		}
	//
	// 	} else if (dateType === 'endDate' && vm.end_date && vm.start_date) {
	//
	// 		let isDate = vm.start_date instanceof Date,
	// 			monthRange = vm.end_date.getMonth() - vm.start_date.getMonth(),
	// 			dateRange = vm.end_date.getDate() - vm.start_date.getDate(),
	// 			isNotValid = false;
	// 		monthRange += (vm.end_date.getFullYear() - vm.start_date.getFullYear()) * 12;
	//
	// 		if (monthRange === 0)
	// 			isNotValid = dateRange < 0;
	// 		else if (monthRange === 1 && !vm.oFilter.vehicle_id && !vm.oFilter.vendor)
	// 			isNotValid = monthRange < 0 ? true : (30 - vm.start_date.getDate() + vm.end_date.getDate() > 30 ? true : false);
	// 		else if (monthRange <= 3 && !vm.oFilter.vehicle_id && !vm.oFilter.vendor)
	// 			isNotValid = true;
	// 		else if (monthRange === 3 && (vm.start_date.getDate() < vm.end_date.getDate()))
	// 			isNotValid = true;
	// 		else if (monthRange === 1 || monthRange === 2 || monthRange === 3)
	// 			isNotValid = false;
	// 		else
	// 			isNotValid = true;
	//
	// 		if (isDate && isNotValid && (vm.oFilter.vehicle_id || vm.oFilter.vendor)) {
	// 			let date = new Date(vm.end_date);
	// 			vm.start_date = new Date(date.setMonth(date.getMonth() - 3));
	// 		} else if (isDate && isNotValid) {
	// 			let date = new Date(vm.end_date);
	// 			vm.start_date = new Date(date.setMonth(date.getMonth() - 1));
	// 		}
	// 	}
	// }

	function dateChange(dateType) {
		if(dateType === 'startDate' && vm.end_date){
			if(moment(vm.end_date).add(-12, 'month').isAfter(moment(vm.start_date))){
				vm.end_date = moment(vm.start_date).add(12, 'month').toDate();
			}

			if(vm.start_date > vm.end_date)
				vm.end_date = vm.start_date;
		}else if(dateType === 'endDate' && vm.start_date){
			if(moment(vm.start_date).add(-12, 'month').isAfter(moment(vm.end_date))){
				vm.start_date = moment(vm.end_date).add(12, 'month').toDate();
			}
		}
		vm.maxEndDate = Math.min(moment(vm.start_date).add(12, 'month').toDate(), new Date());
	}

	function add(oTrip) {
		$state.go('booking_manage.TripAddAdvance', {data: Array.isArray(oTrip) ? oTrip[0] : oTrip})
	}

	function multiTripPayment(aTrips, whom) {
		aTrips = Array.isArray(aTrips) && aTrips || [aTrips];
		$state.go("booking_manage.multiTripPayment", {
			data: {
				aTrips,
				whom
			}
		});
	}

	function editGrNumber(aTrips) {
		if (!aTrips.gr[0])
			return swal('Warning', 'No Gr Found on selected Trip', 'warning');
		$modal.open({
			templateUrl: 'views/myGR/editGrNumber.html',
			controller: [
				'$uibModalInstance',
				'$scope',
				'$stateParams',
				'branchService',
				'billBookService',
				'DatePicker',
				'oTrip',
				'tripServices',
				editGrNumberController
			],
			controllerAs: 'grVm',
			resolve: {
				oTrip: function () {
					return {
						aTrips
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
			getTrips();
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function printBuilty() {
		if (vm.aSelectedTrips && vm.aSelectedTrips._id) {
			console.log(vm.aSelectedTrips);
			var oFilter = {_id: vm.aSelectedTrips._id};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: 'tripPerfBuiltyRendorCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
		;
	};

	function prepareFilterObject(download) {
		let myFilter = {};

		if (vm.oFilter.trip_no) {
			myFilter.trip_no = vm.oFilter.trip_no;
		}
		if (vm.oFilter.loading_slip) {
			myFilter['vendorDeal.loading_slip'] = vm.oFilter.loading_slip;
		}
		if (vm.oFilter.bookingCustomer && vm.oFilter.bookingCustomer.name) {
			myFilter.customer_id = vm.oFilter.bookingCustomer._id;
		}
		if (vm.oFilter.bPclientId) {
			myFilter['vendor.clientId'] = vm.oFilter.bPclientId;
		}
		if (vm.oFilter.grData) {
			myFilter._id =  vm.oFilter.grData.trip._id;
		}
		if (vm.oFilter.vehicle_id) {
			myFilter.vehicle = vm.oFilter.vehicle_id._id;
		}
		if($scope.vm.oFilter.source){
			myFilter.source = $scope.vm.oFilter.source.c;
		}
		if($scope.vm.oFilter.destination){
			myFilter.destination = $scope.vm.oFilter.destination.c;
		}
		if (vm.oFilter.route_id) {
			myFilter.route = vm.oFilter.route_id._id;
		}
		if (vm.aBranch && vm.aBranch.length) {
			myFilter.branch = vm.aBranch.map((v) => v._id);
		} else if (vm.aUserBranch && vm.aUserBranch.length) {
			myFilter.branch = [];
			vm.aUserBranch.forEach(obj => {
				if (obj.read)
					myFilter.branch.push(obj._id);
			});
		}
		if (vm.aVendor && vm.aVendor.length) {
			myFilter.vendor = vm.aVendor.map((v) => v._id);
		}

		if (vm.oFilter.vendPaymStatus) { //
			myFilter.vendPaymStatus = vm.oFilter.vendPaymStatus;
		}

		if (vm.oFilter.broker) {
			myFilter['vendorDeal.broker.id'] = vm.oFilter.broker._id;
		}
		if (vm.oFilter.driver) {
			myFilter.driver = vm.oFilter.driver._id;
		}
		if (vm.oFilter.advance) {
			if (vm.oFilter.advance == 'Advance Done') {
				myFilter["advanceBudget.0"] = {$exists: true};
			} else if (vm.oFilter.advance == 'Not Done') {
				myFilter["advanceBudget.0"] = {$exists: false};
			}
		}
		if (vm.oFilter.approval == 'Deal Approved')
			myFilter["vendorDeal.acknowledge.status"] = true;
		else if (vm.oFilter.approval == 'Not Approved')
			myFilter["vendorDeal.acknowledge.status"] = false;

		if (vm.oFilter.allocation_date) {
			myFilter.allocation_date = vm.oFilter.allocation_date;
		}
		if (vm.start_date) {
			myFilter.from = vm.start_date;
		}
		if (vm.end_date) {
			myFilter.to = vm.end_date;
			// myFilter.to = vm.end_date;
		}
		if (vm.oFilter.segment_type) {
			myFilter.segment_type = vm.oFilter.segment_type;
		}
		if (vm.oFilter.ownershipType) {
			myFilter.ownershipType = vm.oFilter.ownershipType;
		}
		if (vm.oFilter.dateType) {
			myFilter.dateType = vm.oFilter.dateType;
		}
		if (vm.oFilter.category) {
			myFilter['customer.category'] = vm.oFilter.category;
		}
		if (vm.oFilter.categoryLoaded) {
			myFilter.category = vm.oFilter.categoryLoaded;
		}

		myFilter.isCancelled = false;

		if (download) {
			myFilter.download = download;
			myFilter.all = true;
		} else {
			myFilter.skip = vm.lazyLoad.getCurrentPage();
			myFilter.no_of_docs = 5;
			myFilter.summary = true;
		}

		return myFilter;
	}

	function uploadDocs(oTrip) {
		if (oTrip.length > 1) {
			swal('Warning', 'Please select only One Row', 'warning');
			return;
		}
		let selectedTrip = oTrip[0] || oTrip;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'trip',
					scopeModel: selectedTrip,
					scopeModelId: selectedTrip._id,
					uploadText: "Upload Trip Documents",
					uploadFunction: Vehicle.uploadDocs
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	}

	function previewDocs(oTrip) {
		if (!oTrip._id)
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs() {
			let req = {
				_id: oTrip._id,
				modelName: "trip"
			};
			dmsService.getAllDocs(req, success, failure);

			function success(res) {
				if (res && res.data) {
					$scope.oDoc = res.data;
					prepareData();
				} else {
					growlService.growl("No documents to preview", "warning");
					return;
				}
			}

			function failure(res) {
				var msg = res.data.message;
				growlService.growl(msg, "error");
				return;
			}
		}

		function prepareData() {
			let mergeData = {};
			$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj => {
				mergeData[obj.category] = mergeData[obj.category] || [];
				mergeData[obj.category].push(obj);
			});
			$scope.oDoc = mergeData;

			for (let [key, val] of Object.entries($scope.oDoc)) {
				if (Array.isArray(val)) {
					val.forEach((doc, i) => {
						let name = `${key || 'misc'} ${i || ''}`.toUpperCase();
						documents.push({
							name,
							docName: doc.name,
							_id: oTrip._id,
							modelName: 'trip',
							url: `${URL.file_server}${doc.name}`
						});
					});
				} else {
					let name = `${key || 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName: doc.name,
						_id: oTrip._id,
						modelName: 'trip',
						url: `${URL.file_server}${doc.name}`
					});
				}
			}

			$uibModal.open({
				templateUrl: 'views/carouselPopup.html',
				controller: 'carouselCtrl',
				resolve: {
					documents: function () {
						return documents;
					}
				}
			});
		}

		// if (documents.length < 1) {
		// 	growlService.growl("No documents to preview", "warning");
		// 	return;
		// }

	}

	function downloadCsv() {
		objToCsv(null,
			[
				'ADVANCE DATE',
				'ADVANCE TYPE',
				'AMOUNT',
				'REFERENCE NO',
				'DIESEL VENDOR',
				'DIESEL RATE',
				'DIESEL LITRE',
				'REMARK',
				'BRANCH ACCOUNT',
				'HAPPAY ACCOUNT',
				'BILL NO',
				'VEHICLE NO',
			],
			[]
		);
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

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

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

	function getDname(viewValue) {
		function oSucD(response) {
			vm.aRoute = response.data.data;
		}

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getName(viewValue, oSucD, oFailD);
		}
	}

	function getVendorName(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {name: viewValue, deleted: false};
				req.category = category;

				Vendor.getName(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			Driver.getName(viewValue, res => vm.aDriver = res.data.data, err => console.log`${err}`);
		}
	}

	function onBranchSelect(item) {
		vm.aBranch = vm.aBranch || [];
		vm.aBranch.push(item);
		vm.oFilter.branch = '';
	}

	function removeBranch(select, index) {
		vm.aBranch.splice(index, 1);
	}

	 vm.onVendorSelect = function(item) {
		vm.aVendor = vm.aVendor || [];
		vm.aVendor.push(item);
		vm.oFilter.vendor = '';
	}

	 vm.removeVendor = function(select, index) {
		vm.aVendor.splice(index, 1);
	}


	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				$scope.$configs.client_allowed && $scope.$configs.client_allowed.map((v) => {
					req.multiClientId = req.multiClientId || [];
					req.multiClientId.push(v.clientId);
				});
				req.multiClientId = JSON.stringify(req.multiClientId);
				// req.clientId =  clientId;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					let branch = [];
					vm.aUserBranch.forEach(obj => {
						if (obj.read)
							branch.push(obj);
					});
					resolve(branch);
				} else
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

	function onSelect() {
		getTrips();
	}

	//////////////////////////////////////////////////////////////////////////////////////
}

function tripAmountPopupController(
	$uibModalInstance,
	tripData,
	callback
) {
	let vm = this;

	//function Indentifier
	vm.closePopup = closePopup;
	vm.submit = submit;

	//init
	(function init() {

		vm.name = tripData.name;
		vm.type = tripData.type;
		vm.oAdvance = angular.copy(tripData.oshAdvance);

	})();

	//Actual Function
	function closePopup() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {

		if (formData.$valid) {

			// if(vm.oAdvance.advanceType === 'Diesel'){
			// 	if(vm.oAdvance.dieseInfo.litre !== tripData.oAdvance.dieseInfo.litre && vm.oAdvance.dieseInfo.rate !== tripData.oAdvance.dieseInfo.rate){
			// 		swal('Error','Both Rate and Liter cannot be modified','error');
			// 		return;
			// 	}
			// }

			callback(vm.oAdvance)
				.then(function (res) {
					$uibModalInstance.close(res);
				})
				.catch(function (err) {
					console.log(err);
				});

		} else {
			console.log(formData.required);
			swal('', 'All Mandatory Field are not Filled', 'error');
		}
	}
}


function TripAdvanceUpsertController(
	$modal,
	$rootScope,
	$scope,
	$state,
	$stateParams,
	$uibModal,
	accountingService,
	DatePicker,
	Driver,
	FleetService,
	otherUtils,
	tripServices,
	growlService,
	Vehicle,
	Vendor,
	vendorFuelService,
	URL
) {

	let vm = this;

	//Function Identifier
	vm.acknowledgeDeal = acknowledgeDeal;
	vm.vendorDealPopUp = vendorDealPopUp;
	vm.vendorPayment = vendorPayment;
	vm.revertAck = revertAck;
	vm.addDeduction = addDeduction;
	vm.addExtraCharges = addExtraCharges;
	vm.advanceOper = advanceOper;
	vm.uploadLoadingSlip = uploadLoadingSlip;
	vm.getTrips = getTrips;

	vm.DatePicker = angular.copy(DatePicker); // initialize pagination

	(function init() {
		if (!$stateParams.data) {
			$state.go('booking_manage.tripAdvance');
			return;
		}
		vm.oTrip = $stateParams.data;
		vm.aFromAccount = [];
		vm.disableSubmit = false;

		if (!vm.oTrip.vehicle)
			return swal('Error', 'No Vehicle Attached on trip', 'error');

		vm.driver = vm.oTrip.driver || vm.oTrip.vehicle.driver;

	})();

	//Actual Function

	function getTrips() {

		let request = {
			summary: true
		};
		request.trip_no = vm.oTrip.trip_no;
		tripServices.getAllTripsWithPagination(request, success, failure)

		function success(res) {

			vm.oTrip = res.data.data.data[0];
		}

		function failure(res) {
			swal("Failed!", res.data.data.data, "error");
		}
	}

	$scope.printPreview = function(oTrip){

		var oFilter = {
			_id: oTrip._id,
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'multiVendRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	}

	function addExtraCharges() {

		try {
			vm.oTrip.vendor.account._id;
		} catch (e) {
			swal('Error', 'No Vendor Account Attached', 'error');
			return
		}

		$modal.open({
			templateUrl: 'views/myTripAdvance/addExtraChargesPopup.html',
			controller: ['$uibModalInstance', 'accountingService', 'oTrip', 'sharedResource', 'tripServices', addExtraChargesPopupController],
			controllerAs: 'addExtraChargesVm',
			resolve: {
				oTrip: function () {
					return {
						...vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			// vm.oTrip.advanceApprove.push(response);
			console.log('close', response);
			vm.oTrip = response;
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function addDeduction() {

		try {
			vm.oTrip.vendor.account._id;
		} catch (e) {
			swal('Error', 'No Vendor Account Attached', 'error');
			return
		}

		$modal.open({
			templateUrl: 'views/myTripAdvance/addDeductionPopup.html',
			controller: ['$uibModalInstance', 'accountingService', 'oTrip', 'sharedResource', 'tripServices', addDeductionPopupController],
			controllerAs: 'addDeductionVm',
			resolve: {
				oTrip: function () {
					return {
						...vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function revertAck() {

		swal({
				title: 'Do you want to Revert Acknowledge Deal?',
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

					tripServices.revertAcknowledgeDeal({
						_id: vm.oTrip._id
					}, success, failure);

					function success(res) {
						console.log(res);
						swal('Success', res.data.message, 'success');
						// vm.oTrip = res.data.data[0];
						getTrips();
					}

					function failure(res) {
						swal("Failed!", res.data.message, "error");
					}
				} else
					return;
			});
	}

	function vendorPayment(oTrip) {

		if (!(oTrip.vendorDeal && oTrip.vendorDeal.acknowledge.status)) {
			swal('Error', 'vendorDeal not acknowledge ', 'error');
			return;
		}
		if (oTrip.vendorDeal && oTrip.vendorDeal.remainingAmount <= 0) {
			swal('Error', 'remainingAmount should be greater than zero', 'error');
			return;
		}


		$modal.open({
			templateUrl: 'views/myTripAdvance/multiTripPaymentPopup.html',
			controller: ['$scope', '$state', '$timeout', '$stateParams', '$uibModalInstance', 'accountingService', 'branchService', 'billBookService', 'DatePicker', 'narrationService', 'tripServices', 'Vendor', 'oTrip', multiTripPaymentPopupController],
			controllerAs: 'mpcVm',
			size: 'xl',
			resolve: {
				oTrip: function () {
					return {
						...oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
			getTrips();
		}, function (response) {
			console.log('close', response);
			if (response) {
				getTrips();
			}
		});
	}

	function vendorDealPopUp() {
		// if(vm.oTrip.advSettled.aVoucher.length>0){
		// 	swal('Error','Voucher already created!! vendorDealPopUp Can Not editable','error');
		// 	return
		// }
		$modal.open({
			templateUrl: 'views/myTripAdvance/vendorDealPopUp.html',
			controller: ['$scope', '$uibModalInstance', 'accountingService', 'billBookService', 'branchService', 'billsService', 'bookingServices', 'callback', 'constants', 'DateUtils', 'DatePicker', 'formulaFactory', 'growlService', 'oTrip', 'sharedResource', 'tripServices', 'userService', 'Vendor', vendorDealPopUpController],
			controllerAs: 'ackDealVm',
			size: 'xl',
			resolve: {
				callback: function () {
					return false;
				},
				oTrip: function () {
					return {
						...vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
			getTrips();
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function acknowledgeDeal() {
		try {
			vm.oTrip.vendor.account._id;
		} catch (e) {
			swal('Error', 'No Vendor Account Attached', 'error');
			return
		}
		$modal.open({
			templateUrl: 'views/myTripAdvance/editVendorDealPopup.html',
			controller: ['$scope', '$uibModalInstance', 'accountingService', 'constants', 'DateUtils', 'DatePicker', 'growlService', 'oTrip', 'sharedResource', 'tripServices', acknowledgeDealController],
			controllerAs: 'acknowledgeDealVm',
			size: 'lg',
			resolve: {
				oTrip: function () {
					return {
						...vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
			getTrips();
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function advanceOper(type = 'add') {

		let selectedAdv = vm.selectedAdvance;
		vm.selectedAdvance = undefined;
		if (type !== 'add') {

			if (!(selectedAdv && selectedAdv._id)) {
				swal('Error', 'No Advance Selected', 'error');
				return;
			}

			if (vm.oTrip.advSettled.isCompletelySettled) {
				swal('Warning', 'Advance Cannot Be Modified. Its already CompletelySettled', 'warning');
				return;
			}

			if (vm.oTrip.markSettle.isSettled) {
				swal('Warning', 'Advance Cannot Be Modified. Its already markSettle', 'warning');
				return;
			}

			if (vm.oTrip.voucher) {
				swal('Warning', 'Advance Cannot Be Modified. It is already imported', 'warning');
				return;
			}
			if (vm.oTrip) {
				vm.sumAmount = vm.oTrip.tAdv - selectedAdv.amount;
			}
		}

		if (type === 'delete') {
			swal({
					title: 'Are you sure you want to delete this advance?',
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
						tripServices.deleteAdvance({
							_id: selectedAdv._id
						}, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							swal('Success', res.data.message, 'success');
							vm.oTrip = res.data.data;
						}
					}
				});
			return;
		}

		$modal.open({
			templateUrl: 'views/tripSuspense/approvalPopup.html',
			controller: [
				'$scope',
				'$modal',
				'$uibModalInstance',
				'accountingService',
				'branchService',
				'callback',
				'DatePicker',
				'lazyLoadFactory',
				'modelDetail',
				'otherData',
				'billBookService',
				'tripServices',
				'Vehicle',
				'narrationService', 'vendorFuelService',
				approvalPopupController
			],
			controllerAs: 'approvalVm',
			resolve: {
				callback: function () {
					return function (oTrip) {
						let oAdvance = oTrip.oAdvance;
						return new Promise(function (resolve, reject) {

							if (oAdvance.advanceType === 'Diesel')
								oAdvance.amount = oAdvance.diesel_info.rate * oAdvance.diesel_info.litre;

							if (typeof vm.remainingAmount === 'number' && (oAdvance.amount + vm.sumAmount) > vm.totalPayable)
								return swal('Error', `Amount Cannot be Grater than Remaining Amount ${vm.remainingAmount}`, 'error');

							let request = {
								...oAdvance,
							};

							if (vm.oTrip.ownershipType === 'Market')
								request.ownershipType = vm.oTrip.ownershipType;

							if (type !== 'add') {
								request.trip = oTrip._id;
								request.summary = true;

								tripServices.updateAdvance(request, onSuccess, onFailure);
							} else {
								request._id = oTrip._id;

								tripServices.addAdvance(request, onSuccess, onFailure);
							}

							function onFailure(err) {
								swal('Error', err.data.message, 'error');
								reject(err.data.message);
							}

							function onSuccess(res) {
								console.log(res);
								swal('Success', res.data.message, 'success');
								resolve(res.data.data);
							}
						});
					}
				},
				modelDetail: function () {
					return {
						type,
						showTripForm: false,
					};
				},
				otherData: function () {
					return {
						selectedAdv,
						selectedTrip: vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
			getTrips();
		}, function (data) {
			console.log('cancel', data);
		});
	}

	$scope.previewDocs = function () {

		if (!Array.isArray(vm.oTrip.vendor.documents) || vm.oTrip.vendor.documents.length < 1) {
			growlService.growl("No documents to preview", "warning");
			return;
		}

		var documents = vm.oTrip.vendor.documents.map(curr => ({
			...curr,
			url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		}));

		var modalInstance = $uibModal.open({
			templateUrl: 'views/carouselPopup.html',
			controller: 'carouselCtrl',
			resolve: {
				documents: function () {
					return documents;
				}
			}
		});

	};

	function uploadLoadingSlip(loading_slip) {
		//console.log(loading_slip);
		var fd = new FormData();
		fd.append('loading_slip', loading_slip);
		var data = {};
		data.fileUpload = true;
		data.formData = fd;
		data._id = vm.oTrip._id;
		tripServices.uploadSlip(data, successLoc, failureLoc);

		function successLoc(res) {
			if (res && res.data && (res.data.status == 'OK')) {
				vm.oTrip = res.data.data;
				swal('Updated', res.data.message, 'success');
			} else {
				swal('Error', res.data.message, 'error');
			}
		}

		function failureLoc(res) {
			var msg = res.data.message;
			swal('Error', msg, 'error');
		}
	}
}

function multiVendRendorCtrl($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService){
	$scope.aTemplate = clientConfig.getFeature('vendorDeal', 'multiVendorDealSlip') ? clientConfig.getFeature('vendorDeal', 'multiVendorDealSlip') : [];

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.multiVendSlipBuilty(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR($scope.aTemplate[0].key);
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR($scope.aTemplate[0].key);
	}

	$scope.printDiv = function (elem) {
		var contents = document.getElementById(elem).innerHTML;
		var frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('<html><head><title></title>');
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(contents);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function () {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
	};
}

function multiTripPaymentController(
	$scope,
	$state,
	$stateParams,
	accountingService,
	branchService,
	billBookService,
	DatePicker,
	narrationService,
	tripServices,
	growlService,
	Vendor
) {

	let vm = this;

	vm.submit = submit;
	vm.getAccount = getAccount;
	vm.getAc = getAc;
	vm.prepareRefFilter = prepareRefFilter;
	vm.prepareFilter = prepareFilter;
	vm.getVendorName = getVendorName;
	vm.reset = reset;
	vm.checkBrocker = checkBrocker;
	vm.checklinkPayment = checklinkPayment;
	vm.removeTrip = removeTrip;
	vm.otherCal = otherCal;
	vm.validateBroker = validateBroker;
	vm.getAllBranch = getAllBranch;
	vm.onBranchSelect = onBranchSelect;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.onRefNoSelect = onRefNoSelect;
	vm.setAccount = setAccount;
	vm.deletePayment = deletePayment;

	// init
	(function init() {
		if (!($stateParams.data && $stateParams.data.aTrips))
			return $state.go('booking_manage.tripAdvance');

		vm.multiTripPaymentOf = $stateParams.data.whom;
		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.filter = {};
		vm.aTrips = [];
		vm.isDisable = false;
		vm.noRefNoFound = false;
		// vm.aPaymentType = ['All', 'Vendor Advance', 'Vendor Balance'];
		vm.aPaymentType = ['Vendor Advance', 'Vendor Balance'];
		vm.aVoucherType = ['Payment', 'Journal'];
		vm.voucherType = vm.aVoucherType[0];
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque', 'Diesel', 'Diesel Cash', 'Broker'];
		vm.selectAccountSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};
		// vm.fromAccount = {};
		vm.aFromGroup = ['Transaction', 'banks', 'Cashbook'];

		if ($stateParams.data.aTrips[0].vendorDeal.acknowledge.status)
			getTrip({
				_id: $stateParams.data.aTrips.map(o => o._id)
			});

		vm.vendorDealPayment = $scope.$configs.vendorDeal;
	})();

	//function defination

	vm.selectEvents = {
		onSelectionChanged: function () {
			onBranchSelect();
		}
	};

	function checkBrocker(trip) {
		if (!(trip.vendorDeal && trip.vendorDeal.broker && trip.vendorDeal.broker._id)) {
			trip.paidToBroker = false;
			swal('Warning', 'Trip Don\'t have Broker Linked.', 'warning');
		}
	}

	function checklinkPayment(trip) {
		if (!(trip.gr && trip.gr[0] && trip.gr[0].grNumber)) {
			trip.linkPayment = false;
			swal('Warning', 'Trip Don\'t have Gr Number', 'warning');
		}
	}

	function getTrip(request) {

		request.populate = [
			{path: 'vendorDeal.broker.id', select: {name: 1, account: 1, clientId: 1}},
		];
		request.no_of_docs = Number.MAX_SAFE_INTEGER;

		tripServices.getTripV2(request, success, failure);

		function success(res) {
			vm.filter.trip_no = '';

			if (res.data.data.length) {
				res.data.data[0].receivedAmt = vm.filter.amount;
				res.data.data[0].litre = vm.filter.qty;
				if (vm.filter.paidToBroker) {
					res.data.data[0].paidToBroker = vm.filter.paidToBroker;
					checkBrocker(res.data.data[0]);
				}
				vm.filter.paidToBroker = undefined;
				vm.filter.amount = undefined;
				vm.filter.qty = undefined;

				if (request['advanceBudget.reference_no']) {
					vm.isRefNoSearched = true;
					vm.aTrips = res.data.data;
					vm.refNo = request['advanceBudget.reference_no'];
					let branch;

					let toFindAccountId;

					vm.aTrips.find(oTrip => {
						let found = oTrip.advanceBudget.find((oAdv) => oAdv.reference_no === vm.refNo);
						if (found) {
							branch = found.branch;
							toFindAccountId = found.from_account;
							vm.voucherType = found.vType;
							return true;
						} else
							return false;
					});

					if (!(branch && branch._id))
						getAllBranch('  ', {_id: branch})
							.then(function (res) {
								vm.branch = res[0];
								vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
							});

					vm.aTrips.forEach(oTrip => {
						let found = oTrip.advanceBudget.find((oAdv) => oAdv.reference_no === vm.refNo);
						if (found) {
							if (found && found.vendorPayment && found.vendorPayment.paymentMode === 'Diesel') {
								(oTrip.gr[0] && oTrip.gr[0].moneyReceipt && oTrip.gr[0].moneyReceipt.collection || []).forEach(obj => {
									if (obj.paymentId === found._id)
										oTrip.linkPayment = true;
								});
							}
						}
					});

					getAccountById(toFindAccountId).then(function (data) {
						vm.fromAccount = data[0];
						vm.aFromAccount = data;
					});

				} else {

					if (!res.data.data.every(o => !!o.vendor.account))
						return swal('Warning', 'Vendor A/c Not Linked', 'warning');

					vm.aTrips.push(...res.data.data);
					validateBroker(true);
				}

				otherCal();
			} else {
				if (request['advanceBudget.reference_no']) {
					vm.noRefNoFound = true;
					vm.isRefNoSearched = false;
				} else {
					swal('Warning', 'No Trip Found', 'warning');
				}
			}
		}

		function failure(res) {
			vm.isRefNoSearched = false;
			swal("Failed!", res.data.data.data, "error");
		}
	}

	function prepareRefFilter() {

		vm.isRefNoSearched = false;
		vm.noRefNoFound = false;
		if (vm.filter.refNo) {
			vm.searchedRefNo = vm.filter.refNo;
			getTrip({
				'advanceBudget.reference_no': vm.filter.refNo,
				'ownershipType': 'Market',
			});
		}
	}

	function prepareFilter() {

		let filter = {
			ownershipType: 'Market',
			vClientId: true
		};

		if (vm.filter.lsNo)
			filter['vendorDeal.loading_slip'] = vm.filter.lsNo;
		filter['vendorDeal.acknowledge.status'] = true;

		if (vm.aTrips.find(o => o.vendorDeal.loading_slip === vm.filter.lsNo))
			return;

		getTrip(filter);
	}

	function reset() {
		if (vm.dataPreserve) {
			vm.aTrips = [];
			vm.filter.refNo = '';
			vm.paidToBroker = false;
			vm.refNo = '';
			vm.isRefNoSearched = false;
		} else {
			vm.aTrips = [];
			vm.refNo = '';
			vm.filter.refNo = '';
			vm.paidToBroker = false;
			vm.isRefNoSearched = false;
			vm.paymentMode = undefined;
			vm.paymentDate = undefined;
			vm.paymentRef = undefined;
			vm.fromAccount = undefined;
			vm.branch = undefined;
			vm.receivedAmt = 0;
		}
	}

	function removeTrip() {

		if (vm.oSelectedTrip && vm.oSelectedTrip._id) {
			vm.aTrips.splice(vm.aTrips.findIndex(o => o._id === vm.oSelectedTrip._id), 1);
			vm.oSelectedTrip = {};
			otherCal();
		} else
			return swal('Error', 'No Trip Selected', 'error');

	}

	function otherCal() {

		if (!vm.aTrips.length)
			return;

		if (vm.isRefNoSearched) {
			vm.receivedAmt = 0;
		}

		vm.aTrips.forEach(oTrip => {
			let selectedRefAmt = 0;
			oTrip.advPaid = 0;
			oTrip.balPaid = 0;
			oTrip.vendorDeal.extraTDSAmt = 0;

			oTrip.advanceBudget.forEach(obj => {
				oTrip.advPaid = oTrip.advPaid || 0;
				if (obj.vAdv === 'Vendor Advance' && obj.reference_no != vm.refNo)
					oTrip.advPaid += obj.amount;
			}, 0);

			oTrip.advanceBudget.forEach(obj => {
				oTrip.balPaid = oTrip.balPaid || 0;
				if (obj.vAdv === 'Vendor Balance' && obj.reference_no != vm.refNo)
					oTrip.balPaid += obj.amount;
			}, 0);

			if (oTrip.vendorDeal.charges)
				for (let [key, val] of Object.entries(oTrip.vendorDeal.charges)) {
					if (Array.isArray(val)) {
						val.forEach((obj) => {
							if (obj.tdsAmount)
								oTrip.vendorDeal.extraTDSAmt += obj.tdsAmount;
						});
					} else {
						if (val.tdsAmount)
							oTrip.vendorDeal.extraTDSAmt += val.tdsAmount;
					}
				}

			oTrip.payable = ((oTrip.vendorDeal.totWithMunshiyana || 0) + (oTrip.vendorDeal.totalCharges || 0) - (oTrip.vendorDeal.totalDeduction || 0) - (oTrip.vendorDeal.tdsAmount || 0) - (oTrip.vendorDeal.extraTDSAmt || 0));
			oTrip.totAdvance = oTrip.advanceBudget.reduce((a, b) => {

				if (b.reference_no === vm.refNo) {
					selectedRefAmt += b.amount;
					oTrip.litre = b.dieseInfo && b.dieseInfo.litre;
					oTrip.paidToBroker = b.paidToBroker;
					// vm.fromAccount = typeof b.from_account === 'object' ? b.from_account : {_id: b.from_account};

					if (b.stationaryId) {
						vm.selectedStationary = {
							bookNo: vm.refNo,
							_id: b.stationaryId
						};
					}

					if (b.vendorPayment) {
						vm.paymentDate = new Date(b.vendorPayment.paymentDate);
						vm.paymentMode = b.vendorPayment.paymentMode;
						vm.paymentRef = b.vendorPayment.paymentRef;
						vm.paymentType = b.vAdv;
						// vm.branch = b.vendorPayment.branch;
						vm.remark = b.remark;
					}
					vm.paidToBroker = b.paidToBroker;
				}

				return a + b.amount;
			}, 0);
			oTrip.remainingAmount = oTrip.payable - oTrip.totAdvance + selectedRefAmt;
			oTrip.maxAmount = oTrip.remainingAmount;
			if (vm.paymentType === 'All') {
				oTrip.maxAmount = oTrip.remainingAmount;
			} else if (vm.paymentType === 'Vendor Advance') {
				oTrip.maxAmount = oTrip.vendorDeal.advance - oTrip.advPaid;
			}
			if (vm.paymentType === 'Vendor Balance') {
				oTrip.maxAmount = oTrip.vendorDeal.toPay - oTrip.balPaid;
			}
			oTrip.maxAmount = (oTrip.maxAmount > oTrip.remainingAmount) ? oTrip.remainingAmount : oTrip.maxAmount;

			// oTrip.receivedAmt = 0;

			if (vm.isRefNoSearched) {
				vm.receivedAmt += selectedRefAmt;
				oTrip.receivedAmt = selectedRefAmt;
				oTrip.totAdvance -= selectedRefAmt;
				typeof vm.branch === 'string' && getAllBranch(false, {_id: vm.branch});
			}

		});
	}

	function getVendorName(viewValue, category) {
		return new Promise(function (resolve, reject) {

			let req = {
				name: viewValue,
				category: category,
				deleted: false,
			};

			Vendor.getName(req, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}
		});
	}

	function setAccount(paymentMode) {
		if (paymentMode == 'Diesel' || paymentMode == 'Diesel Cash') {
			// getAccount('aFromAccount', 'Diesel', '');
			vm.aFromGroup = 'Diesel';
		} else if (paymentMode == 'Broker') {
			// getAccount('aFromAccount', 'Vendor', '');
			vm.aFromGroup = 'Vendor';
		} else {
			vm.aFromGroup = ['Transaction', 'banks', 'Cashbook'];
			// getAccount('aFromAccount', vm.aFromGroup, '');
		}

	}

	function getAc(viewValue, aGroup) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					group: aGroup,
				};

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getAccount(key, aGroup, name) {

		if (!aGroup)
			return;

		let oFilter = {
			no_of_docs: 10,
			group: aGroup,
		}; // filter to send

		if (name)
			oFilter.name = name;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			vm[key] = response.data.data;

			let accType = key == 'aToAccount' ? 'to' : 'from';
			let id = vm.oAdvance.account_data && vm.oAdvance.account_data[accType] && vm.oAdvance.account_data[accType]._id || false;

			if (id && !(vm[key].find(o => id === o._id)))
				vm[key].push(vm.oAdvance.account_data[accType]);

		}
	}

	function getAccountById(_id) {

		return new Promise(function (resolve, reject) {

			let oFilter = {
				no_of_docs: 1,
				_id
			}; // filter to send

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {

			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}

		});
	}

	function validateBroker(hideMessage = false) {
		if (!vm.aTrips.every(o => !!(o.vendorDeal.broker && o.vendorDeal.broker._id))) {
			vm.paidToBroker = false;
			return !hideMessage && swal('Warning', 'Trip Don\'t have Broker Linked.', 'warning');
		}
	}

	function getAllBranch(viewValue, filter) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};

				if (filter)
					Object.assign(req, filter);
				else
					req.name = viewValue;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					req._ids = [];
					vm.aUserBranch.forEach(obj => {
						if (obj.write)
							req._ids.push(obj._id)
					});
					if (!(req._ids && req._ids.length)) {
						return
					} else {
						req._ids = JSON.stringify(req._ids);
					}
				}

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

	function deletePayment() {

		if (!(vm.filter && vm.filter.refNo))
			return swal('Error', 'No Ref No selected', 'error');

		vm.isDeleteDisable = true;

		tripServices.vendorPaymentDelete({
			refNo: vm.filter.refNo
		}, success, failure);

		function success(res) {
			if (res && res.data) {
				swal('Success', res.data.message, 'success');
				vm.isDeleteDisable = false;
				reset();
			} else {
				swal('Error', res.data.message, 'error');
				vm.isDeleteDisable = false;
			}
		}

		function failure(res) {
			vm.isDeleteDisable = false;
			var msg = res.data.message;
			swal('Error', msg, 'error');
		}
	}

	function getAutoStationaryNo(backDate) {
		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (backDate)
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
			// vm.preserveRefNo.push({name:vm.branch.name,refNo:vm.aAutoStationary.bookNo,selectedStationary: vm.aAutoStationary})
		}
	}

	function onBranchSelect() {
		vm.refNo = '';
		vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
	}

	function getRefNo(viewValue) {

		if (!vm.billBookId)
			return;
		// if (vm.paymentMode != 'Cash')
		// 	return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
				status: "unused"
			};

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onRefNoSelect(item) {
		vm.selectedStationary = item;
	}

	function submit(formData) {

		if (vm.receivedAmt < 0)
			return swal('Error', 'Received Amount Should be grater then 0.', 'error');

		vm.totReceivedAmt = vm.aTrips.reduce((a, b) => a + (b.receivedAmt || 0), 0) || 0;

		if (vm.totReceivedAmt !== vm.receivedAmt)
			return swal('Error', 'Received Amount Should be equal to All Trip Receiving', 'error');

		if (!vm.fromAccount._id)
			return swal('Error', 'Credit A/c Not selected', 'error');

		if (!(vm.branch && vm.branch._id))
			return swal('Error', 'Branch Not selected', 'error');

		if (formData.$valid) {

			let payload = [];

			let doesLorryExistOnAllTrip = vm.aTrips.every(oTrip => !!oTrip.vendorDeal.lorryAc);

			if (!doesLorryExistOnAllTrip)
				return swal('Error', `Lorry A/c not found`, 'error');

			vm.aTrips.forEach(oTrip => {
				let tripObj = {
					"account_data": {
						"from": vm.fromAccount._id,
						"fromName": vm.fromAccount.name,
						"to": oTrip.toAccount.id,
						"toName": oTrip.toAccount.name
					},
					"vehicle": oTrip.vehicle._id,
					"vendorPayment": {
						"paymentDate": moment(vm.paymentDate, 'DD/MM/YYYY').toISOString(),
						"ChequeClearDate": vm.ChequeClearDate ? moment(vm.ChequeClearDate, 'DD/MM/YYYY').toISOString() : undefined,
						"paymentMode": vm.paymentMode,
						"paymentRef": vm.paymentRef,
						"payRefNo": vm.payRefNo,
						"branch": vm.branch._id,
					},
					"vAdv": vm.paymentType,
					"vType": vm.voucherType,
					"trip": oTrip._id,
					"billNo": oTrip.vendorDeal.loading_slip,
					"billType": 'Against Ref',
					"trip_no": oTrip.trip_no,
					"advanceType": "Vendor Advance",
					"person": oTrip.vendor.name,
					"remainingAmount": oTrip.remainingAmount,
					"date": moment(vm.paymentDate, 'DD/MM/YYYY').toISOString(),
					"branch": oTrip.branch,
					"amount": oTrip.receivedAmt,
					"vehicle_no": oTrip.vehicle_no,
					"reference_no": vm.refNo,
					"remark": vm.remark,
					"vendor": oTrip.vendor._id,
					"paidToBroker": oTrip.paidToBroker,
					"linkPayment": oTrip.linkPayment,
					"driver": oTrip.driver && oTrip.driver._id || oTrip.vehicle && oTrip.vehicle.driver && oTrip.vehicle.driver._id,
					"narration": vm.remark || narrationService({
						vehicleNo: oTrip.vehicle_no,
						tripNo: oTrip.trip_no,
						vendor: oTrip.vendor && oTrip.vendor.name,
						hsNo: oTrip.vendorDeal && oTrip.vendorDeal.loading_slip,
						grNum: oTrip.gr && oTrip.gr[0].grNumber,
					})
				};
				if (vm.paymentMode === 'Diesel' && oTrip.litre) {
					tripObj.dieseInfo = {litre: oTrip.litre, rate: oTrip.rate}
				}

				if (vm.paymentType === 'Vendor Balance')
					tripObj.advanceType = 'Vendor Balance';

				tripObj.stationaryId = (vm.selectedStationary && vm.selectedStationary.bookNo) === vm.refNo ? vm.selectedStationary._id : undefined;

				let advId;
				if (vm.isRefNoSearched && (advId = oTrip.advanceBudget.find(oAdv => oAdv.reference_no === vm.filter.refNo))) {
					tripObj.advanceId = advId._id;
				}

				if (tripObj.linkPayment) {
					tripObj.grNumber = oTrip.gr && oTrip.gr[0].grNumber;
					tripObj.gr_id = oTrip.gr && oTrip.gr[0]._id;
					tripObj.vendorName = oTrip.vendor && oTrip.vendor.name;
					tripObj.totMr = (oTrip.gr[0].moneyReceipt.collection || []).filter(o => o.paymentId != advId._id).reduce((acc, obj) => acc + (obj.mrAmount || 0), 0) + oTrip.receivedAmt;
					tripObj.balFr = (oTrip.gr[0].totalAmount + oTrip.gr[0].supplementaryBill.totalFreight) - tripObj.totMr;
				}

				payload.push(tripObj);
			});

			vm.isDisable = true;

			if (vm.isRefNoSearched) {
				tripServices.vendorPaymentUpdate({
					aTrip: payload,
					refNo: (vm.filter && vm.filter.refNo) || vm.refNo
				}, success, failure);
			} else {
				tripServices.vendorPayment(payload, success, failure);
			}

			function success(res) {
				vm.isDisable = false;
				if (res && res.data) {
					swal('Success', 'Vendor Payment Successfully', 'success');
					reset();
				} else {
					swal('Error', res.data.message, 'error');
				}
			}

			function failure(res) {
				vm.isDisable = false;
				var msg = res.data.message;
				swal('Error', msg, 'error');
			}

		} else
			return swal('Error', 'All Mandatory Feilds are not filled', 'error');
	}
}

function multiTripPaymentPopupController(
	$scope,
	$state,
	$timeout,
	$stateParams,
	$uibModalInstance,
	accountingService,
	branchService,
	billBookService,
	DatePicker,
	narrationService,
	tripServices,
	Vendor,
	oTrip
) {

	let vm = this;

	vm.submit = submit;
	vm.getAccount = getAccount;
	vm.getAc = getAc;
	vm.prepareRefFilter = prepareRefFilter;
	vm.prepareFilter = prepareFilter;
	vm.getVendorName = getVendorName;
	vm.reset = reset;
	vm.checkBrocker = checkBrocker;
	vm.removeTrip = removeTrip;
	vm.validateBroker = validateBroker;
	vm.getAllBranch = getAllBranch;
	vm.onBranchSelect = onBranchSelect;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.onRefNoSelect = onRefNoSelect;
	vm.setAccount = setAccount;
	vm.deletePayment = deletePayment;
	vm.validateAmount = validateAmount;
	vm.closeModal = closeModal;

	// init
	(function init() {
		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.filter = {};
		vm.aTrips = [];
		vm.isDisable = false;
		vm.noRefNoFound = false;
		// vm.aPaymentType = ['All', 'Vendor Advance', 'Vendor Balance'];
		vm.aPaymentType = ['Vendor Advance', 'Vendor Balance'];
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque', 'Diesel', 'Diesel Cash', 'Broker'];
		vm.aFromGroup = ['Transaction', 'banks', 'Cashbook'];

		getTrip({
			_id: oTrip._id
		});

		oTrip.advanceBudget.forEach(obj => {
			vm.advPaid = vm.advPaid || 0;
			if (obj.vAdv === 'Vendor Advance')
				vm.advPaid += obj.amount;
		}, 0);

		oTrip.advanceBudget.forEach(obj => {
			vm.balPaid = vm.balPaid || 0;
			if (obj.vAdv === 'Vendor Balance')
				vm.balPaid += obj.amount;
		}, 0);

		vm.vendorDealPayment = $scope.$configs.vendorDeal;
	})();

	//function defination

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	vm.selectEvents = {
		onSelectionChanged: function () {
			onBranchSelect();
		}
	};

	function checkBrocker(trip) {
		if (!(trip.vendorDeal && trip.vendorDeal.broker && trip.vendorDeal.broker._id)) {
			trip.paidToBroker = false;
			swal('Warning', 'Trip Don\'t have Broker Linked.', 'warning');
		}
	}

	function getTrip(request) {

		request.populate = [
			{path: 'vendorDeal.broker.id', select: {name: 1, account: 1, clientId: 1}},
		];
		request.no_of_docs = Number.MAX_SAFE_INTEGER;

		tripServices.getV2(request, success, failure);

		function success(res) {
			vm.filter.trip_no = '';

			if (res.data.data.data.length) {
				res.data.data.data[0].receivedAmt = vm.filter.amount;
				res.data.data.data[0].litre = vm.filter.qty;
				if (vm.filter.paidToBroker) {
					res.data.data.data[0].paidToBroker = vm.filter.paidToBroker;
					checkBrocker(res.data.data.data[0]);
				}
				vm.filter.paidToBroker = undefined;
				vm.filter.amount = undefined;
				vm.filter.qty = undefined;

				if (request['advanceBudget.reference_no']) {
					vm.isRefNoSearched = true;
					vm.aTrips = res.data.data.data;
					vm.refNo = request['advanceBudget.reference_no'];

					let toFindAccountId;

					vm.aTrips.find(oTrip => {
						let found = oTrip.advanceBudget.find((oAdv) => oAdv.reference_no === vm.refNo);

						if (found) {
							toFindAccountId = found.from_account;
							return true;
						} else
							return false;
					});

					getAccountById(toFindAccountId).then(function (data) {
						vm.fromAccount = data[0];
						vm.aFromAccount = data;
					});

				} else {

					if (!res.data.data.data.every(o => !!o.vendor.account))
						return swal('Warning', 'Vendor A/c Not Linked', 'warning');

					vm.aTrips.push(...res.data.data.data);
					validateBroker(true);
				}

				otherCal();
			} else {
				if (request['advanceBudget.reference_no']) {
					vm.noRefNoFound = true;
					vm.isRefNoSearched = false;
				} else {
					swal('Warning', 'No Trip Found', 'warning');
				}
			}
		}

		function failure(res) {
			vm.isRefNoSearched = false;
			swal("Failed!", res.data.data.data, "error");
		}
	}

	function prepareRefFilter() {

		vm.isRefNoSearched = false;
		vm.noRefNoFound = false;
		if (vm.filter.refNo) {
			vm.searchedRefNo = vm.filter.refNo;
			getTrip({
				'advanceBudget.reference_no': vm.filter.refNo,
				'ownershipType': 'Market',
			});
		}
	}

	function prepareFilter() {

		let filter = {
			ownershipType: 'Market',
			vClientId: true
		};

		if (vm.filter.lsNo)
			filter['vendorDeal.loading_slip'] = vm.filter.lsNo;
		filter['vendorDeal.acknowledge.status'] = true;

		if (vm.aTrips.find(o => o.vendorDeal.loading_slip === vm.filter.lsNo))
			return;

		getTrip(filter);
	}

	function reset() {
		if (vm.dataPreserve) {
			vm.aTrips = [];
			vm.filter.refNo = '';
			vm.paidToBroker = false;
			vm.refNo = '';
			vm.isRefNoSearched = false;
		} else {
			vm.aTrips = [];
			vm.refNo = '';
			vm.filter.refNo = '';
			vm.paidToBroker = false;
			vm.isRefNoSearched = false;
			vm.paymentMode = undefined;
			vm.paymentDate = undefined;
			vm.paymentRef = undefined;
			vm.fromAccount = undefined;
			vm.branch = undefined;
			vm.receivedAmt = 0;
		}
	}

	function removeTrip() {

		if (vm.oSelectedTrip && vm.oSelectedTrip._id) {
			vm.aTrips.splice(vm.aTrips.findIndex(o => o._id === vm.oSelectedTrip._id), 1);
			vm.oSelectedTrip = {};
			otherCal();
		} else
			return swal('Error', 'No Trip Selected', 'error');

	}

	function validateAmount() {
		vm.minAmount = oTrip.vendorDeal && oTrip.vendorDeal.remainingAmount;
		if (vm.paymentType === 'All') {
			vm.minAmount = oTrip.vendorDeal && oTrip.vendorDeal.remainingAmount;
		} else if (vm.paymentType === 'Vendor Advance') {
			vm.minAmount = 0;
			oTrip.advanceBudget.forEach(obj => {
				if (obj.vAdv === 'Vendor Advance')
					vm.minAmount += obj.amount;
			}, 0);

			vm.minAmount = (vm.minAmount <= oTrip.vendorDeal.advance) ? (oTrip.vendorDeal.advance - vm.minAmount) : oTrip.vendorDeal.advance;
			vm.minAmount = (vm.minAmount <= oTrip.vendorDeal.remainingAmount) ? vm.minAmount : oTrip.vendorDeal.remainingAmount;
		} else if (vm.paymentType === 'Vendor Balance') {
			vm.minAmount = 0;
			oTrip.advanceBudget.forEach(obj => {
				if (obj.vAdv === 'Vendor Balance')
					vm.minAmount += obj.amount;
			}, 0);

			vm.minAmount = (vm.minAmount <= oTrip.vendorDeal.toPay) ? (oTrip.vendorDeal.toPay - vm.minAmount) : oTrip.vendorDeal.toPay;
			vm.minAmount = (vm.minAmount <= oTrip.vendorDeal.remainingAmount) ? vm.minAmount : oTrip.vendorDeal.remainingAmount;
		}
		if (vm.receivedAmt) {
			if (vm.receivedAmt <= vm.minAmount) {
				vm.aTrips[0].receivedAmt = vm.receivedAmt;
			} else {
				$timeout(function () {
					swal('Error', 'amount cannot be greater than remainingAmount', 'error');
					vm.receivedAmt = 0;
					// $scope.flag = false;
				}, 2000);
			}
		}
	}

	function otherCal() {

		if (!vm.aTrips.length)
			return;

		if (vm.isRefNoSearched) {
			vm.receivedAmt = 0;
		}

		if (!(vm.aTrips[0].branch && vm.aTrips[0].branch._id))
			getAllBranch('  ', {_id: vm.aTrips[0].branch})
				.then(function (res) {
					vm.branch = res[0];
					vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
				});

		vm.aTrips.forEach(oTrip => {
			let selectedRefAmt = 0;

			oTrip.totAdvance = oTrip.advanceBudget.reduce((a, b) => {

				if (b.reference_no === vm.refNo) {
					selectedRefAmt += b.amount;
					oTrip.litre = b.dieseInfo && b.dieseInfo.litre;
					oTrip.paidToBroker = b.paidToBroker;
					// vm.fromAccount = typeof b.from_account === 'object' ? b.from_account : {_id: b.from_account};

					if (b.stationaryId) {
						vm.selectedStationary = {
							bookNo: vm.refNo,
							_id: b.stationaryId
						};
					}

					if (b.vendorPayment) {
						vm.paymentDate = new Date(b.vendorPayment.paymentDate);
						vm.paymentMode = b.vendorPayment.paymentMode;
						vm.paymentRef = b.vendorPayment.paymentRef;
						vm.branch = b.vendorPayment.branch;
						vm.remark = b.remark;
					}
					vm.paidToBroker = b.paidToBroker;
				}

				return a + b.amount;
			}, 0);

			// oTrip.receivedAmt = 0;

			if (vm.isRefNoSearched) {
				vm.receivedAmt += selectedRefAmt;
				oTrip.receivedAmt = selectedRefAmt;
				oTrip.totAdvance -= selectedRefAmt;
				typeof vm.branch === 'string' && getAllBranch(false, {_id: vm.branch});
			}

		});
	}

	function getVendorName(viewValue, category) {
		return new Promise(function (resolve, reject) {

			let req = {
				name: viewValue,
				category: category,
				deleted: false,
			};

			Vendor.getName(req, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}
		});
	}

	function setAccount(paymentMode) {
		if (paymentMode == 'Diesel' || paymentMode == 'Diesel Cash') {
			// getAccount('aFromAccount', 'Diesel', '');
			vm.aFromGroup = 'Diesel';
		} else if (paymentMode == 'Broker') {
			// getAccount('aFromAccount', 'Vendor', '');
			vm.aFromGroup = 'Vendor';
		} else {
			vm.aFromGroup = ['Transaction', 'banks', 'Cashbook'];
			// getAccount('aFromAccount', vm.aFromGroup, '');
		}

	}

	function getAc(viewValue, aGroup) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					group: aGroup,
				};

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getAccount(key, aGroup, name) {

		if (!aGroup)
			return;

		let oFilter = {
			no_of_docs: 10,
			group: aGroup,
		}; // filter to send

		if (name)
			oFilter.name = name;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			vm[key] = response.data.data;

			let accType = key == 'aToAccount' ? 'to' : 'from';
			let id = vm.oAdvance.account_data && vm.oAdvance.account_data[accType] && vm.oAdvance.account_data[accType]._id || false;

			if (id && !(vm[key].find(o => id === o._id)))
				vm[key].push(vm.oAdvance.account_data[accType]);

		}
	}

	function getAccountById(_id) {

		return new Promise(function (resolve, reject) {

			let oFilter = {
				no_of_docs: 1,
				_id
			}; // filter to send

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {

			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}

		});
	}

	function validateBroker(hideMessage = false) {
		if (!vm.aTrips.every(o => !!(o.vendorDeal.broker && o.vendorDeal.broker._id))) {
			vm.paidToBroker = false;
			return !hideMessage && swal('Warning', 'Trip Don\'t have Broker Linked.', 'warning');
		}
	}

	function getAllBranch(viewValue, filter) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};

				if (filter)
					Object.assign(req, filter);
				else
					req.name = viewValue;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					req._ids = [];
					vm.aUserBranch.forEach(obj => {
						if (obj.write)
							req._ids.push(obj._id)
					});
					if (!(req._ids && req._ids.length)) {
						return
					} else {
						req._ids = JSON.stringify(req._ids);
					}
				}

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

	function deletePayment() {

		if (!(vm.filter && vm.filter.refNo))
			return swal('Error', 'No Ref No selected', 'error');

		vm.isDeleteDisable = true;

		tripServices.vendorPaymentDelete({
			refNo: vm.filter.refNo
		}, success, failure);

		function success(res) {
			if (res && res.data) {
				swal('Success', res.data.message, 'success');
				vm.isDeleteDisable = false;
				reset();
			} else {
				swal('Error', res.data.message, 'error');
				vm.isDeleteDisable = false;
			}
		}

		function failure(res) {
			vm.isDeleteDisable = false;
			var msg = res.data.message;
			swal('Error', msg, 'error');
		}
	}

	function getAutoStationaryNo(backDate) {
		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (backDate)
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
			// vm.preserveRefNo.push({name:vm.branch.name,refNo:vm.aAutoStationary.bookNo,selectedStationary: vm.aAutoStationary})
		}
	}

	function onBranchSelect() {
		vm.refNo = '';
		vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
	}

	function getRefNo(viewValue) {

		if (!vm.billBookId)
			return;
		if (vm.paymentMode != 'Cash')
			return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
				status: "unused"
			};

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onRefNoSelect(item) {
		vm.selectedStationary = item;
	}

	function submit(formData) {

		if (vm.receivedAmt < 0)
			return swal('Error', 'Received Amount Should be grater then 0.', 'error');

		vm.totReceivedAmt = vm.aTrips.reduce((a, b) => a + (b.receivedAmt || 0), 0) || 0;

		if (vm.totReceivedAmt !== vm.receivedAmt)
			return swal('Error', 'Received Amount Should be equal to All Trip Receiving', 'error');

		if (!vm.fromAccount._id)
			return swal('Error', 'Credit A/c Not selected', 'error');

		if (!(vm.branch && vm.branch._id))
			return swal('Error', 'Branch Not selected', 'error');

		if (formData.$valid) {

			let payload = [];

			let doesLorryExistOnAllTrip = vm.aTrips.every(oTrip => !!oTrip.vendorDeal.lorryAc);

			if (!doesLorryExistOnAllTrip)
				return swal('Error', `Lorry A/c not found`, 'error');

			vm.aTrips.forEach(oTrip => {
				let tripObj = {
					"account_data": {
						"from": vm.fromAccount._id,
						"fromName": vm.fromAccount.name,
						"to": oTrip.toAccount.id,
						"toName": oTrip.toAccount.name
					},
					"vehicle": oTrip.vehicle._id,
					"vendorPayment": {
						"paymentDate": moment(vm.paymentDate, 'DD/MM/YYYY').toISOString(),
						"ChequeClearDate": vm.ChequeClearDate ? moment(vm.ChequeClearDate, 'DD/MM/YYYY').toISOString() : undefined,
						"paymentMode": vm.paymentMode,
						"paymentRef": vm.paymentRef,
						"payRefNo": vm.payRefNo,
						"branch": vm.branch._id,
					},
					"vAdv": vm.paymentType,
					"trip": oTrip._id,
					"billNo": oTrip.vendorDeal.loading_slip,
					"billType": 'Against Ref',
					"trip_no": oTrip.trip_no,
					"advanceType": "Vendor Advance",
					"person": oTrip.vendor.name,
					"remainingAmount": oTrip.remainingAmount,
					"date": moment(vm.paymentDate, 'DD/MM/YYYY').toISOString(),
					"branch": oTrip.branch,
					"amount": oTrip.receivedAmt,
					"vehicle_no": oTrip.vehicle_no,
					"reference_no": vm.refNo,
					"remark": vm.remark,
					"vendor": oTrip.vendor._id,
					"paidToBroker": oTrip.paidToBroker,
					"driver": oTrip.driver && oTrip.driver._id || oTrip.vehicle && oTrip.vehicle.driver && oTrip.vehicle.driver._id,
					"narration": narrationService({
						vehicleNo: oTrip.vehicle_no,
						tripNo: oTrip.trip_no,
						vendor: oTrip.vendor && oTrip.vendor.name,
						hsNo: oTrip.vendorDeal && oTrip.vendorDeal.loading_slip,
						grNum: oTrip.gr && oTrip.gr[0].grNumber,
					})
				};
				if (vm.paymentMode === 'Diesel' && oTrip.litre) {
					tripObj.dieseInfo = {litre: oTrip.litre, rate: oTrip.rate}
				}

				if (vm.paymentType === 'Vendor Balance')
					tripObj.advanceType = vm.paymentType;

				tripObj.stationaryId = (vm.selectedStationary && vm.selectedStationary.bookNo) === vm.refNo ? vm.selectedStationary._id : undefined;

				let advId;
				if (vm.isRefNoSearched && (advId = oTrip.advanceBudget.find(oAdv => oAdv.reference_no === vm.filter.refNo))) {
					tripObj.advanceId = advId._id;
				}

				payload.push(tripObj);
			});

			vm.isDisable = true;

			if (vm.isRefNoSearched) {
				tripServices.vendorPaymentUpdate({
					aTrip: payload,
					refNo: (vm.filter && vm.filter.refNo) || vm.refNo
				}, success, failure);
			} else {
				tripServices.vendorPayment(payload, success, failure);
			}

			function success(res) {
				vm.isDisable = false;
				$uibModalInstance.dismiss(res);
			}

			function failure(res) {
				vm.isDisable = false;
				var msg = res.data.message;
				swal('Error', msg, 'error');
			}

		} else
			return swal('Error', 'All Mandatory Feilds are not filled', 'error');
	}
}

function advancePopupUpsertController(
	$scope,
	$timeout,
	$uibModalInstance,
	accountingService,
	branchService,
	callback,
	DatePicker,
	lazyLoadFactory,
	modelDetail,
	otherData,
	billBookService,
	tripServices,
	Vehicle,
	narrationService,
	vendorFuelService,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.clearTrip = clearTrip;
	vm.getAccount = getAccount;
	vm.getAccountAsync = getAccountAsync;
	vm.getFuelStation = getFuelStation;
	vm.getFuelVendor = getFuelVendor;
	vm.getTrips = getTrips;
	vm.getVname = getVname;
	vm.preserveData = preserveData;
	vm.onVehicleSelect = onVehicleSelect;
	vm.setContraAcc = setContraAcc;
	vm.setUnsetAccountMasterVendor = setUnsetAccountMasterVendor;
	vm.setAccount = setAccount;
	vm.setAmount = setAmount;
	vm.generateRemark = generateRemark;
	vm.setAmountRate = setAmountRate;
	vm.getSingleBranch = getSingleBranch;
	vm.tableRowClick = tableRowClick;
	vm.validateAmount = validateAmount;
	vm.advanceDateType = advanceDateType;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.onBranchSelect = onBranchSelect;
	vm.getCostCenter = getCostCenter;
	vm.onVendorSelect = onVendorSelect;
	vm.getAllBranch = getAllBranch;
	vm.onRefSelect = onRefSelect;
	vm.getRefNo = getRefNo;
	vm.addAdvance = addAdvance;
	vm.editAdvance = editAdvance;
	vm.removeAdvance = removeAdvance;
	vm.softReset = softReset;
	vm.stopEvent = stopEvent;
	vm.onToAcSelect = onToAcSelect;
	vm.submitForm = submitForm;
	vm.submit = submit;

	// init
	(function init() {

		vm.aAdvance = [];
		vm.allocationDate = new Date();
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		vm.oAdvance = {
			account_data: {
				// from: {},
				// to: {}
			},
			diesel_info: {
				// 	vendor: {}
			}
		};
		vm.DatePicker = angular.copy(DatePicker);
		vm.dealAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		vm.columnSetting = {
			allowedColumn: [
				'Trip No',
				'Gr No',
				'Vehicle No',
				'Route',
				'Driver Name',
				'Trip Allocation',
				'Trip Started',
				'Trip Ended',
				'Trip Status',
			]
		};
		vm.tableHead = [
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			/*{
				'header': 'Gr No',
				'filter': {
					'name': 'arrayOfGrToString',
					'aParam': [
						'gr',
					]
				}
			},*/
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle_no',
				'date': false
			},
			{
				'header': 'Route',
				'bindingKeys': 'route_name || rName'
			},
			{
				'header': 'Driver Name',
				'bindingKeys': 'driver.name'
			},
			{
				'header': 'Trip Allocation',
				'bindingKeys': 'allocation_date',
				'date': true
			},
			{
				'header': 'Trip Started',
				'bindingKeys': 'statuses[1].date' || 'NA'
			},
			{
				'header': 'Trip Ended',
				'bindingKeys': 'statuses[2].date' || 'NA'
			},
			{
				'header': 'Trip Status',
				'bindingKeys': 'status'
			},
		];

		vm.advColumnSetting = {
			allowedColumn: [
				'ADVANCE TYPE',
				'PERSON',
				'AMOUNT',
				'Credit Ac',
				'Debit Ac',
				'TOTAL DIESEL(LIT.)',
				'DIESEL RATE',
				'Bill No',
				'Vendor',
				'Remark',
			],
		};
		vm.advTableHead = [
			{
				"header":"ADVANCE TYPE",
				"bindingKeys": 'advanceType'
			},
			{
				"header":"PERSON",
				'bindingKeys': 'person'
			},
			{
				"header":"DATE",
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				"header":"AMOUNT",
				'bindingKeys': 'amount.toFixed(2)'
			},
			{
				"header":"Credit Ac",
				'bindingKeys': 'account_data.from.name'
			},
			{
				"header":"Debit Ac",
				'bindingKeys': 'account_data.to.name',
			},
			{
				"header":"TOTAL DIESEL(LIT.)",
				'bindingKeys': '(dieseInfo.litre || diesel_info.litre).toFixed(2)',
			},
			{
				"header":"DIESEL RATE",
				'bindingKeys': '(dieseInfo.rate || diesel_info.rate).toFixed(2)',
			},
			{
				"header":"Bill No",
				'bindingKeys': 'bill_no',
				'date': false
			},
			{
				"header":"Vendor",
				'bindingKeys': 'dieseInfo.vendor.name'
			},
			{
				"header":"Remark",
				'bindingKeys': 'remark || narration'
			}
		];

		vm.aTrip = [];
		vm.lazyLoad = lazyLoadFactory();
		vm.showAdvanceType = true;
		vm.showCategory = false;
		vm.modelDetail = modelDetail;
		vm.showInAdd = modelDetail.type === 'add';
		vm.showInEdit = modelDetail.type === 'edit';
		vm.showTripForm = typeof modelDetail.showTripForm == 'undefined' ? true : modelDetail.showTripForm;
		vm.accounts = {};
		vm.mandatory = {
			vehicle: true,
			...modelDetail.mandatory
		};
		if($scope.$configs && $scope.$configs.tripAdv && $scope.$configs.tripAdv.driverDetails){
			vm.driverLable = 'Driver Name';
		}


		if (typeof vm.showTripForm == 'object') {
			vm.showTripForm = {
				showVehicle: true,
				showAdvanceDate: true,
				showTripSearchBtn: true,
				showTripTable: true,
				...vm.showTripForm,
			};
		} else if (typeof vm.showTripForm == 'boolean') {
			let bool = !!vm.showTripForm;
			vm.showTripForm = {};
			vm.showTripForm.showVehicle = bool;
			vm.showTripForm.showAdvanceDate = bool;
			vm.showTripForm.showTripSearchBtn = bool;
			vm.showTripForm.showTripTable = bool;
		}

		for (let i in vm.showTripForm)
			if (vm.showTripForm.hasOwnProperty(i) && vm.showTripForm[i]) {
				vm.showTripForm.toShow = true;
				break;
			}

		if (otherData.advanceCategory === 'other') {
			vm.showCategory = true;
			vm.showAdvanceType = false;
			vm.oAdvance.advanceType = 'Diesel';
			vm.aCatagory = otherData.aCatagory;
		}

		getAdv();
	})();

	//Actual Function
	function getAdv(){
		vm.selectedAdv = otherData.selectedAdv;
		vm.selectedTrip = otherData.selectedTrip || {};
		setAdvType();

		if (vm.modelDetail.type === 'add') {
			if (vm.selectedTrip && vm.selectedTrip.vehicle_no) {
				vm.oAdvance.vehicle = vm.selectedTrip.vehicle;
				setAccount();
				// if(vm.selectedTrip.ownershipType == "Market")
				// 	vm.oAdvance.narration = narrationService({vehicleNo: vm.selectedTrip.vehicle_no, tripNo: vm.selectedTrip.trip_no, vendor: vm.selectedTrip.vendor && vm.selectedTrip.vendor.name});
			}
		} else if (vm.modelDetail.type === 'edit') {

			vm.oAdvance = {
				...vm.selectedAdv,
				branch: vm.selectedAdv.branch && vm.selectedAdv.branch._id,
				diesel_info: vm.selectedAdv.dieseInfo || vm.selectedAdv.diesel_info,
				ccVehicle: vm.selectedAdv.ccVehicle,
				account_data: {
					from: vm.selectedAdv.from_account,
					to: vm.selectedAdv.to_account
				}
			};

			// vm.oldAmount = angular.copy(vm.oAdvance.amount);
			vm.prevSelectedVehicle = vm.selectedAdv.vehicle && vm.selectedAdv.vehicle._id;

			vm.selectedRefNo = {
				bookNo: vm.selectedAdv.reference_no,
				_id: vm.selectedAdv.stationaryId
			};

			vm.oAdvance.date = vm.oAdvance.date && new Date(vm.oAdvance.date);

			vm.date = vm.oAdvance.date;

			getSingleBranch();

			if (!(otherData.selectedTrip && otherData.selectedTrip._id) && vm.selectedAdv.trip_no) {
				getTripFromTripNo(vm.selectedAdv.trip_no);
			} else {
				tableRowClick();
			}

			tripServices.tripAdvances({
				reference_no: vm.selectedAdv.reference_no,
				no_of_docs: 500
			}, (res) => {
				if (res && res.data) {
					res = res.data;
					res.data.forEach(o => {
						if(o.voucher){
							swal('Error', 'Advances Imported to A/c', 'error');
							closeModal();
						}

						if(o.purchaseBill){
							swal('Error', 'Purchase bill generated', 'error');
							closeModal();
						}

						o.branch = o.branch && o.branch._id;
						o.diesel_info = o.dieseInfo || o.diesel_info;
						o.account_data = {
							from: o.from_account,
							to: o.to_account
						}

						o.date = o.date && new Date(o.date);

					});

					vm.aAdvance = res.data;
					vm.advTableApi.refresh();
					setAdvType();
				}
			});

			softReset();
		} else {
			vm.oAdvance.slip = {}
		}
	}

	function clearTrip() {
		vm.aTrip = [];
		vm.selectedTrip = undefined;
		vm.tableApi && vm.tableApi.refresh();
	}

	function onToAcSelect(item) {
		vm.oAdvance.person = item.name;
	}

	function getSingleBranch() {
		let req = {
			_id: vm.oAdvance.branch
		};

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			vm.oAdvance.branch = data.data[0];
			vm.billBookId = vm.oAdvance.branch.refNoBook ? vm.oAdvance.branch.refNoBook.map(o => o.ref) : '';
			// if(vm.oAdvance.branch && !vm.aBranch.find( o => o._id === vm.oAdvance.branch))
			// 	vm.aBranch.unshift(vm.oAdvance.branch);
		}
	}

	function stopEvent($event){
		$event.stopPropagation();
	}

	function submitForm($event){
		$timeout(() => {
			angular.element('#submitForm').triggerHandler('submit');
		});
	}

	function addAdvance(formData) {
		if(!formData.$valid)
			return swal('', 'All Mandatory Field are not Filled', 'error');

		vm.aAdvance.push(vm.oAdvance);
		softReset();
		vm.advTableApi.refresh();
	}

	function editAdvance() {
		removeAdvance();
		vm.oAdvance = vm.selectedAdvance;
		vm.aToAccount = [vm.oAdvance.account_data.to];
		vm.aFromAccount = [vm.oAdvance.account_data.from];
	}

	function removeAdvance() {
		let fdIndex = vm.aAdvance.findIndex(o => o.advanceType === vm.selectedAdvance.advanceType);
		if(fdIndex != -1)
			vm.aAdvance.splice(fdIndex, 1);
		softReset();
	}

	function softReset() {
		vm.oAdvance = {
			vehicle: angular.copy(vm.oAdvance.vehicle),
			branch: angular.copy(vm.oAdvance.branch),
			date: angular.copy(vm.oAdvance.date),
			reference_no: angular.copy(vm.oAdvance.reference_no),
			ccVehicle: angular.copy(vm.oAdvance.ccVehicle),
		};
		setAdvType();
	}

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getRefNo(viewValue) {

		if (!vm.billBookId) {
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
				status: "unused"
			};

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onRefSelect(item, model, label) {
		vm.selectedRefNo = item;
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (vm.selectedTrip && vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
					req.cClientId = vm.selectedTrip.vendor.clientId;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					req._ids = [];
					vm.aUserBranch.forEach(obj => {
						if (obj.write)
							req._ids.push(obj._id)
					});
					if (!(req._ids && req._ids.length)) {
						return
					} else {
						req._ids = JSON.stringify(req._ids);
					}
				}

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

	function onBranchSelect(item, model, label) {
		vm.oAdvance.reference_no = '';
		vm.billBookId = item.refNoBook ? item.refNoBook.map(o => o.ref) : '';
		getCostCenter();
	}

	function getCostCenter() {
		if(!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if(!(vm.oAdvance.branch && vm.oAdvance.branch._id && vm.oAdvance.advanceType))
			return;

		accountingService.getCostCenter({
			branch: vm.oAdvance.branch._id,
			feature: vm.oAdvance.advanceType,
			projection: {_id: 1, name: 1, category: "$category.name"}
		}, (res) => vm.oAdvance.ccBranch = res.data[0],
			(res) => console.error(res));
	}

	function getAutoStationaryNo(backDate) {
		if (!(vm.billBookId && vm.billBookId.length))
			return swal('warning', 'Ref Book not found on this branch', 'warning');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": "vch",
			"status": "unused"
		};

		if (backDate)
			// req.backDate = backDate;
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oAdvance.reference_no = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
		}

	}

	function getVname(viewValue) {
		if (viewValue.length < 3)
			return;

		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}

			Vehicle.getNamePop(viewValue, ['vendor_id', 'vendor_id.account'], oSuc, oFail);
		});
	}

	function getAccount(key, aGroup, viewValue) {
		if (viewValue.length < 1)
			return;

		return new Promise(function (resolve, reject) {
			function onSuccess(response) {
				resolve(response.data.data);
			}

			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			if (!aGroup)
				return;

			var oFilter = {
				no_of_docs: 10,
				group: aGroup
			}; // filter to send

			if (vm.selectedTrip && vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (viewValue)
				oFilter.name = viewValue;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
		});
	}

	function getAccountAsync(name, aGroup) {
		return new Promise(function (resolve, reject) {

			if (!aGroup)
				return;

			var oFilter = {
				no_of_docs: 10,
			}; // filter to send

			if (aGroup)
				oFilter.group = aGroup;

			if (vm.selectedTrip && vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (name)
				oFilter.name = name;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}
		});
	}

	function getFuelStation(item) {
		if (!(vm.oAdvance.diesel_info.vendor && vm.oAdvance.diesel_info.vendor.vendorId))
			return;
		if (!vm.oAdvance.date) {
			swal('error', "Plz select Allocation Date", 'error');
			return;
		}

		function successGetStation(response) {
			if (!response.data || !response.data.data || !response.data.data.length) {
				swal('warning', "No Rate Found in This Date Range for this FuelVendor", 'warning');
				return;
			}

			vm.oAdvance.diesel_info.station = response.data.data[0];
			vm.oAdvance.diesel_info.rate = vm.oAdvance.diesel_info.station.fuel_price;
			setAmount(vm.oAdvance.diesel_info.litre);
		}

		function failGetStation(res) {

		}

		let oFilter = {
			vendorId: item.vendorId
		};

		if (vm.oAdvance.date)
			oFilter.to = moment(vm.oAdvance.date, 'DD/MM/YYYY').toISOString();

		vendorFuelService.GetFuelStationObj(oFilter, successGetStation, failGetStation);
	}

	function getFuelVendor(viewValue) {

		return new Promise(function (resolve, reject) {
			function success(response) {
				vm.aFuelVendor = response.data;
				resolve(response.data);
			}

			function failure(response) {
				reject([]);
				console.log(response);
			}

			let req = {
				name: viewValue,
				no_of_docs: 10
			};

			if (vm.selectedTrip && vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
				req.cClientId = vm.selectedTrip.vendor.clientId;

			vendorFuelService.getVendorFuels(req, success, failure);
		});
	}

	// function getFuelVendor(inputModel) {
	// 	function success(response) {
	// 		vm.aFuelVendor = response.data;
	// 		vm.oAdvance.diesel_info.vendor = angular.extend({}, vm.aFuelVendor.find( o => o._id === vm.oAdvance.diesel_info.vendor._id) || {});
	// 	}
	//
	// 	function failure(response) {
	// 		console.log(response);
	// 	}
	//
	// 	let req = {
	// 		no_of_docs: 10
	// 	};
	//
	// 	if(vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
	// 		req.cClientId = vm.selectedTrip.vendor.clientId;
	//
	// 	if (inputModel)
	// 		req.name = inputModel;
	//
	// 	vendorFuelService.getVendorFuels(req, success, failure);
	// }

	function getTrips(isGetActive) {

		// if(!(vm.vehicle_no && vm.date)){
		// 	swal('warning', "Both Vehicle and Date should be Filled",'warning');
		// 	return;
		// }

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		tripServices.findByAdvanceDate(oFilter, function (res) {
			if (res && res.data) {

				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
				vm.tableApi && vm.tableApi.refresh();
				tableRowClick();
			}
		});
	}

	function getTripFromTripNo(tripNo) {
		let oFilter = {
			'trip_no': tripNo,
			'vehicle_no': vm.oAdvance.vehicle_no,
			popolate: {
				'vendor': 1,
				'vendor.account': 1
			}
		};

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {

				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, false, res);
				vm.tableApi && vm.tableApi.refresh();
				vm.selectedTrip = res.data[0];
				tableRowClick();
			}
		});
	}

	function prepareFilter(item) {
		let request = {};

		if (vm.oAdvance.vehicle)
			request.vehicle_no = vm.oAdvance.vehicle.vehicle_reg_no;

		if (vm.date)
			request.advanceDate = moment(vm.date, 'DD/MM/YYYY').toISOString();

		if (item)
			request.vendorId = item.vendorId;

		request.no_of_docs = 5;

		return request;
	}

	function advanceDateType() {
		// vm.oAdvance.date =  moment(vm.date, 'DD/MM/YYYY').toISOString();

		if (vm.oAdvance.editable != false)
			vm.oAdvance.date = moment(vm.date, 'DD/MM/YYYY').toDate();


		if (vm.oAdvance.diesel_info.vendor)
			getFuelStation(vm.oAdvance.diesel_info.vendor);

		if(vm.oAdvance && vm.oAdvance.vehicle && vm.oAdvance.vehicle.vehicle_reg_no && vm.showTripForm.autoMap)
			getTrips();
	}

	function onVehicleSelect($item, $model) {
		setAccount();
		setAdvType();
		clearTrip();
		setContraAcc();
		if(vm.advanceDate && vm.showTripForm.autoMap)
			getTrips();
		vm.oAdvance.ccVehicle = vm.oAdvance.vehicle.costCenter;
	}

	function setContraAcc() {
		if (vm.modelDetail.type == 'edit' && vm.oAdvance.voucher && vm.prevSelectedVehicle != vm.oAdvance.vehicle._id) {
			vm.oAdvance.internalAccount = vm.dealAcc.advContraAcc;
		}
	}

	function onVendorSelect() {
		getFuelStation(vm.oAdvance.diesel_info.vendor);
		vm.oAdvance.account_data.from = {};
		setAccount();
		vm.showCategory && setUnsetAccountMasterVendor(vm.oAdvance.category);
	}

	function setAmount(liter) {
		let amt;
		if ((amt = Math.round(liter * vm.oAdvance.diesel_info.rate * 100) / 100) > $scope.$constants.advanceAmount) {
			swal('warning', "Amount Can't be grater than 2 Lakh", 'warning');
			return;
		}
		vm.oAdvance.amount = amt;
	}

	function setAmountRate(rate) {
		if (rate > 100) {
			swal('warning', "Rate can't be that high", 'warning');
		} else if (rate < 50) {
			swal('warning', "Rate can't be that low", 'warning');
		}

		let amt;
		if ((amt = Math.round(vm.oAdvance.amount * 100) / 100) > 100000) {
			swal('warning', "Amount Can't be grater than 1 Lakh", 'warning');
			return;
		}

		vm.oAdvance.amount = amt;
	}

	function setUnsetAccountMasterVendor(type) {

		vm.oAdvance.account_data = vm.oAdvance.account_data || {};

		if (!type) {
			vm.oAdvance.account_data = {};
			return;
		}

		let index;

		try {

			if (vm.oAdvance.vehicle.ownershipType == 'Market')
				index = 1;
			else
				index = 0;

		} catch (e) {
			index = 0;
		}

		vm.aToAccount = [];
		vm.aFromAccount = [];

		let expenseTypeConfig = (vm.aCatagory || vm.aAdvanceType).find(o => o.name === type);
		if (!expenseTypeConfig) {
			swal('', 'Account config not found!', 'error');
			return;
		}

		if (!Array.isArray(expenseTypeConfig.a1) && expenseTypeConfig.a1 && expenseTypeConfig.a1.substr(0, 1) === '$') {
			if (!vm.accounts[expenseTypeConfig.a1]) {
				// swal('Error', expenseTypeConfig.a1.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aFromAccount.push(vm.accounts[expenseTypeConfig.a1]);
			vm.oAdvance.account_data.from = (vm.accounts[expenseTypeConfig.a1] && vm.accounts[expenseTypeConfig.a1]._id) ? vm.accounts[expenseTypeConfig.a1] : undefined;
			vm.aFromGroup = [];
		} else {
			vm.aFromGroup = Array.isArray(expenseTypeConfig.a1) ? expenseTypeConfig.a1 : [expenseTypeConfig.a1];
			// getAccount('aFromAccount', vm.aFromGroup = Array.isArray(expenseTypeConfig.a1) ? expenseTypeConfig.a1 : [expenseTypeConfig.a1]);
		}

		let expConfigA2 = Array.isArray(expenseTypeConfig.a2) ? expenseTypeConfig.a2[index] : expenseTypeConfig.a2;

		if (expConfigA2 && expConfigA2.substr(0, 1) === '$') {
			if (!vm.accounts[expConfigA2]) {
				// swal('Error', expConfigA2.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aToAccount.push(vm.accounts[expConfigA2]);
			vm.oAdvance.account_data.to = (vm.accounts[expConfigA2] && vm.accounts[expConfigA2]._id) ? vm.accounts[expConfigA2] : undefined;
			vm.aToGroup = [];
			vm.oAdvance.person = vm.oAdvance.account_data.to.name;
			if($scope.$configs && $scope.$configs.tripAdv && $scope.$configs.tripAdv.driverDetails) {
				vm.oAdvance.person = vm.aTrip && vm.aTrip.length && vm.aTrip[0].driver && vm.aTrip[0].driver.name || vm.oAdvance.vehicle &&  vm.oAdvance.vehicle.driver_name;
				vm.oAdvance.driverCode = vm.aTrip && vm.aTrip.length && vm.aTrip[0].driver && vm.aTrip[0].driver.employee_code  || vm.oAdvance.vehicle &&  vm.oAdvance.vehicle.driver_employee_code;

			}
		} else {
			vm.aToGroup = [expConfigA2];
			// getAccount('aToAccount', vm.aToGroup = [expConfigA2]);
		}
	}

	function submit(formData) {

		if(!vm.aAdvance.length)
			return swal('Error', 'Please add atleast on advance', 'error');

		if(!formData.$valid){
			return swal('', 'All Mandatory Field are not Filled', 'error');
		}

		if($scope.$configs.costCenter && $scope.$configs.costCenter.show) {
			if(!vm.oAdvance.ccVehicle)
				return swal("Error", 'Cost Center not linked on vehicle', "error");
		}

		let aReqAdv = [];
		let error = false;
		vm.aAdvance.forEach(oAdvance => {
			oAdvance.vehicle = angular.copy(vm.oAdvance.vehicle);
			oAdvance.branch = angular.copy(vm.oAdvance.branch);
			oAdvance.date = angular.copy(vm.oAdvance.date);
			oAdvance.reference_no = angular.copy(vm.oAdvance.reference_no);

			if($scope.$configs.costCenter && $scope.$configs.costCenter.show && !oAdvance.ccBranch)
				return swal("Error", 'Advance Cost Center not Linked', "error");

			if (oAdvance.advanceType == 'Diesel' && !oAdvance.diesel_info.rate) {
				error = 'No Rate Selected';
			}

			if (oAdvance.date)
				oAdvance.date = moment(oAdvance.date, 'DD/MM/YYYY').toISOString();

			// if (oAdvance.advanceType === 'Diesel' && vm.showInEdit) {
			// 	let diesel_info = vm.selectedAdv.diesel_info || vm.selectedAdv.dieseInfo;
			// 	if (oAdvance.diesel_info.litre !== diesel_info.litre && oAdvance.diesel_info.rate !== diesel_info.rate) {
			// 		error = 'Both Rate and Liter cannot be modified';
			// 	}
			// }

			if (oAdvance.advanceType === 'Diesel' && oAdvance.amount > $scope.$constants.maxAdvanceDieselAmount)
				error = `Advance amount cannot be greater than ${$scope.$constants.maxAdvanceDieselAmount}`;

			vm.selectedTrip = vm.selectedTrip || {};
			let vehicle = vm.selectedTrip && vm.selectedTrip.vehicle || oAdvance.vehicle;

			if (vm.mandatory.vehicle && !vehicle) {
				error = 'Please Provide Vehicle';
			}

			let request = {
				...oAdvance,
				vehicle: angular.copy(vm.oAdvance.vehicle._id),
				vehicle_no: angular.copy(vm.oAdvance.vehicle.vehicle_reg_no),
				branch: angular.copy(vm.oAdvance.branch._id),
				date: moment(vm.oAdvance.date, 'DD/MM/YYYY').toISOString(),
				reference_no: angular.copy(vm.oAdvance.reference_no),
				account_data: {
					from: oAdvance.account_data.from._id,
					to: oAdvance.account_data.to._id
				},
				dieseInfo: oAdvance.diesel_info,
				trip: vm.selectedTrip._id,
				trip_no: vm.selectedTrip.trip_no,
			};

			if (request.internalAccount)
				request.internalAccount = request.internalAccount._id;

			if (request.to_account || (request.account_data && request.account_data.to))
				request.to_account = request.account_data.to;

			if (request.from_account || (request.account_data && request.account_data.from))
				request.from_account = request.account_data.from;

			if (vehicle) {
				request.vehicle = vehicle._id;
				request.vehicle_no = vehicle.vehicle_reg_no;
			}

			if (oAdvance.branch)
				request.branch = oAdvance.branch._id;

			if (vm.selectedTrip.vendor && vm.selectedTrip.vendor._id)
				request.vendor = vm.selectedTrip.vendor._id;

			if (vm.selectedTrip.driver && vm.selectedTrip.driver._id)
				request.driver = vm.selectedTrip.driver._id;

			if (oAdvance.advanceType === 'Driver Cash')
				request.narration = 'Being Cash Paid; ' + narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
					tripNo: vm.selectedTrip && vm.selectedTrip.trip_no
				});
			if (oAdvance.advanceType === 'Happay' || oAdvance.advanceType === 'Fastag')
				request.narration = narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
					tripNo: vm.selectedTrip && vm.selectedTrip.trip_no
				});

			if (oAdvance.advanceType === 'Diesel') {
				request.narration = oAdvance.diesel_info.litre + ' lit@ ' + oAdvance.diesel_info.rate;
				let foundVeh = narrationService({vehicleNo: vehicle && vehicle.vehicle_reg_no});
				if(foundVeh)
					request.narration = request.narration + '; ' + 	foundVeh;

				request.diesel_info = {
					...oAdvance.diesel_info,
					vendor: oAdvance.diesel_info.vendor._id
				};
			} else {
				delete request.diesel_info;
			}

			// request.narration = oAdvance.remark ? request.narration + '; ' +  oAdvance.remark : request.narration ;

			if (vm.selectedRefNo && vm.selectedRefNo.bookNo === oAdvance.reference_no)
				request.stationaryId = vm.selectedRefNo._id;
			else
				delete request.stationaryId;

			let reqStationary = false;
			if($scope.$configs.tripAdv && $scope.$configs.tripAdv.advType)
				reqStationary = $scope.$configs.tripAdv.advType.indexOf(oAdvance.advanceType) != -1;

			if(reqStationary && $scope.$configs.tripAdv && $scope.$configs.tripAdv.branch)
				reqStationary = !($scope.$configs.tripAdv.branch.indexOf(vm.oAdvance.branch && vm.oAdvance.branch.name) != -1);


			if(reqStationary){
				if(!request.stationaryId)
					error = 'Invalid Selected Ref No';
			}

			aReqAdv.push(request);
		});

		if(error)
			return swal('Error', error, 'error');

		callback(aReqAdv)
			.then(function (res) {
				if (vm.dataPreserve && vm.showInAdd) {
					preserveData();
				} else {
					$uibModalInstance.close(res);
				}
			})
			.catch(function (err) {
				console.log(err);
			});
	}

	function preserveData() {
		vm.oAdvance.reference_no = undefined;
		vm.oAdvance.bill_no = undefined;
		vm.oAdvance.amount = 0;
		if (vm.oAdvance.diesel_info.litre)
			vm.oAdvance.diesel_info.litre = 0;
	}

	function tableRowClick() {
		if (vm.selectedTrip.length) {
			vm.selectedTrip = vm.selectedTrip[0];
		}
		setAccount();
		setAdvType();
		vm.showInAdd && (vm.oAdvance.advanceType = null);
		vm.showInAdd && setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function generateRemark() {
		vm.oAdvance.narration = vm.oAdvance.diesel_info.litre + ' lit@ ' + vm.oAdvance.diesel_info.rate;
	}

	function setAccount() {
		vm.accounts = {
			'$vendor': false,
			'$vehicle': /*vm.oAdvance.account_data.to || */vm.oAdvance.vehicle && vm.oAdvance.vehicle.account || false,
			'$fvendor': {},
			"$happayAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.hpAcc || {},
			"$fastagAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.ftAcc || {},
			"$dieselAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.dlAcc || {},
			"$driverCAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.drAcc || {},
			"$chalanAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.chAcc || {},
			"$shortageAcc": $scope.$configs.costCenter && $scope.$configs.costCenter.stAcc || {}
		};

		if (vm.selectedTrip && vm.selectedTrip.vendor)
			vm.accounts.$vendor = {
				_id: vm.selectedTrip.vendorDeal.lorryAc && vm.selectedTrip.vendorDeal.lorryAc.id,
				name: vm.selectedTrip.vendorDeal.lorryAc && vm.selectedTrip.vendorDeal.lorryAc.name
			}; //vm.selectedTrip.vendor.account || false;

		if (vm.oAdvance.diesel_info && vm.oAdvance.diesel_info.vendor && vm.oAdvance.diesel_info.vendor.account && vm.oAdvance.diesel_info.vendor.account._id)
			vm.accounts.$fvendor = vm.oAdvance.diesel_info.vendor.account;
		else if (vm.oAdvance.diesel_info && vm.oAdvance.diesel_info.vendor && vm.oAdvance.diesel_info.vendor.account)
			vm.accounts.$fvendor = vm.oAdvance.account_data.from;

		if (vm.oAdvance.advanceType && vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
		else if (vm.showCategory && vm.oAdvance.category)
			setUnsetAccountMasterVendor(vm.oAdvance.category);
		else if (vm.oAdvance.advanceType && vm.showInEdit)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function validateAmount(amt) {
		if (Number(amt) > $scope.$constants.advanceAmount) {
			swal('Warning', 'Amount Should Be Less Than 2 Lakh', 'warning');
			vm.oAdvance.amount = 200000;
			return;
		}
	}

	function setAdvType() {

		let ownerShipType = vm.selectedTrip && vm.selectedTrip.ownershipType || (vm.selectedTrip.vehicle && vm.selectedTrip.vehicle.ownershipType);

		if (!ownerShipType)
			ownerShipType = vm.oAdvance && vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType;

		vm.aAdvanceType = ($scope.$configs.master.expenseObj || $scope.$constants.expenseObj || []).filter(o => {
			return o.c === 'n' && ((ownerShipType === 'Market') ? true : !(o.name.toString().indexOf('Vendor') + 1));
		}).filter(o => {
			if(!vm.aAdvance.length)
				return true;

			return !vm.aAdvance.find(a => a.advanceType === o.name);
		});
	}
}

function tripPerfBuiltyRendorCtrl($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService){
	$scope.aTemplate = clientConfig.getFeature('TripPerformance', 'tripPerformanceTemplate') ? clientConfig.getFeature('TripPerformance', 'tripPerformanceTemplate') : [];

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.tripPerformanceBuilty(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR($scope.aTemplate[0].key);
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR($scope.aTemplate[0].key);
	}

	$scope.printDiv = function (elem) {
		var contents = document.getElementById(elem).innerHTML;
		var frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('<html><head><title></title>');
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(contents);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function () {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
	};
}
