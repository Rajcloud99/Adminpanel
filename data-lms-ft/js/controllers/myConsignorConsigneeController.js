materialAdmin.controller('myConsignorConsigneeController',function(
	$modal,
	$uibModal,
	$scope,
	$state,
	consignorConsigneeService,
	customer,
	growlService,
	DatePicker,
	Pagination
)	{

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.aConsignorConsignee = []; // to contain Consignor/Consignee
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.pagination.items_per_page = 8;
	$scope.selectedConsignorConsignee = null; // to contain selected Consignor/Consignee



	// functions Identifiers
	$scope.getConsignorConsignee = getConsignorConsignee;
	$scope.selectThisRow = selectThisRow;
	$scope.upsertConsignorConsignee = upsertConsignorConsignee;
	$scope.viewConsignorConsignee = viewConsignorConsignee;
	$scope.downloadReport = downloadReport;
	$scope.dateChange = dateChange;
	$scope.getCustomers = getCustomers;

	// INIT functions
	(function init(){
		getConsignorConsignee();
	})();

	// Actual Functions

	// Add or Edit Consignor/Consignee Modal
	function upsertConsignorConsignee(selectedConsignorConsignee) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myConsignorConsignee/consignorUpsert.html',
			controller: 'ConsignorConsigneeUpsertController',
			resolve: {
				'selectedConsignorConsignee': function () {
					return selectedConsignorConsignee;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				if(selectedConsignorConsignee)
					$scope.selectedConsignorConsignee = response;
				else
					$scope.aConsignorConsignee.push(response);

			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}

	// send to view Consignor/Consignee page
	function viewConsignorConsignee(selectedConsignorConsignee) {
		if(selectedConsignorConsignee){
			$state.go('masters.view1', {'data' : selectedConsignorConsignee});
		}
	}

	// Get Consignor/Consignee from backend
	function getConsignorConsignee(){

		var oFilter = prepareFilterObject($scope.oFilter);
		consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){

			$scope.aConsignorConsignee = response.data;

			// update pagination
			$scope.pagination.total_pages = response.count/$scope.pagination.items_per_page;
			$scope.pagination.totalItems = response.count;

			//  setTimeout b'cos, its called when angular has done its rendering
			setTimeout(function() {
				// show 1st row as selected row by default
				$scope.aConsignorConsignee[0] && $scope.selectThisRow($scope.aConsignorConsignee[0],0);
			});
		}
	}

	$scope.editClientId = function (selectedInfo) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/commonFolder/editClientIdPopUp.html',
			controller:  [
				'$scope',
				'$uibModalInstance',
				'selectedInfo',
				'commonService',
				editClientIdPopUpController
			],
			controllerAs: 'clientVm',
			resolve: {
				selectedInfo:{
					client_type : 'consignorConsignee',
					name:selectedInfo.name,
					clientId:selectedInfo.clientId,
					clientR:selectedInfo.clientR,
					_id:selectedInfo._id,
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			$scope.selectedInfo = data.data;
		}, function (data) {
		});
	};

	function getCustomers(viewValue){
		if(!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve,reject) {
			let customerFilter = {
				all: true,
				status: "Active",
				name: viewValue
			};

			customer.getAllcustomers(customerFilter, success);

			function success(data) {
				resolve(data.data);
			}
		});
	}

	// $scope.deleteConsignorConsignee = function() {
	// 	swal({
	// 		title: "Confirm delete ?",
	// 		text: "consignorConsignee " + $scope.selectedConsignorConsignee.name + " will be removed from Consignor/Consignee masters",
	// 		type: "warning",
	// 		showCancelButton: true,
	// 		confirmButtonColor: "#F44336",
	// 		confirmButtonText: "Delete",
	// 		closeOnConfirm: true
	// 	}, function() {
	// 		function succDeleteConsignorConsignee(response) {
	// 			if (response.message) {
	// 				growlService.growl(response.message, "success");
	// 				$state.go('masters.consignorConsignee', {}, { reload: true });
	// 			}
	// 		}
    //
	// 		function failDeleteConsignorConsignee(response) {
	// 			if (response.message) {
	// 				growlService.growl(response.message, "danger");
	// 			}
	// 		}
	// 		consignorConsigneeService.deleteConsignorConsignee($scope.selectedConsignorConsignee, succDeleteConsignorConsignee, failConsignorConsignee);
	// 	});
	// };

	$scope.deleteConsignorConsignee = function() {
		swal({
			title: "Confirm delete ?",
			text: "consignorConsignee " + $scope.selectedConsignorConsignee.name + " will be removed from Consignor/Consignee masters",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function() {
			function succDeleteConsignorConsignee(response) {
				if (response.message) {
					growlService.growl(response.message, "success");
					$state.go('masters.consignorConsignee', {}, {reload: true});

				}
			}

			function failDeleteConsignorConsignee(response) {
				if (response.message) {
					growlService.growl(response.message, "danger");
				}
			}
			consignorConsigneeService.deleteConsignorConsignee($scope.selectedConsignorConsignee, succDeleteConsignorConsignee, failDeleteConsignorConsignee);
		});
	};

	function dateChange(){
		$scope.oFilter.end_date = new Date($scope.oFilter.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date
		var month = new Date($scope.oFilter.end_date).setMonth($scope.oFilter.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > $scope.oFilter.start_date)
		$scope.oFilter.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23,59,59));
	};

	function downloadReport() {
		var oFilter = prepareFilterObject($scope.oFilter);
		oFilter.download = true;
		oFilter.all = true;
		consignorConsigneeService.getConsignorConsignee(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		}, err => {
			console.log(err);
			swal('Error!','Message not defined','error');
		});
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if(typeof oFilter.clientId !== 'undefined')
			requestFilter.clientId = oFilter.clientId;

		if(typeof oFilter.name !== 'undefined')
			requestFilter.name = oFilter.name;

		if(typeof oFilter.address !== 'undefined')
			requestFilter.address = oFilter.address;

		if(typeof oFilter.customer !== 'undefined')
			requestFilter.customer = $scope.oFilter.customer._id;

		if(typeof oFilter.businessLocation !== 'undefined')
			requestFilter.businessLocation = oFilter.businessLocation;

		if(typeof oFilter.state !== 'undefined')
			requestFilter.state = oFilter.state;

		if(typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if(typeof oFilter.contact_person !== 'undefined')
			requestFilter.contact_person = oFilter.contact_person;

		if(typeof oFilter.contact_number !== 'undefined')
			requestFilter.contact_number = oFilter.contact_number;
		if(typeof oFilter.d_code !== 'undefined')
			requestFilter.d_code = oFilter.d_code;

		if(typeof oFilter.lat !== 'undefined')
			requestFilter.lat = oFilter.lat;

		if(typeof oFilter.lng !== 'undefined')
			requestFilter.lng = oFilter.lng;

		if(typeof oFilter.last_modified_by_name!== 'undefined')
			requestFilter.lng = oFilter.last_modified_by_name;


		if(typeof oFilter.start_date !== 'undefined')
			requestFilter.from = oFilter.start_date;

		if(typeof oFilter.end_date !== 'undefined')
			requestFilter.to = oFilter.end_date;

		requestFilter.skip = $scope.pagination.currentPage;
		requestFilter.no_of_docs = $scope.pagination.items_per_page;

		return requestFilter;
	}

	function selectThisRow(oConsignorConsignee, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		$scope.selectedConsignorConsignee = oConsignorConsignee;
	}

	//////////////////////////////////////////////////


});
materialAdmin.controller('ConsignorConsigneeUpsertController',function(
	$http,
	$scope,
	$timeout,
	$uibModalInstance,
	consignorConsigneeService,
	customer,
	otherUtils,
	selectedConsignorConsignee,
	sharedResource,
	userService,
	utils
){
	// object Identifiers
	var map, drawnItems, drawControl, marker;
	$scope.oConsignorConsignee = {}; //initialize with Empty Object
	$scope.operationType = 'Add'; // Defines Operation type for Showing on View
	$scope.aStates = otherUtils.getState();

	// MAP code ....
	$scope.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
		{type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
		{type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
	];


	// functions Identifiers
	$scope.closeModal = closeModal;
	$scope.onSelect = onSelect;
	$scope.searchLocation = searchLocation;
	$scope.getCustomer = getCustomer;
	$scope.submit = submit;

	// INIT functions
	(function init(){
		$scope.oLiveData = {};
		$scope.search = [];
		$scope.search.result = [];
		sharedResource.shareThisResourceWith($scope);
		$timeout(function () {
			mapInit();
		});
		getUsers();
		// getCustomer();
	})();


	// Operations
	if(typeof selectedConsignorConsignee !== 'undefined' && selectedConsignorConsignee !== null){
		$scope.oConsignorConsignee = angular.copy(selectedConsignorConsignee); //initialize with param
		$scope.oConsignorConsignee.customer = $scope.oConsignorConsignee.customer;
		if(!selectedConsignorConsignee.isAdd){
			$scope.operationType = 'Edit';
		}
		if($scope.oConsignorConsignee.state){
			$scope.aStates.find(o => {
				if((o.state).toLowerCase() == ($scope.oConsignorConsignee.state).toLowerCase()){
					$scope.oConsignorConsignee.state = o.state;
				    return;}
			});
		}
	}

	if ($scope.$configs.clientOps) {
		$scope.oConsignorConsignee.clientR =  $scope.$configs.clientOps;
	}else {
		$scope.oConsignorConsignee.clientR =  $scope.selectedClient;
	}


	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getFilter(sta,loc,draw){
		$scope.oConsignorConsignee.state = sta;
		$scope.oConsignorConsignee.businessLocation = loc;
		$scope.oConsignorConsignee.address = loc+','+sta;
	}

	function getAddress(lat,lng,draw) {
		$scope.oConsignorConsignee.lat = lat;
		$scope.oConsignorConsignee.lng = lng;
		if(!lat || !lng){
			return;
		}
		$scope.oLiveData.lat = lat;
		$scope.oLiveData.lng = lng;
		var url = "http://13.229.178.235:4242/reverse?lat="+lat+"&lon="+lng;
		$http({
			method: "get",
			url: url
		}).then(function (response) {
			$scope.oLiveData.address = response.data.display_name;
			if(draw){
				renderMap({latitude:lat,longitude:lng});
			}
			//return limitToFilter(response.data, 15);
		});
	}

	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					status: "Active"
				};

				customer.getAllcustomers(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getUsers() {
		userService.getUsers({user_type: 'Loading Babu'}, successCallback, failureCallback);

		function failureCallback(response) {
			swal('',response.data.message,'error');
		}

		function successCallback(response) {
			$scope.aUsers = response.data;
		}
	}

	function mapInit() {
		map = utils.initializeMapView('mapForConsignorConsignee', {
			zoomControl: true,
			hybrid: true,
			zoom: 4,
			search: true,
			location: false,
			center: new L.LatLng(21, 90)
		}, false);
		map = map.map;

		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		drawControl = new L.Control.Draw({
			edit: {
				featureGroup: drawnItems,
				edit: false,
				remove: false
			},
			draw: {
				polygon: false,
				polyline: false,
				circlemarker: false,
				//marker : false,
				circle: false,
				rectangle: false

			}
		});

		map.addControl(drawControl);

		map.on(L.Draw.Event.CREATED, function(event) {
			var layer = event.layer;
			$scope.landarkData = JSON.parse(JSON.stringify(event.layer._latlng));
			popup = L.popup();
			layer.bindPopup(popup);
			if (marker !== undefined) {
				drawnItems.removeLayer(marker);
			}
			marker = layer;
			drawnItems.addLayer(marker);
			getAddress($scope.landarkData.lat, $scope.landarkData.lng, true);
		});

		if($scope.oConsignorConsignee.lat && $scope.oConsignorConsignee.lng){
			getAddress($scope.oConsignorConsignee.lat, $scope.oConsignorConsignee.lng, true);
		}
	}

	function onSelect($item, $model, $label){
		getAddress($item.latitude, $item.longitude, true);
		getFilter($item.placeAddress, $item.placeName, true);
	}

	function renderMap(data) {

		map.setView([data.latitude, data.longitude], 10);

		var title = $scope.oLiveData.address;
		if (marker !== undefined) {
			drawnItems.removeLayer(marker);
		}
		marker = L.marker([data.latitude, data.longitude]).bindTooltip(title,{permanent:false,direction:'top'}).openTooltip();
		drawnItems.addLayer(marker);
	}

	function searchLocation(query) {
		if (query && query.toString().length > 2) {
			var oUrl = $scope.aLocationUrl[1];
			var q = {
				location: map.getCenter().lat+","+map.getCenter().lng,
				zoom: map.getZoom(),
				query: query
			};
			var locationUrl = oUrl.url+otherUtils.prepareQeury(q);
			return  $http({
				method: "get",
				url: locationUrl
			}).then(function (response) {
				$scope.aLocations = response.data.suggestedLocations.map(function (suggestion) {
					suggestion.formattedAddress = suggestion.placeName+((suggestion.placeAddress && suggestion.placeAddress!="")?', '+suggestion.placeAddress:'');
					return suggestion;
				});
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	}

	// add or modify Consignor/Consignee
	function submit(formData) {
		console.log(formData);

		if(formData.$valid){
			if(($scope.oConsignorConsignee.customer == null) ||($scope.oConsignorConsignee.customer && !$scope.oConsignorConsignee.customer._id)){
				delete  $scope.oConsignorConsignee['customer'];
			}
			var request = $scope.oConsignorConsignee;
			console.log('form is valid', request);

			// call respective service on based on operation type
			if($scope.operationType === 'Add'){
				consignorConsigneeService.addConsignorConsignee(request, onSuccess, onFailure);
			}else if($scope.operationType === 'Edit'){
				// delete request.opening_balance;
				consignorConsigneeService.updateConsignorConsignee(request, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg,'error');
			}

			// Handle success response
			function onSuccess(response){

				var msg = response.message;
				if($scope.operationType === 'Add')
					msg = msg || "Data Added Successfully";
				else if($scope.operationType === 'Edit')
					msg = msg || "Data Updated Successfully";

				swal('Success',msg,'success');
				$uibModalInstance.close(response.data);
			}
		}else {
			swal('','All Mandatory Field are not filled','error');
		}
	}

	//////////////////////////////////////////////////

});


materialAdmin.controller('ConsignorConsigneeViewController',function(
	$rootScope,
	$modal,
	$scope,
	$state,
	$stateParams
){
	// object Identifiers
	if(typeof $stateParams.data !== 'undefined' && $stateParams.data !== null) {
		$scope.oConsignorConsignee = angular.copy($stateParams.data); //initialize
		if ($scope.oConsignorConsignee.clientR) {
			$scope.oConsignorConsignee.clientName = [2];
			var i = 0;
			$rootScope.$configs.clientR.forEach(function (id) {
				if (id.lms_id == $scope.oConsignorConsignee.clientR[i])
					$scope.oConsignorConsignee.clientName[i++] = id.name;
			});
		}
	}
	else
		$state.go('masters.consignorConsignee');


	// functions Identifiers
	$scope.upsertConsignorConsignee = upsertConsignorConsignee;


	// INIT functions


	// Actual Functions
	// send to edit account master page
	function upsertConsignorConsignee(oConsignorConsignee) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myConsignorConsignee/consignorUpsert.html',
			controller: 'ConsignorConsigneeUpsertController',
			resolve: {
				'selectedConsignorConsignee': function () {
					return oConsignorConsignee;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				$scope.oConsignorConsignee = response;
			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}


	//////////////////////////////////////////////////

});

