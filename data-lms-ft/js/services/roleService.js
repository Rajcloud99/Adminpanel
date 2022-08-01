/**
 * Created by manish on 26/8/16.
 */

materialAdmin.service('roleService', ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {
	function prepareParameters(oFilter){
		var sParam = "";
		for(var property in oFilter){
			sParam = sParam +"&"+ property +"="+oFilter[property];
		}
		return sParam;
	}

	this.getRoles = function(oFilter,success, failure) {
        var parseSuccessResp = function(data) {
            // console.log("success get roles" + JSON.stringify(data))
            success(data.data)
        }
        var parseFailureResp = function(data) {
                // console.log("failure get roles" + JSON.stringify(data))
                failure(data.data)
            }
            // var url_with_params = URL.ROLE_GET +utils.prepareQeuryParams(oQuery)
        var url_with_params = URL.ACCESS_GET+ "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp)
    }

	this.getTableColSet = function(oFilter,success, failure) {
		var parseSuccessResp = function(data) {
			success(data.data)
		}
		var parseFailureResp = function(data) {
			failure(data.data)
		}

		var url_with_params = URL.ACCESS_TABLE_COL_SET+ "?" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp)
	}

    this.updateRole = function(_id, roleData, success, failure) {
        var parseSuccessResp = function(data) {
            // console.log("success update role" + JSON.stringify(data))
            success(data.data)
        }
        var parseFailureResp = function(data) {
                // console.log("failure update role" + JSON.stringify(data))
                failure(data.data)
            }
            // console.log("role update called  clientId" + " " + JSON.stringify(roleData))
        var url_with_params = URL.ACCESS_UPDATE + _id
        HTTPConnection.put(url_with_params, roleData, parseSuccessResp, parseFailureResp)
    }

    this.deleteRole = function(_id, success, failure) {
        var parseSuccessResp = function(data) {
            // console.log("success delete role" + JSON.stringify(data))
            success(data.data)
        }
        var parseFailureResp = function(data) {
                // console.log("failure delete role" + JSON.stringify(data))
                failure(data.data)
            }
            // console.log("role delete called" + JSON.stringify(data))
        var url_with_params = URL.ACCESS_DELETE + _id
        HTTPConnection.delete(url_with_params, parseSuccessResp, parseFailureResp)
    }
}])
