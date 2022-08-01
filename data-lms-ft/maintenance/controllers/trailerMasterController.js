/**
 * Created by manish on 21/1/17.
 */
materialAdmin.controller("trailerMasterController",
    function($rootScope, $state, $scope, $timeout, $localStorage,
             growlService, structureMasterService, trailerMasterService) {
        $scope.trailers=[];
        $scope.selectedTrailer={};
        $scope.indexSelectedFromList=0;
        $scope.currentMode = "view";
        /*pagination vars start here*/
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.selectedStructure = {};
        $scope.selectedManufacturer = {};

        $scope.manufacturerObjArr = [{
            manufacturer_name : "TATA",
            manufacturer_code : 001
        },{
            manufacturer_name : "Volvo",
            manufacturer_code : 002
        },{
            manufacturer_name : "BharatBenz",
            manufacturer_code : 003
        },{
            manufacturer_name : "MLPL",
            manufacturer_code : 004
        },{
            manufacturer_name : "VJ",
            manufacturer_code : 005
        },{
            manufacturer_name : "DALSON",
            manufacturer_code : 006
        },{
            manufacturer_name : "MBF",
            manufacturer_code : 007
        },{
            manufacturer_name : "IND",
            manufacturer_code : 008
        },{
            manufacturer_name : "KEW",
            manufacturer_code : 009
        },{
            manufacturer_name : "DSN",
            manufacturer_code : 010
        },{
            manufacturer_name : "301KOBE",
            manufacturer_code : 011
        },{
            manufacturer_name : "ANG",
            manufacturer_code : 012
        },{
            manufacturer_name : "ANGIID272433",
            manufacturer_code : 013
        },{
            manufacturer_name : "J",
            manufacturer_code : 014
        },{
            manufacturer_name : "JRDC",
            manufacturer_code : 015
        },{
            manufacturer_name : "KOBE",
            manufacturer_code : 016
        },{
            manufacturer_name : "PE",
            manufacturer_code : 017
        },{
            manufacturer_name : "SEMIO LONI",
            manufacturer_code : 018
        },{
            manufacturer_name : "ZAIB",
            manufacturer_code : 019
        }
        ,{
            manufacturer_name : "Golden Eagle",
            manufacturer_code : 020
        }]

        $scope.$watch(function () {
            return $scope.selectedTrailer;
        },function () {
            if ($scope.selectedTrailer.structure_name){
                for (var i=0;i<$scope.structuresObjArr.length;i++){
                    if ($scope.selectedTrailer.structure_name ===$scope.structuresObjArr[i].structure_name){
                        $scope.selectedStructure = $scope.structuresObjArr[i];
                    }
                }
            }
            if ($scope.selectedTrailer.manufacturer_name){
                for (var i=0;i<$scope.manufacturerObjArr.length;i++){
                    if ($scope.selectedTrailer.manufacturer_name ===$scope.manufacturerObjArr[i].manufacturer_name){
                        $scope.selectedManufacturer = $scope.manufacturerObjArr[i];
                    }
                }
            }
        });

        ($scope.getAllStructureNames = function () {
            function success(response){
                if (response.status.toLowerCase() ==="ok" && response.data){
                    $scope.structuresObjArr = response.data;
                }
            }
            function failure(response) {}
            structureMasterService.getStructureMasters({},success,failure);
        })();

        ($scope.getAllTrailers = function(reset){
            $scope.trailers=[];
            $scope.selectedTrailer={};
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
                    $scope.trailers = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectTrailerAtIndex($scope.indexSelectedFromList);
                }
            }
            function failure(response){
                console.log(response);
            }
            trailerMasterService.getTrailerMasters(prepareQueryFilterObj(),success,failure);
        })();

        $scope.selectTrailerAtIndex = function (index) {
            $scope.selectedTrailer = angular.copy($scope.trailers[index]);
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllTrailers();
        };

        $scope.addNewTrailerClicked = function () {
            $scope.selectedTrailer = {};
            $scope.selectedStructure = {};
            $scope.selectedManufacturer = {};
            var listItem = $($('.lv-item')[$scope.indexSelectedFromList]);
            listItem.removeClass('grn');
            $scope.currentMode = "add";
        };

        $scope.editTrailerClicked = function() {
            $scope.currentMode = "edit";
        };

        $scope.selectStrucData = function(d) {
            $scope.selectedTrailer.number_of_axle = d.total_tyres;
        }

        $scope.saveTrailer = function(TrailerForm) {
            function successAddTrailer(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllTrailers(true);
            }

            function successUpdateTrailer(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllTrailers(false);
            }
            function failureAddTrailer(res){
                console.error("failure add Trailer: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedTrailer.structure_name = $scope.selectedStructure.structure_name;
                $scope.selectedTrailer.manufacturer_name = $scope.selectedManufacturer.manufacturer_name;
                return $scope.selectedTrailer;
            }
            if ($scope.currentMode ==="add") {
                console.log(JSON.stringify($scope.selectedPartCategories));
                trailerMasterService.addTrailerMaster(parseBeforeSave(), successAddTrailer, failureAddTrailer);
            }else if ($scope.currentMode==="edit"){
                console.log(JSON.stringify($scope.selectedPartCategories));
                trailerMasterService.updateTrailerMaster($scope.selectedTrailer._id, parseBeforeSave(), successUpdateTrailer, failureAddTrailer);
            }
        };

        $scope.deleteTrailerClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Trailer "+$scope.selectedTrailer.trailer_number+", "
                + $scope.selectedTrailer.structure_name+" will be removed from tyre masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeleteTrailer(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllTrailers(true);
                    }
                }
                function failureDeleteTrailer(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                trailerMasterService.deleteTrailerMaster($scope.selectedTrailer._id,
                    $scope.selectedTrailer, successDeleteTrailer, failureDeleteTrailer);
            });
        };
    });