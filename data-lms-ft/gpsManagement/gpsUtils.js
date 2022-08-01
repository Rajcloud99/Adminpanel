/**
 * Initial version by: Nipun Bhardwaj
 * Initial version created on: 13/08/18
 */


$rootScope.authenticationCallback = function (response) {
	var oRes = JSON.parse(response);
	if (oRes) {
		if ((oRes.status === 'OK') && (oRes.message === 'authenticated')) {
			oRes.data.id = 1;
			if (oRes.data.sub_users && oRes.data.sub_users.length) {
				for (var t = 0; t < oRes.data.sub_users.length; t++) {
					oRes.data.sub_users[t].id = '1.' + t;
				}
			}
			$localStorage.user = oRes.data;
			$localStorage.preservedSelectedUser = $localStorage.user;
			// $scope.getDeviceInfo()//call GET Device Info service
			// $scope.getDeviceConfig()//call GET Device configuration service
			// $rootScope.selectedUser = $localStorage.user;
			// $rootScope.getAllTracksheetData();
		}
		else if (oRes.status === 'ERROR') {
			swal(oRes.message, "", "error");
		}
	}
};
