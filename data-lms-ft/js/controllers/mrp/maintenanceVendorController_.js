/**
 * Created by manish on 28/12/16.
 */
materialAdmin.controller("maintenanceVendorController_",
    function($rootScope, $state, $scope, $timeout, $interval, maintenanceVendorService_, $localStorage,
             growlService, branchService) {
        $scope.maintenanceVendors=[];
        $scope.selectedMaintenanceVendor={};
        $scope.indexSelectedFromList=0;
        $scope.searchValue ="";
        $scope.currentMode = "view";
        $scope.branches = [];
        $scope.aBanking = [];
        $scope.numPages =1;
        $scope.maxSize = 3;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.selectedBranch = {};

        $scope.addBank = function(bank){
          $scope.aBanking.push(bank);
          $scope.banking = {};
        }
        $scope.removeBank = function(index){
          $scope.aBanking.splice(index, 1);
        }

        /**Google address util **/
        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity){
                $timeout(function() {
                    $scope.selectedMaintenanceVendor.address1.city = $scope.autoCompleteCity.c;
                    $scope.selectedMaintenanceVendor.address1.district = $scope.autoCompleteCity.d;
                    $scope.selectedMaintenanceVendor.address1.state = $scope.autoCompleteCity.st;
                    $scope.selectedMaintenanceVendor.address1.pincode = $scope.autoCompleteCity.p;
                    $scope.selectedMaintenanceVendor.address1.country = $scope.autoCompleteCity.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity'], $scope.autoCompleteCallbackCity1);

        /**watches change in selectedMaintenanceVendor for branch set**/
        $scope.$watch(function(){
            return $scope.selectedMaintenanceVendor;
        },function(){
            if ($scope.selectedMaintenanceVendor.branch_name){
                for (var i in $scope.branches){
                    if ($scope.branches[i].name ===$scope.selectedMaintenanceVendor.branch_name){
                        $scope.selectedBranch = $scope.branches[i];
                    }
                }
            }
            console.log("changed maintenanceVendor");
        });

        $scope.resetSearch = function(){
            $scope.getSearch = '';
            $scope.searchData = null;
            $scope.getAllMaintenanceVendors();
        };

        /**get branches for branch dropdown **/
        ($scope.getAllBranches = function(){
            function success(response){
                if(response && response.data){
                    $scope.branches = response.data;
                }
            }
            function failure(response){
                console.log(response);
            }
            branchService.getBranchesTrim({},success,failure);
        })();

        ($scope.getAllMaintenanceVendors = function(resetPage, autoSelectIndex){
            $timeout(function () {
                $scope.maintenanceVendors=[];
            },0);
            $scope.selectedMaintenanceVendor={};
            if (resetPage){
                $scope.currentPage=1;
            }
            if (autoSelectIndex){
                $scope.indexSelectedFromList=0;
            }
            function prepareQueryFilterObj(){
                var queryFilter = {};
                if($scope.searchValue.length>0){
                    queryFilter.name = $scope.searchValue;
                }
                queryFilter.skip = $scope.currentPage;
                if($scope.searchData){
                    queryFilter.find = $scope.searchData;
                }
                return queryFilter;
            }
            function success(response){
                //console.log(data);
                if(response.data && response.data.length>0){
                    $timeout(function () {
                        $scope.maintenanceVendors = response.data;
                        $scope.totalPages = response.pages;
                        $scope.totalItems = ($scope.itemsPerPage * (response.pages-1)) + response.data.length;
                        $scope.selectedMaintenanceVendor = response.data[0];
                        //$scope.selectMaintenanceVendorAtIndex($scope.indexSelectedFromList);
                    },500);
                }
            }
            function failure(response){
                console.log(response);
            }
            maintenanceVendorService_.getMaintenanceVendors(prepareQueryFilterObj(),success,failure);
        })();

        $scope.getMaintenanceVendorNameSearched = function(){

        };

        $scope.selectMaintenanceVendorAtIndex = function (index,obj) {
            $scope.selectedMaintenanceVendor = obj;
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);

            if($scope.selectedMaintenanceVendor && $scope.selectedMaintenanceVendor.banking_details){
                $scope.aBanking = $scope.selectedMaintenanceVendor.banking_details;
            }else{
                $scope.aBanking = [];
            }
        };

        $scope.addNewMaintenanceVendorClicked = function () {
            $scope.selectedMaintenanceVendor = {};
            $scope.aBanking = [];
            $scope.currentMode = "add";
            setTimeout(function(){
                var listItem = $($('.lv-item')[$scope.indexSelectedFromList]);
                listItem.removeClass('grn');
            }, 0);
        };

        $scope.editMaintenanceVendorClicked = function() {
            $scope.currentMode = "edit";
            console.log($scope.currentMode);
        };

        $scope.pageChanged = function() {
            $scope.getAllMaintenanceVendors(false,true);
        };

        $scope.saveMaintenanceVendor = function(MaintenanceVendorForm) {
            if (MaintenanceVendorForm.$valid) {
                function successAddMaintenanceVendor(response) {
                    if (response.message) {
                        growlService.growl(response.message, "success", 2);
                    }
                    $scope.getAllMaintenanceVendors(true, true);
					$state.reload();
                }

                function successUpdateMaintenanceVendor(response) {
                    if (response.message) {
                        growlService.growl(response.message, "success", 2);
                    }
                    $scope.getAllMaintenanceVendors(false, false);
					$state.reload();
                }

                function failureAddMaintenanceVendor(res) {
                    console.error("failure add MaintenanceVendor: ", res);
                }

                function parseBeforeSave() {
                    $scope.selectedMaintenanceVendor.branch_name = $scope.selectedBranch.name;
                    $scope.selectedMaintenanceVendor.branch_id = $scope.selectedBranch._id;
                    $scope.selectedMaintenanceVendor.branch_code = $scope.selectedBranch.code;
                    console.log(JSON.stringify($scope.selectedMaintenanceVendor));
                    return $scope.selectedMaintenanceVendor;
                }

                if($scope.aBanking){
                    $scope.selectedMaintenanceVendor.banking_details = $scope.aBanking;
                }

                if ($scope.currentMode === "add") {
                    maintenanceVendorService_.addMaintenanceVendor(parseBeforeSave(), successAddMaintenanceVendor, failureAddMaintenanceVendor);
                } else if ($scope.currentMode === "edit") {
                    maintenanceVendorService_.updateMaintenanceVendor($scope.selectedMaintenanceVendor._id, parseBeforeSave(), successUpdateMaintenanceVendor, failureAddMaintenanceVendor);
                }
            }
        };

        $scope.deleteMaintenanceVendorClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "MaintenanceVendor "+$scope.selectedMaintenanceVendor.name+" will be removed from maintenance masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteMaintenanceVendor(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        if ((($scope.totalItems -1) <= ($scope.itemsPerPage * ($scope.currentPage-1)))
                            && $scope.currentPage!==1){
                            $scope.currentPage =$scope.currentPage -1;
                        }
                        $scope.getAllMaintenanceVendors(false,true);
                    }
                }
                function failureDeleteMaintenanceVendor(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                maintenanceVendorService_.deleteMaintenanceVendor($scope.selectedMaintenanceVendor._id,
                    $scope.selectedMaintenanceVendor, successDeleteMaintenanceVendor, failureDeleteMaintenanceVendor);
            });
        };

        $scope.getSearchClick = function(data){
            if(data && data.toString().length>2 || data.toString().length==0){
                $scope.searchData = data;
                $scope.getAllMaintenanceVendors();
            }
        }
    });



