materialAdmin
	.controller("brokerMemoController", brokerMemoController);

brokerMemoController.$inject = [
	'$state',
	'$scope',
	'$modal',
	'lazyLoadFactory',
	'branchService',
	'tripServices',
	'Vehicle',
	'Vendor',
	'customer',
	'billingPartyService',
	'DatePicker',
	'stateDataRetain',
	'$uibModal',
	'URL',
	'growlService',
	'dmsService'
];

// multiPaymentReceiptCtrl.$inject = [
// 	'$scope',
// 	'$state',
// 	'$stateParams',
// 	'accountingService',
// 	'branchService',
// 	'billBookService',
// 	'DatePicker',
// 	'narrationService',
// 	'tripServices',
// 	'Vendor',
// ];


function brokerMemoController(
	$state,
	$scope,
	$modal,
	lazyLoadFactory,
	branchService,
	tripServices,
	Vehicle,
	Vendor,
	customer,
	billingPartyService,
	DatePicker,
	stateDataRetain,
	$uibModal,
	URL,
	growlService,
	dmsService
) {

	// functions Identifiers
	$scope.getAllBrokerMemo = getAllBrokerMemo;
	$scope.getAllBranch = getAllBranch;
	$scope.getVname = getVname;
	$scope.getVendorName = getVendorName;
	$scope.getCustomer = getCustomer;
	$scope.getBilling = getBilling;
	$scope.mrOperation = mrOperation;
	// $scope.editTripMemo = editTripMemo;
	// $scope.printBill = printBill;
	// $scope.uploadDocs = uploadDocs;
	// $scope.previewBuilty = previewBuilty;
	$scope.editBrokerMemo = editBrokerMemo;
	// $scope.grReceive = grReceive;
	// $scope.grAckRevert = grAckRevert;
	// $scope.multiPaymentReceipt = multiPaymentReceipt;
	// $scope.getBrokerMemoReport = getTripMemoReport;
	$scope.onStateRefresh = function () {
		getAllBrokerMemo();
	};

	// INIT functions
	(function init() {
		$scope.oFilter = {};
		$scope.showTable = true;
		$scope.selectType = 'index';
		$scope.aBrokerMemo = [];
		$scope.maxDate = new Date();
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.lazyLoad = lazyLoadFactory();

		if (stateDataRetain.init($scope))
			return;

		$scope.columnSetting = {
			allowedColumn: [
				'Trip No',
				'Gr No',
				'Broker Memo No',
				'Broker Memo Date',
				'Basic Freight',
				'Total Freight',
				'Advance',
				'Rate',
				'Munshiyana',
				'Total with Munshiyana',
				'Charges',
				'Deduction',
				'Deal Total',
				'Amount Received',
				'Amount Pending',
				'Vehicle No',
				'Source',
				'Destination',
				'Customer',
				'Billing Party',
				'Ref No',
				'Bill No',
				'POD Soft Copy Received',
				'POD Hard Copy Received',
				'Status',
				'Remark',
				'POD Updated By',
				'POD Updated At',
				'Created At',
				'Created By',
				'lastModified At',
				'lastModified By'
			]
		};
		$scope.tableHead = [
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			{
				'header': 'Gr No',
				'bindingKeys': 'grNumber',
				'date': false,
			},
			{
				'header': 'Broker Memo No',
				'bindingKeys': 'bMemo.bmNo',
				'date': false,
			},
			{
				'header': 'Broker Memo Date',
				'bindingKeys': 'bMemo.date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Basic Freight',
				'bindingKeys': 'basicFreight'
			},
			{
				'header': 'Charges',
				'bindingKeys': 'totalCharges'
			},{
				'header': 'Deduction',
				"filter": {
					'name': 'sumOfObject',
					'aParam': [
						'deduction',
					]
				}
			},
			{
				'header': 'Total Freight',
				'bindingKeys': 'totalFreight'
			},
			{
				'header': 'Advance',
				'bindingKeys': 'bMemo.advance'
			},
			{
				'header': 'Rate',
				'bindingKeys': 'bMemo.rate'
			},
			{
				'header': 'Munshiyana',
				'bindingKeys': 'bMemo.munshiyana'
			},
			{
				'header': 'Total with Munshiyana',
				'bindingKeys': 'bMemo.total'
			},
			{
				'header': 'Deal Total',
				'bindingKeys': 'bMemo.totalDeal'
			},
			{
				'header': 'Amount Received',
				'bindingKeys': 'receivedAmount'
			},
			{
				'header': 'Amount Pending',
				'bindingKeys': 'remainingAmt'
			},
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle_no'
			},
			{
				'header': 'Source',
				"bindingKeys": "acknowledge.source || trip.route_name.split(' to ')[0] ||trip.rName.split(' to ')[0]"
			},
			{
				'header': 'Destination',
				"bindingKeys": "acknowledge.destination|| trip.route_name.split(' to ')[1] ||trip.rName.split(' to ')[1]"
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name'
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name'
			},
			{
				"header":"Ref No",
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'bMemoReceipt',
						'"refNo"',
					]
				}},
			{
				'header': 'Status',
				'bindingKeys': 'status'
			},
			{
				'header': 'POD Soft Copy Received',
				'bindingKeys': 'noOfDocs ? noOfDocs: " 0 "',
			},
			{
				'header': 'POD Hard Copy Received',
				'bindingKeys': 'this.pod.received ? "Yes": "NO"',
				'eval': true
			},
			{
				'header': 'Bill No',
				'bindingKeys': 'bill.billNo'
			},
			{
				'header': 'Remark',
				'bindingKeys':'bMemo.remark'
			},
			{
				'header': 'POD Updated By',
				'bindingKeys':  'pod.user.full_name',
			},
			{
				'header': 'POD Updated At',
				'bindingKeys':  'pod.systemDate',
			},
			{
				'header':'Created At',
				'bindingKeys':'created_at',
				'date': "dd-MMM-yyyy 'at' hh:mm"
			},
			{
				'header': 'Created By',
				'bindingKeys':'created_by_full_name'
			},
			{
				'header': 'lastModified At',
				'bindingKeys':'last_modified_at',
				'date': "dd-MMM-yyyy 'at' hh:mm"
			},
			{
				'header': 'lastModified By',
				'bindingKeys':'last_modified_by'
			}
		];
	})();

	// Get all trip memo from backend
	function getAllBrokerMemo(isGetActive) {
		if (!$scope.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilterObject();
		tripServices.getBrokerMemo(oFilter, onSuccess, err => {
			console.log(err);

		});

		function onSuccess(res) {
			if (res && res.data) {
				$scope.aSelectedMemo = res && res.data && res.data.data[0];
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res.data);
			}
		}
	}

	// function grReceive(oTrip) {

	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/myGR/grReceive.html',
	// 		controller: 'grReceivePopUpCtrl',
	// 		resolve: {
	// 			thatTrip: function () {
	// 				return oTrip;
	// 			}
	// 		}
	// 	});

	// 	modalInstance.result.then(function () {

	// 	}, function (data) {
	// 		if (data != 'cancel') {
	// 			swal('Oops!', data.data.message, 'error');
	// 		}
	// 	});
	// }

	// $scope.grAckRmk = function (remark) {
	// 	if (remark.acknowledge.status == true) {
	// 		swal('Warning', 'Gr already acknowledge', 'warning');
	// 		return;
	// 	}


	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/myGRacknowledge/addGrRemark.html',
	// 		controller: ['$scope', '$uibModalInstance', 'Info', 'tripServices', addGrRemarkController],
	// 		controllerAs: 'rmVm',
	// 		resolve: {
	// 			Info: function () {
	// 				return remark;
	// 			}
	// 		}
	// 	});
	// };

	// function uploadDocs(selectedRow) {
	// 	console.log(selectedRow);
	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/uploadFiles.html',
	// 		controller: 'uploadFilesPopUpCtrl',
	// 		resolve: {
	// 			oUploadData: {
	// 				modelName: 'gr',
	// 				scopeModel: selectedRow,
	// 				scopeModelId: selectedRow._id,
	// 				uploadText: "Upload TMemo Documents",
	// 			}
	// 		}
	// 	});
	// 	modalInstance.result.then(function (data) {
	// 		$state.reload();
	// 	}, function (data) {
	// 		$state.reload();
	// 	});
	// }

	// function grAckRevert(){
	// 	if($scope.aSelectedMemo.bill)
	// 		return swal('Oops!', 'can not revert!!! bill already generated', 'error');

	// 	if ($scope.aSelectedMemo.acknowledge.status) {
	// 		swal({
	// 				title: 'Do you want to Revert Acknowledgement ?',
	// 				text: '',
	// 				type: 'warning',
	// 				showCancelButton: true,
	// 				confirmButtonColor: '#DD6B55',
	// 				confirmButtonText: 'Yes, i want',
	// 				cancelButtonText: 'No, cancel it!',
	// 				closeOnConfirm: true,
	// 				closeOnCancel: true
	// 			},
	// 			function (isConfirm) {
	// 				if (isConfirm) {
	// 					tripServices.revertGrAcknowledge({
	// 						_id: $scope.aSelectedMemo._id
	// 					}, onSuccess, onFailure);

	// 					function onFailure(err) {
	// 						swal('Error', err.data.message, 'error');
	// 					}

	// 					function onSuccess(res) {
	// 						$scope.getAllTripMemo();
	// 						swal('Success', res.data.message, 'success');
	// 					}
	// 				}
	// 			});
	// 	}
	// };


	// function previewBuilty(gr) {
	// 	if(!gr._id)
	// 		return;
	// 	$scope.getAllDocs = getAllDocs;
	// 	let documents = [];
	// 	(function init() {
	// 		getAllDocs();
	// 	})();

	// 	function getAllDocs(){
	// 		let req = {
	// 			_id: gr._id,
	// 			modelName: "gr"
	// 		};

	// 		let aAllDoc = [];
	// 		aAllDoc.push(gr._id);

	// 		if(gr.trip && gr.trip._id)
	// 			aAllDoc.push(gr.trip._id);

	// 		if(gr.trip.vehicle)
	// 			aAllDoc.push(gr.trip.vehicle);

	// 		let reqId = {};
	// 		let _id = [];
	// 		reqId._id =  aAllDoc;
	// 		//dmsService.getAllDocs( req,success,failure);
	// 		dmsService.getAllDocsV2(reqId, success, failure);

	// 		function success(res) {
	// 			if (res && res.data.length>0 ) {
	// 				//$scope.oDoc = res.data;
	// 				let aDocData 	= [];
	// 				let aDocRes 	= [];
	// 				let obTrip 		= {};
	// 				let livedObj 	= {};
	// 				aDocData = res.data;
	// 				livedObj = aDocData.reduce(function(o,i){
	// 					if(!o.hasOwnProperty(i.linkTo)){
	// 						o[i.linkTo] = [];

	// 					}

	// 					var grouped = {};
	// 					if(i.files && i.files.length>0) {
	// 						i.files.forEach(function (t) {
	// 							if (!grouped[t.category]) {
	// 								grouped[t.category] = [];
	// 							}

	// 							if(i.linkTo=='gr') {
	// 								if(gr._id==i.linkToId){
	// 									grouped[t.category].push({
	// 										name: `${URL.file_server}${t.name}`,
	// 										iName:t.name,
	// 										_id: i._id,
	// 										sId: gr._id,
	// 										sNumber:gr.grNumber
	// 									});
	// 								}
	// 							}

	// 							if(i.linkTo=='trip') {
	// 								if(gr.trip && (gr.trip._id==i.linkToId)){
	// 									grouped[t.category].push({
	// 										name: `${URL.file_server}${t.name}`,
	// 										iName:t.name,
	// 										_id: i._id,
	// 										sId: gr.trip._id,
	// 										sNumber:gr.trip.trip_no
	// 									});
	// 								}
	// 							}

	// 							if(i.linkTo=='regVehicle') {
	// 								if(gr.vehicle && (gr.vehicle._id==i.linkToId)){
	// 									grouped[t.category].push({
	// 										name: `${URL.file_server}${t.name}`,
	// 										iName:t.name,
	// 										_id: i._id,
	// 										sId: gr.vehicle,
	// 										sNumber:gr.vehicle_no
	// 									});
	// 								}
	// 							}
	// 						})
	// 					}
	// 					o[i.linkTo].push(grouped);
	// 					return o;
	// 				},{});

	// 				//$scope.oDoc = res.data;
	// 				$scope.oDoc = livedObj;
	// 				livedObj.pod = livedObj.gr;
	// 				delete livedObj.gr;
	// 				prepareData();

	// 			}else{
	// 				growlService.growl("No documents to preview", "warning");
	// 				return;
	// 			}
	// 		}

	// 		function failure(res) {
	// 			var msg = res.data.message;
	// 			growlService.growl(msg, "error");
	// 			return;
	// 		}
	// 	}

	// };

	// function prepareData() {
	// 	$uibModal.open({
	// 		templateUrl: 'views/previewDocumentPopup.html', //'views/carouselPopup.html',
	// 		controller:  'preiveDocPopupCtrl',
	// 		resolve: {
	// 			documents: function () {
	// 				return $scope.oDoc;
	// 			}
	// 		}
	// 	});
	// }

	function getBrokerMemoReport(type ) {
		let oFilter = prepareFilterObject(type);
		// if (!($scope.oFilter.tMemoFromDate && $scope.oFilter.tMemoToDate)) {
		// 	swal('Warning', 'From and To Date should be filled', 'warning');
		// 	return;
		// }
		if (!($scope.oFilter.tMemoFromDate && $scope.oFilter.tMemoToDate)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.tMemoFromDate && $scope.oFilter.tMemoToDate){
			if($scope.oFilter.tMemoFromDate>$scope.oFilter.tMemoToDate) {
				return swal("warning", "To date should be greater than From date", "warning");
			}

			if(moment($scope.oFilter.tMemoToDate).add(-3, 'month').isAfter(moment($scope.oFilter.tMemoFromDate))) {
				return swal("warning", "Max 3 Month data Allowed", "warning");
			}
		}

		tripServices.getTripMemoReports(oFilter, function (res) {
			if(res.data.url) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', res.data.message, 'success');
			}
		});
	}

	function multiPaymentReceipt(aTripMemo) {
		aTripMemo = Array.isArray(aTripMemo) && aTripMemo || [aTripMemo];
		$state.go("booking_manage.multiPayment", {
			data: {
				aTripMemo,
			}
		});
	}

	function editBrokerMemo(selectedRow) {

		//if(selectedRow.bill || selectedRow.provisonalBill.length ||selectedRow.supplementaryBillRef.length)
		// 	return swal('Error', 'can not edit Bill already generated', 'error');

		if (selectedRow) {

			var modalInstance = $modal.open({
				templateUrl: 'views/tripMemo/editTripMemo.html',
				controller: ['$scope', '$uibModalInstance', '$stateParams', 'DatePicker', 'formulaFactory', 'billingPartyService', 'consignorConsigneeService','customer', 'billBookService', 'Vehicle', 'tripServices', 'selectedInfo',editTripMemoController],
				controllerAs: 'etmVm',
				size: 'xl',
				resolve: {

					selectedInfo: selectedRow,
				}
			});


			modalInstance.result.then(function (response) {
				if (response) {

				}
			}, function (data) {

			});
		}

	}



// get vehicle name
function getVname(viewValue) {
	if (viewValue && viewValue.toString().length > 1) {
		function oSuc(response) {
			$scope.aVehicles = response.data.data;
		}

		function oFail(response) {
			console.log(response);
		}

		Vehicle.getNameTrim(viewValue, oSuc, oFail);
	}
}

// get vendor name
function getVendorName(viewValue) {
	if (viewValue && viewValue.toString().length > 1) {
		Vendor.getName({
			name: viewValue,
			deleted: false
		}, res => $scope.aVendor = res.data.data, err => console.log`${err}`);
	}
}

// get all  branch
function getAllBranch(viewValue) {
	if (viewValue && viewValue.toString().length > 1) {
		return new Promise(function (resolve, reject) {

			let req = {
				name: viewValue,
				no_of_docs: 10
			};

			if ($scope.$configs.client_allowed)
				req.cClientId = JSON.stringify($scope.$configs.client_allowed.map((v) => v.clientId));

			if ($scope.aUserBranch && $scope.aUserBranch.length) {
				let branch = [];
				$scope.aUserBranch.forEach(obj => {
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

// get customer
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

//billing party search
	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				billingPartyService.getBillingParty(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}



	function mrOperation(OperationType) {
	stateDataRetain.go('booking_manage.tmMoneyReceipt', {
		mode: OperationType,
		gr: $scope.aSelectedMemo
	}, 'gr');
}

	function printBill(oTrip) {
		var oFilter = {_id: $scope.aSelectedMemo._id};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'tripMemoPreviewCtrl1',
			resolve: {
				thatTrip: oFilter
			}
		});
	}
	// function editTripMemo(oSelectedRowInfo) {
	// 	if(oSelectedRowInfo) {
	// 		let vd = angular.copy(oSelectedRowInfo);
	// 		let selectedInfo = {};
	// 		selectedInfo['vendorDeal'] = vd;
	// 		// selectedInfo['vendorDeal']['tripMemoDate'] = new Date(selectedInfo['vendorDeal']['tMemo']['date']);
	// 		// selectedInfo['vendorDeal']['customer'] = oSelectedRowInfo.customer && oSelectedRowInfo.customer.name;
	// 		// selectedInfo['vendorDeal']['billingParty'] = oSelectedRowInfo.billingParty && oSelectedRowInfo.billingParty.name;
	// 		selectedInfo.vendorDeal.advance = selectedInfo.vendorDeal.tMemo.advance;
	// 		selectedInfo.vendorDeal.munshiyana = selectedInfo.vendorDeal.tMemo.munshiyana;
	// 		selectedInfo.vendorDeal.total_expense = selectedInfo.vendorDeal.tMemo.rate;
	// 		selectedInfo.vendorDeal.remark = selectedInfo.vendorDeal.tMemo.remark;
	// 		selectedInfo.vendorDeal.weight_type = selectedInfo.vendorDeal.tMemo.weight_type;
	// 		selectedInfo.vendorDeal.total = selectedInfo.vendorDeal.tMemo.totWithMunshiyana;
	// 		selectedInfo.vendorDeal.toPay = selectedInfo.vendorDeal.tMemo.toPay;
	// 		selectedInfo.vendorDeal.payment_type = selectedInfo.vendorDeal.payment_type;
	// 		selectedInfo.vendorDeal.pmtWeight = selectedInfo.vendorDeal.tMemo.pmtWeight;
	// 		selectedInfo.vendorDeal.pmtRate = selectedInfo.vendorDeal.tMemo.pmtRate;
	// 		selectedInfo.vendorDeal.perUnitPrice = selectedInfo.vendorDeal.tMemo.perUnitPrice;
	// 		selectedInfo.vendorDeal.totalUnits = selectedInfo.vendorDeal.tMemo.totalUnits;
	// 		selectedInfo['vendorDeal']['tMemo'] = selectedInfo['vendorDeal']['tMemo']['tMNo'];
	// 		var modalInstance = $uibModal.open({
	// 		  templateUrl: 'views/myBookings/quotationModal.html',
	// 		  size: 'xl',
	// 		  controller: 'updateTripMemoController',
	// 		  controllerAs: 'ackDealVm',
	// 		  resolve: {
	// 			tripMemo: true,
	// 			selectedInfo,
	// 			isEdit: true,
	// 			bookType: false,
	// 			tripMemoUpdate: true
	// 		  }
	// 		});
	//
	// 		modalInstance.result.then(function (response) {
	// 		  if (response) {
	// 			// $scope.account = response._id;
	// 		  }
	// 		}, function (data) {
	// 			$scope.getAllTripMemo();
	// 		});
	//
	// 	}
	//   }

	function printBill(oTrip) {
		var oFilter = {_id: $scope.aSelectedMemo._id};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'tripMemoPreviewCtrl1',
			resolve: {
				thatTrip: oFilter
			}
		});
	}
// prepare the filter object
	function prepareFilterObject(download) {
		var filter = {};
		if ($scope.oFilter.trip_no) {
			filter.trip_no = $scope.oFilter.trip_no;
		}
		if ($scope.oFilter.tMNo) {
			// filter.tMemo = { tMNo: $scope.oFilter.tMNo};
			filter.tMNo = $scope.oFilter.tMNo;
		}
		if ($scope.oFilter.grNumber) {
			filter.grNumber = $scope.oFilter.grNumber;
		}
		if ($scope.oFilter.vehicle) {
			filter.vehicle = $scope.oFilter.vehicle._id;
		}
		if ($scope.oFilter.vendor) {
			filter.vendor = $scope.oFilter.vendor._id;
		}
		if ($scope.oFilter.branch) {
			filter.branch = $scope.oFilter.branch._id;
		}
		if ($scope.oFilter.customer) {
			filter.customer = $scope.oFilter.customer._id;
		}
		if($scope.oFilter.billingParty){
			filter.billingParty = $scope.oFilter.billingParty._id;
		}
		if($scope.oFilter.paymentStatus){
			if($scope.oFilter.paymentStatus === 'Settled')
				filter.paymentStatus = { $eq: 0};
			else
				filter.paymentStatus = { $ne: 0};

		}

		if($scope.$user && $scope.$user.user_type && $scope.$user.user_type.length){
			if($scope.$user.user_type.indexOf('Broker') + 1)
				filter.createdBy = $scope.$user._id;
		}

		if ($scope.oFilter.received == 'Not Received')
		filter["pod.received"] = false;
		else if ($scope.oFilter.received == 'Received')
		filter["pod.received"] = true;
		else if($scope.oFilter.received == 'POD Updated By')
		filter["pod.user"] = 'all';
		else if ($scope.oFilter.received == 'Hard Copy') {
			filter["pod.received"] = true;
		} else if($scope.oFilter.received == 'Soft Copy') {
			filter["noOfDocs"] = { $ne: 0};
		}
		// filter.paymentStatus = $scope.oFilter.paymentStatus;
		if ($scope.oFilter.tMemoFromDate) {
			filter.tMemoFromDate = $scope.oFilter.tMemoFromDate;
		}
		if ($scope.oFilter.tMemoToDate) {
			filter.tMemoToDate = $scope.oFilter.tMemoToDate;
		}
		if ($scope.oFilter.vehAllocFromDate) {
			filter.vehAllocFromDate = $scope.oFilter.vehAllocFromDate;
		}
		if ($scope.oFilter.vehAllocToDate) {
			filter.vehAllocToDate = $scope.oFilter.vehAllocToDate;
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


}

// function multiPaymentReceiptCtrl(
// 	$scope,
// 	$state,
// 	$stateParams,
// 	accountingService,
// 	branchService,
// 	billBookService,
// 	DatePicker,
// 	narrationService,
// 	tripServices,
// 	Vendor
// ) {

// 	let vm = this;

// 	vm.submit = submit;
// 	vm.getAc = getAc;
// 	vm.prepareRefFilter = prepareRefFilter;
// 	vm.prepareFilter = prepareFilter;
// 	vm.reset = reset;
// 	vm.removeTrip = removeTrip;
// 	vm.otherCal = otherCal;
// 	vm.getAllBranch = getAllBranch;
// 	vm.onBranchSelect = onBranchSelect;
// 	vm.getAutoStationaryNo = getAutoStationaryNo;
// 	vm.getRefNo = getRefNo;
// 	vm.onRefNoSelect = onRefNoSelect;
// 	vm.deleteReceipt = deleteReceipt;

// 	// init
// 	(function init() {
// 		if (!($stateParams.data && $stateParams.data.aTripMemo))
// 			return $state.go('booking_manage.tripMemo');

// 		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
// 		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

// 		vm.filter = {};
// 		vm.aGrs = [];
// 		vm.isDisable = false;
// 		vm.noRefNoFound = false;
// 		vm.aVoucherType = ['Payment', 'Journal'];
// 		vm.voucherType = vm.aVoucherType[0];
// 		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque', /*'Diesel', 'Diesel Cash', 'Broker'*/];
// 		vm.aToGroup = ['Transaction', 'banks', 'Cashbook'];
// 		vm.aPaymentType = ['All', 'Advance', 'Balance'];

// 		getTripMemo({
// 			_id: $stateParams.data.aTripMemo.map(o => o._id)
// 		});
// 	})();

// 	function getTripMemo(request) {

// 		request.no_of_docs = Number.MAX_SAFE_INTEGER;

// 		tripServices.getTripMemo(request, success, failure);

// 		function success(res) {
// 			vm.filter.tMNo = '';

// 			if (res.data.data.length) {
// 				res.data.data[0].receivedAmt = vm.filter.amount;

// 				vm.filter.amount = undefined;

// 				if (request['tMemoReceipt.refNo']) {
// 					vm.isRefNoSearched = true;
// 					vm.aGrs = res.data.data;
// 					vm.refNo = request['tMemoReceipt.refNo'];
// 					let branch;

// 					let toFindAccountId;

// 					vm.aGrs.find(aGr => {
// 						let found = aGr.tMemoReceipt.find((oAdv) => oAdv.refNo === vm.refNo);
// 						if (found) {
// 							branch = found.branch;
// 							toFindAccountId = found.toAccount;
// 							vm.voucherType = found.vType;
// 							return true;
// 						} else
// 							return false;
// 					});

// 					if (!(branch && branch._id))
// 						getAllBranch('  ', {_id: branch})
// 							.then(function (res) {
// 								vm.branch = res[0];
// 								vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
// 							});


// 					getAccountById(toFindAccountId).then(function (data) {
// 						vm.toAccount = data[0];
// 						vm.aToAccount = data;
// 					});

// 				} else {

// 					if (!res.data.data.every(o => !!o.billingParty.account))
// 						return swal('Warning', 'billingParty A/c Not Linked', 'warning');

// 					vm.aGrs.push(...res.data.data);
// 				}

// 				otherCal();
// 			} else {
// 				if (request['tMemoReceipt.refNo']) {
// 					vm.noRefNoFound = true;
// 					vm.isRefNoSearched = false;
// 				} else {
// 					swal('Warning', 'No Trip Memo Found', 'warning');
// 				}
// 			}
// 		}

// 		function failure(res) {
// 			vm.isRefNoSearched = false;
// 			swal("Failed!", res.data.data.data, "error");
// 		}
// 	}

// 	function prepareRefFilter() {

// 		vm.isRefNoSearched = false;
// 		vm.noRefNoFound = false;
// 		if (vm.filter.refNo) {
// 			vm.searchedRefNo = vm.filter.refNo;
// 			getTripMemo({
// 				'tMemoReceipt.refNo': vm.filter.refNo,
// 			});
// 		}
// 	}

// 	function prepareFilter() {

// 		let filter = { };

// 		if (vm.filter.tMNo)
// 			filter.tMNo = vm.filter.tMNo;

// 		if (vm.aGrs.find(o => o.tMemo.tMNo === vm.filter.tMNo))
// 			return;

// 		getTripMemo(filter);
// 	}

// 	function reset() {
// 		if (vm.dataPreserve) {
// 			vm.aGrs = [];
// 			vm.filter.refNo = '';
// 			vm.refNo = '';
// 			vm.isRefNoSearched = false;
// 		} else {
// 			vm.aGrs = [];
// 			vm.refNo = '';
// 			vm.filter.refNo = '';
// 			vm.isRefNoSearched = false;
// 			vm.paymentMode = undefined;
// 			vm.paymentDate = undefined;
// 			vm.paymentRef = undefined;
// 			vm.toAccount = undefined;
// 			vm.branch = undefined;
// 			vm.receivedAmt = 0;
// 		}
// 	}

// 	function removeTrip() {

// 		if (vm.oSelectedTrip && vm.oSelectedTrip._id) {
// 			vm.aGrs.splice(vm.aGrs.findIndex(o => o._id === vm.oSelectedTrip._id), 1);
// 			vm.oSelectedTrip = {};
// 			otherCal();
// 		} else
// 			return swal('Error', 'No Trip Selected', 'error');

// 	}

// 	function deleteReceipt() {

// 		if (!(vm.filter && vm.filter.refNo))
// 			return swal('Error', 'No Ref No selected', 'error');

// 		vm.isDeleteDisable = true;

// 		tripServices.custPaymentReceiptDelete({
// 			refNo: vm.filter.refNo
// 		}, success, failure);

// 		function success(res) {
// 			if (res && res.data) {
// 				swal('Success', res.data.message, 'success');
// 				vm.isDeleteDisable = false;
// 				reset();
// 			} else {
// 				swal('Error', res.data.message, 'error');
// 				vm.isDeleteDisable = false;
// 			}
// 		}

// 		function failure(res) {
// 			vm.isDeleteDisable = false;
// 			var msg = res.data.message;
// 			swal('Error', msg, 'error');
// 		}
// 	}

// 	function otherCal(isChangePType) {

// 		if (!vm.aGrs.length)
// 			return;

// 		if (vm.isRefNoSearched) {
// 			vm.receivedAmt = 0;
// 		}

// 		vm.aGrs.forEach(oGr => {
// 			let selectedRefAmt = 0;
// 			oGr.advPaid = 0;
// 			oGr.balPaid = 0;


// 			if(oGr.tMemoReceipt) {
// 				oGr.tMemoReceipt.forEach(obj => {
// 					oGr.advPaid = oGr.advPaid || 0;
// 					if (obj.vAdv === 'Advance' && obj.refNo != vm.refNo)
// 						oGr.advPaid += obj.amount;
// 				}, 0);

// 				oGr.tMemoReceipt.forEach(obj => {
// 					oGr.balPaid = oGr.balPaid || 0;
// 					if (obj.vAdv === 'Balance' && obj.refNo != vm.refNo)
// 						oGr.balPaid += obj.amount;
// 				}, 0);
// 			}


// 			oGr.payable = ((oGr.tMemo.total || 0) + (oGr.totalCharges || 0) - (oGr.totalDeduction || 0) - (oGr.tMemo.tdsAmount || 0) - (oGr.tMemo.extraTDSAmt || 0));
// 			oGr.totReceipt = oGr.tMemoReceipt.reduce((a, b) => {

// 				if (b.refNo === vm.refNo) {
// 					selectedRefAmt += b.amount;

// 					if (b.stationaryId) {
// 						vm.selectedStationary = {
// 							bookNo: vm.refNo,
// 							_id: b.stationaryId
// 						};
// 					}

// 					vm.paymentDate = new Date(b.paymentDate);
// 					vm.paymentMode = b.paymentMode;
// 					vm.paymentRef = b.paymentRef;
// 					vm.remark = b.remark;
// 					if(!isChangePType)
// 					vm.paymentType = b.vAdv;
// 				}

// 				return a + b.amount;
// 			}, 0);
// 			oGr.remainingAmount = oGr.payable - oGr.totReceipt + selectedRefAmt;
// 			oGr.maxAmount = oGr.remainingAmount;
// 			if (vm.paymentType === 'All') {
// 				oGr.maxAmount = oGr.remainingAmount;
// 			} else if (vm.paymentType === 'Advance') {
// 				oGr.maxAmount = oGr.tMemo.advance - oGr.advPaid;
// 			}
// 			if (vm.paymentType === 'Balance') {
// 				oGr.maxAmount = oGr.tMemo.toPay - oGr.balPaid;
// 			}
// 			oGr.maxAmount = (oGr.maxAmount > oGr.remainingAmount) ? oGr.remainingAmount : oGr.maxAmount;


// 			// oGr.receivedAmt = 0;

// 			if (vm.isRefNoSearched) {
// 				vm.receivedAmt += selectedRefAmt;
// 				oGr.receivedAmt = selectedRefAmt;
// 				oGr.totReceipt -= selectedRefAmt;
// 				typeof vm.branch === 'string' && getAllBranch(false, {_id: vm.branch});
// 			}

// 		});
// 	}

// 	function getAc(viewValue, aGroup) {
// 		if (viewValue && viewValue.toString().length > 1) {
// 			return new Promise(function (resolve, reject) {

// 				let req = {
// 					name: viewValue,
// 					no_of_docs: 10,
// 					group: aGroup,
// 				};

// 				accountingService.getAccountMaster(req, res => {
// 					resolve(res.data.data);
// 				}, err => {
// 					console.log`${err}`;
// 					reject([]);
// 				});

// 			});
// 		}

// 		return [];
// 	}

// 	function getAccountById(_id) {

// 		return new Promise(function (resolve, reject) {

// 			let oFilter = {
// 				no_of_docs: 1,
// 				_id
// 			}; // filter to send

// 			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

// 			// Handle failure response
// 			function onFailure(response) {

// 			}

// 			// Handle success response
// 			function onSuccess(response) {
// 				resolve(response.data.data);
// 			}

// 		});
// 	}

// 	function getAllBranch(viewValue, filter) {
// 		if (viewValue && viewValue.toString().length > 1) {
// 			return new Promise(function (resolve, reject) {

// 				let req = {
// 					no_of_docs: 10,
// 				};

// 				if (filter)
// 					Object.assign(req, filter);
// 				else
// 					req.name = viewValue;

// 				if (vm.aUserBranch && vm.aUserBranch.length) {
// 					req._ids = [];
// 					vm.aUserBranch.forEach(obj => {
// 						if (obj.write)
// 							req._ids.push(obj._id)
// 					});
// 					if (!(req._ids && req._ids.length)) {
// 						return
// 					} else {
// 						req._ids = JSON.stringify(req._ids);
// 					}
// 				}

// 				branchService.getAllBranches(req, res => {
// 					resolve(res.data);
// 				}, err => {
// 					console.log`${err}`;
// 					reject([]);
// 				});

// 			});
// 		}

// 		return [];
// 	}

// 	function getAutoStationaryNo(viewValue) {
// 		if (viewValue != 'centrailized' && !(vm.billBookId && vm.billBookId.length))
// 			return;

// 		let req = {
// 			"billBookId": vm.billBookId,
// 			"type": 'Ref No',
// 			"auto": true,
// 			"sch": 'vch',
// 			"status": "unused"
// 		};
// 		if (viewValue === 'centrailized') {
// 			delete req.billBookId;
// 			req.centralize = true;
// 			req.sch = 'onBook';
// 		}

// 		if (vm.paymentDate)
// 			req.useDate = moment(vm.paymentDate, 'DD/MM/YYYY').toISOString();

// 		billBookService.getStationery(req, success);

// 		function success(response) {
// 			vm.aAutoStationary = response.data[0];
// 			vm.refNo = vm.aAutoStationary.bookNo;
// 			vm.selectedStationary = vm.aAutoStationary;
// 		}
// 	}

// 	function onBranchSelect() {
// 		vm.refNo = '';
// 		vm.billBookId = vm.branch.refNoBook ? vm.branch.refNoBook.map(o => o.ref) : '';
// 	}

// 	function getRefNo(viewValue) {

// 		if (!vm.billBookId)
// 			return;

// 		return new Promise(function (resolve, reject) {

// 			let requestObj = {
// 				bookNo: viewValue,
// 				billBookId: vm.billBookId,
// 				type: 'Ref No',
// 				status: "unused"
// 			};

// 			billBookService.getStationery(requestObj, oSuc, oFail);

// 			function oSuc(response) {
// 				resolve(response.data);
// 			}

// 			function oFail(response) {
// 				console.log(response);
// 				reject([]);
// 			}
// 		});
// 	}

// 	function onRefNoSelect(item) {
// 		vm.selectedStationary = item;
// 	}

// 	function submit(formData) {

// 		if (vm.receivedAmt < 0)
// 			return swal('Error', 'Received Amount Should be grater then 0.', 'error');

// 		vm.totReceivedAmt = vm.aGrs.reduce((a, b) => a + (b.receivedAmt || 0), 0) || 0;

// 		if (vm.totReceivedAmt !== vm.receivedAmt)
// 			return swal('Error', 'Received Amount Should be equal to All Trip Memo Receiving', 'error');

// 		if (!vm.toAccount._id)
// 			return swal('Error', 'Debit A/c Not selected', 'error');

// 		if (!(vm.branch && vm.branch._id))
// 			return swal('Error', 'Branch Not selected', 'error');

// 		if (formData.$valid) {

// 			let payload = [];

// 			let doesBPAccExistOnAllGr = vm.aGrs.every(oGr => !!oGr.billingParty.account);

// 			if (!doesBPAccExistOnAllGr)
// 				return swal('Error', `BillingParty A/c not found`, 'error');

// 			vm.aGrs.forEach(oGr => {
// 				let grObj = {
// 					"account_data": {
// 						"from": oGr.billingParty.account._id,
// 						"fromName": oGr.billingParty.account.name,
// 						"to": vm.toAccount._id,
// 						"toName": vm.toAccount.name
// 					},
// 					"branch": vm.branch._id,
// 					"paymentDate": moment(vm.paymentDate, 'DD/MM/YYYY').toISOString(),
// 					"paymentMode": vm.paymentMode,
// 					"paymentRef": vm.paymentRef,
// 					"gr": oGr._id,
// 					"grNumber": oGr.grNumber,
// 					"billNo": oGr.tMemo.tMNo,
// 					"billType": 'On Account',
// 					"trip_no": oGr.trip_no,
// 					"remainingAmount": oGr.remainingAmount,
// 					"amount": oGr.receivedAmt,
// 					"vehicle_no": oGr.vehicle_no,
// 					"refNo": vm.refNo,
// 					"remark": vm.remark,
// 					"vAdv": vm.paymentType,
// 					"narration": narrationService({
// 						vehicleNo: oGr.vehicle_no,
// 						tripNo: oGr.trip_no,
// 						hsNo: oGr.tMemo && oGr.tMemo.tMNo,
// 						grNum: oGr.grNumber,
// 					})
// 				};


// 				grObj.stationaryId = (vm.selectedStationary && vm.selectedStationary.bookNo) === vm.refNo ? vm.selectedStationary._id : undefined;

// 				payload.push(grObj);
// 			});

// 			vm.isDisable = true;

// 			if (vm.isRefNoSearched) {
// 				tripServices.updateCustPaymentReceipt({
// 					aTripMemo: payload,
// 					refNo: (vm.filter && vm.filter.refNo) || vm.refNo
// 				}, success, failure);
// 			} else {
// 				tripServices.custPaymentReceipt(payload, success, failure);
// 			}

// 			function success(res) {
// 				vm.isDisable = false;
// 				if (res && res.data) {
// 					swal('Success', 'Cust Receipt Payment Successfully Done', 'success');
// 					reset();
// 				} else {
// 					swal('Error', res.data.message, 'error');
// 				}
// 			}

// 			function failure(res) {
// 				vm.isDisable = false;
// 				var msg = res.data.message;
// 				swal('Error', msg, 'error');
// 			}

// 		} else
// 			return swal('Error', 'All Mandatory Feilds are not filled', 'error');
// 	}
// }

function editBrokerMemoController(
	$scope,
	$uibModalInstance,
	$stateParams,
	DatePicker,
	formulaFactory,
	billingPartyService,
	consignorConsigneeService,
	customer,
	billBookService,
	Vehicle,
	tripServices,
	selectedInfo
) {
	let vm = this;

	// functions Identifiers
	vm.closeModal = closeModal;
	vm.changeAdvance = changeAdvance;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.changeAcPayment = changeAcPayment;
	vm.changePayType = changePayType;
	vm.formulaCommonCalFun = formulaCommonCalFun;
	vm.getBillBookNo = getBillBookNo;
	vm.getAllBillingParty = getAllBillingParty;
	vm.getConsignee =  getConsignee;
	vm.getConsignor =  getConsignor;
	vm.onConsigneeSelect = onConsigneeSelect;
	vm.onConsignorSelect = onConsignorSelect;
	vm.getRoute = getRoute;
	vm.getGrBookNo = getGrBookNo;
	vm.resetAll = resetAll;
	vm.submit = submit;


	// INIT functions
	(function init() {
		vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
		vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
		vm.oGrData = angular.copy(selectedInfo);
		vm.oTripMemo = vm.oGrData.tMemo || {};
		vm.grBookInfo = {_id:vm.oGrData.stationaryId,bookNo:vm.oGrData.grNumber};
		vm.bookInfo = {_id:vm.oTripMemo.stationaryId,bookNo:vm.oTripMemo.tMNo};
		if(vm.oGrData.grDate)
			vm.oGrData.grDate = new Date(vm.oGrData.grDate);

		if(vm.oTripMemo.date)
			vm.oTripMemo.date = new Date(vm.oTripMemo.date);

		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
		}
		vm.oTripMemo.tRecv = 0;
		if(vm.oGrData.tMemoReceipt && vm.oGrData.tMemoReceipt.length){
			vm.readonly = true;
			vm.oGrData.tMemoReceipt.forEach(obj=>{
				vm.oTripMemo.tRecv += obj.amount;
			})
		}
		// if($scope.$configs.GR && $scope.$configs.GR.grReceive && vm.oGrData.pod && vm.oGrData.pod.received) {
		// 	vm.isReadonly = true;
		// 	vm.readonly = true;
		// }
			if ((vm.oGrData.bill || (vm.oGrData.provisionalBill && vm.oGrData.provisionalBill.ref && vm.oGrData.provisionalBill.ref.length))) {
			vm.isReadonly = true;
			vm.readonly = true;
		}



		$scope.$watchGroup(['etmVm.oTripMemo.munshiyana', 'etmVm.oTripMemo.rate', 'etmVm.oTripMemo.otherExp'], function (...aMod) {
			formulaCommonCalFun();
		});
	})();

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getBillBookNo(viewValue) {

		if (viewValue != 'centrailized' && !(vm.oGrData.branch && Array.isArray(vm.oGrData.branch.tripMemoBook) && vm.oGrData.branch.tripMemoBook.length))
			return;


		if (!vm.oTripMemo.date) {
			swal('Error', 'Trip Memo Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.oGrData.branch.tripMemoBook ? vm.oGrData.branch.tripMemoBook.map(o => o.ref) : '',
				type: 'Trip Memo',
				useDate: moment(vm.oTripMemo.date).startOf('day').toDate(),
				status: 'unused'
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
						vm.oTripMemo.tMNo = response.data[0].bookNo;
						vm.bookInfo.bookNo = response.data[0].bookNo;
						delete vm.bookInfo._id;
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

	vm.onBookNoSelect = function(item) {
		vm.bookInfo = item;
	}

	function getGrBookNo(viewValue) {

		if (viewValue != 'centrailized' && !(vm.oGrData.branch && Array.isArray(vm.oGrData.branch.grBook) && vm.oGrData.branch.grBook.length))
			return;


		if (!vm.oGrData.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.oGrData.branch.grBook ? vm.oGrData.branch.grBook.map(o => o.ref) : '',
				type: 'Gr',
				useDate: moment(vm.oGrData.grDate).startOf('day').toDate(),
				status: 'unused'
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
						vm.oGrData.grNumber = response.data[0].bookNo;
						vm.grBookInfo.bookNo = response.data[0].bookNo;
						delete vm.grBookInfo._id;
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

	vm.onGrBookSelect = function(item) {
		vm.grBookInfo = item;
	}

	function onConsigneeSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignee = value;
		}
	}
	function onConsignorSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignor = value;
		}
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

	function getAllBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.oTripMemo &&  (vm.oTripMemo.munshiyana || 0),
			'total_expense': vm.oTripMemo && (vm.oTripMemo.rate || 0),
			'otherExp': vm.oTripMemo  && (vm.oTripMemo.otherExp || 0)
		});
		vm.oTripMemo.total = Math.round(vm.munsiyanaFromula.eval());
	}

	function changePayType(pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			vm.oTripMemo.toPay = (vm.oTripMemo.rate || 0) - (vm.oTripMemo.munshiyana || 0);
			vm.oTripMemo.advance = 0;
			if (vm.oTripMemo.diesel) {
				vm.oTripMemo.diesel.quantity = 0;
				vm.oTripMemo.diesel.rate = 0;
				vm.oTripMemo.diesel.amount = 0;
			}
			vm.oTripMemo.driver_cash = 0;
			vm.oTripMemo.toll_tax = 0;
			vm.oTripMemo.other_charges = 0;
			vm.oTripMemo.other_charges_remark = '';
			vm.oTripMemo.account_payment = 0;
		}
	}

	function calculateTotalPMT() {
		vm.oTripMemo.rate = (vm.oTripMemo.pmtWeight || 0) * (vm.oTripMemo.pmtRate || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function calculateTotalPUnit() {
		vm.oTripMemo.rate = (vm.oTripMemo.perUnitPrice || 0) * (vm.oTripMemo.totalUnits || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function resetAll() {
		vm.oTripMemo.rate = undefined;
		vm.oTripMemo.munshiyana = undefined;
		vm.oTripMemo.advance = undefined;
		vm.oTripMemo.toPay = undefined;
		vm.oTripMemo.pmtWeight = undefined;
		vm.oTripMemo.pmtRate = undefined;
		vm.oTripMemo.perUnitPrice = undefined;
		vm.oTripMemo.totalUnits = undefined;
	}

	function changeAcPayment() {
		vm.oTripMemo.account_payment = (vm.oTripMemo.advance || 0) - (vm.oTripMemo.diesel ? (vm.oTripMemo.diesel.amount || 0) : 0) - (vm.oTripMemo.driver_cash || 0) - (vm.oTripMemo.toll_tax || 0) - (vm.oTripMemo.other_charges || 0);
	}

	function changeAdvance(type) {

		var tot_exp = angular.copy(vm.oTripMemo.rate);
		var joint_exp = (vm.oTripMemo.toPay || 0) + (vm.oTripMemo.advance || 0);
		if (type === 'munshiyana') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (type === 'advance') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (vm.oTripMemo.payment_type === 'To pay' || vm.oTripMemo.payment_type === 'To be billed') {
			// vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
			vm.oTripMemo.advance = 0;
		}
	}

	function submit(formData) {
		if (formData.$valid) {
			let payload = {...vm.oGrData};
			payload.tMemo = vm.oTripMemo;

			if(payload.grNumber && !(vm.grBookInfo && vm.grBookInfo._id || vm.grBookInfo.bookNo)){
				if(!$scope.$configs.GR.manualGr)
					return swal('Error', `please enter valid Gr number`, 'error');
			}


			if(vm.grBookInfo && vm.grBookInfo._id)
				payload.stationaryId = vm.grBookInfo._id;

			if(payload.tMemo && payload.tMemo.tMNo  && !(vm.bookInfo && vm.bookInfo._id || vm.bookInfo.bookNo))
				return swal('Error', `please enter valid trip memo number`, 'error');

			if(vm.bookInfo && vm.bookInfo._id)
				payload.tMemo.stationaryId = vm.bookInfo._id;
			else
				return swal('Error', `please enter valid trip memo number`, 'error');

			if(payload.billingParty && payload.billingParty._id)
				payload.billingParty = payload.billingParty._id;

			if(payload.grNumber && payload.grNumber._id)
				payload.grNumber = payload.grNumber.bookNo;


			if(payload.tMemo.tMNo && payload.tMemo.tMNo._id)
				payload.tMemo.tMNo = payload.tMemo.tMNo.bookNo;

			vm.isDisable = true;
			tripServices.updateTripMemo(payload, success, failure);

			function success(res) {
				vm.isDisable = false;
				if (res && res.data) {
					swal('Success', 'Data Successfully Updated', 'success');
				}
				$uibModalInstance.dismiss();
			}

			function failure(res) {
				vm.isDisable = false;
				var msg = res.data.message;
				swal('Error', msg, 'error');
			}

		}else
			return swal('Error', 'All Mandatory Feilds are not filled', 'error');
	}

}

materialAdmin.controller('tripMemoPreviewCtrl1',
	function (
		$rootScope,
		$scope,
		$uibModalInstance,
		customer,
		excelDownload,
		thatTrip,
		clientService,
		sharedResource,
		clientConfig
	) {

		$scope.aTemplate = $scope.$configs.Bill.tripMemoPreview || [];
		$scope.templateKey = $scope.aTemplate[0];
		$scope.showSubmitButton = !!thatTrip.showSubmitButton;
		$scope.showSubmitAndApproveButton = !!thatTrip.showSubmitAndApproveButton;
		$scope.hidePrintButton = !!thatTrip.billPreviewBeforeGenerate;
		$scope.downloadExcel = downloadExcel;


		// $scope.getGR = function (templateKey) {
		// 	var oFilter = angular.copy(thatTrip);
		// 	if (templateKey && (templateKey != 'default')) {
		// 		oFilter.builtyName = templateKey;
		// 	}
		// 	clientService.createTripMemoBuilty(oFilter, success, fail);
		// };
		$scope.getGR = function (templateKey) {
			var oFilter = angular.copy(thatTrip);
			if (templateKey && (templateKey != 'default')) {
				oFilter.builtyName = templateKey;
			}
			const oBody = {
				_id: oFilter._id,
				builtyName: oFilter.builtyName
			};
			clientService.createTripMemoBuilty(oFilter, oBody, success, fail);
		};

		if ($scope.aTemplate && !($scope.aTemplate.length >= 1)) {
			$scope.getGR('tripMemoPreview');
		} else {
			$scope.templateKey = $scope.aTemplate[0];
			$scope.getGR($scope.aTemplate[0].key);
		}


		function success(res) {
			// $scope.html = 'Working';
			$scope.html = angular.copy(res.data);
		}

		function fail(res) {
			swal('Error', 'Something Went Wrong', 'error');
		}

		function downloadExcel(id) {
			excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0].key}_${moment().format('DD-MM-YYYY')}`);
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.submit = function (approve) {
			$uibModalInstance.close(approve ? 'approve' : true);
		};
	});

materialAdmin.controller('updateTripMemoController', function (
	$scope,
	selectedInfo,
	isEdit,
	tripMemo,
	$uibModalInstance,
	DatePicker,
	userService,
	bookingServices,
	Vendor,
	billsService,
	$stateParams,
	formulaFactory,
	Vehicle,
	billingPartyService,
	consignorConsigneeService,
	customer,
	$rootScope,
	dmsService,
	bookType,
	billBookService,
	tripServices,
	tripMemoUpdate
) {
	let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.getAllUsers = getAllUsers;


	// functions Identifiers
	$scope.submit = submit;
	$scope.closeModal = closeModal;
	$scope.resetForm = resetForm;
	vm.getBillBookNo = getBillBookNo;
	vm.getVendorName = getVendorName;
	vm.getAllBillingParty = getAllBillingParty;
	vm.getCustomers = getCustomers;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
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
	// INIT functions
	(function init() {
		$scope.isShowTripMemo = tripMemo;
		$scope.tripMemoBType = bookType;
		$scope.tripMemoUpdate = tripMemoUpdate;
		vm.aTripData = angular.copy(selectedInfo);
		vm.aTripData.vendorDeal.perUnitPrice = selectedInfo.vendorDeal.weight_per_unit;
		vm.aTripData.vendorDeal.totalUnits = selectedInfo.vendorDeal.total_no_of_units;
		vm.branch = vm.aTripData.vendorDeal.branch;
		// check that user has already prefill the trip memo no, date etc.

		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
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
				let findItem = vm.aVehicleTypes.find(item => item._id === vm.aTripData.vendorDeal.vt);
				if(findItem) {
					vm.aTripData.vendorDeal.vehicle = findItem;
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

	function resetForm() {
		vm.aTripData.vendorDeal = {};
		$rootScope.oTripMemo = {};
		// delete $rootScope.aVehicleSelected[0] && $rootScope.aVehicleSelected[0].gr[0] && $rootScope.aVehicleSelected[0].gr[0].gr_type;
		swal("Success", 'All Trip Memo details are removed successfully', "success");
		$uibModalInstance.dismiss();
	}

	function getBillBookNo(viewValue) {

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
		// 	swal('Warning', 'Please Select Branch', 'warning');
		// 	return [];
		// }

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
		// 	return [];

		if (viewValue != 'centrailized' && !(vm.branch && Array.isArray(vm.branch.tripMemoBook) && vm.branch.tripMemoBook.length))
			return;


		if (!vm.aTripData.vendorDeal.tripMemoDate) {
			swal('Error', 'Trip Memo Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.branch.tripMemoBook ? vm.branch.tripMemoBook.map(o => o.ref) : '',
				type: 'Trip Memo',
				useDate: moment(vm.aTripData.vendorDeal.tripMemoDate).startOf('day').toDate(),
				status: 'unused'
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
						vm.aTripData.vendorDeal.tMemo = response.data[0].bookNo;
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

	vm.onBookNoSelect = function(item) {
		vm.bookInfo = item;
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

	function onCustomerSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.customer = value;
		}
	}



	function onBillingPartySelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.billingParty = value;
		}
	}

	function getAllBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}



	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.munshiyana,
			'total_expense': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.total_expense,
			'otherExp': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.otherExp
		});
		vm.aTripData.vendorDeal.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
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

	function submit(formData) {
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
			// vm.aTripData.vendorDeal.vehicle = vm.aTripData.vendorDeal.vehicle && vm.aTripData.vendorDeal.vehicle._id ? vm.aTripData.vendorDeal.vehicle._id : vm.aTripData.vendorDeal.vehicle;
			if(vm.aTripData.vendorDeal.advance > vm.aTripData.vendorDeal.totWithMunshiyana) {
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
		}
		if((typeof vm.aTripData.vendorDeal.billingParty === 'object') && (vm.aTripData.vendorDeal.billingParty !== null)) {
			vm.aTripData.vendorDeal.billingParty = vm.aTripData.vendorDeal.billingParty && vm.aTripData.vendorDeal.billingParty._id;
		} else {
			delete vm.aTripData.vendorDeal.billingParty;
		}
		if((typeof vm.aTripData.vendorDeal.customer === 'object') && (vm.aTripData.vendorDeal.customer !== null)) {
			vm.aTripData.vendorDeal.customer = vm.aTripData.vendorDeal.customer && vm.aTripData.vendorDeal.customer._id;
		} else {
			delete vm.aTripData.vendorDeal.customer;
		}
		vm.aTripData.vendorDeal['rate'] = vm.aTripData.vendorDeal.total_expense;
		vm.aTripData.vendorDeal['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;
		console.log('vm.aTripData.vendorDeal', vm.aTripData.vendorDeal);
		tripServices.updateTripMemo({tMemo: vm.aTripData.vendorDeal, _id: vm.aTripData.vendorDeal._id}, onSuccess, err => {
			console.log(err);
			swal("Error", err && err.data && err.data.message, "error");
		});

		// Handle success response
		function onSuccess(response) {
			swal("Success", 'All Trip Memo details are update successfully', "success");
			$uibModalInstance.dismiss();
		}
	}


});


