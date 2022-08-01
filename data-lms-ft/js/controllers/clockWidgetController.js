/**
 * Created by manish on 16/10/16.
 */
materialAdmin.controller("clockWidgetController",
    function($rootScope,$stateParams,$state, $scope, $interval){
        var tick = function() {
            $scope.clock = Date.now();
        };
        tick();
        $interval(tick, 1000);
    });