materialAdmin.controller('gpsInventoryController',
	function ($rootScope, $state, $scope, DateUtils, $uibModal, GPSService, ReportService, Pagination) {
		$scope.pagination = Pagination;
		$scope.pagination.pageChanged = function () {
			$scope.getDevice(true);
		};
		//*************** New Date Picker for multiple date selection in single form ************
		$scope.today = function () {
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.toggleMin = function () {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();
		$scope.open = function ($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = true;
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************
		//-------------------****----------------------------------------------------------
		function removeSelectedCSSclass() {
			listItem = $($('.selectItem'));
			listItem.siblings().removeClass('grn22');
		}

		//------------------******************----------------------------------------------
		function addSelectedCSSclass(i) {
			setTimeout(function () {
				listItem = $($('.selectItem')[i]);
				listItem.addClass('grn22');
			}, 100);
		}

		//---------------------***********---------------------------------------------------
		$scope.oSearchGPS = {};
		$scope.aGPS = [];
		$scope.availability = ['In stock', 'Sold', 'Issued', 'In Repobin', 'Scrapped', 'Sent for Repair'];
		$scope.aHealth = ['Healthy', 'Damaged', 'Used'];
		$scope.aAllocation = ['Allocated', 'Un-allocated'];

		function prepareFilterObject(isPagination) {
			let myFilter = {};
			if (isPagination && $scope.pagination.currentPage) {
				myFilter.skip = $scope.pagination.currentPage;
			}
			if ($scope.purchase_invoice_no) {
				myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
			}
			if ($scope.imei) {
				myFilter.imei = $scope.imei;
			}
			if ($scope.po_number) {
				myFilter.po_number = $scope.po_number;
			}
			if ($scope.stock_status) {
				myFilter.stock_status = $scope.stock_status;
			}
			if ($scope.health_status) {
				myFilter.health_status = $scope.health_status;
			}
			if ($scope.allocation_status) {
				myFilter.allocation_status = $scope.allocation_status;
			}

			myFilter.no_of_docs = $scope.pagination.items_per_page;
			return myFilter;
		}

		$scope.selectGPS = function (i) {
			$scope.selectedGPS = $scope.aGPS[i];
			removeSelectedCSSclass();
			addSelectedCSSclass(i);
		};

		$scope.toInStock = function () {
			GPSService.update($scope.selectedGPS._id, {stock_status: 'In stock', imei: $scope.selectedGPS.imei}, (res) => {
				swal('Success', 'Device has been moved to In Stock', 'success');
				$state.reload($state.current, {}, {reload: true});
			}, (err) => {
				swal('Error', res.message, 'error');
				$state.reload($state.current, {}, {reload: true});
			});
		};
		$scope.sendForRepair = function () {
			GPSService.update($scope.selectedGPS._id, {
				stock_status: 'Sent for Repair',
				imei: $scope.selectedGPS.imei
			}, (res) => {
				swal('Success', 'Device has been sent for repair', 'success');
				$state.reload($state.current, {}, {reload: true});
			}, (err) => {
				swal('Error', res.message, 'error');
				$state.reload($state.current, {}, {reload: true});
			});
		};
		$scope.scrapDevice = function () {
			GPSService.update($scope.selectedGPS._id, {stock_status: 'Scrapped', imei: $scope.selectedGPS.imei}, (res) => {
				swal('Success', 'Device has been scrapped', 'success');
				$state.reload($state.current, {}, {reload: true});
			}, (err) => {
				swal('Error', res.message, 'error');
				$state.reload($state.current, {}, {reload: true});
			});
		};

		$scope.getDevice = function (isPagination) {
			let oFilter = prepareFilterObject(isPagination);
			GPSService.getDevice(oFilter, function (res) {
				if (res && res.data) {
					$scope.aGPS = res.data;
					$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
					$scope.pagination.totalItems = res.count;
					if (res.data && res.data[0]) {
						$scope.selectedGPS = $scope.aGPS[0];
						addSelectedCSSclass(0);
					} else {
						$scope.selectedGPS = {};
					}
				}
			}, function (err) {
				swal(err.message, null, 'error');
			});
		};
		$scope.getDevice();
		$scope.inwordsDevice = function () {
			$state.go('gps_master.inventoryInword');
		};
		$scope.allocateDevice = function () {
			$state.go('gps_master.inventoryAllocate');
		};
		$scope.issueDevice = function () {
			$state.go('gps_master.inventoryIssue');
		};
		$scope.returnFromSalesExecutive = function () {
			$state.go('gps_master.returnFromSalesExecutive');
		};
		$scope.returnFromCustomer = function () {
			$state.go('gps_master.returnFromCustomer');
		};
		$scope.replaceDevice = function () {
			$state.go('gps_master.replaceDevice');
		};
		$scope.downloadReport = function (isPagination) {
			var oFilter = prepareFilterObject(isPagination);
			lastFilter = oFilter;
			oFilter.no_of_docs = 100000;
			oFilter.downloadExcel = true;
			ReportService.getGPSInventoryReport(oFilter, function (data) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			});
		};
	});

materialAdmin.controller('deviceInwordCtrl', function ($rootScope, $scope, $state, DateUtils, spareService, maintenanceVendorService_, GPSService) {
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.getAllPOs = function () {
		$scope.inventories = [];
		$scope.selectedInventory = {};

		function prepareQueryFilterObj() {
			let queryFilter = {};
			return queryFilter;
		}

		function success(response) {
			if (response.data && response.data.data.length > 0) {
				$scope.inventories = response.data.data;
			}
		}

		function failure(response) {
			console.log(response);
		}

		spareService.getAllPOForDorpdown(prepareQueryFilterObj(), success, failure);
	};
	$scope.getAllPOs();
	$scope.getVendors = function () {
		function success(response) {
			if (response.data && response.data.length > 0) {
				$scope.aVendors = response.data;
			}
		}

		function failure(response) {
			console.log(response);
		}

		maintenanceVendorService_.getMaintenanceVendorsAll({}, success, failure);
	};
	$scope.getVendors();

	$scope.onPOSelect = function (data) {
		$scope.selectedPO = data;
		if (!$scope.selectedPO.rFreight) {
			$scope.selectedPO.rFreight = $scope.selectedPO.freight;
		} else {
			$scope.selectedPO.freight = $scope.selectedPO.rFreight;
		}
		$scope.selectedPO.cummulative_price = 0;
		for (let i = 0; i < $scope.selectedPO.spare.length; i++) {
			$scope.selectedPO.spare[i].rate_per_piece = $scope.selectedPO.spare[i].rate;
			$scope.selectedPO.spare[i].quantity = $scope.selectedPO.spare[i].remaining_quantity;
			$scope.selectedPO.spare[i].billing_amount = (($scope.selectedPO.spare[i].rate_inc_tax || 0) * ($scope.selectedPO.spare[i].quantity || 0));
			$scope.selectedPO.spare[i].imei_list = [];
			$scope.selectedPO.cummulative_price = $scope.selectedPO.cummulative_price + $scope.selectedPO.spare[i].billing_amount;
			$scope.selectedPO.spare[i].selected = true;
			$scope.selectedPO.spare[i].compTax = $scope.selectedPO.spare[i].tax;
		}
	};

	$scope.checkQty = function (i) {
		if ($scope.selectedPO.spare[i].quantity > $scope.selectedPO.spare[i].remaining_quantity) {
			swal('Quantity must be less then to remaining quantity!!!', '', 'warning');
			$scope.selectedPO.spare[i].quantity = $scope.selectedPO.spare[i].remaining_quantity;
			$scope.selectedPO.spare[i].billing_amount = $scope.selectedPO.spare[i].rate_inc_tax * $scope.selectedPO.spare[i].quantity;
		}
		if ($scope.selectedPO.spare[i].imei_list && ($scope.selectedPO.spare[i].imei_list.length > $scope.selectedPO.spare[i].quantity)) {
			$scope.selectedPO.spare[i].imei_list.length = $scope.selectedPO.spare[i].quantity;
		}
	};

	$scope.calculate = function (i) {
		let rateP = $scope.selectedPO.spare[i].rate;
		if ($scope.selectedPO.spare[i].rate_per_piece == undefined) {
			$scope.selectedPO.spare[i].rate_per_piece = 0;
		}
		if ($scope.selectedPO.spare[i].rate_per_piece <= rateP) {
			$scope.selectedPO.spare[i].rate_inc_tax = ($scope.selectedPO.spare[i].rate_per_piece + ($scope.selectedPO.spare[i].rate_per_piece * ($scope.selectedPO.spare[i].tax / 100)));
			$scope.selectedPO.spare[i].billing_amount = (($scope.selectedPO.spare[i].rate_inc_tax || 0) * ($scope.selectedPO.spare[i].quantity || 0));
			$scope.selectedPO.spare[i].billing_amount = Math.ceil($scope.selectedPO.spare[i].billing_amount * 100) / 100;
			$scope.selectedPO.spare[i].rate_inc_tax = Math.ceil($scope.selectedPO.spare[i].rate_inc_tax * 100) / 100;
		} else {
			$scope.selectedPO.spare[i].rate_per_piece = rateP;
		}
	};
	$scope.addIMEI = function (imei, max, i) {
		if ($scope.selectedPO.spare[i].imei_list.length < max) {
			if ($scope.selectedPO.spare[i].imei_list.indexOf(imei) == -1) {
				$scope.selectedPO.spare[i].imei_list.push(imei);
				$scope.selectedPO.spare[i].newIMEIData = undefined;
			} else {
				swal('Alert!!!', 'IMEI number is already added.', 'warning');
			}
		} else {
			swal('Alert!!!', 'IMEI list can not greater than quantity.', 'warning');
		}
	};
	$scope.removeIMEI = function (code, i) {
		let index = $scope.selectedPO.spare[i].imei_list.indexOf(code);
		if (index > -1) {
			$scope.selectedPO.spare[i].imei_list.splice(index, 1);
		}
	};

	function success(res) {
		if (res) {
			swal('Success', res.message, 'success');
			$state.reload();
		}
	}

	function failure(res) {
		swal('Failed', res.message, 'error');
	}

	$scope.inwordDevice = function (selectedData) {
		let oData = angular.copy(selectedData);
		let aSelectedDevices = oData.spare.filter(function (value) {
			return value.selected;
		});
		let toSend = {
			'purchased_from': oData.vendor_id,
			'po_number': oData.ponumder,
			'po_ref': oData._id,
			'branch': oData.branch,
			'purchase_invoice_no': $scope.invoice_number
		};
		if (aSelectedDevices.length > 0) {
			let toAdd = true;
			let message = '';
			for (let n = 0; n < aSelectedDevices.length; n++) {
				if (aSelectedDevices[n].imei_list.length !== aSelectedDevices[n].quantity) {
					let value = 'Spare ' + aSelectedDevices[n].name + ' must have ' + aSelectedDevices[n].quantity + ' IMEI numbers. \n';
					message = message + value;
					toAdd = false;
				}
			}
			if (toAdd) {
				toSend.items = aSelectedDevices;
				GPSService.addDevice(toSend, success, failure);
			} else {
				swal('Alert!!!', message, 'warning');
			}
		} else {
			swal('Alert!!!', 'Please Select any device to inward.', 'warning');
		}
	};
});

materialAdmin.controller('deviceAllocateCtrl', function ($rootScope, $scope, $state, Pagination, DateUtils, spareService, maintenanceVendorService_, GPSService, customer) {
	$scope.pagination = Pagination;
	$scope.pagination.pageChanged = function () {
		$scope.getDevice(true);
	};
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.selectedAll = false;
	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		$scope.aGPS.forEach(function (item) {
			item.selected = $scope.selectedAll;
		});
	};

	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		if ($scope.selectedAll) {
			$scope.aGPS.forEach(function (item) {
				let gps = angular.copy(item);
				let found = findIMEI(gps);
				if (found && found.imei) {
					//swal("IMEI "+found.imei+" is already alloted","Please select other device","warning")
				} else {
					$scope.aAllotedGPS.push(gps);
				}
			});
		} else {
			$scope.aAllotedGPS = [];
		}

	};
	$scope.aGPS = [];
	$scope.aAllotedGPS = [];
	$scope.availability = ['In stock', 'Sold'];
	$scope.aHealth = ['Healthy', 'Damaged'];

	$scope.stock_status = $scope.availability[0];
	$scope.health_status = $scope.aHealth[0];

	function prepareFilterObject(isPagination) {
		let myFilter = {allocation_status: 'Un-allocated'};
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		if ($scope.purchase_invoice_no) {
			myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
		}
		if ($scope.imei) {
			myFilter.imei = $scope.imei;
		}
		if ($scope.po_number) {
			myFilter.po_number = $scope.po_number;
		}
		if ($scope.stock_status) {
			myFilter.stock_status = $scope.stock_status;
		}
		if ($scope.health_status) {
			myFilter.health_status = $scope.health_status;
		}

		myFilter.no_of_docs = $scope.pagination.items_per_page;
		return myFilter;
	}

	$scope.getDevice = function (isPagination) {
		let oFilter = prepareFilterObject(isPagination);
		GPSService.getDevice(oFilter, function (res) {
			if (res && res.data) {

				$scope.aGPS = res.data;
				$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectedAll = false;
					//$scope.selectedGPS = $scope.aGPS[0];
				}
			}
		});
	};
	$scope.getDevice();

	function oSucC(response) {
		$scope.aCustomer = response.data.data;
	}

	function oFailC(response) {
		console.log(response);
	}

	$scope.clearSearch = function () {
		$scope.customerName = '';
		$scope.getCname($scope.customerName);
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			customer.getCname(viewValue, oSucC, oFailC);
		}
	};

	$scope.clearIMEISearch = function () {
		$scope.imeiNumber = '';
		$scope.getIMEI($scope.imeiNumber);
	};

	$scope.getIMEI = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			GPSService.getDevice({imei: viewValue, allocation_status: 'Un-allocated'}, function (res) {
				if (res && res.data) {
					$scope.aIMEI = res.data;
				}
			});
		}
	};

	function findIMEI(oData) {
		let gps = angular.copy(oData);
		return $scope.aAllotedGPS.find(function (o) {
			return o.imei === gps.imei;
		});
	}

	$scope.selectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let found = findIMEI(gps);
		if (found && found.imei) {
			swal('IMEI ' + found.imei + ' is already alloted', 'Please select other device', 'warning');
		} else {
			$scope.aAllotedGPS.push(gps);
		}
	};
	$scope.DeselectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let index = $scope.aAllotedGPS.findIndex(function (x) {
			return x.imei == gps.imei;
		});
		if (index > -1) {
			$scope.aAllotedGPS.splice(index, 1);
		} else {
			swal('IMEI ' + gps.imei + ' not found.', '', 'warning');
		}
	};

	$scope.submitData = function () {
		if ($scope.aAllotedGPS.length > 0) {
			if ($scope.customerName.gpsgaadi && $scope.customerName.gpsgaadi.user_id) {
				let dataToSubmit = {
					customer: $scope.customerName,
					devices: $scope.aAllotedGPS.map(a => {
						let obj = {};
						obj.device_type = a.part_ref.name.toLowerCase();
						obj.imei = a.imei;
						return obj;
					})
				};
				GPSService.allot_gps(dataToSubmit, function (res) {
					$scope.aAllotedGPS = [];
					swal('Success', res.message, 'success');
				}, function (res) {
					swal('Failed', res.message, 'error');
				});
			} else {
				swal('', 'Selected customer does not have GPS User ID.', 'warning');
			}
		} else {
			swal('Please select devices..', '', 'warning');
		}
	};
});

materialAdmin.controller('deviceIssueCtrl', function ($localStorage, $rootScope, $scope, $state, Pagination, DateUtils, spareService, maintenanceVendorService_, GPSService, customer, userService) {
	$scope.pagination = Pagination;
	$scope.pagination.pageChanged = function () {
		$scope.getDevice(true);
	};
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.selectedAll = false;
	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		$scope.aGPS.forEach(function (item) {
			item.selected = $scope.selectedAll;
		});
	};

	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		if ($scope.selectedAll) {
			$scope.aGPS.forEach(function (item) {
				let gps = angular.copy(item);
				let found = findIMEI(gps);
				if (found && found.imei) {
					//swal("IMEI "+found.imei+" is already alloted","Please select other device","warning")
				} else {
					$scope.aAllotedGPS.push(gps);
				}
			});
		} else {
			$scope.aAllotedGPS = [];
		}

	};
	$scope.aGPS = [];
	$scope.aAllotedGPS = [];
	$scope.availability = ['In stock', 'Sold'];
	$scope.aHealth = ['Healthy', 'Damaged'];

	$scope.stock_status = $scope.availability[0];
	$scope.health_status = $scope.aHealth[0];

	function prepareFilterObject(isPagination) {
		let myFilter = {allocation_status: 'Un-allocated'};
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		if ($scope.purchase_invoice_no) {
			myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
		}
		if ($scope.imei) {
			myFilter.imei = $scope.imei;
		}
		if ($scope.po_number) {
			myFilter.po_number = $scope.po_number;
		}
		if ($scope.stock_status) {
			myFilter.stock_status = $scope.stock_status;
		}
		if ($scope.health_status) {
			myFilter.health_status = $scope.health_status;
		}

		myFilter.no_of_docs = $scope.pagination.items_per_page;
		return myFilter;
	}

	$scope.getDevice = function (isPagination) {
		let oFilter = prepareFilterObject(isPagination);
		GPSService.getDevice(oFilter, function (res) {
			if (res && res.data) {
				$scope.aGPS = res.data;
				$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectedAll = false;
					//$scope.selectedGPS = $scope.aGPS[0];
				}
			}
		});
	};
	$scope.getDevice();

	$scope.clearSearch = function () {
		$scope.issued_to = null;
		$scope.salesExecutiveUsers = [];
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && typeof viewValue === 'string' && viewValue.length > 1) {
			userService.getUserNames(viewValue + '&user_type=SalesExecutive', function oSucC(res) {
				$scope.salesExecutiveUsers = res.data;
			}, function oFailC(err) {
				console.log(err);
			});
		}
	};

	$scope.clearIMEISearch = function () {
		$scope.imeiNumber = '';
		$scope.getIMEI($scope.imeiNumber);
	};

	$scope.getIMEI = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			GPSService.getDevice({imei: viewValue, allocation_status: 'Un-allocated'}, function (res) {
				if (res && res.data) {
					$scope.aIMEI = res.data;
				}
			});
		}
	};

	function findIMEI(oData) {
		let gps = angular.copy(oData);
		return $scope.aAllotedGPS.find(function (o) {
			return o.imei === gps.imei;
		});
	}

	$scope.selectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let found = findIMEI(gps);
		if (found && found.imei) {
			swal('IMEI ' + found.imei + ' is already alloted', 'Please select other device', 'warning');
		} else {
			$scope.aAllotedGPS.push(gps);
		}
	};
	$scope.DeselectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let index = $scope.aAllotedGPS.findIndex(function (x) {
			return x.imei == gps.imei;
		});
		if (index > -1) {
			$scope.aAllotedGPS.splice(index, 1);
		} else {
			swal('IMEI ' + gps.imei + ' not found.', '', 'warning');
		}
	};

	$scope.submitData = function () {
		if ($scope.aAllotedGPS.length > 0) {
			// if($scope.customerName.gpsgaadi && $scope.customerName.gpsgaadi.user_id){
			let dataToSubmit = {
				issued_date: new Date(),
				issued_by: $localStorage.ft_data.userLoggedIn._id,
				issued_to: $scope.issued_to._id,
				devices: $scope.aAllotedGPS.map(a => {
					return {
						device_ref: a._id,
						device_name: a.part_ref.name,
						imei: a.imei
					};
				})
			};
			GPSService.issue_gps(dataToSubmit, function (res) {
				swal(res.message, '', 'success');
				$state.go('gps_master.gpsInventory', {}, {reload: true});
			}, function (res) {
				swal('Failed', res.message, 'error');
				$state.go('gps_master.gpsInventory', {}, {reload: true});
			});
			// }else {
			// 	swal("","Selected customer does not have GPS User ID.","warning");
			// }
		} else {
			swal('Please select devices..', '', 'warning');
		}
	};
});

materialAdmin.controller('returnFromSalesExecutiveCtrl', function ($localStorage, $rootScope, $scope, $state, Pagination, DateUtils, spareService, maintenanceVendorService_, GPSService, customer, userService) {
	$scope.pagination = Pagination;
	$scope.pagination.pageChanged = function () {
		$scope.getDevice(true);
	};
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.selectedAll = false;
	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		$scope.aGPS.forEach(function (item) {
			item.selected = $scope.selectedAll;
		});
	};

	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		if ($scope.selectedAll) {
			$scope.aGPS.forEach(function (item) {
				let gps = angular.copy(item);
				let found = findIMEI(gps);
				if (found && found.imei) {
					//swal("IMEI "+found.imei+" is already alloted","Please select other device","warning")
				} else {
					$scope.aAllotedGPS.push(gps);
				}
			});
		} else {
			$scope.aAllotedGPS = [];
		}

	};
	$scope.aGPS = [];
	$scope.aAllotedGPS = [];
	$scope.availability = ['In stock', 'Sold', 'Issued', 'In Repobin'];
	$scope.aHealth = ['Healthy', 'Damaged'];
	$scope.aReasons = ['New', 'Old', 'Damaged'];
	$scope.stock_status = $scope.availability[2];

	// $scope.health_status = $scope.aHealth[0];

	function prepareFilterObject(isPagination) {
		let myFilter = {issued_to: $scope.issued_to._id};
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		if ($scope.purchase_invoice_no) {
			myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
		}
		if ($scope.imei) {
			myFilter.imei = $scope.imei;
		}
		if ($scope.po_number) {
			myFilter.po_number = $scope.po_number;
		}
		if ($scope.stock_status) {
			myFilter.stock_status = $scope.stock_status;
		}
		if ($scope.health_status) {
			myFilter.health_status = $scope.health_status;
		}
		myFilter.no_of_docs = $scope.pagination.items_per_page;
		return myFilter;
	}

	$scope.getDevice = function (isPagination) {
		let oFilter = prepareFilterObject(isPagination);
		GPSService.getDevice(oFilter, function (res) {
			if (res && res.data) {
				$scope.aGPS = res.data;
				$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectedAll = false;
					//$scope.selectedGPS = $scope.aGPS[0];
				}
			}
		});
	};

	$scope.clearSearch = function () {
		$scope.issued_to = null;
		$scope.salesExecutiveUsers = [];
		$scope.aGPS = [];
		$scope.aAllotedGPS = [];
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && typeof viewValue === 'string' && viewValue.length > 1) {
			userService.getUserNames(viewValue + '&user_type=SalesExecutive', function oSucC(res) {
				$scope.salesExecutiveUsers = res.data;
			}, function oFailC(err) {
				console.log(err);
			});
		}
	};

	$scope.$watch('issued_to', function (newVal, oldVal) {
		if ($scope.issued_to && $scope.issued_to._id) {
			$scope.getDevice();
		}
	});

	$scope.clearIMEISearch = function () {
		$scope.imeiNumber = '';
		$scope.getIMEI($scope.imeiNumber);
	};

	$scope.getIMEI = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			GPSService.getDevice({imei: viewValue, allocation_status: 'Un-allocated'}, function (res) {
				if (res && res.data) {
					$scope.aIMEI = res.data;
				}
			});
		}
	};

	function findIMEI(oData) {
		let gps = angular.copy(oData);
		return $scope.aAllotedGPS.find(function (o) {
			return o.imei === gps.imei;
		});
	}

	$scope.selectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let found = findIMEI(gps);
		if (found && found.imei) {
			swal('IMEI ' + found.imei + ' is already alloted', 'Please select other device', 'warning');
		} else {
			$scope.aAllotedGPS.push(gps);
		}
	};
	$scope.DeselectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let index = $scope.aAllotedGPS.findIndex(function (x) {
			return x.imei == gps.imei;
		});
		if (index > -1) {
			$scope.aAllotedGPS.splice(index, 1);
		} else {
			swal('IMEI ' + gps.imei + ' not found.', '', 'warning');
		}
	};

	$scope.submitData = function () {
		if ($scope.aAllotedGPS.length > 0) {
			// if($scope.customerName.gpsgaadi && $scope.customerName.gpsgaadi.user_id){
			let dataToSubmit = {
				returned_by: $scope.issued_to._id,
				returned_to: $localStorage.ft_data.userLoggedIn._id,
				returned_date: new Date(),
				devices: $scope.aAllotedGPS.map(a => {
					return {
						device_ref: a._id,
						device_name: a.part_ref.name,
						imei: a.imei,
						return_reason: a.return_reason,
						return_remark: a.return_remark
					};
				})
			};
			GPSService.returnFromSalesExecutive(dataToSubmit, function (res) {
				$scope.aAllotedGPS = [];
				swal('Success', res.message, 'success');
				$state.go('gps_master.gpsInventory');
			}, function (res) {
				swal('Failed', res.message, 'error');
				$state.go('gps_master.gpsInventory');
			});
			// }else {
			// 	swal("","Selected customer does not have GPS User ID.","warning");
			// }
		} else {
			swal('Please select devices..', '', 'warning');
		}
	};
});

materialAdmin.controller('returnFromCustomerCtrl', function ($rootScope, $scope, $state, Pagination, DateUtils, spareService, maintenanceVendorService_, GPSService, customer, userService) {
	$scope.pagination = Pagination;
	$scope.pagination.pageChanged = function () {
		$scope.getDevice(true);
	};
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.selectedAll = false;
	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		$scope.aGPS.forEach(function (item) {
			item.selected = $scope.selectedAll;
		});
	};

	$scope.selectAll = function () {
		$scope.selectedAll = !$scope.selectedAll;
		if ($scope.selectedAll) {
			$scope.aGPS.forEach(function (item) {
				let gps = angular.copy(item);
				let found = findIMEI(gps);
				if (found && found.imei) {
					//swal("IMEI "+found.imei+" is already alloted","Please select other device","warning")
				} else {
					$scope.aAllotedGPS.push(gps);
				}
			});
		} else {
			$scope.aAllotedGPS = [];
		}

	};
	$scope.aGPS = [];
	$scope.aAllotedGPS = [];
	$scope.availability = ['In stock', 'Sold', 'Issued', 'In Repobin'];
	$scope.aHealth = ['Healthy', 'Damaged'];
	$scope.aReasons = ['New', 'Old', 'Damaged'];
	$scope.allAllocStat = ['Allocated', 'Un-allocated'];
	$scope.allocation_status = $scope.allAllocStat[0];
	$scope.stock_status = $scope.availability[1];

	// $scope.health_status = $scope.aHealth[0];

	function prepareFilterObject(isPagination) {
		let myFilter = {issued_to: $scope.issued_to._id};
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		if ($scope.purchase_invoice_no) {
			myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
		}
		if ($scope.allocation_status) {
			myFilter.allocation_status = $scope.allocation_status;
		}
		if ($scope.imei) {
			myFilter.imei = $scope.imei;
		}
		if ($scope.po_number) {
			myFilter.po_number = $scope.po_number;
		}
		if ($scope.stock_status) {
			myFilter.stock_status = $scope.stock_status;
		}
		if ($scope.health_status) {
			myFilter.health_status = $scope.health_status;
		}
		myFilter.no_of_docs = $scope.pagination.items_per_page;
		return myFilter;
	}

	$scope.getDevice = function (isPagination) {
		let oFilter = prepareFilterObject(isPagination);
		GPSService.getDevice(oFilter, function (res) {
			if (res && res.data) {
				$scope.aGPS = res.data;
				$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectedAll = false;
					// $scope.selectedGPS = $scope.aGPS[0];
				}
			}
		});
	};

	$scope.clearSearch = function () {
		$scope.issued_to = null;
		$scope.customers = [];
		$scope.aGPS = [];
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && typeof viewValue === 'string' && viewValue.length > 1) {
			customer.getCname(viewValue, function oSucC(res) {
				$scope.customers = res.data.data;
			}, function oFailC(err) {
				console.log(err);
			});
		}
	};

	$scope.$watch('issued_to', function (newVal, oldVal) {
		if ($scope.issued_to && $scope.issued_to._id) {
			$scope.getDevice();
		}
	});

	$scope.clearIMEISearch = function () {
		$scope.imeiNumber = '';
		$scope.getIMEI($scope.imeiNumber);
	};

	$scope.getIMEI = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			GPSService.getDevice({imei: viewValue, allocation_status: 'Un-allocated'}, function (res) {
				if (res && res.data) {
					$scope.aIMEI = res.data;
				}
			});
		}
	};

	function findIMEI(oData) {
		let gps = angular.copy(oData);
		return $scope.aAllotedGPS.find(function (o) {
			return o.imei === gps.imei;
		});
	}

	$scope.selectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let found = findIMEI(gps);
		if (found && found.imei) {
			swal('IMEI ' + found.imei + ' is already alloted', 'Please select other device', 'warning');
		} else {
			$scope.aAllotedGPS.push(gps);
		}
	};
	$scope.DeselectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let index = $scope.aAllotedGPS.findIndex(function (x) {
			return x.imei == gps.imei;
		});
		if (index > -1) {
			$scope.aAllotedGPS.splice(index, 1);
		} else {
			swal('IMEI ' + gps.imei + ' not found.', '', 'warning');
		}
	};

	$scope.submitData = function () {
		if ($scope.aAllotedGPS.length > 0) {
			// if($scope.customerName.gpsgaadi && $scope.customerName.gpsgaadi.user_id){
			let dataToSubmit = {
				returned_by_customer: $scope.issued_to._id,
				returned_to: $localStorage.ft_data.userLoggedIn._id,
				returned_date: new Date(),
				devices: $scope.aAllotedGPS.map(a => {
					return {
						device_ref: a._id,
						device_name: a.part_ref.name,
						imei: a.imei,
						return_reason: a.return_reason,
						return_remark: a.return_remark
					};
				})
			};
			GPSService.returnFromSalesExecutive(dataToSubmit, function (res) {
				$scope.aAllotedGPS = [];
				swal('Success', res.message, 'success');
				$state.go('gps_master.gpsInventory');
			}, function (res) {
				swal('Failed', res.message, 'error');
				$state.go('gps_master.gpsInventory');
			});
			// }else {
			// 	swal("","Selected customer does not have GPS User ID.","warning");
			// }
		} else {
			swal('Please select devices..', '', 'warning');
		}
	};
});

materialAdmin.controller('replaceDeviceCtrl', function ($localStorage, $rootScope, $scope, $state, Pagination, DateUtils, spareService, maintenanceVendorService_, GPSService, customer) {
	$scope.pagination = Pagination;
	$scope.pagination.pageChanged = function () {
		$scope.getDevice(true);
	};
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
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

	$scope.aGPS = [];
	$scope.aAllotedGPS = [];
	$scope.availability = ['In stock', 'Sold', 'Issued', 'In Repobin', 'Scrapped', 'Sent for Repair'];
	$scope.aHealth = ['Healthy', 'Damaged', 'Used'];
	$scope.stock_status = $scope.availability[0];
	$scope.health_status = $scope.aHealth[0];
	$scope.aReasons = ['New','Old','Damaged'];

	function prepareFilterObject(isPagination) {
		let myFilter = {allocation_status: 'Un-allocated'};
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		if ($scope.purchase_invoice_no) {
			myFilter.purchase_invoice_no = $scope.purchase_invoice_no;
		}
		if ($scope.imei) {
			myFilter.imei = $scope.imei;
		}
		if ($scope.po_number) {
			myFilter.po_number = $scope.po_number;
		}
		if ($scope.stock_status) {
			myFilter.stock_status = $scope.stock_status;
		}
		if ($scope.health_status) {
			myFilter.health_status = $scope.health_status;
		}
		myFilter.no_of_docs = $scope.pagination.items_per_page;
		return myFilter;
	}

	$scope.getDevice = function (isPagination) {
		let oFilter = prepareFilterObject(isPagination);
		GPSService.getDevice(oFilter, function (res) {
			if (res && res.data) {
				$scope.aGPS = res.data;
				$scope.pagination.total_pages = res.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectedAll = false;
					//$scope.selectedGPS = $scope.aGPS[0];
				}
			}
		});
	};
	$scope.getDevice();

	$scope.clearSearch1 = function () {
		$scope.issued_to = '';
		$scope.aAllotedGPS = [];
	};

	$scope.getCname1 = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			customer.getCname(viewValue, function oSucC(response) {
				$scope.aCustomer = response.data.data;
			}, function oFailC(response) {
				console.log(response);
			});
		}
	};

	$scope.getIMEI = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			GPSService.getDevice({imei: viewValue, allocation_status: 'Un-allocated'}, function (res) {
				if (res && res.data) {
					$scope.aIMEI = res.data;
				}
			});
		}
	};

	function findIMEI(oData) {
		let gps = angular.copy(oData);
		return $scope.aAllotedGPS.find(function (o) {
			return o.imei === gps.imei;
		});
	}

	$scope.selectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let found = findIMEI(gps);
		if (found && found.imei) {
			swal('IMEI ' + found.imei + ' is already alloted', 'Please select other device', 'warning');
		} else {
			$scope.aAllotedGPS.push(gps);
		}
	};
	$scope.DeselectMe = function (oGPS) {
		let gps = angular.copy(oGPS);
		let index = $scope.aAllotedGPS.findIndex(function (x) {
			return x.imei == gps.imei;
		});
		if (index > -1) {
			$scope.aAllotedGPS.splice(index, 1);
		} else {
			swal('IMEI ' + gps.imei + ' not found.', '', 'warning');
		}
	};

	$scope.selectGPS = function (i) {
		$scope.selectedGPS = $scope.aGPS[i];
		removeSelectedCSSclass();
		addSelectedCSSclass(i);
	};

	function removeSelectedCSSclass() {
		listItem = $($('.selectItem'));
		listItem.siblings().removeClass('grn22');
	}

	function addSelectedCSSclass(i) {
		setTimeout(function () {
			listItem = $($('.selectItem')[i]);
			listItem.addClass('grn22');
		}, 100);
	}

	$scope.selectAllotedGPS = function (i) {
		$scope.selectedAllotedGPS = $scope.aAllotedGPS[i];
		removeSelectedCSSclass1();
		addSelectedCSSclass1(i);
	};

	function removeSelectedCSSclass1() {
		listItem = $($('.selectItem1'));
		listItem.siblings().removeClass('grn22');
	}

	function addSelectedCSSclass1(i) {
		setTimeout(function () {
			listItem = $($('.selectItem1')[i]);
			listItem.addClass('grn22');
		}, 100);
	}

	$scope.$watch('issued_to', function (newVal, oldVal) {
		if ($scope.issued_to && $scope.issued_to._id) {
			$scope.getDevicesOfCustomer();
		}
	});
	$scope.getDevicesOfCustomer = function (isPagination) {
		GPSService.getDevice({allocation_status: 'Allocated', allocated_to: $scope.issued_to._id}, function (res) {
			if (res && res.data) {
				$scope.aAllotedGPS = res.data;
			}
		});
	};
	$scope.submitData = function () {
		if ($scope.issued_to.gpsgaadi && $scope.issued_to.gpsgaadi.user_id) {
			$scope.selectedAllotedGPS.return_reason = $scope.return_reason;
			$scope.selectedAllotedGPS.return_remark = $scope.return_remark;
			let dataToSubmit = {
				returned_by_customer: $scope.issued_to._id,
				returned_to: $localStorage.ft_data.userLoggedIn._id,
				returned_date: new Date(),
				devices: [$scope.selectedAllotedGPS].map(a => {
					return {
						device_ref: a._id,
						device_name: a.part_ref.name,
						imei: a.imei,
						return_reason: a.return_reason,
						return_remark: a.return_remark
					};
				}),
				new_devices: [$scope.selectedGPS].map(a => {
					return {
						device_ref: a._id,
						device_name: a.part_ref.name,
						imei: a.imei
					};
				})
			};
			GPSService.replaceDevice(dataToSubmit, function (res) {
				swal('Success', res.message, 'success');
				$state.go('gps_master.gpsInventory', {}, {reload: true});
			}, function (res) {
				swal('Failed', res.message, 'error');
				$state.go('gps_master.gpsInventory', {}, {reload: true});
			});
		} else {
			swal('', 'Selected customer does not have GPS User ID.', 'warning');
		}
	};
});
