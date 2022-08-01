materialAdmin.controller("companyCtrl", function($rootScope, $scope, $stateParams, constants) {
    for (var key in constants.company_details) {
        $scope[key] = constants.company_details[key];
    }
});
