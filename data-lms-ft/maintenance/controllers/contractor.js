/**
 * Created by Ajay on 25/05/17.
 */

materialAdmin.controller("contractorController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService, contractorService) {
        $scope.contractors=[];
        $scope.selectedContractor={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        $scope.aType = ['Spare','Tool','Tyre'];


        ($scope.getAllContractor = function(){
            $scope.contractors=[];
            $scope.selectedContractor={};
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
                    $scope.contractors = response.data;
                    $scope.branches = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectedContractor = response.data[0];
                    //$scope.selectPartCategoryAtIndex(0);
                    setTimeout(function(){
                        var listItem = $($('.lv-item')[0]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }, 500);
                }
            }
            function failure(response){
                console.log(response);
            }
            contractorService.getContractorServ(prepareQueryFilterObj(),success,failure);
        })();

        $scope.getPartCategoryByNameSearch = function(){

        };

        $scope.selectPartCategoryAtIndex = function (index,obj) {
            //$scope.selectedContractor = $scope.contractors[index];
            $scope.selectedContractor = obj;
            $scope.indexSelectedFromList=index;
            $scope.currentMode="view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 500);
        };

        $scope.resetSearch = function(){
            $scope.searchValue = '';
        }

        $scope.addNewContractorClicked = function () {
            $scope.selectedContractor = {};
            $scope.currentMode = "add";
        };

        $scope.editContractorClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.pageChanged = function() {
            $scope.getAllContractor();
        };

        $scope.saveContractor = function(partCateogryForm) {
            function successAddPartCategory(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllContractor();
            }
            function failureAddPartCategory(res){
                console.error("failure add contractor: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedContractor._id = undefined;
                $scope.selectedContractor.__v = undefined;
                return $scope.selectedContractor;
            }
            if ($scope.currentMode ==="add") {
                contractorService.addContractor($scope.selectedContractor, successAddPartCategory, failureAddPartCategory);
            }else if ($scope.currentMode==="edit"){
                contractorService.updateContract($scope.selectedContractor._id, parseBeforeSave(), successAddPartCategory, failureAddPartCategory);
            }
        };

        $scope.deletePartCategoryClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Part category "+$scope.selectedContractor.name+" will be removed from maintenance masters",
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
                        $scope.getAllContractor();
                    }
                }
                function failureDeleteBranch(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                contractorService.deletePartCategory($scope.selectedContractor._id, $scope.selectedContractor, successDeleteBranch, failureDeleteBranch);
            });
        };
    });



