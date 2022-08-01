materialAdmin
	.controller("incidentalController", incidentalController);

incidentalController.$inject = [
	'$filter',
	'$scope',
	'$state',
	'$stateParams',
	'$uibModal',
	'accountingService',
	'billsService',
	'branchService',
	'billBookService',
	'tripServices',
	'voucherService'
];


function incidentalController(
	$filter,
	$scope,
	$state,
	$stateParams,
	$uibModal,
	accountingService,
	billsService,
	branchService,
	billBookService,
	tripServices,
	voucherService
) {
	// object Identifiers
	var vm = this;
	vm.filter = {};
	vm.oVoucher = {};

	// functions Identifiers
	vm.getGr = getGr;
	vm.getAllBranch = getAllBranch;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.getAllAccount = getAllAccount;
	vm.deleteIncidental = deleteIncidental;
	vm.onRefNoSelect = onRefNoSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.aItems = [];
		vm.totReceivedAmount = 0;
		vm.showDelete = false;
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];

	})();

	// Actual Functions

	function getGr() {

		if (!vm.filter.grNo)
			return;

		if (vm.aItems.find(o => o.grNumber === vm.filter.grNo))
			return swal('Warning', 'Gr Already added!!!', 'warning');

		let oFilter = {
			skip: 1,
			no_of_docs: 100,
		};

		if (vm.filter.grNo)
			oFilter.grNumber = vm.filter.grNo;

		vm.filter.grNo = '';

		tripServices.getAllGRItem(oFilter, success, failure);

		function success(res) {
			if (res.data && res.data.data && res.data.data.data.length) {
				res.data.data.data.forEach(item => {
					item.in && item.in.forEach(o => {
						item.totalPayment = (item.totalPayment || 0) + o.amt;
					});
					vm.aItems.push(item);
				});

			} else {
				swal('Warning', 'No Gr Found', 'warning');
			}
		}

		function failure(res) {
			swal('Some error with GET trips.', '', 'error');
		}
	}

	function prepareRefFilter() {
		if (!vm.filter.refNo)
			return;

		vm.aItems = [];
		vm.oVoucher = {};
		let request = {
			skip: 1
		};
		if (vm.filter.refNo)
			request.refNo = vm.filter.refNo;


		tripServices.getIn(request, success, failure);

		function success(response) {
			if (response && response.data && response.data.data) {
				vm.showDelete = true;
				vm.noRefNoFound = false;
				vm.oVoucher = response.data.data[0];
				if (vm.oVoucher.branch)
					vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';
				if (vm.oVoucher.ledgers) {
					vm.oVoucher.ledgers.forEach(item => {

						if (item.cRdR == 'CR') {
							vm.oVoucher.crAccount = {_id: item.account, name: item.lName};
						} else if (item.cRdR == 'DR' && !item.bills[0]) {
							vm.oVoucher.drAccount = {_id: item.account, name: item.lName};
							vm.totReceivedAmount = item.amount;
						}
						// else if (item.cRdR == 'DR' && item.bills[0]){
						// 	vm.oVoucher.tdsAccount = {_id: item.account, name: item.lName};
						// 	vm.oVoucher.tdsAmt =  item.amount;
						// }
					});
				}
				if (vm.oVoucher && vm.oVoucher.gr) {
					vm.oVoucher.gr.forEach(item => {
						item.in.forEach(o => {
							item.totalPayment = (item.totalPayment || 0) + o.amt;
							if (o.refNo == vm.filter.refNo) {
								item.amount = o.amt;
								item.remark = o.remark;
								item.totalPayment -= o.amt;
							}
						});
						vm.aItems.push(item);
					});
				}
			} else
				swal('Error', 'No Data Found', 'error');
		}

		function failure(res) {
			vm.noRefNoFound = true;
			swal('Error', res.data.message, 'error');
		}
	}

	function getAllBranch(viewValue, id) {
		if (viewValue && viewValue.toString().length > 1 || id) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};
				if (id)
					req._id = id;
				else
					req.name = viewValue;

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

	function getAutoStationaryNo() {
		if(!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		if(!vm.oVoucher.date){
			swal('Error', 'Date is mandatory', 'error');
			return [];
		}

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			useDate: moment(vm.oVoucher.date, 'DD/MM/YYYY').startOf('day').toDate(),
			"status": "unused",
			sch: 'vch'
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oVoucher.refNo = vm.aAutoStationary.bookNo;
		}
	}

	function onBranchSelect() {
		vm.oVoucher.refNo = '';
		vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';

	}

	function getRefNo(viewValue) {

		if (!vm.billBookId)
			return;

		if(!vm.oVoucher.date){
			swal('Error', 'Date is mandatory', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
				useDate: moment(vm.oVoucher.date, 'DD/MM/YYYY').startOf('day').toDate(),
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

	function deleteIncidental() {

		if (!vm.oVoucher)
			return swal('Error', 'Please Select a Voucher', 'error');


		swal({
				title: 'Are you sure you want to delete selected vouchers?',
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
					tripServices.deleteIncidental({_id: vm.oVoucher._id,}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						vm.oVoucher = {};
						vm.aItems = [];
					}

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}
				}
			});
	}

	function onRefNoSelect(item, model, label) {
		vm.selectedStationary = item;
	}

	function getAllAccount(viewValue, group) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 3) {
				return resolve([]);
			} else {
				accountingService.getAccountMaster({
					name: viewValue,
					group
				}, res => resolve(res.data.data), err => resolve([]));
			}
		});
	}

	function prepareData() {
		vm.ledgers = [];
		for (i = 0; i < 2; i++) {
			switch (i) {
				case 0: {
					let obj = {
						account: vm.oVoucher.crAccount._id,
						lName: vm.oVoucher.crAccount.name,
						amount: Number(vm.totReceivedAmount),
						cRdR: 'CR',
					};
					vm.ledgers.push(obj);
				}
					break;
				case 1: {
					let obj = {
						account: vm.oVoucher.drAccount._id,
						lName: vm.oVoucher.drAccount.name,
						amount: Number(vm.totReceivedAmount),
						cRdR: 'DR',
					};
					vm.ledgers.push(obj);
				}
					break;
				// case 2:
				// {
				// 	let obj = {
				// 		account: vm.oVoucher.tdsAccount._id,
				// 		lName: vm.oVoucher.tdsAccount.name,
				// 		amount: vm.oVoucher.tdsAmt,
				// 		cRdR: 'DR',
				// 	};
				// 	obj.bills = obj.bills || [];
				// 		obj.bills.push({
				// 			amt: vm.oVoucher.tdsAmt,
				// 			rem: 0,
				// 			billNo: vm.oVoucher.refNo,
				// 			billRef: 'Against Ref',
				// 		});
				// 	vm.ledgers.push(obj);
				// }
				// 	break;
				default:
					break;
			}
		}
	}

	function submit(formData) {

		console.log(vm.aItems);

		if (formData.$valid) {

			let oVch = {
				branch: vm.oVoucher.branch && vm.oVoucher.branch._id,
				refNo: vm.oVoucher.refNo,
				stationaryId: vm.selectedStationary && vm.selectedStationary._id || vm.oVoucher.stationaryId,
				date: vm.oVoucher.date,
				paymentMode: vm.oVoucher.paymentMode,
				paymentRef: vm.oVoucher.paymentRef,
				paymentDate: vm.oVoucher.paymentDate,
				narration: vm.oVoucher.narration,
			};

			oVch.date = moment(oVch.date, 'DD/MM/YYYY').toISOString();
			oVch.paymentDate = moment(oVch.paymentDate, 'DD/MM/YYYY').toISOString();

			vm.gr = [];
			vm.aItems.forEach(items => {
				let obj = {
					_id: items._id,
					remark: items.remark,
					amt: items.amount,
				};
				vm.gr.push(obj);
			});
			prepareData();
			oVch.ledgers = vm.ledgers;
			oVch.gr = vm.gr;

			if (vm.oVoucher._id) {
				oVch._id = vm.oVoucher._id;
				tripServices.editIncidental(oVch, success, failure);
			} else {
				tripServices.addIncidental(oVch, success, failure);
			}

			function success(response) {
				console.log(response);
				vm.oVoucher = {};
				vm.aItems = [];
				swal('', response.data.message, 'success');
			}

			function failure(err) {
				console.log(err);
				swal('', err.data.message, 'error');
			}

		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}

	}

}
