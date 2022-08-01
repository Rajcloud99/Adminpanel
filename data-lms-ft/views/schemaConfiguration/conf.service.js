materialAdmin.service('confService', confService);

confService.$inject = ['HTTPConnection', 'URL'];

function confService(HTTPConnection, URL) {

	this.add = add;
	this.get = get;

	// Actual Function

	function get(request, successCallback, failureCallback) {

		HTTPConnection.get(URL.CONF_GET + request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	function add(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.CONF_ADD, request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

}
