materialAdmin.controller("getTripLocController", function ($rootScope, $scope, $state, $location, $localStorage, $timeout, bookingServices, customer, tripLocatioService, formValidationgrowlService, Routes) {

	$scope.oRoutes = {};

	$scope.selectRouteSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		smartButtonTextConverter: function(itemText, originalItem)
		{
			return itemText;
		}
	};

	/*
	* get Routes for filters in Multiple select dropdown with search
	* */
	$scope.getRoutes = function(inputModel){
		if(inputModel.length <= 2)
			return;
		function success(response){

			$scope.oRoutes.aRoutes = response.data.data;
			// Array.prototype.push.apply($scope.oRoutes.aRoutes,.map(function (obj) {
			// 	return {
			// 		route_name: obj.name,
			// 		_id: obj._id
			// 	}
			// }));

		}
		function failure(response){
			console.log(response);
		}
		Routes.getAllRoutes({name: inputModel}, success, failure);
	};

	$scope.hideProfile = true;
	$rootScope.showTextforAdd = false;
	$("p").text("TripLocation");
	//console.log("User logged in "+ JSON.stringify($localStorage.userLoggedIn.clientId));


	// controls the template view visibility
	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){
			// do something
			// console.log($scope.showTabular);
			if(toState.name === 'masters.trip')
				$scope.showTabular = true;
			else
				$scope.showTabular = false;
		});

	if($state.current.name === 'masters.trip')
		$scope.showTabular = true;
	else
		$scope.showTabular = false;

	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	$scope.pageChanged = function (e) {
		$scope.currentPage = e.currentPage;
		$scope.getTripLocations(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};
		if ($scope.customerName) {
			myFilter.customer_name = $scope.customerName;
		}

		if ($scope.locationName) {
			myFilter.name = $scope.locationName;
		}

		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		/*else if($stateParams.skip){
		 myFilter.skip = $stateParams.skip;
		 $scope.currentPage = $stateParams.skip;
		 } */
		return myFilter;
	};

	$rootScope.getTripLocations = function (isPagination) {
		function success(response) {
			$rootScope.locations = response.data.data;
			$scope.locations = response.data.data;
			// console.log($scope.locations);

			if (response.data && response.data.data && response.data.data.length > 0) {
				$rootScope.location = response.data.data[0];
				$scope.total_pages = response.data.no_of_pages;
				$scope.totalItems = 10 * response.data.no_of_pages;
				setTimeout(function () {
					listItem = $($('.selectItem')[0]);
					listItem.addClass('grn');
				}, 500);
				// console.log($rootScope.locations);
			}
		};

		function fail(response) {
			console.log(response);
		}

		$scope.$watch(function () {
			return $rootScope.location;
		}, function () {
			try {
				$scope.location = $rootScope.location;
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		var oFilter = prepareFilterObject(isPagination);
		tripLocatioService.getAllTripLocations(oFilter, success, fail);
	}
	$rootScope.getTripLocations();  // get all customer funtion call

	function oSucC(response) {
		$scope.customerNames = response.data;
	};
	function oFailC(response) {
		console.log(response);
	}

	$scope.setValueToModel = function (e) {
		$scope.locationName = e;
		$scope.getTripLocations();
	};

	$scope.clearSearch = function (e) {
		$scope.customerName = '';
		e.customerName = '';
		$scope.getLname($scope.customerName);
	}

	$scope.getLname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			// $scope.customerName = viewValue;
			customer.getCustomerSearch(viewValue, oSucC, oFailC);
			// tripLocatioService.getLocName(viewValue, oSucC, oFailC);
		}
		else if (viewValue == '') {
			$scope.currentPage = 1;

			$scope.getTripLocations();
		};
	};

	$scope.getCustomers = function(isPagination) {
		function success(data) {
			// $rootScope.customers = data.data;
			$scope.customers = data.data;
			// console.log($scope.customers);
		};

		var oFilter = prepareFilterObject(isPagination);
		customer.getAllcustomers(oFilter, success);
	};

	$scope.getCustomers(); // get all customer funtion call

	$scope.onSelect = function ($item, $model, $label) {
		$scope.customerName = $label;
		$scope.currentPage = 1;
		$scope.getTripLocations();
	};
	function suc(response) {
		$rootScope.vehicleTypes = response.data.data;
	};
	function fail(response) {
		console.log('failed', response);
	};
	//$scope.cities = dataServices.loadCities();

	// $scope.selectLocation = function (location, index) {
	// 	$scope.showText = false;
	// 	$scope.showTextforAdd = false;
	// 	var sUrl = "#!/masters/trips/getTrip";
	// 	$rootScope.redirect(sUrl);
	// 	$rootScope.location = location;
	// 	listItem = $($('.lv-item')[index]);
	// 	listItem.siblings().removeClass('grn');
	// 	listItem.addClass('grn');
	// };

	$scope.selectLocation = function(location, index) {
		$rootScope.location = location;
		listItem = $($('.selectItem')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');
	}

	$scope.showLocationDetails = function(){
		$state.go('masters.trip.getLocInfo');
	};

	$rootScope.formateDate = function (date) {
		return new Date(date);
	};

	$scope.setRoutesToModel = function () {
		$scope.oRoutes.route = $scope.location.routes;
	};

	$scope.editSave = function (location) {
		$rootScope.tripLocationId = location._id;

		function successUpdate(response) {
			$scope.location = response.data.data;
			$scope.location.routes = $scope.oRoutes.route;
			var msg = response.data.message;
			swal("Update", msg, "success");
		}
		function failUpdate(response) {
			console.log('failed', response);
		}

		var data = {};
		data.name = location.name;
		data.routes = $scope.oRoutes.route.map(obj => obj._id);
		if (location.contact_person_name) {
			data.contact_person_name = location.contact_person_name;
		}
		if (location.contact_person_number) {
			data.contact_person_number = location.contact_person_number;
		}
		if (location.contact_person_email) {
			data.contact_person_email = location.contact_person_email;
		}
		console.log(data);
		tripLocatioService.updateTripLocations(data, successUpdate, failUpdate)
		location.isEditing = false;
	};

	$scope.sendMapLocation = function (tripLoc) {
		$scope.hideProfile = false;
		$scope.showText = true;
		var sUrl = "#!/masters/trips/getMap";
		$rootScope.redirect(sUrl);
		$scope.tripLoc = tripLoc;
	};

	$scope.cancel = function (location) {
		location.isEditing = false;
	};
});

materialAdmin.controller('loadGoole', function ($rootScope, $scope, $window, $interval, customer, tripLocatioService, bookingServices, $stateParams, Routes) {

	$scope.selectRouteSettings = {
		displayProp: "route_name",
		enableSearch: true,
		searchField: 'route_name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		smartButtonTextConverter: function(itemText, originalItem)
		{
			return itemText;
		}
	};

	/*
	* Multi Select with Search Dropdown Settings
	* */
	$scope.selectRouteEvents = {
		onSelectionChanged: function () {
			console.log($scope.route);
			// $scope.getTripLocation($scope.oBooking.route[0]._id);
			// if(typeof $scope.oBooking.route[0].data !== 'undefined'){
			// 	/*
			// 	* Filter Contract's vehicle
			// 	* Remove non required elements
			// 	* Transform array object to [{name:'vehicle_type(vehicle_group_name)',_id:''}]
			// 	* */
			// 	$scope.aRouteVehicleTypeList = [];
			// 	Array.prototype.push.apply($scope.aRouteVehicleTypeList,$scope.oBooking.route[0].data.map(function (obj) {
			// 		return {
			// 			name: obj.vehicle_type + ' (' + obj.vehicle_group_name + ')',
			// 			_id: obj._id,
			// 		}
			// 	}));
			// }
		}
	};

	/*
	* get Routes for filters in Multiple select dropdown with search
	* */
	$scope.getRoutes = function(inputModel){
		if(inputModel.length <= 2)
			return;
		function success(response){

			$scope.aRoutes = [];
			Array.prototype.push.apply($scope.aRoutes,response.data.data.map(function (obj) {
				return {
					route_name: obj.name,
					_id: obj._id
				}
			}));

		}
		function failure(response){
			console.log(response);
		}
		Routes.getAllRoutes({name: inputModel}, success, failure);
	};

	/*
	* get Trip Location for Routes
	* */
	$scope.getTripLocation = function(routeId) {
		function success(response) {
			$scope.aTripLocations = response.data.data;
		}
		var obj = {
			routeId: routeId,
			all: true
		};
		bookingServices.getAllTripLocation(obj, success);
	};

	$scope.aLocations = ['Customer Location', 'Loading', 'Offloading', 'ICD', 'Trip Start', 'Trip End'];
	$scope.hideProfile = true;
	$rootScope.showTextforAdd = true;

	if($stateParams.id){
		function cSuccess(data) {
			$scope.customerParamData = data.data[0];
			// console.log($scope.customerParamData);
			// angular.forEach()
		};
		function cfailed(data) {
			console.log(data);
		};

		customer.getCustomer($stateParams.id, cSuccess, cfailed);
	}

	$scope.count = 1;
	var lat;
	var lng;
	var autocomplete;
	var markerPosition;
	var marker;
	var location;
	var marker1;
	var mapCallFunction = true;

	function initialize() {
		var uluru = {lat: 28.537184, lng: 77.270998};
		var map = new google.maps.Map(document.getElementById('contactMap'), {
			zoom: 6,
			map: contactMap,
			center: uluru

		});

		var htmlcontent = '';
		var strName = "Geozone";
		htmlcontent += '<div class="p-t10 p-b5" id="infoWindow">';
		htmlcontent += '<div>';
		htmlcontent += '<table>';
		htmlcontent += '<tr>';
		htmlcontent += '<td class="ta-r"><label  class="text-ellipsis" title="Name"><font color="#ff0000">*</font>&nbsp;Name:&nbsp;&nbsp;</label></td>';
		htmlcontent += '<td><input type="text" id="name" name="name" size="20" class="form-control" style="width:300px;"  title="Enter "' + strName + 'title  placeholder="Enter "' + strName + 'title/ ></td>';
		htmlcontent += '</tr>';
		htmlcontent += '<tr>';
		htmlcontent += '<td class="ta-r"><label  class="text-ellipsis" title="Address"><font color="#ff0000">*</font>&nbsp;Address:&nbsp;&nbsp;</label></td>';
		htmlcontent += '<td><input type="text" id="loc" name="geoname" size="20" class="form-control" style="width:300px;"  title="Enter "' + strName + 'title  placeholder="Enter "' + strName + 'title/ ></td>';
		htmlcontent += '</tr>';
		htmlcontent += '<tr>';
		htmlcontent += '<td class="ta-r p-t7 "  title="Latitude"><label>lat:&nbsp;</label></td>';
		htmlcontent += '<td class="p-t7"><input type="text" id="lat" name="Latitude" class="form-control" size="50" style="width:300px;" / readonly></td>';
		htmlcontent += '</tr>';
		htmlcontent += '<tr>';
		htmlcontent += '<td class="ta-r p-t7 "  title="Longitude"><label>lng:&nbsp;</label></td>';
		htmlcontent += '<td class="p-t7"><input type="text" id="lng" name="Longitude" class="form-control" size="50" style="width:300px;"/ readonly></td>';
		htmlcontent += '</tr>';

		htmlcontent += '<tr>';
		htmlcontent += '<td class="ta-r p-t7 "  title="Longitude"><label></label></td>';
		htmlcontent += '<td class="p-t7"><label>Please select (*) required field</lable></td>';
		htmlcontent += '</tr>';

		htmlcontent += '<tr>';
		htmlcontent += '<td>&nbsp;</td>';
		htmlcontent += '<td  class="p-t7"><input type="submit"  id="submit" class="btn btn-primary btn-block" /></td>';
		htmlcontent += '</tr>';
		htmlcontent += '</table>';
		htmlcontent += '</div>';
		htmlcontent += '</div>';

		var infowindow = new google.maps.InfoWindow({
			content: htmlcontent
		});

		autocomplete = new google.maps.places.Autocomplete((
			document.getElementById('autocomplete')), {
			//types: ['(cities)']
			types: []
			//componentRestrictions: countryRestrict
		});
		//places = new google.maps.places.PlacesService(map);

		autocomplete.addListener('place_changed', onPlaceChanged);

		function onPlaceChanged() {
			var place = autocomplete.getPlace();
			if (place.geometry) {
				map.panTo(place.geometry.location);
				createMarker1(place);
				map.setZoom(16);
			} else {
				document.getElementById('autocomplete').placeholder = 'Enter a city';
			}
		}

		function createMarker1(place) {
			 var placeLoc = place.geometry.location;
				$scope.$apply(function() {
					$scope.latitude = place.geometry.location.lat();
					$scope.longitude = place.geometry.location.lng();
					$scope.address = place.formatted_address;
				});

			$scope.createMarker($scope.latitude,$scope.longitude);

			 /*marker = new google.maps.Marker({
				 map: map,
				 position: place.geometry.location
			 });*/
		 };

		 /*function clearMarkers() {
		 	marker.setMap(null);
		 }*/

		 /*$scope.changeLatLng = function () {
			 $scope.createMarker($scope.latitude,$scope.longitude);
		 }*/

		$scope.createMarker = function (lat, lng) {
			if (marker) {
				marker.setMap(null);
			}
			//$scope.$apply(function() {
				$scope.latitude = lat;
				$scope.longitude = lng;
			//});
			markerPosition = {lat: lat, lng: lng};
			marker = new google.maps.Marker({
				position: markerPosition,
				map: map,
				title: 'Uluru (Ayers Rock)'
			});
		}

		$scope.getLocation = function (lat, lng) {
			location = '';
			var latlng = new google.maps.LatLng(lat, lng);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({'latLng': latlng}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						location = results[1].formatted_address;
						$("#loc").val(location);
						$scope.$apply(function() {
							$scope.address = location;
						});
					}
				}
			});
		}

		google.maps.event.addListener(map, "click", function (e) {
			//clearMarkers();
			lat = lng = '';
			var latLng = e.latLng;
			lat = e.latLng.lat();
			lng = e.latLng.lng();
			//console.log(latLng);
			//marker.setMap(null);
			$scope.createMarker(lat, lng);
			$scope.getLocation(lat, lng);
			//infowindow.open(map, marker);
			/*$("#lat").val(lat);
			$("#lng").val(lng);*/

			/*document.getElementById("submit").addEventListener("click", function (e) {

				//$scope.callGoogleGeozoneInfo();
				if (mapCallFunction == true) {
					saveGoogleMap($scope.count);
				} else {
					var sUrl = "#!/masters/trips/getMap";
					$rootScope.redirect(sUrl);
				}
			});*/
		});

		/*function saveGoogleMap(count) {
			var name = document.getElementById("name").value;
			var address = document.getElementById("loc").value;

			function successadd(response) {
				var msg = response.data.message;
				//infowindow.close();
				//infowindow.setMap(null);
				mapCallFunction = true;
				if (!$rootScope.locations) {
					$rootScope.locations = [];
				}
				$rootScope.locations.unshift(response.data.data);
				var sUrl = "#!/masters/trips/getTrip";
				$rootScope.redirect(sUrl);
				swal("Saved", msg, "success");
			};

			function failadd(response) {
				console.log(response);
			}

			var oRequest = {};
			if (name && address && $scope.customerdata) {
				mapCallFunction = false
				oRequest.name = name;
				oRequest.address = address;
				oRequest.location = {};
				oRequest.location.lat = lat;
				oRequest.location.lng = lng;
				if ($scope.contact_person_name) {
					oRequest.contact_person_name = $scope.contact_person_name;
				}
				if ($scope.contact_person_number) {
					oRequest.contact_person_number = $scope.contact_person_number;
				}
				if ($scope.contact_person_email) {
					oRequest.contact_person_email = $scope.contact_person_email;
				}
				if ($scope.customerdata && $scope.customerdata.name) {
					oRequest.customer_name = $scope.customerdata.name;
				}
				if ($scope.customerdata && $scope.customerdata.customerId) {
					oRequest.customerId = $scope.customerdata.customerId;
				}
				if ($scope.customerdata && $scope.customerdata._id) {
					oRequest.customer__id = $scope.customerdata._id;
				}
				console.log(oRequest);
				tripLocatioService.addTripLocation(oRequest, successadd, failadd);
			} else {
				$scope.Mapmsg = '';
				$scope.createMapErrMsg = true;
				$scope.Mapmsg = "Please select (*) required field";
				setTimeout(function () {
					if ($scope.createMapErrMsg) {
						$scope.$apply(function () {
							$scope.createMapErrMsg = false;
						});
					}
				}, 7000);
			}

		};*/

		stopFight();
	};

	var stop;
	var fight = function () {
		if (angular.isDefined(stop)) return;
		stop = $interval(function () {
			if (document.getElementById('contactMap') && google && google.maps) {
				initialize();
			} else {
				stopFight();
			}
		}, 100);
	};

	var stopFight = function () {
		if (angular.isDefined(stop)) {
			$interval.cancel(stop);
			stop = undefined;
		}
	};
	fight();

	$scope.getCustomers = function () {
		function success(data) {
			$scope.aCustomer = data.data;
			// console.log($scope.aCustomer);
			angular.forEach($scope.aCustomer,function (arr) {
				if(arr._id === $scope.customerParamData._id)
					$scope.customerdata = arr;
			});
		};
		bookingServices.getAllCustomers(success);
	};
	$scope.getCustomers();

	$scope.add_location = function () {
		function successadd(response) {
			var msg = response.data.message;
			/*if (!$rootScope.locations) {
				$rootScope.locations = [];
			}*/
			//$rootScope.locations.unshift(response.data.data);
			// if($stateParams.id)
			// 	window.close();
			var sUrl = "#!/masters/trips/getTrip";
			$rootScope.redirect(sUrl);
			$rootScope.getTripLocations();
			swal("Saved", msg, "success");
		}

		function failadd(response) {
			console.log(response);
		}
		if ($scope.name && $scope.address && $scope.customerdata) {
			var oRequest = {};
			oRequest.name = $scope.name;
			oRequest.address = $scope.address;
			oRequest.location = {};
			oRequest.location.lat = $scope.latitude;
			oRequest.location.lng = $scope.longitude;
			oRequest.routes = $scope.route;
			if ($scope.contact_person_name) {
				oRequest.contact_person_name = $scope.contact_person_name;
			}
			if ($scope.contact_person_number) {
				oRequest.contact_person_number = $scope.contact_person_number;
			}
			if ($scope.contact_person_email) {
				oRequest.contact_person_email = $scope.contact_person_email;
			}
			if ($scope.customerdata && $scope.customerdata.name) {
				oRequest.customer_name = $scope.customerdata.name;
			}
			if ($scope.customerdata && $scope.customerdata.customerId) {
				oRequest.customerId = $scope.customerdata.customerId;
			}
			if ($scope.customerdata && $scope.customerdata._id) {
				oRequest.customer__id = $scope.customerdata._id;
			}
			oRequest.location_type = $scope.location_type;
			oRequest.description = $scope.description;
			//console.log(oRequest);
			tripLocatioService.addTripLocation(oRequest, successadd, failadd);
		}
	};

});

materialAdmin.filter('capitalize', function () {
	return function (input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});
