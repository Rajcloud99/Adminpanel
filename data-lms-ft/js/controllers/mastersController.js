/**
 * Created by manish on 15/10/16.
 */
materialAdmin.controller("mastersController",
    function(client_config, $scope, $rootScope,
             userLoggedIn, $localStorage, constants) {
        $scope.client_config = client_config;
        $scope.userLoggedIn = userLoggedIn;
        $scope.role_local_data = $localStorage.ft_data.login_user_role_data;
        $scope.apps  = $rootScope.getaSrefPair($localStorage.ft_data.sideBarApps);
        $scope.headerTitle = $localStorage.ft_data.headerTitle;
        $scope.sideBarVisible = $scope.userLoggedIn && $scope.userLoggedIn.sidebar_visible;

    });
