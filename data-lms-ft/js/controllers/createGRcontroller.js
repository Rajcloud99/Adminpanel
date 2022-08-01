materialAdmin.controller("createGRController",
	function($filter,
			 $localStorage,
			 $rootScope,
			 $scope,
			 $state,
			 $stateParams,
			 $timeout,
			 bookingServices,
			 branchService,
			 clientConfig,
			 constants,
			 customer,
			 DatePicker,
			 materialService,
			 ReportService,
			 Routes,
			 Vendor,Vehicle,userService,$uibModal,createGRService
	){

		// Setting the DatePicker factory to scope for global use in controller and template
		$scope.DatePicker = DatePicker;
		// $scope.editBooking = 'undefined';

		if($localStorage.ft_data.configs && $localStorage.ft_data.configs.postBooking) {
			var toDay = new Date();
			var daysBack = $localStorage.ft_data.configs.postBooking;
			toDay.setDate(toDay.getDate() - daysBack);
			$scope.DatePicker.dateSettings.maxDate= new Date();
			$scope.DatePicker.dateSettings.minDate= new Date(toDay);
		}

		$scope.aTripX = [{}];
		$scope.oBooking = {};
		console.log($stateParams.data);

		// Default Select today's Date
		//moment($scope.oBooking.do_start).add($scope.configs['Bookings']['Add']['Field values']['Date Range'], 'day').format();
		$scope.oBooking.booking_date = new Date();

		$scope.addAnotherTrip = function() {
			$scope.aTripX.push({});
		};

		$scope.getMarketVehicleVendor = function(oTrip){
			Vendor.getTransportVendor({}, function success(data) {
				if(data.data && data.data.length>0){
					oTrip.aMarketVehVendors = data.data;
				}else{
					oTrip.aMarketVehVendors = [];
				}
				// $scope.getAllRegVehicle();
			}, function failure(data) {
				console.log(data);
			});
			//dataServices.loadCities();
		};

		$scope.vTypeChange = function (oTrip) {
			if(oTrip.vehicle_type==='Market'){
				$scope.getMarketVehicleVendor(oTrip);
			}else {
				$scope.aMarketVehVendors = [];
				$rootScope.selectedVendorInfo = {};
				$scope.getAllRegVehicle(oTrip);
			}
			$rootScope.aVehicleSelected = [];
		};

		function prepareFilterObject(oTrip){
			var myFilter = {};
			if($scope.oBooking.preference && $scope.oBooking.preference.length>0) {
				myFilter.veh_type = $scope.oBooking.preference;
			}
			if(oTrip.vendor && oTrip.vehicle_type === 'Market'){
				myFilter.vendor_id = oTrip.vendor._id;
			} else if(!oTrip.vendor && oTrip.vehicle_type === 'Market') {
				oTrip.aVehicleList = [];
			}
			myFilter.ownershipType = oTrip.vehicle_type;
			return myFilter;
		}

		$scope.removeTripGR = function(index) {
			$scope.aTripX.splice(index, 1);
		};

		$scope.getAllRegVehicle = function (oTrip) {
			if(!oTrip) return;
			function suc(response) {
				response.data.data.unshift({
					'_id':  "addNewVehicle",
					'vehicle_reg_no': "Add New Vehicle"
				});
				oTrip.aVehicleList = response.data.data;
				if(!oTrip.vendor && oTrip.vehicle_type === 'Market') {
					oTrip.aVehicleList = [];
				}
			}
			function fail(response) {
				console.log('failed', response);
			}

			var object = prepareFilterObject(oTrip);
			object.ne_category="Trailer";
			object.status='Available';
			Vehicle.getAllregList(object, suc, fail);
		};
		$scope.getAllRegVehicle();

		$scope.addMvehicle = function (oTrip) {
			if(oTrip.vehicle._id === "addNewVehicle") {
				oTrip.vehicle = null;
				$rootScope.selectedVendorInfo = oTrip.vendor;
				var modalInstance = $uibModal.open({
					templateUrl: 'views/vehicleAllcation/addNewMvehicle.html',
					controller: 'addNewMvehicleCtrl',
					resolve: {
						thatData: function () {
							return $rootScope.selectedVendorInfo;
						}
					}
				});
				modalInstance.result.then(function (res) {
					oTrip.aVehicleList.push(res);
					oTrip.vehicle = res;
					// oTrip.vehicle_no = res.vehicle_reg_no;
				}, function (data) {
					if (data != 'cancel') {
						swal("Oops!", data.message, "error");
					}
				});
			}
		};

		$scope.shouldShowAddVehicle = function(oTrip) {
			return function(vehicle) {
				return oTrip.vehicle_type === 'Market' ? true : vehicle._id !== 'addNewVehicle';
			};
		};

		$scope.getLoadingBabu = function() {
			userService.getUsers({user_type: 'Loading Babu', all: 'true'}, (res) => {
				$scope.aLoadingBabus = res.data;
			}, (err) => {});
		};
		$scope.getLoadingBabu();

		$scope.getAllTripManagers = function(){
			function succGetUsers(response){
				if(response.data && response.data.length>0){
					$scope.aTripManagers = response.data;
				}
			}
			function failGetUsers(response){
				console.log(response);
			}
			userService.getUsers({all:true,user_type:'Trip Manager'},succGetUsers,failGetUsers);
		};
		$scope.getAllTripManagers();

		$scope.vendorDealPopup = function (oTrip) {
			$rootScope.Allocate = oTrip;
			$rootScope.selectedVendorInfo = oTrip.vendor;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/vehicleAllcation/addPaymentDealData.html',
				controller: 'addPaymentDealDataCtrl',
				resolve: {
					thatData: $rootScope.Allocate,
					selectedVendor: $rootScope.selectedVendorInfo
				}
			});

			modalInstance.result.then(function () {
				$state.reload();
			}, function (data) {
				if (data != 'cancel') {
					swal("Oops!", data.message, "error")
				}
			});
		};

		/*
        * Setting default value
        * Multi Select with Search Dropdown Settings
        * */
		$scope.oBooking.route=[];
		$scope.aCustomerRoutes=[];
		$scope.selectRouteSettings = {
			displayProp: "route_name",
			enableSearch: true,
			searchField: 'route_name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
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
				$scope.getTripLocation($scope.oBooking.route[0]._id);
				var routeData = $scope.oBooking.route.data || $scope.oBooking.route[0].data;

				/*if(typeof $scope.editBooking !== 'undefined')
                    routeData = $scope.oBooking.route.data;*/

				if(typeof routeData !== 'undefined'){
					/*
                    * Filter Contract's vehicle
                    * Remove non required elements
                    * Transform array object to [{name:'vehicle_type(vehicle_group_name)',_id:''}]
                    * */
					$scope.aRouteVehicleTypeList = [];
					Array.prototype.push.apply($scope.aRouteVehicleTypeList,routeData.filter(function (obj) {
						if(obj.booking_type === $scope.oBooking.booking_type)
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
					$scope.oBooking.preference = (($scope.oBooking.preference || {}).length > 0) ? $scope.oBooking.preference : $scope.aRouteVehicleTypeList.map(obj => obj._id);
				}
			}
		};

		/*
        * Get All Contract
        * */
		($scope.getContract = function(customerDetail) {
			if(!customerDetail)
				return;

			/*
            * Fetch Consignor, Consignee, Billing party form Backend
            * */
			getCustomerByType(['Consignor'], function(data){
				$scope.aConsigner = data.data;
				if(customerDetail.type.indexOf('Consignor') > -1)
					$scope.aConsigner.push(customerDetail);
			});
			getCustomerByType(['Consignee'], function(data){
				$scope.aConsignee = data.data;
				if(customerDetail.type.indexOf('Consignee') > -1)
					$scope.aConsignee.push(customerDetail);
			});
			getCustomerByType(['Billing party'], function(data){
				$scope.aBiller = data.data;
				if(customerDetail.type.indexOf('Billing party') > -1)
					$scope.aBiller.push(customerDetail);
			});
			getCustomerByType(['CHA'], function(data){
				$scope.aCha = data.data;
				if(customerDetail.type.indexOf('CHA') > -1)
					$scope.aCha.push(customerDetail);
			});

			function success(data) {
				$scope.aContracts = data.data.length!==0 ? data.data : [{}];

				/*
                * In case of edit booking don't run below code
                * */
				if(typeof $scope.editBooking !== 'undefined')
					return;

				$scope.oBooking.contract_id = $scope.aContracts.find(obj => obj._id === customerDetail.active_contract__id);
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
		$scope.getCustomerRoutes = function(contractDetail) {
			if(typeof $scope.editBooking === 'undefined')
				$scope.oBooking.route=[];

			if(typeof $scope.editBooking === 'undefined'){ //&& contractDetail
				if(!contractDetail)
					return;

				if((new Date()).setHours(0,0,0,0) < (new Date(contractDetail.contract_start_date).setHours(0,0,0,0))){
					swal('Contract not Started. Please select another Contract');
					if(typeof $scope.editBooking === 'undefined')
						$scope.oBooking.contract_id = '';
					return;
				}

				if((new Date()).setHours(0,0,0,0) > (new Date(contractDetail.contract_end_date).setHours(0,0,0,0))){
					swal('Contract Ended. Please select another Contract');
					if(typeof $scope.editBooking === 'undefined')
						$scope.oBooking.contract_id = '';
					return;
				}
			}

			if(!contractDetail){
				$scope.aCustomerRoutes=[];
				return;
			}

			//set payment basis and type and do_number according to contract
			$scope.oBooking.payment_type = contractDetail.payment_type;
			$scope.oBooking.payment_basis = contractDetail.payment_basis;
			$scope.oBooking.do_number = contractDetail.do_number || contractDetail.name;

			function success(response) {
				$scope.aCustomerRoutes = [];
				Array.prototype.push.apply($scope.aCustomerRoutes,response.data.map(function (obj) {
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
			if($scope.tempStoreContainerLength){
				c.length = $scope.tempStoreContainerLength;
				$scope.tempStoreContainerLength = '';
			}else
				c.length = parseInt(c.length);
			$scope.oBooking.container.push(c);
		};

		/*
        * container pattern validation code
        * if containerType is container then only pattern should be matched
        * */
		$scope.handlePatternContainer = (function() {
			var regex = /^[a-zA-Z]{4}[0-9]{7}$/;
			return {
				test: function(value) {
					if ($scope.bookingForm.tempContainerType.$modelValue === "container") {
						return regex.test(value);
					} else {
						return true;
					}
				}
			};
		})();

		/*
        * get Routes for filters in Multiple select dropdown with search
        * */
		$scope.getRoutes = function(inputModel, contractId){
			if(inputModel.length <= 2 || contractId)
				return;
			function success(response){

				$scope.aCustomerRoutes = [];
				Array.prototype.push.apply($scope.aCustomerRoutes,response.data.data.map(function (obj) {
					return {
						route_name: obj.name,
						route_type: obj.route_type,
						route_distance: obj.route_distance,
						data: obj.data,
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
				routes: routeId,
				all: true
			};
			bookingServices.getAllTripLocation(obj, success);
		};

		/*
        * Prepare Geo Fence Location
        * */
		$scope.prepareGeoFenceLocation = function(geoFence){
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
		$scope.getVehicleType = function(){
			function suc(response){

				/*
                * it map on each vehicle group's vehicle type
                * modify name by appending the vehicle group name at the last of the vehicle name
                * return array of object with two parameter with "name, _id"
                * if vehicle is trailer than an trailer & length key will come
                * if vehicle is trailer than trailer value will be true
                * */
				$scope.aVehicleTypesList = [];

				response.data.data.map(function(obj){
					Array.prototype.push.apply($scope.aVehicleTypesList,obj.vehicle_types.map(function (subObj) {
						return {
							name: subObj.name + ' (' + obj.name + ')',
							trailer: subObj.trailer,
							length: subObj.length,
							_id: subObj._id,
						}
					}));
				});

				if($scope.oBooking.booking_type.toLowerCase().indexOf('containerized') > -1){
					$scope.aVehicleTypesList = $scope.aVehicleTypesList.filter(function (obj) {
						if(obj.trailer === true)
							return obj;
					});
				}
			}
			function fail(response){
				console.log('failed',response);
			}
			Vendor.getGroupVehicleType(suc, fail);
		};

		/*
        * Booking Submit
        * */
		$scope.submit = function () {

			if($scope.disableSubmit) return;
			else $scope.disableSubmit=true;

			if($scope.bookingForm.$invalid){
				swal('All Mandatory field are not filled');
				$scope.disableSubmit = false;
				return;
			}

			if($scope.oBooking.container && $scope.oBooking.container.length > 0){
				if($scope.oBooking.boe){
					if($scope.oBooking.container.length !== $scope.oBooking.boe.total_container ) {
						var str = $scope.oBooking.boe.total_container <= 1 ? 'item' : 'items';
						swal('Container List Should contain ' + $scope.oBooking.boe.total_container + ' ' + str);
						$scope.disableSubmit = false;
						return;
					}
				}else if($scope.oBooking.container.length < 1){
					swal('Container List Should contain atleast 1 item');
					$scope.disableSubmit = false;
					return;
				}
			}

			var booking = angular.copy($scope.oBooking);
			var trips = angular.copy($scope.aTripX);

			var routeId = $scope.oBooking.route[0]._id;
			booking.billing_party = booking.billing_party._id;
			if(booking.consignee) {
				booking.consignee = booking.consignee._id;
			}
			if(booking.consigner) {
				booking.consigner = booking.consigner._id;
			}
			booking.customer = booking.customer._id;
			booking.route = {};
			booking.route = routeId;
			// booking.routeData =  $scope.oBooking.route[0].routeData_id;
			if(booking.contract_id) {
				booking.contract_id = $scope.oBooking.contract_id._id;
			}

			var totalOfTrips = 0;
			var vendorDealErr = false;
			trips = trips.map(function (trip) {
				delete trip.aMarketVehVendors;
				delete trip.aVehicleList;
				trip.gr = [{
					branch: booking.branch_id,
					weight: trip.weight||0,
					container: booking.container||[]
				}];
				trip.vehicle_no = trip.vehicle.vehicle_reg_no;
				trip.vehicle = trip.vehicle._id;
				trip.driver_name = 'unknown';
				trip.branch = booking.branch_id;
				trip.route = booking.route;
				trip.route_name = $scope.oBooking.route[0].route_name;
				trip.trip_manager = booking.trip_manager;
				trip.allocation_date = new Date();
				if(booking.loading_babu) {
					trip.loading_babu = booking.loading_babu;
				}
				if(trip.vendor) {
					trip.vendor = trip.vendor._id;
				}
				if(trip.vehicle_type === 'Market') {
					if(!trip.vendorDeal) {
						vendorDealErr = true;
					}
					if(trip.vendorDeal && !trip.vendorDeal.doneDeal) {
						vendorDealErr = true;
					}
				}
				totalOfTrips+=(trip.weight||0);
				return trip;
			});

			if(totalOfTrips > $scope.oBooking.total_weight) {
				swal('Total weight of Trip/GR cannot be greater than total weight specified in booking');
				$scope.disableSubmit = false;
				return;
			}

			if(vendorDealErr) {
				swal('Please specify vendordeal in market vehicles');
				$scope.disableSubmit = false;
				return;
			}

			delete booking.trip_manager;
			delete booking.loading_babu;

			console.log('booking',booking);
			console.log('trips',trips);

			createGRService.add({booking:booking, trips:trips}, function(response) {
				console.log(response);
				swal("Trip/GR Added Successfully");
				$state.go('booking_manage.bookings');
			}, function failure(response) {
				swal(response.data.message,'','error');
				$scope.disableSubmit=false;
			});

		};

		/*
        * Edit/View Booking
        * if editBooking is true fields are editable else only viewable
        * */
		if($stateParams.data){
			$scope.oBooking = $stateParams.data;
			$scope.editBooking = $scope.oBooking.mode === 'View' ? false : true ;
			$scope.oBooking.booking_date = new Date($scope.oBooking.booking_date);

			if($scope.oBooking.boe && $scope.oBooking.boe.date)
				$scope.oBooking.boe.date = new Date($scope.oBooking.boe.date);

			$scope.oBooking.branch_id = $scope.oBooking.branch_id._id;
			if($scope.oBooking.cha)
				$scope.oBooking.cha = $scope.oBooking.cha._id;
			if($scope.oBooking.serve_start)
				$scope.oBooking.serve_start = new Date($scope.oBooking.serve_start);
			if($scope.oBooking.serve_end)
				$scope.oBooking.serve_end = new Date($scope.oBooking.serve_end);
			if($scope.oBooking.factory_invoice_date)
				$scope.oBooking.factory_invoice_date = new Date($scope.oBooking.factory_invoice_date);
			$scope.getContract($scope.oBooking.customer);
			$scope.getCustomerRoutes($scope.oBooking.contract_id);
			$scope.oBooking.preference = $scope.oBooking.preference.map(obj => obj._id);
			$scope.oBooking.route= [{
				route_name: $scope.oBooking.route.name,
				route_type: $scope.oBooking.route.route_type,
				route_distance: $scope.oBooking.route.route_distance,
				_id: $scope.oBooking.route._id
			}];

			if($scope.oBooking.routeData)
				$scope.oBooking.route.data= $scope.oBooking.routeData.data;

			if(!$scope.oBooking.contract_id){
				$scope.aCustomerRoutes = $scope.oBooking.route;
			}

			$scope.getVehicleType();

			// test
			$scope.selectRouteEvents.onSelectionChanged()
		}

		/*
        * Get All Branches List
        * */
		(function getBranch(){
			if($scope.$aBranch.length > 0){
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

		/*
        * Get Material Group
        * */
		(function getMaterialGroup() {
			function success(response) {
				$scope.aMaterialType = [];
				response.data.data.map(function (obj) {
					Array.prototype.push.apply($scope.aMaterialType, obj.material_types.map(function(subObj){
						return {
							name: subObj.name + '(' + obj.code + ')',
							_id: subObj._id
						};
					}));
				});
			}
			var materialFilter = { all: true };
			materialService.getAllMaterial(materialFilter, success);
		})();
	});
