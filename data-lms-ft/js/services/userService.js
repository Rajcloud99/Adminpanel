materialAdmin.service('userService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

		this.getPassword = function(data, successCallback, failureCallback) {

			HTTPConnection.get(URL.GET_PASS + data._id, onSuccess, onFailure);

			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		};

        this.getUsers = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get users" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get users" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.USER_GET + utils.prepareQeuryParams(oQuery) ;
            //console.log("user get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateUser = function(user_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update user" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update user" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("user update called" + user_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.USER_UPDATE + user_id, data, parseSuccessResp, parseFailureResp);
        };

        this.addUser = function(user, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add user" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add user" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("user add called " + JSON.stringify(user));
            HTTPConnection.post(URL.USER_ADD, user, parseSuccessResp, parseFailureResp);
        };

        this.deleteUser = function(user, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete user" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete user" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("user delete called" + user._id + " " + user.full_name);
            HTTPConnection.delete(URL.USER_DELETE + user._id, user, parseSuccessResp, parseFailureResp);
        };

        this.getUserNames = function(name,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            var url_with_params = URL.USER_GET_TRIM + "&all=true&full_name=" + name;
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.uploadUserDocs = function(documents, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.USER_UPLOAD_FILE + documents._id, documents, parseSuccessResp, parseFailureResp);
        };

        this.resetPassword = function(user, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.USER_PASS_RESET , user, parseSuccessResp, parseFailureResp);
        };

        this.updatePassword = function(updateBody, success, failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.USER_PASS_UPDATE , updateBody, parseSuccessResp, parseFailureResp);
        };

        this.addUserPrefs = function (data,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.post(URL.USERPREF_ADD,data,parseSuccessResp,parseFailureResp);
        };

        this.getUserPrefs = function (employeeId,success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.get(URL.USERPREF_GET+"?"+"employeeId="+employeeId,parseSuccessResp,parseFailureResp);
        };

        this.updateUserPrefs = function (_id, data, success,failure) {
            var parseSuccessResp = function(data){
                success(data.data);
            };
            var parseFailureResp = function(data){
                failure(data.data);
            };
            HTTPConnection.put(URL.USERPREF_UPDATE+_id, data, parseSuccessResp, parseFailureResp);
        };

		this.userIsAvailiable = function (_id, success,failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			HTTPConnection.get(URL.USER_IS_AVAILIABLE + _id, parseSuccessResp, parseFailureResp);
		};

		this.updateTableConfig = function(oFilter, success, failure){//console.log(oFilter);
			let url_with_params = URL.UPDATE_TABLE_CONFIG;
			HTTPConnection.post(url_with_params, oFilter, success, failure);
		};

		this.updateOneTableConfig = function (oFilter, success, failure) {
			var parseSuccessResp = function(data){
				success(data.data);
			};
			var parseFailureResp = function(data){
				failure(data.data);
			};
			let url_with_params = URL.UPDATE_USER_TABLE_CONFIG + `/${oFilter._id}`;
			HTTPConnection.put(url_with_params, oFilter, parseSuccessResp, parseFailureResp);
		};

}]);
