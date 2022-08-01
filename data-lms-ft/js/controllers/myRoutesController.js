materialAdmin.controller("routeCommonController", function ($rootScope, $scope, $location, $timeout, DatePicker, Routes, Driver) {
	$("p").text("Routes");
	// $rootScope.editEnableRoute = false;
	// $rootScope.wantRegRout = false;
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = false;
	$rootScope.wantThis3 = false;
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	$scope.oFilter = {};
	$scope.dateChange = dateChange;
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.pageChanged = function () {
		$scope.getAllRoutes(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};
		if ($scope.routeName)
			myFilter.name = $scope.routeName;

		if ($scope.oFilter.start_date)
			myFilter.from = $scope.oFilter.start_date;

		if ($scope.oFilter.end_date)
			myFilter.to = $scope.oFilter.end_date;

		myFilter.deleted = false;
		myFilter.skip = $scope.currentPage;
		// if (isPagination && $scope.currentPage) {
		//     myFilter.skip = $scope.currentPage;
		// }
		/*else if($stateParams.skip){
			   myFilter.skip = $stateParams.skip;
			   $scope.currentPage = $stateParams.skip;
			 } */
		return myFilter;
	};


	$scope.routeDelete = function () {

		swal({
				title: 'Are you sure you want to delete this Route?',
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
					let oRequest = {
						...$scope.route
					};
					oRequest.deleted = true;
					Routes.updateRoute(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Route deleted!!', 'success');
						$scope.getAllRoutes();
					}
				}
			});
		return;
	};

	$scope.getAllRoutes = function (isPagination) {
		function success(res) {
			$rootScope.routes = res.data.data;
			$scope.routes = res.data.data;
			if (res.data && res.data.data.length > 0) {
				$rootScope.route = res.data.data[0];
				// $scope.total_pages = res.data.pages;
				// $scope.totalItems = 15 * res.data.pages;
				$scope.total_pages = res.data.count / $scope.items_per_page;
				$scope.totalItems = res.data.count;
				setTimeout(function () {
					listItem = $($('.lv-item')[0]);
					listItem.addClass('grn');
				}, 500);
			}
		};
		var oFilter = prepareFilterObject(isPagination);
		Routes.getAllRoutes(oFilter, success);
	}

	$scope.getAllRoutes();

	function oSucD(response) {
		$scope.routes = response.data.data;
	};

	function oFailD(response) {
		console.log(response);
	}

	$scope.clearSearch = function () {
		$scope.routeName = '';
		$scope.getVname($scope.routeName);
	}

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			Routes.getName(viewValue, oSucD, oFailD);
		} else if (viewValue == '') {
			$scope.currentPage = 1;
			//$stateParams.name = '';
			//var sUrl = "#!/masters/vendorRegistration/profile"+"/" +$scope.currentPage +"/";
			$scope.getAllRoutes();
		}
		;
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.currentPage = 1;
		$scope.getAllRoutes();
	};

	$scope.$watch(function () {
		return $rootScope.route;
	}, function () {
		try {
			$scope.route = $rootScope.route;
		} catch (e) {
			//console.log('catch in driverProfileController');
		}
	}, true);

	$rootScope.$watch(function() {
			return $location.path();
		},
		function(a) {
			//console.log('url has changed: ' + a);
			$rootScope.currentPath = $location.path();
			//$sessionStorage.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno";

			$timeout(function() {
				if ($rootScope.currentPath == '/masters/routeDetails/allRoutes') {
					$scope.hideBtns = false;
				} else {
					$scope.hideBtns = true;
				}
			}, 100);
		});

	function suc(response) {
		$rootScope.vehicleTypes = response.data.data;
	};

	function fail(response) {
		console.log('failed', response);
	};


	function dateChange() {
		$scope.oFilter.end_date = new Date($scope.oFilter.end_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.oFilter.end_date).setMonth($scope.oFilter.end_date.getMonth() - 12); // select month based on selected start date
		if (new Date(month).setHours(23, 59, 59) > $scope.oFilter.start_date)
			$scope.oFilter.start_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23, 59, 59));
	};

	$scope.downloadReport = function () {
		// if (!($scope.oFilter.start_date && $scope.oFilter.end_date)) {
		// 	swal('warning', "Both From and To Date should be Filled", 'warning');
		// 	return;
		// }
		var oFilter = prepareFilterObject();
		oFilter.download = true;
		oFilter.all = true;
		Routes.getAllRoutes(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.data.url;
			a.download = res.data.url;
			a.target = '_blank';
			a.click();
		}, err => {
			console.log(err);
			swal('Error!', 'Message not defined', 'error');
		});
	};

	$scope.uploadReport = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			Driver.uploadCommon({modelName: 'TransportRoute'}, data)
				.then(function (d) {
					swal({title: 'Info', text: d.message, type: "info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message, 'error');
				});
		}
	};

	//$scope.cities = dataServices.loadCities();
	$scope.selectRoute = function (route, index) {
		var sUrl = "#!/masters/routeDetails/allRoutes";
		$rootScope.redirect(sUrl);
		$rootScope.route = route;
		//$rootScope.route.isNew = false;
		listItem = $($('.lv-item')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');

	};

	$scope.editRoute = function () {
		$rootScope.route;
		//$rootScope.route.isNew = false;
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('grn');
	};

	$scope.newRReg = function () {
		/*if($rootScope.route){
			 $rootScope.route.isNew = true;
		  } else {
			 $rootScope.route = {};
			 $rootScope.route.isNew = true;
		  }*/
		//$rootScope.route.isNew = true;
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('grn');
	};
	$rootScope.formateDate = function (date) {
		return new Date(date);
	};
});

materialAdmin.controller("routeProfileCtrl", function ($rootScope, $scope, Routes, $uibModal) {
	$("p").text("Routes");
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	$scope.showOnMap = function () {
		var oMapData = {};
		oMapData.name = $scope.route.name;
		oMapData.routeRequest = $scope.route.routeRequest;
		oMapData.routeWayPoints = $scope.route.routeWayPoints;
		oMapData.selectedRouteWayPoint = $scope.route.routeWayPoints[0].route;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/showMap/showMap.html',
			controller: 'showMapPublicCtrl',
			resolve: {
				thatData: function () {
					return oMapData;
				}
			}
		});
	}
	$scope.$watch(function () {
		return $rootScope.route;
	}, function () {
		try {
			$scope.route = $rootScope.route;
		} catch (e) {
		}
	}, true);
});


// materialAdmin.controller("routeRatesController", function($rootScope, $localStorage, $scope, $timeout, $interval, constants, customer, Routes, Vehicle, formValidationgrowlService, materialService) {
// 	$rootScope.editEnableRoute = true;
// 	$rootScope.wantRegRout = false;
// 	$scope.enableUpdateBtn = false;
// 	//$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Domestic – Containerized","Import - Cargo","Export – Cargo","Domestic – Cargo","Empty - Containerized","Empty - Vehicle","Transporter Booking"];
//
// 	$scope.vehicleTypes = [];
// 	$scope.appendObj = {};
// 	$scope.aSelectionType = ['Vehicle'];
// 	$scope.geolocate = function(sUId) {
// 		googlePlaceAPI.geolocate(sUId);
// 	};
// 	var gAPI = new googlePlaceAPI($interval);
// 	gAPI.fight($scope, ['city', 'city2']);
//
// 	$scope.searchRegisterCity1 = function() {
// 		setTimeout(function() {
// 			if ($scope.city && $scope.city.d) {
// 				$scope.$apply(function() {
// 					$scope.district1 = '';
// 					$scope.district1 = $scope.city.d;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 			if ($scope.city && $scope.city.st) {
// 				$scope.$apply(function() {
// 					$scope.state1 = '';
// 					$scope.state1 = $scope.city.st;
// 				});
// 				//console.log($scope.city.s);
// 			}
// 			if ($scope.city && $scope.city.p) {
// 				$scope.$apply(function() {
// 					$scope.pincode1 = '';
// 					$scope.pincode1 = $scope.city.p;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 			if ($scope.city && $scope.city.cnt) {
// 				$scope.$apply(function() {
// 					$scope.country1 = '';
// 					$scope.country1 = $scope.city.cnt;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 		}, 500);
// 	};
//
// 	$scope.calculatePricePerMT = function(rate){
// 		if(!rate.price_per_trip || !rate.min_payable_mt)
// 			return;
//
// 		rate.price_per_mt = rate.price_per_trip / rate.min_payable_mt;
// 	};
//
// 	$scope.searchRegisterCity2 = function() {
// 		setTimeout(function() {
// 			if ($scope.city2 && $scope.city2.d) {
// 				$scope.$apply(function() {
// 					$scope.district2 = '';
// 					$scope.district2 = $scope.city2.d;
// 				});
// 				//console.log($scope.city2.cnt);
// 			}
// 			if ($scope.city2 && $scope.city2.st) {
// 				$scope.$apply(function() {
// 					$scope.state2 = '';
// 					$scope.state2 = $scope.city2.st;
// 				});
// 				//console.log($scope.city2.s);
// 			}
// 			if ($scope.city2 && $scope.city2.p) {
// 				$scope.$apply(function() {
// 					$scope.pincode2 = '';
// 					$scope.pincode2 = $scope.city2.p;
// 				});
// 				//console.log($scope.city2.cnt);
// 			}
// 			if ($scope.city2 && $scope.city2.cnt) {
// 				$scope.$apply(function() {
// 					$scope.country2 = '';
// 					$scope.country2 = $scope.city2.cnt;
// 				});
// 				//console.log($scope.city2.cnt);
// 			}
// 		}, 500);
// 	};
// 	var gAPIx = new googlePlaceAPI($interval);
// 	gAPIx.fight($scope, ['cityx']);
// 	$scope.searchRegisterCityX = function() {
// 		setTimeout(function() {
// 			if ($scope.cityx && $scope.cityx.d) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.loading_address.district = '';
// 					$scope.rateUpdate.loading_address.district = $scope.cityx.d;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 			if ($scope.cityx && $scope.cityx.st) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.loading_address.state = '';
// 					$scope.rateUpdate.loading_address.state = $scope.cityx.st;
// 				});
// 				//console.log($scope.city.s);
// 			}
// 			if ($scope.cityx && $scope.cityx.p) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.loading_address.pincode = '';
// 					$scope.rateUpdate.loading_address.pincode = $scope.cityx.p;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 			if ($scope.cityx && $scope.cityx.cnt) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.loading_address.country = '';
// 					$scope.rateUpdate.loading_address.country = $scope.cityx.cnt;
// 				});
// 				//console.log($scope.city.cnt);
// 			}
// 		}, 500);
// 	};
// 	var gAPIxx = new googlePlaceAPI($interval);
// 	gAPIxx.fight($scope, ['cityxx']);
// 	$scope.searchRegisterCityXX = function() {
// 		setTimeout(function() {
// 			if ($scope.cityxx && $scope.cityxx.d) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.unloading_address.district = '';
// 					$scope.rateUpdate.unloading_address.district = $scope.cityxx.d;
// 				});
// 			}
// 			if ($scope.cityxx && $scope.cityxx.st) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.unloading_address.state = '';
// 					$scope.rateUpdate.unloading_address.state = $scope.cityxx.st;
// 				});
// 			}
// 			if ($scope.cityxx && $scope.cityxx.p) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.unloading_address.pincode = '';
// 					$scope.rateUpdate.unloading_address.pincode = $scope.cityxx.p;
// 				});
// 			}
// 			if ($scope.cityxx && $scope.cityxx.cnt) {
// 				$scope.$apply(function() {
// 					$scope.rateUpdate.unloading_address.country = '';
// 					$scope.rateUpdate.unloading_address.country = $scope.cityxx.cnt;
// 				});
// 			}
// 		}, 500);
// 	};
//
// 	//*************** New Date Picker for multiple date selection in single form ************
// 	$scope.today = function() {
// 		$scope.dt = new Date();
// 	};
// 	$scope.today();
//
//
// 	$scope.toggleMin = function() {
// 		$scope.minDate = $scope.minDate ? null : new Date();
// 	};
// 	$scope.toggleMin();
//
// 	$scope.open = function($event, opened) {
// 		$event.preventDefault();
// 		$event.stopPropagation();
//
// 		$scope[opened] = true;
// 	};
//
// 	$scope.dateOptions = {
// 		formatYear: 'yy',
// 		startingDay: 1
// 	};
//
// 	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
// 	$scope.format = $scope.formats[0];
//
// 	//************* New Date Picker for multiple date selection in single form ******************//
//
// 	$scope.showRates = function() {
// 		$scope.onShow = true;
// 		$scope.onEdit = false;
// 		$scope.onAdd = false;
// 	}
// 	$scope.showRates();
//
// 	$scope.addNewRates = function() {
// 		$scope.onAdd = true;
// 		$scope.onEdit = false;
// 		$scope.onShow = false;
// 		$scope.newVehicleTypes = [];
// 	}
// 	$scope.editRates = function() {
// 		$scope.onEdit = true;
// 		$scope.onAdd = false;
// 		$scope.onShow = false;
// 		if ($scope.rateUpdate && $scope.rateUpdate.data.length > 0) {
// 			$scope.newVehicleTypes = $scope.rateUpdate.data;
// 		} else {
// 			$scope.newVehicleTypes = [];
// 		}
// 		if ($scope.aRoutes && $scope.aRoutes.length > 0) {
// 			for (var b = 0; b < $scope.aRoutes.length; b++) {
// 				if ($scope.rateUpdate.route_name == $scope.aRoutes[b].name) {
// 					$scope.rateUpdate.route_name = $scope.aRoutes[b];
// 					//$scope.vehicleTypes = $scope.aRoutes[b].route_time;
// 					$scope.routeSingle = $scope.aRoutes[b];
// 				}
// 			}
// 		}
// 		if ($scope.rateUpdate && $scope.rateUpdate.timings && $scope.rateUpdate.timings.loading.holidays.length > 0) {
// 			$scope.selHolidays = $scope.rateUpdate.timings.loading.holidays;
// 		}
// 		if ($scope.rateUpdate && $scope.rateUpdate.timings && $scope.rateUpdate.timings.unloading.holidays.length > 0) {
// 			$scope.selHolidays2 = $scope.rateUpdate.timings.unloading.holidays;
// 		}
//
// 	}
// 	$scope.aCargoType = ["Container Import", "Container Export", "Container FS", "Container FDS", "Loose Cargo Import", "Loose Cargo Export", "Loose Cargo Domestic"];
// 	$scope.selHolidays = [];
// 	$scope.selHolidays2 = [];
// 	// toggle selection for a given fruit by name
// 	$scope.toggleSelection = function toggleSelection(holi) {
// 		var idx = $scope.selHolidays.indexOf(holi);
//
// 		// is currently selected
// 		if (idx > -1) {
// 			$scope.selHolidays.splice(idx, 1);
// 		}
//
// 		// is newly selected
// 		else {
// 			$scope.selHolidays.push(holi);
// 		}
// 	};
// 	// toggle selection for a given fruit by name
// 	$scope.toggleSelection2 = function toggleSelection(holi) {
// 		var idx = $scope.selHolidays2.indexOf(holi);
//
// 		// is currently selected
// 		if (idx > -1) {
// 			$scope.selHolidays2.splice(idx, 1);
// 		}
//
// 		// is newly selected
// 		else {
// 			$scope.selHolidays2.push(holi);
// 		}
// 	};
// 	$scope.aHolidays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// 	$scope.aHours = [];
// 	$scope.aMinutes = [];
// 	//Self Invoking Function
// 	(function() {
// 		for (i = 0; i < 60; i++) {
// 			$scope.aMinutes.push(i);
// 			if (i < 24) {
// 				$scope.aHours.push(i);
// 			}
// 		}
// 	})();
//
// 	$scope.getRates = function() {
// 		function success(data) {
// 			$rootScope.aRate = data.data;
// 			if ($rootScope.aRate.length > 0) {
// 				for (var p = 0; p < $rootScope.aRate.length; p++) {
// 					if ($rootScope.aRate[p].last_modified_at) {
// 						$rootScope.aRate[p].last_modified_at = moment($rootScope.aRate[p].last_modified_at).format('LLL');
// 					}
// 					if ($rootScope.aRate[p].created_at) {
// 						$rootScope.aRate[p].created_at = moment($rootScope.aRate[p].created_at).format('LLL');
// 					}
// 				}
// 			}
// 			if (data.data && data.data.length > 0) {
// 				$rootScope.rateSingle = data.data[0];
// 				$scope.selectedRate = data.data[0];
// 				$scope.selectedRateS = data.data[0]; //auto selected in dropdown
// 				$scope.rateUpdate = angular.copy($rootScope.rateSingle);
// 				console.log($scope.rateUpdate);
// 			} else {
// 				$rootScope.rateSingle = ' ';
// 			}
// 		};
//
// 		$scope.$watch(function() {
// 			return $rootScope.rateSingle;
// 		}, function() {
// 			try {
// 				$scope.rateSingle = $rootScope.rateSingle;
// 			} catch (e) {
// 				//console.log('catch in driverProfileController');
// 			}
// 		}, true);
// 		customer.getAllRates(success);
// 	}
// 	setTimeout(function() {
// 		$scope.getRates(); // get all Contract function call
// 	}, 1000);
//
// 	$scope.getRoutes = function() {
// 		function success(data) {
// 			$rootScope.aRoutes = data.data.data;
// 			if ($rootScope.aRoutes && $rootScope.aRoutes.length > 0) {
// 				for (var x = 0; x < $rootScope.aRoutes.length; x++) {
// 					for (var y = 0; y < $rootScope.aRoutes[x].route_time.length; y++) {
// 						// if (!$rootScope.aRoutes[x].route_time[y].rate) {
// 						// 	$rootScope.aRoutes[x].route_time[y].rate = {};
// 						// 	$rootScope.aRoutes[x].route_time[y].rate.vehicle_rate = 0;
// 						// 	$rootScope.aRoutes[x].route_time[y].rate.price_per_unit = 0;
// 						// 	$rootScope.aRoutes[x].route_time[y].rate.price_per_mt = 0;
// 						// 	$rootScope.aRoutes[x].route_time[y].rate.price_per_trip = 0;
// 						// 	$rootScope.aRoutes[x].route_time[y].rate.min_payable_mt = 0;
// 						// 	/*$rootScope.aRoutes[x].route_time.rate.detention_rate_1-48 = 0;
//                          //    $rootScope.aRoutes[x].route_time.rate.detention_rate_48-96 = 0;
//                          //    $rootScope.aRoutes[x].route_time.rate.detention_rate_above_96 = 0; */
// 						// }
// 						if (!$rootScope.aRoutes[x].route_time[y].allot) {
// 							$rootScope.aRoutes[x].route_time[y].allot = {};
// 							$rootScope.aRoutes[x].route_time[y].allot.diesel_allot = 0;
// 							$rootScope.aRoutes[x].route_time[y].allot.cash_allot = 0;
// 							$rootScope.aRoutes[x].route_time[y].allot.toll_tax = 0;
//
// 						}
// 						if (!$rootScope.aRoutes[x].route_time[y].from_date) {
// 							$rootScope.aRoutes[x].route_time[y].from_date = '';
// 						}
// 						if (!$rootScope.aRoutes[x].route_time[y].to_date) {
// 							$rootScope.aRoutes[x].route_time[y].to_date = '';
// 						}
// 					}
// 				}
// 			}
// 		};
//
// 		Routes.getAllTrueRoutes({}, success);
// 	}
// 	$scope.getRoutes(); // get all Route function call
//
//
// 	$scope.selectedRouteChanged = function(dataR) {
// 		//$scope.vehicleTypes = dataR.route_time;
// 		$scope.routeSingle = dataR;
// 		$scope.route_distance = dataR.route_distance;
// 	}
//
// 	function getAllVehicleType() {
// 		function succType(res) {
// 			if (res.data && res.data.data && res.data.data[0]) {
// 				$scope.vehicleTypes = res.data.data;
// 			} else {
// 				$scope.vehicleTypes = [];
// 			}
// 		}
//
// 		function failType(res) {
// 			$scope.vehicleTypes = [];
// 		}
// 		Vehicle.getAllType(succType, failType)
// 	}
//
// 	$scope.selectedRateItemChanged = function(dataP) {
// 		$scope.rateSingle = dataP;
// 		//$scope.routeSingle = dataP;
// 		$scope.rateUpdate = angular.copy(dataP);
// 	};
//
// 	$scope.changeSelectionType = function(oSelectionType) {
// 		if($scope.appendObj.oSelectionType === 'Material')
// 			!$scope.materialTypes && getAllMaterialTypes();
// 		else if($scope.appendObj.oSelectionType === 'Vehicle')
// 			$scope.vehicleTypes.length===0 && getAllVehicleType();
// 	};
//
// 	$scope.newVehicleTypes = [];
//
// 	$scope.addVehicleInList = function() {
// 		let newObject = {};
// 		newObject.vehicle_id = $scope.appendObj.oVehicleType;
// 		newObject.allot = {
// 			diesel_allot: 0,
// 			cash_allot: 0,
// 			toll_tax: 0
// 		};
// 		$scope.newVehicleTypes.push(newObject);
//
// 		$scope.appendObj = {};
// 	};
//
// 	$scope.mode = 'unit';
//
// 	function checkBooking(booking) {
// 		var count = 0;
// 		for (var i = 0, len = $scope.newVehicleTypes.length; i < len; i++) {
// 			if ($scope.newVehicleTypes[i].booking_type == booking) {
// 				count = count + 1;
// 			}
// 		}
// 		return count;
// 	}
//
// 	function checkVehicle(b, c) {
// 		for (var i = 0, len = $scope.newVehicleTypes.length; i < len; i++) {
// 			if (($scope.newVehicleTypes[i].vehicle_type === b) && ($scope.newVehicleTypes[i].booking_type === c)) {
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
//
// 	$scope.applyOnAll = function(vehicle) {
// 		var vehicleType = $scope.vehicleTypes || [];
// 		var countBooking = checkBooking(vehicle.booking_type);
// 		if ((countBooking < vehicleType.length) && (vehicleType.length > 0)) {
// 			for (var i = 0; i < vehicleType.length; i++) {
// 				var check = checkVehicle(vehicleType[i].vehicle_type_name, vehicle.booking_type);
// 				if (!check) {
// 					var oData = {
// 						booking_type: vehicle.booking_type,
// 						vehicle_id: vehicleType[i].vehicle_type_id,
// 						vehicle_type: vehicleType[i].vehicle_type_name,
// 						"vehicle_type_id": vehicleType[i].vehicle_type_id,
// 						"vehicle_group_name": vehicleType[i].vehicle_group_name,
// 						"from_date": vehicle.from_date,
// 						"to_date": vehicle.to_date,
// 						"allot": vehicle.allot,
// 						"rate": vehicle.rate,
// 						"loading": vehicle.loading,
// 						"unloading": vehicle.unloading,
// 						"down_time": vehicle.down_time,
// 						"up_time": vehicle.up_time
// 					}
// 					$scope.newVehicleTypes.push(angular.copy(oData));
// 				}
// 			}
// 		} else {
// 			for (var j = 0, len = $scope.newVehicleTypes.length; j < len; j++) {
// 				if ($scope.newVehicleTypes[j].booking_type == vehicle.booking_type) {
// 					$scope.newVehicleTypes[j].from_date = angular.copy(vehicle.from_date);
// 					$scope.newVehicleTypes[j].to_date = angular.copy(vehicle.to_date);
// 					$scope.newVehicleTypes[j].allot = angular.copy(vehicle.allot);
// 					$scope.newVehicleTypes[j].rate = angular.copy(vehicle.rate);
// 					$scope.newVehicleTypes[j].loading = angular.copy(vehicle.loading);
// 					$scope.newVehicleTypes[j].unloading = angular.copy(vehicle.unloading);
// 					$scope.newVehicleTypes[j].down_time = angular.copy(vehicle.down_time);
// 					$scope.newVehicleTypes[j].up_time = angular.copy(vehicle.up_time);
// 				}
// 			}
// 		}
// 	}
//
//
//
// 	$scope.saveRateDetails = function(form) {
// 		function success(response) {
// 			if (response && response.data && response.data.data) {
// 				$scope.rateSingle = response.data.data;
// 				swal(response.data.message, "", "success");
// 				rateData = ' ';
// 				$scope.getRates();
// 				//$scope.showRates();
// 			}
// 		}
//
// 		function failure(response) {
// 			//console.error("fail: ",response);
// 			var err_msg = response.data.error_message;
// 			swal(err_msg, "", "warning");
// 		}
// 		var rateFullData = {};
// 		if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
// 			rateFullData.route__id = $scope.routeSingle._id;
// 			rateFullData._id = $scope.routeSingle._id;
// 			rateFullData.route_name = $scope.routeSingle.name;
// 			rateFullData.route_distance = $scope.route_distance;
// 			rateFullData.route_type = $scope.routeSingle.route_type;
//
// 			rateFullData.cargo_type = $scope.cargo_type;
//
//
// 			for (var i = 0; i < $scope.newVehicleTypes.length; i++) {
// 				if ($scope.newVehicleTypes[i].vehicle_type_name) {
// 					$scope.newVehicleTypes[i].vehicle_type = $scope.newVehicleTypes[i].vehicle_type_name;
// 				}
// 				// if ($scope.newVehicleTypes[i].allot) {
// 				// 	rateFullData.cash_allot = $scope.newVehicleTypes[i].allot.cash;
// 				// 	rateFullData.diesel_allot = $scope.newVehicleTypes[i].allot.diesel;
// 				// 	rateFullData.toll_tax = $scope.newVehicleTypes[i].allot.toll;
// 				// }
// 			}
// 				rateFullData.route_time = $scope.newVehicleTypes;
//
// 			Routes.updateRoute(rateFullData, success, failure);
// 		} else {
// 			$scope.ARmsg = '';
// 			$scope.addRatesErrMsg = true;
// 			$scope.ARmsg = formValidationgrowlService.findError(form.$error);
// 			setTimeout(function() {
// 				if ($scope.addRatesErrMsg) {
// 					$scope.$apply(function() {
// 						$scope.addRatesErrMsg = false;
// 					});
// 				}
// 			}, 7000);
// 		}
//
// 	}
//
// 	$scope.UpdateRateDetails = function(form) {
// 		function success(response) {
// 			if (response && response.data && response.data.data) {
// 				$scope.rateSingle = response.data.data;
// 				$scope.rateUpdate._id = $scope.rateSingle._id;
// 				$scope.rateUpdate.route_name = {};
// 				$scope.rateUpdate.route_name.name = $scope.rateSingle.route_name;
// 				swal(response.data.message, "", "success");
// 				rateData = ' ';
// 				//$scope.getRates();
// 				//$scope.showRates();
// 			}
// 		}
//
// 		function failure(response) {
// 			console.error("fail: ", response);
// 		}
//
// 		var rateupdateData = {};
// 		if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
// 			$scope.rateUpdate.route_name = $scope.rateUpdate.route_name.name;
// 			rateupdateData = $scope.rateUpdate;
//
// 			Routes.updateRoute(rateupdateData, success, failure);
// 		} else {
// 			$scope.CCmsg = '';
// 			$scope.upadetRateErrMsg = true;
// 			$scope.CCmsg = formValidationgrowlService.findError(form.$error);
// 			setTimeout(function() {
// 				if ($scope.upadetRateErrMsg) {
// 					$scope.$apply(function() {
// 						$scope.upadetRateErrMsg = false;
// 					});
// 				}
// 			}, 7000);
// 		}
// 	}
//
// });

materialAdmin.controller("registerRouteController", function ($http, $timeout, $rootScope, $scope, $interval, Routes, Vehicle, formValidationgrowlService, otherUtils, utils, gpsSocketService) {
	$("p").text("Routes");

	let initialize = function () {
		$scope.vPoints = [];
		$scope.regRouteNew = {};
		$scope.allPoints = [];
		$scope.source = null;
		$scope.routeName = null;
		$scope.destination = null;
		$rootScope.wantThis = false;
		$rootScope.wantThis2 = false;
		$rootScope.wantThis3 = true;
	}();

	$scope.checkIsKeyObj = function (key, value) {
		if (typeof $scope[key] === 'object')
			$scope[key].c = value;
		else {
			$scope[key] = {
				placeName: $scope[key],
				c: value
			};
			$scope.regRouteNew.route_distance = 1;
		}
	};
	$scope.onselectsour = function(item){
		$scope.source = item;
	}
	$scope.onselectdist = function(item){
		$scope.destination = item;
	}

	$scope.lMarkSource = function (item, model, label){
		item.latitude = item.location.latitude;
		item.longitude = item.location.longitude;
		item.placeName = item.name;
		item.placeAddress = item.address;
		$scope.source = item;
		$scope.onSelect(item, model, label, 0)
	}
	$scope.lMarkDest = function (item, model, label){
		item.latitude = item.location.latitude;
		item.longitude = item.location.longitude;
		item.placeName = item.name;
		item.placeAddress = item.address;
		$scope.destination = item;
		$scope.onSelect(item, model, label, 1)
	}
	$scope.onselectsource = function (item){
		$scope.source = item;
		$scope.source.placeName = $scope.source.c;
		$scope.source.placeAddress = $scope.source.s;
		$scope.setRouteKm();
	}
	$scope.onselectdestination = function (item){
		$scope.destination = item;
		$scope.destination.placeName = $scope.destination.c;
		$scope.destination.placeAddress = $scope.destination.s;
		$scope.setRouteKm();
	}
	$scope.setRouteKm  =function () {
		if ($scope.source && $scope.destination && $scope.source.location && $scope.destination.location) {
			if (google && google.maps && google.maps.DistanceMatrixService) {
				new google.maps.DistanceMatrixService()
					.getDistanceMatrix(
						{
							origins: [$scope.source.location],
							destinations: [$scope.destination.location],
							travelMode: 'DRIVING',
							// unitSystem: UnitSystem,
						}, (response) => {
							console.log(response)
							if(response && Array.isArray(response.rows) && response.rows[0]){
								let element = response.rows[0].elements;
								$scope.regRouteNew.route_distance = Math.round2(element[0].distance.value / 1000, 2);
								$scope.routeName = `${$scope.source.c} to ${$scope.destination.c}`
								$scope.$apply();
							}
						});
			}
		}
	}

	$scope.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
		{type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
		{type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
		{type: "mapMyIndiaRoute", url: "http://trucku.in:8081/api/mapmyindia/route?"}
	];

	let map, drawnItems, drawControl, markers = [];


	$scope.removeMarker = function (index) {
		map.removeLayer(markers[index]);
		markers.splice(index, 1);
	};
	$scope.insertMarker = function (index) {
		markers.splice(index, 0, undefined);
	}

	$scope.callAtTimeout = function () {
		map = utils.initializeMapView('mapForTransportRoute', {
			zoomControl: true,
			hybrid: false,
			zoom: 4,
			search: false,
			location: false,
			center: new L.LatLng(21, 90)
		}, false).map;
		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);
		/*drawControl = new L.Control.Draw({
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
		map.addControl(drawControl);*/

		/*map.on(L.Draw.Event.CREATED, function(event) {
		  var layer = event.layer;
		  $scope.landarkData = JSON.parse(JSON.stringify(event.layer._latlng));

		  /!*getAddressByLatLng($scope.landarkData.location.latitude, $scope.landarkData.location.longitude,function (address) {
					setValue.geoname.value = address;
				})*!/

		  popup = L.popup();
		  layer.bindPopup(popup);
		  if (marker !== undefined) {
			drawnItems.removeLayer(marker);
		  }
		  marker = layer;
		  drawnItems.addLayer(marker);
		  $scope.getAddress($scope.landarkData.lat, $scope.landarkData.lng);
		});*/

	};

	$timeout(function () {
		$scope.callAtTimeout();
	}, 1000);

	$scope.aPointNames = [];

	$scope.setDisplayName = function (pIndex, value, displayName) {
		if (displayName) {
			$scope.aPointNames = displayName.split('to');
		} else {
			if (pIndex >= 0 && value)
				$scope.aPointNames[pIndex] = value;
			$scope.routeName = "";
			for (pointName of $scope.aPointNames) {
				if ($scope.routeName !== "") {
					$scope.routeName += " to "
				}
				$scope.routeName += pointName;
			}
		}
	};

	function setMarker(data, pIndex) {
		map.setView([data.latitude, data.longitude]);

		let title = data.placeName + ', ' + data.placeAddress;
		if (markers[pIndex] !== undefined) {
			drawnItems.removeLayer(markers[pIndex]);
		}
		markers[pIndex] = L.marker([data.latitude, data.longitude]).bindTooltip(title, {
			permanent: false,
			direction: 'top'
		}).openTooltip();
		drawnItems.addLayer(markers[pIndex]);
	}

	/*function mapMyIndiaResponse(responseData) {
	  var result = [];
	  if(responseData && responseData.results && responseData.results.length>0){
		for(var i=0; i<responseData.results.length;i++){
		  responseData.results[i].display_name = responseData.results[i].formatted_address;
		  if(responseData.results[i].lat){
			responseData.results[i].lat = parseFloat(responseData.results[i].lat);
		  }
		  if(responseData.results[i].lng){
			responseData.results[i].lon = parseFloat(responseData.results[i].lng);
		  }
		  result.push(responseData.results[i])
		}
	  }
	  return result;
	}*/

	/*$scope.getCityByPlaceId = function(query) {
	  if (query && query.toString().length > 2) {
		var oUrl = $scope.aLocationUrl[2];
		var locationUrl = oUrl.url+query;
		$http({
		  method: "POST",
		  url: locationUrl
		}).then(function (response) {
		  if(oUrl.type==="mapMyIndiaGeoCode"){
			var res = mapMyIndiaResponse(response.data);
			if(res[0] && res[0].lat && res[0].lon){
			  renderMap(res[0])
			}
		  }
		}, function (response) {

		});
	  }
	};*/


	$scope.getLandMark = function (query) {

		if (query && query.toString().length > 2) {
			return new Promise(function (resolve, reject) {

				var oFilter = {
					name: query,
					selected_uid: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					login_uid: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					user_id: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					no_of_docs: 20,
					sort: {'_id': -1}
				};

				gpsSocketService.getLandmark(oFilter, onSuccess, onFailure);

				function onFailure(err) {
					reject(err.data);
				}

				function onSuccess(res) {
					console.log(res);
					resolve(res.data);
				}
			});

		} else if (query === '') {
			$scope.aLocations = [];
		}
	};

	$scope.cities = function (query) {

		 if (query && query.toString().length > 2) {
			var oUrl = $scope.aLocationUrl[1];
			var q = {
				location: map.getCenter().lat + "," + map.getCenter().lng,
				zoom: map.getZoom(),
				query: query
			};
			var locationUrl = oUrl.url + otherUtils.prepareQeury(q);
			return $http({
				method: "get",
				url: locationUrl
			}).then(function (response) {
				if (oUrl.type === "mapMyIndiaGeoCode") {
					$scope.aLocations = mapMyIndiaResponse(response.data);
					return limitToFilter($scope.aLocations);
				} else {
					$scope.aLocations = response.data.suggestedLocations;
					return $scope.aLocations;
				}
				//return limitToFilter(response.data, 15);
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	};

	/*$scope.getAddress = function(lat,lng,draw){
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
	};*/


	$scope.onSelect = function ($item, $model, $label, pIndex) {
		if ($item.latitude && $item.longitude) {
			$scope.setDisplayName(pIndex, $model.placeName);
			setMarker($item, pIndex);
			$scope.allPoints[pIndex] = $item;
			getRoute($scope.source, $scope.destination)
			$item.c = $item.placeName;
		}

		// console.log($item);
	};

	function getRoute() {
		if ($scope.allPoints.length >= 2)
			$scope.regRouteNew.route_distance = utils.getDistanceInKm($scope.allPoints[0].latitude, $scope.allPoints[0].longitude, $scope.allPoints[1].latitude, $scope.allPoints[1].longitude);
		$scope.regRouteNew.route_distance = (Math.round(($scope.regRouteNew.route_distance) * 100) / 100) || 0;
		// let oUrl = $scope.aLocationUrl[3];

		// 	let q = {
		// 		start: $scope.allPoints[0].latitude + "," + $scope.allPoints[0].longitude,
		// 		destination: $scope.allPoints[$scope.allPoints.length-1].latitude + "," + $scope.allPoints[$scope.allPoints.length-1].longitude
		// 	};
		// 	for(i=1;i<$scope.allPoints.length-1;i++){
		// 		if(q.viapoints)
		// 			q.viapoints+="|";
		// 		else
		// 			q.viapoints = "";
		// 		q.viapoints+=$scope.allPoints[i].latitude + "," + $scope.allPoints[i].longitude;
		// 	}
		// 	let locationUrl = oUrl.url + otherUtils.prepareQeury (q);
		// 	return $http ({
		// 		method: "post",
		// 		url: locationUrl
		// 	}).then (function (response) {
		// 		$scope.regRouteNew.route_distance = parseInt(response.data.results.trips[0].length/1000);
		// 		console.log(response);
		// 	});
		// }
	}

	function successPost(response) {
		if (response && response.data && (response.data.status == "OK") && response.data.data) {
			$scope.RouteReg.$dirty = false;
			$rootScope.routes.push(response.data.data);
			$rootScope.route = response.data.data;
			//$scope.routes = $rootScope.routes.concat(tempRoute);
			//$scope.route = tempRoute[0];
			swal("Route Registered Successfully", "", "success");
			var sUrl = "#!/masters/routeDetails/allRoutes";
			$rootScope.redirect(sUrl);
		} else if (response && response.data && (response.data.status == "ERROR")) {
			swal("Route Registration failed", response.data.message, "error");
		}
	}

	function failure(res) {
		console.log("fail: ", res);
		swal("Route Registration Failed", res.data.message, "error");
	}

	$scope.submit = function (form) {
		if (form.$valid) {
			$scope.rmsg1 = $scope.rmsg2 = $scope.rmsg3 = $scope.rmsg4 = $scope.rmsg5 = '';
			$scope.regRouteNew.name = $scope.routeName;
			$scope.regRouteNew.source = $scope.source;
			$scope.regRouteNew.destination = $scope.destination;
			$scope.regRouteNew.via = $scope.allPoints.slice(1, $scope.allPoints.length - 2);
			$scope.regRouteNew.islndmrk = $scope.islndmrk;
			Routes.saveRoute($scope.regRouteNew, successPost, failure);
		} else {
			swal('error', formValidationgrowlService.findError(form.$error), 'error');
		}
	}

	$scope.insertPoints = function () {
		$scope.vPoints.push({
			placeName: ''
		});
	};
});

materialAdmin.controller("editRouteController", function ($http, $uibModal, $rootScope, $state, $scope, $timeout, formValidationgrowlService, Routes, Vehicle, otherUtils, utils, gpsSocketService) {
	$("p").text("Routes");
	$scope.aRtype = ['One Way', 'Two Way'];
	$rootScope.wantRegRout = false;
	$rootScope.wantThis = true;
	$rootScope.wantThis2 = false;
	$rootScope.wantThis3 = false;

	if ($rootScope.route) {
		$scope.route = angular.copy($rootScope.route);
		$scope.islndmrk = $scope.route.islndmrk;
		if( $scope.$configs.master && $scope.$configs.master.TransportRoute && $scope.$configs.master.TransportRoute.googleRoute) {
			$scope.route.source = $scope.route.source;
			$scope.route.destination = $scope.route.destination;
			$scope.route.name = $scope.route.name;
			$scope.route.route_distance = $scope.route.route_distance;

			if(!$scope.route.source.d || !$scope.route.source.s || !$scope.route.destination.d ||!$scope.route.destination.s ){
				$scope.route.source.d = $scope.route.source.placeName;
				$scope.route.source.s = $scope.route.source.placeAddress;
				$scope.route.destination.d = $scope.route.destination.placeName;
				$scope.route.destination.s = $scope.route.destination.placeAddress;
			}
		}
		$scope.sourceCity = $scope.route.source.c;
		$scope.destinationCity = $scope.route.destination.c;
	} else
		$state.go('masters.routeDetails.allRoutes');

	let initialize = function () {
		$scope.vPoints = [];
		$scope.regRouteNew = {};
		$scope.allPoints = [];
		$scope.source = null;
		$scope.routeName = null;
		$scope.destination = null;
		$scope.aPointNames = [];
	}();

	$scope.checkIsKeyObj = function (key, value) {
		if (typeof $scope.route[key] === 'object')
			$scope.route[key].c = value;
		else {
			$scope.route[key] = {
				placeName: $scope.route[key],
				c: value
			};
			$scope.route.route_distance = 1;
		}
	};
	$scope.onselectsource = function (item){
		$scope.route.source = item;
		$scope.route.source.placeName = $scope.route.source.c || $scope.route.source.name;
		$scope.route.source.placeAddress = $scope.route.source.s || $scope.route.source.name;
		$scope.setRouteKm();
	}
	$scope.onselectdestination = function (item){
		$scope.route.destination = item;
		$scope.route.destination.placeName = $scope.route.destination.c || $scope.route.destination.name;
		$scope.route.destination.placeAddress = $scope.route.destination.s || $scope.route.destination.name;
		$scope.setRouteKm();
	}
	$scope.setRouteKm  =function () {
		if ($scope.route.source && $scope.route.destination && $scope.route.source.location && $scope.route.destination.location) {
			if (google && google.maps && google.maps.DistanceMatrixService) {
				new google.maps.DistanceMatrixService()
					.getDistanceMatrix(
						{
							origins: [$scope.route.source.location],
							destinations: [$scope.route.destination.location],
							travelMode: 'DRIVING',
							// unitSystem: UnitSystem,
						}, (response) => {
							console.log(response)
							if(response && Array.isArray(response.rows) && response.rows[0]){
								let element = response.rows[0].elements;
								$scope.route.route_distance = Math.round2(element[0].distance.value / 1000, 2);
								$scope.route.name = `${$scope.route.source.c} to ${$scope.route.destination.c}`
								$scope.$apply();
							}
						});
			}
		}
	}

	$scope.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
		{type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
		{type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
		{type: "mapMyIndiaRoute", url: "http://trucku.in:8081/api/mapmyindia/route?"}
	];

	let map, drawnItems, drawControl, markers = [];


	$scope.removeMarker = function (index) {
		map.removeLayer(markers[index]);
		markers.splice(index, 1);
	};
	$scope.insertMarker = function (index) {
		markers.splice(index, 0, undefined);
	};

	$scope.cities = function (query) {
		if (query && query.toString().length > 2) {
			var oUrl = $scope.aLocationUrl[1];
			var q = {
				location: map.getCenter().lat + "," + map.getCenter().lng,
				zoom: map.getZoom(),
				query: query
			};
			var locationUrl = oUrl.url + otherUtils.prepareQeury(q);
			return $http({
				method: "get",
				url: locationUrl
			}).then(function (response) {
				if (oUrl.type === "mapMyIndiaGeoCode") {
					$scope.aLocations = mapMyIndiaResponse(response.data);
					return limitToFilter($scope.aLocations);
				} else {
					$scope.aLocations = response.data.suggestedLocations;
					return $scope.aLocations;
				}
				//return limitToFilter(response.data, 15);
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	};

	$scope.getLandMark = function (query) {

		if (query && query.toString().length > 2) {
			return new Promise(function (resolve, reject) {

				var oFilter = {
					name: query,
					selected_uid: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					login_uid: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					user_id: $scope.$clientConfigs && $scope.$clientConfigs.gpsId,
					no_of_docs: 20,
					sort: {'_id': -1}
				};

				gpsSocketService.getLandmark(oFilter, onSuccess, onFailure);

				function onFailure(err) {
					reject(err.data);
				}

				function onSuccess(res) {
					console.log(res);
					resolve(res.data);
				}
			});

		} else if (query === '') {
			$scope.aLocations = [];
		}
	};

	$scope.lMarkSource = function (item, model, label){
		item.latitude = item.location.latitude;
		item.longitude = item.location.longitude;
		item.placeName = item.name;
		item.placeAddress = item.address;
		$scope.source = item;
		$scope.onSelect(item, model, label, 0)
	}

	$scope.lMarkDest = function (item, model, label){
		item.latitude = item.location.latitude;
		item.longitude = item.location.longitude;
		item.placeName = item.name;
		item.placeAddress = item.address;
		$scope.destination = item;
		$scope.onSelect(item, model, label, 1)
	}

	$scope.onSelect = function ($item, $model, $label, pIndex) {
		if ($item.latitude && $item.longitude) {
			$scope.setDisplayName(pIndex, $model.placeName);
			setMarker($item, pIndex);
			$scope.allPoints[pIndex] = $item;
			getRoute($scope.source, $scope.destination);
			$item.c = $item.placeName;
		}
	};

	$scope.editKm = function(){

		swal({
				title: 'Are you sure to Update this Route KM',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: "green",
				confirmButtonText: "Yes",
				closeOnConfirm: true
			},
			function (isConfirm) {
				if (isConfirm) {
					$uibModal.open({
						templateUrl: 'views/myRoutes/updateKm.html',
						controller: ['$scope','$uibModalInstance','oRoute','Routes', updateKmPopupCtrl],
						controllerAs: 'vm',
						resolve: {
							oRoute: function() {
								return $scope.route;
							}
						}
					}).result.then(function(data) {
						//success
					}, function (data) {
						// error
					});

				}
			});

	}

	$scope.setDisplayName = function (pIndex, value, displayName) {
		if (displayName) {
			$scope.aPointNames = displayName.split('to');
		} else {
			if (pIndex >= 0 && value)
				$scope.aPointNames[pIndex] = value;
			$scope.route.name = "";
			for (pointName of $scope.aPointNames) {
				if ($scope.route.name !== "") {
					$scope.route.name += " to "
				}
				$scope.route.name += pointName;
			}
		}
	};

	$scope.submit = function (formData) {
		if (formData.$valid) {

			if (typeof $scope.route.source !== 'object') {
				swal('', 'Invalid Source City', 'error');
				return;
			}

			if (typeof $scope.route.destination !== 'object') {
				swal('', 'Invalid Destination City', 'error');
				return;
			}

			$scope.route.islndmrk = $scope.islndmrk;

			Routes.updateRoute($scope.route, successPost, failure);

			function successPost(response) {
				//$scope.RouteReg.$dirty = false;
				if (response && response.data && response.data.data) {
					$rootScope.route = response.data.data;
					swal("Route Updated Successfully", "", "success");
					var sUrl = "#!/masters/routeDetails/allRoutes";
					$rootScope.redirect(sUrl);
				}
			}

			function failure(res) {
				console.log("fail: ", res);
				swal("Route Updated Failed", res.data.message, "error");
			}
		} else {
			swal('error', formValidationgrowlService.findError(form.$error), 'error');
		}
	};

	//Self Invoking Function
	(function init() {
		$timeout(function () {
			mapInit();
		});
	})();

	// Actual Function

	function getRoute() {
		if ($scope.allPoints.length >= 2)
			$scope.route.route_distance = utils.getDistanceInKm($scope.allPoints[0].latitude, $scope.allPoints[0].longitude, $scope.allPoints[1].latitude, $scope.allPoints[1].longitude);
		$scope.route.route_distance = $scope.route.route_distance + ($scope.route.route_distance * 0.15);
		$scope.route.route_distance = (Math.round(($scope.route.route_distance) * 100) / 100) || 0;
		// 	let oUrl = $scope.aLocationUrl[3];
		//
		// 	let q = {
		// 		start: $scope.allPoints[0].latitude + "," + $scope.allPoints[0].longitude,
		// 		destination: $scope.allPoints[$scope.allPoints.length-1].latitude + "," + $scope.allPoints[$scope.allPoints.length-1].longitude
		// 	};
		// 	for(i=1;i<$scope.allPoints.length-1;i++){
		// 		if(q.viapoints)
		// 			q.viapoints+="|";
		// 		else
		// 			q.viapoints = "";
		// 		q.viapoints+=$scope.allPoints[i].latitude + "," + $scope.allPoints[i].longitude;
		// 	}
		// 	let locationUrl = oUrl.url + otherUtils.prepareQeury (q);
		// 	return $http ({
		// 		method: "post",
		// 		url: locationUrl
		// 	}).then (function (response) {
		// 		$scope.route.route_distance = parseInt(response.data.results.trips[0].length/1000);
		// 		console.log(response);
		// 	});
		// }
	}

	function mapInit() {
		map = utils.initializeMapView('mapForTransportRouteEdit', {
			zoomControl: true,
			hybrid: false,
			zoom: 4,
			search: false,
			location: false,
			center: new L.LatLng(21, 90)
		}, false).map;
		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		setMarker($scope.route.source, 0);
		$scope.setDisplayName(0, $scope.route.source.placeName);
		$scope.allPoints[0] = $scope.route.source;
		setMarker($scope.route.destination, 1);
		$scope.setDisplayName(1, $scope.route.destination.placeName);
		$scope.allPoints[1] = $scope.route.destination;
	}

	function setMarker(data, pIndex) {
		map.setView([data.latitude, data.longitude]);

		let title = data.placeName + ', ' + data.placeAddress;
		if (markers[pIndex] !== undefined) {
			drawnItems.removeLayer(markers[pIndex]);
		}
		markers[pIndex] = L.marker([data.latitude, data.longitude]).bindTooltip(title, {
			permanent: false,
			direction: 'top'
		}).openTooltip();
		drawnItems.addLayer(markers[pIndex]);
	}

});

materialAdmin.controller("trackingCtrl", function($rootScope, $localStorage, $scope, $timeout, $interval, $modal, constants, customer, Routes, Vehicle, Driver,formValidationgrowlService, materialService) {
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	$scope.upsertCust = upsertCust;
	$scope.addMilestone = addMilestone;
	$scope.getTracking = getTracking;
	$scope.preview = preview;
	$scope.viewMileStones = viewMileStones;
	$scope.uploadReport = uploadReport;
	$scope.downloadTrackingReport = downloadTrackingReport;
	$scope.getCustomer = getCustomer;
	$scope.getAllVehicleTypes = getAllVehicleTypes;

	(function init() {
		$scope.aService = $scope.$configs.master.aServiceType || ['Express', 'Time Committed', 'Standard','Ferry/Empty'];
		getAllVehicleTypes();
		getTracking();
	})();

	if ($rootScope.route)
		$scope.route = angular.copy($rootScope.route);

	$scope.selectIndex = function (selectedRow, index){
		$scope.indx = index;
		$scope.selectedRow = selectedRow;
	}


	function getAllVehicleTypes() {

		Vehicle.getAllType(successGroupVehicleType, failGroupVehicleType);

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				$scope.aVehicleTypes = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}
	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					status: "Active"
				};

				if($scope.$configs.clientOps){
					req.cClient = $scope.$configs.clientOps;
				}

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

	function getTracking(){
		let filter= {};
		if($scope.vehType){
			filter.vehType = $scope.vehType;
		}
		if($scope.service){
			filter.service = $scope.service;
		}
		if($scope.customer__id){
			filter.customer__id = $scope.customer__id._id;
		}

		filter.route__id = $scope.route && $scope.route._id;
		filter.category = 'tracking';


		Routes.getTracking(filter, succType, failType)

		function succType(res) {
			if (res.data) {
				$scope.aTrackingData = res.data.data;
			} else {
				$scope.aTrackingData = [];
			}
		}

		function failType(res) {
			$scope.aTrackingData = [];
		}
	}

	// add or modify Billing Party


	// Add or Edit Customer
	function upsertCust(selectedCust) {
		selectedCust = selectedCust || {}
		selectedCust.route = $scope.route;

		var modalInstance = $modal.open({
			templateUrl: 'views/myRoutes/custUpsertPopup.html',
			controller: 'custUpsertController',
			resolve: {
				'selectedCust': function(){
					return selectedCust ;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				getTracking();


			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}

	// addMilestone
	function addMilestone(selectedCust) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myRoutes/addMilestone.html',
			controller: 'addMilestoneController',
			resolve: {
				'selectedCust': function(){
					return selectedCust ;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				getTracking();


			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}


	function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				$scope.vehicleTypes = res.data.data;
			} else {
				$scope.vehicleTypes = [];
			}
		}

		function failType(res) {
			$scope.vehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	}

	function viewMileStones(selectedCust) {
		if(!selectedCust) return;
		if($scope.route) {
			selectedCust.source = $scope.route.source;
			selectedCust.destination = $scope.route.destination;
		}
		var modalInstance = $modal.open({
			templateUrl: 'views/myRoutes/viewMilestone.html',
			controller: 'viewMileStoneCtrl',
			size: 'xl',
			resolve: {
				'selectedCust': function(){
					return selectedCust ;
				}
			}
		});
		modalInstance.result.then(function(response) {
			if(response)
				getTracking();
			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}

	function uploadReport(files, file, newFiles, duplicateFiles, invalidFiles, event, categoryType) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data.route_id = $scope.route._id;
			Routes.uploadCommon({modelName: 'TrackingRouteData', route__id: data.route_id, category : categoryType}, data)
				.then(function (d) {
					swal({title:'Info', text:d.message, type:"info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message,'error');
				});
		}
	};

	function downloadTrackingReport(type) {
		var oFilter = {};
		oFilter.download = true;
		oFilter.all = true;
		oFilter.type = type;
		oFilter.route__id = $scope.route._id;
		Routes.trackingReport(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.data.url;
			a.target = '_blank';
			a.download = res.data.url;
			a.click();
		}, err => {
			console.log(err);
			swal('Error!','Message not defined','error');
		});

	}

	function preview(selectedCust) {
		if(!selectedCust)
		if(!selectedCust)
			return;

		$modal.open({
			templateUrl: 'views/myRoutes/previewTracking.html',
			controller: ['$scope',
				'$stateParams',
				'$timeout',
				'DatePicker',
				'utils',
				'gpsSocketService', 'selectedCust', previewTrackingCtrl],
			controllerAs: 'vmvVm',
			size: 'xl',
			resolve: {
				selectedCust: selectedCust
			}
		});
		$rootScope.tripUpdate = true;
	}



});


materialAdmin.controller("budgetingCtrl", function($rootScope, $localStorage, $scope, $timeout, $interval, $modal, constants, customer, Routes, Vehicle, formValidationgrowlService, materialService) {
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	$scope.upsertCustomer = upsertCustomer;
	$scope.getBudgeting = getBudgeting;
	$scope.getCustomer = getCustomer;
	$scope.uploadReport = uploadReport;
	$scope.downloadBudgetingReport = downloadBudgetingReport;
	$scope.getAllVehicleTypes = getAllVehicleTypes;


	(function init() {
		$scope.aService =  ['Express', 'Time Committed', 'Standard','Ferry/Empty'];
		getAllVehicleTypes();
		getBudgeting();
	})();

	if ($rootScope.route)
		$scope.route = angular.copy($rootScope.route);

	$scope.selectIndex = function (selectedRow, index){
		$scope.indx = index;
		$scope.selectedRow = selectedRow;
	}
		function getAllVehicleTypes() {

			Vehicle.getAllType(successGroupVehicleType, failGroupVehicleType);

			function successGroupVehicleType(response) {
				if (response && response.data && response.data.data) {
					$scope.aVehicleTypes = response.data.data;
				}
			}

			function failGroupVehicleType(res) {
				console.error("fail: ", res);
			}
		}
		function getCustomer(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {

					let req = {
						name: viewValue,
						no_of_docs: 10,
						status: "Active"
					};

					if($scope.$configs.clientOps){
						req.cClient = $scope.$configs.clientOps;
					}

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

	function getBudgeting(){
		let filter= {};
		if($scope.vehType){
			filter.vehType = $scope.vehType;
		}
		if($scope.service){
			filter.service = $scope.service;
		}
		if($scope.customer__id){
			filter.customer__id = $scope.customer__id._id;
		}

		filter.route__id = $scope.route._id;
		filter.category = 'budgeting';
		Routes.getTracking(filter, succType, failType)

		function succType(res) {
			if (res.data) {
				$scope.aBudgetingData = res.data.data;
			} else {
				$scope.aBudgetingData = [];
			}
		}

		function failType(res) {
			$scope.aBudgetingData = [];
		}
	}

	// add or modify Billing Party
	function uploadReport(files, file, newFiles, duplicateFiles, invalidFiles, event, categoryType) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data.route_id = $scope.route._id;
			Routes.uploadCommon({modelName: 'BudgetingRouteData', route__id: data.route_id, category : categoryType}, data)
				.then(function (d) {
					swal({title:'Info', text:d.message, type:"info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message,'error');
				});
		}
	};

	function downloadBudgetingReport(type) {
		var oFilter = {};
		oFilter.download = true;
		oFilter.all = true;
		oFilter.type = type;
		oFilter.route__id = $scope.route._id;
		Routes.trackingReport(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.data.url;
			a.target = '_blank';
			a.download = res.data.url;
			a.click();
		}, err => {
			console.log(err);
			swal('Error!','Message not defined','error');
		});

	}

	// Add or Edit Customer
	function upsertCustomer(selectedCust) {
		selectedCust = selectedCust || {}
		selectedCust.route = $scope.route;

		var modalInstance = $modal.open({
			templateUrl: 'views/myRoutes/budgetcusPopup.html',
			controller: 'budgetcustUpsertController',
			resolve: {
				'selectedCust': function(){
					return selectedCust ;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				getBudgeting();


			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}



	function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				$scope.vehicleTypes = res.data.data;
			} else {
				$scope.vehicleTypes = [];
			}
		}

		function failType(res) {
			$scope.vehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	}
});


function updateKmPopupCtrl(
	$scope,
	$uibModalInstance,
	oRoute,
	Routes
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;

	//init
	(
		function init() {
			// vm.aVehicle = [];
			vm.oRoute = oRoute;
		}
	)();

	//Actual Functions
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {
		if(formData.$valid) {

			const  oReq = {
				_id: vm.oRoute._id,
				route_distance : vm.oRoute.route_distance,
				remark: vm.oRoute.remark
			};

			Routes.updateKm(oReq, successCallback, failureCallback);

			function successCallback(res) {
				vm.oRoute = res.data.data;
				swal('',res.data.message,'success');
				$uibModalInstance.dismiss($scope.oVehicle);
			}

			function failureCallback(res) {
				swal('Error',res.data.message,'error');
			}
		}else{
			swal('','All Mandatory Field are not Filled','error');
		}
	}
}
materialAdmin.controller("addMilestoneController", addMilestoneController);
materialAdmin.controller("viewMileStoneCtrl",viewMileStoneCtrl);
materialAdmin.controller("custUpsertController", custUpsertController);
materialAdmin.controller("budgetcustUpsertController", budgetcustUpsertController);
addMilestoneController.$inject = [
	'$modal',
	'$scope',
	'$uibModalInstance',
	'customer',
	'Routes',
	'Vehicle',
	'selectedCust',
];
viewMileStoneCtrl.$inject = [
	'$scope',
	'selectedCust'
];
custUpsertController.$inject = [
	'$modal',
	'$scope',
	'$uibModalInstance',
	'customer',
	'Routes',
	'Vehicle',
	'selectedCust',
];
budgetcustUpsertController.$inject = [
	'$modal',
	'$scope',
	'$uibModalInstance',
	'customer',
	'Routes',
	'Vehicle',
	'selectedCust',
];

function addMilestoneController(
	$modal,
	$scope,
	$uibModalInstance,
	customer,
	Routes,
	Vehicle,
	selectedCust,
) {

	// functions Identifiers
	$scope.closeModal = closeModal;
	$scope.remove = remove;
	$scope.submit = submit;




	// INIT functions
	(function init() {
		$scope.selectedIndex = 0;
		$scope.aService =  ['Express', 'Time Committed', 'Standard','Ferry/Empty'];
		$scope.selectedCust = selectedCust;
		$scope.selectedCust.milestone = $scope.selectedCust.milestone || [];
	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}
	$scope.onSelect = function (index) {
		$scope.selectedIndex = index;
	}

	function remove(index) {
		$scope.selectedCust.milestone.splice(index, 1);
	}

	// add or modify Billing Party
	function submit(formData) {


		if(formData.$valid){

			let request = {
			 ...$scope.selectedCust
			};
			Routes.upsertRouteTracking(request, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg,'error');
			}

			// Handle success response
			function onSuccess(response){
				var msg = response.message;
				swal('Success',msg,'success');
				$uibModalInstance.close(response.data);
			}
		}else{
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}


}

function viewMileStoneCtrl (
	$scope,
	selectedCust
	) {
		$scope.markers = [];
		$scope.selectedCust = angular.copy(selectedCust);
		if($scope.selectedCust && $scope.selectedCust.milestone) {
			$scope.selectedCust.source.category = 'source';
			$scope.selectedCust.source.name = $scope.selectedCust.source.placeName;
			$scope.markers.push($scope.selectedCust.source);
			$scope.selectedCust.milestone.forEach((item)=>{
				$scope.markers.push(item);
			});
			$scope.selectedCust.destination.category = 'destination';
			$scope.selectedCust.destination.name = $scope.selectedCust.destination.placeName;
			$scope.markers.push($scope.selectedCust.destination);
		}
		const infowindow = new google.maps.InfoWindow();
		const mapOptions = {
			zoom: 6,
			center: new google.maps.LatLng(25,80),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		$scope.initialize = function () {
		var directionsService = new google.maps.DirectionsService;
		var directionsDisplay = new google.maps.DirectionsRenderer;
		$scope.map = new google.maps.Map(document.getElementById('trMap'),mapOptions);
		directionsDisplay.setMap($scope.map);
		var createMarker = function (info) {
			const marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(info.latitude || info.location.lat,info.longitude || info.location.lng),
			});
			const contentString =
			'<div class="map-popup">' +
			'<p class="pp-hd">'+ info.category+'</p>'+
			'<p>Name: <span>'+info.name +'</span></p>' +
			'</div>';
			marker.addListener("click",()=>{
				infowindow.setContent(contentString);
				infowindow.open({
					anchor: marker,
					map: $scope.map
				});
			});
		}
		$scope.markers.forEach((item)=>{createMarker(item)});
		calculateAndDisplayRoute(directionsService,directionsDisplay);
	}
	function calculateAndDisplayRoute(directionsService,directionsDisplay) {
		let src = new google.maps.LatLng($scope.markers[0].latitude,$scope.markers[0].longitude);
		let dest = new google.maps.LatLng($scope.markers[$scope.markers.length-1].latitude,$scope.markers[$scope.markers.length-1].longitude);
		/*directionsService.route({
			origin: src,
			destination: dest,
			travelMode: 'DRIVING'
		},function (response,status) {
			if(status == 'OK') {
				directionsDisplay.setDirections(response);
			}	else {
				window.alert('Directions request failed due to '+ status);
			}
		});*/
	}
	$scope.openInfoWindow = function (e,info) {
		e.preventDefault();
		const marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(info.latitude || info.location.lat,info.longitude || info.location.lng)
		});
		const contentString =
			'<div class="map-popup">' +
			'<p class="pp-hd">'+ info.category+'</p>'+
			'<p>Name: <span>'+info.name +'</span></p>' +
			'</div>';
		infowindow.setContent(contentString);
		infowindow.open({
			anchor: marker,
			map: $scope.map,
			content: contentString
		});
	}
	setTimeout(() => {
		$scope.initialize();
	}, 1);
	console.log(selectedCust);
}

function custUpsertController(
	$modal,
	$scope,
	$uibModalInstance,
	customer,
	Routes,
	Vehicle,
	selectedCust,
) {

	// functions Identifiers
	$scope.closeModal = closeModal;
	$scope.getCustomer = getCustomer;
	$scope.getAllVehicleTypes = getAllVehicleTypes;
	$scope.submit = submit;


	// INIT functions
	(function init() {
		$scope.aService =  ['Express', 'Time Committed', 'Standard', 'Ferry/Empty'];
		$scope.route = angular.copy(selectedCust.route);
		getAllVehicleTypes();

		if(selectedCust && selectedCust._id){
			$scope.customer = {name: selectedCust.customer_name, _id: selectedCust.customer__id};
			$scope.vehicleType =  selectedCust.vehType;
			$scope.service = selectedCust.service;
			$scope.tat_hr = selectedCust.tat_hr;
			$scope.tat_min = selectedCust.tat_min;
		}
	})();


	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					status: "Active"
				};

				if($scope.$configs.clientOps){
					req.cClient = $scope.$configs.clientOps;
				}

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

	function getAllVehicleTypes() {

		Vehicle.getAllType(successGroupVehicleType, failGroupVehicleType);

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				$scope.aVehicleTypes = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}

	// add or modify Billing Party
	function submit(formData) {


		if(formData.$valid){

			let request = {
				...selectedCust,
				category: 'tracking',
				customer__id : $scope.customer && $scope.customer._id,
				customer_name : $scope.customer && $scope.customer.name,
				route__id : $scope.route && $scope.route._id,
				route_name : $scope.route && $scope.route.name,
				route_distance : $scope.route && $scope.route.route_distance,
				vehTypeNam :  $scope.aVehicleTypes.find(obj => obj._id === $scope.vehicleType).name,
				vehType : $scope.vehicleType,
				service : $scope.service,
				tat_hr : $scope.tat_hr,
				tat_min : $scope.tat_min,
			};
			if(selectedCust && selectedCust._id)
			   Routes.upsertRouteTracking(request, onSuccess, onFailure);
			else
				Routes.addRouteTracking(request, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.data && response.data.message|| response.data && response.data.error_message|| 'Data not Update';
				swal('Error!', msg,'error');
			}

			// Handle success response
			function onSuccess(response){
				var msg = response.data && response.data.message;
				swal('Success',msg,'success');
				$uibModalInstance.close(response.data);

			}
		}else{
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}


}
function budgetcustUpsertController(
	$modal,
	$scope,
	$uibModalInstance,
	customer,
	Routes,
	Vehicle,
	selectedCust,
) {

	// functions Identifiers
	$scope.closeModal = closeModal;
	$scope.getCustomer = getCustomer;
	$scope.getAllVehicleTypes = getAllVehicleTypes;
	$scope.submit = submit;


	// INIT functions
	(function init() {
		$scope.aService =  ['Express', 'Time Committed', 'Standard','Ferry/Empty'];
		$scope.route = angular.copy(selectedCust.route);
		getAllVehicleTypes();

		if(selectedCust && selectedCust._id){
			$scope.customer = {name: selectedCust.customer_name, _id: selectedCust.customer__id};
			$scope.vehicleType =  selectedCust.vehType;
			$scope.service = selectedCust.service;
			$scope.rateKm = selectedCust.rateKm;
			$scope.dieselKm = selectedCust.dieselKm;
			$scope.toll = selectedCust.toll;
		}
	})();


	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					status: "Active"
				};

				if($scope.$configs.clientOps){
					req.cClient = $scope.$configs.clientOps;
				}

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

	function getAllVehicleTypes() {

		Vehicle.getAllType(successGroupVehicleType, failGroupVehicleType);

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				$scope.aVehicleTypes = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}

	// add or modify Billing Party
	function submit(formData) {


		if(formData.$valid){

			let request = {
				...selectedCust,
				category: 'budgeting',
				customer__id : $scope.customer && $scope.customer._id,
				customer_name : $scope.customer && $scope.customer.name,
				route__id : $scope.route && $scope.route._id,
				route_name : $scope.route && $scope.route.name,
				route_distance : $scope.route && $scope.route.route_distance,
				vehTypeNam :  $scope.aVehicleTypes.find(obj => obj._id === $scope.vehicleType).name,
				vehType : $scope.vehicleType,
				service : $scope.service,
				rateKm : $scope.rateKm,
				dieselKm : $scope.dieselKm,
				toll : $scope.toll,
			};
			if(selectedCust && selectedCust._id)
				Routes.upsertRouteTracking(request, onSuccess, onFailure);
			else
				Routes.addRouteTracking(request, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.data && response.data.message|| response.data && response.data.error_message|| 'Data not Update';
				swal('Error!', msg,'error');
			}

			// Handle success response
			function onSuccess(response){
				var msg = response.data && response.data.message;
				swal('Success',msg,'success');
				$uibModalInstance.close(response.data);

			}
		}else{
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}


}


function previewTrackingCtrl(
	$scope,
	$stateParams,
	$timeout,
	DatePicker,
	utils,
	gpsSocketService,
	selectedCust
){

	let LeafIcon = L.Icon.extend({
		options: {
			iconSize:   [36, 45],
			iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
		}
	});


	////////////////////////////////////////////////////////////////

	let lineIconOptions = L.Icon.extend({
		options: {
			iconSize:   [15, 15],
			iconAnchor: [7.5, 7.5]
		}
	});


	//Object Identifier
	let vm = this,
		oRes, map, oMap, lineLayer, startPointMarker, endPointMarker,
		flagIcon = new LeafIcon({iconUrl: 'img/stopFlag.png'}),
		startIcon = new LeafIcon({iconUrl: 'img/start.png'}),
		stopIcon = new LeafIcon({iconUrl: 'img/stop.png'}),
		lineIcon = new lineIconOptions({iconUrl: getLineIconSvg()})
	;

	//Function Identifier
	vm.closeModal = closeModal;
	vm.search = search;
	vm.getColor = getColor;
	vm.dateChange = dateChange;
	vm.resizeFullScreen = resizeFullScreen;
	vm.resizeSmallScreen = resizeSmallScreen;
	vm.aTime = ["15 min", "30 min", "1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr"];

	$scope.vehicle = selectedCust;
	$scope.isShow = true;

	$scope.dateTimeStart = new Date();
	$scope.dateTimeStart.setHours(0);
	$scope.dateTimeStart.setMinutes(0);
	$scope.dateTimeStart.setSeconds(0);
	$scope.dateTimeStart.getMilliseconds(0);
	$scope.dateTimeEnd = new Date();

	function getColor(status) {
		switch(status){
			case 'running': return 'ja-green';
			case 'stopped': return 'ja-red';
			default : return 'ja-grey';
		}
	}

	//Init
	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.aHour = Array(24).fill('').map((o,i) => i);
		vm.aMin = Array(60).fill('').map((o,i) => i);
		vm.start = {};
		vm.end = {};

		vm.start.date = $scope.dateTimeStart;
		vm.start.hour = $scope.dateTimeStart.getHours();
		vm.start.min = $scope.dateTimeStart.getMinutes();

		vm.end.date = $scope.dateTimeEnd;
		vm.end.hour = $scope.dateTimeEnd.getHours();
		vm.end.min = $scope.dateTimeEnd.getMinutes();
		vm.zoomIn = zoomIn;
		vm.zoomOut = zoomOut;

		$timeout(function () {
			mapInit();
		});
		// getplayData();
		dateChange();
		if($scope.vehicle && $scope.vehicle.milestone)
			plotData($scope.vehicle.milestone);
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function dateChange(dateType){

		if(dateType === 'startDate' && vm.end_date && vm.start_date){

			let isDate = vm.end.date instanceof Date,
				monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
				dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date(vm.start.date);
				vm.end.date = new Date(date.setMonth(date.getMonth() + 1));
			}

		}else if(dateType === 'endDate' && vm.end_date && vm.start_date) {

			let isDate = vm.start.date instanceof Date,
				monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
				dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date(vm.end.date);
				vm.start.date = new Date(date.setMonth(date.getMonth() - 1));
			}
		}
	}

	function zoomIn() {
		if(map){
			curZoom = map.getZoom();
			if(curZoom && curZoom<17)
				map.setZoom(++curZoom);
		}
	}

	function zoomOut() {
		if(map){
			curZoom = map.getZoom();
			if(curZoom && curZoom>2)
				map.setZoom(--curZoom);
		}
	}

	function resizeFullScreen(){
		$scope.isShow = true;
	}

	function resizeSmallScreen(){
		$scope.isShow = false;
	}

	function getplayData() {
		let playBack = {};
		playBack.request = 'playback';
		playBack.version = 2;
		playBack.device_id = $stateParams.data.vehicle.device_imei;
		playBack.start_time = $scope.dateTimeStart.toISOString();
		playBack.end_time = $scope.dateTimeEnd.toISOString();
		playBack.selected_uid = $scope.$clientConfigs.gpsId;
		playBack.login_uid = $scope.$clientConfigs.gpsId;
		playBack.lms_uid = $scope.$user.userId;
		gpsSocketService.getplayData(playBack, playBackResponse);

		function playBackResponse(oRes){
			if(oRes){
				if(oRes.status === 'OK'){
					for (let i = 0; i < oRes.data.length; i++) {
						oRes.data[i].start_time_cal = oRes.data[i].start_time;
						oRes.data[i].end_time_cal = oRes.data[i].end_time;
						oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
						oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
						if(oRes.data[i].duration){
							oRes.data[i].duration = oRes.data[i].duration/3600;
							oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
							oRes.data[i].duration = parseFloat(oRes.data[i].duration);
						}
						if(oRes.data[i].distance){
							oRes.data[i].distance = oRes.data[i].distance/1000;
							oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
						}
					}
					if(oRes.tot_dist){
						oRes.tot_dist = oRes.tot_dist/1000;
						oRes.tot_dist = oRes.tot_dist.toFixed(2);
					}
					plotData(oRes.data);
					//$rootScope.playData = oRes;
					//$rootScope.redirect('/#!/main/playPosition');
				}
				else if(oRes.status === 'ERROR'){
					//swal(oRes.message, "", "error");
				}
			}
			$timeout(function () {
				vm.oRes = oRes;
			});
		}
	}

	function mapInit() {
		oMap = utils.initializeMapView('mapViewVehicleTrackingModal', {
			zoomControl: false,
			hybrid: true,
			zoom: 4,
			search: false,
			location: false,
			center: new L.LatLng(21, 90)
		}, false);
		map = oMap.map;

		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		if(false && $stateParams.data && $stateParams.data.lat && $stateParams.data.lng){
			let marker = L.marker([$stateParams.data.lat, $stateParams.data.lng]);
			utils.makeMarker(marker,$stateParams.data.vehicle.gpsData);
			map.addLayer(marker);
		}
	}

	function search() {
		$scope.dateTimeStart = vm.start.date;
		$scope.dateTimeStart.setHours(vm.start.hour);
		$scope.dateTimeStart.setMinutes(vm.start.min);
		$scope.dateTimeStart.setSeconds(0);

		$scope.dateTimeEnd = vm.end.date;
		$scope.dateTimeEnd.setHours(vm.end.hour);
		$scope.dateTimeEnd.setMinutes(vm.end.min);
		$scope.dateTimeEnd.setSeconds(0);

		getplayData();
	}

	var fixedPolylineOptions = {
		color: 'blue',
		weight: 2.5,
		opacity: 0.8
	};

	/**
	 * @return {string}
	 */
	let SecondsTohhmmss = function(totalSeconds) {
		totalSeconds = totalSeconds*3600;
		let hours   = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		// round seconds
		seconds = Math.round(seconds * 100) / 100

		let result = (hours < 10 ? "0" + hours : hours) + " hours " ;
		result += (minutes < 10 ? "0" + minutes : minutes) + " minutes " ;
		//result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
		return result;
	};

	function getLineIconSvg() {
		let iColor = "blue";
		let svgCode  = utils.lineMarkerSvg(iColor);
		return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
	}

	let plotData = function (data) {

		if (map.hasLayer(lineLayer))
			map.removeLayer(lineLayer);

		if(map.hasLayer(startPointMarker))
			map.removeLayer(startPointMarker);

		if(map.hasLayer(endPointMarker))
			map.removeLayer(endPointMarker);

		lineLayer = new L.layerGroup();
		lineLayer.addTo(map);
		let polylinePoints = [];
		let startPoint = data[0].start;
		let endPoint = data[data.length-1].stop;
		let startPopup = '<div class="map-popup">'+
			'<p class="pp-hd">Start Info</p>'+
			'<p>Start Time: <span>'+data[0].start_time + '</span></p>'+
			'</div>';
		let endPopup = '<div class="map-popup">'+
			'<p class="pp-hd">End Info</p>'+
			'<p>End Time: <span>'+data[data.length-1].end_time + '</span></p>'+
			'</div>';

		startPointMarker = new L.marker([startPoint.latitude , startPoint.longitude], {icon: startIcon});
		startPointMarker.bindPopup(startPopup).openPopup().addTo(map);

		endPointMarker = new L.marker([endPoint.latitude , endPoint.longitude ], {icon: stopIcon});
		endPointMarker.bindPopup(endPopup).openPopup().addTo(map);

		let pointSkipper = 0;
		for (let point of data){
			if(point.drive){
				for(let ping of point.points){
					pointSkipper++;
					let pointX = new L.LatLng(ping.lat, ping.lng);
					polylinePoints.push(pointX);
					if(pointSkipper%8 === 0){
						let lineMarker = L.marker(pointX, {icon: lineIcon});
						lineMarker.setRotationAngle((ping.course || 90));
						lineLayer.addLayer(lineMarker);
					}
				}
			}else {
				let pointmid = new L.LatLng(point.stop.latitude, point.stop.longitude);
				polylinePoints.push(pointmid);
				let stopPopup = '<div class="map-popup">'+
					'<p class="pp-hd">Stop Info</p>'+
					'<p>Strt Time: <span>'+point.start_time + '</span></p>'+
					'<p>End Time: <span>'+point.end_time + '</span></p>'+
					'<p>Residence : <span>'+SecondsTohhmmss(point.duration)+'</span></p>'+
					'<p>Address &nbsp;&nbsp;&nbsp; : <span>'+point.start_addr+'</span></p>'+
					'<p>Nearest Landmark : <span>'+point.NearLandMark+'</span></p>'+
					'<p>Lat Lng :<span>'+point.stop.latitude+', '+point.stop.longitude+'</span></p>'+
					'</div>';
				point.marker = L.marker([point.stop.latitude, point.stop.longitude],
					{icon: flagIcon}).bindPopup(stopPopup)
					.openPopup();
				//.on('click',onMarkerClick);
				point.marker.addTo(map);
			}
			let playBackLine = new L.Polyline(polylinePoints, fixedPolylineOptions);
			lineLayer.addLayer(playBackLine);
			map.fitBounds(playBackLine.getBounds());
		}
	}

}

