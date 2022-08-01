/**
 * Created by manish on 15/10/16.
 */
materialAdmin.controller("settingsController",
    function($rootScope, $stateParams, $state, $scope, userService, $localStorage, growlService , constants) {

        $scope.tab_active_settings = 1;
        $scope.objPasswordUpdate = {};
        $scope.allowedResources = $localStorage.ft_data.login_user_role_data;
        $scope.objAppsVisible ={};
        $scope.objAppsOrder ={};
        $scope.sideBarVisible = $localStorage.ft_data.userLoggedIn.sidebar_visible;
        $scope.userPref = {};


		$scope.updatePassword = function() {
			function success (response) {
				if (response.message) {
					growlService.growl(response.message,"success",2)
				}
			}
			function failure(response){
				var message = response.message ||response.error_message;
				if (message) {
					growlService.growl(message,"danger",2);
				}
			}
			if ($scope.objPasswordUpdate.new_password !== $scope.objPasswordUpdate.confirm_new_password) {
				growlService.growl("New password does not match", "danger", 2);
			}else{
				$scope.objPasswordUpdate.userId = $localStorage.ft_data.userLoggedIn.userId;
				userService.updatePassword($scope.objPasswordUpdate,success,failure)
			}
		};

        /**Check if allowed visible app is in role data any more **/
        for (var i=0;i<$localStorage.ft_data.userLoggedIn.apps_visible.length;i++){
            if ($scope.allowedResources && $scope.allowedResources[$localStorage.ft_data.userLoggedIn.apps_visible[i]]) {
                $scope.objAppsVisible[$localStorage.ft_data.userLoggedIn.apps_visible[i]] = true;
            }
        }

        $scope.selectTabSettings = function (tab) {
            $scope.tab_active_settings = tab;
        };

        $scope.getResourceNameFromKey = function (key) {
            return constants.app_key_desc_pair[key];
        };

        ($scope.getUserPrefs = function(){
            function success(response){
                if (response && response.data && response.data.length>0) {
                    $scope.userPref = response.data[0];
                }
            }
            function failure(response){}

            userService.getUserPrefs($localStorage.ft_data.userLoggedIn.userId, success, failure);
        })();



        $scope.updateDashboardPreferences = function () {
            function success (response) {
                if (response.message) {
                    growlService.growl(response.message,"success", 2)
                }
            }
            function failure(){
                var message = response.message ||response.error_message;
                if (message) {
                    growlService.growl(message,"danger",2);
                }
            }

            var updateBody ={};
            var orderedArrAppsVisible = [];
            var finalOrderApps = [];
            updateBody.sidebar_visible = $scope.sideBarVisible;
            for (var key in $scope.objAppsVisible){
                if ($scope.objAppsVisible[key]){
                    var appIndex = $scope.objAppsOrder[key];
                    if (appIndex && appIndex.length>0){
                        orderedArrAppsVisible[parseInt(appIndex)] = key;
                    }else{
                        finalOrderApps.push(key);
                    }
                }
            }
            //final parse for ordered push
            for (var i =0; i<orderedArrAppsVisible.length;i++){
                if (orderedArrAppsVisible[i]){
                    finalOrderApps.push(orderedArrAppsVisible[i]);
                }
            }
            updateBody.apps_visible = finalOrderApps;
            userService.updateUser($localStorage.ft_data.userLoggedIn._id, updateBody,success,failure)
        };

        $scope.saveUserPrefs = function () {
            $scope.userPref.email = $localStorage.ft_data.userLoggedIn.email;
            function success (response) {
                growlService.growl(response.message,"success", 2);
                if (response && response.data) {
                    $scope.userPref = response.data;
                }
            }
            function failure(response){
                growlService.growl(response.message || response.error_message,"danger",2);
            }
            if ($scope.userPref._id){
                userService.updateUserPrefs($scope.userPref._id,$scope.userPref,success, failure);
            }else{
                userService.addUserPrefs($scope.userPref, success, failure);
            }
        }
    });
