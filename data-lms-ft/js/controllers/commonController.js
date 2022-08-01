materialAdmin.controller("singleDocumentUploadPopupController", function(
	$uibModal,
	$uibModalInstance,
	$scope,
	label)
{
	$scope.label = label;
	$scope.upload = function(form) {
		console.log(form);
		return;
		if(form.$valid) {
			var data = {};
			data.fileUpload = true;
			data.formData = new FormData();
			$uibModalInstance.close(data);
		}
	}
});
