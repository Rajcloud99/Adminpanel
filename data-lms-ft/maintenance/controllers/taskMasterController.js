/**
 * Created by manish on 29/12/16.
 */
/**
 * Created by manish on 28/12/16.
 */
materialAdmin.controller("taskMasterController",
    function($rootScope, $state, $scope, $timeout, $interval, taskService, $localStorage, growlService,
             $window, partCategoryService) {
        $scope.tasks=[];
        $scope.selectedTask={};
        $scope.indexSelectedFromList=0;
        $scope.searchValue ="";
        $scope.currentMode = "view";
        $scope.branches = [];
        $scope.numPages =1;
        $scope.maxSize = 3;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.partCategories =[];
        $scope.partCategorySelected ={};
        $scope.partCategoriesInList = [];

        /**watches change in selectedTask and resets
         * and sets speciality parts for corresponding task **/
        $scope.$watch(function(){
            return $scope.selectedTask;
        },function(){
            console.log("changed task");
            $scope.partCategoriesInList = $scope.selectedTask.part_categories || [];
        });

        $scope.addPartCategoryToList = function(){
            var toAdd = true;
            for(var i=0;i<$scope.partCategoriesInList.length;i++){
                if($scope.partCategoriesInList[i] == $scope.partCategorySelected.name){
                    toAdd = false;
                    swal("Already added in list","","warning");
                }
            }
            if(toAdd){
                $scope.partCategoriesInList.push($scope.partCategorySelected.name);
            }
        };

        $scope.removePartCategoryFromList = function($index){
            $scope.partCategoriesInList.splice($index, 1);
        };

        ($scope.getAllTasks = function(resetPage, autoSelectIndex){
            $timeout(function () {
                $scope.tasks=[];
            },0);
            $scope.selectedTask={};
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
                if($scope.searchData){
                    queryFilter.task_name = $scope.searchData;
                }
                queryFilter.skip = $scope.currentPage;
                return queryFilter;
            }
            function success(response){
                //console.log(data);
                if(response.data && response.data.length>0){
                    $timeout(function () {
                        $scope.tasks = response.data;
                        $scope.totalPages = response.pages;
                        $scope.totalItems = ($scope.itemsPerPage * (response.pages-1)) + response.data.length;
                        $scope.selectedTask = response.data[0];
                        //$scope.selectTaskAtIndex($scope.indexSelectedFromList);
                        setTimeout(function () {
                            listItem = $($('.lv-item')[0]);
                            listItem.addClass('grn');
                        }, 500);
                    },500);
                }
            }
            function failure(response){
                console.log(response);
            }
            taskService.getTasks(prepareQueryFilterObj(),success,failure);
        })();

        ($scope.getAllPartCategories = function(){
            function success(response){
                if(response && response.data){
                    $scope.partCategories = response.data;
                }
            }
            function failure(response){
                console.log(response);
            }
            partCategoryService.getPartCategoryTrim(success,failure);
        })();

        $scope.selectTaskAtIndex = function (index,obj) {
            $scope.selectedTask = obj;
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.addNewTaskClicked = function () {
            $scope.selectedTask = {};
            $scope.currentMode = "add";
            setTimeout(function(){
                var listItem = $($('.lv-item')[$scope.indexSelectedFromList]);
                listItem.removeClass('grn');
                //listItem.addClass('grn');
            }, 0);
            $window.scrollTo(0,400);
        };

        $scope.editTaskClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.pageChanged = function() {
            $scope.getAllTasks(false,true);
        };

        $scope.saveTask = function(taskForm) {
            function successAddTask(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllTasks(true,true);
            }

            function successUpdateTask(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllTasks(false,false);
            }
            function failureAddTask(res){
                console.error("failure add Task: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedTask.part_categories = $scope.partCategoriesInList;
                return $scope.selectedTask;
            }
            if ($scope.currentMode ==="add") {
                taskService.addTask(parseBeforeSave(), successAddTask, failureAddTask);
            }else if ($scope.currentMode==="edit"){
                taskService.updateTask($scope.selectedTask._id, parseBeforeSave(), successUpdateTask, failureAddTask);
            }
        };

        $scope.deleteTaskClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Task "+$scope.selectedTask.short_name+" will be removed from maintenance s",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteTask(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        if ((($scope.totalItems -1) <= ($scope.itemsPerPage * ($scope.currentPage-1)))
                            && $scope.currentPage!==1){
                            $scope.currentPage =$scope.currentPage -1;
                        }
                        $scope.getAllTasks(false,true);
                    }
                }
                function failureDeleteTask(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                taskService.deleteTask($scope.selectedTask._id,
                    $scope.selectedTask, successDeleteTask, failureDeleteTask);
            });
        };

        $scope.resetSearch = function(){
            $scope.getSearch = '';
            $scope.searchData = null;
            $scope.getAllTasks();
        }
        $scope.getSearchClick = function(data){
            if(data && data.toString().length>2 || data.toString().length==0){
                $scope.searchData = data;
                $scope.getAllTasks();
            }
        }
    });



