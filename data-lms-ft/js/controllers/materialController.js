/**
 * Created by manish on 29/8/16.
 */

materialAdmin.controller("materialController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, materialService, URL, client_config, $localStorage,$uibModal, growlService, Pagination) {
        $scope.materialGroups=[];
        $scope.materialTypes=[];
        $scope.client_config = client_config;
        $scope.materialTypeName="";
		$scope.pagination = angular.copy(Pagination); // initialize pagination
		$scope.pagination2 = angular.copy(Pagination); // initialize pagination
		$scope.pagination.currentPage = 1;
		$scope.pagination2.currentPage2 = 1;
		$scope.pagination.maxSize = 3;
		$scope.pagination2.maxSize2 = 3;
		$scope.pagination.itemsPerPage = 9;
		$scope.pagination2.itemsPerPage2 = 10;
		let pagi;
		let pagi2;
		$scope.oFilter = {};


        $scope.onClickType = function(value, index){
               $scope.selectType = value;
               $scope.typeIndex = index;
        }

        $scope.onClickGroup = function(value, index){
            $scope.selectGroup = value;
            $scope.groupIndex = index;
     }

        $scope.getAllMaterialGroups = function(queryObj){
			$scope.pagi2 = true;
			let request = prepareFilterObject(queryObj);
			$scope.pagi2 = false;
            function succGetMaterials(response){
                console.log(response.data);
                if(response.data && response.data.length>0){
                    $scope.materialGroups = response.data;
					$scope.pagination2.total_pages2 = response.pages;
					$scope.pagination2.totalItems2 = response.count;
                }
            }
            function failGetMaterials(response){
                console.log(response);
            }
            //var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            materialService.getMaterialGroups(request,succGetMaterials,failGetMaterials);
        };

        $scope.getAllMaterialTypes = function(queryObj){
        	$scope.pagi = true;
			let request = prepareFilterObject(queryObj);
			$scope.pagi = false;
            function succGetMaterials(response){
                console.log(response.data);
                if(response.data && response.data.length>0){
                    $scope.materialTypes = response.data;
					$scope.pagination.total_pages = response.pages;
					$scope.pagination.totalItems = response.count;
                }
            }
            function failGetMaterials(response){
                console.log(response);
            }
            //var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            materialService.getMaterialTypes(request,succGetMaterials,failGetMaterials);
        };

		function prepareFilterObject(queryObj) {
			let myFilter = {};

			if($scope.oFilter.hsn)
				myFilter.hsnCode = $scope.oFilter.hsn;

			if($scope.oFilter.material)
				myFilter.material = $scope.oFilter.material;

			if($scope.oFilter.materialGroup)
				myFilter.name = $scope.oFilter.materialGroup;

			if($scope.oFilter.materialCode)
				myFilter.code = $scope.oFilter.materialCode;

			if($scope.pagination && $scope.pagi) {
				myFilter.no_of_docs = 16
				myFilter.skip = $scope.pagination.currentPage;
			}
			if($scope.pagination2 && $scope.pagi2) {
				myFilter.no_of_docs = 16
				myFilter.skip = $scope.pagination2.currentPage2;
			}

			if(queryObj && $scope.pagi)
				myFilter.skip = $scope.pagination.currentPage = 1;

			if(queryObj && $scope.pagi2)
				myFilter.skip = $scope.pagination2.currentPage2 = 1;


			return myFilter;
		}

        $scope.modalMaterialGroup = function(objMaterialGroup) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/material/dialogMaterialGroup.html',
                controller: 'materialGroupModalController',
                resolve: {
                    objMaterialGroup : function(){
                        return objMaterialGroup
                    }
                }
            });

            modalInstance.result.then(function(message) {
                if (message) {
                    growlService.growl(message,"success",3);
                    $scope.getAllMaterialGroups();
                }
            }, function(data) {
            });
        };

        $scope.modalMaterialType = function(objMaterialType) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/material/dialogMaterialType.html',
                controller: 'materialTypeModalController',
                resolve: {
                    objMaterialType: function(){
                        return objMaterialType;
                    },
                    materialGroups: function(){
                        return $scope.materialGroups;
                    }
                }
            });

            modalInstance.result.then(function(message) {
                    if (message) {
                        growlService.growl(message,"success",3);
                        $scope.getAllMaterialTypes();
                    }
                }, function(data) {
                    if (data != 'cancel') {
                        swal("Oops!", data.data.error_message, "error")
                    }
            });
        };

        $scope.addMaterialType = function(){
            $scope.modalMaterialType({});
        };
        $scope.addMaterialGroup = function(){
            $scope.modalMaterialGroup({});
        };
        $scope.editMaterialType = function(materialType){
            $scope.modalMaterialType(materialType);
        };
        $scope.editMaterialGroup = function(materialGroup){
            $scope.modalMaterialGroup(materialGroup);
        };

        $scope.deleteMaterialGroup = function(materialGroup){
            swal({
                title: "Confirm delete ?",
                text: "Material group "+materialGroup.name+" will be removed from material masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteMaterial(response){
                    if (response.message){
                        growlService.growl(response.message, "success", 3);
                        $scope.getAllMaterialGroups();
                    }
                }

                function failDeleteMaterial(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",3);
                    }
                }
                materialService.deleteMaterialGroup(materialGroup,succDeleteMaterial,failDeleteMaterial);
            });
        };

        $scope.deleteMaterialType = function(materialType){
            swal({
                title: "Confirm delete ?",
                text: "Material type "+ materialType.name+" will be removed from material masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteMaterial(response){
                    if (response.message){
                        growlService.growl(response.message, "success", 3);
                        $scope.getAllMaterialTypes();
                    }
                }

                function failDeleteMaterial(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",3);
                    }
                }
                materialService.deleteMaterialType(materialType,succDeleteMaterial,failDeleteMaterial);
            });
        };

        $scope.getAllMaterialGroups(true);
        $scope.getAllMaterialTypes(true);
    });

materialAdmin.controller("materialGroupModalController",
    function($rootScope, $scope, $interval, $state ,$stateParams, $uibModalInstance, objMaterialGroup,
             materialService, constants, growlService,otherUtils,formValidationgrowlService, $localStorage) {

        $scope.objMaterialGroup = objMaterialGroup ||{};

        if (otherUtils.isEmptyObject(objMaterialGroup)) {
            $scope.form_material_group = "Add";
        }else{
            $scope.form_material_group = "Edit";
        }

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveMaterialGroup = function(form) {

            function prepareDataMaterialGroupUpdate(){
                var objMaterialGroupCopy = angular.copy($scope.objMaterialGroup);
                objMaterialGroupCopy.last_modified_at = undefined;
                objMaterialGroupCopy.created_at = undefined;
                objMaterialGroupCopy.__v = undefined;
                objMaterialGroupCopy._id=undefined;
                objMaterialGroupCopy.clientId= undefined;
                return objMaterialGroupCopy;
            }
            function success(res) {
                if (res && res.status == "OK") {
                    $uibModalInstance.close(res.message);
                } else {
                    //$uibModalInstance.dismiss(res);
                    growlService.growl(constants.default_error_message,"danger",3);
                }
            }

            function failure(res) {
                //$uibModalInstance.dismiss(res);
            }

            if(form.$valid){
                if ($scope.form_material_group =='Add'){
                   //$scope.objMaterialGroup.clientId = $localStorage.ft_data.userLoggedIn.clientId;
                   materialService.addMaterialGroup($scope.objMaterialGroup, success, failure);
                }else{
                    materialService.updateMaterialGroup($scope.objMaterialGroup._id,
                    prepareDataMaterialGroupUpdate(), success, failure);
                }
            } else {
              $scope.mmsg = '';
              $scope.materialGroupmsg = true;
              $scope.mmsg = formValidationgrowlService.findError(form.$error);
              setTimeout(function(){
                if($scope.materialGroupmsg){
                  $scope.$apply(function() {
                    $scope.materialGroupmsg = false;
                  });
                }
            }, 7000);
      }
        }
    }
);

materialAdmin.controller("materialTypeModalController",
    function($rootScope, $scope, $interval, $state ,$stateParams, $uibModalInstance, objMaterialType, materialGroups,
             materialService, constants, growlService,formValidationgrowlService,otherUtils, $localStorage) {

        $scope.objMaterialType = objMaterialType || {};
        $scope.materialGroups = materialGroups;
        //$scope.objMaterialGroupSelected = {};

        if (otherUtils.isEmptyObject(objMaterialType)) {
            $scope.form_material_type = "Add";
			$scope.aMaterialType = [{materialType: ''}];
        }else {
			$scope.form_material_type = "Edit";
			$scope.aMaterialType = $scope.aMaterialType || [];
			if ($scope.objMaterialType.material)
			{
				$scope.objMaterialType.material.forEach(obj => {
					$scope.aMaterialType.push({materialType:obj});
				});
		    }
			$scope.aMaterialType.push({materialType:''});
        }

		$scope.objMaterialType.category = "hsn";

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

		$scope.addEmptyInput = function (materialType, index) {
			if(index === $scope.aMaterialType.length-1 && (materialType != '' || typeof materialType != 'undefined'))
				$scope.aMaterialType.push({materialType: ''});
		};

        $scope.saveMaterialType = function(vform) {
            function prepareDataMaterialTypeUpdate(){
                var objMaterialTypeCopy = angular.copy($scope.objMaterialType);
                objMaterialTypeCopy.last_modified_at = undefined;
                objMaterialTypeCopy.created_at = undefined;
                objMaterialTypeCopy.__v = undefined;
                objMaterialTypeCopy._id=undefined;
                objMaterialTypeCopy.clientId= undefined;
				objMaterialTypeCopy.material =  [];
				for(let i = 0; i < ($scope.aMaterialType.length -1 ); i++){
					objMaterialTypeCopy.material.push($scope.aMaterialType[i].materialType);
				}
                return objMaterialTypeCopy;
            }
            function success(res) {
                if (res && res.status == "OK") {
                    $uibModalInstance.close(res.message);
                } else {
					swal('Error!', res.message, 'error');
                    // growlService.growl(constants.default_error_message,"danger",3);
                }
            }

            function failure(res) {
				swal('Error!', res.message, 'error');
                //$uibModalInstance.dismiss(res);
            }

            if(vform.$valid){
				$scope.objMaterialType.material = [];
            	for(let i = 0; i < ($scope.aMaterialType.length -1 ); i++){
					$scope.objMaterialType.material.push($scope.aMaterialType[i].materialType);
				}

                if ($scope.form_material_type =='Add'){
                    materialService.addMaterialType($scope.objMaterialType, success, failure);
                }else{
                    materialService.updateMaterialType($scope.objMaterialType._id,
                        prepareDataMaterialTypeUpdate(), success, failure);
                }
            }  else{
              $scope.Tmsg = '';
              $scope.materialTypemsg = true;
              $scope.Tmsg = formValidationgrowlService.findError(vform.$error);
              setTimeout(function(){
                if($scope.materialTypemsg){
                  $scope.$apply(function() {
                    $scope.materialTypemsg = false;
                  });
                }
            }, 7000);
         }
        }
    }
);




