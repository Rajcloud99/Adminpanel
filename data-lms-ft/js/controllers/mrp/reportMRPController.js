/**
 * Created by manish on 23/05/18.
 */
materialAdmin.controller("quotationReportController",
	function ($rootScope, $scope, $uibModal, DateUtils, $state,
			  reportMRPService, customer, otherUtils, branchService, growlService) {

		$scope.allCustomers = [];
		$scope.allBranches = [];
		$scope.parseOaddressToString = otherUtils.parseOaddressToString;
		$scope.getDD_MM_YYYY = otherUtils.getDD_MM_YYYY;

		$scope.getCustomers = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				customer.getAllcustomersCustom({ name: val, sort:1}, function (data) {
					$scope.allCustomers = data;
				});
			} else {
				$scope.allCustomers = [];
			}
		};
		$scope.getCustomers();

		$scope.getBranches = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				branchService.getBranchesTrim({ name: val, sort:1, trim:true, all:true}, function (data) {
					$scope.allBranches = data.data;
				});
			} else {
				$scope.allBranches = [];
			}
		};
		$scope.getBranches();

		$scope.clearCustomerSearch = function () {
			$scope.selectedCustomer = null;
		};

		$scope.clearBranchSearch = function () {
			$scope.selectedBranch = null;
		};

		$scope.getReport = function (ifExcel) {
			let queryObj = {
				"all": true,
				"sort": -1
			};
			let startDate = $scope.start_date ? moment($scope.start_date,"DD-MM-YYYY",true).toDate().toISOString() : null;
			let endDate = $scope.end_date ? moment($scope.end_date,"DD-MM-YYYY",true).toDate().toISOString() : null;

			queryObj.quot_date = (startDate?startDate:"")+ (startDate && endDate?",":"")+ (endDate?endDate:"");
			ifExcel?queryObj.downloadExcel=true:null;
			$scope.quot_status ? queryObj.quot_status = $scope.quot_status : null;
			($scope.selectedCustomer && $scope.selectedCustomer._id) ? queryObj.customer = $scope.selectedCustomer._id : null;
			($scope.selectedBranch && $scope.selectedBranch._id) ? queryObj.branch = $scope.selectedBranch._id : null;

			reportMRPService.getQuotationReport(queryObj, function (response) {
				if (response.status==="OK" && response.data && response.data.length>0) {
					$scope.quotationReport = response.data;
				}else if(response.status==="OK" && response.url && ifExcel){
					let a = document.createElement('a');
					a.href = response.url;
					a.download = response.url;
					a.target = '_blank';
					a.click();
				}else if (response.status==="OK" && !response.data){
					growlService.growl(response.message, "danger", 2);
					$scope.quotationReport = [];
				} else {
					$scope.quotationReport = [];
					growlService.growl(response.message, "danger", 2);
				}
			});
		}
});

materialAdmin.controller("soReportController", function (
		$rootScope,
		$scope,
		$uibModal,
		DateUtils,
		$state,
	  	reportMRPService,
		customer,
		otherUtils,
		branchService,
		growlService
	) {

		$scope.allCustomers = [];
		$scope.allBranches = [];
		$scope.parseOaddressToString = otherUtils.parseOaddressToString;
		$scope.getDD_MM_YYYY = otherUtils.getDD_MM_YYYY;

		$scope.getCustomers = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				customer.getAllcustomersCustom({ name: val, sort:1}, function (data) {
					$scope.allCustomers = data;
				});
			} else {
				$scope.allCustomers = [];
			}
		};
		$scope.getCustomers();

		$scope.getBranches = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				branchService.getBranchesTrim({ name: val, sort:1, trim:true, all:true}, function (data) {
					$scope.allBranches = data.data;
				});
			} else {
				$scope.allBranches = [];
			}
		};
		$scope.getBranches();

		$scope.clearCustomerSearch = function () {
			$scope.selectedCustomer = null;
		};

		$scope.clearBranchSearch = function () {
			$scope.selectedBranch = null;
		};

		$scope.getReport = function (ifExcel) {
			let queryObj = {
				"all": true,
				"sort": -1
			};
			let startDate = $scope.start_date ? moment($scope.start_date,"DD-MM-YYYY",true).toDate().toISOString() : null;
			let endDate = $scope.end_date ? moment($scope.end_date,"DD-MM-YYYY",true).toDate().toISOString() : null;

			queryObj.so_date = (startDate?startDate:"")+ (startDate && endDate?",":"")+ (endDate?endDate:"");

			ifExcel?queryObj.downloadExcel=true:null;
			$scope.status ? queryObj.status = $scope.status : null;
			($scope.selectedCustomer && $scope.selectedCustomer._id) ? queryObj.customer = $scope.selectedCustomer._id : null;
			($scope.selectedBranch && $scope.selectedBranch._id) ? queryObj.branch = $scope.selectedBranch._id : null;

			reportMRPService.getSOReport(queryObj, function (response) {
				if (response.status==="OK" && response.data && response.data.length>0) {
					$scope.soReport = response.data;
				}else if(response.status==="OK" && response.url && ifExcel){
					let a = document.createElement('a');
					a.href = response.url;
					a.download = response.url;
					a.target = '_blank';
					a.click();
				}else if (response.status==="OK" && !response.data){
					growlService.growl(response.message, "danger", 2);
					$scope.soReport = [];
				} else {
					$scope.soReport = [];
					growlService.growl(response.message, "danger", 2);
				}
			});
		}
	});


materialAdmin.controller("invoiceReportController",
	function ($rootScope, $scope, $uibModal, DateUtils, $state,
			  reportMRPService, customer, otherUtils, branchService, growlService) {

		$scope.allCustomers = [];
		$scope.allBranches = [];
		$scope.parseOaddressToString = otherUtils.parseOaddressToString;
		$scope.getDD_MM_YYYY = otherUtils.getDD_MM_YYYY;

		$scope.getCustomers = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				customer.getAllcustomersCustom({ name: val, sort:1}, function (data) {
					$scope.allCustomers = data;
				});
			} else {
				$scope.allCustomers = [];
			}
		};
		$scope.getCustomers();

		$scope.getBranches = function (val) {
			if (val && typeof val === 'string' && val.length >= 2) {
				branchService.getBranchesTrim({ name: val, sort:1, trim:true, all:true}, function (data) {
					$scope.allBranches = data.data;
				});
			} else {
				$scope.allBranches = [];
			}
		};
		$scope.getBranches();

		$scope.clearCustomerSearch = function () {
			$scope.selectedCustomer = null;
		};

		$scope.clearBranchSearch = function () {
			$scope.selectedBranch = null;
		};

		$scope.getReport = function (ifExcel) {
			let startDate = $scope.start_date ? moment($scope.start_date,"DD-MM-YYYY",true).toDate().toISOString() : null;
			let endDate = $scope.end_date ? moment($scope.end_date,"DD-MM-YYYY",true).toDate().toISOString() : null;
			let queryObj = {
				"all": true,
				"sort": -1,
				"invoice_date": startDate + "," + endDate
			};

			ifExcel?queryObj.downloadExcel=true:null;
			$scope.status ? queryObj.status = $scope.status : null;
			($scope.selectedCustomer && $scope.selectedCustomer._id) ? queryObj.customer = $scope.selectedCustomer._id : null;
			($scope.selectedBranch && $scope.selectedBranch._id) ? queryObj.branch = $scope.selectedBranch._id : null;

			reportMRPService.getInvoiceReport(queryObj, function (response) {
				if (response.status==="OK" && response.data && response.data.length>0) {
					$scope.invoiceReport = response.data;
				}else if(response.status==="OK" && response.url && ifExcel){
					let a = document.createElement('a');
					a.href = response.url;
					a.download = response.url;
					a.target = '_blank';
					a.click();
				}else if (response.status==="OK" && !response.data){
					growlService.growl(response.message, "danger", 2);
					$scope.invoiceReport = [];
				} else {
					$scope.invoiceReport = [];
					growlService.growl(response.message, "danger", 2);
				}
			});
		}
	});
