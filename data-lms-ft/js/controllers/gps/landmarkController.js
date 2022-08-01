materialAdmin
	.controller("landmarkController", landmarkController);

landmarkController.$inject = [
	'$rootScope',
	'$http',
	'$modal',
	'$uibModal',
	'$scope',
	'DatePicker',
	'gpsSocketService',
	'lazyLoadFactory',
	'stateDataRetain'
];

function landmarkController(
	$rootScope,
	$http,
	$modal,
	$uibModal,
	$scope,
	DatePicker,
	gpsSocketService,
	lazyLoadFactory,
	stateDataRetain
) {

	let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object


	// functions Identifiers
	vm.upsertLandmark = upsertLandmark;
	vm.getLandmark = getLandmark;
	vm.deleteLandmark = deleteLandmark;
	vm.downloadLandmark = downloadLandmark;
	$scope.onStateRefresh = function () {
		getLandmark();
	};

	// INIT functions
	(function init(){

		if (stateDataRetain.init($scope, vm))
			return;

		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.selectType = 'index';
		vm.aLandmark = [];
		vm.aSelectedLandmark = [];
		vm.columnSetting = {
			allowedColumn: [
				'name',
				'address',
				'latitude',
				'longitude',
				'Created At',
			]
		};
		vm.tableHead = [
			{
				'header': 'name',
				'bindingKeys': 'name'
			},
			{
				'header': 'address',
				'bindingKeys': 'address'
			},
			{
				'header': 'latitude',
				'bindingKeys': 'location.latitude',
				'date':false
			},
			{
				'header': 'longitude',
				'bindingKeys': 'location.longitude',
				'date':false
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			}
		];
		if($rootScope.$clientConfigs && $rootScope.$clientConfigs.gpsId && $rootScope.$clientConfigs.gpsPwd) {
			$rootScope.userLogin({
				user_id : $rootScope.$clientConfigs.gpsId,
				password : $rootScope.$clientConfigs.gpsPwd,
				rememberMe : true
			});
		}
	})();

	// Actual Functions
	function upsertLandmark(type = 'add') {

		if (type == 'edit' || type == 'view') {
			if(Array.isArray(vm.aSelectedLandmark)){
				if(vm.aSelectedLandmark.length !== 1)
					return swal('Warning', 'Please Select Single row', 'warning');
			}
			vm.aSelectedLandmark = Array.isArray(vm.aSelectedLandmark) ? vm.aSelectedLandmark[0] : vm.aSelectedLandmark;

		}else {
			vm.aSelectedLandmark = {};
		}

		$uibModal.open({
			templateUrl: 'views/gps/tracking/upsertLandmark.html',
			controller: ['$rootScope', '$http', '$scope', '$timeout', '$uibModalInstance', 'gpsSocketService', 'otherUtils', 'otherData', 'utils', landmarkUpsertController],
			controllerAs: 'luVm',
			resolve: {
				otherData: function () {
					return {
						aData: vm.aSelectedLandmark,
						type: type,
						showMap: true
					};
				}
			},
		}).result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function deleteLandmark() {

		if(!vm.aSelectedLandmark)
			return swal('Error', 'Please Select Single row', 'error');

		vm.aSelectedLandmark = Array.isArray(vm.aSelectedLandmark) ? vm.aSelectedLandmark[0] : vm.aSelectedLandmark;
		vm.aSelectedLandmark.selected_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		vm.aSelectedLandmark.login_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		vm.aSelectedLandmark.user_id = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;

		swal({
				title: 'Are you sure you want to delete selected landmark?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonClass: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirm) {
				if (isConfirm) {
					gpsSocketService.removeLandmark({
						...vm.aSelectedLandmark
					}, onSuccess, onFailure);
					function onSuccess(res) {
						swal('Success', res.message, 'success');
						getLandmark();
					}
					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
				}
			});
	}

	function downloadLandmark() {

		var oFilter = prepareFilterObject();

		gpsSocketService.downloadLandmark(oFilter, function (response) {

			var a = document.createElement('a');
			a.href = response.data.url;
			a.download = response.data.url;
			a.target = '_blank';
			a.click();
		});
	}


	// Get landmark from backend
	function getLandmark(isGetActive) {

		// if(vm.oFilter.from_date>vm.oFilter.to_date){
		// 	swal('Error','From date should be less than To Date','error');
		// 	return;
		// }

		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject();
		gpsSocketService.getLandmark(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				// response = response.data;
				$scope.aLndmName = response.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			}
		}
	}

	function prepareFilterObject() {
		var filter = {};

		// if(vm.oFilter.from_date) {
		// 	filter.start_time = moment(vm.oFilter.from_date, 'DD/MM/YYYY').startOf('day').toISOString();
		// }
		// if(vm.oFilter.to_date) {
		// 	filter.end_time = moment(vm.oFilter.to_date, 'DD/MM/YYYY').endOf('day').toISOString();
		// }
		if(vm.oFilter.name) {
			filter.name =vm.oFilter.name;
		}

		filter.selected_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		filter.login_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		filter.user_id = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		filter.row_count = 20;
		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();
		filter.sort = { '_id' : -1 };
		return filter;
	}
}


function landmarkUpsertController(
	$rootScope,
	$http,
	$scope,
	$timeout,
	$uibModalInstance,
	gpsSocketService,
	otherUtils,
	otherData,
	utils,
) {

	let vm = this;
	vm.oLandmark= {}; //initialize with Empty Object

	// functions Identifiers
	vm.closeModal = closeModal;
	vm.onSelect = onSelect;
	vm.searchLocation = searchLocation;
	vm.submit = submit;
	vm.searchNearestLocation = searchNearestLocation;

	// MAP code ....
	vm.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
		{type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
		{type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
	];

	// INIT functions
	(function init() {
		vm.oLandmark = {};
		vm.type = angular.copy(otherData.type);
		vm.showMap = angular.copy(otherData.showMap);
		if(vm.type === 'edit' || vm.type === 'view'){

			vm.oLandmark  = angular.copy(otherData.aData);
			vm.lat = vm.oLandmark.location.latitude;
			vm.lng = vm.oLandmark.location.longitude;
			vm.map = {
				ready: function(){
					if(vm.showMap)
						addMarker(vm.oLandmark.location);
				}
			};
		}

		if(vm.type === 'add'){
			vm.oLandmark  = angular.copy(otherData.aData);
			vm.lat = vm.oLandmark.lat;
			vm.lng = vm.oLandmark.lng;
			vm.oLandmark.address = vm.oLandmark.addr;
			// getAddress(vm.lat, vm.lng, true);
		}
		vm.oLandmark.selected_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		vm.oLandmark.login_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		vm.oLandmark.user_id = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function searchLocation(query) {
		if (query && query.toString().length > 2) {
			var oUrl = vm.aLocationUrl[1];
			var q = {
				// locat	ion: map.getCenter().lat+","+map.getCenter().lng,
				// zoom: map.getZoom(),
				query: query
			};
			var locationUrl = oUrl.url+ otherUtils.prepareQeury(q);
			return  $http({
				method: "get",
				url: locationUrl
			}).then(function (response) {
				vm.aLocations = response.data.suggestedLocations.map(function (suggestion) {
					suggestion.formattedAddress = suggestion.placeName+((suggestion.placeAddress && suggestion.placeAddress!="")?', '+suggestion.placeAddress:'');
					return suggestion;
				});
			});
		} else if (query === '') {
			vm.aLocations = [];
		}
	}

	function onSelect($item, $model, $label){
		addMarker($item);
		getAddress($item.latitude, $item.longitude, true);
	}

	function addMarker($item){

		vm.map.marker.removeAll();
		vm.map.marker.add({
			position: {
				lat: $item.latitude,
				lng: $item.longitude
			},

			draggable:false,
			on: {
				dragend: function (marker) {
					//getAddress(marker.getPosition().lat(), marker.getPosition().lng());
				}
			}
		}, {
			cluster: false,
			position: true,
			zoom: 14
		});
	}

	function addMarkerUpsert($item){

		//vm.map.marker.removeAll();
		vm.map.marker.add({
			position: {
				lat: $item.latitude,
				lng: $item.longitude
			},
			icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
			draggable:true,
			on: {
				dragend: function (marker) {
					getAddress(marker.getPosition().lat(), marker.getPosition().lng());
				}
			}
		}, {
			cluster: false,
			position: true,
			zoom: 14
		});
	}

	function getAddress(lat,lng) {
		vm.lat = lat;
		vm.lng = lng;
		if(!lat || !lng){
			return;
		}

		var url = "http://13.229.178.235:4242/reverse?lat="+lat+"&lon="+lng;
		$http({
			method: "get",
			url: url
		}).then(function (response) {
			vm.address = response.data.display_name;
			vm.oLandmark.address = response.data.display_name;
		});
	}


	function searchNearestLocation()
	{
		let requestObj = {};
		if(!vm.radius){
			swal('Error','Please enter radius.','error');
			return;
		}

		if(!vm.lat || !vm.lng){
			swal('Error','Lat and Long should not be blank','error');
			return;
		}

		var location = {
			latitude:  vm.lat,
			longitude: vm.lng
		};

		requestObj.selected_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		requestObj.login_uid = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;
		requestObj.user_id = $scope.$clientConfigs && $scope.$clientConfigs.gpsId;

		requestObj.location = location;
		requestObj.radius = vm.radius;

		gpsSocketService.getLandmark(requestObj, onNRSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onNRSuccess(response) {
			if (response && response.data) {
				let dataRes = response.data;

				for (var i = 0; i < dataRes.length; i++) {
					addMarkerUpsert(dataRes[i].location);
				}

				/*vm.map = {
					ready: function(){
						for (var i = 0; i < dataRes.length; i++) {
							addMarkerUpsert(dataRes[0].location);
						}
					}
				};*/
			}
		}
	}

	// landmark submit
	function submit(formData) {
		if (formData.$valid) {

			var requestObj = {
				...vm.oLandmark
			};
			if(vm.lat) {
				requestObj.location = requestObj.location || {};
				requestObj.location.latitude = vm.lat;
			}

			if(vm.lng)
				requestObj.location.longitude = vm.lng;

			if (vm.type == 'edit') {
				gpsSocketService.updateLandmark(requestObj, success, failure);

			}else if (vm.type == 'add') {
				gpsSocketService.addLandmark(requestObj, success, failure);
			}

			function success(response) {
				console.log(response);
				swal(response.message);
				$uibModalInstance.dismiss();
			}

			function failure(response) {
				swal(response.message);
				console.log(response);
			}

		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}
