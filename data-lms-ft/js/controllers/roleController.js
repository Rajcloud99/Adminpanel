materialAdmin.controller("roleController", roleController);
roleController.$inject = [
	'$rootScope',
	'$stateParams',
	'$state',
	'$scope',
	'$window',
	'$location',
	'$timeout',
	'roleService',
	'URL',
	'client_config',
	'departmentService',
	'$localStorage'
];

function roleController(
	$rootScope,
	$stateParams,
	$state,
	$scope,
	$window,
	$location,
	$timeout,
	roleService,
	URL,
	client_config,
	departmentService,
	$localStorage
) {

	$scope.selectedUser = null;
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	$scope.pageChanged = function () {
		$scope.getAllRoles(true);
	};

	$scope.loggedUserRole = ($localStorage && $localStorage.ft_data && $localStorage.ft_data.access_control) ? angular.copy($localStorage.ft_data.access_control) : {};
	$scope.getAllRoles = function (id) {
		function succGetRoles(response) {
			if (response.data && response.data.length > 0) {
				$scope.aRole = response.data;
				$scope.selectedRole = angular.copy($scope.aRole[0]);
				$scope.selectedIndex = 0;
			}
		}

		function failGetRoles(response) {
			console.log(response);
		}

		let oFilter = {all: true};
		if (id)
			oFilter._id = id;
		roleService.getRoles(oFilter, succGetRoles, failGetRoles);
	};
	$scope.getAllRoles();

	$scope.clearSearch = function () {
		$scope.getAllRoles();
	};

	$scope.getRoleByName = function (viewValue) {

		return new Promise(function (resolve, reject) {

			let requestObj = {
				name: viewValue,
			};

			roleService.getRoles(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}
	$scope.checkAllRole = function (all) {
		if (all) {
				for(let module in $scope.loggedUserRole ){
					for(let access in $scope.loggedUserRole[module]){
						$scope.loggedUserRole[module][access] = true;

					}
				}
				return $scope.selectedRole.role = $scope.loggedUserRole;

		}
		else {
			for (let module in $scope.loggedUserRole) {
				for (let access in $scope.loggedUserRole[module]) {
					$scope.loggedUserRole[module][access] = false;

				}
			}
			return $scope.selectedRole.role = $scope.loggedUserRole;
		}
	};
	$scope.selectmodules = function (module,all) {
		if(!$scope.selectedRole.role){
			$scope.selectedRole.role = {};
		}
		if (all) {
				for(let access in $scope.loggedUserRole[module]){
					$scope.loggedUserRole[module][access] = true;
			}
			return $scope.selectedRole.role[module] = $scope.loggedUserRole[module];
		}
		else {
			for(let access in $scope.loggedUserRole[module]){
				$scope.loggedUserRole[module][access] = false;
			}
			return $scope.selectedRole.role[module] = $scope.loggedUserRole[module];
		}
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.aRole = [$item];
		$scope.selectedRole = angular.copy([$item]);
		$scope.selectedIndex = 0;
		$scope.selectRole($item, 0)
	};

	$scope.selectRole = function (item, index) {
		$scope.editMode = false;
		$scope.selectedRole = angular.copy(item);
		$scope.selectedIndex = index;
	};
	$scope.resetChanges = function () {
		$scope.selectedRole = angular.copy($scope.roles[$scope.selectedIndex]);
		$scope.editMode = false;
	};

	function successSave(oRes) {
		$scope.editMode = false;
		swal('Success', oRes.message, 'success');
		console.log(oRes);
		$state.reload();
	}

	function failSave(oRes) {
		swal('Failed', oRes.message, 'error');
		console.log(oRes);
	}

	$scope.saveRole = function () {
		var oRole = angular.copy($scope.selectedRole);
		 oRole.actualClientId = oRole.clientId;
		roleService.updateRole(oRole._id, oRole, successSave, failSave);
	};

	$scope.deleteRole = function () {
		var oRole = angular.copy($scope.selectedRole);
		roleService.deleteRole(oRole._id, successSave, failSave);
	};


}
