/**
 * Created by manish on 23/12/16.
 */
/**
 * Created by manish on 23/12/16.
 */

materialAdmin.controller("manufacturerController",
    function($rootScope, $state, $scope, $timeout, $interval, $localStorage, growlService, manufacturerService) {
        $scope.manufacturers=[];
        $scope.selectedManufacturer={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";


        ($scope.getAllManufacturers = function(){
            $scope.manufacturers=[];
            $scope.selectedManufacturer={};
            $scope.indexSelectedFromList=0;
            //Used for Searching
            function prepareQueryFilterObj(){
                var queryFilter = {};
                if($scope.searchValue.length>0){
                    queryFilter.name = $scope.searchValue;
                }
                queryFilter.skip = $scope.currentPage;
                return queryFilter;
            }
            function success(response){
                //console.log(data);
                if(response.data && response.data.length>0){
                    $scope.manufacturers = response.data;
                    $scope.branches = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectManufacturerAtIndex(0);
                }
            }
            function failure(response){
                console.log(response);
            }
            manufacturerService.getManufacturers(prepareQueryFilterObj(),success,failure);
        })();

        $scope.getManufacturerByNameSearch = function(){

        };

        $scope.selectManufacturerAtIndex = function (index) {
            $scope.selectedManufacturer = $scope.manufacturers[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode="view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 500);
        };

        $scope.addNewManufacturerClicked = function () {
            $scope.selectedManufacturer = {};
            $scope.currentMode = "add";
        };

        $scope.editManufacturerClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.pageChanged = function() {
            $scope.getAllManufacturers();
        };

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.selectedManufacturer.address1.city = $scope.autoCompleteCity1.c;
                    $scope.selectedManufacturer.address1.district = $scope.autoCompleteCity1.d;
                    $scope.selectedManufacturer.address1.state = $scope.autoCompleteCity1.st;
                    $scope.selectedManufacturer.address1.pincode = $scope.autoCompleteCity1.p;
                    $scope.selectedManufacturer.address1.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackCity2 = function(){
            if ($scope.autoCompleteCity2){
                $timeout(function() {
                    $scope.selectedManufacturer.address2.city = $scope.autoCompleteCity2.c;
                    $scope.selectedManufacturer.address2.district = $scope.autoCompleteCity2.d;
                    $scope.selectedManufacturer.address2.state = $scope.autoCompleteCity2.st;
                    $scope.selectedManufacturer.address2.pincode = $scope.autoCompleteCity2.p;
                    $scope.selectedManufacturer.address2.country = $scope.autoCompleteCity2.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);
        var gAPI2 = new googlePlaceAPI($interval);
        gAPI2.fight($scope,['autoCompleteCity2'], $scope.autoCompleteCallbackCity2);

        $scope.saveManufacturer = function(partCateogryForm) {
            function successAddManufacturer(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllManufacturers();
            }
            function failureAddManufacturer(res){
                console.error("failure add branch: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedManufacturer._id = undefined;
                $scope.selectedManufacturer.__v = undefined;
                return $scope.selectedManufacturer;
            }
            if ($scope.currentMode ==="add") {
                manufacturerService.addManufacturer($scope.selectedManufacturer, successAddManufacturer, failureAddManufacturer);
            }else if ($scope.currentMode==="edit"){
                manufacturerService.updateManufacturer($scope.selectedManufacturer._id, parseBeforeSave(), successAddManufacturer, failureAddManufacturer);
            }
        };

        $scope.deleteManufacturerClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Part category "+$scope.selectedManufacturer.name+" will be removed from maintenance masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteBranch(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllManufacturers();
                    }
                }
                function failureDeleteBranch(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                manufacturerService.deleteManufacturer($scope.selectedManufacturer._id, $scope.selectedManufacturer, successDeleteBranch, failureDeleteBranch);
            });
        };
    });



