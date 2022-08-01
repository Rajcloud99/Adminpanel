
materialAdmin
	.controller('userDashboardController', userDashboardController);

userDashboardController.$inject = ['userDashboardService'];

function userDashboardController (
	userDashboardService
) {

	let vm = this;

	vm.test = 'hii its working';

	

	//init
	(function init () {

		getDashboardRole();


	})();

	// Actual Function
	function getDashboardRole () {

		vm.roles = {};

		return;

		var oFilter = {};
		userDashboardService.getDashboardRole(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			vm.roles = response.data.data;
		}
	}

	function upsertDashboardRole (oRequest) {

		console.log(oRequest);
		return;

		userDashboardService.upsertDashboardRole(oRequest, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			console.log(response);
			//vm.roles = response.data.data;
		}
	}
}
