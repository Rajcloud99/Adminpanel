/**
 * Created by manish on 23/12/16.
 */

materialAdmin.controller("partCategoryController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService, partCategoryService) {
        $scope.partCategories=[];
        $scope.selectedPartCategory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        $scope.aType = ['Spare','Tool','Tyre','Gps','Sim'];


        ($scope.getAllPartCategories = function(){
            $scope.partCategories=[];
            $scope.selectedPartCategory={};
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
                    $scope.partCategories = response.data;
                    $scope.branches = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectedPartCategory = response.data[0];
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
            partCategoryService.getPartCategories(prepareQueryFilterObj(),success,failure);
        })();

        $scope.getPartCategoryByNameSearch = function(){

        };

        $scope.selectPartCategoryAtIndex = function (index,obj) {
            //$scope.selectedPartCategory = $scope.partCategories[index];
            $scope.selectedPartCategory = obj;
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

        $scope.addNewPartCategoryClicked = function () {
            $scope.selectedPartCategory = {};
            $scope.currentMode = "add";
        };

        $scope.editPartCategoryClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.pageChanged = function() {
            $scope.getAllPartCategories();
        };

        $scope.savePartCategory = function(partCateogryForm) {
            function successAddPartCategory(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllPartCategories();
				$state.reload();
			}
            function failureAddPartCategory(res){
                console.error("failure add branch: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedPartCategory._id = undefined;
                $scope.selectedPartCategory.__v = undefined;
                return $scope.selectedPartCategory;
            }
            if ($scope.currentMode ==="add") {
                partCategoryService.addPartCategory($scope.selectedPartCategory, successAddPartCategory, failureAddPartCategory);
            }else if ($scope.currentMode==="edit"){
                partCategoryService.updatePartCategory($scope.selectedPartCategory._id, parseBeforeSave(), successAddPartCategory, failureAddPartCategory);
            }
        };

        $scope.deletePartCategoryClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Part category "+$scope.selectedPartCategory.name+" will be removed from maintenance masters",
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
                        $scope.getAllPartCategories();
                    }
                }
                function failureDeleteBranch(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                partCategoryService.deletePartCategory($scope.selectedPartCategory._id, $scope.selectedPartCategory, successDeleteBranch, failureDeleteBranch);
            });
        };
    });



