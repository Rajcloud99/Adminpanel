materialAdmin.controller("addorEditBookingController",
	function ($filter,
			  $localStorage,
			  $rootScope,
			  $scope,
			  $state,
			  $stateParams,
			  $timeout,
			  billingPartyService,
			  bookingServices,
			  branchService,
			  clientConfig,
			  consignorConsigneeService,
			  constants,
			  customer,
			  DatePicker,
			  materialService,
			  ReportService,
			  Routes,
			  Vendor,
			  formulaFactory,
			  Vehicle,
			  $uibModal,
			  cityStateService
	) {
		let vm = this;
		vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
		// Setting the DatePicker factory to scope for global use in controller and template
		$scope.DatePicker = angular.copy(DatePicker);
		// $scope.editBooking = 'undefined';


		if ($localStorage.ft_data.configs && $localStorage.ft_data.configs.postBooking) {
			var toDay = new Date();
			var daysBack = $localStorage.ft_data.configs.postBooking;
			toDay.setDate(toDay.getDate() - daysBack);
			$scope.DatePicker.dateSettings.maxDate = new Date();
			$scope.DatePicker.dateSettings.minDate = new Date(toDay);
		}

		$scope.oBooking = {
			route: []
		};
		$scope.routeVisibility = true;


		// Default Select today's Date
		//moment($scope.oBooking.do_start).add($scope.configs['Bookings']['Add']['Field values']['Date Range'], 'day').format();
		$scope.oBooking.booking_date = new Date();

		(function init() {

			$scope.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
			if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
				$scope.aWeightTypes.push('PMT');
			}
			getMaterialGroup();
			getAllVehicleType();
			$scope.$watchGroup(['oBooking.munshiyana', 'oBooking.total_expense', 'oBooking.otherExp'], function (...aMod) {
				$scope.formulaCommonCalFun();
			});
		})();

		// get vehicle type
		function getAllVehicleType() {
			function succType(res) {
				if (res.data && res.data.data && res.data.data[0]) {
					$scope.aVehicleTypes = res.data.data;

				}
			}

			function failType(res) {
				vm.aVehicleTypes = [];
			}

			Vehicle.getAllType(succType, failType)
		}

		$scope.getLocation = function (viewValue) {
			return new Promise((resolve, reject) => {
				Routes.getLocation(viewValue)
					.then(aAddress => {
						resolve((aAddress || []).map(oAddress => {
							let aSplitAddress = (oAddress.placeAddress || '')
								.match(/([A-z0-9 \-\._\/\(\)]*)/g)
								.reduce((acc, str) => {
									if (str)
										acc.push(str.trim());
									return acc;
								}, [])
								.reverse();

							let pincode;
							if (aSplitAddress.length && aSplitAddress[0].match(/^\d{4,10}$/))
								pincode = aSplitAddress.shift();
							let state = aSplitAddress.length ? aSplitAddress.shift() : '';
							let district = aSplitAddress.length ? aSplitAddress.shift() : '';
							let city = aSplitAddress.length ? aSplitAddress.shift() : oAddress.placeName;



							return {
								c: city,
								d: district,
								s: state,
								f: Routes.getStateShortName(state),
								lat: oAddress.latitude,
								lng: oAddress.latitude,
							};
						}));
					});
			}).catch(err => {
				console.error(err)
			});
		};

		$scope.onSelectSource = function () {
			setRouteKm();
		};

		$scope.onSelectDest = function (viewValue) {
			setRouteKm();
		}

		function setRouteKm() {
			if ($scope.oBooking.ld && $scope.oBooking.uld && $scope.oBooking.ld.location && $scope.oBooking.uld.location) {
				if (google && google.maps && google.maps.DistanceMatrixService) {
					new google.maps.DistanceMatrixService()
						.getDistanceMatrix(
							{
								origins: [$scope.oBooking.ld.location],
								destinations: [$scope.oBooking.uld.location],
								travelMode: 'DRIVING',
								// unitSystem: UnitSystem,
							}, (response) => {
								console.log(response)
								if(response && Array.isArray(response.rows) && response.rows[0]){
									let element = response.rows[0].elements;
									$scope.oBooking.rKm = Math.round2(element[0].distance.value / 1000, 2);
									$scope.$apply();
								}
							});
				}
			}
			// Routes.getDistance($scope.oBooking.ld.lat, $scope.oBooking.ld.lng, $scope.oBooking.uld.lat, $scope.oBooking.uld.lng)
			// 	.then(distance => {
			// 		$scope.oBooking.rKm = distance;
			// 	});
		}


		$scope.onSelectIntermediate = function (item) {
			if ($scope.intermediateRoute && $scope.intermediateRoute.length > 8) {
				return swal('Error', 'Sorry you cannot add more than 8 intermediate routes', 'error');
			}
			$scope.intermediateRoute = $scope.intermediateRoute || [];
			$scope.intermediateRoute.push(item);
			$scope.oBooking.imp = '';
		}

		$scope.removeIntermediate = function (select, index) {
			$scope.intermediateRoute.splice(index, 1);
		}

		/*
		* Setting default value
		* Multi Select with Search Dropdown Settings
		* */
		$scope.aCustomerRoutes = [];

		$scope.selectRouteSettings = {
			displayProp: "route_name",
			enableSearch: true,
			searchField: 'route_name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};

		$scope.formulaCommonCalFun = function () {
			vm.munsiyanaFromula.bind({
				'munshiyana': $scope.oBooking.munshiyana || 0,
				'total_expense': $scope.oBooking.total_expense || 0,
				'otherExp': $scope.oBooking.otherExp || 0
			});
			$scope.oBooking.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
		}


		$scope.changePayType = function (pType) {
			if (pType === 'To pay' || pType === 'To be billed') {
				$scope.oBooking.toPay = ($scope.oBooking.total_expense || 0) - ($scope.oBooking.munshiyana || 0);
				$scope.oBooking.advance = 0;
				if ($scope.oBooking.diesel) {
					$scope.oBooking.diesel.quantity = 0;
					$scope.oBooking.diesel.rate = 0;
					$scope.oBooking.diesel.amount = 0;
				}
				$scope.oBooking.driver_cash = 0;
				$scope.oBooking.toll_tax = 0;
				$scope.oBooking.other_charges = 0;
				$scope.oBooking.other_charges_remark = '';
				$scope.oBooking.account_payment = 0;
			}
		}

		$scope.calculateTotalPMT = function () {
			$scope.oBooking.total_expense = ($scope.oBooking.pmtWeight || 0) * ($scope.oBooking.pmtRate || 0);
			$scope.changeAdvance('total');
			$scope.changeAcPayment();
		}

		$scope.calculateTotalPUnit = function () {
			$scope.oBooking.total_expense = ($scope.oBooking.weight_per_unit || 0) * ($scope.oBooking.total_no_of_units || 0);
			$scope.changeAdvance('total');
			$scope.changeAcPayment();
		}

		$scope.resetAll = function () {
			$scope.oBooking.total_expense = undefined;
			$scope.oBooking.munshiyana = undefined;
			$scope.oBooking.advance = undefined;
			$scope.oBooking.toPay = undefined;
			$scope.oBooking.pmtWeight = undefined;
			$scope.oBooking.pmtRate = undefined;
			$scope.oBooking.weight_per_unit = undefined;
			$scope.oBooking.total_no_of_units = undefined;
		}

		$scope.changeAcPayment = function () {
			$scope.oBooking.account_payment = ($scope.oBooking.advance || 0) - ($scope.oBooking.diesel ? ($scope.oBooking.diesel.amount || 0) : 0) - ($scope.oBooking.driver_cash || 0) - ($scope.oBooking.toll_tax || 0) - ($scope.oBooking.other_charges || 0);
		}

		$scope.changeAdvance = function (type) {
			var tot_exp = angular.copy($scope.oBooking.total_expense);
			var joint_exp = ($scope.oBooking.toPay || 0) + ($scope.oBooking.advance || 0);
			if (type === 'munshiyana') {
				// $scope.oBooking.toPay = (($scope.oBooking.total_expense || 0) - ($scope.oBooking.munshiyana || 0)) - ($scope.oBooking.advance || 0) - ($scope.oBooking.tdsAmount || 0);
			}
			if (type === 'advance') {
				// $scope.oBooking.toPay = (($scope.oBooking.total_expense || 0) - ($scope.oBooking.munshiyana || 0)) - ($scope.oBooking.advance || 0) - ($scope.oBooking.tdsAmount || 0);
			}
			if ($scope.oBooking.payment_type === 'To pay' || $scope.oBooking.payment_type === 'To be billed') {
				// $scope.oBooking.toPay = ($scope.oBooking.total_expense || 0) - ($scope.oBooking.munshiyana || 0) - ($scope.oBooking.tdsAmount || 0);
				$scope.oBooking.advance = 0;
			}
		}

		/*
		* Multi Select with Search Dropdown Settings
		* */
		$scope.selectRouteEvents = {
			onSelectionChanged: function () {
				if ($scope.oBooking && $scope.oBooking.route && $scope.oBooking.route[0] && $scope.oBooking.route[0]._id) {

					$scope.getTripLocation($scope.oBooking.route[0]._id);
					var routeData = $scope.oBooking.route.data || $scope.oBooking.route[0].data;

					/*if(typeof $scope.editBooking !== 'undefined')
						routeData = $scope.oBooking.route.data;*/

					if (typeof routeData !== 'undefined') {
						/*
						* Filter Contract's vehicle
						* Remove non required elements
						* Transform array object to [{name:'vehicle_type(vehicle_group_name)',_id:''}]
						* */
						$scope.aRouteVehicleTypeList = [];
						Array.prototype.push.apply($scope.aRouteVehicleTypeList, routeData.filter(function (obj) {
							if (obj.booking_type === $scope.oBooking.booking_type)
								return obj;
						}));

						$scope.aRouteVehicleTypeList = $scope.aRouteVehicleTypeList.map(function (obj) {
							return {
								name: obj.vehicle_type + ' (' + obj.vehicle_group_name + ')',
								_id: obj.vehicle_id,
							}
						});

						/*if(typeof $scope.editBooking === 'undefined')
							$scope.oBooking.preference = $scope.aRouteVehicleTypeList.map(obj => obj._id);*/
						// $scope.oBooking.preference = (($scope.oBooking.preference || {}).length > 0) ? $scope.oBooking.preference : $scope.aRouteVehicleTypeList.map(obj => obj._id);
					}
				}
			}
		};

		/*
		* Get All Contract
		* */
		($scope.getContract = function (customerDetail) {
			if (!customerDetail)
				return;

			/*
			* Fetch Consignor, Consignee, Billing party form Backend
			* */

			// Get Consignor/Consignee from backend
			(function getConsignorConsignee() {

				let oFilter = {
					// customer : customerDetail._id,
					type: 'Consignor',
					all: 'true'
				};

				if ($scope.$configs.GR.custConfig)
					oFilter.customer = customerDetail._id;

				consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {
					console.log(response);
					//swal('Error!','Message not defined','error');
				}

				// Handle success response
				function onSuccess(response) {
					$scope.aConsigner = response.data;
				}
			})();

			// Get Consignor/Consignee from backend
			(function getConsignorConsignee() {

				let oFilter = {
					// customer : customerDetail._id,
					type: 'Consignee',
					all: 'true'
				};

				if ($scope.$configs.GR.custConfig)
					oFilter.customer = customerDetail._id;

				consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {
					console.log(response);
					//swal('Error!','Message not defined','error');
				}

				// Handle success response
				function onSuccess(response) {
					$scope.aConsignee = response.data;
				}
			})();

			(function getBillingParty() {

				let oFilter = {
					customer: customerDetail._id,
					all: 'true'
				};

				// if($scope.$configs.GR.custConfig)
				// 	oFilter.customer = customerDetail._id;

				billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {
					console.log(response);
					//swal('Error!','Message not defined','error');
				}

				// Handle success response
				function onSuccess(response) {
					$scope.aBiller = response.data;
				}
			})();

			getCustomerByType(['CHA'], function (data) {
				$scope.aCha = data.data;
				if (customerDetail.type.indexOf('CHA') > -1)
					$scope.aCha.push(customerDetail);
			});

			function success(data) {
				// [{}] because to not disable contract dropdown when aContracts is empty
				$scope.aContracts = data.data.length !== 0 ? data.data : [{}];

				/*
				* In case of edit booking don't run below code
				* */
				if (typeof $scope.editBooking !== 'undefined')
					return;

				$scope.oBooking.contract_id = customerDetail.active_contract__id && $scope.aContracts.find(obj => obj._id === customerDetail.active_contract__id);
				$scope.getCustomerRoutes($scope.oBooking.contract_id);
			}

			var contractFilter = {
				all: true,
				customer__id: customerDetail._id
			};
			// create url for create new location page
			$scope.createNewLocationUrl = '#!/masters/trips/getMap/' + customerDetail.customerId;
			customer.getAllContractsOfCustomer(contractFilter, success);
		})();

		/*
		* Get All Routes or Customer Contract Routes
		* */
		$scope.getCustomerRoutes = function (contractDetail) {
			if (typeof $scope.editBooking === 'undefined')
				$scope.oBooking.route = [];

			if (typeof $scope.editBooking === 'undefined') { //&& contractDetail
				if (!contractDetail) {
					$scope.routeVisibility = false;
					$timeout(function () {
						$scope.routeVisibility = true;
					});
					// $scope.selectRouteSettings.selectionLimit = 1;
					return;
				} else {
					$scope.routeVisibility = false;
					$timeout(function () {
						$scope.routeVisibility = true;
					});
					delete $scope.selectRouteSettings.selectionLimit;
				}

				if ((new Date()).setHours(0, 0, 0, 0) < (new Date(contractDetail.contract_start_date).setHours(0, 0, 0, 0))) {
					swal('Contract not Started. Please select another Contract');
					if (typeof $scope.editBooking === 'undefined')
						$scope.oBooking.contract_id = '';
					return;
				}

				if ((new Date()).setHours(0, 0, 0, 0) > (new Date(contractDetail.contract_end_date).setHours(0, 0, 0, 0))) {
					swal('Contract Ended. Please select another Contract');
					if (typeof $scope.editBooking === 'undefined')
						$scope.oBooking.contract_id = '';
					return;
				}
			}

			if (!contractDetail) {
				$scope.aCustomerRoutes = [];
				$scope.routeVisibility = false;
				$timeout(function () {
					$scope.routeVisibility = true;
				});
				// $scope.selectRouteSettings.selectionLimit = 1;
				return;
			} else {
				$scope.routeVisibility = false;
				$timeout(function () {
					$scope.routeVisibility = true;
				});
				delete $scope.selectRouteSettings.selectionLimit;
			}

			//set payment basis and type and do_number according to contract
			$scope.oBooking.payment_type = contractDetail.payment_type;
			$scope.oBooking.payment_basis = contractDetail.payment_basis;
			$scope.oBooking.do_number = contractDetail.do_number || contractDetail.name;

			function success(response) {
				$scope.aCustomerRoutes = [];
				Array.prototype.push.apply($scope.aCustomerRoutes, response.data.map(function (obj) {
					return {
						route_name: obj.route_name,
						route_type: obj.route_type,
						route_distance: obj.route_distance,
						data: obj.data,
						routeData_id: obj._id,
						_id: obj.route__id
					}
				}));
			}

			var routeDataFilter = {
				all: true,
				contract__id: contractDetail._id
			};
			customer.getAllRouteDataOfContract(routeDataFilter, success);
		};

		$scope.addMoreContainer = function (c) {
			if ($scope.tempStoreContainerLength) {
				c.length = $scope.tempStoreContainerLength;
				$scope.tempStoreContainerLength = '';
			} else
				c.length = parseInt(c.length);
			$scope.oBooking.container.push(c);
		};

		/*
		* container pattern validation code
		* if containerType is container then only pattern should be matched
		* */
		$scope.handlePatternContainer = (function () {
			var regex = /^[a-zA-Z]{4}[0-9]{7}$/;
			return {
				test: function (value) {
					if ($scope.bookingForm.tempContainerType.$modelValue === "container") {
						return regex.test(value);
					} else {
						return true;
					}
				}
			};
		})();
		// ***************************transport route search **************
		$scope.getallroutes = function (viewValue) {
			if (viewValue && viewValue.toString().length > 1 || contractId) {

				return new Promise(function (resolve, reject) {

					Routes.getAllRoutes({name:viewValue}, oSuc, oFail);

					function oSuc(response) {
						resolve(response.data.data);
					}

					function oFail(response) {
						reject([]);
					}
				});
			} else
				return [];
		}

		//************************
		$scope.onRouteSelect = function (item) {
			$scope.oBooking.route = $scope.oBooking.route || [];

			if($scope.oBooking.route.find(o => o.name === item.name))
				return swal('Warning', 'route Already added!!!', 'warning');

			$scope.oBooking.route.push(item);
			$scope.oBooking.dummyrouteobj = '';
		}
		$scope.removeroute = function (select, index){
			$scope.oBooking.route.splice(index, 1);
		}
		//**********************************************************************

		/*
		* get Routes for filters in Multiple select dropdown with search
		* */


		$scope.getRoutes = function (inputModel, contractId) {
			if (inputModel.length <= 2 || contractId) {
				return;
			}

			function success(response) {

				$scope.aCustomerRoutes = [];

				if ($scope.oBooking.route.length > 0) {
					response.data.data = response.data.data.filter(obj => {
						return !$scope.oBooking.route.find(rObj => rObj._id === obj._id);
					});
					response.data.data.unshift(...$scope.oBooking.route)
				}

				Array.prototype.push.apply($scope.aCustomerRoutes, response.data.data.map(function (obj) {
					return {
						source: obj.source,
						destination: obj.destination,
						route_name: ($scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
							? (obj.source && obj.source.placeName) + ' (' + (obj.source && obj.source.placeAddress) + ')' + ' to ' + (obj.destination && obj.destination.placeName) + ' (' + (obj.destination && obj.destination.placeAddress) + ')'
							: obj.name || obj.route_name,
						route_type: obj.route_type || obj.route_type,
						route_distance: obj.route_distance || obj.route_distance,
						data: obj.data || obj.data,
						_id: obj._id || obj._id
					}
				}));
			}

			// if($scope.oBooking.route[0]) {
			// Routes.getAllRoutes({name: inputModel, 'source.placeName': $scope.oBooking.route[0].source.placeName}, success, err => {});
			// } else {
			Routes.getAllRoutes({name: inputModel}, success, err => {
			});
			// }
		};

		/*
		* get Trip Location for Routes
		* */
		$scope.getTripLocation = function (routeId) {
			function success(response) {
				$scope.aTripLocations = response.data.data;
			}

			var obj = {
				routes: routeId,
				all: true
			};
			bookingServices.getAllTripLocation(obj, success);
		};
		//transport route popup
		$scope.Addroute = function (){
			var modalInstance = $uibModal.open({
				templateUrl: 'views/myRoutes/registerRoutePopup.html',
				controller: ['$scope', '$uibModalInstance', transportRouteController],
				controllerAs: 'Ntr',
				resolve: {
				}
			});
		};
		function transportRouteController(
			$scope,
			$uibModalInstance,
		) {
			let vm = this;
			vm.closeModal = closeModal;
			vm.submit = submit;
			vm.onSelectSource = onSelectSource;
			vm.setRouteKm = setRouteKm;

			function closeModal() {
				$uibModalInstance.dismiss();
			}
			function onSelectSource() {
				setRouteKm();
			}

			function setRouteKm() {
				if (vm.source && vm.destination && vm.source.location && vm.destination.location) {
					if (google && google.maps && google.maps.DistanceMatrixService) {
						new google.maps.DistanceMatrixService()
							.getDistanceMatrix(
								{
									origins:  [vm.source.location],
									destinations: [vm.destination.location],
									travelMode: 'DRIVING',
								}, (response) => {
									console.log(response)
									if(response && Array.isArray(response.rows) && response.rows[0]){
										let element = response.rows[0].elements;
										vm.rKm = Math.round2(element[0].distance.value / 1000, 2);
										vm.rName = `${vm.source.c} to ${vm.destination.c}`
										$scope.$apply();
									}
								});
					}
				}
			}



				function submit(form) {
					if (!vm.source){
						return swal('Error',"Source is Mandatory", "error");
					}if(!vm.destination){
						return swal('Error',"Destination  is Mandatory", "error");
					}if(!vm.rName){
						return swal('Error',"Route is Mandatory", "error");
					}if(!vm.rKm){
						return swal('Error',"Route Km is  Mandatory", "error");
					}

						vm.source.placeName = vm.source.c;
						vm.source.placeAddress = vm.source.s;
						vm.destination.placeName = vm.destination.c;
						vm.destination.placeAddress = vm.destination.s;

						let regRouteNew={};
						regRouteNew.name = vm.rName;
						regRouteNew.source = vm.source;
						regRouteNew.destination = vm.destination;
						regRouteNew.route_distance = vm.rKm;
						Routes.saveRoute(regRouteNew, success, fail);


				function success(res) {
					if (res && res.data && res.data.status == "OK"){
					swal("success", res.data.message, "success");
					$uibModalInstance.close();
				} else if (res && res.data && res.data.status == "ERROR"){
						return  swal("Route Registration failed", res.data.message, "error");
					}else{
							return swal('Error',"Route Registration failed", "error");
						}
					}

				function fail(res) {
					return swal('Error',res.data.message, 'error');
				}
			};
		}
		/*
		* Prepare Geo Fence Location
		* */
		$scope.prepareGeoFenceLocation = function (geoFence) {
			return {
				"address": geoFence.obj.address,
				"name": geoFence.obj.name,
				"addr": geoFence.obj.address,
				"type": geoFence.type,
				"contact_person_name": geoFence.obj.contact_person_name,
				"contact_person_number": geoFence.obj.contact_person_number,
				"contact_person_email": geoFence.obj.email,
				"loc": geoFence.loc,
				"isCustomerLocation": geoFence.isCustomerLocation
			};
		};

		/*
		* it get the all vehicleType
		* */
		$scope.getVehicleType = function () {
			function suc(response) {

				/*
				* it map on each vehicle group's vehicle type
				* modify name by appending the vehicle group name at the last of the vehicle name
				* return array of object with two parameter with "name, _id"
				* if vehicle is trailer than an trailer & length key will come
				* if vehicle is trailer than trailer value will be true
				* */
				$scope.aVehicleTypesList = [];

				response.data.data.map(function (obj) {
					Array.prototype.push.apply($scope.aVehicleTypesList, obj.vehicle_types.map(function (subObj) {
						return {
							name: subObj.name + ' (' + obj.name + ')',
							trailer: subObj.trailer,
							length: subObj.length,
							_id: subObj._id,
						}
					}));
				});

				if ($scope.oBooking.booking_type.toLowerCase().indexOf('containerized') > -1) {
					$scope.aVehicleTypesList = $scope.aVehicleTypesList.filter(function (obj) {
						if (obj.trailer === true)
							return obj;
					});
				}
			}

			function fail(response) {
				console.log('failed', response);
			}

			Vendor.getGroupVehicleType(suc, fail);
		};

		$scope.onMaterialTypeChange = function (materialId) {
			var material_type = $scope.aMaterialType.find(m => m._id === materialId);
			$scope.material_type_name = material_type.name;
		};

		/*
		* Booking Submit
		* */
		$scope.submit = function () {

			if ($scope.disableSubmit)
				return;
			else
				$scope.disableSubmit = true;

			console.log($scope.oBooking);
			console.log($scope.bookingForm);
			// if($scope.oBooking.booking_type.toLowerCase().indexOf('empty') == -1 && $scope.oBooking.total_weight <= 0){
			// 	swal('Weight cannot be 0');
			// 	$scope.disableSubmit = false;
			// 	return ;
			// }

			// if($filter('GeoFenceValidation')($scope.oBooking.geofence_points)){
			// 	swal('Loading and Unloading points are required in Geo Fence Location');
			// 	$scope.disableSubmit = false;
			// 	return ;
			// }

			if ($scope.oBooking.container && $scope.oBooking.container.length > 0
			) {
				if ($scope.oBooking.boe) {
					if ($scope.oBooking.container.length !== $scope.oBooking.boe.total_container) {
						var str = $scope.oBooking.boe.total_container <= 1 ? 'item' : 'items';
						swal('Container List Should contain ' + $scope.oBooking.boe.total_container + ' ' + str);
						$scope.disableSubmit = false;
						return;
					}
				} else if ($scope.oBooking.container.length < 1) {
					swal('Container List Should contain 1 item');
					$scope.disableSubmit = false;
					return;
				}
			}

			if ($scope.bookingForm.$invalid) {
				swal('All Mandatory field are not filled');
				$scope.disableSubmit = false;
				return;
			}

			/*
			 * Response Preparation
			 * */

			/*
			* Route is Array of object but response require _id as string
			* */

			var oBooking = angular.copy($scope.oBooking);
			var routeId = $scope.oBooking && $scope.oBooking.route && $scope.oBooking.route.map(obj => obj._id);
			oBooking.route = {};
			oBooking.route = routeId;
			oBooking.routeData = $scope.oBooking && $scope.oBooking.route && $scope.oBooking.route[0] && $scope.oBooking.route[0].routeData_id;
			if ($scope.oBooking.route[0] && $scope.oBooking.route[0].source && $scope.oBooking.route[0].source.placeName) {
				oBooking.route_source = $scope.oBooking.route[0].source.placeName;
			}
			oBooking.customer = $scope.oBooking.customer._id;
			if ($scope.oBooking.billing_party) oBooking.billing_party = $scope.oBooking.billing_party._id;
			else oBooking.billing_party = undefined;
			if ($scope.oBooking.consignee)
				oBooking.consignee = $scope.oBooking.consignee.map(obj => obj._id);
			if ($scope.oBooking.consigner) oBooking.consigner = $scope.oBooking.consigner._id;
			else oBooking.consigner = undefined;
			if (oBooking.contract_id)
				oBooking.contract_id = $scope.oBooking.contract_id._id;

			oBooking.material_type_name = $scope.material_type_name;
			oBooking.total_expense = oBooking.total_expense || 0;
			oBooking.munshiyana = oBooking.munshiyana || 0;
			oBooking.advance = oBooking.advance || 0;
			oBooking.totWithMunshiyana = oBooking.totWithMunshiyana || 0;
			oBooking.toPay = oBooking.toPay || 0;
			oBooking['rate'] = oBooking.total_expense;
			oBooking['total'] = oBooking.totWithMunshiyana;
			if (oBooking.advance > oBooking.totWithMunshiyana) {
				$scope.disableSubmit = false;
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
			if (oBooking.newPreference) {
				oBooking.preference = [oBooking.newPreference];
			}
			if ($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)) {
				if (!(oBooking.ld && oBooking.uld)) {
					return swal('Error', 'Loading or Unloading point missing', 'error');
				}
			}
			if (oBooking.ld && oBooking.uld) {
				oBooking['rName'] = `${oBooking.ld.c} to ${oBooking.uld.c}`
			}
			if ($scope.intermediateRoute && $scope.intermediateRoute.length) {
				oBooking.imd = $scope.intermediateRoute;
			}
			if (typeof $scope.editBooking === 'undefined')
				bookingServices.addMyBooking(oBooking, success, failure);
			else if ($scope.editBooking)
				bookingServices.updateBooking(oBooking, success, failure);
			else
				swal("Invalid Mode", '', 'error');

			function success(response) {
				// console.log(response);
				if (typeof $scope.editBooking === 'undefined')
					swal("Booking Added Successfully");
				else if ($scope.editBooking)
					swal("Booking Updated Successfully");

				$state.go('booking_manage.bookings');
			}

			function failure(response) {
				swal(response.data.message, '', 'error');
				$scope.disableSubmit = false;
			}
		};

		/*
		* Edit/View Booking
		* if editBooking is true fields are editable else only viewable
		* */
		if ($stateParams.data) {
			$scope.oBooking = $stateParams.data;
			$scope.editBooking = $scope.oBooking.mode === 'View' ? false : true;
			$scope.oBooking.booking_date = new Date($scope.oBooking.booking_date);

			if ($scope.oBooking.boe && $scope.oBooking.boe.date)
				$scope.oBooking.boe.date = new Date($scope.oBooking.boe.date);

			$scope.oBooking.branch_id = $scope.oBooking.branch_id._id;
			if ($scope.oBooking.cha)
				$scope.oBooking.cha = $scope.oBooking.cha._id;
			if ($scope.oBooking.serve_start)
				$scope.oBooking.serve_start = new Date($scope.oBooking.serve_start);
			if ($scope.oBooking.serve_end)
				$scope.oBooking.serve_end = new Date($scope.oBooking.serve_end);
			if ($scope.oBooking.factory_invoice_date)
				$scope.oBooking.factory_invoice_date = new Date($scope.oBooking.factory_invoice_date);
			if ($scope.oBooking && $scope.oBooking.imd && $scope.oBooking.imd.length) {
				$scope.intermediateRoute = $scope.oBooking.imd;
			}
			if ($scope.oBooking.lDate) {
				$scope.oBooking.lDate = new Date($scope.oBooking.lDate);
			}
			if ($scope.oBooking.dDate) {
				$scope.oBooking.dDate = new Date($scope.oBooking.dDate);
			}
			if ($scope.oBooking.rate)
				$scope.oBooking.total_expense = $scope.oBooking.rate;
			if ($scope.oBooking.total)
				$scope.oBooking.totWithMunshiyana = $scope.oBooking.total;
			if ($scope.oBooking.advance > $scope.oBooking.totWithMunshiyana) {
				$scope.disableSubmit = false;
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
			$scope.getContract($scope.oBooking.customer);
			$scope.getCustomerRoutes($scope.oBooking.contract_id);
			// $scope.oBooking.preference = $scope.oBooking.preference.map(obj => obj._id);
			$scope.oBooking.newPreference = $scope.oBooking.preference && $scope.oBooking.preference[0] &&
				$scope.oBooking.preference[0]._id;
			$scope.oBooking.route = $scope.oBooking.route.map(obj => {
				return {
					route_name: obj.name,
					route_type: obj.route_type,
					route_distance: obj.route_distance,
					_id: obj._id
				};
			});

			if ($scope.oBooking.routeData)
				$scope.oBooking.route.data = $scope.oBooking.routeData.data;

			if (!$scope.oBooking.contract_id) {
				$scope.aCustomerRoutes = $scope.oBooking.route;
			}

			$scope.getVehicleType();

			// test
			$scope.selectRouteEvents.onSelectionChanged()
		}

		/*
		* set geo location points*/
		$scope.setGeoPoints = function (consigner) {
			$scope.oBooking.geofence_points = $scope.oBooking.geofence_points.filter(obj => obj.type !== 'Loading') || [];
			$scope.oBooking.geofence_points.push({
				type: 'Loading',
				name: consigner.name,
				loc: consigner.name,
				lng: consigner.lng,
				lat: consigner.lat,
				geozone: [{
					longitude: consigner.lng,
					latitude: consigner.lat
				}],
				address: consigner.address
			});
		};

		/*
		* set geo location points*/
		$scope.setGeoPointsOfConsignee = function (consignee) {

			$scope.oBooking.geofence_points = $scope.oBooking.geofence_points || [];
			$scope.oBooking.geofence_points = $scope.oBooking.geofence_points.filter(obj => obj.type !== 'Unloading');
			Array.prototype.push.apply($scope.oBooking.geofence_points, consignee.map(obj => {
				return {
					type: 'Unloading',
					name: obj.name,
					loc: obj.name,
					lng: obj.lng,
					lat: obj.lat,
					geozone: [{
						longitude: obj.lng,
						latitude: obj.lat
					}],
					address: obj.address
				};
			}));
		};

		/*
		* Get All Branches List
		* */
		(function getBranch() {
			if ($scope.$aBranch.length > 0) {
				$scope.aBranch = $scope.$aBranch;
				return;
			}
			var branchFilter = {
				all: true
			}
			branchService.getAllBranches(branchFilter, successBranches);

			function successBranches(data) {
				$scope.aBranch = data.data;
			}
		})();

		/*
		* Get all Customer List
		* */
		(function getAllCustomers() {
			function success(data) {
				$scope.aCustomers = data.data;
				if($scope.$configs.booking && $scope.$configs.booking.showCustId) {
					$scope.aCustomers.map((item)=>{
						item.name = item.name + '('+ item.customerId +')';
					});
				}
			}

			var customerFilter = {
				all: true,
				status: "Active"
			};
			customer.getAllcustomers(customerFilter, success);
		})();

		/*
		* Get Customer Type
		* */
		function getCustomerByType(aCustomerType, success) {
			var details = {
				type: JSON.stringify(aCustomerType),
				all: true,
				status: "Active"
			};
			// customer: $scope.oBooking.customer._id
			bookingServices.getAllCustomersforDetails(details, success);
		}

		function getMaterialGroup() {
			var materialFilter = {
				all: true
			};

			materialService.getMaterialGroups(materialFilter, success);

			function success(response) {
				$scope.aMaterialType = response.data;
			}
		}

		/*
		* Get Material Group
		* */
		// (function getMaterialGroup() {
		// 	function success(response) {
		// 		$scope.aMaterialType = [];
		// 		response.data.data.map(function (obj) {
		// 			Array.prototype.push.apply($scope.aMaterialType, obj.material_types.map(function(subObj){
		// 				return {
		// 					name: subObj.name + '(' + obj.code + ')',
		// 					_id: subObj._id
		// 				};
		// 			}));
		// 		});
		// 	}
		// 	var materialFilter = { all: true };
		// 	materialService.getAllMaterial(materialFilter, success);
		// })();
	});


materialAdmin.filter('calculateProgress', function () {
	return function (input) {
		try {
			switch (input.payment_basis) {

				case 'PMT':
					return Math.round((input.total_weight ? ((input.served.servedWeight || 0) / (input.total_weight || 1)) * 100 : 0) * 100) / 100;
					break;

				case 'PUnit':
					return Math.round((input.total_no_of_units ? ((input.served.servedUnit || 0) / (input.total_no_of_units)) * 100 : 0) * 100) / 100;
					break;

				default:
					return Math.round((input.total_weight ? ((input.served.servedWeight || 0) / (input.total_weight)) * 100 : 0) * 100) / 100;
			}
		} catch (e) {
			return 0;
		}
	}
});

materialAdmin.filter('removeAlreadySelectedLocations', function () {
	return function (allLocations, selectedLocations) {
		if (!allLocations)
			return [];

		selectedLocations.map(obj => obj.name).map(function (val) {
			var temp = allLocations.map(obj => obj.name).indexOf(val);
			if (temp !== -1)
				allLocations.splice(temp, 1);
		});

		return allLocations;
	}
});

materialAdmin.controller("myBookingCommonController", function (
	$localStorage,
	$rootScope,
	$scope,
	$state,
	$stateParams,
	bookingServices,
	branchService,
	customer,
	$uibModal,
	Pagination,
	ReportService,
	URL,
	growlService,
	DatePicker,
	$modal,
) {
	$scope.pagination = Pagination;
	$scope.myFilter = {};
	$scope.oFilter = {};

	$rootScope.forUpdateBooking = {};
	var lastFilter;

	$scope.DatePicker = angular.copy(DatePicker);

	$scope.pagination.pageChanged = function () {
		$scope.getBooking(true);
	};

	if ($localStorage.ft_data.userLoggedIn) {
		$rootScope.logInUser = $localStorage.ft_data.userLoggedIn;
	}

	$rootScope.configs = $localStorage.ft_data.configs;
	$scope.pagination.maxSize = 5;
	$scope.pagination.items_per_page = 8;

	$scope.uploadFiles = function () {
		var aAllowedFiles = ['Rate Chart Approval', 'Overweight Approval', 'Other'];
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					scopeModel: $scope.selectedBookingInfo,
					scopeModelId: $scope.selectedBookingInfo._id,
					uploadText: "Upload Booking Documents",
					aAllowedFiles: aAllowedFiles,
					uploadFunction: bookingServices.updateBooking
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	};

	$scope.previewDocs = function () {
		if (!Array.isArray($scope.selectedBookingInfo.documents) || $scope.selectedBookingInfo.documents.length < 1) {
			growlService.growl("No documents to preview", "warning");
			return;
		}

		var documents = $scope.selectedBookingInfo.documents.map(curr => ({
			...curr,
			url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		}));

		var modalInstance = $uibModal.open({
			templateUrl: 'views/carouselPopup.html',
			controller: 'carouselCtrl',
			resolve: {
				documents: function () {
					return documents;
				}
			}
		});
	};

	$scope.goToTrips = function () {
		if ($scope.selectedBookingInfo && $scope.selectedBookingInfo.served && $scope.selectedBookingInfo.served.grs) {
			$state.go('booking_manage.myTrips', {data: {grs: $scope.selectedBookingInfo.served.grs}});
		}
	};

	// *** Booking Get Service with Search Fields *** //
	function prepareFilterObject(isPagination) {
		var myFilter = {};
		if ($scope.oFilter.booking && $scope.oFilter.booking.length <= 5) {
			myFilter.booking_no = $scope.oFilter.booking;
		} else if ($scope.oFilter.booking && $scope.oFilter.booking.length > 5) {
			myFilter.bookingId = $scope.oFilter.booking;
		}
		if ($scope.oFilter.bookingType) {
			myFilter.booking_type = $scope.oFilter.bookingType;
		}
		if ($scope.oFilter.boe_no) {
			myFilter.boe_no = $scope.oFilter.boe_no;
		}
		if ($scope.oFilter.bookingCustomer && $scope.oFilter.bookingCustomer.name) {
			myFilter.customer_id = $scope.oFilter.bookingCustomer._id;
		}
		if ($scope.oFilter.branch) {
			myFilter.branch = $scope.oFilter.branch;
		}
		if ($scope.oFilter.start_date) {
			myFilter.start_date = $scope.oFilter.start_date;
		}
		if ($scope.oFilter.end_date) {
			myFilter.end_date = $scope.oFilter.end_date;
		}
		if ($scope.oFilter.containerNumber) {
			myFilter['container.number'] = $scope.oFilter.containerNumber;
		}
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}

		myFilter.no_of_docs = $scope.pagination.items_per_page;
		myFilter.sort = {
			$natural: -1
		};
		return myFilter;
	}

	$scope.setTime = function () {
		if ($scope.start_date)
			$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
		if ($scope.end_date)
			$scope.end_date = new Date($scope.end_date.setHours(23, 59, 59)); //sets hour minutes & sec on selected date
	};

	$scope.getBooking = function (isPagination) {
		function successBooking(data) {
			if (data.data && data.data.data) {
				setTimeout(function () {
					listItem = $($('.selectItem')[0]);
					listItem.addClass('grn');
				}, 500);
				$scope.aBookings = data.data.data;
				$scope.selectedBookingInfo = $scope.aBookings[0];
				$scope.pagination.total_pages = data.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = data.data.count;
			}
		}

		function failureBooking(res) {
			swal("Some error with GET booking.", "", "error");
		}

		if ($scope.oFilter.start_date && $scope.oFilter.end_date) {
			if ($scope.oFilter.start_date > $scope.oFilter.end_date) {
				return swal("warning", "End date should be greater than Start date", "warning");
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		bookingServices.getAllBookings(oFilter, successBooking, failureBooking);
	};

	$scope.clearSearch = function () {
		$scope.bookingCustomer = '';
		$scope.getCname($scope.bookingCustomer);
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data;
				if($scope.configs.booking && $scope.configs.booking.showCustId) {
					$scope.aCustomer.map((item)=>{
						item.name = item.name + '('+ item.customerId +')';
					});
				}
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCustomerSearch(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {
			$scope.pagination.currentPage = 1;
			//$stateParams.name = '';
			//var sUrl = "#!/masters/vendorRegistration/profile"+"/" +$scope.pagination.currentPage +"/";
			$scope.getBooking();
		}
		;
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.pagination.currentPage = 1;
		// $scope.getBooking();
	};

	//Booking Mode for Add or Edit //
	$scope.modeBooking = function (mode) {
		if (mode == 'Add') {
			$state.go('booking_manage.addorEditBooking', {data: null});
		} else if (mode == 'Edit') {
			$state.go('booking_manage.addorEditBooking', {data: $scope.selectedBookingInfo});
		} else if (mode == 'View') {
			$scope.selectedBookingInfo.mode = mode;
			$state.go('booking_manage.addorEditBooking', {data: $scope.selectedBookingInfo});
		}
	};

	$scope.deleteBooking = function () {

		if (!$scope.selectedBookingInfo._id)
			swal("Select at least one row", "", "error");

		swal({
				title: 'Do you want to Delete Booking?',
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

					bookingServices.deleteBooking({
						_id: $scope.selectedBookingInfo._id
					}, success, failure);

					function success(res) {
						console.log(res);
						swal('Success', res.data.message, 'success');
						$scope.getBooking();
					}

					function failure(res) {
						swal("Failed!", res.data.message, "error");
					}
				} else
					return;
			});
	}

	$scope.assTrafcMgr = function (oBooking) {
		if (!($scope.selectedBookingInfo)) {
			return swal("Select any one row", "", "error");
		}
		console.log('selectedBookingInfo', $scope.selectedBookingInfo);

		let selectedInfo = $scope.selectedBookingInfo;
		var modalInstance = $modal.open({
			templateUrl: 'views/myBookings/asignTrafcManagrModal.html',
			controller: 'assignTrafficMangerUpsertController'
			,
			resolve: {
				selectedInfo
			}
		});

		modalInstance.result.then(function (response) {
			if (response) {
				console.log('response', response);
				// $scope.account = response._id;
			}
			console.log('close', response);
		}, function (data) {
			$scope.getBooking();
			console.log('cancel');
		});
	}

	$scope.addQuotation = function (oBooking) {
		if (!(oBooking && oBooking._id)) {
			return swal("Select any one row", "", "error");
		}
		$state.go('booking_manage.quotation', {
			id: oBooking._id
		});
	}

	$scope.selectBooking = function (oBookingData, index) {
		$scope.selectedBookingInfo = oBookingData;
		listItem = $($('.selectItem')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');
	};

	$scope.allocationRedirect = function () {
		$rootScope.selectedBookingBaseInfo = $scope.selectedBookingInfo;
		$rootScope.showFieldsBooking = true;
		$rootScope.redirect('#!/booking_manage/vehicleAllcation/vehicleProvider');

	};


	//*** GET Branches List if branch not defined for that client *** //
	(function getBranch() {
		if ($scope.$aBranch.length > 0) {
			$scope.aBranches = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		}
		branchService.getAllBranches(branchFilter, successBranches);

		function successBranches(data) {
			$scope.aBranch = data.data;
		}
	})();

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.newDate = function (d) {
		return new Date(d);
	};
	$scope.today();
	$scope.toggleMin = function () {
		var date = new Date();
		var yesterday = date - 1000 * 60 * 60 * 24 * 2; // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
		$scope.minDate = new Date(yesterday);
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.downloadReport = function () {
		ReportService.getBookingReport(lastFilter, function (data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}
});

/*
* Geofence point validations
* */
materialAdmin.filter('GeoFenceValidation', function () {
	return function (input) {

		if (!input)
			return true;

		if (input.filter(obj => obj.type === 'Unloading' || obj.type === 'Loading').length != 2)
			return true;

		return false;
	};
});

/*
* Calculate Asking Rate for Booking
* */
materialAdmin.filter('calculateAskingRate', function () {
	return function (input) {
		if (!input) {
			return 'NA';
		}

		try {
			var daysInContract = ((new Date(input.contract_id.contract_end_date)) - (new Date(input.contract_id.contract_start_date))) / (24 * 60 * 60 * 1000);
			return ((input.total_weight - input.served.servedWeight) / (daysInContract * 25)).toFixed(2);
		} catch (e) {
			return "NA";
		}
	};
});


/*
* show prefered vehicle in booking table in "vehicleName(vehicleType)" format
* */
materialAdmin.filter('preferredVehicleArrayToArrayOfString', function () {
	return function (input) {
		if (!input)
			return 'NA';

		var returnObj;
		if (Array.isArray(input))
			return input.map(obj => obj.name + '(' + obj.group_name + ')');
		else
			return "NA";
	};
});

/*
* Assign the Traffic Manager Controller
*/
materialAdmin.controller('assignTrafficMangerUpsertController', function (
	$scope,
	selectedInfo,
	$uibModalInstance,
	DatePicker,
	userService,
	bookingServices,
	$localStorage,
) {
	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.getAllUsers = getAllUsers;


	// functions Identifiers
	$scope.submit = submit;
	$scope.loggedInUserName = $localStorage && $localStorage.ft_data && $localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.full_name;
	$scope.closeModal = closeModal;

	// INIT functions


	// Operations
	if (typeof oBooking !== 'undefined' && oBooking !== null) {
		$scope.oTest = angular.copy(oBooking); //initialize with param

	}
	if (selectedInfo && selectedInfo.tr_mgr && selectedInfo.tr_mgr[0]) {
		$scope.aTrafficManager = angular.copy(selectedInfo.tr_mgr);
	}
	if (selectedInfo) {
		$scope.isQuoteExist = selectedInfo.quote ? true : false;
	}

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAllUsers(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				userService.getUsers({all: true, full_name: viewValue, user_type: 'Trip Manager'}, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	}

	$scope.onSelectUser = function (item) {
		if (item) {
			if ($scope.aTrafficManager && $scope.aTrafficManager[0]) {
				for (const d of $scope.aTrafficManager) {
					if (d.full_name == item.full_name || d.name == item.full_name) {
						$scope.oFilter.trManager = '';
						return swal('Error!', `Please check ${item.full_name} has already add`, 'error');
					}
				}
			}
			$scope.aTrafficManager = $scope.aTrafficManager || [];
			$scope.aTrafficManager.push({
				assignBy: $scope.loggedInUserName,
				date: new Date(),
				...item
			});
			$scope.oFilter.trManager = '';
		}
	}

	$scope.removeUser = function (select, index) {
		$scope.aTrafficManager.splice(index, 1);
	}

	// add or modify traffic manager
	function submit(formData) {
		if (!selectedInfo) {
			return swal('Error!', 'Please select the row', 'error');
		}

		if (!$scope.aTrafficManager || $scope.aTrafficManager.length === 0) {
			return swal('Error!', 'Please select at least one Traffic Manager', 'error');
		}

		if (selectedInfo.quote) {
			return swal('Error!', 'If Quotation is finalize You cannot update it', 'error');
		}
		const tr_mgr = [];
		for (const d of $scope.aTrafficManager) {
			const obj = {};
			obj['name'] = d.full_name ? d.full_name : d.name;
			obj['user'] = d._id;
			obj['date'] = d.date;
			obj['assignBy'] = d.assignBy;
			obj['contact_no'] = d.contact_no;
			tr_mgr.push(obj);
		}
		if (formData.$valid) {
			bookingServices.updateTrafficMAnager({_id: selectedInfo._id, tr_mgr}, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log('fail', response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				if (response) {
					var msg = response.data.message;
					swal('Success', msg, 'success');
					$uibModalInstance.dismiss();
				}
			}
		}
	}

});
