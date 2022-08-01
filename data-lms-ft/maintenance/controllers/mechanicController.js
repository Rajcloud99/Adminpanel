/**
 * Created by manish on 22/12/16.
 */

materialAdmin.controller("mechanicController",
    function($rootScope, $state, $scope, $timeout, mechanicService, $localStorage, growlService, partCategoryService ) {
        $scope.mechanics=[];
        $scope.selectedMechanic={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        $scope.partCategories = [];
        $scope.selectedPartCategories = {};

        /**watches change in selectedMechanic and resets
         * and sets speciality parts for corresponding mechanic **/
        $scope.$watch(function(){
            return $scope.selectedMechanic;
        },function(){
            console.log("changed mechanic");
            for (let i in $scope.partCategories){
                $scope.selectedPartCategories[$scope.partCategories[i].name] = false;
            }
            for (let j in $scope.selectedMechanic.speciality_parts){
                $scope.selectedPartCategories[$scope.selectedMechanic.speciality_parts[j]] = true;
            }
            console.log(JSON.stringify($scope.selectedPartCategories));
        });

        ($scope.getAllVehiclePartCategories = function(){
            function success(response){
                if(response && response.data){
                    $scope.partCategories = response.data;
                    for (var i in $scope.partCategories){
                        $scope.selectedPartCategories[$scope.partCategories[i].name] = false;
                    }
                }
            }
            function failure(response){
                console.log(response);
            }
            partCategoryService.getPartCategoryTrim(success,failure);
        })();

        ($scope.getAllMechanics = function(reset){
            $scope.mechanics=[];
            $scope.selectedMechanic={};
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
                    $scope.mechanics = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectMechanicAtIndex($scope.indexSelectedFromList);
                }
            }
            function failure(response){
                console.log(response);
            }
            mechanicService.getMechanicsByUser(prepareQueryFilterObj(),success,failure);
        })();

        $scope.getMechanicNameSearched = function(){

        };

        $scope.resetSearch = function(){
            $scope.searchValue = '';
        }

        $scope.selectMechanicAtIndex = function (index) {
            $scope.selectedMechanic = $scope.mechanics[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.addNewMechanicClicked = function () {
            $scope.selectedMechanic = {};
            $scope.currentMode = "add";
        };

        $scope.editMechanicClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.pageChanged = function() {
            $scope.getAllMechanics();
        };

        $scope.saveMechanic = function(mechanicForm) {
            function successAddMechanic(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllMechanics(true);
            }

            function successUpdateMechanic(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllMechanics(false);
            }
            function failureAddMechanic(res){
                console.error("failure add Mechanic: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedMechanic.speciality_parts = [];
                for (var key in $scope.selectedPartCategories){
                    if ($scope.selectedPartCategories[key]===true){
                        console.log("pushing :"+ key);
                        $scope.selectedMechanic.speciality_parts.push(key);
                    }
                }
                return $scope.selectedMechanic;
            }
            if ($scope.currentMode ==="add") {
                console.log(JSON.stringify($scope.selectedPartCategories));
                mechanicService.addMechanic(parseBeforeSave(), successAddMechanic, failureAddMechanic);
            }else if ($scope.currentMode==="edit"){
                console.log(JSON.stringify($scope.selectedPartCategories));
                mechanicService.updateMechanic($scope.selectedMechanic._id, parseBeforeSave(), successUpdateMechanic, failureAddMechanic);
            }
        };

        $scope.deleteMechanicClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Mechanic "+$scope.selectedMechanic.full_name+" will be removed from maintenance masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteMechanic(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllMechanics(true);
                    }
                }
                function failureDeleteMechanic(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                mechanicService.deleteMechanic($scope.selectedMechanic._id,
                    $scope.selectedMechanic, successDeleteMechanic, failureDeleteMechanic);
            });
        };
    });



