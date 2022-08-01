materialAdmin.service('createGRService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {

	this.add = function(payload, success, failure) {
		HTTPConnection.post(URL.BOOKING_ADD_TRIP_GR, payload, success, failure);
	};

}]);
