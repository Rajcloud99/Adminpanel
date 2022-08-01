materialAdmin.controller('grUpserController', grUpsertController);

grUpsertController.$inject = [
	'$modal',
	'$parse',
	'$scope',
	'$stateParams',
	'$localStorage',
	'billBookService',
	'billingPartyService',
	'branchService',
	'CustomerRateChartService',
	'confService',
	'consignorConsigneeService',
	'customer',
	'DatePicker',
	'dateUtils',
	'formulaEvaluateFilter',
	'materialService',
	'otherUtils',
	'stateDataRetain',
	'tripServices',
	'Vehicle',
	'incentiveService',
	'cityStateService',
	'dphService'
];

function grUpsertController(
	$modal,
	$parse,
	$scope,
	$stateParams,
	$localStorage,
	billBookService,
	billingPartyService,
	branchService,
	CustomerRateChartService,
	confService,
	consignorConsigneeService,
	customer,
	DatePicker,
	dateUtils,
	formulaEvaluateFilter,
	materialService,
	otherUtils,
	stateDataRetain,
	tripServices,
	Vehicle,
	incentiveService,
	cityStateService,
	dphService
) {
	let vm = this;

	// function identifier
	vm.calculateIncentive = calculateIncentive;
	vm.calculateRate = calculateRate;
	vm.calDuration = calDuration;
	vm.clearIncentive = clearIncentive;
	vm.calday = calday;
	vm.calDetentionFormula  = calDetentionFormula;
	vm.calDetentionAmt  = calDetentionAmt;
	vm.calDetentionDayWise  = calDetentionDayWise;
	vm.calDetentionDayWiseAmt  = calDetentionDayWiseAmt;
	vm.getConsignee = getConsignee;
	vm.getConsignor = getConsignor;
	vm.getBillingParty = getBillingParty;
	vm.getSuppIncentive = getSuppIncentive;
	vm.updateIncentive = updateIncentive;
	vm.clearSuppIncentive = clearSuppIncentive;
	vm.calculateGst = calculateGst;
	vm.getCustomers = getCustomers;
	vm.getBillBookNo = getBillBookNo;
	vm.getAllBranch = getAllBranch;
	vm.getVname = getVname;
	vm.getRates = getRates;
	vm.getDPH= getDPH;
	vm.getexpirydate= getexpirydate;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.SelectRateChart = SelectRateChart;
	vm.setPaymentBasis = setPaymentBasis;
	vm.updateInvoiceMaterialObj = updateInvoiceMaterialObj;
	vm.getRoute = getRoute;
	vm.getARBranch = getARBranch;
	vm.getDPHRate = getDPHRate;
	vm.submit = submit;
	vm.setTime = setTime;
	vm.getGstType = getGstType;
	vm.aStates = otherUtils.getState();

	(function init() {

		if($scope.$configs.GR.config)
			vm.__FormList = $scope.$configs.GR.config;

		vm.arMaxDate = new Date(new Date().setDate(new Date(new Date()).getDate() + 7));
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.aHours = [];
		vm.aMinutes = [];

		for (let h = 0; h < 24; h++)
		vm.aHours.push(h);

		for (let m = 0; m < 60; m++)
		vm.aMinutes.push(m);

		vm.gateOuthourSel = new Date().getHours();
		vm.gateOutminuteSel = new Date().getMinutes();
		vm.gatePasshourSel = new Date().getHours();
		vm.gatePassminuteSel = new Date().getMinutes();

		vm.material = {};
		vm.aGstType = ['IGST', 'CGST & SGST'];
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
		vm.__RateChart = $scope.$constants.modelConfigs.RATE_CHART;
		vm.DatePicker = angular.copy(DatePicker);
		vm.selectMaterialEvents = {
			onSelectionChanged: function () {}
		};

		if ($stateParams.data) {
			 // getGrById( $stateParams.data && $stateParams.data.gr);
			vm.selectedGr = angular.copy($stateParams.data && $stateParams.data.gr);
			vm.mode = $stateParams.data && $stateParams.data.mode && $stateParams.data.mode.toLowerCase();

			if (vm.selectedGr.trip && vm.selectedGr.trip._id)
				getTrip(vm.selectedGr.trip._id);

		} else {
			stateDataRetain.back('booking_manage.myGR');
			return;
		}

		// some basic operation based on mode the state is rendered
		getFormList();

		if (vm.mode === 'add' || vm.mode === 'edit') {
			vm.selectedGr.customer = vm.selectedGr.customer;
			vm.selectedGr.billingParty = vm.selectedGr.billingParty;
			vm.selectedGr.consignor = vm.selectedGr.consignor || vm.selectedGr.consigner;
			vm.selectedGr.invoices = Array.isArray(vm.selectedGr.invoices) ? vm.selectedGr.invoices : [];
			vm.selectedGr.eWayBills = Array.isArray(vm.selectedGr.eWayBills) ? vm.selectedGr.eWayBills : [];
			vm.selectedGr.detention = vm.selectedGr.loadingDetention || 0;
			vm.selectedGr.payment_type = vm.selectedGr.payment_type;
			vm.selectedGr.payment_basis = vm.selectedGr.payment_basis;
			// if(vm.selectedGr.branch && typeof vm.selectedGr.branch === 'object' && vm.selectedGr.branch._id)
			// 	vm.selectedGr.branch = vm.selectedGr.branch._id;

			if(typeof vm.selectedGr.container != 'string')
				vm.selectedGr.container = '';


			vm.selectedGr.branch = vm.selectedGr.branch || {};
			vm.selectedGr.deduction = vm.selectedGr.deduction || {};
			vm.selectedGr.charges = vm.selectedGr.charges || {};
			vm.selectedGr.pod = vm.selectedGr.pod || {};

			if (vm.selectedGr.pod.date)
				vm.selectedGr.pod.date = new Date(vm.selectedGr.pod.date);

			if (vm.selectedGr.pod.unloadingArrivalTime) {
				vm.selectedGr.pod.unloadingArrivalTime = new Date(vm.selectedGr.pod.unloadingArrivalTime);
				vm.unloadingArrivalTimeModel = new Date();
				vm.unloadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.unloadingArrivalTimeModel, vm.selectedGr.pod.unloadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingLoadingTime) {
				vm.selectedGr.pod.billingLoadingTime = new Date(vm.selectedGr.pod.billingLoadingTime);
				vm.billingLoadingTimeModel = new Date();
				vm.billingLoadingTimeModel = dateUtils.setHoursFromDate(vm.billingLoadingTimeModel, vm.selectedGr.pod.billingLoadingTime);
			}

			if (vm.selectedGr.pod.loadingArrivalTime) {
				vm.selectedGr.pod.loadingArrivalTime = new Date(vm.selectedGr.pod.loadingArrivalTime);
				vm.loadingArrivalTimeModel = new Date();
				vm.loadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.loadingArrivalTimeModel, vm.selectedGr.pod.loadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingUnloadingTime) {
				vm.selectedGr.pod.billingUnloadingTime = new Date(vm.selectedGr.pod.billingUnloadingTime);
				vm.billingUnloadingTimeModel = new Date();
				vm.billingUnloadingTimeModel = dateUtils.setHoursFromDate(vm.billingUnloadingTimeModel, vm.selectedGr.pod.billingUnloadingTime);
			}

			if($scope.$configs.GR && $scope.$configs.GR.multiDetention && $scope.$configs.GR.multiDetention.cust === vm.selectedGr.customer._id) {
				calDetentionDayWise();
			}

			if (vm.selectedGr.grDate)
				vm.selectedGr.grDate = new Date(vm.selectedGr.grDate);
			if (vm.selectedGr.gateoutDate)
				vm.selectedGr.gateoutDate = new Date(vm.selectedGr.gateoutDate);
			if(vm.selectedGr && vm.selectedGr.gateoutDate)
				getDPHRate(vm.selectedGr.gateoutDate);

			if(vm.selectedGr.trip && vm.selectedGr.trip.imd && vm.selectedGr.trip.imd.length && vm.selectedGr.trip.rName){
				vm.imd = vm.selectedGr.trip && vm.selectedGr.trip.imd;

				let route = vm.selectedGr.trip.rName.split(' to ').map(o => o.trim());
				vm.ldCode = vm.selectedGr.trip.ld && vm.selectedGr.trip.ld.code;
				vm.uldCode = vm.selectedGr.trip.uld && vm.selectedGr.trip.uld.code;
				vm.imd.splice(0, 0, {c:route[0], code:vm.ldCode, exitDate: vm.selectedGr.trip.start_date})
				vm.imd.splice(vm.imd.length, 0, {c:route[1],code:vm.uldCode,entryDate: vm.selectedGr.trip.end_date})
			}


			// init function in form editable mode only
			// getAllBranch();
			getAllBranch();
			getMaterialGroup();
			// getRates();
		}

		if (vm.mode === 'add') {
			// let route = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
			vm.selectedGr.acknowledge = vm.selectedGr.acknowledge || {};
			if($scope.$configs.booking && $scope.$configs.booking.showRoute && vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source) {
				vm.selectedGr.acknowledge.source = vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source;
			  } else {
				vm.selectedGr.acknowledge.source = vm.selectedGr.route && vm.selectedGr.route.source && vm.selectedGr.route.source.c;
			  }
			  if($scope.$configs.booking && $scope.$configs.booking.showRoute && vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination) {
				vm.selectedGr.acknowledge.destination = vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination;
			  } else {
				vm.selectedGr.acknowledge.destination = vm.selectedGr.route && vm.selectedGr.route.destination && vm.selectedGr.route.destination.c;
			  }
			if(vm.selectedGr.trip.rName && !(vm.selectedGr.acknowledge.source && vm.selectedGr.acknowledge.destination) ){
				let route = vm.selectedGr.trip.rName.split(' to ').map(o => o.trim());
				vm.selectedGr.acknowledge.source = route[0];
				vm.selectedGr.acknowledge.destination = route[1];
			}
			vm.selectedGr.acknowledge.destinationState = vm.selectedGr.consignee ? vm.selectedGr.consignee.state : undefined;
			vm.selectedGr.acknowledge.routeDistance = vm.selectedGr.route && vm.selectedGr.route.route_distance;
			vm.gstPercentToApply = vm.selectedGr.billingParty && vm.selectedGr.billingParty.percent || '0';
			vm.selectedGr.payment_type = $scope.$constants.paymentType[1];
			getGstType();
			if (vm.selectedGr.consignee && vm.selectedGr.consignee.state) {
				vm.aStates.find(o => {
					if ((o.state).toLowerCase() == (vm.selectedGr.consignee.state).toLowerCase()) {
						vm.selectedGr.acknowledge.destinationState = o.state;
						return;
					}
				});
			}
		}

		if (vm.mode === 'edit') {
			if(vm.selectedGr && vm.selectedGr.trip && vm.selectedGr.trip.route_name && vm.selectedGr.acknowledge) {
				let [src, dest] = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
			vm.selectedGr.acknowledge.source = vm.selectedGr.acknowledge.source ? vm.selectedGr.acknowledge.source:src;
			vm.selectedGr.acknowledge.destination = vm.selectedGr.acknowledge.destination ? vm.selectedGr.acknowledge.destination:dest;
			}
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(obj => {
					if (obj.baseValueLabel) {
						obj.aCapacity = [];
						obj.aCapacity.push({label: obj.baseValueLabel, baseVal: obj.baseValue, rate: obj.rate});
					}
				})
			}

			vm.selectedGr.vehicle2 = vm.selectedGr.vehicle2;
			vm.gstPercentToApply = String(vm.selectedGr.iGST_percent || (vm.selectedGr.cGST_percent + vm.selectedGr.sGST_percent) || '0');
			if (vm.selectedGr.iGST_percent)
				vm.gstPercentType = 'IGST';
			else if (vm.selectedGr.cGST_percent || vm.selectedGr.sGST_percent)
				vm.gstPercentType = 'CGST & SGST';

			if (vm.selectedGr.grNumber) {
				if (vm.selectedGr.stationaryId) {
					vm.grNumberModel = {
						bookNo: vm.selectedGr.grNumber,
						_id: vm.selectedGr.stationaryId
					}
				} else {
					vm.grNumberModel = vm.selectedGr.grNumber;
				}
			}
			if (vm.selectedGr.grDate)
				calday();


			// vm.firstCall = true;
			setPaymentBasis();
		}

		// calculateIncentive();

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.charges.detentionLoading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.supplementaryBill.charges.detentionLoading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.charges.detentionUnloading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.supplementaryBill.charges.detentionUnloading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		// setting form view mode i.e. to preview(readonly) to edit/add(editable)
		if($scope.$configs.GR.grAck && vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.status && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if (vm.selectedGr.fpa && vm.selectedGr.fpa.vch && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.mode == 'edit') {
			vm.supplyReadonly = false;
			vm.readonly = true;
		} else if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = false;
			vm.isReadonly = false;
		} else {
			switch (vm.mode) {
				case 'add':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				case 'edit':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				default:
					vm.readonly = true;
					vm.supplyReadonly = true;
					vm.isReadonly = true;
					break;
			}
		}

		applyCss();
	})();

	/*
	* Fetch RateChart on both case add/edit
	* Add -
	* if single RateChart
	* show that rate only
	* capacity dropdown = baselabel + config.aCapacity
	* else if multiple RateChart
	* capacity dropdown = baselabel + config.aCapacity
	*
	* Edit -
	* */


	// Actual Function

	// async function getGrById(viewValue) {
	//
	// 	let request = {
	// 		_id: viewValue._id,
	// 		skip: 1,
	// 		no_of_docs: 5,
	// 		populate: ["provisionalBill"],
	// 		source: "GR"
	// 	};
	//
	// 	 await tripServices.getAllGRItem(request, onSuccess, onFailure);
	//
	// 	// Handle failure response
	// 	function onFailure(response) {
	// 		console.log(response);
	//
	// 	}
	//
	// 	// Handle success response
	// 	function onSuccess(response) {
	// 		vm.selectedGr = response.data.data.data[0];
	// 	}
	// }


	vm.onBranchSelectEvents = {
		onSelectionChanged: function () {
			vm.grNumberModel = undefined;
		}
	};

	function applyCss() {
		setTimeout(() => {
			$('.form-wrapper').find('label, .label').removeClass('req');
			$('.form-wrapper').find('[required]').parents('.form-group').find('label, .label').addClass('req');
		}, 2000);
	}

	function calday() {
		vm.loadingMinDate = dateUtils.addDate(vm.selectedGr.grDate, -15);
	}

	function getDPHRate() {
		if(vm.selectedGr.customer && vm.selectedGr.customer._id && vm.selectedGr.gateoutDate && vm.__FormList && vm.__FormList.dphRate && vm.__FormList.dphRate.visible) {
			var request = {};
			request.to = moment(vm.selectedGr.gateoutDate).startOf('day').toDate();
			request.customer = vm.selectedGr.customer._id;
			dphService.get(request, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				swal('Error!', 'Message not defined', 'error');
			}

			// Handle success response
			function onSuccess(response) {
				let res = response && response.data && response.data.data;
				// vm.selectedGr.invoices.forEach((obj,i) =>{
				if(!(vm.selectedGr.invoices && vm.selectedGr.invoices[0])){
					vm.selectedGr.invoices[0]= {};
				}
				vm.selectedGr.invoices[0].dphRate = res[0].hike;
				// })

			}
		}
	}

	function calculateIncentive(buttonClicked = false) {

		if (!(vm.__FormList && vm.__FormList.incentive && vm.__FormList.incentive.visible)) {
			vm.incentivePercent = 0;
			return;
		}

		if (buttonClicked) {
			vm.incentiveButtonClicked = true;
			getRates();
		}
	}

	function calculateRate(oInvoice) {

		if (oInvoice.dummyCapacityObj) {
			oInvoice.baseValueLabel = oInvoice.dummyCapacityObj.label;
			oInvoice.capacity = oInvoice.dummyCapacityObj.baseVal || 0;
		}

		if (!oInvoice.aRateChart)
			return;

		let baseValToCheck;

		try {
			if (vm.__FormList.capacity.visible)
				baseValToCheck = oInvoice.capacity;
			else
				baseValToCheck = oInvoice.noOfUnits || 0;

		} catch (e) {
			baseValToCheck = oInvoice.noOfUnits || 0;
		}

		if (typeof baseValToCheck === 'undefined')
			return false;

		setPaymentBasis();

		let aRateChart = oInvoice.aRateChart || [];
		let foundRateChart;
		let foundRate;

		aRateChart.find(rateChart => {

			if (!Array.isArray(rateChart.baseRate) || !rateChart.baseRate.length) {

				if (baseValToCheck <= rateChart.baseValue) {
					foundRate = {
						baseVal: rateChart.baseValue,
						rate: rateChart.rate,
						baseValLabel: rateChart.baseValueLabel
					};
				}

			} else {
				foundRate = rateChart.baseRate.find(oRate => {
					if (baseValToCheck <= oRate.baseVal)
						return true;
					return false
				});
			}

			if (!foundRate)
				return false;

			foundRateChart = rateChart;
			return true
		});

		if (!foundRateChart && !foundRate && aRateChart[0]) {
			foundRateChart = aRateChart.slice(-1)[0];

			if (Array.isArray(foundRateChart.baseRate) && foundRateChart.baseRate.length)
				foundRate = foundRateChart.baseRate.slice(-1)[0];
			else {
				foundRate = {
					baseVal: foundRateChart.baseValue,
					rate: foundRateChart.rate,
					baseValLabel: foundRateChart.baseValueLabel
				};
			}

		}

		if (oInvoice && foundRateChart && foundRate)
			applyRates(oInvoice, foundRateChart, foundRate);
	}

	function calDuration(invoice, index){
		if(invoice.ref1 && invoice.ref2 && vm.imd && vm.imd.length){
			let src = vm.imd.find(o=> o.code === invoice.ref1)
			let dst = vm.imd.find(o=> o.code === invoice.ref2)

			// if(src && dst && src.exitDate && dst.entryDate) {
			// 	dst.entryDate = new Date(dst.entryDate).getTime();
			// 	src.exitDate = new Date(src.exitDate).getTime();
			// 	var diffMs = (dst.entryDate - src.exitDate) ;       // milliseconds between from & to
			// 	var hours = Math.floor(diffMs / 36e5),           // hours
			// 		minutes = Math.floor(diffMs % 36e5 / 60000), // minutes
			// 		seconds = Math.floor(diffMs % 60000 / 1000); // seconds
			// 	invoice.ref3 = hours + ":" + minutes + ":" + seconds;
			// }else {
			// 	invoice.ref3 = 0;
			// }

			if(src && dst && src.exitDate && dst.entryDate) {
				dst.entryDate = new Date(dst.entryDate).getTime();
				src.exitDate = new Date(src.exitDate).getTime();
				var diffMs = (dst.entryDate - src.exitDate) ;       // milliseconds between from & to
				var hours = Math.floor(diffMs / 36e5),           // hours
					minutes = Math.floor(diffMs % 36e5 / 60000), // minutes
					seconds = Math.floor(diffMs % 60000 / 1000); // seconds
				//for hours
				if(hours){
					if(hours.toString().length <2) {
						hours = '0' + hours;
					}
				}else {
					hours = '00';
				}
				//for minutes
				if(minutes){
					if(minutes.toString().length <2) {
						minutes = '0'+ minutes;
					}
				}else {
						minutes = '00';
					}
				//for seconds

				if(seconds) {
					if(seconds.toString().length <2){
						seconds = '0' + seconds;
					}
				}else {
					seconds = '00';
				}


				invoice.ref3 = hours + ":" + minutes + ":" + seconds;
			}else {
				invoice.ref3 = '00:00:00' ;
			}
		}
	}

	function setTime(date) {
		vm.selectedGr.grDate = new Date((date).setHours(0, 0, 0));
	}

	vm.onSelect = function (item, model, lable) {
		if (item.state) {
			vm.aStates.find(o => {
				if ((o.state).toLowerCase() == (item.state).toLowerCase()) {
					vm.selectedGr.acknowledge.destinationState = o.state;
					return;
				}
			});
		}
	};
	function getexpirydate(){

		if(vm.selectedGr.eWayBills.length==0){
			vm.selectedGr.eWayBills.push({});
		}
		else{
		vm.selectedGr.eWayBills.push({expiry: vm.selectedGr.eWayBills[0].expiry});
		}

};

	function getGstType() {
		// if(!vm.selectedGr.billingParty){
		// 		swal('Warning', 'No BillingParty Selected!!!!!', 'warning');
		// 		return;
		// }
		// if(($scope.$clientConfigs.gstin_no.substr(0, 2) === vm.selectedGr.billingParty.state_code ) || ($scope.$clientConfigs.gstin_no.substr(1, 1) === vm.selectedGr.billingParty.state_code)) {
		if (vm.gstPercentType == 'CGST & SGST') {
			vm.selectedGr.cGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.sGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.iGST_percent = 0;

		} else if(vm.gstPercentType ===  'IGST'){
			vm.selectedGr.iGST_percent = vm.gstPercentToApply;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		} else {
			vm.gstPercentToApply = 0
			vm.selectedGr.iGST_percent = 0;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		}

	}

	function clearIncentive() {

		vm.selectedGr.charges.incentive = 0;
		typeof vm.watcherClearer === 'function' && vm.watcherClearer();

	}

	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getBillBookNo(viewValue) {

		if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}

		if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
			return [];

		if (!vm.selectedGr.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.selectedGr.branch && Array.isArray(vm.selectedGr.branch.grBook) && vm.selectedGr.branch.grBook.map(o => o.ref),
				type: 'Gr',
				useDate: moment(vm.selectedGr.grDate).startOf('day').toDate(),
				status: "unused"
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.grNumberModel = response.data[0];
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

	function getBillingParty(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				customer: custId,
				name: viewValue
			};

			// if($scope.$configs.GR.custConfig)
			// 	oFilter.customer = custId;

			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function calculateGst(id) {
		if (!id)
			return swal('error', 'BillingParty Not Selected', 'error');

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				_id: id
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				onBillingPartySelect(response.data[0]);
				resolve(response.data);
			}
		});
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let customerFilter = {
				all: true,
				status: "Active",
				name: viewValue
			};

			customer.getAllcustomers(customerFilter, success);

			function success(data) {
				resolve(data.data);
			}
		});
	}

	function getDPH(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.grDate)
			return;

			getDPHRate(invoice);

	}

	function getRates(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.grDate || !vm.selectedGr.acknowledge || !vm.selectedGr.acknowledge.source || !vm.selectedGr.acknowledge.destination)
			return;

		// fetch rate chart for single invoice
		if (invoice) {
			fetchRateChart(invoice);
		} else {
			//	fetch rete chart for multiple invoices
			Promise.all(vm.selectedGr.invoices.map(invoiceObj => {
				return fetchRateChart(invoiceObj);
			})).then(function () {
				vm.firstCall = false;

			});
			calDetentionFormula();
		}

		function fetchRateChart(invoice) {
			return new Promise(function (resolve, reject) {

				if (!invoice.material || !invoice.material.groupCode)
					return;

				let request = {};

				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
					request.source = vm.selectedGr.acknowledge.source;
				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
					request.destination = vm.selectedGr.acknowledge.destination;
				if (invoice.material && invoice.material.groupCode)
					request.materialGroupCode = invoice.material.groupCode;
				if (vm.selectedGr.customer && vm.selectedGr.customer._id)
					request.customer = vm.selectedGr.customer._id;
				if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
					request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

				function onSuccess(res) {
					invoice.aRateChart = res.data || [];
					if (invoice.aRateChart[0] && invoice.aRateChart[0].baseRate && invoice.aRateChart[0].baseRate.length) {
						invoice.aCapacity = invoice.aRateChart[0].baseRate.filter(o => !!o.baseVal);
					} else {
						invoice.aCapacity = invoice.aRateChart.map(o => ({
							rate: o.rate,
							baseVal: o.baseValue,
							label: o.baseValueLabel
						})).filter(o => !!o.baseVal);
					}

					if (invoice.aRateChart.length === 0) {
						invoice.aCapacity = vm.__FormList.capacity.aValue && vm.__FormList.capacity.aValue.map(o => ({
							rate: invoice.rate || 0,
							baseVal: 0,
							label: o
						})) || {};
					}

					if (invoice.aCapacity.length && !(invoice.dummyCapacityObj && invoice.dummyCapacityObj.label)) {
						invoice.dummyCapacityObj = invoice.aCapacity[0];
						calculateRate(invoice);
					}

					invoice.aRateChart.sort((a, b) => a.baseValue - b.baseValue);

					if (vm.firstCall)
						return resolve();

					calculateRate(invoice);
					calDuration(invoice);
				}

				function onFailure(response) {
					console.log(response);
				}

				CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
			});
		}
	}

	function calDetentionFormula(){
		let lDays = 0, ulDays = 0;
		if(vm.selectedGr.pod && vm.selectedGr.pod.loadingArrivalTime && vm.selectedGr.pod.billingLoadingTime){
			 lDays = dateUtils.calDetentionDays(vm.selectedGr.pod.billingLoadingTime, vm.selectedGr.pod.loadingArrivalTime)
			if($scope.$configs && $scope.$configs.GR && $scope.$configs.GR.detentionFormula && vm.selectedGr.invoices && vm.selectedGr.invoices.length && vm.selectedGr.invoices[0].aRateChart){
				let flag;
				vm.selectedGr.invoices[0].aRateChart.forEach(obj=> {
					if(obj.detentionLoading && obj.detentionLoading.rate && obj.baseValue === lDays){
						vm.selectedGr.loadingDetentionRate = obj.detentionLoading.rate;
						vm.selectedGr.detentionLoading = obj.detentionLoading.rate;
						 flag = true;
					}
				})
				if(!flag){
					vm.selectedGr.loadingDetentionRate = 0;
					vm.selectedGr.detentionLoading = 0;
				}
			}
		}

		if(vm.selectedGr.pod && vm.selectedGr.pod.unloadingArrivalTime && vm.selectedGr.pod.billingUnloadingTime){
			 ulDays = dateUtils.calDetentionDays(vm.selectedGr.pod.billingUnloadingTime, vm.selectedGr.pod.unloadingArrivalTime)
			if($scope.$configs && $scope.$configs.GR && $scope.$configs.GR.detentionFormula && vm.selectedGr.invoices && vm.selectedGr.invoices.length && vm.selectedGr.invoices[0].aRateChart){
				let flag;
				vm.selectedGr.invoices[0].aRateChart.forEach(obj=> {
					if(obj.detentionUnloading && obj.detentionUnloading.rate && obj.baseValue === ulDays){
						vm.selectedGr.unloadingDetentionRate = obj.detentionUnloading.rate;
						vm.selectedGr.detentionUnloading = obj.detentionUnloading.rate;
						 flag = true;
					}
				})
				if(!flag){
					vm.selectedGr.unloadingDetentionRate = 0;
					vm.selectedGr.detentionUnloading = 0;
				}
			}
		}

		calDetentionDayWise();  // for STC
	}

	function calDetentionAmt(){

    if($scope.$configs && $scope.$configs.GR && $scope.$configs.GR.detentionFormula){
		vm.selectedGr.detentionLoading = vm.selectedGr.loadingDetentionRate || 0;
		vm.selectedGr.detentionUnloading = vm.selectedGr.unloadingDetentionRate || 0;
	}else{
		vm.selectedGr.detentionLoading = (vm.selectedGr.loadingDetentionRate * vm.lDays) || 0;
		vm.selectedGr.detentionUnloading = (vm.selectedGr.unloadingDetentionRate * vm.ulDays) || 0;
	}
	}


	function calDetentionDayWise(){
		if($scope.$configs.GR && $scope.$configs.GR.multiDetention && $scope.$configs.GR.multiDetention.cust === vm.selectedGr.customer._id){
			let lDays = 0, ulDays = 0;
			vm.dayWise = true;
			if(vm.selectedGr.pod && vm.selectedGr.pod.loadingArrivalTime && vm.selectedGr.pod.billingLoadingTime)
				lDays = dateUtils.calDetentionDays(vm.selectedGr.pod.billingLoadingTime, vm.selectedGr.pod.loadingArrivalTime)
			if(vm.selectedGr.pod && vm.selectedGr.pod.unloadingArrivalTime && vm.selectedGr.pod.billingUnloadingTime)
				ulDays = dateUtils.calDetentionDays(vm.selectedGr.pod.billingUnloadingTime, vm.selectedGr.pod.unloadingArrivalTime)
			if(lDays || ulDays)
				vm.dayDiff = (lDays > ulDays) ? lDays : ulDays;
		}else {
			vm.dayWise = false;
			vm.dayDiff = 0;
			vm.selectedGr.detentionLoadingD1 = 0;
			vm.selectedGr.detentionLoadingD2 = 0;
			vm.selectedGr.detentionLoadingD3 = 0;
			vm.selectedGr.detentionUnloadingD1 = 0;
			vm.selectedGr.detentionUnloadingD2 = 0;
			vm.selectedGr.detentionUnloadingD3 = 0;
		}
	}


	function calDetentionDayWiseAmt()
	{
		vm.selectedGr.detentionLoading = (vm.selectedGr.detentionLoadingD1 || 0) + (vm.selectedGr.detentionLoadingD2 || 0) + (vm.selectedGr.detentionLoadingD3 || 0);
		vm.selectedGr.detentionUnloading = (vm.selectedGr.detentionUnloadingD1 || 0) + (vm.selectedGr.detentionUnloadingD2 || 0) + (vm.selectedGr.detentionUnloadingD3 || 0);
	}

	function applyRates(oInvoice, foundRate, baseRate) {

		if (baseRate.baseVal)
			vm.selectedGr.acknowledge.baseValue = oInvoice.baseValue = baseRate.baseVal;
		if (baseRate.baseValLabel)
			oInvoice.baseValueLabel = baseRate.baseValLabel;
		if (baseRate.rate)
			vm.selectedGr.acknowledge.rateChartRate = oInvoice.rate = oInvoice.rateChartRate = baseRate.rate;

		if (foundRate.routeDistance)
			vm.selectedGr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.invoiceRate)
			oInvoice.invoiceRate = foundRate.invoiceRate;

		if (foundRate.insurRate)
			oInvoice.insurRate = foundRate.insurRate;

		if (foundRate.grCharges && foundRate.grCharges.rate)
			vm.selectedGr.charges.grCharges = foundRate.grCharges.rate;
		if (foundRate.surCharges && foundRate.surCharges.rate)
			vm.selectedGr.charges.surCharges = foundRate.surCharges.rate;
		if (foundRate.cartageCharges && foundRate.cartageCharges.rate)
			vm.selectedGr.charges.cartageCharges = foundRate.cartageCharges.rate;
		if (foundRate.labourCharges && foundRate.labourCharges.rate)
			vm.selectedGr.charges.labourCharges = foundRate.labourCharges.rate;
		if (foundRate.otherCharges && foundRate.otherCharges.rate)
			vm.selectedGr.charges.other_charges = foundRate.otherCharges.rate;
		if (foundRate.prevFreightCharges && foundRate.prevFreightCharges.rate)
			vm.selectedGr.charges.prevFreightCharges = foundRate.prevFreightCharges.rate;
		// if (foundRate.detentionLoading && foundRate.detentionLoading.rate)
		// 	vm.selectedGr.loadingDetentionRate = foundRate.detentionLoading.rate;
		// if (foundRate.detentionUnloading && foundRate.detentionUnloading.rate)
		// 	vm.selectedGr.unloadingDetentionRate = foundRate.detentionUnloading.rate;
		if (foundRate.discount && foundRate.discount.rate)
			vm.selectedGr.deduction.discount = foundRate.discount.rate;

		// if (foundRate.loading_charges && foundRate.loading_charges.rate)
		// 	vm.selectedGr.charges.loading_charges = foundRate.loading_charges.rate;
		// if (foundRate.unloading_charges && foundRate.unloading_charges.rate)
		// 	vm.selectedGr.charges.unloading_charges = foundRate.unloading_charges.rate;
		if (foundRate.weightman_charges && foundRate.weightman_charges.rate)
			vm.selectedGr.charges.weightman_charges = foundRate.weightman_charges.rate;
		if (foundRate.overweight_charges && foundRate.overweight_charges.rate)
			vm.selectedGr.charges.overweight_charges = foundRate.overweight_charges.rate;
		if (foundRate.advance_charges && foundRate.advance_charges.rate)
			vm.selectedGr.deduction.advance_charges = foundRate.advance_charges.rate;
		if (foundRate.damage && foundRate.damage.rate)
			vm.selectedGr.deduction.damage = foundRate.damage.rate;
		if (foundRate.shortage && foundRate.shortage.rate)
			vm.selectedGr.deduction.shortage = foundRate.shortage.rate;
		if (foundRate.penalty && foundRate.penalty.rate)
			vm.selectedGr.deduction.penalty = foundRate.penalty.rate;
		if (foundRate.extra_running && foundRate.extra_running.rate)
			vm.selectedGr.charges.extra_running = foundRate.extra_running.rate;
		if (foundRate.dala_charges && foundRate.dala_charges.rate)
			vm.selectedGr.charges.dala_charges = foundRate.dala_charges.rate;
		if (foundRate.diesel_charges && foundRate.diesel_charges.rate)
			vm.selectedGr.charges.diesel_charges = foundRate.diesel_charges.rate;
		if (foundRate.kanta_charges && foundRate.kanta_charges.rate)
			vm.selectedGr.charges.kanta_charges = foundRate.kanta_charges.rate;
		if (foundRate.factory_halt && foundRate.factory_halt.rate)
			vm.selectedGr.charges.factory_halt = foundRate.factory_halt.rate;
		if (foundRate.company_halt && foundRate.company_halt.rate)
			vm.selectedGr.charges.company_halt = foundRate.company_halt.rate;
		if (foundRate.toll_charges && foundRate.toll_charges.rate)
			vm.selectedGr.charges.toll_charges = foundRate.toll_charges.rate;
		if (foundRate.green_tax && foundRate.green_tax.rate)
			vm.selectedGr.charges.green_tax = foundRate.green_tax.rate;

		if (foundRate.internal_rate && foundRate.internal_rate.rate)
			vm.selectedGr.internal_rate = foundRate.internal_rate.rate;
		if (foundRate.standardTime && foundRate.standardTime.rate)
			vm.selectedGr.standardTime = foundRate.standardTime.rate;

		vm.selectedGr.payment_basis = oInvoice.paymentBasis = foundRate.paymentBasis;

		if (foundRate.loading_charges && foundRate.loading_charges.rate && vm.__FormList.loading_charges.evalExp){
			let aExp = vm.__FormList.loading_charges.evalExp.map(e => {
				if (e.toString().indexOf('(RC)') + 1)
					return $parse(e.replace('(RC)', ''))(foundRate);
				return e;
			});
			vm.selectedGr.charges.loading_charges = formulaEvaluateFilter(aExp, $scope, 'grUpset');
			if(vm.selectedGr.charges.loading_charges < 0)
				vm.selectedGr.charges.loading_charges = 0;
		}

		if (foundRate.unloading_charges && foundRate.unloading_charges.rate && vm.__FormList.unloading_charges.evalExp){
			let aExp = vm.__FormList.unloading_charges.evalExp.map(e => {
				if (e.toString().indexOf('(RC)') + 1)
					return $parse(e.replace('(RC)', ''))(foundRate);
				return e;
			});
			vm.selectedGr.charges.unloading_charges = formulaEvaluateFilter(aExp, $scope, 'grUpset');
			if(vm.selectedGr.charges.unloading_charges < 0)
				vm.selectedGr.charges.unloading_charges = 0;
		}

		if (foundRate.incentive && foundRate.incentive.rate) {

			switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
				case 'Master': {
					if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !foundRate.incentive || !foundRate.incentive.rate)
						return;

					// Handle failure response
					function onFailure(response) {
						console.log(response);
					}

					// Handle success response
					function onSuccess(response) {
						vm.incentivePercent = (response && response.data && response.data.rate) || 0;
						updateOnFreightChange();
					}

					incentiveService.autosuggest({
						customer: vm.selectedGr.customer._id,
						vehicle: vm.selectedGr.vehicle,
						date: new Date(vm.selectedGr.grDate).toISOString(),
					}, onSuccess, onFailure);

					break;
				}

				default:
					if (!vm.incentiveButtonClicked) {
						vm.incentiveButtonClicked = false;
						return;
					}

					switch (foundRate.incentive.basis) {

						case 'Percent of basic freight':
							vm.incentivePercent = foundRate.incentive.rate;
							updateOnFreightChange();
							break;

						case 'Fixed':
							vm.selectedGr.charges.incentive = foundRate.incentive.rate;
							break;

						default:
							if (typeof vm.selectedGr.incentivePercent != "number")
								return;

							let aExp = vm.__FormList.incentive.evalExp.map(e => {
								if (e.toString().indexOf('(RC)') + 1)
									return $parse(e.replace('(RC)', ''))(foundRate);
								return e;
							});

							vm.selectedGr.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
					}

			}
		}
	}

	function getFormList() {
		let id = false;

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id)
			return;

		if(typeof id === 'object') {
			if (id.configs)
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...id.configs};
		}else
			confService.get(id, function (response) {
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
				calculateIncentive();
			});

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if (!id)
			return;

		if(typeof id === 'object') {
			if (id.configs)
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...id.configs};
		}else
			confService.get(id, function (response) {
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
				applyCss();
			});
	}

	function getRoute (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				vm.aRoute = res.data
				resolve(res.data);
			}, function (err) {
				reject([]);
			});
		});
	}

	// function getRoute(viewValue, projection) {
	// 	if (viewValue.length < 3) return;
	// 	return new Promise(function (resolve, reject) {
    //
	// 		let request = {
	// 			_t: 'autosuggest',
	// 			[projection]: viewValue,
	// 			projection
	// 		};
    //
	// 		// if(vm.selectedGr.customer && vm.selectedGr.customer._id)
	// 		// 	request.customer = vm.selectedGr.customer && vm.selectedGr.customer._id;
    //
	// 		CustomerRateChartService.get(request)
	// 			.then((res) => {
	// 				resolve(res.data);
	// 			})
	// 			.catch(e => reject([]));
	// 	});
	// }

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

	function getARBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {


			let request = {
				name: viewValue
			};

			return new Promise(function (resolve, reject) {

				branchService.getAllBranches(request, oSuc, oFail);

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

	function getMaterialGroup() {
		var materialFilter = {
			all: true
		};

		materialService.getMaterialGroups(materialFilter, success);

		function success(response) {
			vm.aMaterialGroup = response.data;
		}
	}

	function getTrip(tripNo) {
		function success(res) {
			vm.oTrip = res.data.data.data[0];
			vm.nonSelectedGr = {
				totalWeight: 0,
				totalQty: 0,
				freight: 0,
				totalFreight: 0,
			};
			vm.oTrip.gr.forEach((o, i) => {
				if (o._id === vm.selectedGr._id) {
					vm.oTrip.gr[i] = vm.selectedGr;
					return;
				}
				vm.nonSelectedGr.totalFreight += o.totalFreight;
				vm.nonSelectedGr.totalQty += o.invoices.reduce((a, c) => {
					vm.nonSelectedGr.freight += (c.freight || 0);
					vm.nonSelectedGr.totalWeight += (c.billingWeightPerUnit || 0);
					return a + (c.billingNoOfUnits || 0);
				}, 0);
			});
		}

		tripServices.getAllTripsWithPagination({
			_id: tripNo
		}, success);
	}

	function onCustomerSelect(customer) {
		//TODO remove below code
		//******************************************************

		if (customer.configs && customer.configs.GR && customer.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...customer.configs.GR.configs};
		} else
			vm.__FormList = $scope.$configs.GR.config;
		if(customer.configs && customer.configs.RATE_CHART && customer.configs.RATE_CHART.configs){
			vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...customer.configs.RATE_CHART.configs};
		}else
			vm.__RateChartList = $scope.$constants.modelConfigs.RATE_CHART;

		vm.selectedGr.billingParty = undefined;
		//******************************************************

		calculateIncentive();
		applyCss();
		calDetentionDayWise();
	}

	function onBillingPartySelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || vm.gstPercentToApply || '0';

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {

			// todo remove this code
			if (!Array.isArray($scope.$configs.client_allowed)) {
				$scope.logout();
			}

			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId == billingParty.clientId);

			if (user) {
				vm.selectedGr.billingParty.clientName = user.name;
				vm.gstPercentType = billingParty.state_code == user.state_code ? vm.aGstType[1] : vm.aGstType[0];
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}

		getGstType();

		//TODO remove below code
		//******************************************************

		if (billingParty.configs && billingParty.configs.GR && billingParty.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...billingParty.configs.GR.configs};
			// vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...billingParty.configs.RATE_CHART.configs};
		} else
			getFormList();
		//******************************************************

		applyCss();
	}

	function updateInvoiceMaterialObj(invoice, materialObj) {
		invoice.material = {
			groupName: materialObj.name,
			groupCode: materialObj.code,
			groupId: materialObj._id,
			unit: materialObj.unit
		};
	}

	function SelectRateChart(selectedRowIndex) {

		if (!vm.selectedGr.invoices[selectedRowIndex].material.groupCode) {
			swal('warning', "Please Select Material", 'warning');
			return;
		}

		let modalInstance = $modal.open({
			templateUrl: 'views/myGR/addRateChartPopUp.html',
			controller: ['$uibModalInstance', '$timeout', 'otherData', 'lazyLoadFactory', addRateChartPopUpController],
			controllerAs: 'rcVm',
			resolve: {
				otherData: function () {
					return {
						selectedGr: vm.selectedGr,
						selectedInvoice: vm.selectedGr.invoices[selectedRowIndex],
						__RateChart: vm.__RateChartList
					};
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	function setPaymentBasis() {
		vm.selectedGr.invoices.forEach(oInv => {
			oInv.paymentBasis = vm.selectedGr.payment_basis || undefined;
		});
	}

	function getBranch() {
		if ($scope.$aBranch.length > 0) {
			vm.aBranch = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		};
		branchService.getAllBranches(branchFilter, successBranches);

		function successBranches(data) {
			vm.aBranch = data.data;
		}
	}

	function getAllBranch(inputModel) {
		let req = {
			no_of_docs: 10,
		};

		if (inputModel)
			req.name = inputModel;

		if (vm.aUserBranch && vm.aUserBranch.length) {
			req._ids = [];
			vm.aUserBranch.forEach(obj => {
				if (obj.write)
					req._ids.push(obj._id)
			});
			if (!(req._ids && req._ids.length)) {
				return
			} else {
					let flag = false;
					req._ids.forEach(obj=>{
						if(vm.selectedGr.branch._id === obj){
							flag = true;
						}
					});
					if(!flag)
						vm.selectedGr.branch = {};
				req._ids = JSON.stringify(req._ids);
			}
		}

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			if (vm.selectedGr.branch && vm.selectedGr.branch._id && !vm.aBranch.find(o => o._id === vm.selectedGr.branch._id))
				vm.aBranch.unshift(vm.selectedGr.branch);
		}
	}

	function setPodModelTime() {
		vm.loadingArrivalTimeModel && (vm.selectedGr.pod.loadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.loadingArrivalTime, vm.loadingArrivalTimeModel));
		vm.billingLoadingTimeModel && (vm.selectedGr.pod.billingLoadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingLoadingTime, vm.billingLoadingTimeModel));
		vm.unloadingArrivalTimeModel && (vm.selectedGr.pod.unloadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.unloadingArrivalTime, vm.unloadingArrivalTimeModel));
		vm.billingUnloadingTimeModel && (vm.selectedGr.pod.billingUnloadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingUnloadingTime, vm.billingUnloadingTimeModel));
	}

	function getSuppIncentive() {
		return new Promise(function (resolve, reject) {
			let obj = vm.selectedGr.invoices && vm.selectedGr.invoices[0];
			if (!obj.material || !obj.material.groupCode)
				return;

			let request = {};

			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
				request.source = vm.selectedGr.acknowledge.source;
			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
				request.destination = vm.selectedGr.acknowledge.destination;
			if (obj.material && obj.material.groupCode)
				request.materialGroupCode = obj.material.groupCode;
			if (vm.selectedGr.customer && vm.selectedGr.customer._id)
				request.customer = vm.selectedGr.customer._id;
			if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
				request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

			function onSuccess(res) {
				vm.newData = res.data || [];
				if (vm.newData.length) {
					vm.newData = vm.newData[0];
					if (vm.newData.incentive && vm.newData.incentive.rate) {

						switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
							case 'Master': {
								if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !vm.newData.incentive || !vm.newData.incentive.rate)
									return;

								// Handle failure response
								function onFailure(response) {
									console.log(response);
								}

								// Handle success response
								function onSuccess(response) {
									vm.selectedGr.supplementaryBill.incentivePercent = (response && response.data && response.data.rate) || 0;
									updateIncentive();
								}

								incentiveService.autosuggest({
									customer: vm.selectedGr.customer._id,
									vehicle: vm.selectedGr.vehicle,
									date: new Date(vm.selectedGr.grDate).toISOString(),
								}, onSuccess, onFailure);

								break;
							}

							default:

								switch (vm.newData.incentive.basis) {

									case 'Percent of basic freight':
										vm.selectedGr.supplementaryBill.incentivePercent = vm.newData.incentive.rate;
										updateIncentive();
										break;

									case 'Fixed':
										vm.selectedGr.supplementaryBill.charges.incentive = vm.newData.incentive.rate;
										break;

									default:
										if (typeof vm.selectedGr.supplementaryBill.incentivePercent != "number")
											return;

										let aExp = vm.__FormList.suppIncentive.evalExp.map(e => {
											if (e.toString().indexOf('(RC)') + 1)
												return $parse(e.replace('(RC)', ''))(vm.newData);
											return e;
										});

										vm.selectedGr.supplementaryBill.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
								}

						}
					}
				}
			}

			function onFailure(response) {
				console.log(response);
			}

			CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
		});
	}


	function updateIncentive(newVal) {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.supplementaryBill.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.supplementaryBill.charges.incentive = newVal * (vm.selectedGr.supplementaryBill.incentivePercent || 0) / 100;
		});

	}

	function clearSuppIncentive() {
		vm.selectedGr.supplementaryBill.charges.incentive = 0;
		vm.selectedGr.supplementaryBill.incentivePercent = 0;
	}


	function submit(formData) {

		if (vm.selectedGr.invoices.length){

		if (vm.selectedGr.totalFreight < 0)
			return swal('Error', 'Total Freight should be grater than 0', 'error');
		
			let materialFlag=false;
			let paymentBasicFlag=false;
		if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
			vm.selectedGr.invoices.forEach(oInv => {
				if(!oInv.material){
					materialFlag=true;
				}
				if (oInv.paymentBasis !== vm.selectedGr.payment_basis){
					paymentBasicFlag=true;
				}
				
			});
		}
		if(materialFlag)
			return swal('Error', 'Please select Material', 'error');
		if (paymentBasicFlag)
			return swal('Error', 'PaymentBasis should be same for all Item`s', 'error');


		if (vm.__FormList && vm.__FormList.dphRate && vm.__FormList.dphRate.visible)
			vm.selectedGr.invoices[0].dphRate=vm.selectedGr.invoices[0].dphRate?vm.selectedGr.invoices[0].dphRate:0;
		}

		// Client wise validation
		if ((vm.__FormList.eWayBillNum.req || vm.__FormList.eWayBillExp.req) && !vm.selectedGr.container) {

			if (vm.selectedGr.eWayBills.length == 0)
				return swal('Error', 'E-WayBill Expiry and Number are Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].number)
				return swal('Error', 'E-WayBill Number is Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].expiry)
				return swal('Error', 'E-WayBill Expiry is Mandatory', 'error');

			if (vm.selectedGr.eWayBills[0].number) {
				// if (vm.selectedGr.eWayBills[0].number.length < 12)
				// 	return swal('Error', 'E-WayBill Number length should not be less than 12', 'error');
			}
		}
		// Validation END

		if(!vm.grNumberModel)
			return swal('Error', 'Gr Number is Mandatory', 'error');

		if (typeof vm.grNumberModel == 'string' && !vm.selectedGr.invToBill) {
			vm.grNumberModel = vm.grNumberModel.trim();
			// let letterNumber = /^[0-9a-zA-Z]+$/;
			// if(!((vm.grNumberModel).match(letterNumber)))
			// 	return swal('Error', 'Invalid Gr Number', 'error');
			let letterSymbl = /^[^.,]+$/;
			if(!(vm.grNumberModel).match(letterSymbl))
				return swal('Error', 'Gr Number should not contain . or , ' , 'error');
		}

		console.log(formData);

		if (formData.$valid) {

			if(vm.__FormList.customer.req && vm.selectedGr.customer && !vm.selectedGr.customer._id)
				return swal('Error', 'customer is Mandatory', 'error');

			if(vm.__FormList.consignor.req && vm.selectedGr.consignor && !vm.selectedGr.consignor._id)
				return swal('Error', 'consignor is Mandatory', 'error');

			if(vm.__FormList.consignee.req && vm.selectedGr.consignee && !vm.selectedGr.consignee._id)
				return swal('Error', 'consignee is Mandatory', 'error');

			if(vm.__FormList.billingParty.req && vm.selectedGr.billingParty && !vm.selectedGr.billingParty._id)
				return swal('Error', 'billingParty is Mandatory', 'error');


			if (vm.selectedGr.totalFreight > ($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)) {

				return swal('Error', `Bill Amount is cannot be grater than ${($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)}`, 'error')

			} else if (vm.selectedGr.totalFreight > 300000) {
				swal({
						title: 'Bill Amount is Grater Than 3 Lakhs. Are you sure you want to continue?',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: 'rgb(94, 192, 222);',
						confirmButtonText: 'Yes!',
						closeOnConfirm: false
					},
					function (isConfirmU) {
						if (isConfirmU) {
							makeRequest();
						}
					});
			} else {
				makeRequest();
			}

			function makeRequest() {

				// setPodModelTime();
				// if(vm.selectedGr && vm.selectedGr.gateoutDate){
				// 	if(vm.selectedGr.trip){
				// 		vm.selectedGr.trip.start_date=vm.selectedGr.gateoutDate;
				// 	}
				// }

				if(vm.selectedGr && vm.selectedGr.gateoutDate){
					vm.selectedGr.gateoutDate=new Date(new Date(vm.selectedGr.gateoutDate).setHours(vm.gateOuthourSel, vm.gateOutminuteSel));
				}

				if(vm.selectedGr && vm.selectedGr.gatePassDate){
					vm.selectedGr.gatePassDate=new Date(new Date(vm.selectedGr.gatePassDate).setHours(vm.gatePasshourSel, vm.gatePassminuteSel));
				}



				let request = {
					...vm.selectedGr,
					gr_type: 'Own',
					//grDate: new Date(new Date(vm.selectedGr.grDate), 'DD/MM/YYYY'),
					grDate: new Date(vm.selectedGr.grDate.setHours(0,0,0,0)),
					customer: vm.selectedGr.customer._id,
					consignor: vm.selectedGr.consignor && vm.selectedGr.consignor._id || undefined,
					consignee: vm.selectedGr.consignee && vm.selectedGr.consignee._id || undefined,
					billingParty: vm.selectedGr.billingParty && vm.selectedGr.billingParty._id || undefined,
					branch: vm.selectedGr.branch
				};

				if (typeof vm.grNumberModel == 'object') {
					request.grNumber = vm.grNumberModel.bookNo;
					request.stationaryId = vm.grNumberModel._id;
				} else if(!vm.selectedGr.invToBill){
					request.grNumber = vm.grNumberModel;
					request.stationaryId = undefined;
				}

				if(!request.stationaryId && $scope.$configs.GR && !$scope.$configs.GR.manualGr)
					return swal('Error', 'Invalid Gr Number', 'error');

				vm.selectedGr.invoices.forEach((invObj, index) => {
					if (typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
						request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
					if (typeof invObj.billingNoOfUnits === 'undefined' && invObj.noOfUnits)
						request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
					if (invObj.invoiceDate)
						request.invoices[index].invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
					if (invObj.gateoutDate)
						request.invoices[index].gateoutDate = moment(invObj.gateoutDate, 'DD/MM/YYYY').toISOString();
					if (invObj.gatePassDate)
						request.invoices[index].gatePassDate = moment(invObj.gatePassDate, 'DD/MM/YYYY').toISOString();
				});
				 if (vm.mode === 'edit') {
					tripServices.updateGRservice(request, success, failure);
				} else {
					tripServices.addNewGRservice(request, success, failure);
				}

				function success(res) {
					var message = res.data.message;
					swal('Update', message, 'success');
					stateDataRetain.back('booking_manage.myGR', res.data.data);
				}

				function failure(res) {
					swal('Error', res.data.message, 'error');
				}
			}

		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}

	function updateOnFreightChange() {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.charges.incentive = newVal * vm.incentivePercent / 100;
		});

	}
}


function editGrNumberController(
	$uibModalInstance,
	$scope,
	$stateParams,
	branchService,
	billBookService,
	DatePicker,
	oTrip,
	tripServices,
) {

	let vm = this;

	// functions Identifiers
	vm.submit = submit;
	vm.closeModal = closeModal;
	vm.getAllGr = getAllGr;
	vm.getAllBranch = getAllBranch;
	vm.getBillBookNo = getBillBookNo;

	// INIT functions
	(function init() {
		vm.allGrList = [];// initialize voucher object
		vm.oFilter = {};// initialize voucher object
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		vm.aTripInfo = angular.copy(oTrip.aTrips); // initialize datepicker
		vm.allGrList = angular.copy(oTrip.aTrips.gr); // initialize datepicker
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		getAllGr();
	})();

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAllGr() {

		let request = {
			_id: vm.allGrList.map(o => o._id),
			projection: ['bill', 'branch', 'grNumber', 'grDate', 'stationaryId', 'invToBill'],
			skip: 1,
		};

		request.no_of_docs = request._id.length;

		tripServices.getAllGRItem(request, success, failure);

		function success(res) {

			vm.oTripGr = res.data.data.data;
		}

		function failure(res) {
			swal("Failed!", res.data.massage, "error");
		}

	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

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

	function getBillBookNo(viewValue, oData) {

		if (!oData.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}
		if (!oData.branch.grBook) {
			return [];
		}

		if (!oData.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				type: 'Gr',
				billBookId: oData.branch.grBook.map(o => o.ref),
				useDate: moment(oData.grDate).startOf('day').toDate(),
				status: "unused"
			};

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
						oData.grNumber = response.data[0].bookNo;
						oData.stationaryId = response.data[0]._id;
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


	// GrEdit submit
	function submit(formData) {

		let grObj = {
			gr: vm.oTripGr.filter(o => !!o.grNumber).map(v => ({
				_id: v._id,
				grNumber: v.grNumber && v.grNumber.bookNo ? v.grNumber.bookNo : v.grNumber,
				grDate: v.grDate,
				branch: v.branch && v.branch._id,
				stationaryId: v.grNumber && v.grNumber._id ? v.grNumber._id : v.stationaryId
			}))
		};

		grObj.trip = vm.aTripInfo._id;

		tripServices.updateGRNum(grObj, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', response.data.message, 'error');
		}

		// Handle success response
		function onSuccess(response) {
			swal('Success', response.data.message, 'success');
		}
	}

}

function addRateChartPopUpController(
	$uibModalInstance,
	$timeout,
	otherData,
	lazyLoadFactory
) {
	let vm = this;

	vm.selectedGRInfo = {};
	vm.closeModal = closeModal;
	vm.selectedConfig = angular.copy(otherData.__RateChart);
	vm.lazyLoad = lazyLoadFactory(); // init lazyload
	let isGetActive = true;
	vm.aRate = {};
	vm.columnSetting = {};
	vm.tableHead = [];
	vm.allowedColumn = [];

	(function init() {
		vm.selectedGRInfo = angular.copy(otherData.selectedGr);
		vm.materialInfo = angular.copy(otherData.selectedInvoice.material);
		vm.aRateChart = angular.copy(otherData.selectedInvoice.aRateChart);
		vm.aRate.data = vm.aRateChart;
		res = vm.aRate;

		if (vm.selectedConfig) {
			for (let key in vm.selectedConfig) {
				if (vm.selectedConfig.hasOwnProperty(key)) {
					if (Array.isArray(vm.selectedConfig[key])) {
						let count = 0;
						vm.selectedConfig[key].forEach(function (d) {
							if (count == 0) {
								vm.tableHead.push({
									header: d.label,
									bindingKeys: 'baseRate[0].rate',
									visible: d.visible
								});
								vm.allowedColumn.push(d.label);
								count++;
							} else {
								vm.tableHead.push({
									header: d.label,
									bindingKeys: 'baseRate[1].rate',
									visible: d.visible
								});
								vm.allowedColumn.push(d.label);
							}
						});
					} else {
						vm.tableHead.push({
							header: vm.selectedConfig[key].label,
							bindingKeys: key,
							visible: vm.selectedConfig[key].visible
						});
						vm.allowedColumn.push(vm.selectedConfig[key].label);
					}
				}
			}
			vm.columnSetting = {isTrue: true, allowedColumn: vm.allowedColumn};
		}

		$timeout(function () {
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
		}, 0);
		vm.selectedRateInfo = {
			source: vm.selectedGRInfo.acknowledge.source,
			destination: vm.selectedGRInfo.acknowledge.destination,
			customer: vm.selectedGRInfo.customer,
			materialGroupCode: vm.materialInfo.groupName === vm.materialInfo.groupCode ? vm.materialInfo.groupName : (vm.materialInfo.groupName + `(${vm.materialInfo.groupCode})`)
		};

		if (vm.selectedGRInfo.grDate) {
			vm.selectedRateInfo.end_date = new Date((vm.selectedGRInfo.grDate).setHours(23, 59, 59));
		}

		vm.aRateChart = vm.aRateChart || [];
		vm.isAtTopLevel = true;
		if (vm.aRateChart.length)
			if (Array.isArray(vm.aRateChart[0].baseRate) && vm.aRateChart[0].baseRate.length) {
				vm.aExtraColumn = (vm.aRateChart[0].baseRate || []).map(o => o.baseVal);
				vm.isAtTopLevel = false;
			}

	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}
}
