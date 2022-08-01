/**
 * Created by Dev
 */

materialAdmin
	.controller("directoryController", directoryController);

directoryController.$inject = [
	'$scope',
	'$state',
	'DatePicker',
	'lazyLoadFactory',
	'stateDataRetain',
	'directoryService'
];

function directoryController(
	$scope,
	$state,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	directoryService
) {

	let vm = this;

	vm.getAllDirectory = getAllDirectory;
	vm.downloadDirectory = downloadDirectory;

	// this function trigger on state refresh
	$scope.onStateRefresh = function () {
		getAllDirectory();
	};

	// INIT functions
	(function init() {

		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory(); // init lazyload

		if (stateDataRetain.init($scope, vm))
			return;

		vm.oFilter = {};
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: [
				'first name',
				'last name',
				'designation',
				'company name',
				'city',
				'state',
				'contact address',
				'address1',
				'address2',
				'Pincode',
				'mobile',
				'email',
			]
		};
		vm.tableHead = [
			{
				'header': 'first name',
				'bindingKeys': 'first_name'
			},
			{
				'header': 'last name',
				'bindingKeys': 'last_name'
			},
			{
				'header': 'designation',
				'bindingKeys': 'designation'
			},
			{
				'header': 'company name',
				'bindingKeys': 'company_name'
			},
			{
				'header': 'city',
				'bindingKeys': 'city'
			},
			{
				'header': 'state',
				'bindingKeys': 'state'
			},
			{
				'header': 'contact address',
				'bindingKeys': 'contact_address'
			},
			{
				'header': 'address1',
				'bindingKeys': 'add1'
			},
			{
				'header': 'address2',
				'bindingKeys': 'add2'
			},
			{
				'header': 'Pincode',
				'bindingKeys': 'zip'
			},
			{
				'header': 'mobile',
				'bindingKeys': 'mobile1'
			},
			{
				'header': 'email',
				'bindingKeys': 'email1'
			},
		];

		getAllDirectory(true);
	})();

	function getAllDirectory(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		directoryService.getDirectory(oFilter, function (res) {
			if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);
			}
		});
	}

	function downloadDirectory(download) {
		let oFilter = prepareFilter(download);

		directoryService.getDirectory(oFilter, onSuccess, onFailure);

		// Handle Success response
		function onSuccess(response) {
			if (download) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}
		}

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}
	}


	function prepareFilter(download) {
		var myFilter = {};

		if (vm.oFilter.city) {
			myFilter.city =  vm.oFilter.city;
		}
		if (vm.oFilter.state) {
			myFilter.state =  vm.oFilter.state;
		}
		if (vm.oFilter.company_name) {
			myFilter.company_name =  vm.oFilter.company_name;
		}
		if (vm.oFilter.mobile1) {
			myFilter.mobile1 =  Number(vm.oFilter.mobile1);
		}
		if (vm.oFilter.first_name) {
			myFilter.first_name =  vm.oFilter.first_name;
		}
		if (vm.oFilter.email1) {
			myFilter.email1 = vm.oFilter.email1;
		}
        if(download){
			myFilter.download = true;
			myFilter.no_of_docs = 5000;
		}else {
			myFilter.skip = vm.lazyLoad.getCurrentPage();
			myFilter.no_of_docs = 30;
		}

		return myFilter;
	}

}

