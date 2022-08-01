/**
 * Created by manish on 1/8/16.
 */
materialAdmin.service('simMasterService', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage','otherUtils',
	function($rootScope, HTTPConnection, URL, $localStorage, otherUtils) {

		this.getSimMasters = function(oQuery,success,failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			var url_with_params = URL.SIMMASTER_GET + otherUtils.prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
		};

		this.updateSimMaster = function(simMaster, success, failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			HTTPConnection.put(URL.SIMMASTER_UPDATE+simMaster._id, simMaster, parseSuccessResp, parseFailureResp);
		};

		this.addSimMaster = function(simMaster, success, failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			HTTPConnection.post(URL.SIMMASTER_ADD, simMaster, parseSuccessResp, parseFailureResp);
		};

		this.deleteSimMaster = function(simMaster, success, failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			HTTPConnection.delete(URL.SIMMASTER_DELETE +simMaster._id, simMaster, parseSuccessResp, parseFailureResp);
		};
	}
]);
