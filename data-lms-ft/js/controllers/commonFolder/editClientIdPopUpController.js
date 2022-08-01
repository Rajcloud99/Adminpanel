
function editClientIdPopUpController(
	$scope,
	$uibModalInstance,
	selectedInfo,
	commonService,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	var vehicleDriver = {};

	// init
	(function init() {
		vm.selectedInfo = angular.copy(selectedInfo);

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}
	function submit() {
/*
		let fcmId = $scope.$user.client_allowed.find(o => o.name === 'DGFC FCM');

		if(vm.selectedInfo.clientId != fcmId.clientId){
			if(vm.selectedInfo.clientR.indexOf(fcmId.clientId) == -1)
				vm.selectedInfo.clientR.push(fcmId.clientId);
		}
*/
		let request = {
			client_id: vm.selectedInfo.clientId,
			clientR: vm.selectedInfo.clientR,
			type: vm.selectedInfo.client_type,
			_id: vm.selectedInfo._id,
		};
		commonService.updateClient(request, success, failure);

		function success(res) {
			var msg = res.message;
			swal('Update', msg, 'success');
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.message;
			growlService.growl(msg, 'danger', 2);
			$uibModalInstance.dismiss(res);
		}
	}

}
