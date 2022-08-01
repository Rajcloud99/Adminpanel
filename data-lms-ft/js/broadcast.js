materialAdmin.factory('broadcastService', function ($rootScope) {
    var broadcastService = {};

    broadcastService.message = '';

    broadcastService.prepForBroadcast = function (msg) {
        this.message = msg;
        this.broadcastItem();
    };

    broadcastService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return broadcastService;
});
