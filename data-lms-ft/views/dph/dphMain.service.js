materialAdmin.service('dphService', dphService);

dphService.$inject = ['HTTPConnection', 'URL'];

function dphService(HTTPConnection, URL) {

	this.add = add;
	this.get = get;
	this.remove = remove;
	// this.update = update;
	// this.autosuggest = autosuggest;

	// Actual Function

	function get(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.DPH_GET, request, onSuccess, onFailure);

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

		HTTPConnection.post(URL.DPH_ADD, request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	// function autosuggest(request, successCallback, failureCallback) {

	// 	HTTPConnection.post(URL.INCENTIVE_AUTO_SUGGEST, request, onSuccess, onFailure);

	// 	function onFailure(data) {
	// 		if(typeof failureCallback === 'function')
	// 			failureCallback(data.data);
	// 	}
	// 	function onSuccess(data) {
	// 		if(typeof successCallback === 'function')
	// 			successCallback(data.data);
	// 	}
	// }

	function remove(request, successCallback, failureCallback) {

		var url = URL.DPH_DELETE + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess, onFailure);

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
