materialAdmin.controller("dieselMaintenanceController",
    function($rootScope, $state, $scope, $timeout,DateUtils, $localStorage, growlService,$uibModal, inventoryService,spareService,ReportService,dieselMaintService) {
        $scope.aDiesel=[];
        $scope.selectedDiesel={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        $scope.aFlag = ['Inward','Outward'];
        $scope.aType = ["Vendor","Vehicle","Generator","Other"];
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
        //************* New Date Picker for multiple date selection in single form ******************//

        function prepareFilterObject(isPagination){
            var allowedKey = ['flag','from_to_type','bill_no'];
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
        $scope.getAllDieselList = function(isPagination){
            $scope.aDiesel=[];
            $scope.selectedDiesel={};

            function success(response){
                if(response.data && response.data.length>0){
                    $scope.dieselInCount = response.dieselIn;
                    $scope.dieselOutCount = response.dieselOut;
                    $scope.aDiesel = response.data;
                    $rootScope.globalHomId33 = response.data[0].homId;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectDieselAtIndex(0);
                }
            }
            function failure(response){
                console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
            dieselMaintService.getDieselList(oFilter,success,failure);
        };
        $scope.getAllDieselList();

        $scope.selectDieselAtIndex = function (index) {
            $scope.selectedDiesel = $scope.aDiesel[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllDieselList(true);
        };

        $rootScope.in = false;
        $rootScope.out = false;

        $scope.dieselIn = function() {
            $rootScope.in = true;
            var rURL = "#!/maintenance_inventory/dieselIn";
            $rootScope.redirect(rURL);
        };
        $scope.dieselOut = function(){
            $rootScope.out = true;
            var rURL = "#!/maintenance_inventory/dieselIn";
            $rootScope.redirect(rURL);
        };

        $scope.printSlip = function (slip) {
			$rootScope.dieselSlip = slip;
			var modalInstance = $uibModal.open({
				templateUrl: 'maintenance/views/dieselMaintenance/dieselSlipPop.html',
				controller: 'dieselSlipPopCtrl'
			});
		}


    });

materialAdmin.controller("dieselSlipPopCtrl", function($rootScope, $scope,$state, $uibModalInstance,DateUtils,dieselMaintService,growlService,formValidationgrowlService) {
	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.dSlip = $rootScope.dieselSlip;

	$scope.downlaodSlip = function(slipData){
		var data = slipData;
		if(data){
			dieselMaintService.downloadSlipService(data, function(data) {
				if(data.data && data.data.url) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
					$uibModalInstance.dismiss('cancel');
				}
			});
		}
	};

});



materialAdmin.controller("dieselInCtrl", function($rootScope, $state, $scope, $timeout,Vehicle,userService,DateUtils, $localStorage,spareService,vendorFuelService, growlService,dieselMaintService) {
    if($scope.in == true || $scope.out == true){

    }else{
        $rootScope.redirect('#!/maintenance_inventory/dieselMaintenance');
    }
    $scope.inData = {};
    $scope.aFromTo = ["Vendor","Vehicle","Generator","Other"];
    $scope.inData.quantity = 0;
    $scope.inData.price = 0;

    $scope.cal = function(){
        var amt = $scope.inData.quantity * $scope.inData.price;
        $scope.inData.total_amount = amt;
    }

    if($scope.out == true){
		$scope.getAllDieselList = function(){
			$scope.aDiesel=[];

			function success(response){
				if(response.data && response.data.length>0){

					$scope.aDiesel = response.data;
					$scope.inData.price = $scope.aDiesel[0].price;
				}
			}
			function failure(response){
				console.log(response);
			}

			dieselMaintService.getDieselList({flag:"Inward"},success,failure);
		};
		$scope.getAllDieselList();
	}

    $scope.getAllPOvendor = function(){
        function succ(data) {
            $scope.avendor = data.data.data;
        }
        vendorFuelService.getAllFuelVendors({all:true}, succ);
    };
    $scope.getAllPOvendor();

    $scope.getAllVehiclesList = function(){

        function success(data) {
                $scope.aVehicles = data.data.data;
          };

        var oFilter = {};
        Vehicle.getAllregList(oFilter,success);

    }
    $scope.getAllVehiclesList();

    $scope.getUser = function(){
      function getsucc(response){
        $scope.users = response.data;
      }
      function getfail(response){
        console.log(response);
      }
      userService.getUsers({all:true},getsucc, getfail)
    }
    $scope.getUser();

    $scope.dieselInClick = function(){
        function succ(data) {
            var msggg = data.data.message;
            swal(msggg,"","success");
        }
        function failure(data) {
            var msggg = data.data.message || data.data.error_message;
            swal(msggg,"","warning");
        }
        if($rootScope.in ==true){
            $scope.inData.flag = 'Inward';
        }else if($rootScope.out ==true){
            $scope.inData.flag = 'Outward';
        }
        //$scope.inData.flag = 'Inward';
        if($scope.inData.employee_involved){
            $scope.inData.employee_involved_name = $scope.inData.employee_involved.full_name;
            $scope.inData.employee_involved_code = $scope.inData.employee_involved.userId;
        }

        delete $scope.inData.employee_involved;
        delete $scope.inData.aVehicles;
        delete $scope.inData.avendor;

        dieselMaintService.addDiesel($scope.inData, succ, failure);
    }

    $scope.backList = function(){
        $rootScope.redirect('#!/maintenance_inventory/dieselMaintenance');
    }

});
/*materialAdmin.controller("dieselOutCtrl", function($rootScope, $scope,growlService) {

    $scope.addPrSubmit = function(){

    }

    $scope.backList = function(){
        $rootScope.redirect('maintenance_inventory.dieselMaintenance');
    }

});*/
