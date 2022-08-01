materialAdmin
    .controller("ewayBillController", ewayBillController);

ewayBillController.$inject = [
    "$scope",
    "$modal",
    "lazyLoadFactory",
    "DatePicker",
    "stateDataRetain",
    "URL",
    "growlService",
    "ewayBillServices",
    "Vehicle"
];

function ewayBillController(
    $scope,
    $modal,
    lazyLoadFactory,
    DatePicker,
    stateDataRetain,
    URL,
    growlService,
    ewayBillServices,
    Vehicle
    ) {
    // function Identifiers
    $scope.getAllEwayBill = getAllEwayBill;
    $scope.getVname = getVname;
    $scope.getEwayBillReport = getEwayBillReport;
    $scope.onStateRefresh = function () {
        getAllEwayBill();
    };
        //INIT functions
        (function init(){
            $scope.oFilter = {};
            $scope.showTable = true;
            $scope.selectType = 'index';
            $scope.aEwayBill = [];
            $scope.maxDate = new Date();
            $scope.DatePicker = angular.copy(DatePicker);
            $scope.lazyLoad = lazyLoadFactory();
            $scope.oFilter.dateType = 'ewbDate';

            if(stateDataRetain.init($scope))
                return;

            $scope.columnSetting = {
                allowedColumn: [
                    'EWB NO',
                    'EWB DATE',
                    'EWB EXPIRY',
                    'PLACE OF DELIVERY',
                    'INVOICE NO',
                    'INVOICE DATE',
                    'TOTAL',
                    'MODE',
                    'VEHICLE NO',
                    'LR DATE',
                    'LR NO',
                ]
            };
            $scope.tableHead = [
                {
                    'header': 'EWB NO',
                    'bindingKeys': 'ewbNo'
                },
                {
                    'header': 'EWB DATE',
                    'bindingKeys': 'ewbDate',
                    'date': 'dd-MMM-yyyy'
                },
                {
                    'header': 'EWB EXPIRY',
                    'bindingKeys': 'validUpto',
                    'date': 'dd-MMM-yyyy'
                },
                {
                    'header': 'PLACE OF DELIVERY',
                    'bindingKeys': 'toPlace'
                },
                {
                    'header': 'INVOICE NO',
                    'bindingKeys': 'docNo',
                    'date': false
                },
                {
                    'header': 'INVOICE DATE',
                    'bindingKeys': 'docDate',
                    'date': 'dd-MMM-yyyy'
                },
                {
                    'header': 'TOTAL',
                    'bindingKeys': 'totInvValue'
                },
                {
                    'header': 'MODE',
                    'bindingKeys': 'genMode'
                },
                {
                    'header': 'VEHICLE NO',
                    'bindingKeys': 'vehicleNo'
                },
                {
                    'header': 'LR DATE',
                    'bindingKeys': 'transDocDate',
                    'date': 'dd-MMM-yyyy'
                },
                {
                    'header': 'LR NO',
                    'bindingKeys': 'transDocNo',
                    'date': false,
                }
            ];
        })();

    // Get all eway bill from Backend
    function getAllEwayBill(isGetActive) {
        if(!$scope.lazyLoad.update(isGetActive))
        return;

        let oFilter = prepareFilterObject();
        // oFilter.gstin = "07AACCF8572F1ZI";
        oFilter.deleted = false;
        ewayBillServices.getEwayBill(oFilter, onSuccess, err => {

            console.log(err);
        });

        function onSuccess(res) {
            if(res && res.data && res.data.data) {
                $scope.aSelectedBill = res && res.data && res.data.data;
                $scope.lazyLoad.putArrInScope.call($scope, isGetActive, res.data.data);
            	for(var i = 0; i< res.data.data.data.length ; i++){
					let oEwayBill = res.data.data.data[i];
					oEwayBill.oEwayBillExpiryToday = false;
					let EwayBillHighlight = $scope.$configs && $scope.$configs.eWay && $scope.$configs.eWay.oEwayBillExpiryToday;
					let todayDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
					let eWayDate = new Date(new Date(oEwayBill.validUpto).setHours(0,0,0,0)).toISOString();
					if(EwayBillHighlight && (eWayDate === todayDate)){
						oEwayBill.oEwayBillExpiryToday = true;
					}
				}

            }
        }
    }

    // prepare the filter object
    function prepareFilterObject(download) {
		var filter = {};
		if ($scope.oFilter.vehicleNo) {
			filter.vehicleNo = $scope.oFilter.vehicleNo;
		}
		if ($scope.oFilter.customer) {
			filter.customer = $scope.oFilter.customer._id;
		}
        if ($scope.oFilter.ewbNo) {
			filter.ewbNo = $scope.oFilter.ewbNo;
		}
        if ($scope.oFilter.docNo) {
			filter.docNo = $scope.oFilter.docNo;
		}
        if ($scope.oFilter.transDocNo) {
			filter.transDocNo = $scope.oFilter.transDocNo;
		}
        if ($scope.oFilter.toPlace) {
			filter.toPlace = $scope.oFilter.toPlace;
		}
        if ($scope.oFilter.dateType) {
			filter.dateType = $scope.oFilter.dateType;
            filter.sort = {};
            filter.sort[`${filter.dateType}`] = -1;
		}
		if($scope.oFilter.paymentStatus){
			if($scope.oFilter.paymentStatus === 'Settled')
				filter.paymentStatus = { $eq: 0};
			else
				filter.paymentStatus = { $ne: 0};

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
		if ($scope.oFilter.fromDate) {
			filter.fromDate = $scope.oFilter.fromDate;
		}
		if ($scope.oFilter.toDate) {
			filter.toDate = $scope.oFilter.toDate;
		}
		if (download) {
			filter.download = true;
			filter.no_of_docs = 10000;
		} else {
			filter.skip = $scope.lazyLoad.getCurrentPage();
			filter.no_of_docs = 30;
		}
        // let type = filter.dateType;

		return filter;
	}

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

    function getEwayBillReport(type ,reportType) {
		let oFilter = prepareFilterObject(type);
        oFilter.download = true;
		// if (!($scope.oFilter.tMemoFromDate && $scope.oFilter.tMemoToDate)) {
		// 	swal('Warning', 'From and To Date should be filled', 'warning');
		// 	return;
		// }
		if (!($scope.oFilter.fromDate && $scope.oFilter.toDate)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.fromDate && $scope.oFilter.toDate){
			if($scope.oFilter.fromDate > $scope.oFilter.toDate) {
				return swal("warning", "To date should be greater than From date", "warning");
			}

			if(moment($scope.oFilter.toDate).add(-3, 'month').isAfter(moment($scope.oFilter.fromDate))) {
				return swal("warning", "Max 3 Month data Allowed", "warning");
			}
		}

        if(reportType === 'list') {
            ewayBillServices.getEwayBillReports2(oFilter, function (res) {
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
        } else {
            ewayBillServices.getEwayBillReports(oFilter, function (res) {
                if(res.data.url) {
                    var a = document.createElement('a');
                    a.href = res.data.url;
                    a.download = res.data.url;
                    a.target = '_blank';
                    a.click();
                }else{
                    swal('', res.data.message, 'success');
                }
            })
        }
	}
}
