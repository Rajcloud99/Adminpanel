materialAdmin.controller('moneyReceiptController', moneyReceiptController);

moneyReceiptController.$inject = [
	'$modal',
	'$parse',
	'$scope',
	'$stateParams',
	'branchService',
	'billingPartyService',
	'CustomerRateChartService',
	'confService',
	'consignorConsigneeService',
	'customer',
	'DatePicker',
	'formulaEvaluateFilter',
	'materialService',
	'stateDataRetain',
	'tripServices',
	'Vehicle',
	'incentiveService'
];

function moneyReceiptController(
	$modal,
	$parse,
	$scope,
	$stateParams,
	branchService,
	billingPartyService,
	CustomerRateChartService,
	confService,
	consignorConsigneeService,
	customer,
	DatePicker,
	formulaEvaluateFilter,
	materialService,
	stateDataRetain,
	tripServices,
	Vehicle,
	incentiveService
){
	let vm = this;

	// function identifier
	vm.getAllBranch = getAllBranch;
	vm.submit = submit;
	vm.addCollection = addCollection;
	vm.removeCollection = removeCollection;

	(function init() {

		vm.__RateChart = $scope.$constants.modelConfigs.RATE_CHART;
		vm.DatePicker = angular.copy(DatePicker);

		if($stateParams.data){
			vm.selectedGr = $stateParams.data.gr;
			vm.mode = $stateParams.data.mode.toLowerCase();

			getTrip(vm.selectedGr.trip.trip_no);

		}else{
			stateDataRetain.back('booking_manage.myGR');
			return;
		}

		vm.aRecoveryStatus = ["Chit", "Pending", "None"];
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque', 'Driver Cash'];
		vm.gstPercentToApply = String(vm.selectedGr.iGST_percent || (vm.selectedGr.cGST_percent + vm.selectedGr.sGST_percent) || '0');
		if(vm.selectedGr.iGST_percent)
			vm.gstPercentType =  'IGST';
		else if(vm.selectedGr.cGST_percent || vm.selectedGr.sGST_percent)
			vm.gstPercentType =  'CGST & SGST';
		// some basic operation based on mode the state is rendered
		getFormList();
		getCustRateChart();
		vm.selectedMr = {};
		vm.selectedGr.moneyReceipt = vm.selectedGr.moneyReceipt || {};
		vm.selectedGr.moneyReceipt.totalMrAmount = vm.selectedGr.moneyReceipt.totalMrAmount || 0;

		// setting form view mode i.e. to preview(readonly) to edit/add(editable)
		switch(vm.mode){
			case 'add': vm.readonly = false; break;
			case 'edit': vm.readonly = false; break;
			default: vm.readonly = true; break;
		}

	})();

	function addCollection(obj) {

		vm.selectedGr.moneyReceipt.collection = vm.selectedGr.moneyReceipt.collection || [];
		vm.selectedGr.moneyReceipt.collection.push({
			mrOffice: obj.mrOffice,
			mrNo: obj.mrNo,
			mrDate: obj.mrDate,
			mrAmount: obj.mrAmount,
			paymentMode: obj.paymentMode,
			partyName: obj.partyName,
			paymentRef: obj.paymentRef,
			paymentRmk: obj.paymentRmk,
			paymentDate: obj.paymentDate,
		});
		vm.totalAmount = vm.selectedGr.moneyReceipt.totalMrAmount += obj.mrAmount;
		// vm.selectedGr.moneyReceipt.balanceFreight = vm.selectedGr.totalAmount - vm.totalAmount;
		vm.selectedMr = {};
	}

	function removeCollection(index) {
		if(vm.selectedGr.moneyReceipt.collection.length && typeof index === 'number' && index >= 0)
			vm.selectedGr.moneyReceipt.totalMrAmount -= vm.selectedGr.moneyReceipt.collection[index].mrAmount;
		vm.selectedGr.moneyReceipt.collection.splice(index, 1);
	}

	function getCustRateChart() {
		let id;
		if(vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if(!id)
			return;

		confService.get(id, function (response) {
			vm.__RateChart = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
		});
	}

	// Actual Function


	function getFormList() {
		let id = false;

		if(vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if(vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if(!id || typeof id === 'object')
			return;

		confService.get(id, function (response) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
			calculateIncentive();
		});

		if(vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if(vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if(!id || typeof id === 'object')
			return;

		confService.get(id, function (response) {
			vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
		});
	}

	function getTrip(tripNo) {
		function success(res) {
			vm.oTrip = res.data.data.data[0];
			vm.nonSelectedGr = {
				totalWeight: 0,
				totalQty: 0,
				freight: 0
			};
			vm.oTrip.gr.forEach((o,i) => {
				if(o._id === vm.selectedGr._id){
					vm.oTrip.gr[i] = vm.selectedGr;
					return;
				}
				vm.nonSelectedGr.totalQty += o.invoices.reduce((a,c) => {
					vm.nonSelectedGr.freight += (c.freight || 0);
					vm.nonSelectedGr.totalWeight += (c.billingWeightPerUnit || 0);
					return a+(c.billingNoOfUnits || 0);
				},0);
			});
		}

		tripServices.getAllTripsWithPagination({
			trip_no: tripNo
		}, success);
	}

	function getAllBranch(viewValue) {
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

	function submit(formData) {

		console.log(formData);

		let request = {
			...vm.selectedGr,
			customer: vm.selectedGr.customer._id,
			consignor: vm.selectedGr.consignor && vm.selectedGr.consignor._id,
			consignee: vm.selectedGr.consignee && vm.selectedGr.consignee._id,
			billingParty: vm.selectedGr.billingParty && vm.selectedGr.billingParty._id,
			branch: vm.selectedGr.branch
		};
		 if(vm.selectedGr.moneyReceipt.branch){
			 vm.selectedGr.moneyReceipt.branch = Object.assign({}, {
			 	ref: vm.selectedGr.moneyReceipt.branch._id,
			 	name: vm.selectedGr.moneyReceipt.branch.name,
			 });
			 }

		vm.selectedGr.invoices.forEach((invObj,index) => {
			if(typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
				request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
			if(typeof invObj.billingNoOfUnits  === 'undefined' && invObj.noOfUnits)
				request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
		});

			tripServices.updateGRservice(request, success, failure);

		function success(res) {
			var message = res.data.message;
			swal('Update', message, 'success');
			stateDataRetain.back('booking_manage.myGR', res.data.data);
		}

		function failure(res) {
			swal('Error',res.data.message,'error');
		}
	}
}

