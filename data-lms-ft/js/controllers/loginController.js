/**
 * Created by manish on 8/8/16.
 */
materialAdmin.controller('loginController', ['$rootScope', '$state', '$scope', '$localStorage',
	'$sessionStorage', '$window', 'URL', 'loginService',
	function($rootScope, $state, $scope, $localStorage,
					 $sessionStorage, $window, URL, loginService) {

		$rootScope.authenticationCallback = function (response) {
			var oRes = JSON.parse(response);
			if (oRes) {
				if ((oRes.status === 'OK') && (oRes.message === 'authenticated')) {
					oRes.data.id = 1;
					if (oRes.data.sub_users && oRes.data.sub_users.length) {
						for (var t = 0; t < oRes.data.sub_users.length; t++) {
							oRes.data.sub_users[t].id = '1.' + t;
						}
					}
					$localStorage.user = oRes.data;
					$localStorage.preservedSelectedUser = $localStorage.user;
					// $scope.getDeviceInfo()//call GET Device Info service
					// $scope.getDeviceConfig()//call GET Device configuration service
					// $rootScope.selectedUser = $localStorage.user;
					// $rootScope.getAllTracksheetData();
				}
				else if (oRes.status === 'ERROR') {
					console.log(oRes.message);
				}
			}
		};

		if(!$rootScope.forceLogin && !isEmpty(
			$localStorage.ft_data)) {
			$state.go('home.apps');
			return;
		}
		function isEmpty(obj) {
			if(typeof obj === 'undefined')
				return true;
			for(var key in obj) {
				if(obj.hasOwnProperty(key))
					return false;
			}
			return true;
		}
		$scope.objLogin = {};

		$scope.loginServer = function() {
			loginService.loginServer($scope.objLogin, function () {
				$state.go('home.apps');
			});
		};
	}
]);
