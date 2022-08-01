// materialAdmin.controller('billsCoverNoteController', billsCoverNoteController);

function billsCoverNoteController(
	$scope,
	$uibModal,
    $uibModalInstance,
	billingPartyService,
	billsService,
	billsCoverNoteService,
	DatePicker,
	lazyLoadFactory,
	otherData,
) {

	let vm = this;
	vm.closeModal =closeModal;
	vm.submit = submit;
	vm.getCoverNoteBills = getCoverNoteBills;
	vm.getBillingPartyName = getBillingPartyName;
	vm.onSelect = onSelect;
	vm.matchCustomer = matchCustomer;
	vm.printBill = printBill;
	vm.reset = reset;

	// init
	(function init(){
		vm.columnSetting = {
			allowedColumn: [
				'actual bill no',
				'status',
				// 'billing party',
				'billing date',
				'due date',
				'amount',
				'amount received',
				'due amount',
				'cgst',
				'sgst',
				'igst',
				'total tax',
				'created by',
			]
		};
		vm.tableHead = [
			{
				'header': 'actual bill no',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'bill type',
				'bindingKeys': 'type'
			},
			{
				'header': 'status',
				'bindingKeys': 'status'
			},
			{
				'header': 'billing party',
				'bindingKeys': 'billingParty.name'
			},
			{
				'header': 'billing date',
				'bindingKeys': 'billDate',
				'date': true
			},
			{
				'header': 'due date',
				'bindingKeys': 'dueDate',
				'date': true
			},
			{
				'header': 'amount',
				'bindingKeys': 'totalAmount',
				'date': false
			},
			{
				'header': 'amount received',
				'bindingKeys': 'this|calculateReceivedAmount',
				'eval': true
			},
			{
				'header': 'due amount',
				'bindingKeys': 'totalAmount - (this|calculateReceivedAmount)',
				'eval': true
			},
			{
				'header': 'cgst',
				'bindingKeys': 'cGST',
				'date': false
			},
			{
				'header': 'sgst',
				'bindingKeys': 'sGST',
				'date': false
			},
			{
				'header': 'igst',
				'bindingKeys': 'iGST',
				'date': false
			},
			{
				'header': 'total tax',
				'bindingKeys': 'cGST + sGST + iGST',
				'eval': true
			},
			{
				'header': 'created by',
				'bindingKeys': ''
			},
		];

		vm.cnObj = {};
		vm.aBill = angular.copy(otherData.aBill);
		vm.type = angular.copy(otherData.type);
		vm.DatePicker = angular.copy(DatePicker);
		vm.showPrintBtn = false;
		vm.myFilter = {};
		vm.myFilter.grStatus = 'Approved';
		vm.lazyLoad = lazyLoadFactory();
		if(vm.type == 'edit'){
			// vm.billingParty = vm.aBill.billingParty.name;
			// vm.customer = vm.aBill.billingParty.customer;
			getCoverNote();
		}

	})();

	function matchCustomer() {
		if (vm.type == 'add') {
			if (!vm.customer) {
				let gr = vm.coverNoteBill && vm.coverNoteBill[0] && vm.coverNoteBill[0].items && vm.coverNoteBill[0].items[0] && (vm.coverNoteBill[0].items[0].gr && vm.coverNoteBill[0].items[0].grData) || {};
				vm.customer = gr && gr.customer;
			}
			if (!vm.coverNoteBill.length)
				vm.customer = undefined;
		}
	}

	function getCoverNote() {
		let request = {
			_id: vm.aBill.coverNote.coverNoteId
		};

		billsCoverNoteService.get(request, onSuccess, onFailure);

		// Handle failure response
		function onFailure(err) {
			console.log(err);
			swal('Error!', err.data.message, 'error');
		}

		// Handle success response
		function onSuccess(response){
			vm.coverNote = response.data.data;
			getCoverNoteBills();
			vm.showPrintBtn = true;
			vm.customer = vm.coverNote[0].customer;
			vm.coverNoteBill = vm.coverNote[0].bills;
			vm.cnObj.cnNo = vm.coverNote[0].cnNo;
			vm.cnObj.poNo = vm.coverNote[0].poNo;
			vm.cnObj.remark = vm.coverNote[0].remark;
			if(vm.coverNote[0].date)
				vm.cnObj.date = new Date(vm.coverNote[0].date);

		}
	}

	function getCoverNoteBills(isGetActive) {

		if(!vm.lazyLoad.update(isGetActive))
			return;

		billsService.getGenerateBill(prepareFilterObject(), onSuccess, onFailure);

		// Handle failure response
		function onFailure(err) {
			console.log(err);
			swal('Error!', err.data.message, 'error');
		}

		// Handle success response
		function onSuccess(response){
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response.data);
		}
	}


	//function Implementation
	function prepareFilterObject() {
		var myFilter = {};

		if(vm.myFilter.bill_no)
			myFilter.billNo = vm.myFilter.bill_no;

		// if(vm.customer && vm.customer._id)
		// 	myFilter.customer = vm.customer._id;

		if(vm.myFilter.start_date)
			myFilter.start_date = vm.myFilter.start_date;

		if(vm.myFilter.end_date)
			myFilter.end_date = vm.myFilter.end_date;

		if(vm.billingParty)
			myFilter.billingParty = vm.billingParty._id || vm.aBill.billingParty._id;

		// myFilter.status = myFilter.status ? myFilter.status : 'Approved';
		// myFilter['approve.status'] = true;
		if(vm.type == 'add') {
			myFilter["coverNote.cnNo"] = {
				$exists: false
			};
		}
		myFilter.totalAmount = {
			$exists: true
		};
		myFilter.sort = {
			billNoInt: 1
		};
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 30;

		return myFilter;
	}

	function printBill() {
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function(
				$scope,
				$uibModalInstance,
				clientService,
				excelDownload,
				otherData,
			) {

				$scope.showSubmitButton = !!otherData.showSubmitButton;
				$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
				$scope.downloadExcel = downloadExcel;

				$scope.aTemplate = otherData.aBillTemplate;
				$scope.templateKey = $scope.aTemplate[0];

				$scope.getGR = function(templateKey = 'default_') {

					var oFilter = {
						_id: otherData._id,
						billName: templateKey
					};

					clientService.getCovetNotePreview(oFilter, success, fail);
				};

				$scope.getGR($scope.templateKey && $scope.templateKey.key);

				function success(res) {
					$scope.html = angular.copy(res.data);
				}

				function fail(res) {
					swal('Error','Something Went Wrong','error');
					$scope.closeModal();
				}

				$scope.closeModal = function() {
					$uibModalInstance.dismiss('cancel');
				};

				$scope.submit = function() {
					$uibModalInstance.close(true);
				};

				function downloadExcel(id){
					excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
				}
			}],
			resolve: {
				otherData: function () {
					vm.billingParty = vm.coverNote[0].billingParty;
					vm.customer = vm.coverNote[0].customer;
					let aTemplate = (vm.billingParty && vm.billingParty.billTemplate || []);

					(vm.customer && vm.customer.billTemplate || []).reduce((arr, oTemplate) => {
						if(!arr.find(o => o.key === oTemplate.key))
							arr.push(oTemplate);
						return arr;
					}, aTemplate);
					return {
						_id: vm.aBill.coverNote.coverNoteId,
						aBillTemplate: aTemplate.filter(o => o.type === 'cover note')
					};
				}
			}
		});
	}

	function getBillingPartyName(viewValue) {
		if(viewValue && viewValue.toString().length <= 2)
			return;

		let request = {name: viewValue};

		if(vm.customer && vm.customer._id)
			request.customer = vm.customer._id;

		billingPartyService.getBillingParty(request, res => vm.aBillingParty = res.data, err => console.log`${err}`);
	}

	function onSelect(item, model, label) {

		if(vm.type == 'add' && !vm.customer){
			vm.customer = item.customer;
		}

		if(vm.customer)
		   if(item.customer._id != vm.customer._id)
			   return swal('Warning', 'BillingParty Customer Not Match', 'warning');
		getCoverNoteBills();
		vm.show = true;
	}

	function reset() {
		vm.customer = undefined;
		vm.coverNote = {};
		vm.cnObj = {};
		vm.aBills = [];
		vm.tableApi.refresh();
		vm.myFilter = {};
		vm.myFilter.grStatus = 'Approved';
		vm.coverNoteBill = [];
		vm.type = 'add';
		vm.billingParty = '';
	}

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {
		vm.showPrintBtn = false;
		if(formData.$valid){

			if(!(vm.customer && vm.customer._id))
				return swal('Error', 'Customer not provided', 'error');

			let oSend = {
				...vm.cnObj,
				billingParty:vm.coverNoteBill[0].billingParty._id || vm.aBill.billingParty._id,
				customer:vm.customer._id,
				};
			oSend.bills = [];
			let i = 0;
			vm.coverNoteBill.forEach(bills => {
				oSend.bills[i++] = bills._id;
			});
            if(vm.type == 'edit') {
            	oSend._id = vm.aBill.coverNote.coverNoteId;
				billsCoverNoteService.update(oSend, onSuccess, onFailure);
			}
            	else {
				billsCoverNoteService.add(oSend, onSuccess, onFailure);
			}

			function onFailure(err) {
				swal('Error', err.message, 'error');
			}

			function onSuccess(res) {
				swal('Success', res.data.message, 'success');
				vm.showPrintBtn = true;
				// $uibModalInstance.close(res.data.data);
			}

		}else swal('Error','All Mandatory Field Should be Filled','error');

	}

}
