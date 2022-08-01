materialAdmin.controller("otherReportCntrl", function($rootScope, $scope,$uibModal, DatePicker,DateUtils, $state, tripServices, billsService,Vehicle,Routes,bookingServices, constants) {

	$scope.DatePicker = DatePicker;
    var oFilterForDownload = {};

	function prepareFilterObject(isPagination){
		 var myFilter = {"all":"true"};
		 if($scope.start_date) {
		 	myFilter.start_date = $scope.start_date;
		 }
		 if ($scope.end_date) {
		 	myFilter.end_date = $scope.end_date;
		 }
	   return myFilter;
   }

    $scope.downloadClicked = function(){
        oFilterForDownload.aggregateBy = $scope.downloadType;
        function success(res){
			// console.log(JSON.stringify(res));
            var a = document.createElement('a');
            a.href = res.data.url;
            a.download = res.data.url;
            a.target = '_blank';
            a.click();
            oFilterForDownload.report_download = false;
        };
		switch($scope.report) {
			case constants.aReportTypes[0]:
			case constants.aReportTypes[1]:
			case constants.aReportTypes[2]:
				billsService.getProfitReportServ(oFilterForDownload, success);
				break;
			case constants.aReportTypes[3]:
			case constants.aReportTypes[4]:
			case constants.aReportTypes[5]:
				tripServices.getAllTripsReport(oFilterForDownload, success);
				break;
			case constants.aReportTypes[6]:
			case constants.aReportTypes[7]:
				billsService.getAllBillReports(oFilterForDownload, success);
				break;
		}
    };

    $scope.getProfitReport = function(isPagination) {
        function success(res) {
            if (res.data.data) {
                $scope.aProfitReport = res.data.data;
                for(var l=0;l<$scope.aProfitReport.length;l++){
                    if($scope.aProfitReport[l].datetime){
                        $scope.aProfitReport[l].datetime = moment($scope.aProfitReport[l].datetime).format('DD-MM-YYYY');
                    }
                }
                $scope.total_pages = res.data.pages;
                $scope.totalItems = 15*res.data.pages;

				// console.log('pr', JSON.stringify($scope.aProfitReport));
            }
        }
        var oFilter = prepareFilterObject(isPagination);
        billsService.getProfitReportServ(oFilter, success)
    };

	$scope.getAllTrip = function() {
        function success(res) {
            if (res.data.data) {
                $scope.aTrip = res.data.data;
				for(var l=0;l<$scope.aTrip.length;l++){
                    if($scope.aTrip[l].allocation_date){
                        $scope.aTrip[l].allocation_date = moment($scope.aTrip[l].allocation_date).format('DD-MM-YYYY');
                    }
                }
                $scope.report_download = res.data.url;
            }
        }
        var oFilter = prepareFilterObject();
        tripServices.getAllTripsReport(oFilter, success);
    };

	$scope.getAllBillReport = function(isPagination) {
        function success(res) {
            if (res.data.data) {
                $scope.aBillReports = res.data.data;
                for(var x=0;x<$scope.aBillReports.length;x++){
                    $scope.aBillReports[x].invoice_date = moment($scope.aBillReports[x].invoice_date).format('DD-MM-YYYY');
                }
                $scope.total_pages = res.data.pages;
                $scope.totalItems = 15*res.data.pages;
				// console.log('bill', JSON.stringify($scope.aBillReports));
            }
        }
        var oFilter = prepareFilterObject(isPagination);
        billsService.getAllBillReports(oFilter, success);
    };

	$scope.onReportTypeSelect = function() {

		switch($scope.report) {
			case constants.aReportTypes[0]:
				$scope.reportType = 'datetime';
				$scope.downloadType = 'date';
				break;
			case constants.aReportTypes[1]:
				$scope.reportType = 'vehicle_no';
				$scope.downloadType = 'vehicle';
				break;
			case constants.aReportTypes[2]:
				$scope.reportType = 'customers';
				$scope.downloadType = 'customer';
				break;
			case constants.aReportTypes[3]:
				$scope.reportType = 'allocation_date';
				$scope.downloadType = 'date';
				break;
			case constants.aReportTypes[4]:
				$scope.reportType = 'vehicle.vehicle_reg_no';
				$scope.downloadType = 'vehicle';
				break;
			case constants.aReportTypes[5]:
				$scope.reportType = 'driver_name';
				$scope.downloadType = 'driver';
				break;
			case constants.aReportTypes[6]:
				$scope.reportType = 'trip_no';
				$scope.downloadType = 'trip';
				break;
			case constants.aReportTypes[7]:
				$scope.reportType = 'vehicle_no';
				$scope.downloadType = 'vehicle';
				break;
		}

		switch($scope.report) {
			case constants.aReportTypes[0]:
			case constants.aReportTypes[1]:
			case constants.aReportTypes[2]:
				$scope.getProfitReport();
				break;
			case constants.aReportTypes[3]:
			case constants.aReportTypes[4]:
			case constants.aReportTypes[5]:
				$scope.getAllTrip();
				break;
			case constants.aReportTypes[6]:
			case constants.aReportTypes[7]:
				$scope.getAllBillReport();
				break;
		}
	};

	$scope.getSum = function(field, data) {
		var sum = 0;
		for(var i = 0; i < data.length; i++) {
			sum += data[i][field];
		}
		return Math.round(sum*100)/100;
	}

	$scope.getProfitPercent = function(data) {
		return Math.round($scope.getSum('profitability', data) / $scope.getSum('total_expences', data) * 10000)/100;
	}

});
