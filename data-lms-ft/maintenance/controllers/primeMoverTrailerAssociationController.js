/**
 * Created by manish on 3/2/17.
 */

materialAdmin.controller("primeMoverTrailerAssociationController",
    function($rootScope, $state, $scope, $timeout, $localStorage,
             growlService, structureMasterService, $uibModal, primeMoverTrailerAssociationService,
    trailerMasterService, Vehicle) {
        $scope.primeMoverTrailerAssociations=[];
        $scope.regVehicles =[];
        $scope.trailers = [];
        $scope.selectedPrimeMoverTrailerAssociation={};
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
        $scope.aCategory = ["Associated","Disassociated"]

        $scope.$watch(function () {
            return $scope.selectedPrimeMoverTrailerAssociation;
        },function () {

        });

        ($scope.getAllRegVehicles = function () {
            function success(response) {
                if (response && response.data && response.data.data){
                    $scope.regVehicles = response.data.data;
                }
            }
			function failure(response) {
				var msg = response.data && response.data.message;
				swal('Error', msg, 'error');
			}
			let req = {ownershipType: "Own"};
            Vehicle.getNameTrim1(req, success, failure); //get category = Horse and own vehicle
        })();

        ($scope.getAllRegVehicles = function () {
            function success(response) {
                if (response && response.data && response.data.data){
                    $scope.regVehiclesAvailable = response.data.data;
                }
            }
			function failure(response) {
				var msg = response.data && response.data.message;
				swal('Error', msg, 'error');
			}
			let req = {ownershipType: "Own"};
			Vehicle.getNameTrim1(req, success, failure); //get category = Horse and own vehicle
        })();

        ($scope.getTrailers = function () {
            function success(response) {
                $scope.trailers = response.data;
            }
            trailerMasterService.getTrailerMastersAvailable({},success);
        })();

        ($scope.getAllTrailers = function () {
            function success(response) {
                $scope.aTrailersAll = response.data;
            }
            trailerMasterService.getTrailerMastersALL({},success);
        })();

		$scope.downloadPMT = function(){
			if($scope.primeMoverTrailerAssociations && $scope.primeMoverTrailerAssociations.length>0){
				primeMoverTrailerAssociationService.getPrimeMoverTrailerAssociations({download:true}, function(data) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				});
			}else{
				swal("warning","Data not available.","warning")
			}
		}

        function prepareFilterObject(){
            var myFilter = {};
			if($scope.currentPage){
				myFilter.skip = $scope.currentPage;
			}
            if($scope.selVehicle){
              myFilter.vehicle_reg_no = $scope.selVehicle;
            }
            if($scope.selTrailer){
              myFilter.trailer_no = $scope.selTrailer;
            }
            if(($scope.status == "Associated") || ($scope.status == "Disassociated")){
                myFilter.isDisassociated = $scope.status == "Disassociated"?true:false;
            }
            return myFilter;
        };

        $scope.getAllPrimeMoverTrailerAssociations = function(reset){
            $scope.primeMoverTrailerAssociations=[];
            $scope.selectedPrimeMoverTrailerAssociation={};
            if (reset){
                $scope.indexSelectedFromList=0;
            }
            function success(response){
                //console.log(data);
                if(response.data && response.data.length>0){
                    $scope.primeMoverTrailerAssociations = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectPrimeMoverTrailerAssociationAtIndex($scope.indexSelectedFromList);
                }
            }
            function failure(response){
                console.log(response);
            }
            primeMoverTrailerAssociationService.getPrimeMoverTrailerAssociations(prepareFilterObject(),success,failure);
        };
        $scope.getAllPrimeMoverTrailerAssociations();

        $scope.selectPrimeMoverTrailerAssociationAtIndex = function (index) {
            $scope.selectedPrimeMoverTrailerAssociation = angular.copy($scope.primeMoverTrailerAssociations[index]);
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllPrimeMoverTrailerAssociations();
        };



        $scope.associateOrDisassociate = function (disassociate) {
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/primeMoverTrailerAssociationModal.html',
                controller: 'primeMoverTrailerAssociationModalController',
                resolve: {
                    objPrimeMoverTrailerAssociation : function(){
                        return disassociate
                    },
                    trailers : function(){
                        return $scope.trailers
                    },
                    regVehicles : function(){
                        return $scope.regVehiclesAvailable
                    }
                }
            });

            modalInstance.result.then(
                function(data) {
                    if(data && data.data && data.message){
                        swal("success!", data.message, "success")
                    }
                    $state.reload();
                }, function(data) {
                    if (data != 'cancel') {
                        if(data && data.message){
                            swal("Oops!", data.message, "error")
                        }
                    }
                }
            );
        };

        /*$scope.savePrimeMoverTrailerAssociation = function(PrimeMoverTrailerAssociationForm) {
            function successAddPrimeMoverTrailerAssociation(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllPrimeMoverTrailerAssociations(true);
            }

            function successUpdatePrimeMoverTrailerAssociation(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllPrimeMoverTrailerAssociations(false);
            }
            function failureAddPrimeMoverTrailerAssociation(res){
                console.error("failure add Trailer: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedPrimeMoverTrailerAssociation.structure_name = $scope.selectedStructure.structure_name;
                return $scope.selectedPrimeMoverTrailerAssociation;
            }
            if ($scope.currentMode ==="add") {
                console.log(JSON.stringify($scope.selectedPartCategories));
                primeMoverPrimeMoverTrailerAssociationAssociationService
                    .addPrimeMoverTrailerAssociation(parseBeforeSave(), successAddTrailer, failureAddTrailer);
            }else if ($scope.currentMode==="edit"){
                console.log(JSON.stringify($scope.selectedPartCategories));
                primeMoverTrailerAssociationService.updatePrimeMoverTrailerAssociation
                ($scope.selectedPrimeMoverTrailerAssociation._id, parseBeforeSave(),
                    successUpdatePrimeMoverTrailerAssociation, failureAddPrimeMoverTrailerAssociation);
            }
        };*/

        $scope.deletePrimeMoverTrailerAssociationClicked = function(){
            swal({
                title: "Confirm delete ?",
                text: "Prime mover trailer association "+$scope.selectedPrimeMoverTrailerAssociation.trailer_no+", "
                + $scope.selectedPrimeMoverTrailerAssociation.vehicle_reg_no+" will be removed from tyre masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function successDeletePrimeMoverTrailerAssociation(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllPrimeMoverTrailerAssociations(true);
                    }
                }
                function failureDeletePrimeMoverTrailerAssociation(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                primeMoverTrailerAssociationService.deletePrimeMoverTrailerAssociation($scope.selectedPrimeMoverTrailerAssociation._id,
                    $scope.selectedPrimeMoverTrailerAssociation,
                    successDeletePrimeMoverTrailerAssociation, failureDeletePrimeMoverTrailerAssociation);
            });
        };
    });

materialAdmin.controller("primeMoverTrailerAssociationModalController",function($rootScope, $scope, $interval, $state ,$stateParams, $uibModalInstance,
             objPrimeMoverTrailerAssociation, regVehicles, trailers, primeMoverTrailerAssociationService,
             growlService, otherUtils,DateUtils, formValidationgrowlService){

    $scope.objPrimeMoverTrailerAssociation = objPrimeMoverTrailerAssociation;
    $scope.trailers = trailers;
    $scope.regVehicles = regVehicles;

    if (otherUtils.isEmptyObject($scope.objPrimeMoverTrailerAssociation)) {
        $scope.objPrimeMoverTrailerAssociation = {};
        $scope.objPrimeMoverTrailerAssociation.association_datetime = new Date();
        $scope.currentMode = "Associate";
    } else{
        $scope.currentMode = "Disassociate";
        $scope.objPrimeMoverTrailerAssociation.isDisassociated = true;
    }

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
        $scope.objPrimeMoverTrailerAssociation.isDisassociated = false
    };

    $scope.savePrimeMoverTrailerAssociation = function(PrimeMoverTrailerAssociationForm) {
        function success(res) {
            if (res && res.data && (res.status == "OK")) {
                $uibModalInstance.close(res);
            } else {
                $uibModalInstance.dismiss(res);
            }
        }

        function failure(res) {
            $uibModalInstance.dismiss(res);
        }
        function parseBeforeSave(){
            return $scope.objPrimeMoverTrailerAssociation;
        }
        if ($scope.currentMode ==="Associate") {
            primeMoverTrailerAssociationService
                .addPrimeMoverTrailerAssociation(parseBeforeSave(), success
                    , failure);
        }else if ($scope.currentMode==="Disassociate"){
            primeMoverTrailerAssociationService.updatePrimeMoverTrailerAssociation
            ($scope.objPrimeMoverTrailerAssociation._id, parseBeforeSave(),
                success, failure);
        }
    };
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
    //************* New Date Picker for multiple date selection in single form ******************

    $scope.readingCheck = function(){
        if($scope.objPrimeMoverTrailerAssociation.odometer_on_disassociation < $scope.objPrimeMoverTrailerAssociation.odometer_on_association){
            swal("Please Enter greater then association reading.","","warning");
            $scope.objPrimeMoverTrailerAssociation.odometer_on_disassociation = '';
        }
    }

});
