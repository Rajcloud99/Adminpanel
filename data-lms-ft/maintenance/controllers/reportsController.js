materialAdmin.controller("PRreportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aPRreportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    /*$scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getTyreIssueReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
                $scope.aPRreport = data.data.data;
            }
        });
    }*/
    $scope.downloadReport();
});

materialAdmin.controller("spareInvReportController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService,$uibModal,DateUtils, inventoryService,spareService,ReportService) {
        $scope.inventories=[];
        $scope.selectedInventory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        var lastFilter;

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

		$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************

        /*$scope.getAllPO = function(){
            function succ(data) {
              $scope.aPO = data.data.data;
            }
            spareService.getPOserv({all:true}, succ);
        };
        $scope.getAllPO();*/

        $scope.getAllPOvendor = function(){
            function succ(data) {
                $scope.aPOvendor = data.data.data;
            }
            spareService.getAllPOvendorServ({all:true}, succ);
        };
        $scope.getAllPOvendor();

        $scope.getAllSpares = function() {
            function success(data) {
                $scope.aSpare = data.data.data;
            }
            spareService.getAllSpareListAll({}, success);
        };
        $scope.getAllSpares();

        function prepareFilterObject(isPagination){
            var allowedKey = ['spare_name','vendor_name','po_number','invoice_number','start_date','end_date'];
            var myFilter = {};
            for (var i = 0; i < allowedKey.length; i++) {
                if($scope[allowedKey[i]]){
                    myFilter[allowedKey[i]] = $scope[allowedKey[i]];
                }
            }
            if(isPagination && $scope.currentPage){
                myFilter.skip = $scope.currentPage;
            }
            myFilter.all = true;
            return myFilter;
        };
        $scope.getAllAggreInventories = function(isPagination){
            $scope.inventories=[];
            $scope.selectedInventory={};

            function success(response){
                if(response.data && response.data.length>0){
                    $scope.inventories = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectInventoryAtIndex(0);
                }
            }
            function failure(response){
                console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
            inventoryService.getAggreInventories(oFilter,success,failure);
        };
        $scope.getAllAggreInventories();

        $scope.selectInventoryAtIndex = function (index) {
            $scope.selectedInventory = $scope.inventories[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllInventories(true);
        };

        $scope.downloadReport = function(){
            ReportService.getAggreInventoryReport(lastFilter, function(data) {
              var a = document.createElement('a');
              a.href = data.data.url;
              a.download = data.data.url;
              a.target = '_blank';
              a.click();
            });
        }
    });

materialAdmin.controller("spareInvInwardReportController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService,$uibModal,DateUtils, inventoryService,spareService,ReportService) {
        $scope.inventories=[];
        $scope.selectedInventory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        var lastFilter;

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

		$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************

        /*$scope.getAllPO = function(){
            function succ(data) {
              $scope.aPO = data.data.data;
            }
            spareService.getPOserv({all:true}, succ);
        };
        $scope.getAllPO();*/

        $scope.getAllPOvendor = function(){
            function succ(data) {
                $scope.aPOvendor = data.data.data;
            }
            spareService.getAllPOvendorServ({all:true}, succ);
        };
        $scope.getAllPOvendor();

        $scope.getAllSpares = function() {
            function success(data) {
                $scope.aSpare = data.data.data;
            }
            spareService.getAllSpareListAll({}, success);
        };
        $scope.getAllSpares();

        function prepareFilterObject(isPagination){
            var allowedKey = ['spare_name','vendor_name','po_number','invoice_number','start_date','end_date'];
            var myFilter = {};
            for (var i = 0; i < allowedKey.length; i++) {
                if($scope[allowedKey[i]]){
                    myFilter[allowedKey[i]] = $scope[allowedKey[i]];
                }
            }
            if(isPagination && $scope.currentPage){
                myFilter.skip = $scope.currentPage;
            }
            return myFilter;
        };
        $scope.getAllInvInward = function(isPagination){
            $scope.inventories=[];
            $scope.selectedInventory={};

            function success(response){
                if(response.data && response.data.data.length>0){
                    $scope.inventories = response.data.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectInventoryAtIndex(0);
                }
            }
            function failure(response){
                console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
            ReportService.getInvInward(oFilter,success,failure);
        };
        $scope.getAllInvInward();

        $scope.selectInventoryAtIndex = function (index) {
            $scope.selectedInventory = $scope.inventories[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllInventories(true);
        };

        $scope.downloadReport = function(){
            lastFilter.download = true;
            ReportService.getInvInward(lastFilter, function(data) {
              var a = document.createElement('a');
              a.href = data.data.url;
              a.download = data.data.url;
              a.target = '_blank';
              a.click();
            });
        }
    });

materialAdmin.controller("inventorySnapshotController",
	function($rootScope, $state, $scope, $timeout, $localStorage, growlService,$uibModal,DateUtils, inventoryService,spareService,ReportService) {
		$scope.inventories=[];
		$scope.selectedInventory={};
		$scope.indexSelectedFromList=0;
		$scope.searchValue ="";
		$scope.currentMode = "view";
		var lastFilter;

		//*************** New Date Picker for multiple date selection in single form ************
		/*$scope.today = function() {
			$scope.dt = new Date();
		};
		$scope.today();*/

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();
		$scope.open = function($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = true;

		};
		$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************
		$scope.avlDates= [
			/*"2017-09-27T09:16:25.346Z",
			"2017-09-25T09:34:02.338Z"*/
		];
		//$scope.date = Date.parse($scope.avlDates[0]);
		$scope.today = function() {
			$scope.date = new Date();
		};
		$scope.today();

		$scope.dateOptions = {
			//dateDisabled: disabledTest,
			showWeeks: false
		};

		var dayDuration = 60 * 60 * 24 * 1000;

		function areDatesEqual(date1, date2) {
			return (parseInt(date1 / dayDuration)) == (parseInt(date2 / dayDuration));
		}

		$scope.disabled = function(date, mode) {
			var isRealDate = false;
			for (var i = 0; i < $scope.avlDates.length; i++) {
				var changedDate = Date.parse(new Date($scope.avlDates[i]));
				if (areDatesEqual(changedDate, date)) {
					isRealDate = true;
				}
			}
			return mode === 'day' && !isRealDate;
		}



		$scope.getSnapDates = function(){
			function succ(data) {
				$scope.avlDates = data.data.data;
				$scope.date = new Date($scope.avlDates[$scope.avlDates.length-1]);
			}
			inventoryService.getSnapDateService({}, succ);
		};
		$scope.getSnapDates();

		/*$scope.getAllPOvendor = function(){
			function succ(data) {
				$scope.aPOvendor = data.data.data;
			}
			spareService.getAllPOvendorServ({all:true}, succ);
		};
		$scope.getAllPOvendor();*/

		/*$scope.getAllSpares = function() {
			function success(data) {
				$scope.aSpare = data.data.data;
			}
			spareService.getAllSpareListAll({}, success);
		};
		$scope.getAllSpares();*/

		function prepareFilterObject(isPagination){
			var allowedKey = ['date'];
			var myFilter = {};
			for (var i = 0; i < allowedKey.length; i++) {
				if($scope[allowedKey[i]]){
					myFilter[allowedKey[i]] = $scope[allowedKey[i]];
				}
			}
			if(isPagination && $scope.currentPage){
				myFilter.skip = $scope.currentPage;
			}
			myFilter.all = true;
			return myFilter;
		};
		$scope.getAllInvSnapshot = function(isPagination){
			$scope.inventories=[];
			$scope.selectedInventory={};

			function success(response){
				if(response.data && response.data.data.length>0){
					$scope.inventories = response.data.data;
					/*$scope.totalPages = response.pages;
					$scope.totalItems = 10*response.pages;*/
					$scope.selectInventoryAtIndex(0);
				}
			}
			function failure(response){
				console.log(response);
			}
			var oFilter = prepareFilterObject(isPagination);
			lastFilter = oFilter;
			inventoryService.getInvSnapshot(oFilter,success,failure);
		};
		//$scope.getAllInvSnapshot();

		$scope.selectInventoryAtIndex = function (index) {
			$scope.selectedInventory = $scope.inventories[index];
			$scope.indexSelectedFromList=index;
			$scope.currentMode = "view";
			setTimeout(function(){
				var listItem = $($('.lv-item')[index]);
				listItem.siblings().removeClass('grn');
				listItem.addClass('grn');
			}, 0);
		};

		$scope.pageChanged = function() {
			$scope.getAllInventories(true);
		};

		$scope.downloadReport = function(){
			lastFilter.download = true;
			inventoryService.getInvSnapshot(lastFilter, function(data) {
				var a = document.createElement('a');
				a.href = data.url;
				a.download = data.url;
				a.target = '_blank';
				a.click();
			});
		}
	});


materialAdmin.controller("spareConsumptionReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
	//$scope.aStatus = ["Open", "Closed"];
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

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.report = constants.aSpareConReportType[0];

	function prepareFilterObject(download){
		var myFilter = {"all":"true"};
		if($scope.report){
			myFilter.aggregateBy = $scope.report.key;
		}
		if(download){
			myFilter.download = true;
		}
		if($scope.start_date){
			myFilter.start_date = $scope.start_date;
		}
		if($scope.end_date){
			myFilter.end_date = $scope.end_date;
		}
		if($scope.find){
			myFilter[$scope.report.key]=$scope.find;
		}

		return myFilter;
	};

	$scope.addFilter=function(){

	}

	$scope.downloadReport = function(downloadThis){
		var oFilter = prepareFilterObject(downloadThis)
		ReportService.getAllSpareConsumptionReport(oFilter, function(data) {
			if(downloadThis){
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}else{
				if(data.data.data) {
					$scope.aspareConReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aspareConReport = {};
				}
				//$scope.aspareConReport = data.data.data;
			}
		});
	}
	//$scope.downloadReport();
});

materialAdmin.controller("jobCardReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
    $scope.aStatus = ["Open", "Closed"];
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aJobCardReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {"all":"true"};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        if($scope.c_start_date){
            myFilter.c_start_date = $scope.c_start_date;
        }
        if($scope.c_end_date){
            myFilter.c_end_date = $scope.c_end_date;
        }
		if($scope.status){
			myFilter.status = $scope.status;
		}
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllJobCardsReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
            	if(data.data.data) {
					$scope.aJobCardReport = data.data.data;
				}else {
            		swal('warning',data.data.message,'warning');
					$scope.aJobCardReport = [];
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("jobCardTaskReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aJobCardTaskReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllJobCardsTaskReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aJobCardTaskReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aJobCardTaskReport = [];
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("toolReportsController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aToolReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllToolReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aToolReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aToolReport = [];
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("toolIssueReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aToolIssueReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
            if($scope.report.value == 'Driver Wise'){
                myFilter.issuer_type = 'driver';
            }else if($scope.report.value == 'Mechanic Wise'){
                myFilter.issuer_type = 'mechanic';
            }
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getToolIssueReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aToolIssue = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aToolIssue = [];
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("tyreReportsController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aTyreReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllTyreReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aTyreReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aTyreReport = {};
				}
                //$scope.aTyreReport = data.data.data;
            }
        });
    }
    //$scope.downloadReport();

	$scope.downloadSummary = function(downloadThis){
		var oFilter = prepareFilterObject(downloadThis)
		ReportService.getTyreSummaryReport(oFilter, function(data) {
			if(downloadThis){
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}else{
				if(data.data.data) {
					$scope.aTyreSummaryReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aTyreSummaryReport = {};
				}
				//$scope.aTyreReport = data.data.data;
			}
		});
	}
});

materialAdmin.controller("tyreIssueReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aTyreIssueReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getTyreIssueReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aTyreIssueReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aTyreIssueReport = {};
				}
                //$scope.aTyreIssueReport = data.data.data;
            }
        });
    }
    //$scope.downloadReport();
	$scope.downloadIssueSummary = function(downloadThis){
		var oFilter = prepareFilterObject(downloadThis)
		ReportService.getTyreIssueSummaryReport(oFilter, function(data) {
			if(downloadThis){
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}else{
				if(data.data.data) {
					$scope.aTyreIssueSummaryReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aTyreIssueSummaryReport = {};
				}
				//$scope.aTyreReport = data.data.data;
			}
		});
	}
});

materialAdmin.controller("tyreRetreatReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aTyreRetReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getTyreRetreatReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aTyreRetReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aTyreRetReport = {};
				}
                //$scope.aTyreRetReport = data.data.data;
            }
        });
    }
    //$scope.downloadReport();
});
materialAdmin.controller("primeTrailerAssoReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aPrimeTrailerAssoReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getTyreAssociationReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aAssociationReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aAssociationReport = {};
				}
                //$scope.aAssociationReport = data.data.data;
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("contractorExpenseReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aContractorExpenseReportTypes[0];

    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllContractorExpenseReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aContractorExpenseReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aContractorExpenseReport = {};
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("expenseReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************
    $scope.report = constants.aExpenseReportTypes[0];


    function prepareFilterObject(download){
        var myFilter = {};
        if($scope.report){
            myFilter.aggregateBy = $scope.report.key;
        }
        if(download){
            myFilter.download = true;
        }
		if($scope.dateKey){
			myFilter.dateKey = $scope.dateKey.key;
		}
        if($scope.start_date){
            myFilter.start_date = $scope.start_date;
        }
        if($scope.end_date){
            myFilter.end_date = $scope.end_date;
        }
        return myFilter;
    };

    $scope.downloadReport = function(downloadThis){
        var oFilter = prepareFilterObject(downloadThis)
        ReportService.getAllExpenseReport(oFilter, function(data) {
            if(downloadThis){
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }else{
				if(data.data.data) {
					$scope.aExpenseReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.aExpenseReport = {};
				}
            }
        });
    }
    //$scope.downloadReport();
});

materialAdmin.controller("combinedExpenseReportController", function($rootScope,$modal,$uibModal,constants,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
	//$scope.aStatus = ["Open", "Closed"];
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

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form ******************
	//$scope.report = constants.aSpareConReportType[0];

	function prepareFilterObject(download){
		var myFilter = {/*"all":"true"*/};
		/*if($scope.report){
			myFilter.aggregateBy = $scope.report.key;
		}*/
		if(download){
			myFilter.download = true;
		}
		if($scope.start_date){
			myFilter.start_date = $scope.start_date;
		}
		if($scope.end_date){
			myFilter.end_date = $scope.end_date;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if($scope.find){
			myFilter[$scope.report.key]=$scope.find;
		}

		return myFilter;
	};

	$scope.addFilter=function(){

	}

	$scope.clearSearch = function(val) {
		switch (val) {
			case "vehicle":
				$scope.vehicle_no = '';
				$scope.getVname($scope.vehicle_no);
				break;
			default:
				break;
		}
	}
	$scope.getVname = function(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			//$scope.getAllTripExp();
		}
	};


	$scope.downloadReport = function(downloadThis){
		var oFilter = prepareFilterObject(downloadThis)
		ReportService.getAllcombinedExpenseReport(oFilter, function(data) {
			if(downloadThis){
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}else{
				if(data.data.data) {
					$scope.combinedReport = data.data.data;
				}else {
					swal('warning',data.data.message,'warning');
					$scope.combinedReport = {};
				}
				//$scope.aspareConReport = data.data.data;
			}
		});
	}
	//$scope.downloadReport();
});
