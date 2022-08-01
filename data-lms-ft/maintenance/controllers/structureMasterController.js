/**
 * Created by manish on 21/1/17.
 */
/**
 * Created by manish on 21/1/17.
 */
materialAdmin.controller("structureMasterController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService, structureMasterService) {
        $scope.structures=[];
        $scope.selectedStructure={};
        $scope.indexSelectedFromList=0;
        $scope.currentMode = "view";
        /*pagination vars start here*/
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;

        $scope.getNumber = function(num) {
            if (num) {
                return new Array(num);
            }
        };

        ($scope.getAllStructures = function(reset){
            $scope.structures=[];
            $scope.selectedStructure={};
            if (reset){
                $scope.indexSelectedFromList=0;
            }
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
                    $scope.structures = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectStructureAtIndex($scope.indexSelectedFromList);
                }
            }
            function failure(response){
                console.log(response);
            }
            structureMasterService.getStructureMasters(prepareQueryFilterObj(),success,failure);
        })();

        $scope.selectStructureAtIndex = function (index) {
            $scope.selectedStructure = angular.copy($scope.structures[index]);
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllStructures();
        };

        $scope.addNewStructureClicked = function () {
            $scope.selectedStructure = {};
            $scope.selectedStructure.front_mapping = [];
            $scope.selectedStructure.rear_mapping = [];
            var listItem = $($('.lv-item')[$scope.indexSelectedFromList]);
            listItem.removeClass('grn');
            $scope.currentMode = "add";
        };

        $scope.addFrontTire = function(arrIndex){
            if ($scope.selectedStructure.front_mapping[arrIndex]
                && $scope.selectedStructure.front_mapping[arrIndex]<2) {
                $scope.selectedStructure.front_mapping[arrIndex] += 1;
            }
        };

        $scope.addFrontNewTireRow = function () {
            $scope.selectedStructure.front_mapping[$scope.selectedStructure.front_mapping.length] = 1;
        };

        $scope.removeFrontTire = function () {
        };

        $scope.addRearTire = function(arrIndex){
            if ($scope.selectedStructure.rear_mapping[arrIndex]
                && $scope.selectedStructure.rear_mapping[arrIndex]<2) {
                $scope.selectedStructure.rear_mapping[arrIndex] += 1;
            }
        };

        $scope.addRearNewTireRow = function () {
            $scope.selectedStructure.rear_mapping[$scope.selectedStructure.rear_mapping.length] = 1;
        };

        $scope.removeRearTire = function (rowIndex) {
        };

        $scope.addSpareTire = function(){
            if ($scope.selectedStructure.spare_tyre) {
                $scope.selectedStructure.spare_tyre += 1;
            }else{
                $scope.selectedStructure.spare_tyre = 1;
            }
        };

        $scope.editStructureClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.saveStructure = function(StructureForm) {
            function successAddStructure(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllStructures(true);
            }

            function successUpdateStructure(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllStructures(false);
            }
            function failureAddStructure(res){
                console.error("failure add Structure: ",res);
            }
            function parseBeforeSave(){
                return $scope.selectedStructure;
            }
            if ($scope.currentMode ==="add") {
                console.log(JSON.stringify($scope.selectedPartCategories));
                structureMasterService.addStructureMaster(parseBeforeSave(), successAddStructure, failureAddStructure);
            }else if ($scope.currentMode==="edit"){
                console.log(JSON.stringify($scope.selectedPartCategories));
                structureService.updateStructureMaster($scope.selectedStructure._id, parseBeforeSave(), successUpdateStructure, failureAddStructure);
            }
        };

        $scope.deleteStructureClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Structure "+$scope.selectedStructure.structure_name+", "
                    + $scope.selectedStructure.vehicle_type+" will be removed from tyre masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteStructure(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllStructures(true);
                    }
                }
                function failureDeleteStructure(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                structureMasterService.deleteStructureMaster($scope.selectedStructure._id,
                    $scope.selectedStructure, successDeleteStructure, failureDeleteStructure);
            });
        };
    });