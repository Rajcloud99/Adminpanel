/**
 * Created by manish on 1/8/16.
 */
materialAdmin.controller("appController",
    function($rootScope, $stateParams, $state, $scope, $localStorage, ReportService, constants, $interval, $timeout, otherUtils, appService) {
        $scope.userLoggedIn = $localStorage.ft_data.userLoggedIn;
        $scope.client_config = $localStorage.ft_data.client_config;
        $scope.access_control = $localStorage.ft_data.access_control;
        $scope.constants = constants;
        $scope.appwidgets = $localStorage.ft_data.appwidgets;
    });
