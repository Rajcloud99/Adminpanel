materialAdmin.controller("vehicleAllcateController",
	function (
		$rootScope,
		$parse,
		$scope,
		$location,
		$timeout,
		$uibModal,
		$modal,
		$localStorage,
		$state,
		branchService,
		DatePicker,
		Driver,
		FleetService,
		Routes,
		Vehicle,
		$stateParams,
		DateUtils,
		bookingServices,
		customer,
		Pagination,
		vehicleAllcationService,
		Vendor,
		userService,
		cityStateService,
		tripServices) {

		/*if(!$rootScope.selectedBookingBaseInfo) {
			$state.go('booking_manage.bookings', {}, {reload: true});
			return;
		}*/

		$("p").text("Vehicle Allcation");
		$scope.getAllBranch = getAllBranch;
		(function init() {
		
		// for stc if broker is using then category will be transporter by default prefilled
		if($scope.$user && $scope.$user.user_type && $scope.$user.user_type.length && $scope.$user.user_type.indexOf('Broker')+1) {
			$scope.isBroker = true;
		}
			$scope.vehiclePagination = angular.copy(Pagination);
			$scope.bookingPagination = angular.copy(Pagination);
		})();

		$scope.vehiclePagination = angular.copy(Pagination);
		$scope.bookingPagination = angular.copy(Pagination);
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		$rootScope.currentPath = $location.path();

		if ($rootScope.currentPath === '/booking_manage/vehicleAllcation/vehicleProvider') {
		} else {
			$rootScope.redirect('#!/booking_manage/vehicleAllcation/vehicleProvider');
		}

		if ($rootScope.showFieldsBooking === false) {
			$rootScope.selectedBookingBaseInfo = {};
		} else {
			$rootScope.showFieldsBooking = false;
		}


		// we will store all of our form data in this object
		$scope.formDataSelected = {};
		$scope.filterObj = {};
		$scope.filterObj.vehicleSts = "Available";
		$scope.filterObjForVendor = {};
		$rootScope.aVehicleSelected = [];
		$scope.formDataSelected.allocation_date = new Date();
		$scope.vendorDealPopUp = vendorDealPopUp;
		$scope.grDetailPopup = grDetailPopup;
		$scope.getAllRoute = getAllRoute;
		$scope.time={};

		$scope.time.aHours = [];
		$scope.time.aMinutes = [];

		for (let h = 0; h < 24; h++)
		$scope.time.aHours.push(h);

		for (let m = 0; m < 60; m++)
		$scope.time.aMinutes.push(m);

		$scope.time.hourSel1 = new Date().getHours();
		$scope.time.minuteSel1 = new Date().getMinutes();

		$scope.time.hourSel2 = new Date().getHours();
		$scope.time.minuteSel2 = new Date().getMinutes();

		$scope.shh = new Date().getHours();
		$scope.smm = new Date().getMinutes();
		$scope.ehh = new Date().getHours();
		$scope.emm = new Date().getMinutes();
		/*
		* Multi Select with Search Dropdown Settings
		* */
		$scope.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};

		/*
		* Multi Select with Search Dropdown Events*/
		$scope.selectEvents = {
			onSelectionChanged: function () {
				$scope.getMarketVehicleVendor(true);
			}
		};

		/*
		* Get all Vehicle Types of Particular Client for filters in Multiple select dropdown*/
		(function getGroupVehicleType() {
			function suc(response) {

				/*
				* it map on each vehicle group's vehicle type
				* modify name by appending the vehicle group name at the last of the vehicle name
				* return array of object with two parameter with "name, _id"
				* */
				$scope.vehicleTypes = [];
				response.data.data.map(function (obj) {
					Array.prototype.push.apply($scope.vehicleTypes, obj.vehicle_types.map(function (subObj) {
						return {
							name: subObj.name + '(' + obj.name + ')',
							_id: subObj._id
						}
					}));

				});
				if ($rootScope.selectedBookingBaseInfo && $rootScope.selectedBookingBaseInfo.preference) {
					if (!$scope.filterObjForVendor.vehicleType) {
						$scope.filterObjForVendor.vehicleType = [];
					}
					if (!$scope.filterObj.veh_type) {
						$scope.filterObj.veh_type = [];
					}
					for (var b = 0; b < $rootScope.selectedBookingBaseInfo.preference.length; b++) {
						for (var t = 0; t < $scope.vehicleTypes.length; t++) {
							if ($scope.vehicleTypes[t]._id === $rootScope.selectedBookingBaseInfo.preference[b]._id) {
								$scope.filterObjForVendor.vehicleType.push($scope.vehicleTypes[t]);
								$scope.filterObj.veh_type.push($scope.vehicleTypes[t]);
								console.log($scope.filterObj);
							}
						}
					}
				}
			}

			function fail(response) {
				console.log('failed', response);
			}

			Vendor.getGroupVehicleType(suc, fail);
		})();
		//get route
		function getAllRoute(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {


					Routes.getName(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}

			return [];
		}
		/*
		* get Routes for filters in Multiple select dropdown with search
		* */
		$scope.getRoutes = function (inputModel) {
			if (inputModel.length <= 2)
				return;

			function success(response) {
				$scope.aRoute = response.data.data;
			}

			function failure(response) {
				console.log(response);
			}

			Routes.getAllRoutes({name: inputModel}, success, failure);
		};
		//Get Transport vendor list*/
		$scope.getMarketVehicleVendor = function (viewValue = '') {

			if (viewValue.length <= 2)
				return [];

			return new Promise(function (resolve, reject) {

				var oFilter = {
					or: {
						value: viewValue,
						in: ['name', 'pan_no']
					},
					no_of_docs: 10,
					deleted: false
				};

				Vendor.getTransportVendor(oFilter, success, failure);

				function success(data) {
					resolve(data.data || []);
				}

				function failure(data) {
					console.log(data);
					reject([]);
				}
			});
		};


		$scope.onVendorSelect = function ($item, $model, $label) {
			$rootScope.selectedVendorInfo = $item;
		};

		$scope.vTypeChange = function (value) {
			$rootScope.aVehicleSelected = [];
			$rootScope.selectedVendorInfo = '';
			$scope.filterObj = {
				vehicleSts: 'Available',
			};
		};

		$scope.selectVehVendor = function (mVendorData, index) {
			$rootScope.selectedVendorInfo = mVendorData;
			listItem = $($('.selectItem')[index]);
			listItem.siblings().removeClass('grn');
			listItem.addClass('grn');
			//$rootScope.getAllRegVehicle();
		};

		$scope.clearAllSearchFilterVendor = function () {
			$scope.filterObjForVendor = {};
		};

		$scope.getVname = function (viewValue) {

			if (viewValue.length <= 2)
				return;
			$rootScope.getAllRegVehicle();

		};

		//end vehicle search

		//***
		// prepare filter object to send for vehicle search
		//***
		function prepareFilterObject(isPagination) {
			var myFilter = {};

			if ($scope.filterObj.veh_type && $scope.filterObj.veh_type.length > 0)
				myFilter.veh_type = $scope.filterObj.veh_type.map(obj => obj._id);
			if ($scope.filterObj.vehicleNum)
				myFilter.vehicle_no = $scope.filterObj.vehicleNum;

			if ($scope.filterObj.vehicleSts)
				myFilter.status = $scope.filterObj.vehicleSts;

			if (isPagination && $scope.vehiclePagination.currentPage) {
				myFilter.skip = $scope.vehiclePagination.currentPage;
			}

			myFilter.ownershipType = $scope.formDataSelected.vehicle_type;

			if ($rootScope.selectedVendorInfo) {
				myFilter.vendor_id = $rootScope.selectedVendorInfo._id;
			}
			if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show) {
				if($scope.finalQuotData && $scope.finalQuotData.vendor) {
					myFilter.vendor_id = $scope.finalQuotData && $scope.finalQuotData.vendor._id;
				}
			}
			myFilter.no_of_docs = $scope.vehiclePagination.items_per_page;

			// myFilter.deleted = false;

			return myFilter;
		}

		$scope.clearAllSearchFilterVehicle = function () {
			$scope.filterObj = {};
		};

		$scope.AddMvehicle = function () {
			$rootScope.selectedVendorInfo = $rootScope.selectedVendorInfo;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/vehicleAllcation/addNewMvehicle.html',
				controller: 'addNewMvehicleCtrl',
				resolve: {
					thatData: function () {
						return $rootScope.selectedVendorInfo;
					}
				}
			});

			modalInstance.result.then(function () {
				// $state.reload();
			}, function (data) {
				if (data != 'cancel') {
					swal("Oops!", data.message, "error")
				}
			});
		};

		$scope.reloadVehicleGet = function () {
			$rootScope.getAllRegVehicle();
		};

		$scope.showSelectedVehicle = function () {
			$rootScope.aVehicleSelected = $rootScope.aVehicleSelected;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/vehicleAllcation/showSelectedVehicleList.html',
				controller: 'showVehicleListCtrl',
				resolve: {
					thatData: function () {
						return $rootScope.aVehicleSelected;
					}
				}
			});

			modalInstance.result.then(function () {
				$state.reload();
			}, function (data) {
				$scope.aVehicleList = $scope.aVehicleList.map(obj => {
					if ($rootScope.aVehicleSelected.findIndex(selObj => selObj._id === obj._id) !== -1)
						obj.select = true;
					else
						obj.select = false;
					return obj;
				});
				if (data != 'cancel') {
					swal("Oops!", data.message, "error")
				}
			});
		};

		// *** Booking Get Service with Search Fields *** //
		$scope.sFilter = {};

		function prepareFilterObjectForBooking(isPagination) {
			var myFilter = {};
			console.log('selecBook', $rootScope.selectedBookingBaseInfo);
			if ($rootScope.selectedBookingBaseInfo && $rootScope.selectedBookingBaseInfo.route_source) {
				myFilter.route_source = $rootScope.selectedBookingBaseInfo.route_source;
			}
			if ($scope.sFilter.booking && $scope.sFilter.booking.length <= 5) {
				myFilter.booking_no = $scope.sFilter.booking;
			} else if ($scope.sFilter.booking && $scope.sFilter.booking.length > 5) {
				myFilter.bookingId = $scope.sFilter.booking;
			}
			if ($scope.sFilter.bookingType) {
				myFilter.booking_type = $scope.sFilter.bookingType;
			}
			if ($scope.sFilter.boe_no) {
				myFilter.boe_no = $scope.sFilter.boe_no;
			}
			if ($scope.sFilter.bookingCustomer && $scope.sFilter.bookingCustomer.name) {
				myFilter.customer_id = $scope.sFilter.bookingCustomer._id;
			}
			if ($scope.sFilter.branch) {
				myFilter.branch = $scope.sFilter.branch;
			}
			if ($scope.start_date) {
				myFilter.start_date = $scope.sFilter.start_date;
			}
			if ($scope.sFilter.end_date) {
				myFilter.end_date = $scope.sFilter.end_date;
			}
			if ($scope.sFilter.searchBy) {
				myFilter.status = $scope.sFilter.searchBy;
			}
			if (isPagination && $scope.bookingPagination.currentPage) {
				myFilter.skip = $scope.bookingPagination.currentPage;
			}
			// if ($scope.sFilter.d) {
			// 	myFilter['uld.c'] = $scope.sFilter.d.c;
			// }
			// if ($scope.sFilter.s) {
			// 	myFilter['ld.c'] = $scope.sFilter.s.c;
			// }
			if ($scope.sFilter.route_id) {
				myFilter.route = $scope.sFilter.route_id._id;
			}


			myFilter.no_of_docs = $scope.bookingPagination.items_per_page;
			myFilter.sort = {$natural: -1};
			return myFilter;
		}

		$scope.clearSearch = function () {
			$scope.sFilter.bookingCustomer = '';
			$scope.getBooking($scope.sFilter.bookingCustomer);
		};

		($scope.getBooking = function (isPagination) {
			function successBooking(data) {
				if (data.data && data.data.data) {
					setTimeout(function () {
						listItem = $($('.selectItem')[0]);
						listItem.addClass('grn');
					}, 500);
					$scope.aBookings = data.data.data;
					$scope.aBookings = $scope.aBookings.map(function (obj) {
						if (obj.served && obj.served.servedContainer) {
							obj.served.servedContainer = [].concat.apply([], obj.served.servedContainer);
							for (var i = 0; i < obj.container.length; i++) {
								for (var j = 0; j < obj.served.servedContainer.length; j++) {
									if (obj.container[i]._id === obj.served.servedContainer[j].c_id) {
										obj.container[i].used = true;
									}
								}
							}

						}
						return obj;
					});
					$scope.selectedBookingInfo = $scope.aBookings[0];
					$scope.bookingPagination.total_pages = data.data.count / $scope.bookingPagination.items_per_page;
					$scope.bookingPagination.totalItems = data.data.count;
				}
			}

			function failureBooking(res) {
				swal("Some error with GET booking.", "", "error");
			}

			var oFilter = prepareFilterObjectForBooking(isPagination);
			lastFilter = oFilter;
			bookingServices.getAllBookings(oFilter, successBooking, failureBooking);
		})(true);

		$scope.getBookingForThisTab = function () {
			// trip memo bookingType either booking or skip booking
			if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
			$rootScope.tripMemoBookType = 'booking';

			if ($scope.formDataSelected.vehicle_type !== 'Own') {

				if (!($rootScope.selectedVendorInfo && $rootScope.selectedVendorInfo._id))
					return swal('Error', 'No Vendor Found on Selected Vehicle', 'error');

				if (!$rootScope.aVehicleSelected.every(o => o.vendor_id._id === $rootScope.selectedVendorInfo._id))
					return swal('Error', 'All Selected Vehicle should belong to same Vendor', 'error');

			}

			$state.go('booking_manage.vehicleAlollcation.bookingList');
			$scope.getBooking();
			// getBranch()();
		};

		$scope.skipBookingForThisTab = function () {
			// trip memo booking Type either booking or skip booking
			if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
			$rootScope.tripMemoBookType = 'skipBooking';

			if ($scope.formDataSelected.vehicle_type !== 'Own') {

				if (!($rootScope.selectedVendorInfo && $rootScope.selectedVendorInfo._id))
					return swal('Error', 'No Vendor Found on Selected Vehicle', 'error');

				if (!$rootScope.aVehicleSelected.every(o => o.vendor_id._id === $rootScope.selectedVendorInfo._id))
					return swal('Error', 'All Selected Vehicle should belong to same Vendor', 'error');

			}
			$rootScope.aVehicleSelected.forEach(obj=>{
				obj.gr = obj.gr || [];
				if(!obj.gr.length)
					obj.gr.push({});
			});

			$state.go('booking_manage.vehicleAlollcation.allocate');
		};

		$scope.getCname = function (viewValue) {
			if (viewValue && viewValue.toString().length > 2) {
				function oSucC(response) {
					$scope.aCustomer = response.data.data;
					if($scope.configs.booking && $scope.configs.booking.showCustId) {
						$scope.aCustomers.map((item)=>{
							item.name = item.name + '('+ item.customerId +')';
						});
					}
				};

				function oFailC(response) {
					console.log(response);
				}

				customer.getCname(viewValue, oSucC, oFailC);
			} else if (viewValue == '') {
				$scope.currentPage = 1;
				//$stateParams.name = '';
				//var sUrl = "#!/masters/vendorRegistration/profile"+"/" +$scope.currentPage +"/";
				$scope.getBooking();
			}
			;
		};

		$scope.onSelect = function ($item, $model, $label) {
			$scope.currentPage = 1;
			$scope.getBooking();
		};

		// add vehicle data by click on check box of vehicle list
		// 'addInSelectedVehicle'  ....

		$scope.tripStartEndDate = function (s,sh,sm, e,eh,em) {
			$rootScope.aVehicleSelected.forEach(v => {
				if (s) {
					s=new Date(new Date(s).setHours(sh, sm));
					v.trip_start = s;
					$scope.trip_start_time=s;
				}
				if (s && e) {
					e=new Date(new Date(e).setHours(eh, em));
					v.trip_end = e;
					$scope.trip_end_time=e;
				}
			});
		}


		$scope.addInSelectedVehicle = function (vehicleData) {
			var addVehicle = true;
			if ($rootScope.aVehicleSelected && $rootScope.aVehicleSelected.length >= 0) {
				for (var v = 0; v < $rootScope.aVehicleSelected.length; v++) {
					if ($rootScope.aVehicleSelected[v].vehicle_reg_no === vehicleData.vehicle_reg_no) {
						if (vehicleData.select === true) {
							swal("warning", "Vehicle Already Selected.", "warning");
						} else {
							$rootScope.aVehicleSelected.splice(v, 1);
						}
						addVehicle = false;
					}
				}
				if (addVehicle) {
					if (vehicleData.ownershipType === "Own" && !vehicleData.driver) {
						if($scope.$configs && $scope.$configs.booking){
							if($scope.$configs.booking && !$scope.$configs.booking.withoutDriverTrip){
						swal('No Driver', 'Driver Should be allocated on Vehicle to select this vehicle', 'error');
						vehicleData.select = false;
						return;
					}}else{
						swal('No Driver', 'Driver Should be allocated on Vehicle to select this vehicle', 'error');
						vehicleData.select = false;
						return;
					   }
					}

					if (vehicleData.ownershipType !== 'Own')
						$rootScope.selectedVendorInfo = vehicleData.vendor_id;

					vehicleData.capacity_tonne = vehicleData.capacity_tonne || (vehicleData.veh_type && vehicleData.veh_type.capacity) || 0;
					vehicleData.loadedWeight = 0;
					vehicleData.overloadAllowed = 10;

					$rootScope.aVehicleSelected.push(vehicleData);
				}
			}
		};

		$scope.selectBookingFromList = function (data, index) {
			$rootScope.selBookData = data;
			proceed = function () {
				$rootScope.aVehicleSelected = $rootScope.aVehicleSelected;
				var modalInstance = $uibModal.open({
					templateUrl: 'views/vehicleAllcation/selectVehForBooking.html',
					controller: 'selectVehForBookingCtrl',
					resolve: {
						thatData: function () {
							return $rootScope.aVehicleSelected;
						}
					}
				});

				modalInstance.result.then(function () {
					$state.reload();
				}, function (data) {
					if (data != 'cancel') {
						swal("Oops!", data.message, "error")
					}
				});
			}
			if ($rootScope.selBookData.remaining_weight <= 0) {
				swal({
						title: "Do you want to serve?",
						text: 'Selected booking is complete served!',
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: '#DD6B55',
						confirmButtonText: 'Yes, Serve it',
						cancelButtonText: "No, cancel it!",
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							proceed();
						} else {
							return;
						}
					});
			} else proceed();

			proceed = function () {
				$rootScope.aVehicleSelected = $rootScope.aVehicleSelected;
				var modalInstance = $uibModal.open({
					templateUrl: 'views/vehicleAllcation/selectVehForBooking.html',
					controller: 'selectVehForBookingCtrl',
					resolve: {
						thatData: function () {
							return $rootScope.aVehicleSelected;
						}
					}
				});

				modalInstance.result.then(function () {
					$state.reload();
				}, function (data) {
					if (data != 'cancel') {
						swal("Oops!", data.message, "error")
					}
				});
			}
		};

		$scope.vendorDealPopup = function (vehData, i) {
			if ($rootScope.selectedVendorInfo && $rootScope.selectedVendorInfo._id && vehData) {
				$rootScope.Allocate = vehData;
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
			}
		};

		$scope.grCount = function (aTrip) {
			if($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)) {
				if($rootScope.selBookData.imd && $rootScope.selBookData.imd.length) {
					$scope.inMedRoute =  $rootScope.selBookData.imd.map(item => item.c);
				}
				$rootScope.selectedQuotGet();
			}

			if ($rootScope.$role['Vehicle Allocation']['GR']) {
				aTrip.forEach(oTrip=>{
					if(oTrip.oldGr)
						oTrip.gr = oTrip.oldGr;
					else
					oTrip.oldGr = oTrip.gr;
				$scope.NewGr = [];
				oTrip.gr.forEach(obj => {
					if (obj.noOfGr) {
						for (let i = 0; i < obj.noOfGr; i++) {
							let req = angular.copy(obj);
							if (obj.noOfGr > 1 && i > 0) {
								req.weight = 0;
							}
							$scope.NewGr.push(req);
						}
					}
				});
				oTrip.gr = $scope.NewGr
				});
			}
			getCustCongif(aTrip);
		};

		function getCustCongif(aTrip) {
			aTrip.forEach(oTrip=>{
				oTrip.gr.forEach(oGr=>{
					if(oGr.customer && oGr.customer.gps_view && oGr.customer.gpsTripConf) {
						oTrip.gpsTripConf = oGr.customer.gpsTripConf;
						oTrip.gps_view = oGr.customer.gps_view;
					}
					if(oGr.customer && oGr.customer.shipperEnterprise && oGr.customer.shipperOrganization)
						oTrip.isShowShipmentNo = true;
				})
			})
		}

		function grDetailPopup(oTrip, index) {
			if($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)) {
				$rootScope.src = $scope.formDataSelected.ld || oTrip.route && oTrip.route.length &&  oTrip.route[0].source;
				$rootScope.dest = $scope.formDataSelected.uld || oTrip.route && oTrip.route.length &&  oTrip.route[0].destination;
			}
			$rootScope.allocationDate=$scope.formDataSelected.allocation_date;
			oTrip.gr[index].rName = $scope.selBookData && $scope.selBookData.rName;
			oTrip.gr[index].branch = oTrip.gr[index].branch || $scope.formDataSelected.branch;
			oTrip.gr[index].billingParty = oTrip.gr[index].billingParty || oTrip.gr[index].billing_party;
			oTrip.gr[index].consignee = Array.isArray(oTrip.gr[index].consignee) && oTrip.gr[index].consignee[0] || oTrip.gr[index].consignee;
			oTrip.gr[index].consignor = oTrip.gr[index].consignor || oTrip.gr[index].consigner;
			oTrip.gr[index].usedGR = [];
			oTrip.gr.forEach(o => {
				if (o.grNumber && o.grNumber != oTrip.gr[index].grNumber)
					oTrip.gr[index].usedGR.push(o.grNumber);
			});
			oTrip.grCounter = oTrip.grCounter || 1;
			// $localStorage.ft_data.newGr = oTrip.gr[index];

			$modal.open({
				templateUrl: 'views/vehicleAllcation/allocationGrUpsert.html',
				controller: [
					'$modal',
					'$modalInstance',
					'$parse',
					'$scope',
					'$rootScope',
					'$stateParams',
					'billBookService',
					'billingPartyService',
					'branchService',
					'CustomerRateChartService',
					'confService',
					'consignorConsigneeService',
					'customer',
					'cityStateService',
					'DatePicker',
					'dateUtils',
					'formulaEvaluateFilter',
					'materialService',
					'otherUtils',
					'stateDataRetain',
					'tripServices',
					'Vehicle',
					'incentiveService',
					'oTrip',
					'dphService',
					allocationGrUpsertController
				],
				backdrop: 'static',
				controllerAs: 'grUVm',
				size: 'xl',
				resolve: {
					oTrip: function () {
						return {
							...oTrip.gr[index],
							grCounter: oTrip.grCounter
						};
					}
				}

			}).result.then(function (response) {
				applyData(response);
			}, function (data) {
				if (data && data.branch)
					applyData(data);
				else
					$scope.Gr = undefined;
				console.log('cancel', data);
			});

			function applyData(data) {

				$rootScope.aVehicleSelected.forEach(item => {
					if(data && data.gateoutDate){
						item.trip_start=data.gateoutDate;
					}
				});
				if (data.grNumber){
					oTrip.grCounter++;
					if(data && data.grNumber){
						let duplicateGrNo = oTrip.gr.some(obj => obj.grNumber === data.grNumber)
						if(duplicateGrNo)
							swal('Error', 'Gr Number is already used for this Trip', 'error');
					}
				}


				// data.invoices.forEach((invObj, index) => {
				// 	if (invObj.invoiceDate)
				// 		invObj.invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
				// });
				oTrip.gr[index] = data;
			}
		}

		// function grDetailPopup(oTrip) {
		// 	oTrip.gr[0].branch = $scope.formDataSelected.branch;
		// 	oTrip.gr[0].billingParty = oTrip.gr[0].billing_party;
		// 	oTrip.gr[0].consignee = oTrip.gr[0].consignee && oTrip.gr[0].consignee[0];
		// 	$localStorage.ft_data.newGr = oTrip.gr[0];
		// 	var modalInstance = $uibModal.open({
		// 		templateUrl: 'views/vehicleAllcation/allocationGrUpsert.html',
		// 		controller: 'allocationGrUpsertController',
		// 		controllerAs: 'grUVm',
		// 		size: 'xl'
		// 	});
		// }

		function vendorDealPopUp(oTrip) {
			// if(vm.oTrip.advSettled.aVoucher.length>0){
			// 	swal('Error','Voucher already created!! vendorDealPopUp Can Not editable','error');
			// 	return
			// }

			$scope.oTrip = oTrip;
			$scope.oTrip.vendor = $scope.selectedVendorInfo;
			$scope.oTrip.branch = $scope.formDataSelected.branch;
			$scope.oTrip.loading_babu = $scope.formDataSelected.loading_babu;
			$scope.oTrip.trip_manager = $scope.formDataSelected.trip_manager;
			$scope.oTrip.allocation_date = $scope.formDataSelected.allocation_date;
			// if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show) { // by siddhant
				if($scope.finalQuotData) {
					$scope.oTrip.vendorDeal = {
						deal_at : new Date($scope.finalQuotData.date),
						payment_type : $scope.finalQuotData.payment_type,
						weight_type: $scope.finalQuotData.weight_type,
						munshiyana: $scope.finalQuotData.munshiyana,
						advance: $scope.finalQuotData.advance,
						total_expense: $scope.finalQuotData.rate,
						totWithMunshiyana: $scope.finalQuotData.total,
						pmtWeight: $scope.finalQuotData.pmtWeight,
						pmtRate: $scope.finalQuotData.pmtRate,
						otherExp: $scope.finalQuotData.otherExp,
						perUnitPrice: $scope.finalQuotData.perUnitPrice,
						totalUnits: $scope.finalQuotData.totalUnits
					};
				}
			// }


			$modal.open({
				templateUrl: 'views/myTripAdvance/vendorDealPopUp.html',
				controller: ['$scope', '$uibModalInstance', 'accountingService', 'billBookService', 'branchService', 'billsService', 'bookingServices', 'callback', 'constants', 'DateUtils', 'DatePicker', 'formulaFactory', 'growlService', 'oTrip', 'sharedResource', 'tripServices', 'userService', 'Vendor', vendorDealPopUpController],
				controllerAs: 'ackDealVm',
				size: 'xl',
				resolve: {
					callback: function () {
						return function (data) {
							return new Promise(function (resolve, reject) {
								$scope.oTrip.vendorDeal = data.vendorDeal;
								$scope.oTrip.vendor = data.vendor;
								$scope.oTrip.branch = data.branch;
								resolve('success');
							});
						};
					},
					oTrip: function () {
						return {
							...$scope.oTrip
						};
					}
				}
			}).result.then(function (response) {
				console.log('close', response);
				$scope.oTrip = response;
			}, function (data) {
				console.log('cancel', data);
			});
		}

		//*********** final page

		$scope.setUnknownDriver = function (sVehicle, index) {
			if (sVehicle.unknown_driver === true) {
				sVehicle.driver_name = "unknown";
			} else {
				sVehicle.driver_name = "";
			}
		};

		$scope.setRouteForVehicle = function (vehicle) {
			let max = 0;
			if(vehicle.gr && vehicle.gr[0] && vehicle.gr[0]._id){
				vehicle.aGrRoute = vehicle.gr.reduce((a, b) => {
				if (max <= (b && b.route && b.route.route_distance)) {         //= for same source and destination
					vehicle.route = b.route;
					vehicle.route_name = b.route.name;
					max = b.route.route_distance;
				}
				return a.concat(b.route);
			}, []);}
		};

		$scope.onSelect = function (item, vehicle) {
			vehicle.route_name = item.name;
			if(vehicle.gr && vehicle.gr.length){
				vehicle.gr.forEach(obj=>{
					obj.route = item;
				})
			}
		};

		$scope.addMoreGr = function (index) {
			$rootScope.aVehicleSelected[index].gr.push({});
		};

		$scope.getRoute = function(viewValue) {
			function oSucD(response) {
				$scope.aRoute = response.data.data;
			}

			function oFailD(response) {
				//console.log(response);
			}

			if (viewValue && viewValue.toString().length > 1) {
				Routes.getName(viewValue, oSucD, oFailD);
			}
		}


		/*$scope.getAllDriverData = function(isPagination){
			function success(data) {
				$rootScope.drivers = data.data;
				if(data.data && data.data.length>0){
					$scope.aDriver = data.data;
				}
			}
			Driver.getAllDrivers({all:true}, success);
		};
		$scope.getAllDriverData();*/

		//Final page allocation button click function
		//Arrange data according backend structure
		$scope.processAllocationForm = function () {
			var allocationOk = true;
			$scope.totalWeight = 0;
			if ($rootScope.aVehicleSelected && $rootScope.aVehicleSelected.length > 0) {
				for (var a = 0; a < $rootScope.aVehicleSelected.length; a++) {
					if (!$rootScope.aVehicleSelected[a].driver_name) {
						allocationOk = false;
						return swal('warning', 'Please  tick on Unknown driver checkbox ', 'warning');
					}

					if (!($scope.formDataSelected.branch && $scope.formDataSelected.branch._id)) {
						allocationOk = false;
					}

					if(!($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute))) {
						if (!$rootScope.aVehicleSelected[a].route || !$rootScope.aVehicleSelected[a].route_name) {
							allocationOk = false;
							break;
						}
					}
					/*if($rootScope.aVehicleSelected[a].ownershipType === 'Market'){
						if(!($rootScope.aVehicleSelected[a].vendorDeal && $rootScope.aVehicleSelected[a].vendorDeal.doneDeal)){
							allocationOk = false;
							swal('warning', 'Vendor deal information not filled.','warning');
						}
					}*/
					$scope.totalWeight = 0;
					if ($rootScope.aVehicleSelected[a].gr && $rootScope.aVehicleSelected[a].gr.length > 0) {
						for (var g = 0; g < $rootScope.aVehicleSelected[a].gr.length; g++) {
							// gr date should be greater than or equal to allocation_date
							let allocationDate = moment ($scope.formDataSelected.allocation_date).toDate();
							let grDate = moment ($rootScope.aVehicleSelected[a].gr[g].grDate);
							let days = grDate.diff(allocationDate,'days');
							if(days < 0) {
								return swal ('Error',`Please enter row no. ${g+1} gr date greater than or equal to allocation date`,'error');
							}
							$scope.totalWeight += $rootScope.aVehicleSelected[a].gr[g].weight;
							if (!$rootScope.aVehicleSelected[a].gr[g].weight) {
								allocationOk = false;
								return swal('warning', 'Please enter weight', 'warning');
							}
						}
					} else {
						swal('warning', 'All vehicle not attached with booking.', 'warning');
						allocationOk = false;
					}
					if ($scope.totalWeight > ($rootScope.aVehicleSelected[a].capacity_tonne + ($rootScope.aVehicleSelected[a].capacity_tonne * $rootScope.aVehicleSelected[a].overloadAllowed / 100))) {
						return swal('Error', 'weight cannot be greater than allowed Capacity', 'error');
					}
				}
			} else {
				swal('warning', 'Vehicle not Available.', 'warning');
				allocationOk = false;
			}
			if (allocationOk === true) {

				function succ(response) {
					$scope.disableSubmit = false;
					console.log(response.data);
					let succMess = "Trip is successfully created \n";
					if (response.data.messages && response.data.messages.length > 0) {
						for (let i = 0; i < response.data.messages.length; i++) {
							succMess += response.data.messages[i].message + " \n";
						}
					}
					swal('Success', succMess, 'success');
					delete $localStorage.ft_data.grData;
					$state.go('booking_manage.bookings', {}, {reload: true});
				}

				function fail(response) {
					console.log(response);
					$scope.disableSubmit = false;
				}

				var allocationData = [];
				var allocationDataFinal = [];

				//let tripStartDateAndTime=  new Date(new Date($scope.formDataSelected.start_date).setHours($scope.time.hourSel2, $scope.time.minuteSel2)) || new Date();
				allocationData = $rootScope.aVehicleSelected;
				let allocationDateAndTime = new Date(new Date($scope.formDataSelected.allocation_date).setHours($scope.time.hourSel1, $scope.time.minuteSel1)) || new Date();
				for (var a = 0; a < allocationData.length; a++) {
					allocationDataFinal[a] = {};
					allocationDataFinal[a].vehicle_no = allocationData[a].vehicle_reg_no;
					allocationDataFinal[a].driver_name = allocationData[a].driver_name;
					allocationDataFinal[a].vehicle = allocationData[a]._id;
					allocationDataFinal[a].route = allocationData[a].route && allocationData[a].route._id;
					allocationDataFinal[a].route_name = allocationData[a].route && allocationData[a].route.name;
					allocationDataFinal[a].branch = allocationData[a].branch || $scope.formDataSelected.branch._id;
					allocationDataFinal[a].startOdo = $scope.formDataSelected.startOdo;
					console.log('selBookData,', $rootScope.selBookData);
					if($rootScope.tripMemoBookType === 'skipBooking') {
						allocationDataFinal[a].ld = $scope.formDataSelected.ld;
						allocationDataFinal[a].uld = $scope.formDataSelected.uld;
						if($scope.formDataSelected.ld && $scope.formDataSelected.uld) {
							allocationDataFinal[a]['rName'] = `${$scope.formDataSelected.ld.c} to ${$scope.formDataSelected.uld.c}`
							allocationDataFinal[a]['rKm'] = $scope.formDataSelected && $scope.formDataSelected.rKm || 1;
						}
						if($scope.intermediateRoute && $scope.intermediateRoute.length) {
							allocationDataFinal[a]['imd'] = $scope.intermediateRoute;
						}
					} else if($rootScope.tripMemoBookType === 'booking') {
						allocationDataFinal[a].rName = $rootScope.selBookData && $rootScope.selBookData.rName;
						allocationDataFinal[a].rKm = $rootScope.selBookData && $rootScope.selBookData.rKm;
						if($scope.intermediateRoute && $scope.intermediateRoute.length) {
							allocationDataFinal[a]['imd'] = $scope.intermediateRoute;
						}else if($rootScope.selBookData && $rootScope.selBookData.imd){
							allocationDataFinal[a]['imd'] = $rootScope.selBookData.imd;
						}
					}

					// if($scope.formDataSelected.start_date){
					// 	allocationDataFinal[a].start_date = tripStartDateAndTime.toISOString();
					// }

					//allocationDataFinal[a].driver = $scope.formDataSelected.driver;
					allocationDataFinal[a].trip_manager = $scope.formDataSelected.trip_manager;
					allocationDataFinal[a].loading_babu = $scope.formDataSelected.loading_babu;
					allocationDataFinal[a].vendor = allocationData[a].vendor || $scope.selectedVendorInfo._id;
					allocationDataFinal[a].allocation_date = allocationDateAndTime.toISOString() || new Date();
					allocationDataFinal[a].vendorDeal = allocationData[a].vendorDeal || {};
					allocationDataFinal[a].trip_start = allocationData[a].trip_start;
					allocationDataFinal[a].trip_end = allocationData[a].trip_end;
					allocationDataFinal[a].ctrip = allocationData[a].ctrip;
					allocationDataFinal[a].corder = allocationData[a].corder;
					allocationDataFinal[a].serviceTyp = allocationData[a].serviceTyp;
					allocationDataFinal[a].gps_view = allocationData[a].gps_view ? "castrol" : undefined;
					allocationDataFinal[a].gr = [];
					for (var v = 0; v < allocationData[a].gr.length; v++) {
						allocationDataFinal[a].gr[v] = {
							...allocationData[a].gr[v]
						};
						allocationDataFinal[a].gr[v].branch = allocationDataFinal[a].gr[v].branch && allocationDataFinal[a].gr[v].branch._id || allocationData[a].gr[v].branch_id && allocationData[a].gr[v].branch_id._id || $scope.formDataSelected.branch && $scope.formDataSelected.branch._id;
						// allocationDataFinal[a].gr[v].branch = allocationData[a].gr[v].branch_id._id;
						if($rootScope.tripMemoBookType === 'skipBooking') {
							allocationDataFinal[a].gr[v].ld = $scope.formDataSelected.ld;
							if(allocationDataFinal[a].gr[v].acknowledge && !allocationDataFinal[a].gr[v].acknowledge.source && !allocationDataFinal[a].gr[v].acknowledge.destination)
							allocationDataFinal[a].gr[v].acknowledge = {
								source: $scope.formDataSelected.ld && $scope.formDataSelected.ld.c,
								destination: $scope.formDataSelected.uld && $scope.formDataSelected.uld.c
							};
							allocationDataFinal[a].gr[v].uld = $scope.formDataSelected.uld;
							if($scope.formDataSelected.ld && $scope.formDataSelected.uld) {
								allocationDataFinal[a].gr[v]['rName'] = `${$scope.formDataSelected.ld.c} to ${$scope.formDataSelected.uld.c}`
							}
							if($scope.intermediateRoute && $scope.intermediateRoute.length) {
								allocationDataFinal[a].gr[v]['imd'] = $scope.intermediateRoute;
							}
						} else if($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)){
							if(allocationDataFinal[a].gr[v].acknowledge && !allocationDataFinal[a].gr[v].acknowledge.source && !allocationDataFinal[a].gr[v].acknowledge.destination)
							allocationDataFinal[a].gr[v].acknowledge =  {
								source: $rootScope.selBookData && $rootScope.selBookData.ld && $rootScope.selBookData.ld.c,
								destination: $rootScope.selBookData && $rootScope.selBookData.uld && $rootScope.selBookData.uld.c
							}
						}
						if($scope.formDataSelected.branch && $scope.formDataSelected.branch._id)
							allocationDataFinal[a].gr[v].branch =  $scope.formDataSelected.branch._id;
						if($rootScope.tripMemoBookType === 'skipBooking') {
							allocationDataFinal[a].gr[v].ld = $scope.formDataSelected.ld;
							allocationDataFinal[a].gr[v].uld = $scope.formDataSelected.uld;
							if($scope.formDataSelected.ld && $scope.formDataSelected.uld) {
								allocationDataFinal[a].gr[v]['rName'] = `${$scope.formDataSelected.ld.c} to ${$scope.formDataSelected.uld.c}`
							}
							if($scope.intermediateRoute && $scope.intermediateRoute.length) {
								allocationDataFinal[a].gr[v]['imd'] = $scope.intermediateRoute;
							}
						}
						allocationDataFinal[a].gr[v].billingParty = allocationDataFinal[a].gr[v].billingParty && allocationDataFinal[a].gr[v].billingParty._id || allocationData[a].gr[v].billing_party && allocationData[a].gr[v].billing_party._id;
						allocationDataFinal[a].gr[v].consignee = Array.isArray(allocationData[a].gr[v].consignee) ? (allocationData[a].gr[v].consignee[0] && allocationData[a].gr[v].consignee[0]._id) : (allocationData[a].gr[v].consignee && allocationData[a].gr[v].consignee._id);
						allocationDataFinal[a].gr[v].consignor = allocationDataFinal[a].gr[v].consignor && allocationDataFinal[a].gr[v].consignor._id || allocationData[a].gr[v].consigner && allocationData[a].gr[v].consigner._id;
						allocationDataFinal[a].gr[v].booking = allocationData[a].gr[v]._id;
						allocationDataFinal[a].gr[v].route = allocationData[a].gr[v].route && allocationData[a].gr[v].route._id;
						if(allocationDataFinal[a].gr[v].shipmentNo){
							allocationDataFinal[a].gr[v].invoices = allocationDataFinal[a].gr[v].invoices || [];
							allocationDataFinal[a].gr[v].invoices[0] = allocationDataFinal[a].gr[v].invoices[0] || {};
							allocationDataFinal[a].gr[v].invoices[0].ref1 = allocationDataFinal[a].gr[v].shipmentNo;
						}
						allocationDataFinal[a].gr[v].invoices && allocationDataFinal[a].gr[v].invoices.forEach(invObj=>{
							if (invObj.invoiceDate)
								invObj.invoiceDate = (invObj.invoiceDate.length <11)?moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString():invObj.invoiceDate;
							if (invObj.gateoutDate)
								invObj.gateoutDate = moment(invObj.gateoutDate, 'DD/MM/YYYY').toISOString();
							if (invObj.gatePassDate)
								invObj.gatePassDate = moment(invObj.gatePassDate, 'DD/MM/YYYY').toISOString();
						});

						delete allocationDataFinal[a].gr[v]._id;
					}
				}
				$scope.disableSubmit = true;
				// For only Middle Mile Pro Client this "tripMemo key exist"
				if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show) {

					const isGrExist = $rootScope.aVehicleSelected;
					// if((isGrExist && isGrExist[0] && isGrExist[0].gr && isGrExist[0].gr[0] && isGrExist[0].gr[0].grNumber &&
					// 	isGrExist[0].gr[0].grDate ) && ($scope.oTripMemo && $scope.oTripMemo.tMNo)) {
					// 		$scope.disableSubmit = false;
					// 		return swal('warning', 'You Cannot add both details (GR and Trip Memo). Please clear either GR or Trip Memo details', 'warning');
					// }
					// if((isGrExist && isGrExist[0] && isGrExist[0].gr && isGrExist[0].gr[0] && isGrExist[0].gr[0].grNumber &&
					// 	isGrExist[0].gr[0].grDate ) && ($scope.oTripMemo && $scope.oTripMemo.tMNo)) {
					// 		$scope.disableSubmit = false;
					// 		return swal('warning', 'You Cannot add both details (GR and Trip Memo). Please clear either GR or Trip Memo details', 'warning');
					// }

				// this "$scope.oTripMemo" exist when user add data in trip memo modal
					if($rootScope.tripMemoBookType === 'booking') {
						if(($scope.selBookData.booking_type === 'Transporter Booking') &&
							!($scope.oTripMemo && $scope.oTripMemo.tMNo )) {
							$scope.disableSubmit = false;
							return swal('warning', 'Please add Trip memo details in Trip Memo Info section', 'warning');
						}
						// if(!($rootScope.oTripMemo && $rootScope.oTripMemo.tMNo)) {
						// 	$scope.disableSubmit = false;
						// 	return swal('warning', 'Please add Trip memo details in Trip Memo Info section', 'warning');
						// }
						delete allocationDataFinal[0].gr[0].advance;
						delete allocationDataFinal[0].gr[0].munshiyana;
						delete allocationDataFinal[0].gr[0].rate;
						delete allocationDataFinal[0].gr[0].toPay;
						delete allocationDataFinal[0].gr[0].total;
						delete allocationDataFinal[0].gr[0].total_weight;
						delete allocationDataFinal[0].gr[0].weight_per_unit;
						delete allocationDataFinal[0].gr[0].total_no_of_units;
						delete allocationDataFinal[0].gr[0].pmtWeight;
						delete allocationDataFinal[0].gr[0].pmtRate;
						let oSend = angular.copy($scope.oTripMemo);
						oSend = oSend || {};
						oSend.customer = (oSend && oSend.customer) ? oSend.customer._id : oSend.customer;
						oSend.billingParty = (oSend && oSend.billingParty) ? oSend.billingParty._id : oSend.billingParty;
						allocationDataFinal[0].gr[0].customer = oSend.customer;
						allocationDataFinal[0].gr[0].billingParty  = oSend.billingParty;
						allocationDataFinal[0].gr[0].payment_type  = oSend.payment_type;
						allocationDataFinal[0].gr[0].payment_basis  = oSend.weight_type;
						if(allocationData[0].route && allocationData[0].route._id){
							allocationDataFinal[0].gr[0].acknowledge = {};
							allocationDataFinal[0].gr[0].acknowledge.source = allocationData[0].route.source && allocationData[0].route.source.c;
							allocationDataFinal[0].gr[0].acknowledge.destination = allocationData[0].route.destination  && allocationData[0].route.destination.c;
						}
						// const oSend = angular.copy($scope.oTripMemo);
						// if(oSend) {
						// 	oSend.customer = (oSend && oSend.customer) ? oSend.customer._id : oSend.customer;
						// 	oSend.billingParty = (oSend && oSend.billingParty) ? oSend.billingParty._id : oSend.billingParty;
						// 	allocationDataFinal[0].gr[0].billingParty = oSend.billingParty;
						// }
						let grType = 'Own';
						if($scope.oTripMemo && $scope.oTripMemo.tMNo) {
							grType = 'Trip Memo';
							allocationDataFinal[0].gr[0] = Object.assign(allocationDataFinal[0].gr[0], {tMemo: oSend}, {gr_type: grType});
						} else if($scope.oBrokerMemo && $scope.oBrokerMemo.bmNo) {
							grType = 'Broker Memo';
							allocationDataFinal[0].gr[0] = Object.assign(allocationDataFinal[0].gr[0], {bMemo: oSend}, {gr_type: grType});
						}
						
						console.log(allocationDataFinal);
						vehicleAllcationService.vehicleAllocationServ({trips: allocationDataFinal}, succ, fail);
					} else {
						if(!(isGrExist && isGrExist[0] && isGrExist[0].gr && isGrExist[0].gr[0] && isGrExist[0].gr[0].grNumber &&
							isGrExist[0].gr[0].grDate || $scope.oTripMemo && $scope.oTripMemo.tMNo || $scope.oBrokerMemo && $scope.oBrokerMemo.bmNo)) {
								$scope.disableSubmit = false;
								return swal('warning', 'Please add GR details or Trip memo or Broker Memo details ', 'warning');
						}
						if($scope.oTripMemo || $scope.oBrokerMemo) {
							delete allocationDataFinal[0].gr[0].advance;
							delete allocationDataFinal[0].gr[0].munshiyana;
							delete allocationDataFinal[0].gr[0].rate;
							delete allocationDataFinal[0].gr[0].toPay;
							delete allocationDataFinal[0].gr[0].total;
							delete allocationDataFinal[0].gr[0].total_weight;
							delete allocationDataFinal[0].gr[0].weight_per_unit;
							delete allocationDataFinal[0].gr[0].total_no_of_units;
							delete allocationDataFinal[0].gr[0].pmtWeight;
							delete allocationDataFinal[0].gr[0].pmtRate;
							const oSend = angular.copy($scope.oTripMemo || $scope.oBrokerMemo);

							oSend.customer = (oSend && oSend.customer) ? oSend.customer._id : oSend.customer;
							oSend.billingParty = (oSend && oSend.billingParty) ? oSend.billingParty._id : oSend.billingParty;
							allocationDataFinal[0].gr[0].customer = oSend.customer;
							allocationDataFinal[0].gr[0].payment_type  = oSend.payment_type;
							allocationDataFinal[0].gr[0].payment_basis  = oSend.weight_type;
							allocationDataFinal[0].gr[0].billingParty = oSend && oSend.billingParty;
							if(allocationData[0].route && allocationData[0].route._id){
								allocationDataFinal[0].gr[0].acknowledge = {};
								allocationDataFinal[0].gr[0].acknowledge.source = allocationData[0].route.source && allocationData[0].route.source.c;
								allocationDataFinal[0].gr[0].acknowledge.destination = allocationData[0].route.destination && allocationData[0].route.destination.c;
							}else if(allocationDataFinal[0].ld &&  allocationDataFinal[0].ld.c && allocationDataFinal[0].uld &&  allocationDataFinal[0].uld.c){
								allocationDataFinal[0].gr[0].acknowledge = {};
								allocationDataFinal[0].gr[0].acknowledge.source = allocationDataFinal[0].ld && allocationDataFinal[0].ld.c;
								allocationDataFinal[0].gr[0].acknowledge.destination = allocationDataFinal[0].uld && allocationDataFinal[0].uld.c;
							}
							if($scope.oBrokerMemo && $scope.oBrokerMemo.bmNo) {
								allocationDataFinal[0].gr[0] = Object.assign(allocationDataFinal[0].gr[0], {bMemo: oSend}, {gr_type: 'Broker Memo'});
							} else {
								allocationDataFinal[0].gr[0] = Object.assign(allocationDataFinal[0].gr[0], {tMemo: oSend}, {gr_type: "Trip Memo"});
							}
							console.log(allocationDataFinal);
						}
						vehicleAllcationService.vehicleAllocationServ({trips: allocationDataFinal}, succ, fail);
					}
				} else {
					vehicleAllcationService.vehicleAllocationServ({trips: allocationDataFinal}, succ, fail);
				}
			} else {
				if(!($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)) {
					swal('warning', 'Weight, route, driver, branch not added on all vehicle. Please check it.', 'warning');
					$scope.disableSubmit = false;
				} else if($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute) {
					if($rootScope.tripMemoBookType === 'skipBooking') {

						if(!$scope.formDataSelected.ld) {
							return swal('warning', 'Please select Loading Point', 'warning');
						}
						if(!$scope.formDataSelected.uld) {
							return swal('warning', 'Please select Un-loading Point', 'warning');
						}
						if(!($scope.formDataSelected.branch && $scope.formDataSelected.branch._id)) {
							return swal('warning', 'Please select branch', 'warning');
						}
						// if(!($scope.formDataSelected.weight)) {
						// 	return swal('warning', 'Please enter weight', 'warning');
						// }

					}
					disableSubmit = false;
				}
			}
		};

		//*** New Date Picker for multiple date selection in single form ****
		$scope.calendarFunction = function () {
			$scope.today = function () {
				$scope.dt = new Date();
			};
			$scope.today();

			$scope.toggleMin = function () {
				$scope.minDate = $scope.minDate ? null : new Date();
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
		};
		$scope.calendarFunction();
		//*** New Date Picker for multiple date selection in single form ****//

		//  ******* Get the finalize quotation data  ****//
		$rootScope.selectedQuotGet = function(){
			if($rootScope.selectedBookingBaseInfo || $rootScope.selBookData) {
				let id = $rootScope.selectedBookingBaseInfo && $rootScope.selectedBookingBaseInfo.quote || $rootScope.selBookData && $rootScope.selBookData.quote;
				let bookingId = $rootScope.selectedBookingBaseInfo && $rootScope.selectedBookingBaseInfo._id || $rootScope.selBookData && $rootScope.selBookData._id;

				bookingServices.getVendorQuotation({_id: id,
					booking: bookingId}, onSuccess, err => {
						console.log(err);
					});

					// Handle success response
					function onSuccess(response) {
						if (response && response.data && response.data.data) {
							$scope.finalQuotData = response.data.data[0];
							$scope.filterObj.selectedVendorInfo = $scope.finalQuotData.vendor.name;
						}
					}
			}
		}
		// All get service for allocation
		// only once required
		$rootScope.getAllRegVehicle = function (isPagination) {
			function suc(response) {
				if($rootScope.selectedBookingBaseInfo) {
					if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show) {
						$rootScope.selectedQuotGet();
					}
				}

				$scope.aVehicleList = response.data.data.map(obj => {
					if ($rootScope.aVehicleSelected.findIndex(selObj => selObj._id === obj._id) !== -1)
						obj.select = true;
					else
						obj.select = false;
					return obj;
				});
				$scope.vehiclePagination.total_pages = response.data.count / 10;
				$scope.vehiclePagination.totalItems = response.data.count;
			}

			function fail(response) {
				console.log('failed', response);
			}

			var object = prepareFilterObject(isPagination);
			if($scope.$configs && $scope.$configs.tripMemo && $scope.$configs.tripMemo.show){
				if(object.ownershipType === 'Own'){
					delete object.vendor_id;
				}
			}
			object.populate = ['vendor_id'];
			// object.ne_category="Trailer";
			if ($rootScope.selectedBookingBaseInfo) {
				object.lat = $rootScope.selectedBookingBaseInfo.route && $rootScope.selectedBookingBaseInfo.route[0] &&
					$rootScope.selectedBookingBaseInfo.route[0].source && $rootScope.selectedBookingBaseInfo.route[0].source.latitude;
				object.lng = $rootScope.selectedBookingBaseInfo.route && $rootScope.selectedBookingBaseInfo.route[0] &&
					$rootScope.selectedBookingBaseInfo.route[0].source && $rootScope.selectedBookingBaseInfo.route[0].source.longitude;
			}
			Vehicle.getAllregList(object, suc, fail);
		};
		$rootScope.getAllRegVehicle();

		/*
		* Get All Branches List
		*
		* */

		function getAllBranch(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {


				let request = {
					name: viewValue
				};
				if ($scope.aUserBranch && $scope.aUserBranch.length) {
					request._ids = [];
					$scope.aUserBranch.forEach(obj => {
						if (obj.write)
							request._ids.push(obj._id)
					});
					if (!(request._ids && request._ids.length)) {
						return
					} else {
						request._ids = JSON.stringify(request._ids);
					}
				}

				return new Promise(function (resolve, reject) {

					branchService.getAllBranches(request, oSuc, oFail);

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

		$scope.getLoadingBabu = function () {
			userService.getUsers({user_type: 'Loading Babu', all: 'true'}, (res) => {
				$scope.aLoadingBabus = res.data;
			}, (err) => {
			});
		};
		$scope.getLoadingBabu();


		// get vehicle type
		/*$scope.getVehicle_type = function() {
			function succT(response) {
				if (response && response.data && response.data.data) {
					$rootScope.vehicleType1 = response.data.data;
				}
			}

			function failT(res) {
				console.error("fail: ", res);
			}
			Vehicle.getAllType(succT, failT);
		};
		$scope.getVehicle_type();*/

		//Get all users for trip manager dropdown at final page
		$scope.getAllUsers = function () {
			function succGetUsers(response) {
				console.log(response.data);
				if (response.data && response.data.length > 0) {
					$scope.aUsers = response.data;
				}
			}

			function failGetUsers(response) {
				console.log(response);
			}

			userService.getUsers({all: true, user_type: 'Trip Manager'}, succGetUsers, failGetUsers);
		};
		$scope.getAllUsers();

		/*$scope.selectContSettings = {
			displayProp: "number",
			enableSearch: false,
			showCheckAll: false,
			showUncheckAll: false,
			smartButtonTextConverter: function(itemText, originalItem)
			{
				return itemText;
			}
		};

		$scope.selectRouteEvents = {
			onItemDeselect: function (item) {
				onSelectContainer()
			},
			onItemSelect: function (item) {

			}
		}*/
		$scope.changeWeight = function (veh, index) {

			veh.loadedWeight = veh.gr[0].weight;

			return; // TEMPORARY FOR DGFC

			veh.loadedWeight = 0;
			for (var i = 0; i < veh.gr.length; i++) {
				veh.loadedWeight += veh.gr[i].weight;
			}

			if (veh.loadedWeight > (veh.capacity_tonne + (veh.capacity_tonne * veh.overloadAllowed / 100))) {
				var extraWeight = veh.loadedWeight - (veh.capacity_tonne + (veh.capacity_tonne * veh.overloadAllowed / 100));
				veh.gr[index].weight = veh.gr[index].weight - extraWeight;
				$scope.changeWeight(veh, index);
			}
		}

		$scope.weightValidaton = function (veh, index) {

			veh.loadedWeight = 0;
			for (var i = 0; i < veh.gr.length; i++) {
				veh.loadedWeight += veh.gr[i].weight;
			}
			$scope.flag = false;

			if (veh.loadedWeight > (veh.capacity_tonne + (veh.capacity_tonne * veh.overloadAllowed / 100))) {
				// $scope.flag = true;

				$timeout(function () {
					swal('Error', 'weight cannot be greater than allowed Capacity', 'error');
					veh.gr[index].weight = 0;
					// $scope.flag = false;
				}, 2000);
			}
		};

		$scope.onSelectContainer = function (clickedItem, veh, oSelBookVeh) {
			veh.lengthUsed = veh.lengthUsed || 0;
			if (veh.lengthUsed + clickedItem.length <= veh.veh_type.length) {
				veh.lengthUsed += clickedItem.length;
				oSelBookVeh.allContainer[oSelBookVeh.allContainer.indexOf(clickedItem)].used = true;
				var itemToPush = angular.copy(clickedItem);
				itemToPush.c_id = itemToPush._id;
				delete itemToPush._id;
				oSelBookVeh.container.push(itemToPush);
			} else {
				swal("Can't add container!", "Length exceeded " + (veh.veh_type.length - veh.lengthUsed + clickedItem.length), "warning");
			}
			clickedItem = {};
		}

		$scope.removeContainer = function (oSelBookVeh, index, veh) {
			var container = oSelBookVeh.container[index];
			veh.lengthUsed -= container.length;
			for (var i = 0; i < oSelBookVeh.allContainer.length; i++) {
				for (var j = 0; j < oSelBookVeh.container.length; j++) {
					if (oSelBookVeh.allContainer[i]._id === oSelBookVeh.container[j].c_id) {
						oSelBookVeh.allContainer[i].used = false;
					}
				}
			}
			// oSelBookVeh.allContainer[oSelBookVeh.allContainer.indexOf(container)].used = false;
			oSelBookVeh.container.splice(index, 1);
		}

		$scope.getSources = function(viewValue) {
			if (viewValue && viewValue.toString().length >= 2) {
				return new Promise(function (resolve, reject) {

					let requestObj = {
						query: viewValue,
					};

					cityStateService.autosuggestCity(requestObj, oSuc, oFail);

					function oSuc(response) {
						resolve(response.data);
					}

					function oFail(response) {
						console.log(response);
						reject([]);
					}
				});
			}
		};

		$scope.getUnloadingPoint = function(viewValue) {
			if (viewValue && viewValue.toString().length >= 2) {
				return new Promise(function (resolve, reject) {

					let requestObj = {
						query: viewValue,
					};

					cityStateService.autosuggestCity(requestObj, oSuc, oFail);

					function oSuc(response) {
						resolve(response.data);
					}

					function oFail(response) {
						console.log(response);
						reject([]);
					}
				});
			}
		};

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
		};

		function setRouteKm() {
			if ($scope.formDataSelected.ld && $scope.formDataSelected.uld && $scope.formDataSelected.ld.location && $scope.formDataSelected.uld.location) {
				if (google && google.maps && google.maps.DistanceMatrixService) {
					new google.maps.DistanceMatrixService()
						.getDistanceMatrix(
							{
								origins: [$scope.formDataSelected.ld.location],
								destinations: [$scope.formDataSelected.uld.location],
								travelMode: 'DRIVING',
								// unitSystem: UnitSystem,
							}, (response) => {
								console.log(response)
								if(response && Array.isArray(response.rows) && response.rows[0]){
									let element = response.rows[0].elements;
									$scope.formDataSelected.rKm = Math.round2(element[0].distance.value / 1000, 2);
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

		$scope.getIntermediatePoint = function(viewValue) {
			if (viewValue && viewValue.toString().length >= 2) {
				return new Promise(function (resolve, reject) {

					let requestObj = {
						c: viewValue,
					};

					cityStateService.getCity(requestObj, oSuc, oFail);

					function oSuc(response) {
						resolve(response.data);
					}

					function oFail(response) {
						console.log(response);
						reject([]);
					}
				});
			}
		};

		$scope.onSelectIntermediate = function (item) {
			if($scope.intermediateRoute && $scope.intermediateRoute.length > 8) {
			  return swal('Error', 'Sorry you cannot add more than 8 intermediate routes', 'error');
			}
		  $scope.intermediateRoute = $scope.intermediateRoute || [];
		  $scope.intermediateRoute.push(item);
		  $scope.formDataSelected.imp = '';
		}

		$scope.removeIntermediate = function (select, index) {
			$scope.intermediateRoute.splice(index, 1);
	  	}

		$scope.openTripMemoModal = function(oSelectedRowInfo) {
			console.log('', $rootScope.selBookData);
			if(oSelectedRowInfo) {
					let oTripMemo = $scope.oTripMemo;
				// user is coming from Main Bookings section where all booking are coming
				if($scope.finalQuotData) {
					$scope.finalQuotData.total_expense = $scope.finalQuotData.rate;
					let vd = angular.copy($scope.finalQuotData);
					let selectedInfo = {};
					vd.branch = $scope.formDataSelected.branch
					selectedInfo['vendorDeal'] = vd;
					selectedInfo['vendorDeal']['customer'] = $rootScope.selBookData && $rootScope.selBookData.customer && $rootScope.selBookData.customer.name;
					if($rootScope.selBookData.billing_party) {
						selectedInfo['vendorDeal']['billingParty'] = $rootScope.selBookData && $rootScope.selBookData.billing_party && $rootScope.selBookData.billing_party.name;
					}
					selectedInfo['vendorDeal']['selectedVendor'] = vd && vd.vendor && vd.vendor.name;
					var modalInstance = $modal.open({
						templateUrl: 'views/myBookings/quotationModal.html',
						size: 'xl',
						controller: 'addQuotationControllers',
						controllerAs: 'ackDealVm',
						resolve: {
							tripMemo: true,
							selectedInfo,
							isEdit: true,
							bookType: false,
							oTripMemo: oTripMemo,
							showDeductionCharges: true
						}
					});

					modalInstance.result.then(function (response) {
						if (response) {
							$scope.oTripMemo = response.TripMemo;
							oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
							// oSelectedRowInfo.grNumber = response.Gr.grNumber;
							// oSelectedRowInfo.grDate = response.Gr.grDate;
							// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
						}
					}, function (data) {
						$scope.oTripMemo = data.TripMemo;
						oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
						// oSelectedRowInfo.grNumber = data.Gr.grNumber;
						// oSelectedRowInfo.grDate = data.Gr.grDate;
						// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;

					});
				} else {
					/* user is coming from Vehicle Allocation page and check
					user select Booking on second step
					*/
					if($rootScope.tripMemoBookType === 'booking') {
						bookingServices.getVendorQuotation({_id: oSelectedRowInfo.quote,
							booking: oSelectedRowInfo._id}, onSuc, err => {
								console.log(err);
							});
						// bookingServices.getVendorQuotation({booking: oSelectedRowInfo._id}, onSuc, err => {
						// 	alert(err);
						// });
						function onSuc(response) {
							if(response) {
								$scope.receivedQuotation = response && response.data && response.data.data;
								/*
								* This line works when any quotation is finalize
								*/
								if($scope.receivedQuotation && $scope.receivedQuotation.length > 0) {
									// add the finalize quotation condition
									$scope.receivedQuotation[0].total_expense = $scope.receivedQuotation[0].rate;
									let vd = angular.copy($scope.receivedQuotation && $scope.receivedQuotation[0]);
									let selectedInfo = {};
									vd.branch = $scope.formDataSelected.branch;
									selectedInfo['vendorDeal'] = vd;
									selectedInfo['vendorDeal']['customer'] = $rootScope.selBookData && $rootScope.selBookData.customer && $rootScope.selBookData.customer.name;
									if($rootScope.selBookData.billing_party) {
										selectedInfo['vendorDeal']['billingParty'] = $rootScope.selBookData && $rootScope.selBookData.billing_party && $rootScope.selBookData.billing_party.name;
									}
									selectedInfo['vendorDeal']['selectedVendor'] = vd && vd.vendor && vd.vendor.name;
									var modalInstance = $modal.open({
										templateUrl: 'views/myBookings/quotationModal.html',
										size: 'xl',
										controller: 'addQuotationControllers',
										controllerAs: 'ackDealVm',
										resolve: {
											tripMemo: true,
											selectedInfo,
											isEdit: true,
											bookType: true,
											oTripMemo: oTripMemo,
											showDeductionCharges: true
										}
									});

									modalInstance.result.then(function (response) {
										if (response) {
											$scope.oTripMemo = response.TripMemo;
											oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
											// oSelectedRowInfo.grNumber = response.Gr.grNumber;
											// oSelectedRowInfo.grDate = response.Gr.grDate;
											// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
										}
									}, function (data) {
										$scope.oTripMemo = data.TripMemo;
										oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
										// oSelectedRowInfo.grNumber = data.Gr.grNumber;
										// oSelectedRowInfo.grDate = data.Gr.grDate;
										// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
									});
								} else {
									/*
									* This line works when any quotation is not finalize
									*/
									let selectedInfo = {};
									let vd = angular.copy(oSelectedRowInfo);
									vd.billingParty = vd.billing_party;
									vd.branch = $scope.formDataSelected.branch;
									vd['weight_type'] = vd.payment_basis;
									vd['total_expense'] = vd.rate;
									vd['vt'] = vd && vd.preference && vd.preference[0] && vd.preference[0]._id;
									selectedInfo['vendorDeal'] = vd;
									// add the finalize quotation condition
									var modalInstance = $modal.open({
										templateUrl: 'views/myBookings/quotationModal.html',
										size: 'xl',
										controller: 'addQuotationControllers',
										controllerAs: 'ackDealVm',
										resolve: {
											tripMemo: true,
											selectedInfo,
											isEdit: true,
											bookType: true,
											oTripMemo: oTripMemo,
											showDeductionCharges: true
										}
									});

									modalInstance.result.then(function (response) {
										if (response) {
											$scope.oTripMemo = response.TripMemo;
											oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
											// oSelectedRowInfo.grNumber = response.Gr.grNumber;
											// oSelectedRowInfo.grDate = response.Gr.grDate;
											// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
										}
									}, function (data) {
										$scope.oTripMemo = data.TripMemo;
										oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
										// oSelectedRowInfo.grNumber = data.Gr.grNumber;
										// oSelectedRowInfo.grDate = data.Gr.grDate;
										// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
									});
								}

							}
						}
					} else {
						/* user is coming from Vehicle Allocation page and check
						user select skip Booking on second step
						*/
						let selectedInfo = {};
						selectedInfo['vendorDeal'] = {branch:$scope.formDataSelected.branch};
						var modalInstance = $modal.open({
							templateUrl: 'views/myBookings/quotationModal.html',
							size: 'xl',
							controller: 'addQuotationControllers',
							controllerAs: 'ackDealVm',
							resolve: {
								tripMemo: true,
								selectedInfo,
								isEdit: true,
								bookType: false,
								oTripMemo: oTripMemo,
								showDeductionCharges: true
							}
						});

						modalInstance.result.then(function (response) {
							if (response) {
								$scope.oTripMemo = response.TripMemo;
								oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
								// oSelectedRowInfo.grNumber = response.Gr.grNumber;
								// oSelectedRowInfo.grDate = response.Gr.grDate;
								// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
							}
						}, function (data) {
							$scope.oTripMemo = data.TripMemo;
							oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
							// oSelectedRowInfo.grNumber = data.Gr.grNumber;
							// oSelectedRowInfo.grDate = data.Gr.grDate;
							// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
						});
					}
				}
			}
		}

		$scope.openBrokerMemoModal = function(oSelectedRowInfo) {
			console.log('', $rootScope.selBookData);
			if(oSelectedRowInfo) {
					let oBrokerMemo = $scope.oBrokerMemo;
				// user is coming from Main Bookings section where all booking are coming
				if($scope.finalQuotData) {
					$scope.finalQuotData.total_expense = $scope.finalQuotData.rate;
					let vd = angular.copy($scope.finalQuotData);
					let selectedInfo = {};
					vd.branch = $scope.formDataSelected.branch
					selectedInfo['vendorDeal'] = vd;
					selectedInfo['vendorDeal']['customer'] = $rootScope.selBookData && $rootScope.selBookData.customer && $rootScope.selBookData.customer.name;
					if($rootScope.selBookData.billing_party) {
						selectedInfo['vendorDeal']['billingParty'] = $rootScope.selBookData && $rootScope.selBookData.billing_party && $rootScope.selBookData.billing_party.name;
					}
					selectedInfo['vendorDeal']['selectedVendor'] = vd && vd.vendor && vd.vendor.name;
					var modalInstance = $modal.open({
						templateUrl: 'views/myBookings/brokerMemoModal.html',
						size: 'xl',
						controller: 'addbMemoControllers',
						controllerAs: 'bMemoVm',
						resolve: {
							brokerMemo: true,
							selectedInfo,
							isEdit: true,
							bookType: false,
							oBrokerMemo: oBrokerMemo,
							showDeductionCharges: true
						}
					});

					modalInstance.result.then(function (response) {
						if (response) {
							$scope.oBrokerMemo = response.BrokerMemo;
							oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
							// oSelectedRowInfo.grNumber = response.Gr.grNumber;
							// oSelectedRowInfo.grDate = response.Gr.grDate;
							// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
						}
					}, function (data) {
						$scope.oBrokerMemo = data.BrokerMemo;
						oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
						// oSelectedRowInfo.grNumber = data.Gr.grNumber;
						// oSelectedRowInfo.grDate = data.Gr.grDate;
						// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;

					});
				} else {
					/* user is coming from Vehicle Allocation page and check
					user select Booking on second step
					*/
					if($rootScope.tripMemoBookType === 'booking') {
						bookingServices.getVendorQuotation({_id: oSelectedRowInfo.quote,
							booking: oSelectedRowInfo._id}, onSuc, err => {
								console.log(err);
							});
						// bookingServices.getVendorQuotation({booking: oSelectedRowInfo._id}, onSuc, err => {
						// 	alert(err);
						// });
						function onSuc(response) {
							if(response) {
								$scope.receivedQuotation = response && response.data && response.data.data;
								/*
								* This line works when any quotation is finalize
								*/
								if($scope.receivedQuotation && $scope.receivedQuotation.length > 0) {
									// add the finalize quotation condition
									$scope.receivedQuotation[0].total_expense = $scope.receivedQuotation[0].rate;
									let vd = angular.copy($scope.receivedQuotation && $scope.receivedQuotation[0]);
									let selectedInfo = {};
									vd.branch = $scope.formDataSelected.branch;
									selectedInfo['vendorDeal'] = vd;
									selectedInfo['vendorDeal']['customer'] = $rootScope.selBookData && $rootScope.selBookData.customer && $rootScope.selBookData.customer.name;
									if($rootScope.selBookData.billing_party) {
										selectedInfo['vendorDeal']['billingParty'] = $rootScope.selBookData && $rootScope.selBookData.billing_party && $rootScope.selBookData.billing_party.name;
									}
									selectedInfo['vendorDeal']['selectedVendor'] = vd && vd.vendor && vd.vendor.name;
									var modalInstance = $modal.open({
										templateUrl: 'views/myBookings/brokerMemoModal.html',
										size: 'xl',
										controller: 'addbMemoControllers',
										controllerAs: 'bMemoVm',
										resolve: {
											brokerMemo: true,
											selectedInfo,
											isEdit: true,
											bookType: true,
											oBrokerMemo: oBrokerMemo,
											showDeductionCharges: true
										}
									});

									modalInstance.result.then(function (response) {
										if (response) {
											$scope.oBrokerMemo = response.BrokerMemo;
											oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
											// oSelectedRowInfo.grNumber = response.Gr.grNumber;
											// oSelectedRowInfo.grDate = response.Gr.grDate;
											// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
										}
									}, function (data) {
										$scope.oBrokerMemo = data.BrokerMemo;
										oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
										// oSelectedRowInfo.grNumber = data.Gr.grNumber;
										// oSelectedRowInfo.grDate = data.Gr.grDate;
										// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
									});
								} else {
									/*
									* This line works when any quotation is not finalize
									*/
									let selectedInfo = {};
									let vd = angular.copy(oSelectedRowInfo);
									vd.billingParty = vd.billing_party;
									vd.branch = $scope.formDataSelected.branch;
									vd['weight_type'] = vd.payment_basis;
									vd['total_expense'] = vd.rate;
									vd['vt'] = vd && vd.preference && vd.preference[0] && vd.preference[0]._id;
									selectedInfo['vendorDeal'] = vd;
									// add the finalize quotation condition
									var modalInstance = $modal.open({
										templateUrl: 'views/myBookings/brokerMemoModal.html',
										size: 'xl',
										controller: 'addbMemoControllers',
										controllerAs: 'bMemoVm',
										resolve: {
											brokerMemo: true,
											selectedInfo,
											isEdit: true,
											bookType: true,
											oBrokerMemo: oBrokerMemo,
											showDeductionCharges: true
										}
									});

									modalInstance.result.then(function (response) {
										if (response) {
											$scope.oBrokerMemo = response.BrokerMemo;
											oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
											// oSelectedRowInfo.grNumber = response.Gr.grNumber;
											// oSelectedRowInfo.grDate = response.Gr.grDate;
											// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
										}
									}, function (data) {
										$scope.oBrokerMemo = data.BrokerMemo;
										oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
										// oSelectedRowInfo.grNumber = data.Gr.grNumber;
										// oSelectedRowInfo.grDate = data.Gr.grDate;
										// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
									});
								}

							}
						}
					} else {
						/* user is coming from Vehicle Allocation page and check
						user select skip Booking on second step
						*/
						let selectedInfo = {};
						selectedInfo['vendorDeal'] = {branch:$scope.formDataSelected.branch};
						var modalInstance = $modal.open({
							templateUrl: 'views/myBookings/brokerMemoModal.html',
							size: 'xl',
							controller: 'addbMemoControllers',
							controllerAs: 'bMemoVm',
							resolve: {
								brokerMemo: true,
								selectedInfo,
								isEdit: true,
								bookType: false,
								oBrokerMemo: oBrokerMemo,
								showDeductionCharges: true
							}
						});

						modalInstance.result.then(function (response) {
							if (response) {
								$scope.oBrokerMemo = response.BrokerMemo;
								oSelectedRowInfo = Object.assign(oSelectedRowInfo, response.Gr);
								// oSelectedRowInfo.grNumber = response.Gr.grNumber;
								// oSelectedRowInfo.grDate = response.Gr.grDate;
								// oSelectedRowInfo.stationaryId = response.Gr.stationaryId;
							}
						}, function (data) {
							$scope.oBrokerMemo = data.BrokerMemo;
							oSelectedRowInfo = Object.assign(oSelectedRowInfo, data.Gr);
							// oSelectedRowInfo.grNumber = data.Gr.grNumber;
							// oSelectedRowInfo.grDate = data.Gr.grDate;
							// oSelectedRowInfo.stationaryId = data.Gr.stationaryId;
						});
					}
				}
			}
		}

	});


/*
* Add the Trip Memo
*/
materialAdmin.controller('addQuotationControllers', function (
	$scope,
	selectedInfo,
	isEdit,
	tripMemo,
	$uibModalInstance,
	DatePicker,
	userService,
    bookingServices,
    Vendor,
	billsService,
	$stateParams,
	formulaFactory,
	Vehicle,
	billingPartyService,
	consignorConsigneeService,
	customer,
	$rootScope,
	bookType,
	billBookService,
	oTripMemo,
	showDeductionCharges
) {
    let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.getAllUsers = getAllUsers;

	// functions Identifiers
	$scope.submit = submit;
	$scope.closeModal = closeModal;
	$scope.resetForm = resetForm;
	vm.getBillBookNo = getBillBookNo;
	vm.getVendorName = getVendorName;
	vm.getAllBillingParty = getAllBillingParty;
	vm.getCustomers = getCustomers;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.onConsignorSelect = onConsignorSelect;
	vm.onConsigneeSelect =  onConsigneeSelect;
	vm.getConsignee =  getConsignee;
	vm.getConsignor =  getConsignor;
	vm.getTDSRate = getTDSRate;
	vm.getVname = getVname;
	vm.getQuotationData = getQuotationData;
	vm.changeAdvance = changeAdvance;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.changeAcPayment = changeAcPayment;
	vm.formulaCommonCalFun = formulaCommonCalFun;
	vm.changePayType = changePayType;
	vm.getGrBookNo = getGrBookNo;
	vm.validateObj = validateObj;
	vm.remove = remove;
	vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
	vm.resetAll = resetAll;
	// INIT functions
    (function init() {
		vm.isShowTripMemo = tripMemo;
		$scope.tripMemoBType = bookType;
		$scope.oTripMemo = angular.copy(oTripMemo);
		$scope.showDeductionCharges = showDeductionCharges;
		vm.aTripData = angular.copy(selectedInfo);
		vm.aTripData.vendorDeal.perUnitPrice = selectedInfo.vendorDeal.weight_per_unit || selectedInfo.vendorDeal.perUnitPrice;
		vm.aTripData.vendorDeal.totalUnits = selectedInfo.vendorDeal.total_no_of_units || selectedInfo.vendorDeal.totalUnits;
		vm.branch = vm.aTripData.vendorDeal.branch;
		if(vm.aTripData.vendorDeal.grNumber && vm.aTripData.vendorDeal.stationaryId)
			vm.aTripData.vendorDeal.grBookInfo = {_id:vm.aTripData.vendorDeal.stationaryId, bookNo: vm.aTripData.vendorDeal.grNumber}
		// check that user has already prefill the trip memo no, date etc.
		if($scope.oTripMemo) {
			// vm.aTripData.vendorDeal.selectedVendor = $scope.oTripMemo.vendorName;
			vm.aTripData.vendorDeal.customer = $scope.oTripMemo.customer;
			vm.aTripData.vendorDeal.billingParty = $scope.oTripMemo.billingParty;
			vm.aTripData.vendorDeal.tMemo = $scope.oTripMemo.tMNo;
			vm.aTripData.vendorDeal.tripMemoDate = new Date($scope.oTripMemo.date);
			// vm.aTripData.vendorDeal.date = new Date($scope.oTripMemo.dealDate);
			vm.aTripData.vendorDeal.advance = $scope.oTripMemo.advance;
			vm.aTripData.vendorDeal.munshiyana = $scope.oTripMemo.munshiyana;
			vm.aTripData.vendorDeal.total_expense = $scope.oTripMemo.rate;
			vm.aTripData.vendorDeal.remark = $scope.oTripMemo.remark;
			vm.aTripData.vendorDeal.weight_type = $scope.oTripMemo.weight_type;
			vm.aTripData.vendorDeal.total = $scope.oTripMemo.totWithMunshiyana;
			vm.aTripData.vendorDeal.toPay = $scope.oTripMemo.toPay;
			vm.aTripData.vendorDeal.payment_type = $scope.oTripMemo.payment_type;
			vm.aTripData.vendorDeal.pmtWeight = $scope.oTripMemo.pmtWeight;
			vm.aTripData.vendorDeal.pmtRate = $scope.oTripMemo.pmtRate;
			vm.aTripData.vendorDeal.perUnitPrice = $scope.oTripMemo.perUnitPrice;
			vm.aTripData.vendorDeal.totalUnits = $scope.oTripMemo.totalUnits;
			if($scope.oTripMemo.tMNo && $scope.oTripMemo.stationaryId){
				vm.bookInfo = {_id: $scope.oTripMemo.stationaryId, bookNo: $scope.oTripMemo.tMNo}
			}
		}
		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
		}
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.percentage) {
			vm.aWeightTypes.push('Percentage');
		}
		vm.oDeduction = {};
		vm.oExtraCharges = {};
		vm.oExtraCharges.date = new Date();
		vm.oDeduction.date = new Date();
		vm.aDeduction = [];
		vm.aExtraCharges = [];
		vm.aCharges = [];
		vm.aDeductionCharges = [];
		// vm.aTripData.vendorDeal = vm.aTripData.vendorDeal || {};
		vm.aTripData.vendorDeal.charges = vm.aTripData.vendorDeal.charges || {};
		vm.aTripData.vendorDeal.deduction = vm.aTripData.vendorDeal.deduction || {};

		if (!vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.totWithMunshiyana)
			formulaCommonCalFun();

		$scope.$watchGroup(['ackDealVm.aTripData.vendorDeal.munshiyana', 'ackDealVm.aTripData.vendorDeal.total_expense', 'ackDealVm.aTripData.vendorDeal.otherExp'], function (...aMod) {
			formulaCommonCalFun();
		});

	})();

	(function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				vm.aVehicleTypes = res.data.data;
				let findItem;
				if($scope.oTripMemo) {
					findItem = vm.aVehicleTypes.find(item => item._id === $scope.oTripMemo.vehicleId);
					if(findItem) {
						vm.aTripData.vendorDeal.vehicle = findItem;
					}
				} else {
					findItem = vm.aVehicleTypes.find(item => item._id === vm.aTripData.vendorDeal.vt);
					if(findItem) {
						vm.aTripData.vendorDeal.vehicle = findItem;
					}
				}
			}
		}

		function failType(res) {
			vm.aVehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	})();

	// Operations
	if (typeof oBooking !== 'undefined' && oBooking !== null) {
		$scope.oTest = angular.copy(oBooking); //initialize with param

	}

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function resetForm() {
		vm.aTripData.vendorDeal = {};
		$scope.oTripMemo = {};
		// delete $rootScope.aVehicleSelected[0] && $rootScope.aVehicleSelected[0].gr[0] && $rootScope.aVehicleSelected[0].gr[0].gr_type;
		swal("Success", 'All Trip Memo details are removed successfully', "success");
		$uibModalInstance.dismiss();
	}


	function getBillBookNo(viewValue) {

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
		// 	swal('Warning', 'Please Select Branch', 'warning');
		// 	return [];
		// }

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
		// 	return [];

		if (viewValue != 'centrailized' && !(vm.branch && Array.isArray(vm.branch.tripMemoBook) && vm.branch.tripMemoBook.length))
			return;


		if (!vm.aTripData.vendorDeal.tripMemoDate) {
			swal('Error', 'Trip Memo Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.branch && vm.branch.tripMemoBook ? vm.branch.tripMemoBook.map(o => o.ref) : '',
				type: 'Trip Memo',
				useDate: moment(vm.aTripData.vendorDeal.tripMemoDate).startOf('day').toDate(),
				status: 'unused'
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.aTripData.vendorDeal.tMemo = response.data[0].bookNo;
						vm.bookInfo = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	vm.onBookNoSelect = function(item) {
		vm.bookInfo = item;
	}


	function getGrBookNo(viewValue) {

		if (viewValue != 'centrailized' && !(vm.branch && Array.isArray(vm.branch.grBook) && vm.branch.grBook.length))
			return;


		if (!vm.aTripData.vendorDeal.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.branch.grBook ? vm.branch.grBook.map(o => o.ref) : '',
				type: 'Gr',
				useDate: moment(vm.aTripData.vendorDeal.grDate).startOf('day').toDate(),
				status: 'unused'
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.aTripData.vendorDeal.grNumber = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	vm.onGrBookSelect = function(item) {
		vm.aTripData.vendorDeal.grBookInfo = item;
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
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

	function onCustomerSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.customer = value;
		}
	}

	function onBillingPartySelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.billingParty = value;
		}
	}

	function getAllBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function onConsigneeSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignee = value;
		}
	}

	function onConsignorSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignor = value;
		}
	}

	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}


	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.munshiyana,
			'total_expense': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.total_expense,
			'otherExp': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.otherExp
		});
		vm.aTripData.vendorDeal.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
	}

    function getVendorName(viewValue, elseObj = false) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
			}

			let res = {
				deleted: false
			};

			if (elseObj)
				Object.assign(res, elseObj);
			else
				res.name = viewValue;

			if ((vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId))
				res.cClientId = vm.aTripData.vendor && vm.aTripData.vendor.clientId || vm.aTripData.vendor_id.clientId;

			Vendor.getName(res, oSuc, oFail);
		});
    }

    function getTDSRate() {
		if (vm.tdsVerify && vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && vm.aTripData.vendorDeal.deal_at) {
			let oReq = {
				date: vm.aTripData.vendorDeal.deal_at,
				cClientId: $scope.selectedClient
			};
			let isGetTDS = true;
			if(vm.aTripData.vendor && vm.aTripData.vendor.exeRate && vm.aTripData.vendor.exeFrom && vm.aTripData.vendor.exeTo){
				if(new Date(vm.aTripData.vendorDeal.deal_at) >= new Date(vm.aTripData.vendor.exeFrom) && new Date(vm.aTripData.vendorDeal.deal_at) <= new Date(vm.aTripData.vendor.exeTo)) {
					vm.aTripData.vendorDeal.tdsPercent = vm.aTripData.vendor.exeRate;
					isGetTDS = false;
				}
			}

			if(isGetTDS)
			billsService.getTDSRate(oReq, onSuccess, onFailure);


			function onSuccess(res) {
				if (res.data && res.data.data && res.data.data.length) {
					vm.allTDSRate = res.data.data[0];
					vm.allTDSRate.aRate.forEach(obj => {
						if (obj.sources === vm.tdsSources) {
							switch (vm.tdsCategory) {
								case 'Individuals or HUF': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.ipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.nipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.niwpRate;
								}
								default:
									return vm.aTripData.vendorDeal.tdsPercent = 0;
							}
						}
					});
				}
			}

			function onFailure(err) {

			}
		}

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

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			// let req = {
			// 	veh_type_name: viewValue
			// };
			return new Promise(function (resolve, reject) {
				Vehicle.getNameTrim(viewValue, oSuc, oFail);

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

	function changePayType(pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0);
			vm.aTripData.vendorDeal.advance = 0;
			if (vm.aTripData.vendorDeal.diesel) {
				vm.aTripData.vendorDeal.diesel.quantity = 0;
				vm.aTripData.vendorDeal.diesel.rate = 0;
				vm.aTripData.vendorDeal.diesel.amount = 0;
			}
			vm.aTripData.vendorDeal.driver_cash = 0;
			vm.aTripData.vendorDeal.toll_tax = 0;
			vm.aTripData.vendorDeal.other_charges = 0;
			vm.aTripData.vendorDeal.other_charges_remark = '';
			vm.aTripData.vendorDeal.account_payment = 0;
		}
	}

	function validateObj(obj, type) {
		console.log(obj, type);
		if (!(obj.type && obj.amount && obj.from && obj.to))
			return swal('Error', 'All Mandatory Fields should be filled', 'error');

		// if (type != 'deduction' && obj.type.name != 'Other Charges' && obj.type.name != 'Chalan Charges RTO') {
		// 	obj.applyTDS = true;
		// 	obj.tdsAmount = Math.round((obj.amount * vm.aTripData.vendorDeal.tdsPercent) / 100);
		// }

		if (obj.date)
			obj.date = moment(obj.date, 'DD/MM/YYYY').toISOString();

		if (type == 'deduction') {
			vm.totalDeduction = (vm.totalDeduction || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalDeduction = vm.totalDeduction;
		} else {
			vm.totalExtraCharges = (vm.totalExtraCharges || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalCharges = vm.totalExtraCharges;
			// obj.tdsAmount =  Math.ceil((obj.amount * vm.aTripData.vendorDeal.tdsPercent)/100);
			if (vm.dealAcc) {
				obj.tdsAccountObj = {
					_id: vm.dealAcc.vDealTDSAcc,
					name: vm.dealAcc.vDealTDSAccName
				};
			}
		}

		vm.aTripData.vendorDeal[type] = vm.aTripData.vendorDeal[type] || {};
		vm.aTripData.vendorDeal[type][obj.type.value] = angular.copy({
			...obj,
			typ: obj.type.name,
			fromName: obj.from.name,
			toName: obj.to.name,
			narration: obj.narration || obj.amount + ' ' + obj.type.name + ' Added'
		});
	}

	function remove(obj, key, type) {
		if (type == 'deduction') {
			vm.totalDeduction -= obj[key].amount;
			vm.aTripData.vendorDeal.totalDeduction = vm.totalDeduction;
		} else {
			vm.totalExtraCharges -= obj[key].amount;
			vm.aTripData.vendorDeal.totalCharges = vm.totalExtraCharges;
		}
		delete vm.aTripData.vendorDeal[type][key];
	}

	function calculateTotalPMT() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.pmtWeight || 0) * (vm.aTripData.vendorDeal.pmtRate || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function calculateTotalPUnit() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.perUnitPrice || 0) * (vm.aTripData.vendorDeal.totalUnits || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function resetAll() {
		vm.aTripData.vendorDeal.total_expense = undefined;
		vm.aTripData.vendorDeal.munshiyana = undefined;
		vm.aTripData.vendorDeal.advance = undefined;
		vm.aTripData.vendorDeal.toPay = undefined;
		vm.aTripData.vendorDeal.pmtWeight = undefined;
		vm.aTripData.vendorDeal.pmtRate = undefined;
		vm.aTripData.vendorDeal.perUnitPrice = undefined;
		vm.aTripData.vendorDeal.totalUnits = undefined;
	}

	function changeAcPayment() {
		vm.aTripData.vendorDeal.account_payment = (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.diesel ? (vm.aTripData.vendorDeal.diesel.amount || 0) : 0) - (vm.aTripData.vendorDeal.driver_cash || 0) - (vm.aTripData.vendorDeal.toll_tax || 0) - (vm.aTripData.vendorDeal.other_charges || 0);
	}

	function changeAdvance(type) {

		var tot_exp = angular.copy(vm.aTripData.vendorDeal.total_expense);
		var joint_exp = (vm.aTripData.vendorDeal.toPay || 0) + (vm.aTripData.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (type === 'advance') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (vm.aTripData.vendorDeal.payment_type === 'To pay' || vm.aTripData.vendorDeal.payment_type === 'To be billed') {
			// vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
			vm.aTripData.vendorDeal.advance = 0;
		}
	}

	$scope.removeUser = function (select, index) {
		$scope.aTrafficManager.splice(index, 1);
	}

	function getQuotationData (id) {
        bookingServices.getVendorQuotation({booking: id}, onSuc, err => {
            console.log(err);
        });
        function onSuc(response) {
            if(response) {
                $scope.receivedQuotation = response && response.data && response.data.data;
            }
		}
    }

	// add or modify traffic manager
	function submit(formData) {
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.vehicle)) {
			return swal('Error!', 'Vehicle is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.payment_type)) {
			return swal('Error!', 'Payment Type is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.weight_type)) {
			return swal('Error!', 'Payment Basis is required', 'error');
		}
		if (vm.aTripData.vendorDeal) {

			if (vm.aTripData.vendorDeal.total_expense <= vm.aTripData.vendorDeal.munshiyana) {
				return swal('Error', 'Total Expense should be greater than Munshiyana', 'error');
			}
			if(!vm.aTripData.vendorDeal.total_expense) {
				return swal('Error', 'Please Enter Total', 'error');
			}
			if(!vm.aTripData.vendorDeal.customer) {
				return swal('Error', 'Please Enter Customer', 'error');
			}
			if(!vm.aTripData.vendorDeal.billingParty) {
				return swal('Error', 'Please Enter Billing Party', 'error');
			}
			if(!vm.aTripData.vendorDeal.tMemo) {
				return swal('Error', 'Please Enter Slip No', 'error');
			}
			if(!(vm.bookInfo && vm.bookInfo._id)) {
				return swal('Error', 'Please Enter valid Slip No', 'error');
			}
			if(!vm.aTripData.vendorDeal.tripMemoDate) {
				return swal('Error', 'Please Enter Trip memo date', 'error');
			}

			vm.aTripData.vendorDeal.total_expense = vm.aTripData.vendorDeal.total_expense || 0;
			vm.aTripData.vendorDeal.munshiyana = vm.aTripData.vendorDeal.munshiyana || 0;
			vm.aTripData.vendorDeal.advance = vm.aTripData.vendorDeal.advance || 0;
			vm.aTripData.vendorDeal.totalCharges = vm.aTripData.vendorDeal.totalCharges || 0;
			vm.aTripData.vendorDeal.totalDeduction = vm.aTripData.vendorDeal.totalDeduction || 0;
			vm.aTripData.vendorDeal.totWithMunshiyana = vm.aTripData.vendorDeal.totWithMunshiyana || 0;
			vm.aTripData.vendorDeal.toPay = vm.aTripData.vendorDeal.toPay || 0;
			vm.aTripData.vendorDeal.tdsAmount = vm.aTripData.vendorDeal.tdsAmount || 0;
			if(vm.aTripData.vendorDeal.advance > vm.aTripData.vendorDeal.totWithMunshiyana) {
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
		}

		vm.aTripData.vendorDeal['rate'] = vm.aTripData.vendorDeal.total_expense;
		vm.aTripData.vendorDeal['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;
		const oGr = {};
		const oTripMemo = {};
		if(vm.aTripData.vendorDeal.grNumber && (vm.aTripData.vendorDeal.grNumber.bookNo || vm.aTripData.vendorDeal.grNumber))
			oGr['grNumber'] = vm.aTripData.vendorDeal.grNumber.bookNo || vm.aTripData.vendorDeal.grNumber;
		if(vm.aTripData.vendorDeal.grDate)
			oGr['grDate'] = new Date(vm.aTripData.vendorDeal.grDate.setHours(0,0,0,0));
		if(vm.aTripData.vendorDeal.grBookInfo && vm.aTripData.vendorDeal.grBookInfo._id){
			oGr['stationaryId']  = vm.aTripData.vendorDeal.grBookInfo._id;
		}
		if(vm.aTripData.vendorDeal.charges)
			oGr['charges'] = vm.aTripData.vendorDeal.charges;
		if(vm.aTripData.vendorDeal.deduction)
			oGr['deduction'] = vm.aTripData.vendorDeal.deduction;

		if(vm.aTripData.vendorDeal.totalCharges)
			oGr['totalCharges'] = vm.aTripData.vendorDeal.totalCharges;
		if(vm.aTripData.vendorDeal.totalDeduction)
			oGr['totalDeduction'] = vm.aTripData.vendorDeal.totalDeduction;
		if(vm.aTripData.vendorDeal.basicFreight)
			oGr['basicFreight'] = vm.aTripData.vendorDeal.basicFreight;
		if(vm.aTripData.vendorDeal.totalFreight)
			oGr['totalFreight'] = vm.aTripData.vendorDeal.totalFreight;

		// oTripMemo['vendorName'] = vm.aTripData.vendorDeal.selectedVendor.name ? vm.aTripData.vendorDeal.selectedVendor.name : vm.aTripData.vendorDeal.selectedVendor;
		oTripMemo['customer'] = vm.aTripData.vendorDeal.customer;
		oTripMemo['billingParty'] = vm.aTripData.vendorDeal.billingParty;
		oTripMemo['vehicleId'] = vm.aTripData.vendorDeal.vehicle._id;
		oTripMemo['tMNo'] = vm.aTripData.vendorDeal.tMemo.bookNo || vm.aTripData.vendorDeal.tMemo;
		oTripMemo['stationaryId'] = vm.bookInfo._id;
		oTripMemo['date'] = vm.aTripData.vendorDeal.tripMemoDate;
		// oTripMemo['dealDate'] = vm.aTripData.vendorDeal.date;
		oTripMemo['rate'] = vm.aTripData.vendorDeal.total_expense;
		oTripMemo['advance'] = vm.aTripData.vendorDeal.advance || 0;
		oTripMemo['toPay'] = vm.aTripData.vendorDeal.toPay || 0;
		oTripMemo['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;
		oTripMemo['munshiyana'] = vm.aTripData.vendorDeal.munshiyana || 0;
		oTripMemo['remark'] = vm.aTripData.vendorDeal.remark;
		oTripMemo['payment_type'] = vm.aTripData.vendorDeal.payment_type;
		oTripMemo['weight_type'] = vm.aTripData.vendorDeal.weight_type;
		oTripMemo['pmtWeight'] = vm.aTripData.vendorDeal.pmtWeight || undefined;
		oTripMemo['pmtRate'] = vm.aTripData.vendorDeal.pmtRate || undefined;
		oTripMemo['perUnitPrice'] = vm.aTripData.vendorDeal.perUnitPrice || undefined;
		oTripMemo['totalUnits'] = vm.aTripData.vendorDeal.totalUnits || undefined;
		if(vm.bookInfo && vm.bookInfo._id)
			oTripMemo.stationaryId = vm.bookInfo._id;
		// $scope.oTripMemo = oTripMemo;
		// swal("Success", 'Trip Memo details added in booking', "success");
		if (oTripMemo || oGr) {
			swal('success', 'Trip Memo details added in booking', 'success');
			$uibModalInstance.dismiss({TripMemo: oTripMemo, Gr: oGr});
		}

	}

});

//  Add the Broker Memo

materialAdmin.controller('addbMemoControllers', function (
	$scope,
	$modal,
	selectedInfo,
	isEdit,
	brokerMemo,
	$uibModalInstance,
	DatePicker,
	userService,
    bookingServices,
    Vendor,
	billsService,
	$stateParams,
	$uibModal,
	formulaFactory,
	Vehicle,
	billingPartyService,
	consignorConsigneeService,
	customer,
	$rootScope,
	bookType,
	billBookService,
	oBrokerMemo,
	showDeductionCharges
) {
    let vm = this;
	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.getAllUsers = getAllUsers;

	// functions Identifiers
	$scope.submit = submit;
	$scope.closeModal = closeModal;
	$scope.resetForm = resetForm;
	vm.getBillBookNo = getBillBookNo;
	vm.getVendorName = getVendorName;
	vm.getAllBillingParty = getAllBillingParty;
	vm.getCustomers = getCustomers;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.onConsignorSelect = onConsignorSelect;
	vm.onConsigneeSelect =  onConsigneeSelect;
	vm.getConsignee =  getConsignee;
	vm.getConsignor =  getConsignor;
	vm.getTDSRate = getTDSRate;
	vm.getVname = getVname;
	vm.addTransporter = addTransporter;
	vm.getQuotationData = getQuotationData;
	vm.changeAdvance = changeAdvance;
	vm.calculateTotalPMT = calculateTotalPMT;
	vm.calculateTotalPUnit = calculateTotalPUnit;
	vm.changeAcPayment = changeAcPayment;
	vm.formulaCommonCalFun = formulaCommonCalFun;
	vm.changePayType = changePayType;
	vm.getGrBookNo = getGrBookNo;
	vm.validateObj = validateObj;
	vm.munsiyanaFromula = new formulaFactory('Total With Munshiyana');
	vm.resetAll = resetAll;
	// INIT functions
    (function init() {
		vm.isShowBrokerMemo = brokerMemo;
		$scope.brokerMemoBType = bookType;
		$scope.oBrokerMemo = angular.copy(oBrokerMemo);
		$scope.showDeductionCharges = showDeductionCharges;
		vm.aTripData = angular.copy(selectedInfo);
		vm.aTripData.vendorDeal.perUnitPrice = selectedInfo.vendorDeal.weight_per_unit || selectedInfo.vendorDeal.perUnitPrice;
		vm.aTripData.vendorDeal.totalUnits = selectedInfo.vendorDeal.total_no_of_units || selectedInfo.vendorDeal.totalUnits;
		vm.branch = vm.aTripData.vendorDeal.branch;
		if(vm.aTripData.vendorDeal.grNumber && vm.aTripData.vendorDeal.stationaryId)
			vm.aTripData.vendorDeal.grBookInfo = {_id:vm.aTripData.vendorDeal.stationaryId, bookNo: vm.aTripData.vendorDeal.grNumber}
		// check that user has already prefill the trip memo no, date etc.
		if($scope.oBrokerMemo) {
			// vm.aTripData.vendorDeal.selectedVendor = $scope.oTripMemo.vendorName;
			vm.aTripData.vendorDeal.customer = $scope.oBrokerMemo.customer;
			vm.aTripData.vendorDeal.billingParty = $scope.oBrokerMemo.billingParty;
			vm.aTripData.vendorDeal.bMemo = $scope.oBrokerMemo.bmNo;
			vm.aTripData.vendorDeal.brokerMemoDate = new Date($scope.oBrokerMemo.date);
			// vm.aTripData.vendorDeal.date = new Date($scope.oTripMemo.dealDate);
			vm.aTripData.vendorDeal.advance = $scope.oBrokerMemo.advance;
			vm.aTripData.vendorDeal.munshiyana = $scope.oBrokerMemo.munshiyana;
			vm.aTripData.vendorDeal.total_expense = $scope.oBrokerMemo.rate;
			vm.aTripData.vendorDeal.remark = $scope.oBrokerMemo.remark;
			vm.aTripData.vendorDeal.weight_type = $scope.oBrokerMemo.weight_type;
			vm.aTripData.vendorDeal.total = $scope.oBrokerMemo.totWithMunshiyana;
			vm.aTripData.vendorDeal.toPay = $scope.oBrokerMemo.toPay;
			vm.aTripData.vendorDeal.payment_type = $scope.oBrokerMemo.payment_type;
			vm.aTripData.vendorDeal.pmtWeight = $scope.oBrokerMemo.pmtWeight;
			vm.aTripData.vendorDeal.pmtRate = $scope.oBrokerMemo.pmtRate;
			vm.aTripData.vendorDeal.perUnitPrice = $scope.oBrokerMemo.perUnitPrice;
			vm.aTripData.vendorDeal.totalUnits = $scope.oBrokerMemo.totalUnits;
			if($scope.oBrokerMemo.bmNo && $scope.oBrokerMemo.stationaryId){
				vm.bookInfo = {_id: $scope.oBrokerMemo.stationaryId, bookNo: $scope.oBrokerMemo.bmNo}
			}
		}
		if($scope.$user && $scope.$user.user_type && $scope.$user.user_type.length && $scope.$user.user_type.indexOf('Broker')+1) {
			$scope.isBroker = true;
			vm.aTripData.vendorDeal.customer = {_id: $scope.$user.brokerCustomer};
			vm.aTripData.vendorDeal.billingParty ={_id: $scope.$user.brokerbp};
		}
		vm.aWeightTypes = angular.copy($scope.$constants.aWeightTypes);
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.pmt) {
			vm.aWeightTypes.push('PMT');
		}
		if ($scope.$configs.vendorDeal && $scope.$configs.vendorDeal.percentage) {
			vm.aWeightTypes.push('Percentage');
		}
		
		vm.oDeduction = {};
		vm.oExtraCharges = {};
		vm.oExtraCharges.date = new Date();
		vm.oDeduction.date = new Date();
		vm.aDeduction = [];
		vm.aExtraCharges = [];
		vm.aCharges = [];
		vm.aDeductionCharges = [];
		// vm.aTripData.vendorDeal = vm.aTripData.vendorDeal || {};
		vm.aTripData.vendorDeal.charges = vm.aTripData.vendorDeal.charges || {};
		vm.aTripData.vendorDeal.deduction = vm.aTripData.vendorDeal.deduction || {};

		if (!vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.totWithMunshiyana)
			formulaCommonCalFun();

		$scope.$watchGroup(['bMemoVm.aTripData.vendorDeal.munshiyana', 'bMemoVm.aTripData.vendorDeal.total_expense', 'bMemoVm.aTripData.vendorDeal.otherExp'], function (...aMod) {
			formulaCommonCalFun();
		});

	})();

	(function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				vm.aVehicleTypes = res.data.data;
				let findItem;
				if($scope.oBrokerMemo) {
					findItem = vm.aVehicleTypes.find(item => item._id === $scope.oBrokerMemo.vehicleId);
					if(findItem) {
						vm.aTripData.vendorDeal.vehicle = findItem;
					}
				} else {
					findItem = vm.aVehicleTypes.find(item => item._id === vm.aTripData.vendorDeal.vt);
					if(findItem) {
						vm.aTripData.vendorDeal.vehicle = findItem;
					}
				}
			}
		}

		function failType(res) {
			vm.aVehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	})();

	// Operations
	if (typeof oBooking !== 'undefined' && oBooking !== null) {
		$scope.oTest = angular.copy(oBooking); //initialize with param

	}

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function resetForm() {
		vm.aTripData.vendorDeal = {};
		$scope.oBrokerMemo = {};
		// delete $rootScope.aVehicleSelected[0] && $rootScope.aVehicleSelected[0].gr[0] && $rootScope.aVehicleSelected[0].gr[0].gr_type;
		swal("Success", 'All Trip Memo details are removed successfully', "success");
		$uibModalInstance.dismiss();
	}


	function getBillBookNo(viewValue) {

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
		// 	swal('Warning', 'Please Select Branch', 'warning');
		// 	return [];
		// }

		// if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
		// 	return [];

		if (viewValue != 'centrailized' && !(vm.branch && Array.isArray(vm.branch.brokerMemoBook) && vm.branch.brokerMemoBook.length))
			return;


		if (!vm.aTripData.vendorDeal.brokerMemoDate) {
			swal('Error', 'Broker Memo Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.branch && vm.branch.brokerMemoBook ? vm.branch.brokerMemoBook.map(o => o.ref) : '',
				type: 'Broker Memo',
				useDate: moment(vm.aTripData.vendorDeal.brokerMemoDate).startOf('day').toDate(),
				status: 'unused'
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.aTripData.vendorDeal.bMemo = response.data[0].bookNo;
						vm.bookInfo = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	vm.onBookNoSelect = function(item) {
		vm.bookInfo = item;
	}


	function getGrBookNo(viewValue) {

		if (viewValue != 'centrailized' && !(vm.branch && Array.isArray(vm.branch.grBook) && vm.branch.grBook.length))
			return;


		if (!vm.aTripData.vendorDeal.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.branch.grBook ? vm.branch.grBook.map(o => o.ref) : '',
				type: 'Gr',
				useDate: moment(vm.aTripData.vendorDeal.grDate).startOf('day').toDate(),
				status: 'unused'
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.aTripData.vendorDeal.grNumber = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	vm.onGrBookSelect = function(item) {
		vm.aTripData.vendorDeal.grBookInfo = item;
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
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

	function onCustomerSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.customer = value;
		}
	}

	function onBillingPartySelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.billingParty = value;
		}
	}

	function getAllBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function onConsigneeSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignee = value;
		}
	}

	function onConsignorSelect(value) {
		if(value) {
			vm.aTripData.vendorDeal.consignor = value;
		}
	}

	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}


	function formulaCommonCalFun() {
		vm.munsiyanaFromula.bind({
			'munshiyana': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.munshiyana,
			'total_expense': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.total_expense,
			'otherExp': vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.otherExp
		});
		vm.aTripData.vendorDeal.totWithMunshiyana = Math.round(vm.munsiyanaFromula.eval());
	}

	function addTransporter () {
		$rootScope.opertaionType = 'add';
		var modalInstance = $uibModal.open({
			templateUrl: 'views/vehicleAllcation/vendorPopup.html',
			controller: 'addNewTransporterCtrl',
			size: 'lg',
			resolve: {
				'selectedTransporter': function () {
					return true;
				}
			}
	});

	modalInstance.result.then(function (response) {
		if(response) {
			 vm.aTripData.vendorDeal.selectedVendor = response;
		}

	}, function (data) {
		console.log('cancel');
	});
	}

    function getVendorName(viewValue, elseObj = false) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
			}

			let res = {
				deleted: false,
				category:{$in:["Transporter"]}
			};

			if (elseObj)
				Object.assign(res, elseObj);
			else
				res.name = viewValue;

			if ((vm.aTripData.vendor && vm.aTripData.vendor.clientId) || (vm.aTripData.vendor_id && vm.aTripData.vendor_id.clientId))
				res.cClientId = vm.aTripData.vendor && vm.aTripData.vendor.clientId || vm.aTripData.vendor_id.clientId;

			Vendor.getName(res, oSuc, oFail);
		});
    }

    function getTDSRate() {
		if (vm.tdsVerify && vm.tdsCategory && vm.tdsSources && vm.vendorAccnt && vm.aTripData.vendorDeal.deal_at) {
			let oReq = {
				date: vm.aTripData.vendorDeal.deal_at,
				cClientId: $scope.selectedClient
			};
			let isGetTDS = true;
			if(vm.aTripData.vendor && vm.aTripData.vendor.exeRate && vm.aTripData.vendor.exeFrom && vm.aTripData.vendor.exeTo){
				if(new Date(vm.aTripData.vendorDeal.deal_at) >= new Date(vm.aTripData.vendor.exeFrom) && new Date(vm.aTripData.vendorDeal.deal_at) <= new Date(vm.aTripData.vendor.exeTo)) {
					vm.aTripData.vendorDeal.tdsPercent = vm.aTripData.vendor.exeRate;
					isGetTDS = false;
				}
			}

			if(isGetTDS)
			billsService.getTDSRate(oReq, onSuccess, onFailure);


			function onSuccess(res) {
				if (res.data && res.data.data && res.data.data.length) {
					vm.allTDSRate = res.data.data[0];
					vm.allTDSRate.aRate.forEach(obj => {
						if (obj.sources === vm.tdsSources) {
							switch (vm.tdsCategory) {
								case 'Individuals or HUF': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.ipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.panNumber)
										return vm.aTripData.vendorDeal.tdsPercent = obj.nipRate;
									else
										return vm.aTripData.vendorDeal.tdsPercent = obj.niwpRate;
								}
								default:
									return vm.aTripData.vendorDeal.tdsPercent = 0;
							}
						}
					});
				}
			}

			function onFailure(err) {

			}
		}

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

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			// let req = {
			// 	veh_type_name: viewValue
			// };
			return new Promise(function (resolve, reject) {
				Vehicle.getNameTrim(viewValue, oSuc, oFail);

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

	function changePayType(pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0);
			vm.aTripData.vendorDeal.advance = 0;
			if (vm.aTripData.vendorDeal.diesel) {
				vm.aTripData.vendorDeal.diesel.quantity = 0;
				vm.aTripData.vendorDeal.diesel.rate = 0;
				vm.aTripData.vendorDeal.diesel.amount = 0;
			}
			vm.aTripData.vendorDeal.driver_cash = 0;
			vm.aTripData.vendorDeal.toll_tax = 0;
			vm.aTripData.vendorDeal.other_charges = 0;
			vm.aTripData.vendorDeal.other_charges_remark = '';
			vm.aTripData.vendorDeal.account_payment = 0;
		}
	}

	function validateObj(obj, type) {
		console.log(obj, type);
		if (!(obj.type && obj.amount && obj.from && obj.to))
			return swal('Error', 'All Mandatory Fields should be filled', 'error');

		if (obj.date)
			obj.date = moment(obj.date, 'DD/MM/YYYY').toISOString();

		if (type == 'deduction') {
			vm.totalDeduction = (vm.totalDeduction || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalDeduction = vm.totalDeduction;
		} else {
			vm.totalExtraCharges = (vm.totalExtraCharges || 0) + obj.amount;
			vm.aTripData.vendorDeal.totalCharges = vm.totalExtraCharges;
			// obj.tdsAmount =  Math.ceil((obj.amount * vm.aTripData.vendorDeal.tdsPercent)/100);
			if (vm.dealAcc) {
				obj.tdsAccountObj = {
					_id: vm.dealAcc.vDealTDSAcc,
					name: vm.dealAcc.vDealTDSAccName
				};
			}
		}

		vm.aTripData.vendorDeal[type] = vm.aTripData.vendorDeal[type] || {};
		vm.aTripData.vendorDeal[type][obj.type.value] = angular.copy({
			...obj,
			typ: obj.type.name,
			fromName: obj.from.name,
			toName: obj.to.name,
			narration: obj.narration || obj.amount + ' ' + obj.type.name + ' Added'
		});
	}

	function calculateTotalPMT() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.pmtWeight || 0) * (vm.aTripData.vendorDeal.pmtRate || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function calculateTotalPUnit() {
		vm.aTripData.vendorDeal.total_expense = (vm.aTripData.vendorDeal.perUnitPrice || 0) * (vm.aTripData.vendorDeal.totalUnits || 0);
		changeAdvance('total');
		changeAcPayment();
	}

	function resetAll() {
		vm.aTripData.vendorDeal.total_expense = undefined;
		vm.aTripData.vendorDeal.munshiyana = undefined;
		vm.aTripData.vendorDeal.advance = undefined;
		vm.aTripData.vendorDeal.toPay = undefined;
		vm.aTripData.vendorDeal.pmtWeight = undefined;
		vm.aTripData.vendorDeal.pmtRate = undefined;
		vm.aTripData.vendorDeal.perUnitPrice = undefined;
		vm.aTripData.vendorDeal.totalUnits = undefined;
	}

	function changeAcPayment() {
		vm.aTripData.vendorDeal.account_payment = (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.diesel ? (vm.aTripData.vendorDeal.diesel.amount || 0) : 0) - (vm.aTripData.vendorDeal.driver_cash || 0) - (vm.aTripData.vendorDeal.toll_tax || 0) - (vm.aTripData.vendorDeal.other_charges || 0);
	}

	function changeAdvance(type) {

		var tot_exp = angular.copy(vm.aTripData.vendorDeal.total_expense);
		var joint_exp = (vm.aTripData.vendorDeal.toPay || 0) + (vm.aTripData.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (type === 'advance') {
			// vm.aTripData.vendorDeal.toPay = ((vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0)) - (vm.aTripData.vendorDeal.advance || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
		}
		if (vm.aTripData.vendorDeal.payment_type === 'To pay' || vm.aTripData.vendorDeal.payment_type === 'To be billed') {
			// vm.aTripData.vendorDeal.toPay = (vm.aTripData.vendorDeal.total_expense || 0) - (vm.aTripData.vendorDeal.munshiyana || 0) - (vm.aTripData.vendorDeal.tdsAmount || 0);
			vm.aTripData.vendorDeal.advance = 0;
		}
	}

	$scope.removeUser = function (select, index) {
		$scope.aTrafficManager.splice(index, 1);
	}

	function getQuotationData (id) {
        bookingServices.getVendorQuotation({booking: id}, onSuc, err => {
            console.log(err);
        });
        function onSuc(response) {
            if(response) {
                $scope.receivedQuotation = response && response.data && response.data.data;
            }
		}
    }

	// add or modify traffic manager
	function submit(formData) {
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.vehicle)) {
			return swal('Error!', 'Vehicle is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.payment_type)) {
			return swal('Error!', 'Payment Type is required', 'error');
		}
		if(!(vm.aTripData && vm.aTripData.vendorDeal && vm.aTripData.vendorDeal.weight_type)) {
			return swal('Error!', 'Payment Basis is required', 'error');
		}
		if (vm.aTripData.vendorDeal) {

			if (vm.aTripData.vendorDeal.total_expense <= vm.aTripData.vendorDeal.munshiyana) {
				return swal('Error', 'Total Expense should be greater than Munshiyana', 'error');
			}
			if(!vm.aTripData.vendorDeal.total_expense) {
				return swal('Error', 'Please Enter Total', 'error');
			}
			// if(!vm.aTripData.vendorDeal.customer) {
			// 	return swal('Error', 'Please Enter Customer', 'error');
			// }
			// if(!vm.aTripData.vendorDeal.billingParty) {
			// 	return swal('Error', 'Please Enter Billing Party', 'error');
			// }
			if(!vm.aTripData.vendorDeal.bMemo) {
				return swal('Error', 'Please Enter Slip No', 'error');
			}
			if(!(vm.bookInfo && vm.bookInfo._id)) {
				return swal('Error', 'Please Enter valid Slip No', 'error');
			}
			if(!vm.aTripData.vendorDeal.brokerMemoDate) {
				return swal('Error', 'Please Enter Broker memo date', 'error');
			}

			vm.aTripData.vendorDeal.total_expense = vm.aTripData.vendorDeal.total_expense || 0;
			vm.aTripData.vendorDeal.munshiyana = vm.aTripData.vendorDeal.munshiyana || 0;
			vm.aTripData.vendorDeal.advance = vm.aTripData.vendorDeal.advance || 0;
			vm.aTripData.vendorDeal.totalCharges = vm.aTripData.vendorDeal.totalCharges || 0;
			vm.aTripData.vendorDeal.totalDeduction = vm.aTripData.vendorDeal.totalDeduction || 0;
			vm.aTripData.vendorDeal.totWithMunshiyana = vm.aTripData.vendorDeal.totWithMunshiyana || 0;
			vm.aTripData.vendorDeal.toPay = vm.aTripData.vendorDeal.toPay || 0;
			vm.aTripData.vendorDeal.tdsAmount = vm.aTripData.vendorDeal.tdsAmount || 0;
			if(vm.aTripData.vendorDeal.advance > vm.aTripData.vendorDeal.totWithMunshiyana) {
				return swal('Error', 'Advance should not be greater than total', 'error');
			}
		}

		vm.aTripData.vendorDeal['rate'] = vm.aTripData.vendorDeal.total_expense;
		vm.aTripData.vendorDeal['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;
		const oGr = {};
		const oBrokerMemo = {};
		if(vm.aTripData.vendorDeal.grNumber && (vm.aTripData.vendorDeal.grNumber.bookNo || vm.aTripData.vendorDeal.grNumber))
			oGr['grNumber'] = vm.aTripData.vendorDeal.grNumber.bookNo || vm.aTripData.vendorDeal.grNumber;
		if(vm.aTripData.vendorDeal.grDate)
			oGr['grDate'] = new Date(vm.aTripData.vendorDeal.grDate.setHours(0,0,0,0));
		if(vm.aTripData.vendorDeal.grBookInfo && vm.aTripData.vendorDeal.grBookInfo._id){
			oGr['stationaryId']  = vm.aTripData.vendorDeal.grBookInfo._id;
		}
		if(vm.aTripData.vendorDeal.charges)
			oGr['charges'] = vm.aTripData.vendorDeal.charges;
		if(vm.aTripData.vendorDeal.deduction)
			oGr['deduction'] = vm.aTripData.vendorDeal.deduction;

		if(vm.aTripData.vendorDeal.totalCharges)
			oGr['totalCharges'] = vm.aTripData.vendorDeal.totalCharges;
		if(vm.aTripData.vendorDeal.totalDeduction)
			oGr['totalDeduction'] = vm.aTripData.vendorDeal.totalDeduction;
		if(vm.aTripData.vendorDeal.basicFreight)
			oGr['basicFreight'] = vm.aTripData.vendorDeal.basicFreight;
		if(vm.aTripData.vendorDeal.totalFreight)
			oGr['totalFreight'] = vm.aTripData.vendorDeal.totalFreight;

		oBrokerMemo['vendor'] = vm.aTripData.vendorDeal.selectedVendor._id ? vm.aTripData.vendorDeal.selectedVendor._id : vm.aTripData.vendorDeal.selectedVendor;
		oBrokerMemo['vendorName'] = vm.aTripData.vendorDeal.selectedVendor.name;
		oBrokerMemo['customer'] = vm.aTripData.vendorDeal.customer;
		oBrokerMemo['billingParty'] = vm.aTripData.vendorDeal.billingParty;
		oBrokerMemo['vehicleId'] = vm.aTripData.vendorDeal.vehicle._id;
		oBrokerMemo['podCustomer'] = vm.aTripData.vendorDeal.podCustomer;
		oBrokerMemo['bmNo'] = vm.aTripData.vendorDeal.bMemo.bookNo || vm.aTripData.vendorDeal.bMemo;
		oBrokerMemo['stationaryId'] = vm.bookInfo._id;
		oBrokerMemo['date'] = vm.aTripData.vendorDeal.brokerMemoDate;
		oBrokerMemo['dealDate'] = vm.aTripData.vendorDeal.date;
		oBrokerMemo['rate'] = vm.aTripData.vendorDeal.total_expense;
		oBrokerMemo['advance'] = vm.aTripData.vendorDeal.advance || 0;
		oBrokerMemo['toPay'] = vm.aTripData.vendorDeal.toPay || 0;
		oBrokerMemo['total'] = vm.aTripData.vendorDeal.totWithMunshiyana;
		oBrokerMemo['munshiyana'] = vm.aTripData.vendorDeal.munshiyana || 0;
		oBrokerMemo['remark'] = vm.aTripData.vendorDeal.remark;
		oBrokerMemo['payment_type'] = vm.aTripData.vendorDeal.payment_type;
		oBrokerMemo['weight_type'] = vm.aTripData.vendorDeal.weight_type;
		oBrokerMemo['pmtWeight'] = vm.aTripData.vendorDeal.pmtWeight || undefined;
		oBrokerMemo['pmtRate'] = vm.aTripData.vendorDeal.pmtRate || undefined;
		oBrokerMemo['perUnitPrice'] = vm.aTripData.vendorDeal.perUnitPrice || undefined;
		oBrokerMemo['totalUnits'] = vm.aTripData.vendorDeal.totalUnits || undefined;
		if(vm.bookInfo && vm.bookInfo._id)
			oBrokerMemo.stationaryId = vm.bookInfo._id;
		// $scope.oTripMemo = oTripMemo;
		// swal("Success", 'Trip Memo details added in booking', "success");
		if (oBrokerMemo || oGr) {
			swal('success', 'Broker Memo details added in booking', 'success');
			$uibModalInstance.dismiss({BrokerMemo: oBrokerMemo, Gr: oGr});
		}

	}

});
materialAdmin.controller("previewVendorPopUpCtrl", function ($rootScope, $scope, oVendor, growlService, $uibModalInstance, Vendor) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.vendor = oVendor;


});

materialAdmin.controller('addNewTransporterCtrl', function (
	$rootScope,
	$scope,
	$state,
	otherUtils,
	DatePicker,
	Vendor,
	selectedTransporter,
	$uibModalInstance
) {
	$scope.aGSTstates = otherUtils.getState();
	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
	$scope.setStateCode = function(state){
		$scope.vendor.ho_address.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};
	$scope.banking = {};
	$scope.vendorAc = {};
	if(!$rootScope.vendor){
		$scope.vendor = {};
		$scope.vendor.clientId = $scope.selectedClient;
	}else{
		$scope.vendor = $rootScope.vendor;
	}
	if($scope.vendor && $scope.vendor.ho_address && $scope.vendor.ho_address.country) {
		$scope.vendor.ho_address.country = $scope.vendor.ho_address.country;
	}else {
		$scope.vendor.ho_address = {
			country: 'India'
		};
	}

	// for stc if broker is using then category will be transporter by default prefilled
	if($scope.$user && $scope.$user.user_type && $scope.$user.user_type.length && $scope.$user.user_type.indexOf('Broker')+1) {
		$scope.isBroker = true;
		$scope.$constants.aVendorCategory.push("Transporter");
		$scope.vendor.category = [];
		$scope.vendor.category.push("Transporter");
	}

	$scope.client_allowed = angular.copy($scope.$configs.client_allowed);
	if($scope.vendor.account){
		$scope.vendor.account.forEach(item => {
			$scope.client_allowed.forEach(itm =>{
				if(item.clientId === itm.clientId){
					itm.vendorAccountObj = item.ref;
			}
			});
	});
	}
	if($scope.client_allowed &&  $scope.client_allowed.length == 1 && $scope.client_allowed[0].vendorAccountObj){
		$scope.readonlyAc = true;
	}else{
		$scope.readonlyAc = false;
	}


	if ($scope.$configs.clientOps) {
		$scope.vendor.clientR =  $scope.$configs.clientOps;
	}else {
		$scope.vendor.clientR =  $scope.selectedClient;
	}
	$scope.bindContactPerson = function() {
		if($scope.$configs.master && $scope.$configs.master.vendor && $scope.$configs.master.vendor.upDateField) {
			$scope.vendor.contact_person_name = $scope.vendor.name;
			$scope.vendor.phn = $scope.vendor.name
		}
	}

	$scope.submitForm = function(){
		if(!$scope.vendor.pan_no) {
			return swal('Required', 'Pan No. is required', 'error');
		}
		if(!$scope.isBroker && !$scope.vendor.prim_contact_no) {
			return swal('Required', 'Vendor Mob. No. is required', 'error');
		}
		const pattern = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
		const found = $scope.vendor.pan_no.match(pattern);
		if(!found) {
			return swal('Error', 'Invalid Pan No. It should be Like ALWPG5809L', 'error');
		}
		function success(response) {
			// console.log(response);
			if($rootScope.opertaionType === 'update')
				var msg = 'Vendor Updated Successfully!';
			else if($rootScope.opertaionType === 'add')
				var msg = 'Vendor Added Successfully!';

			// swal(msg);
			if(selectedTransporter) {
				$uibModalInstance.close(response.data);
			} else {
				$rootScope.opertaionType='show';
				$state.go('masters.vendorRegistration.profile.basicInfo');
			}

		}
		function failure(response) {
			console.log(response);
			response = response.data;
			let msg = response.message || 'Message not defined';
			swal('Error!', msg, 'error');
		}

		if($scope.client_allowed){
			$scope.vendor.account = [];
				$scope.client_allowed.forEach(item =>{
					if(item.vendorAccountObj && item.vendorAccountObj._id){
						$scope.vendor.account.push({
							clientId: item.clientId,
							ref: item.vendorAccountObj
						});
					}
			});
		}

		if($scope.vendor.exeRate && !($scope.vendor.exeFrom || $scope.vendor.exeTo))
			return swal('warning', "Both exeFrom and exeTo Date should be Filled",'warning');

		if($rootScope.opertaionType === 'update')
			Vendor.updateTransportVendor(angular.copy($scope.vendor),success,failure);
		else if($rootScope.opertaionType === 'add')
			Vendor.putTransportVendor(angular.copy($scope.vendor),success,failure);
	};
});

materialAdmin.controller("addNewMvehicleCtrl", function ($rootScope, $scope, $uibModalInstance, thatData, growlService, formValidationgrowlService,accountingService, Vehicle, Driver, Vendor) {

	$scope.newVeh = {};

	if ($rootScope.selectedVendorInfo) {
		$scope.newVeh.vendor = {
			_id: $rootScope.selectedVendorInfo._id,
			name: $rootScope.selectedVendorInfo.name
		};
	}

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function successGroupVehicleType(response) {
		if (response && response.data && response.data.data) {
			$scope.aVehicleGroups = response.data.data;
		}
	}
	$scope.aCategory = ['Horse', 'Truck', 'Trailer'];
	function failGroupVehicleType(res) {
		console.error("fail: ", res);
	}

	$scope.getGroups = function () {
		Vehicle.getGroupVehicleType(successGroupVehicleType, failGroupVehicleType);
	};
	$scope.getGroups(); //get Vehicle Group

	$scope.checkUnknown = function () {
		if ($scope.newVeh.unknown_driver) {
			$scope.newVeh.driver_name = "unknown";
			$scope.newVeh.driver_contact = undefined;
			$scope.newVeh.driver_license = undefined;
		} else {
			$scope.newVeh.driver_name = "";
		}
	};

	$scope.unknownVendor = function () {
		if ($scope.newVeh.unknownVendor) {
			if ($scope.$configs && $scope.$configs.vehAlloc && $scope.$configs.vehAlloc.vendor) {
				$scope.newVeh.vendor = {
					_id: $scope.$configs.vehAlloc.vendor._id,
					name: $scope.$configs.vehAlloc.vendor.name
				};
			}
		} else {
			if ($rootScope.selectedVendorInfo) {
				$scope.newVeh.vendor = {
					_id: $rootScope.selectedVendorInfo._id,
					name: $rootScope.selectedVendorInfo.name
				}
			} else {
				$scope.newVeh.vendor = null;
			}
		}
	};

	//get cost center
	$scope.getCostCenter = function (viewValue = '') {
		if (viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 6,
					projection: {_id: 1, name: 1, category: "$category.name"}
				};

				accountingService.getCostCenter(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});
			});
		}

		return [];
	}

	$scope.getMarketVehicleVendor = function (viewValue = '') {

		if (viewValue.length <= 2)
			return [];

		return new Promise(function (resolve, reject) {

			var oFilter = {
				or: {
					value: viewValue,
					in: ['name', 'pan_no']
				},
				no_of_docs: 10,
				deleted: false
			};

			Vendor.getTransportVendor(oFilter, success, failure);

			function success(data) {
				resolve(data.data || []);
			}

			function failure(data) {
				console.log(data);
				reject([]);
			}
		});
	};

	$scope.vehicleCheckExist = function () {
		if ($scope.newVeh.vehicle_reg_no) {
			var oSend = {};
			oSend.vehicle_reg_no = $scope.newVeh.vehicle_reg_no;
			Vehicle.vehicleCheckExists(oSend, sucRes, failRes);

			function sucRes(res) {
				$rootScope.checkExists = '';
			}

			function failRes(res) {
				$rootScope.checkExists = res.data.message;
			}
		}
	};

	$scope.addMvehCall = function () {
		function sucRes(res) {
			swal("success", res.data.message, "success");
			$rootScope.getAllRegVehicle && $rootScope.getAllRegVehicle();
			$uibModalInstance.close(res.data.data);
		}

		function failRes(res) {
			swal("Fail", res.data.message, "error");
		}

		var oSend = {};
		var oSend = $scope.newVeh;

		if (!$scope.newVeh.capacity_tonne) {
			return swal('Required', 'Capacity is required', 'error');
		}
		if (!$scope.newVeh.vehicle_reg_no) {
			return swal('Required', 'Vehicle No. is required', 'error');
		}
		if (!$scope.newVeh.group_data) {
			return swal('Required', 'Vehicle Group is required', 'error');
		}
		if (!$scope.newVeh.veh_type_data) {
			return swal('Required', 'Vehicle Type is required', 'error');
		}
		// if(!$scope.newVeh.costCenter) {
		// 	return swal('Required','Cost Center is required','error');
		// }
		// if(!$scope.newVeh.segment_type){
		// 	return swal('Required', 'Vehicle Segment is required' ,'error');
		// }
		if ($scope.newVeh.vendor) {
			oSend.vendor_id = $scope.newVeh.vendor._id;
			oSend.vendor_name = $scope.newVeh.vendor.name;
			delete oSend.vendor;
		} else if ($rootScope.selectedVendorInfo) {
			oSend.vendor_id = $rootScope.selectedVendorInfo._id;
			oSend.vendor_name = $rootScope.selectedVendorInfo.name;
		}
		oSend.veh_group = (oSend.group_data && oSend.group_data._id) ? oSend.group_data._id : undefined;
		oSend.veh_group_name = (oSend.group_data && oSend.group_data.name) ? oSend.group_data.name : undefined;
		oSend.veh_type = (oSend.veh_type_data && oSend.veh_type_data._id) ? oSend.veh_type_data._id : undefined;
		oSend.veh_type_name = (oSend.veh_type_data && oSend.veh_type_data.name) ? oSend.veh_type_data.name : undefined;
		oSend.ownershipType = 'Market';
		oSend.segment_type = 'Market';
		if (oSend.driver_name !== "unknown") {
			var oDriverSend = {
				employee_code: '_M',
				prim_contact_no: oSend.driver_contact,
				license_no: oSend.driver_license,
				name: oSend.driver_name
			};
			Driver.saveDriver(oDriverSend, function (driver) {
				oSend.driver = driver.data.data._id;
				Vehicle.saveVehicle(oSend, sucRes, failRes);
			});
		} else {
			Vehicle.saveVehicle(oSend, sucRes, failRes);
		}
	}


});

materialAdmin.controller("showVehicleListCtrl", function ($rootScope, $scope, $uibModalInstance, thatData) {

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeThis = function (d, i) {
		$rootScope.aVehicleSelected.splice(i, 1);
	}

});


materialAdmin.controller("selectVehForBookingCtrl", function ($rootScope, $scope, $uibModalInstance, thatData, growlService, formValidationgrowlService, Vehicle) {

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	if ($rootScope.aVehicleSelected && $rootScope.aVehicleSelected.length > 0) {
		for (var y = 0; y < $rootScope.aVehicleSelected.length; y++) {
			if (!$rootScope.aVehicleSelected[y].route || $rootScope.aVehicleSelected[y].route === $rootScope.selBookData.route) {
				$rootScope.aVehicleSelected[y].show = true;
			}
		}
	}

	$scope.pushBooking = function (veh, index) {
		function pushIt() {
			$rootScope.customer = $rootScope.selBookData.customer;
			$rootScope.selBookData.weight = $rootScope.selBookData.remaining_weight > (veh.capacity_tonne - veh.loadedWeight)
				? (veh.capacity_tonne - veh.loadedWeight)
				: $rootScope.selBookData.remaining_weight;

			$rootScope.selBookData.weight = $rootScope.selBookData.weight <= 0
				? 0
				: $rootScope.selBookData.weight;

			veh.loadedWeight = veh.loadedWeight
				? $rootScope.selBookData.weight + veh.loadedWeight
				: $rootScope.selBookData.weight;

			$rootScope.aVehicleSelected[index].route = $rootScope.selBookData.route;

			let len = $rootScope.aVehicleSelected[index].gr.push(angular.copy($rootScope.selBookData));
			$rootScope.aVehicleSelected[index].gr[len - 1].route = $rootScope.aVehicleSelected[index].gr[len - 1].route[0];

			$rootScope.aVehicleSelected[index].gr[$rootScope.aVehicleSelected[index].gr.length - 1].servedContainer = $rootScope.selBookData.served ? $rootScope.selBookData.served.servedContainer : undefined;

			$rootScope.aVehicleSelected[index].gr[$rootScope.aVehicleSelected[index].gr.length - 1].allContainer = $rootScope.selBookData.container;

			$rootScope.aVehicleSelected[index].gr[$rootScope.aVehicleSelected[index].gr.length - 1].container = [];

			$uibModalInstance.dismiss('cancel');
		}

		if ($rootScope.selBookData.booking_type === 'Import - Containerized' || $rootScope.selBookData.booking_type === 'Export - Containerized' || $rootScope.selBookData.booking_type === 'Domestic - Containerized' || $rootScope.selBookData.booking_type === 'Empty - Containerized') {
			if (!veh.veh_type.trailer) {
				swal("warning", "Selected Vehicle can't carry container!", "warning");
				return;
			}
		}

		if ((veh.capacity_tonne - veh.loadedWeight) > 0) {
			if ($rootScope.aVehicleSelected[index].gr && $rootScope.aVehicleSelected[index].gr.length > 0) {

			} else {
				$rootScope.aVehicleSelected[index].gr = [];
			}

			for (var b = 0; b < $rootScope.aVehicleSelected[index].gr.length; b++) {
				if ($rootScope.aVehicleSelected[index].gr[b]._id === $rootScope.selBookData._id) {
					swal('warning', 'Booking already added in the vehicle', 'warning');
					return;
				}
			}


			if ($rootScope.selBookData && $rootScope.selBookData.preference && $rootScope.selBookData.preference.length > 0) {
				var vehTypeMatched = false;
				for (var r = 0; r < $rootScope.selBookData.preference.length; r++) {
					if ($rootScope.selBookData.preference[r]._id === $rootScope.aVehicleSelected[index].veh_type._id) {
						vehTypeMatched = true;
						break;

					}
				}
				if (vehTypeMatched) {
					pushIt();
				} else {
					/*swal({
							title: "Booking not added on this vehicle.",
							text: $rootScope.aVehicleSelected[index].veh_type.name + ' is not preferred type',
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: '#DD6B55',
							confirmButtonText: 'Ok',
							cancelButtonText: "No, cancel it!",
							closeOnConfirm: true,
							closeOnCancel: true
						},
						function (isConfirm) {
							if (isConfirm) {
								//pushIt();
								return;
							} else {
								return;
							}
						});*/
					pushIt();
				}
			} else {
				pushIt();
			}
		} else {
			swal("warning", "Vehicle is full.", "warning");
		}
	};


});


materialAdmin.controller("vendorVehicleDetail", function ($rootScope, $scope, $stateParams, $state, Vehicle, Vendor) {
	$scope.isVehicleRegistered = true;
	$scope.isDriverRegistered = true;
	$scope.toRegister = false;
	var remoteData = $stateParams.data;
	$scope.booking_item = remoteData.selectedItem;
	var regVehData;
	if (remoteData) {
		$scope.aRegVehicle = [];
		if (remoteData.vendor_id && remoteData.vehicle_id) {
			regVehicleFuns();
		}
		;
	} else {
		//$state.go('booking_manage.vehicleAllcation', {});
	}

	function vSuccess(res) {
		if (res.data.data) {
			$scope.aRegVehicle = res.data.data;
			regVehData = angular.copy($scope.aRegVehicle);
		}
	}

	function regVehicleFuns() {
		oFilter = {
			is_market: true
		};
		oFilter.vendor_id = remoteData.vendor_id;
		oFilter.veh_type = remoteData.vehicle_id;
		Vehicle.getAllregList(oFilter, vSuccess)
	}

	$scope.passData = function (oData) {
		var myData = angular.copy(oData)
		$scope.oReg = myData;
		/*var veh_group = myData.veh_group;
		  var veh_type = myData.veh_type;
		for(var j=0; j<$scope.vehicleUGroups.length; j++){
		  if(veh_group == $scope.vehicleUGroups[j]._id){
			$scope.oReg.veh_group_name = $scope.vehicleUGroups[j];
			if($scope.oReg.veh_group_name && $scope.oReg.veh_group_name.vehicle_types && $scope.oReg.veh_group_name.vehicle_types.length>0){}
			$scope.vehicleUTypes = $scope.oReg.veh_group_name.vehicle_types;
			for(var k=0; k<$scope.vehicleUTypes.length;k++){
			  if(veh_type == $scope.vehicleUTypes[k]._id){
				$scope.oReg.veh_type_name = $scope.vehicleUTypes[k];
			  }
			}
		  }
		}*/
		//$rootScope.selectedVehicle = myData;
		$scope.isVehicleRegistered = true;
		$scope.isDriverRegistered = true;
		$scope.toRegister = false;
	}

	/*$scope.allocateThisVehicle = function(){
	  $rootScope.getSelectedBookingAllItem = remoteData.selectedType;
	  $rootScope.redirect("#!/booking_manage/AllcationpopUp");
	}*/
	function groupSuc(response) {
		if (response && response.data && response.data.data) {
			$scope.vehicleGroups = response.data.data;
		}
	}

	function fail(res) {
		console.error("fail: ", res);
	}

	Vehicle.getGroupVehicleType(groupSuc, fail);
	$scope.getVehicleType = function (selectType) {
		if (selectType) {
			$scope.vehicleTypes = selectType.vehicle_types;
		}
	};

	$scope.setAllocateDriverDetail = function (unknownDriver) {
		if (unknownDriver) {
			if (!$scope.oReg)
				$scope.oReg = {};
			$scope.oReg.driver_name = 'Unknown Driver';
			$scope.oReg.driver_license = 'Unknown Licence';
			$scope.oReg.driver_contact_no = 999999999;
		} else {
			$scope.oReg.driver_name = '';
			$scope.oReg.driver_license = '';
			$scope.oReg.driver_contact_no = '';
		}
	};

	$scope.getDriverUMobile = function (selectDriver) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectDriver) {
			$scope.selectDriverName = selectDriver.name;
			//$scope.vehicleRegister.group_code = selectType.code;
			if (selectDriver.prim_contact_no) {
				$scope.oReg.driver_contact_no = selectDriver.prim_contact_no;
			}
		}
	}

	function sucDriver(response) {
		if (response && response.data && response.data.data) {
			$rootScope.selectedDrivers = response.data.data;
		}
	}

	function failDriver(res) {
		console.error("fail: ", res);
	}

	Vehicle.getAllDrivers(sucDriver, failDriver);


	$scope.checkVehicle = function (v) {
		//$scope.toRegister = true;
		$scope.isVehicleRegistered = false;
		var vehicle = v ? v.replace(/\W+/g, "") : null;
		if (regVehData && regVehData.length > 0) {
			var aManupulate = angular.copy(regVehData);
			if (vehicle && aManupulate.length > 0) {
				for (var i = 0; i < aManupulate.length; i++) {
					if (aManupulate[i].vehicle_reg_no) {
						if (vehicle.toLowerCase() == aManupulate[i].vehicle_reg_no.toLowerCase()) {
							$scope.isVehicleRegistered = true;
							//$scope.toRegister = false;
							//$scope.oReg = aManupulate[i];
							break;
						}
					}
				}
			}
		}
	}
	$scope.checkDriver = function (d) {
		//$scope.toRegister = true;
		$scope.isDriverRegistered = false;
		var driver = d ? d.replace(/\W+/g, " ") : null;
		if (regVehData && regVehData.length > 0) {
			var aManupulate = angular.copy(regVehData);
			if (driver && aManupulate.length > 0) {
				for (var i = 0; i < aManupulate.length; i++) {
					if (aManupulate[i].driver_name) {
						if (driver.toLowerCase() == aManupulate[i].driver_name.toLowerCase()) {
							$scope.oReg.driver_contact_no = aManupulate[i].driver_contact_no;
							$scope.isDriverRegistered = true;
							//$scope.toRegister = false;
							break;
						}
					}
				}
			}
		}
	}

	function allocateThisVehicle(data) {
		data.selected = true;
		//$rootScope.selectedVehicle = data;
		//remoteData.selectedItem.selected = true;
		//$rootScope.selectedBookingItem = remoteData.selectedItem;
		//$rootScope.getSelectedBookingAllItem = remoteData.selectedType;
		//$rootScope.redirect("#!/booking_manage/AllcationpopUp");


		$state.go('booking_manage.AllcationpopUp', {
			data: {
				selectedItem: remoteData.selectedItem,
				selectedVehicle: data,
				selectedTypeBookings: remoteData.selectedType
			}
		});
	}

	function successReg(res) {
		if (res.data.data) {
			allocateThisVehicle(res.data.data);
		}
	}

	function failureReg(res) {
		console.log(res);
	}

	$scope.goToAllocate = function () {
		var oSend = {};
		if (($scope.isDriverRegistered === true) && ($scope.isVehicleRegistered === true)) {
			allocateThisVehicle($scope.oReg);
		} else {
			oSend.isDriverRegistered = $scope.isDriverRegistered;
			oSend.isVehicleRegistered = $scope.isVehicleRegistered;
			oSend.dataDriver = {};
			oSend.dataVehicle = {};
			oSend.vendor_name = remoteData.data.name;
			oSend.vendor_mobile = remoteData.data.prim_contact_no;
			oSend.vendor_id = remoteData.data._id;
			oSend.dataDriver.name = $scope.oReg.driver_name;
			oSend.dataDriver.license_no = $scope.oReg.driver_license;
			oSend.dataDriver.prim_contact_no = $scope.oReg.driver_contact_no;
			if (oSend.isVehicleRegistered === true) {
				oSend.vehicle = $scope.oReg.vehicle;
			}
			oSend.dataVehicle.is_market = true;
			oSend.dataVehicle.vendor_name = oSend.vendor_name;
			oSend.dataVehicle.vendor_mobile = oSend.vendor_mobile;
			oSend.dataVehicle.vendor_id = oSend.vendor_id;
			oSend.dataDriver.vendor_id = oSend.vendor_id;
			oSend.dataVehicle.vehicle_reg_no = $scope.oReg.vehicle_reg_no;
			oSend.dataVehicle.license_no = oSend.dataDriver.license_no;
			if (typeof $scope.oReg.group_name == 'object') {
				oSend.dataVehicle.veh_group_name = $scope.oReg.group_name.name;
				oSend.dataVehicle.veh_group = $scope.oReg.group_name._id;
			} else {
				oSend.dataVehicle.veh_group_name = $scope.oReg.veh_group_name;
				oSend.dataVehicle.veh_group = $scope.oReg.veh_group;
			}
			if (typeof $scope.oReg.veh_type == 'object') {
				oSend.dataVehicle.veh_type_name = $scope.oReg.veh_type.name;
				oSend.dataVehicle.veh_type = $scope.oReg.veh_type._id;
			} else {
				oSend.dataVehicle.veh_type_name = $scope.oReg.veh_type_name;
				oSend.dataVehicle.veh_type = $scope.oReg.veh_type;
			}
			Vendor.regOnTheGo(oSend, successReg, failureReg);
		}
	}


});

materialAdmin.controller("allocateVehicleCtrl", function ($rootScope, $scope, $localStorage, constants, Driver, bookingServices, clientConfig, userService, $uibModal, $state, $stateParams, bookingServices, vehicleAllcationService, customer, FleetService, Vehicle) {
	$scope.getItemOfBooking = function () {
		function success(data) {
			if (data.data && data.data.data) {
				var aItems = data.data.data;
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].item_no == $stateParams.data.selectedItem.item_no) {
						aItems[i].selected = true;
					}
				}
				$scope.getSelectedBookingAllItem = aItems;

			}
		};

		function failure(res) {
			swal("Some error with GET booking.", "", "error");
		}

		//
		if (($scope.booking_no && $scope.booking_no.toString().length > 0) || $scope.customerSearch) {
			var oFilter = prepareFilterObject();
			vehicleAllcationService.getBookingItem(oFilter, success, failure);
		} else {
			swal("Please select booking number or customer", "", "info")
		}
	}

	if ($stateParams.data && $stateParams.data.selectedItem && $stateParams.data.selectedVehicle) {
		$scope.booking_no = $stateParams.data.selectedItem.booking_no;
		$scope.oBooking = $stateParams.data.selectedItem;
		$scope.selectedTypeBookings = $stateParams.data.selectedTypeBookings;
		$scope.selectedVehicle = $stateParams.data.selectedVehicle;
		$scope.getItemOfBooking();
	} else {
		//$rootScope.redirect("#!/booking_manage/vehicleAllcation");
	}

	//*** New Date Picker for multiple date selection in single form ****
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.setAllocateDriverDetail = function (unknownDriver) {
		if (unknownDriver) {
			$scope.Allocate.driver_name = 'Unknown Driver';
			$scope.Allocate.driver_contact = 999999999;
			$scope.Allocate.driver_license = 'Unknown Licence';
		} else {
			$scope.Allocate.driver_name = undefined;
			$scope.Allocate.driver_contact = undefined;
			$scope.Allocate.driver_license = undefined;
		}
	};

	$scope.toggleMin = function () {
		var clientAllocationDateConfig = clientConfig.getFeatureValue("allocation", "allocation_date");
		$scope.maxDate = new Date();
		var booking_date = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2
		//var fourtyEight = angular.copy(booking_date);
		var fourtyEight = (clientAllocationDateConfig && clientAllocationDateConfig.min_hour) ? moment().subtract(clientAllocationDateConfig.min_hour, "hours")._d : angular.copy(booking_date);
		//fourtyEight.setDate(fourtyEight.getDate() - (clientAllocationDateConfig.min_hour/24));
		if ($scope.selectedVehicle && $scope.selectedVehicle.last_known && $scope.selectedVehicle.last_known.datetime && $scope.oBooking && $scope.oBooking.booking_date) {
			$scope.selectedVehicle.last_known.datetime = new Date($scope.selectedVehicle.last_known.datetime);
			$scope.oBooking.booking_date = new Date($scope.oBooking.booking_date);

			if ($scope.selectedVehicle.last_known.datetime > $scope.oBooking.booking_date) {
				if ($scope.selectedVehicle.last_known.datetime > fourtyEight) {
					booking_date = $scope.selectedVehicle.last_known.datetime;
				} else {
					booking_date = fourtyEight;
				}
			} else {
				if ($scope.oBooking.booking_date > fourtyEight) {
					booking_date = $scope.oBooking.booking_date;
				} else {
					booking_date = fourtyEight;
				}
			}
		} else if ($scope.selectedVehicle && $scope.selectedVehicle.last_known && $scope.selectedVehicle.last_known.datetime) {
			$scope.selectedVehicle.last_known.datetime = new Date($scope.selectedVehicle.last_known.datetime);
			if ($scope.selectedVehicle.last_known.datetime > fourtyEight) {
				booking_date = $scope.selectedVehicle.last_known.datetime;
			} else {
				booking_date = fourtyEight;
			}
		} else if ($scope.oBooking && $scope.oBooking.booking_date) {
			$scope.oBooking.booking_date = new Date($scope.oBooking.booking_date);
			if ($scope.oBooking.booking_date > fourtyEight) {
				booking_date = $scope.oBooking.booking_date;
			} else {
				booking_date = fourtyEight;
			}
		}
		$scope.minDate = new Date(booking_date);
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
	$scope.one='hello hi';
	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//*** New Date Picker for multiple date selection in single form ****//

	$scope.aHours = [];
	for (var h = 0; h < 24; h++) {
		$scope.aHours[h] = h;
	}
	$scope.aMinutes = [];
	for (var m = 0; m < 60; m++) {
		$scope.aMinutes[m] = m;
	}

	$scope.hourSel1 = 0;
	//$scope.hourSel2 = 23;
	$scope.minuteSel1 = 0;
	//$scope.minuteSel2 = 59;
	if ($scope.minDate) {
		//**** custom time add with date ******//
		var xxx = $scope.minDate;
		$scope.matchDay = xxx.getDate();
		$scope.hour1 = xxx.getHours();
		$scope.matchHour = angular.copy($scope.hour1);
		$scope.minute1 = xxx.getMinutes();
		$scope.matchMinute = angular.copy($scope.minute1);

	}
	$scope.changeTime = function () {
		var yyy = $scope.Allocate.allocation_date;
		$scope.alloc_day = yyy.getDate();
		var zzz = new Date();
		$scope.current_day = zzz.getDate();
		$scope.c_hr = zzz.getHours();
		$scope.currentHour = angular.copy($scope.c_hr);
		$scope.c_min = zzz.getMinutes();
		$scope.currentMinute = angular.copy($scope.c_min);

		if ($scope.alloc_day == $scope.matchDay) {
			if ($scope.hourSel1 < $scope.matchHour) {
				swal("warning", "Please select hour greater then = " + $scope.matchHour, "warning");
				$scope.hourSel1 = $scope.matchHour;
			} else if ($scope.hourSel1 == $scope.matchHour) {
				if ($scope.minuteSel1 < $scope.matchMinute) {
					swal("warning", "Please select minute greater then = " + $scope.matchMinute, "warning");
					$scope.minuteSel1 = $scope.matchMinute;
				}
			}
		}
		if ($scope.alloc_day == $scope.current_day) {
			if ($scope.hourSel1 > $scope.currentHour) {
				swal("warning", "Please select hour less then or equal to " + $scope.currentHour, "warning");
				$scope.hourSel1 = $scope.currentHour;
			} else if ($scope.hourSel1 == $scope.currentHour) {
				if ($scope.minuteSel1 > $scope.currentMinute) {
					swal("warning", "Please select minute less then or equal to " + $scope.currentMinute, "warning");
					$scope.minuteSel1 = $scope.currentMinute;
				}
			}
		}

	}

	$scope.getCustomers = function () {
		function success(data) {
			$scope.aCustomers = data.data;
		};
		bookingServices.getAllCustomers(success);
	};
	$scope.getCustomers();

	function prepareFilterObject() {
		var myFilter = {all: true, allocated: false};
		if ($scope.booking_no) {
			myFilter.booking_no = $scope.booking_no;
		}
		if ($scope.customerSearch && $scope.customerSearch._id) {
			myFilter.customer_id = $scope.customerSearch._id;
		}
		return myFilter;
	};

	//$stateParams.data
	//$rootScope.selectedVehicle;
	//$scope.oBooking = $rootScope.selectedBookingItem;
	//$rootScope.getSelectedBookingAllItem;
	;
	$scope.containerArray = [];
	$scope.isContainerType = (($scope.oBooking.booking_type == constants.bookingTypes.import_container) || ($scope.oBooking.booking_type == constants.bookingTypes.export_container) || ($scope.oBooking.booking_type == constants.bookingTypes.domestic_container) || ($scope.oBooking.booking_type == constants.bookingTypes.empty_container));
	var vehicleType = $scope.selectedVehicle.veh_type_name;
	var max_allowed_for_40Feet;

	function getAllDriverData() {
		function success(data) {
			$scope.aDriver = data.data;
		}

		Driver.getAllDrivers({all: true}, success);
	}

	getAllDriverData();
	$scope.Allocate = {};
	$scope.isSingleBooking = "true";
	$scope.Allocate.allocation_date = new Date();

	var nDT = $scope.Allocate.allocation_date;
	$scope.hourSel1 = nDT.getHours();
	//$scope.hourSel1 = angular.copy($scope.hour1);
	$scope.minuteSel1 = nDT.getMinutes();
	//$scope.minuteSel1 = angular.copy($scope.minute1);

	$scope.getCustomers = function () {
		function success(data) {
			$scope.aCustomers = data.data;
		};
		bookingServices.getAllCustomers(success);
	};
	$scope.getCustomers();

	if ($scope.totalBookingItem) {
		$scope.no_container = $scope.totalBookingItem.length;
	}

	if ($scope.selectedBookingItem) {
		if (vehicleType == "40 Feet") {
			if ($scope.selectedBookingItem.container_type == "20 Feet") {
				max_allowed_for_40Feet = 1;
			} else if ($scope.selectedBookingItem.container_type == "40 Feet") {
				max_allowed_for_40Feet = 2;
			}
		}
		// $scope.containerArray.push($scope.selectedBookingItem);
		if ($scope.selectedBookingItem.route) {
			$scope.Allocate.route = $scope.selectedBookingItem.route;
		}
		if ($scope.selectedBookingItem && $scope.selectedBookingItem.trip_type) {
			$scope.Allocate.trip_type = $scope.selectedBookingItem.trip_type;
		}
		if ($scope.selectedBookingItem && $scope.selectedBookingItem.po_number) {
			$scope.Allocate.po_number = $scope.selectedBookingItem.po_number;
		}
		if ($scope.selectedVehicle && $scope.selectedVehicle.veh_type_name) {
			$scope.Allocate.vehicle_type = $scope.selectedVehicle.veh_type_name;
		}
		if ($scope.selectedBookingItem && $scope.selectedBookingItem.vehicle_type) {
			$scope.Allocate.vehicle_type_old = $scope.selectedBookingItem.vehicle_type;
		}

		if ($scope.selectedVehicle.vehicle_reg_no) {
			$scope.Allocate.vehicle_no = $scope.selectedVehicle.vehicle_reg_no;
		}
		if ($scope.selectedVehicle._id) {
			$scope.Allocate.vehicle = $scope.selectedVehicle._id;
		}
		if ($scope.selectedVehicle.driver_name) {
			$scope.Allocate.driver_name = $scope.selectedVehicle.driver_name;
		}
		if ($scope.selectedVehicle.segment_type) {
			$scope.Allocate.segment_type = $scope.selectedVehicle.segment_type;
		}
		if ($scope.selectedVehicle.driver_license) {
			$scope.Allocate.driver_license = $scope.selectedVehicle.driver_license;
		}
		if ($scope.selectedVehicle.driver_employee_code) {
			$scope.Allocate.driver_employee_code = $scope.selectedVehicle.driver_employee_code;
		}
		if ($scope.selectedVehicle.driver) {
			$scope.Allocate.driver = $scope.selectedVehicle.driver;
		}
		if ($scope.selectedVehicle.driver_contact_no) {
			$scope.Allocate.driver_contact = $scope.selectedVehicle.driver_contact_no;
		}
		if ($scope.selectedVehicle.driver_license) {
			$scope.Allocate.driver_license = $scope.selectedVehicle.driver_license;
		}
		if ($scope.selectedVehicle.is_market) {
			$scope.Allocate.isMarketVehicle = $scope.selectedVehicle.is_market;
			$scope.Allocate.vendor = $scope.selectedVehicle.vendor_id;
			$scope.Allocate.vendor_contact = $scope.selectedVehicle.vendor_mobile;
			$scope.Allocate.vendor_name = $scope.selectedVehicle.vendor_name;
		} else {
			$scope.Allocate.isMarketVehicle = false;
		}
		if ($scope.isSingleBooking == 'true') {
			$scope.Allocate.isMultiBooking = false;
		} else {
			$scope.Allocate.isMultiBooking = true;
		}
		if ($scope.selectedBookingItem.customer_name) {
			$scope.customer_name = $scope.selectedBookingItem.customer_name;
		}
		if ($scope.selectedBookingItem.booking_no) {
			$scope.booking_no = $scope.selectedBookingItem.booking_no;
		}
		if ($scope.selectedBookingItem._id) {
			$scope.Allocate._id = $scope.selectedBookingItem._id;
		}


		if ($scope.selectedBookingItem.boe_no) {
			$scope.Allocate.boe_no = $scope.selectedBookingItem.boe_no;
		}
		if ($scope.selectedBookingItem.boe_value) {
			$scope.Allocate.boe_value = $scope.selectedBookingItem.boe_value;
		}
		if ($scope.selectedBookingItem.boe_date) {
			$scope.Allocate.boe_date = $scope.selectedBookingItem.boe_date;
		}
		if ($scope.selectedBookingItem.factory_invoice_number) {
			$scope.Allocate.factory_invoice_number = $scope.selectedBookingItem.factory_invoice_number;
		}
		if ($scope.selectedBookingItem.factory_invoice_value) {
			$scope.Allocate.factory_invoice_value = $scope.selectedBookingItem.factory_invoice_value;
		}
		if ($scope.selectedBookingItem.factory_invoice_date) {
			$scope.Allocate.factory_invoice_date = $scope.selectedBookingItem.factory_invoice_date;
		}

		if ($scope.selectedBookingItem.shipping_line) {
			$scope.Allocate.shipping_line = $scope.selectedBookingItem.shipping_line;
		}
		if ($scope.selectedBookingItem.shipping_line_name) {
			$scope.Allocate.shipping_line_name = $scope.selectedBookingItem.shipping_line_name;
		}
		if ($scope.selectedBookingItem.cha) {
			$scope.Allocate.cha = $scope.selectedBookingItem.cha;
		}
		if ($scope.selectedBookingItem.cha_name) {
			$scope.Allocate.cha_name = $scope.selectedBookingItem.cha_name;
		}

		if ($scope.selectedBookingItem.consigner) {
			$scope.Allocate.consigner = $scope.selectedBookingItem.consigner;
		}
		if ($scope.selectedBookingItem.consigner_name) {
			$scope.Allocate.consigner_name = $scope.selectedBookingItem.consigner_name;
		}
		if ($scope.selectedBookingItem.consignee) {
			$scope.Allocate.consignee = $scope.selectedBookingItem.consignee;
		}
		if ($scope.selectedBookingItem.consignee_name) {
			$scope.Allocate.consignee_name = $scope.selectedBookingItem.consignee_name;
		}
		if ($scope.selectedBookingItem.billing_party) {
			$scope.Allocate.billing_party = $scope.selectedBookingItem.billing_party;
		}
		if ($scope.selectedBookingItem.billing_party_gstin_no) {
			$scope.Allocate.billing_party_gstin_no = $scope.selectedBookingItem.billing_party_gstin_no;
		}
		if ($scope.selectedBookingItem.billing_party_name) {
			$scope.Allocate.billing_party_name = $scope.selectedBookingItem.billing_party_name;
		}
		if ($scope.selectedBookingItem.billing_party_address) {
			$scope.Allocate.billing_party_address = $scope.selectedBookingItem.billing_party_address;
		}
		if ($scope.selectedBookingItem.weight_type) {
			$scope.Allocate.weight_type = $scope.selectedBookingItem.weight_type;
		}
		if ($scope.selectedBookingItem.rate) {
			$scope.Allocate.rate = $scope.selectedBookingItem.rate;
		}
		if ($scope.selectedBookingItem.freight) {
			$scope.Allocate.freight = $scope.selectedBookingItem.freight;
		}
	}

	$scope.$watch('aDriver', function () {
		if ($scope.aDriver && $scope.aDriver.length > 0) {
			for (var i = 0; i < $scope.aDriver.length; i++) {
				if ($scope.Allocate.driver == $scope.aDriver[i]._id) {
					$scope.Allocate.driver_data = $scope.aDriver[i];
					$scope.selectDriver();
				}
			}
		}
	});

	$scope.selectDriver = function () {
		if ($scope.Allocate.driver_data) {
			$scope.Allocate.driver = $scope.Allocate.driver_data._id;
			$scope.Allocate.driver_name = $scope.Allocate.driver_data.name;
			$scope.Allocate.driver_sap_id = $scope.Allocate.driver_data.sap_id;
			$scope.Allocate.driver_contact = $scope.Allocate.driver_data.prim_contact_no;
			$scope.Allocate.driver_license = $scope.Allocate.driver_data.license_no;
			$scope.Allocate.driver_employee_code = $scope.Allocate.driver_data.employee_code
		}
	};

	$scope.getNewRates = function () {
		function succRates(res) {
			var msg = res.data.message;
			$scope.aNewRates = res.data.data.data;
			for (var t = 0; t < $scope.aNewRates.length; t++) {
				if ($scope.selectedBookingItem.weight_type == 'Fixed') {
					$scope.aNewRates[t].rate_final = $scope.aNewRates[t].rate.vehicle_rate || 0;
					$scope.aNewRates[t].freight_final = $scope.aNewRates[t].rate.vehicle_rate || 0;
				} else if ($scope.selectedBookingItem.weight_type == 'PUnit') {
					$scope.aNewRates[t].rate_final = $scope.aNewRates[t].rate.price_per_unit || 0;
					if ($scope.selectedBookingItem && $scope.selectedBookingItem.no_of_unit) {
						$scope.aNewRates[t].freight_final = parseFloat((Math.round(($scope.aNewRates[t].rate.price_per_unit * $rootScope.selectedBookingItem.no_of_unit) * 100) / 100).toFixed(2));
					}
				} else if ($scope.selectedBookingItem.weight_type == 'PMT') {
					$scope.aNewRates[t].rate_final = $scope.aNewRates[t].rate.price_per_mt || 0;
					if ($scope.selectedBookingItem.weight && $scope.selectedBookingItem.weight.value) {
						$scope.aNewRates[t].freight_final = parseFloat((Math.round(($scope.aNewRates[t].rate.price_per_mt * $rootScope.selectedBookingItem.weight.value) * 100) / 100).toFixed(2));
					}
				}

			}
		}

		function failRates(res) {
			console.log('failed', response);
		}

		if ($scope.selectedBookingItem && $scope.selectedBookingItem.customer && $scope.selectedBookingItem.route && $scope.selectedBookingItem.route.route_id) {
			var objId = {};
			objId.customerId = $scope.selectedBookingItem.customer.customerId;
			objId.route_id = $scope.selectedBookingItem.route.route_id;
			//objId.vehicle_type_id = $rootScope.selectedVehicle._id;
			objId.booking_type = $scope.selectedBookingItem.booking_type;
			customer.newRateService(objId, succRates, failRates);
		}

	};
	$scope.getNewRates();

	function suc(response) {
		var msg = response.data.message;
		$scope.containerArray = [];
		if (response.data) {
			//swal("Success",msg,"success");
			swal({
					title: "",
					text: "Successfully Saved!, Do You Want To Go To GRDetails?",
					type: "warning",
					showCancelButton: true,
					//confirmButtonColor: "rgb(61, 167, 208);",
					confirmButtonText: "Yes",
					closeOnConfirm: true
				},
				function (isConfirmU) {
					if (isConfirmU) {
						$state.reload();
						var sUrl = "#!/booking_manage/grDetails";
						$rootScope.redirect(sUrl);
					} else {
						$state.reload();
						var sUrl = "#!/booking_manage/vehicleAllcation";
						$rootScope.redirect(sUrl);
					}
				});
		}
	};

	function fail(response) {
		console.log('failed', response);
	};

	$scope.remove = function (oBooking, index) {
		$scope.containerArray.splice(index, 1);
		oBooking.selected = false;
		//$scope.containerArray.index.selected=false;
	};


	function applyDoubleTwentyFeetRate() {
		var first_item = $scope.containerArray[0];
		var second_item = $scope.containerArray[1];
		if ((first_item.booking_no == second_item.booking_no) && (first_item.boe_no == second_item.boe_no) && (first_item.booking_type == second_item.booking_type) && (first_item.customer_id == second_item.customer_id)) {
			if ($scope.aNewRates && $scope.aNewRates.length > 0) {
				for (var index = 0; index < $scope.aNewRates.length; index++) {
					if ($scope.aNewRates[index].vehicle_type == "2*20 Feet") {
						$scope.aNewRates[index].selected = index.toString();
						$scope.checkRadio(index);
						swal("New Rates Applied", "2*20 Feet rates are applied! You can change it.", "warning");
					}
				}
			}
		}
	}

	$scope.addBookingInArray = function (oBooking) {
		if (oBooking && oBooking.selected) {
			if ($scope.isContainerType) {
				var container_type = oBooking.container_type;
				if (vehicleType.toLowerCase() == "20 Feet".toLowerCase()) {
					if (container_type == "20 Feet") {
						if ($scope.containerArray.length < 1) {
							$scope.containerArray.push(oBooking);
						} else {
							oBooking.selected = false;
							swal("Warning!", "20 feet Vehicle allows only single 20 Feet container.", "warning");
						}
					} else if (container_type == "40 Feet") {
						oBooking.selected = false;
						swal("Warning!", "20 feet Vehicle doesn't allow 40 Feet container.", "warning");
					}
				} else if ((vehicleType.toLowerCase() == "40 Feet".toLowerCase()) || (vehicleType.toLowerCase() == "2*20 Feet".toLowerCase())) {
					//*****
					var count20FeetContainer = 0;
					var count40FeetContainer = 0;

					for (var i = 0; i < $scope.containerArray.length; i++) {
						if ($scope.containerArray[i].container_type == "20 Feet") {
							count20FeetContainer++;
						}
						if ($scope.containerArray[i].container_type == "40 Feet") {
							count40FeetContainer++;
						}
					}

					if (container_type == "20 Feet") {
						if ($scope.containerArray.length < 2) {
							if (count40FeetContainer < 1) {
								if (count20FeetContainer < 2) {
									$scope.containerArray.push(oBooking);
									if ($scope.containerArray.length == 2) {
										applyDoubleTwentyFeetRate();
									}
								} else {
									oBooking.selected = false;
									swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
								}
							} else {
								oBooking.selected = false;
								swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
							}
						} else {
							oBooking.selected = false;
							swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
						}
					} else if (container_type == "40 Feet") {
						if ($scope.containerArray.length < 2) {
							if (count40FeetContainer < 1) {
								if (count20FeetContainer < 2) {
									$scope.containerArray.push(oBooking);
								} else {
									oBooking.selected = false;
									swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
								}
							} else {
								oBooking.selected = false;
								swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
							}
						} else {
							oBooking.selected = false;
							swal("Warning!", vehicleType + " Vehicle allows only single 40 Feet container or double 20 Feet Container.", "warning");
						}
					}
				}
			} else {
				$scope.containerArray.push(oBooking);
			}
		} else if (oBooking && !oBooking.selected) {
			for (i = 0; i < $scope.containerArray.length; i++) {
				if ($scope.containerArray[i]._id == oBooking._id) {
					$scope.remove($scope.containerArray[i], i);
				}
			}
			/*$scope.containerArray.splice(index,1);
			oBooking.selected = false;*/
		}
	};

	/*$scope.$watch('getSelectedBookingAllItem', function(newVal, oldVal) {
			if(newVal !== oldVal) {
			  for (var i = 0; i < $scope.getSelectedBookingAllItem.length; i++) {
				var tempFreight = 0;
				if($scope.getSelectedBookingAllItem[i].payment_basis == "Fixed"){
				  tempFreight = (1*($scope.getSelectedBookingAllItem[i].rate||0));
				}else if($scope.getSelectedBookingAllItem[i].payment_basis == "PUnit"){
				  tempFreight = ($scope.getSelectedBookingAllItem[i].no_of_unit*($scope.getSelectedBookingAllItem[i].rate||0));
				}else{
				  tempFreight = (($scope.getSelectedBookingAllItem[i].weight ? ($scope.getSelectedBookingAllItem[i].weight.value ||0 ):0)*($scope.getSelectedBookingAllItem[i].rate||0))
				}
				$scope.getSelectedBookingAllItem[i].freight = (tempFreight>0)?parseFloat((Math.round(tempFreight * 100) / 100).toFixed(2)):0;
			  }
			}
		  }, true);


		  $scope.$watch('selectedTypeBookings', function(newVal, oldVal) {
			if(newVal !== oldVal) {
			  for (var i = 0; i < $scope.selectedTypeBookings.length; i++) {
				var tempFreight = 0;
				if($scope.selectedTypeBookings[i].payment_basis == "Fixed"){
				  tempFreight = (1*($scope.selectedTypeBookings[i].rate||0));
				}else if($scope.selectedTypeBookings[i].payment_basis == "PUnit"){
				  tempFreight = ($scope.selectedTypeBookings[i].no_of_unit*($scope.selectedTypeBookings[i].rate||0));
				}else{
				  tempFreight = (($scope.selectedTypeBookings[i].weight ? ($scope.selectedTypeBookings[i].weight.value ||0 ):0)*($scope.selectedTypeBookings[i].rate||0))
				}
				$scope.selectedTypeBookings[i].freight = (tempFreight>0)?parseFloat((Math.round(tempFreight * 100) / 100).toFixed(2)):0;
			  }
			}
		  }, true);*/

	$scope.weightChange1 = function (i) {
		var tempFreight = 0;
		if ($scope.getSelectedBookingAllItem[i].payment_basis == "Fixed") {
			tempFreight = (1 * ($scope.getSelectedBookingAllItem[i].rate || 0));
		} else if ($scope.getSelectedBookingAllItem[i].payment_basis == "PUnit") {
			tempFreight = ($scope.getSelectedBookingAllItem[i].no_of_unit * ($scope.getSelectedBookingAllItem[i].rate || 0));
		} else {
			tempFreight = (($scope.getSelectedBookingAllItem[i].weight ? ($scope.getSelectedBookingAllItem[i].weight.value || 0) : 0) * ($scope.getSelectedBookingAllItem[i].rate || 0))
		}
		$scope.getSelectedBookingAllItem[i].freight = (tempFreight > 0) ? parseFloat((Math.round(tempFreight * 100) / 100).toFixed(2)) : 0;
	};
	$scope.weightChange2 = function (i) {
		var tempFreight = 0;
		if ($scope.selectedTypeBookings[i].payment_basis == "Fixed") {
			tempFreight = (1 * ($scope.selectedTypeBookings[i].rate || 0));
		} else if ($scope.selectedTypeBookings[i].payment_basis == "PUnit") {
			tempFreight = ($scope.selectedTypeBookings[i].no_of_unit * ($scope.selectedTypeBookings[i].rate || 0));
		} else {
			tempFreight = (($scope.selectedTypeBookings[i].weight ? ($scope.selectedTypeBookings[i].weight.value || 0) : 0) * ($scope.selectedTypeBookings[i].rate || 0))
		}
		$scope.selectedTypeBookings[i].freight = (tempFreight > 0) ? parseFloat((Math.round(tempFreight * 100) / 100).toFixed(2)) : 0;
	};

	$scope.checkRadio = function (i) {
		$scope.selectedRate = $scope.aNewRates[i];
	};

	$scope.customerName = [];
	$scope.AllocateSubmit = function () {

		angular.forEach($scope.getSelectedBookingAllItem, function (o) {
			$scope.addBookingInArray(o);
		});


		if ($scope.selectedVehicle.owner_group == 'Market') {
			if ($scope.Allocate.m_vehicle_no) {
				if ($scope.getSelectedBookingAllItem) {
					if ($scope.isSingleBooking == 'true') {
						if ($scope.containerArray.length) {
							for (i = 0; i < $scope.containerArray.length; i++) {
								if ($scope.containerArray[i]._id) {
									$scope.containerArray[i].info_id = $scope.containerArray[i]._id;
								}
								if ($scope.Allocate.allocation_date) {
									//**** custom time add with date ******//
									var xx = $scope.Allocate.allocation_date;
									xx.setHours($scope.hourSel1);
									xx.setMinutes($scope.minuteSel1);
									xx.setMilliseconds(0);
									$scope.Allocate.allocation_date = xx;
									//**** custom time add with date ******//
									$scope.containerArray[i].allocation_date = $scope.Allocate.allocation_date;
								}
								$scope.Allocate.booking_info = $scope.containerArray;
							}

							$scope.Allocate.isMultiCustomer = false;
							$scope.Allocate.isMultiBooking = false;
							if ($scope.selectedRate) {
								$scope.Allocate.route.rates = $scope.selectedRate;
								$scope.Allocate.rate = $scope.selectedRate.rate_final;
								$scope.Allocate.freight = $scope.selectedRate.freight_final;
								if ($scope.Allocate.booking_info && $scope.Allocate.booking_info.length > 0) {
									for (var b = 0; b < $scope.Allocate.booking_info.length; b++) {
										$scope.Allocate.booking_info[b].rate = $scope.Allocate.rate;
										$scope.Allocate.booking_info[b].freight = $scope.Allocate.freight;
									}
								}
							}
							var Allote = $scope.Allocate;
							Allote.trip_manager = {
								"name": $scope.Allocate.oManager.full_name,
								"mobile": $scope.Allocate.oManager.contact_no,
								"email": $scope.Allocate.oManager.email,
								//"empl_id" :$scope.Allocate.oManager.,
								"userId": $scope.Allocate.oManager.userId
							}
							vehicleAllcationService.postAllocate(Allote, suc, fail);
						} else
							swal("Please Select one Booking");
					} else {
						if ($scope.containerArray.length) {
							for (i = 0; i < $scope.containerArray.length; i++) {
								if ($scope.containerArray[i].customer_name) {
									if ($scope.customerName.length > 0) {
										for (j = 0; j < $scope.customerName.length; j++) {
											if ($scope.customerName[j] != $scope.containerArray[i].customer_name) {
												$scope.customerName.push($scope.containerArray[i].customer_name);
											}
										}
										;
									} else {
										$scope.customerName.push($scope.containerArray[i].customer_name);
									}
								}
								if ($scope.containerArray[i]._id) {
									$scope.containerArray[i].info_id = $scope.containerArray[i]._id;
								}
								/*if($scope.Allocate.driver_name){
								 $scope.containerArray[i].driver_name = $scope.Allocate.driver_name;
								 }*/
								if ($scope.Allocate.allocation_date) {
									//**** custom time add with date ******//
									var xx = $scope.Allocate.allocation_date;
									xx.setHours($scope.hourSel1);
									xx.setMinutes($scope.minuteSel1);
									xx.setMilliseconds(0);
									$scope.Allocate.allocation_date = xx;
									//**** custom time add with date ******//
									$scope.containerArray[i].allocation_date = $scope.Allocate.allocation_date;
								}
								/*if($scope.Allocate.isMultiBooking){
								 $scope.containerArray[i].isMultiBooking = $scope.Allocate.isMultiBooking;
								 } else {
								 $scope.containerArray[i].isMultiBooking = $scope.Allocate.isMultiBooking;
								 }*/
								$scope.Allocate.booking_info = $scope.containerArray;
							}
							if ($scope.customerName.length > 1) {
								$scope.Allocate.isMultiCustomer = true;
							} else {
								$scope.Allocate.isMultiCustomer = false;
							}
							$scope.Allocate.isMultiBooking = true;
							var Allote = $scope.Allocate;
							Allote.trip_manager = {
								"name": $scope.Allocate.oManager.full_name,
								"mobile": $scope.Allocate.oManager.contact_no,
								"email": $scope.Allocate.oManager.email,
								//"empl_id" :$scope.Allocate.oManager.,
								"userId": $scope.Allocate.oManager.userId
							}
							vehicleAllcationService.postAllocate(Allote, suc, fail);
						} else
							swal("Please Select one Booking");
					}

				}
			} else {
				swal('warning', 'This is market vehicle.Please enter market vehicle number.', 'warning');
			}
		} else {

			if ($scope.getSelectedBookingAllItem) {
				if ($scope.isSingleBooking == 'true') {
					if ($scope.containerArray.length) {
						for (i = 0; i < $scope.containerArray.length; i++) {
							if ($scope.containerArray[i]._id) {
								$scope.containerArray[i].info_id = $scope.containerArray[i]._id;
							}
							if ($scope.Allocate.allocation_date) {
								//**** custom time add with date ******//
								var xx = $scope.Allocate.allocation_date;
								xx.setHours($scope.hourSel1);
								xx.setMinutes($scope.minuteSel1);
								xx.setMilliseconds(0);
								$scope.Allocate.allocation_date = xx;
								//**** custom time add with date ******//
								$scope.containerArray[i].allocation_date = $scope.Allocate.allocation_date;
							}
							$scope.Allocate.booking_info = $scope.containerArray;
						}

						$scope.Allocate.isMultiCustomer = false;
						$scope.Allocate.isMultiBooking = false;
						if ($scope.selectedRate) {
							$scope.Allocate.route.rates = $scope.selectedRate;
							$scope.Allocate.rate = $scope.selectedRate.rate_final;
							$scope.Allocate.freight = $scope.selectedRate.freight_final;
							if ($scope.Allocate.booking_info && $scope.Allocate.booking_info.length > 0) {
								for (var b = 0; b < $scope.Allocate.booking_info.length; b++) {
									$scope.Allocate.booking_info[b].rate = $scope.Allocate.rate;
									$scope.Allocate.booking_info[b].freight = $scope.Allocate.freight;
								}
							}
						}
						var Allote = $scope.Allocate;
						Allote.trip_manager = {
							"name": $scope.Allocate.oManager.full_name,
							"mobile": $scope.Allocate.oManager.contact_no,
							"email": $scope.Allocate.oManager.email,
							//"empl_id" :$scope.Allocate.oManager.,
							"userId": $scope.Allocate.oManager.userId
						}
						vehicleAllcationService.postAllocate(Allote, suc, fail);
					} else
						swal("Please Select one Booking");
				} else {
					if ($scope.containerArray.length) {
						for (i = 0; i < $scope.containerArray.length; i++) {
							if ($scope.containerArray[i].customer_name) {
								if ($scope.customerName.length > 0) {
									for (j = 0; j < $scope.customerName.length; j++) {
										if ($scope.customerName[j] != $scope.containerArray[i].customer_name) {
											$scope.customerName.push($scope.containerArray[i].customer_name);
										}
									}
									;
								} else {
									$scope.customerName.push($scope.containerArray[i].customer_name);
								}
							}
							if ($scope.containerArray[i]._id) {
								$scope.containerArray[i].info_id = $scope.containerArray[i]._id;
							}
							/*if($scope.Allocate.driver_name){
							 $scope.containerArray[i].driver_name = $scope.Allocate.driver_name;
							 }*/
							if ($scope.Allocate.allocation_date) {
								//**** custom time add with date ******//
								var xx = $scope.Allocate.allocation_date;
								xx.setHours($scope.hourSel1);
								xx.setMinutes($scope.minuteSel1);
								xx.setMilliseconds(0);
								$scope.Allocate.allocation_date = xx;
								//**** custom time add with date ******//
								$scope.containerArray[i].allocation_date = $scope.Allocate.allocation_date;
							}
							/*if($scope.Allocate.isMultiBooking){
							 $scope.containerArray[i].isMultiBooking = $scope.Allocate.isMultiBooking;
							 } else {
							 $scope.containerArray[i].isMultiBooking = $scope.Allocate.isMultiBooking;
							 }*/
							$scope.Allocate.booking_info = $scope.containerArray;
						}
						if ($scope.customerName.length > 1) {
							$scope.Allocate.isMultiCustomer = true;
						} else {
							$scope.Allocate.isMultiCustomer = false;
						}
						$scope.Allocate.isMultiBooking = true;
						var Allote = $scope.Allocate;
						Allote.trip_manager = {
							"name": $scope.Allocate.oManager.full_name,
							"mobile": $scope.Allocate.oManager.contact_no,
							"email": $scope.Allocate.oManager.email,
							//"empl_id" :$scope.Allocate.oManager.,
							"userId": $scope.Allocate.oManager.userId
						}
						vehicleAllcationService.postAllocate(Allote, suc, fail);
					} else
						swal("Please Select one Booking");
				}

			}

		}
		/*else {
		   swal("Please Select container no","","failure");
		}*/
	};
	// By new

	$scope.getCustomer = function (singleBooking) {
		if (singleBooking == 'false') {
			$scope.isSingleCustomer = 'true';
		}
	};
	$scope.getmultipleCustomer = function (singleBooking) {
		if (singleBooking == 'false') {
			$scope.oName = 'true';
		}
	};

	$scope.getbookingType = function (bookingId) {
		if (bookingId) {
			if ($scope.isSingleBooking == 'true') {
				if ($scope.getSelectedBookingAllItem1) {
					$scope.getSelectedBookingAllItem = $scope.getSelectedBookingAllItem1;
				}
				var allContainerNum = $scope.getSelectedBookingAllItem;
				$scope.getSelectedBookingAllItem1 = $scope.getSelectedBookingAllItem;
				$scope.getSelectedBookingAllItem = [];
				for (i = 0; i < allContainerNum.length; i++) {
					if (allContainerNum[i].booking_no == bookingId || allContainerNum[i].bookingId == bookingId) {
						$scope.getSelectedBookingAllItem.push(allContainerNum[i]);
						$scope.customer = '';
					} else if (allContainerNum[i].customer_name == bookingId) {
						$scope.getSelectedBookingAllItem.push(allContainerNum[i]);
						$scope.bookingId = '';
					}
				}
			} else {
				if ($scope.selectedTypeBookings1) {
					$scope.selectedTypeBookings = $scope.selectedTypeBookings1;
				}
				var allContainerNum = $scope.selectedTypeBookings;
				$scope.selectedTypeBookings1 = $scope.selectedTypeBookings;
				$scope.selectedTypeBookings = [];
				for (i = 0; i < allContainerNum.length; i++) {
					if (allContainerNum[i].booking_no == bookingId || allContainerNum[i].bookingId == bookingId) {
						$scope.selectedTypeBookings.push(allContainerNum[i]);
						$scope.customer = '';
					} else if (allContainerNum[i].customer_name == bookingId) {
						$scope.selectedTypeBookings.push(allContainerNum[i]);
						$scope.bookingId = '';
					}
				}
			}
		} else {
			if ($scope.isSingleBooking == 'true') {
				$scope.getSelectedBookingAllItem = $scope.getSelectedBookingAllItem1;
			} else {
				$scope.selectedTypeBookings = $scope.selectedTypeBookings1;
			}
		}
	};

	$scope.getUser = function () {
		function getsucc(response) {
			$scope.users = response.data;
			$scope.setTripManager();
		}

		function getfail(response) {
			console.log(response);
		}

		FleetService.getFleetWithPagination({all: true}, getsucc, getfail);
		// userService.getUsers({ user_type: "Trip Manager", all: true }, getsucc, getfail)
	};
	$scope.getUser();

	$scope.setTripManager = function () {
		Vehicle.getVehiclesWithPagination({vehicle_reg_no: $scope.Allocate.vehicle_no}, function (data) {
			console.log(data);
			$scope.Allocate.owner_group = data.data[0].owner_group;

			angular.forEach($scope.users, function (arr) {
				if (arr['name'] === $scope.Allocate.owner_group)
					$scope.Allocate.oManager = arr;
			});
		});
	};

	//add deal button working here
	$scope.addDealObjData = function () {
		$rootScope.Allocate = $scope.Allocate;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/vehicleAllcation/addPaymentDealData.html',
			controller: 'addPaymentDealDataCtrl',
			resolve: {
				thatData: $scope.Allocate,
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
	}

});

materialAdmin.controller("addPaymentDealDataCtrl", function ($rootScope, $scope, constants, DateUtils, $uibModalInstance, thatData, selectedVendor, growlService, formValidationgrowlService) {

	$scope.selectedVendor = selectedVendor;
	$rootScope.aBankingDetails = $scope.selectedVendor.banking_details;
	$scope.aType = ['Liter', 'Amount'];

	$scope.closeModal = function () {
		console.log($rootScope.Allocate);
		if ($rootScope.Allocate.vendorDeal && $rootScope.Allocate.vendorDeal.payment_type && $rootScope.Allocate.vendorDeal.weight_type && $rootScope.Allocate.vendorDeal.total_expense && $rootScope.Allocate.vendorDeal.toPay) {
			$rootScope.Allocate.vendorDeal.doneDeal = true;
		} else {
			$rootScope.Allocate.vendorDeal.doneDeal = false;
		}
		//$rootScope.Allocate.deal = {};
		$uibModalInstance.dismiss('cancel');
	};

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
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
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form **************

	$rootScope.Allocate = thatData;
	if (!$rootScope.Allocate.vendorDeal) {
		$rootScope.Allocate.vendorDeal = {};
		$rootScope.Allocate.vendorDeal.diesel = {};
	}
	$scope.$constants = constants;

	$rootScope.Allocate.vendorDeal.doneDeal = false;

	if ($rootScope.Allocate.vendorDeal) {
		$rootScope.Allocate.vendorDeal.advance_due_date = new Date();
	}


	$scope.changePayType = function (pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			$rootScope.Allocate.vendorDeal.toPay = ($rootScope.Allocate.vendorDeal.total_expense || 0) - ($rootScope.Allocate.vendorDeal.munshiyana || 0);
			$rootScope.Allocate.vendorDeal.advance = 0;

			if ($rootScope.Allocate.vendorDeal.diesel) {
				$rootScope.Allocate.vendorDeal.diesel.quantity = 0;
				$rootScope.Allocate.vendorDeal.diesel.rate = 0;
				$rootScope.Allocate.vendorDeal.diesel.amount = 0;
			}
			$rootScope.Allocate.vendorDeal.driver_cash = 0;
			$rootScope.Allocate.vendorDeal.toll_tax = 0;
			$rootScope.Allocate.vendorDeal.other_charges = 0;
			$rootScope.Allocate.vendorDeal.other_charges_remark = '';
			$rootScope.Allocate.vendorDeal.account_payment = 0;
		}
	};

	$scope.changeAmount = function () {
		if ($rootScope.Allocate.vendorDeal.diesel.quantity && $rootScope.Allocate.vendorDeal.diesel.rate) {
			$rootScope.Allocate.vendorDeal.diesel.amount = $rootScope.Allocate.vendorDeal.diesel.quantity * $rootScope.Allocate.vendorDeal.diesel.rate;
		} else {
			$rootScope.Allocate.vendorDeal.diesel.amount = 0;
		}
	};
	$scope.changeTotal = function () {
		if ($rootScope.Allocate.vendorDeal.diesel.amount >= 0) {
			$rootScope.Allocate.vendorDeal.total_expense = ($rootScope.Allocate.vendorDeal.diesel.amount || 0) + ($rootScope.Allocate.vendorDeal.driver_cash || 0) + ($rootScope.Allocate.vendorDeal.toll_tax || 0) + ($rootScope.Allocate.vendorDeal.other_charges || 0);
		} else {
			//$rootScope.Allocate.deal.total_expense = 0;
		}
	};
	$scope.calcTotalAll = function () {
		// console.log('allocate', $scope.Allocate);
		// console.log('vendor', $scope.selectedVendor);
		var vendorServingRouteFound = $scope.selectedVendor.routes.find((routeAndVehTypes) => routeAndVehTypes.route._id === $scope.Allocate.route._id);
		var vehTypeFound = vendorServingRouteFound && vendorServingRouteFound.vehicleTypes.find(vt => vt.vehicleType.code === $scope.Allocate.veh_type.code);
		// console.log('vehTypeFound', vehTypeFound);
		switch ($scope.Allocate.vendorDeal.weight_type) {
			case 'Fixed':
				$scope.calculateTotalFixed(vehTypeFound);
				break;
			case 'PMT':
				$scope.calculateTotalPMT(vehTypeFound);
				break;
			case 'PUnit':
				$scope.calculateTotalPUnit(vehTypeFound);
				break;
		}
	};
	$scope.calculateTotalFixed = function (vehTypeFound = {}) {
		$scope.Allocate.vendorDeal.total_expense = vehTypeFound.rates || 0;
		$scope.changeAdvance('total');
		$scope.changeAcPayment();
	};
	$scope.calculateTotalPMT = function (vehTypeFound = {}) {
		$scope.Allocate.vendorDeal.pmtWeight = $scope.Allocate.vendorDeal.pmtWeight || $scope.Allocate.loadedWeight;
		$scope.Allocate.vendorDeal.pmtRate = $scope.Allocate.vendorDeal.pmtRate || vehTypeFound.ratePerMT;
		$scope.Allocate.vendorDeal.total_expense = ($scope.Allocate.vendorDeal.pmtWeight || 0) * ($scope.Allocate.vendorDeal.pmtRate || 0);
		$scope.changeAdvance('total');
		$scope.changeAcPayment();
	};
	$scope.calculateTotalPUnit = function (vehTypeFound = {}) {
		$scope.Allocate.vendorDeal.perUnitPrice = $scope.Allocate.vendorDeal.perUnitPrice || vehTypeFound.ratePerUnit;
		$scope.Allocate.vendorDeal.totalUnits = $scope.Allocate.vendorDeal.totalUnits || ($scope.Allocate.container && $scope.Allocate.container.length);
		$scope.Allocate.vendorDeal.total_expense = ($scope.Allocate.vendorDeal.perUnitPrice || 0) * ($scope.Allocate.vendorDeal.totalUnits || 0);
		$scope.changeAdvance('total');
		$scope.changeAcPayment();
	};
	$scope.resetAll = function (wt) {
		if (wt) {
			$scope.Allocate.vendorDeal.weight_type = undefined;
		}
		$scope.Allocate.vendorDeal.total_expense = undefined;
		$scope.Allocate.vendorDeal.munshiyana = undefined;
		$scope.Allocate.vendorDeal.advance = undefined;
		$scope.Allocate.vendorDeal.toPay = undefined;
		$scope.Allocate.vendorDeal.pmtWeight = undefined;
		$scope.Allocate.vendorDeal.pmtRate = undefined;
		$scope.Allocate.vendorDeal.perUnitPrice = undefined;
		$scope.Allocate.vendorDeal.totalUnits = undefined;
	};
	$scope.changeAdvance = function (type) {
		var tot_exp = angular.copy($rootScope.Allocate.vendorDeal.total_expense);
		var joint_exp = ($rootScope.Allocate.vendorDeal.toPay || 0) + ($rootScope.Allocate.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			if ($rootScope.Allocate.vendorDeal.munshiyana > $rootScope.Allocate.vendorDeal.total_expense) {
				$rootScope.Allocate.vendorDeal.munshiyana = $rootScope.Allocate.vendorDeal.total_expense;
			}
			if ($rootScope.Allocate.vendorDeal.toPay >= $rootScope.Allocate.vendorDeal.munshiyana) {
				$rootScope.Allocate.vendorDeal.toPay = $rootScope.Allocate.vendorDeal.toPay - $rootScope.Allocate.vendorDeal.munshiyana;
				$scope.changeAdvance('topay');
			} else if ($rootScope.Allocate.vendorDeal.advance >= $rootScope.Allocate.vendorDeal.munshiyana) {
				$rootScope.Allocate.vendorDeal.advance = $rootScope.Allocate.vendorDeal.advance - $rootScope.Allocate.vendorDeal.munshiyana;
				$scope.changeAdvance('advance');
			}
		}
		if (type === 'advance') {
			$rootScope.Allocate.vendorDeal.toPay = (($rootScope.Allocate.vendorDeal.total_expense || 0) - ($rootScope.Allocate.vendorDeal.munshiyana || 0)) - ($rootScope.Allocate.vendorDeal.advance || 0);
		}
		if (type === 'topay') {
			$rootScope.Allocate.vendorDeal.advance = (($rootScope.Allocate.vendorDeal.total_expense || 0) - ($rootScope.Allocate.vendorDeal.munshiyana || 0)) - ($rootScope.Allocate.vendorDeal.toPay || 0);
		}
		if ($rootScope.Allocate.vendorDeal.payment_type === 'To pay' || $rootScope.Allocate.vendorDeal.payment_type === 'To be billed') {
			$rootScope.Allocate.vendorDeal.toPay = ($rootScope.Allocate.vendorDeal.total_expense || 0) - ($rootScope.Allocate.vendorDeal.munshiyana || 0);
			$rootScope.Allocate.vendorDeal.advance = 0;
		}
	};

	$scope.changeAcPayment = function () {
		$rootScope.Allocate.vendorDeal.account_payment = ($rootScope.Allocate.vendorDeal.advance || 0) - ($rootScope.Allocate.vendorDeal.diesel ? ($rootScope.Allocate.vendorDeal.diesel.amount || 0) : 0) - ($rootScope.Allocate.vendorDeal.driver_cash || 0) - ($rootScope.Allocate.vendorDeal.toll_tax || 0) - ($rootScope.Allocate.vendorDeal.other_charges || 0);
	};

	$scope.addData = function () {
		if ($rootScope.Allocate.vendorDeal && $rootScope.Allocate.vendorDeal.payment_type && $rootScope.Allocate.vendorDeal.weight_type && $rootScope.Allocate.vendorDeal.total_expense && ($rootScope.Allocate.vendorDeal.toPay || $rootScope.Allocate.vendorDeal.toPay === 0)) {
			$rootScope.Allocate.vendorDeal.doneDeal = true;
		} else {
			$rootScope.Allocate.vendorDeal.doneDeal = false;
		}
		$uibModalInstance.dismiss('cancel');
	};

	$scope.updateSelection = function (position, entities) {
		$scope.Allocate.vendorDeal.bankingDetail = $rootScope.aBankingDetails[position];
		angular.forEach(entities, function (bank, index) {
			if (position != index)
				bank.checked = false;
		});
	}


});

function allocationGrUpsertController(
	$modal,
	$modalInstance,
	$parse,
	$scope,
	$rootScope,
	$stateParams,
	billBookService,
	billingPartyService,
	branchService,
	CustomerRateChartService,
	confService,
	consignorConsigneeService,
	customer,
	cityStateService,
	DatePicker,
	dateUtils,
	formulaEvaluateFilter,
	materialService,
	otherUtils,
	stateDataRetain,
	tripServices,
	Vehicle,
	incentiveService,
	oTrip,
	dphService
) {
	let vm = this;

	// function identifier
	vm.closeModal = closeModal;
	vm.calculateIncentive = calculateIncentive;
	vm.calculateRate = calculateRate;
	vm.clearIncentive = clearIncentive;
	vm.calday = calday;
	vm.getConsignee = getConsignee;
	vm.getConsignor = getConsignor;
	vm.getBillingParty = getBillingParty;
	vm.getSuppIncentive = getSuppIncentive;
	vm.updateIncentive = updateIncentive;
	vm.clearSuppIncentive = clearSuppIncentive;
	vm.calculateGst = calculateGst;
	vm.getCustomers = getCustomers;
	vm.getBillBookNo = getBillBookNo;
	vm.getAllBranch = getAllBranch;
	vm.getVname = getVname;
	vm.getRates = getRates;
	vm.getDPH = getDPH;
	vm.onCustomerSelect = onCustomerSelect;
	vm.getDPHRate = getDPHRate;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.SelectRateChart = SelectRateChart;
	vm.setPaymentBasis = setPaymentBasis;
	vm.updateInvoiceMaterialObj = updateInvoiceMaterialObj;
	vm.getRoute = getRoute;
	vm.getARBranch = getARBranch;
	vm.submit = submit;
	vm.setTime = setTime;
	vm.getGstType = getGstType;
	vm.aStates = otherUtils.getState();


	(function init() {

		vm.aHours = [];
		vm.aMinutes = [];

		for (let h = 0; h < 24; h++)
		vm.aHours.push(h);

		for (let m = 0; m < 60; m++)
		vm.aMinutes.push(m);

		vm.gateOuthourSel = new Date().getHours();
		vm.gateOutminuteSel = new Date().getMinutes();
		vm.gatePasshourSel = new Date().getHours();
		vm.gatePassminuteSel = new Date().getMinutes();

		if($scope.$configs.GR && $scope.$configs.GR.config)
			vm.__FormList = $scope.$configs.GR.config;

		vm.arMaxDate = new Date(new Date().setDate(new Date(new Date()).getDate() + 7));
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		vm.allocation_date=$rootScope.allocationDate;
		vm.material = {};
		vm.aGstType = ['IGST', 'CGST & SGST'];
		vm.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};
		vm.__RateChart = $scope.$constants.modelConfigs.RATE_CHART;
		vm.DatePicker = angular.copy(DatePicker);
		vm.selectMaterialEvents = {
			onSelectionChanged: function () {

			}
		};

		if (oTrip) {
			vm.selectedGr = oTrip;
			vm.mode = 'add';

		} else {
			stateDataRetain.back('booking_manage.vehicleAlollcation.allocate');
			return;
		}

		// some basic operation based on mode the state is rendered
		getFormList();

		if (vm.mode === 'add' || vm.mode === 'edit') {
			vm.selectedGr.customer = (vm.selectedGr.customer && vm.selectedGr.customer._id) ? vm.selectedGr.customer : undefined;
			vm.selectedGr.billingParty = (vm.selectedGr.billingParty && vm.selectedGr.billingParty._id) ? vm.selectedGr.billingParty : undefined;
			vm.selectedGr.consignor = (vm.selectedGr.consignor && vm.selectedGr.consignor._id) ? vm.selectedGr.consignor : undefined;
			vm.selectedGr.consignee = (vm.selectedGr.consignee && vm.selectedGr.consignee._id) ? vm.selectedGr.consignee : undefined;
			// vm.selectedGr.consignor = vm.selectedGr.consignor || vm.selectedGr.consigner;
			vm.selectedGr.invoices = Array.isArray(vm.selectedGr.invoices) ? vm.selectedGr.invoices : [];
			vm.selectedGr.eWayBills = Array.isArray(vm.selectedGr.eWayBills) ? vm.selectedGr.eWayBills : [];
			vm.selectedGr.detention = vm.selectedGr.loadingDetention || 0;
			vm.selectedGr.payment_type = vm.selectedGr.payment_type;
			vm.selectedGr.payment_basis = vm.selectedGr.payment_basis;

			vm.selectedGr.branch = vm.selectedGr.branch || {};
			vm.selectedGr.deduction = vm.selectedGr.deduction || {};
			vm.selectedGr.charges = vm.selectedGr.charges || {};
			vm.selectedGr.pod = vm.selectedGr.pod || {};

			if (vm.selectedGr.pod.date)
				vm.selectedGr.pod.date = new Date(vm.selectedGr.pod.date);

			if (vm.selectedGr.pod.unloadingArrivalTime) {
				vm.selectedGr.pod.unloadingArrivalTime = new Date(vm.selectedGr.pod.unloadingArrivalTime);
				vm.unloadingArrivalTimeModel = new Date();
				vm.unloadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.unloadingArrivalTimeModel, vm.selectedGr.pod.unloadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingLoadingTime) {
				vm.selectedGr.pod.billingLoadingTime = new Date(vm.selectedGr.pod.billingLoadingTime);
				vm.billingLoadingTimeModel = new Date();
				vm.billingLoadingTimeModel = dateUtils.setHoursFromDate(vm.billingLoadingTimeModel, vm.selectedGr.pod.billingLoadingTime);
			}

			if (vm.selectedGr.pod.loadingArrivalTime) {
				vm.selectedGr.pod.loadingArrivalTime = new Date(vm.selectedGr.pod.loadingArrivalTime);
				vm.loadingArrivalTimeModel = new Date();
				vm.loadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.loadingArrivalTimeModel, vm.selectedGr.pod.loadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingUnloadingTime) {
				vm.selectedGr.pod.billingUnloadingTime = new Date(vm.selectedGr.pod.billingUnloadingTime);
				vm.billingUnloadingTimeModel = new Date();
				vm.billingUnloadingTimeModel = dateUtils.setHoursFromDate(vm.billingUnloadingTimeModel, vm.selectedGr.pod.billingUnloadingTime);
			}

			if (vm.selectedGr.grDate)
				vm.selectedGr.grDate = new Date(vm.selectedGr.grDate);

			vm.selectedGr.invoices && vm.selectedGr.invoices.forEach(invObj=>{
				if (invObj.invoiceDate)
					invObj.invoiceDate = (invObj.invoiceDate.length<11)?moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString():invObj.invoiceDate;
				if (invObj.gateoutDate)
					invObj.gateoutDate = moment(invObj.gateoutDate, 'DD/MM/YYYY').toISOString();
				if (invObj.gatePassDate)
					invObj.gatePassDate = moment(invObj.gatePassDate, 'DD/MM/YYYY').toISOString();
			});

			if(typeof vm.selectedGr.container != 'string')
				vm.selectedGr.container = '';

			getAllBranch();
			getMaterialGroup();
		}

		if (vm.mode === 'add') {
			// let route = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
			vm.selectedGr.acknowledge = vm.selectedGr.acknowledge || {};
			if(vm.selectedGr.acknowledge.source && vm.selectedGr.acknowledge.destination){
				// no changes
			} else if($scope.$configs.booking && ($scope.$configs.booking.showRoute || $scope.$configs.booking.showGoogleRoute)) {
				vm.selectedGr.acknowledge.source = $rootScope.src && $rootScope.src.c || vm.selectedGr.src && vm.selectedGr.src.c;
				vm.selectedGr.acknowledge.destination = $rootScope.dest && $rootScope.dest.c || vm.selectedGr.dest && vm.selectedGr.dest.c;
			} else {
				vm.selectedGr.acknowledge.source = vm.selectedGr.route && vm.selectedGr.route.source && vm.selectedGr.route.source.c || vm.selectedGr.route && vm.selectedGr.route.source.placeName;
				vm.selectedGr.acknowledge.destination = vm.selectedGr.route && vm.selectedGr.route.destination && vm.selectedGr.route.destination.c || vm.selectedGr.route && vm.selectedGr.route.destination.placeName;
			}
			if(vm.selectedGr.rName && !(vm.selectedGr.acknowledge.source && vm.selectedGr.acknowledge.destination) ){
				let route = vm.selectedGr.rName.split('to').map(o => o.trim());
				vm.selectedGr.acknowledge.source = route[0];
				vm.selectedGr.acknowledge.destination = route[1];
			}

			vm.selectedGr.acknowledge.billedSource = vm.selectedGr.route && vm.selectedGr.route.source && vm.selectedGr.route.source.c || vm.selectedGr.route && vm.selectedGr.route.source.placeName;
			vm.selectedGr.acknowledge.billedDestination = vm.selectedGr.route && vm.selectedGr.route.destination && vm.selectedGr.route.destination.c || vm.selectedGr.route && vm.selectedGr.route.destination.placeName;
			vm.selectedGr.acknowledge.destinationState = vm.selectedGr.consignee ? vm.selectedGr.consignee.state : undefined;
			vm.selectedGr.acknowledge.routeDistance = vm.selectedGr.route && vm.selectedGr.route.route_distance;
			vm.gstPercentToApply = vm.selectedGr.billingParty && vm.selectedGr.billingParty.percent || '0';
			vm.selectedGr.payment_type = $scope.$constants.paymentType[1];
			getGstType();
			if (vm.selectedGr.consignee && vm.selectedGr.consignee.state) {
				vm.aStates.find(o => {
					if ((o.state).toLowerCase() == (vm.selectedGr.consignee.state).toLowerCase()) {
						vm.selectedGr.acknowledge.destinationState = o.state;
						return;
					}
				});
			}
		}

		if (vm.selectedGr.grNumber) {
			if (vm.selectedGr.stationaryId) {
				vm.grNumberModel = {
					bookNo: vm.selectedGr.grNumber,
					_id: vm.selectedGr.stationaryId
				}
			} else {
				vm.grNumberModel = vm.selectedGr.grNumber;
			}
		}

		// calculateIncentive();

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.charges.detentionLoading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.supplementaryBill.charges.detentionLoading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.charges.detentionUnloading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.supplementaryBill.charges.detentionUnloading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		// setting form view mode i.e. to preview(readonly) to edit/add(editable)
		if (vm.selectedGr.fpa && vm.selectedGr.fpa.vch && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.mode == 'edit') {
			vm.supplyReadonly = false;
			vm.readonly = true;
		} else if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = false;
			vm.isReadonly = false;
		} else {
			switch (vm.mode) {
				case 'add':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				case 'edit':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				default:
					vm.readonly = true;
					vm.supplyReadonly = true;
					vm.isReadonly = true;
					break;
			}
		}

		applyCss();
	})();




	/*
	* Fetch RateChart on both case add/edit
	* Add -
	* if single RateChart
	* show that rate only
	* capacity dropdown = baselabel + config.aCapacity
	* else if multiple RateChart
	* capacity dropdown = baselabel + config.aCapacity
	*
	* Edit -
	* */



	// Actual Function

	vm.onBranchSelectEvents = {
		onSelectionChanged: function () {
			vm.grNumberModel = undefined;
		}
	};

	function closeModal() {
		$modalInstance.dismiss();
	}

	function applyCss() {
		setTimeout(() => {
			$('.form-wrapper').find('label, .label').removeClass('req');
			$('.form-wrapper').find('[required]').parents('.form-group').find('label, .label').addClass('req');
		}, 2000);
	}

	function calday() {
		vm.loadingMinDate = dateUtils.addDate(vm.selectedGr.grDate, -15);
	}

	function calculateIncentive(buttonClicked = false) {

		if (!(vm.__FormList && vm.__FormList.incentive && vm.__FormList.incentive.visible)) {
			vm.incentivePercent = 0;
			return;
		}

		if (buttonClicked) {
			vm.incentiveButtonClicked = true;
			getRates();
		}
	}

	function calculateRate(oInvoice) {

		if (oInvoice.dummyCapacityObj) {
			oInvoice.baseValueLabel = oInvoice.dummyCapacityObj.label;
			oInvoice.capacity = oInvoice.dummyCapacityObj.baseVal || 0;
		}

		if (!oInvoice.aRateChart)
			return;

		let baseValToCheck;

		try {
			if (vm.__FormList.capacity.visible)
				baseValToCheck = oInvoice.capacity;
			else
				baseValToCheck = oInvoice.noOfUnits || 0;

		} catch (e) {
			baseValToCheck = oInvoice.noOfUnits || 0;
		}

		if (typeof baseValToCheck === 'undefined')
			return false;

		setPaymentBasis();

		let aRateChart = oInvoice.aRateChart || [];
		let foundRateChart;
		let foundRate;

		aRateChart.find(rateChart => {

			if (!Array.isArray(rateChart.baseRate) || !rateChart.baseRate.length) {

				if (baseValToCheck <= rateChart.baseValue) {
					foundRate = {
						baseVal: rateChart.baseValue,
						rate: rateChart.rate,
						baseValLabel: rateChart.baseValueLabel
					};
				}

			} else {
				foundRate = rateChart.baseRate.find(oRate => {
					if (baseValToCheck <= oRate.baseVal)
						return true;
					return false
				});
			}

			if (!foundRate)
				return false;

			foundRateChart = rateChart;
			return true
		});

		if (!foundRateChart && !foundRate && aRateChart[0]) {
			foundRateChart = aRateChart.slice(-1)[0];

			if (Array.isArray(foundRateChart.baseRate) && foundRateChart.baseRate.length)
				foundRate = foundRateChart.baseRate.slice(-1)[0];
			else {
				foundRate = {
					baseVal: foundRateChart.baseValue,
					rate: foundRateChart.rate,
					baseValLabel: foundRateChart.baseValueLabel
				};
			}

		}

		if (oInvoice && foundRateChart && foundRate)
			applyRates(oInvoice, foundRateChart, foundRate);
	}

	function setTime(date) {
		vm.selectedGr.grDate = new Date((date).setHours(0, 0, 0));
	}

	vm.onSelect = function (item, model, lable) {
		if (item.state) {
			vm.aStates.find(o => {
				if ((o.state).toLowerCase() == (item.state).toLowerCase()) {
					vm.selectedGr.acknowledge.destinationState = o.state;
					return;
				}
			});
		}
	};

	function getGstType() {
		// if(!vm.selectedGr.billingParty){
		// 		swal('Warning', 'No BillingParty Selected!!!!!', 'warning');
		// 		return;
		// }
		// if(($scope.$clientConfigs.gstin_no.substr(0, 2) === vm.selectedGr.billingParty.state_code ) || ($scope.$clientConfigs.gstin_no.substr(1, 1) === vm.selectedGr.billingParty.state_code)) {
		if (vm.gstPercentType == 'CGST & SGST') {
			vm.selectedGr.cGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.sGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.iGST_percent = 0;

		} else if (vm.gstPercentType === 'IGST') {
			vm.selectedGr.iGST_percent = vm.gstPercentToApply;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		} else {
			vm.gstPercentToApply = 0
			vm.selectedGr.iGST_percent = 0;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		}

	}

	function clearIncentive() {

		vm.selectedGr.charges.incentive = 0;
		typeof vm.watcherClearer === 'function' && vm.watcherClearer();

	}

	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getBillBookNo(viewValue) {

		if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}

		if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
			return [];

		if (!vm.selectedGr.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.selectedGr.branch && Array.isArray(vm.selectedGr.branch.grBook) && vm.selectedGr.branch.grBook.map(o => o.ref),
				type: 'Gr',
				useDate: moment(vm.selectedGr.grDate).startOf('day').toDate(),
				status: 'unused',
				inc: oTrip.grCounter,
			};

			if (Array.isArray(vm.selectedGr.usedGR) && vm.selectedGr.usedGR.length)
				requestObj['ne.bookNo'] = vm.selectedGr.usedGR

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.grNumberModel = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getBillingParty(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				customer: custId,
				name: viewValue
			};

			// if($scope.$configs.GR.custConfig)
			// 	oFilter.customer = custId;

			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function calculateGst(id) {
		if (!id)
			return swal('error', 'BillingParty Not Selected', 'error');

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				_id: id
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				onBillingPartySelect(response.data[0]);
				resolve(response.data);
			}
		});
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
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

	function getDPH(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.gateoutDate )
			return;

		getDPHRate();

	}

	function getRates(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.grDate || !vm.selectedGr.acknowledge || !vm.selectedGr.acknowledge.source || !vm.selectedGr.acknowledge.destination)
			return;

		// fetch rate chart for single invoice
		if (invoice) {
			fetchRateChart(invoice);
		} else {
			//	fetch rete chart for multiple invoices
			Promise.all(vm.selectedGr.invoices.map(invoiceObj => {
				return fetchRateChart(invoiceObj);
			})).then(function () {
				vm.firstCall = false;

			});
		}

		function fetchRateChart(invoice) {
			return new Promise(function (resolve, reject) {

				if (!invoice.material || !invoice.material.groupCode)
					return;

				let request = {};

				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
					request.source = vm.selectedGr.acknowledge.source;
				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
					request.destination = vm.selectedGr.acknowledge.destination;
				if (invoice.material && invoice.material.groupCode)
					request.materialGroupCode = invoice.material.groupCode;
				if (vm.selectedGr.customer && vm.selectedGr.customer._id)
					request.customer = vm.selectedGr.customer._id;
				if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
					request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

				function onSuccess(res) {
					invoice.aRateChart = res.data || [];
					if (invoice.aRateChart[0] && invoice.aRateChart[0].baseRate && invoice.aRateChart[0].baseRate.length) {
						invoice.aCapacity = invoice.aRateChart[0].baseRate.filter(o => !!o.baseVal);
					} else {
						invoice.aCapacity = invoice.aRateChart.map(o => ({
							rate: o.rate,
							baseVal: o.baseValue,
							label: o.baseValueLabel
						})).filter(o => !!o.baseVal);
					}

					if (invoice.aRateChart.length === 0) {
						invoice.aCapacity = vm.__FormList.capacity.aValue && vm.__FormList.capacity.aValue.map(o => ({
							rate: invoice.rate || 0,
							baseVal: 0,
							label: o
						})) || {};
					}

					if (invoice.aCapacity.length && !(invoice.dummyCapacityObj && invoice.dummyCapacityObj.label)) {
						invoice.dummyCapacityObj = invoice.aCapacity[0];
						calculateRate(invoice);
					}

					invoice.aRateChart.sort((a, b) => a.baseValue - b.baseValue);

					if (vm.firstCall)
						return resolve();

					calculateRate(invoice);
				}

				function onFailure(response) {
					console.log(response);
				}

				CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
			});
		}
	}

	function applyRates(oInvoice, foundRate, baseRate) {

		if (baseRate.baseVal)
			vm.selectedGr.acknowledge.baseValue = oInvoice.baseValue = baseRate.baseVal;
		if (baseRate.baseValLabel)
			oInvoice.baseValueLabel = baseRate.baseValLabel;
		if (baseRate.rate)
			vm.selectedGr.acknowledge.rateChartRate = oInvoice.rate = oInvoice.rateChartRate = baseRate.rate;

		if (foundRate.routeDistance)
			vm.selectedGr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.routeDistance)
			vm.selectedGr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.invoiceRate)
			oInvoice.invoiceRate = foundRate.invoiceRate;

		if (foundRate.grCharges && foundRate.grCharges.rate)
			vm.selectedGr.charges.grCharges = foundRate.grCharges.rate;
		if (foundRate.surCharges && foundRate.surCharges.rate)
			vm.selectedGr.charges.surCharges = foundRate.surCharges.rate;
		if (foundRate.cartageCharges && foundRate.cartageCharges.rate)
			vm.selectedGr.charges.cartageCharges = foundRate.cartageCharges.rate;
		if (foundRate.labourCharges && foundRate.labourCharges.rate)
			vm.selectedGr.charges.labourCharges = foundRate.labourCharges.rate;
		if (foundRate.otherCharges && foundRate.otherCharges.rate)
			vm.selectedGr.charges.other_charges = foundRate.otherCharges.rate;
		if (foundRate.prevFreightCharges && foundRate.prevFreightCharges.rate)
			vm.selectedGr.charges.prevFreightCharges = foundRate.prevFreightCharges.rate;
		if (foundRate.detentionLoading && foundRate.detentionLoading.rate)
			vm.selectedGr.loadingDetentionRate = foundRate.detentionLoading.rate;
		if (foundRate.detentionUnloading && foundRate.detentionUnloading.rate)
			vm.selectedGr.unloadingDetentionRate = foundRate.detentionUnloading.rate;
		if (foundRate.discount && foundRate.discount.rate)
			vm.selectedGr.deduction.discount = foundRate.discount.rate;

		if (foundRate.loading_charges && foundRate.loading_charges.rate)
			vm.selectedGr.charges.loading_charges = foundRate.loading_charges.rate;
		if (foundRate.unloading_charges && foundRate.unloading_charges.rate)
			vm.selectedGr.charges.unloading_charges = foundRate.unloading_charges.rate;
		if (foundRate.weightman_charges && foundRate.weightman_charges.rate)
			vm.selectedGr.charges.weightman_charges = foundRate.weightman_charges.rate;
		if (foundRate.overweight_charges && foundRate.overweight_charges.rate)
			vm.selectedGr.charges.overweight_charges = foundRate.overweight_charges.rate;
		if (foundRate.advance_charges && foundRate.advance_charges.rate)
			vm.selectedGr.deduction.advance_charges = foundRate.advance_charges.rate;
		if (foundRate.damage && foundRate.damage.rate)
			vm.selectedGr.deduction.damage = foundRate.damage.rate;
		if (foundRate.shortage && foundRate.shortage.rate)
			vm.selectedGr.deduction.shortage = foundRate.shortage.rate;
		if (foundRate.penalty && foundRate.penalty.rate)
			vm.selectedGr.deduction.penalty = foundRate.penalty.rate;
		if (foundRate.extra_running && foundRate.extra_running.rate)
			vm.selectedGr.charges.extra_running = foundRate.extra_running.rate;
		if (foundRate.dala_charges && foundRate.dala_charges.rate)
			vm.selectedGr.charges.dala_charges = foundRate.dala_charges.rate;
		if (foundRate.diesel_charges && foundRate.diesel_charges.rate)
			vm.selectedGr.charges.diesel_charges = foundRate.diesel_charges.rate;
		if (foundRate.kanta_charges && foundRate.kanta_charges.rate)
			vm.selectedGr.charges.kanta_charges = foundRate.kanta_charges.rate;
		if (foundRate.factory_halt && foundRate.factory_halt.rate)
			vm.selectedGr.charges.factory_halt = foundRate.factory_halt.rate;
		if (foundRate.company_halt && foundRate.company_halt.rate)
			vm.selectedGr.charges.company_halt = foundRate.company_halt.rate;
		if (foundRate.toll_charges && foundRate.toll_charges.rate)
			vm.selectedGr.charges.toll_charges = foundRate.toll_charges.rate;
		if (foundRate.green_tax && foundRate.green_tax.rate)
			vm.selectedGr.charges.green_tax = foundRate.green_tax.rate;

		if (foundRate.internal_rate && foundRate.internal_rate.rate)
			vm.selectedGr.internal_rate = foundRate.internal_rate.rate;
		if (foundRate.standardTime && foundRate.standardTime.rate)
			vm.selectedGr.standardTime = foundRate.standardTime.rate;

		vm.selectedGr.payment_basis = oInvoice.paymentBasis = foundRate.paymentBasis;

		if (foundRate.incentive && foundRate.incentive.rate) {

			switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
				case 'Master': {
					if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !foundRate.incentive || !foundRate.incentive.rate)
						return;

					// Handle failure response
					function onFailure(response) {
						console.log(response);
					}

					// Handle success response
					function onSuccess(response) {
						vm.incentivePercent = (response && response.data && response.data.rate) || 0;
						updateOnFreightChange();
					}

					incentiveService.autosuggest({
						customer: vm.selectedGr.customer._id,
						vehicle: vm.selectedGr.vehicle,
						date: new Date(vm.selectedGr.grDate).toISOString(),
					}, onSuccess, onFailure);

					break;
				}

				default:
					if (!vm.incentiveButtonClicked) {
						vm.incentiveButtonClicked = false;
						return;
					}

					switch (foundRate.incentive.basis) {

						case 'Percent of basic freight':
							vm.incentivePercent = foundRate.incentive.rate;
							updateOnFreightChange();
							break;

						case 'Fixed':
							vm.selectedGr.charges.incentive = foundRate.incentive.rate;
							break;

						default:
							if (typeof vm.selectedGr.incentivePercent != "number")
								return;

							let aExp = vm.__FormList.incentive.evalExp.map(e => {
								if (e.toString().indexOf('(RC)') + 1)
									return $parse(e.replace('(RC)', ''))(foundRate);
								return e;
							});

							vm.selectedGr.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
					}

			}
		}
	}

	function getFormList() {
		let id = false;

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...id.configs};
		} else
			confService.get(id, function (response) {
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
				calculateIncentive();
			});

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...id.configs};
		} else
			confService.get(id, function (response) {
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
				applyCss();
			});
	}

	// function getRoute(viewValue, projection) {
	// 	if (viewValue.length < 3) return;
	// 	return new Promise(function (resolve, reject) {
    //
	// 		let request = {
	// 			_t: 'autosuggest',
	// 			[projection]: viewValue,
	// 			projection
	// 		};
    //
	// 		// if(vm.selectedGr.customer && vm.selectedGr.customer._id)
	// 		// 	request.customer = vm.selectedGr.customer && vm.selectedGr.customer._id;
    //
	// 		CustomerRateChartService.get(request)
	// 			.then((res) => {
	// 				resolve(res.data);
	// 			})
	// 			.catch(e => reject([]));
	// 	});
	// }

	function getRoute (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	}

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				Vehicle.getNameTrim(viewValue, oSuc, oFail);

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

	function getARBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {


			let request = {
				name: viewValue
			};

			return new Promise(function (resolve, reject) {

				branchService.getAllBranches(request, oSuc, oFail);

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

	function getMaterialGroup() {
		var materialFilter = {
			all: true
		};

		materialService.getMaterialGroups(materialFilter, success);

		function success(response) {
			vm.aMaterialGroup = response.data;
		}
	}

	function getTrip(tripNo) {
		function success(res) {
			vm.oTrip = res.data.data.data[0];
			vm.nonSelectedGr = {
				totalWeight: 0,
				totalQty: 0,
				freight: 0,
				totalFreight: 0,
			};
			vm.oTrip.gr.forEach((o, i) => {
				if (o._id === vm.selectedGr._id) {
					vm.oTrip.gr[i] = vm.selectedGr;
					return;
				}
				vm.nonSelectedGr.totalFreight += o.totalFreight;
				vm.nonSelectedGr.totalQty += o.invoices.reduce((a, c) => {
					vm.nonSelectedGr.freight += (c.freight || 0);
					vm.nonSelectedGr.totalWeight += (c.billingWeightPerUnit || 0);
					return a + (c.billingNoOfUnits || 0);
				}, 0);
			});
		}

		tripServices.getAllTripsWithPagination({
			_id: tripNo
		}, success);
	}

	function getDPHRate() {
		var request = {};
		// request.from = moment(date, 'DD/MM/YYYY').startOf('day').toISOString();
		if(!vm.selectedGr.gateoutDate || !vm.selectedGr.customer || !vm.selectedGr.customer._id) return;
		let date = vm.selectedGr.gateoutDate;
		request.to = date.toISOString();
		request.customer = vm.selectedGr.customer && vm.selectedGr.customer._id;
		dphService.get(request, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			let res = response && response.data && response.data.data;
			// vm.selectedGr.invoices.forEach((obj,i) =>{
			if(!(vm.selectedGr.invoices && vm.selectedGr.invoices[0])){
				vm.selectedGr.invoices[0]= {};
			}
			vm.selectedGr.invoices[0].dphRate = res[0].hike;
			// console.log(vm.selectedGr.invoices[i].dphRate);
			// })

		}
	}

	function onCustomerSelect(customer) {
		//TODO remove below code
		//******************************************************

		if (customer.configs && customer.configs.GR && customer.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...customer.configs.GR.configs};
			vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...customer.configs.RATE_CHART.configs};
		} else
			vm.__FormList = $scope.$configs.GR.config;

		vm.selectedGr.billingParty = undefined;
		//******************************************************

		calculateIncentive();
		applyCss();
		if(vm.selectedGr.gateoutDate){
			getDPHRate(vm.selectedGr.gateoutDate);
		}
	}

	function onBillingPartySelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || vm.gstPercentToApply || '0';

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {

			// todo remove this code
			if (!Array.isArray($scope.$configs.client_allowed)) {
				$scope.logout();
			}

			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId == billingParty.clientId);

			if (user) {
				vm.selectedGr.billingParty.clientName = user.name;
				vm.gstPercentType = billingParty.state_code == user.state_code ? vm.aGstType[1] : vm.aGstType[0];
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}

		getGstType();

		//TODO remove below code
		//******************************************************

		if (billingParty.configs && billingParty.configs.GR && billingParty.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...billingParty.configs.GR.configs};
			// vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...billingParty.configs.RATE_CHART.configs};
		} else
			getFormList();
		//******************************************************

		applyCss();
	}

	function updateInvoiceMaterialObj(invoice, materialObj) {
		invoice.material = {
			groupName: materialObj.name,
			groupCode: materialObj.code,
			groupId: materialObj._id
		};
	}

	function SelectRateChart(selectedRowIndex) {

		if (!vm.selectedGr.invoices[selectedRowIndex].material.groupCode) {
			swal('warning', "Please Select Material", 'warning');
			return;
		}

		let modalInstance = $modal.open({
			templateUrl: 'views/myGR/addRateChartPopUp.html',
			controller: ['$uibModalInstance', '$timeout', 'otherData', 'lazyLoadFactory', addRateChartPopUpController],
			controllerAs: 'rcVm',
			resolve: {
				otherData: function () {
					return {
						selectedGr: vm.selectedGr,
						selectedInvoice: vm.selectedGr.invoices[selectedRowIndex],
						__RateChart: vm.__RateChartList
					};
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	function setPaymentBasis() {
		vm.selectedGr.invoices.forEach(oInv => {
			oInv.paymentBasis = vm.selectedGr.payment_basis || undefined;
		});
	}

	// function getBranch() {
	// 	if ($scope.$aBranch.length > 0) {
	// 		vm.aBranch = $scope.$aBranch;
	// 		return;
	// 	}
	// 	var branchFilter = {
	// 		all: true
	// 	};
	// 	branchService.getAllBranches(branchFilter, successBranches);
	//
	// 	function successBranches(data) {
	// 		vm.aBranch = data.data;
	// 	}
	// }

	function getAllBranch(inputModel) {
		let req = {
			no_of_docs: 10,
		};

		if (inputModel)
			req.name = inputModel;

		if (vm.aUserBranch && vm.aUserBranch.length) {
			req._ids = [];
			vm.aUserBranch.forEach(obj => {
				if (obj.write)
					req._ids.push(obj._id)
			});
			if (!(req._ids && req._ids.length)) {
				return
			} else {
				req._ids = JSON.stringify(req._ids);
			}
		}

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			if (vm.selectedGr.branch && vm.selectedGr.branch._id && !vm.aBranch.find(o => o._id === vm.selectedGr.branch._id))
				vm.aBranch.unshift(vm.selectedGr.branch);
		}
	}

	function setPodModelTime() {
		vm.loadingArrivalTimeModel && (vm.selectedGr.pod.loadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.loadingArrivalTime, vm.loadingArrivalTimeModel));
		vm.billingLoadingTimeModel && (vm.selectedGr.pod.billingLoadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingLoadingTime, vm.billingLoadingTimeModel));
		vm.unloadingArrivalTimeModel && (vm.selectedGr.pod.unloadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.unloadingArrivalTime, vm.unloadingArrivalTimeModel));
		vm.billingUnloadingTimeModel && (vm.selectedGr.pod.billingUnloadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingUnloadingTime, vm.billingUnloadingTimeModel));
	}

	function getSuppIncentive() {
		return new Promise(function (resolve, reject) {
			let obj = vm.selectedGr.invoices && vm.selectedGr.invoices[0];
			if (!obj.material || !obj.material.groupCode)
				return;

			let request = {};

			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
				request.source = vm.selectedGr.acknowledge.source;
			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
				request.destination = vm.selectedGr.acknowledge.destination;
			if (obj.material && obj.material.groupCode)
				request.materialGroupCode = obj.material.groupCode;
			if (vm.selectedGr.customer && vm.selectedGr.customer._id)
				request.customer = vm.selectedGr.customer._id;
			if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
				request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

			function onSuccess(res) {
				vm.newData = res.data || [];
				if (vm.newData.length) {
					vm.newData = vm.newData[0];
					if (vm.newData.incentive && vm.newData.incentive.rate) {

						switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
							case 'Master': {
								if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !vm.newData.incentive || !vm.newData.incentive.rate)
									return;

								// Handle failure response
								function onFailure(response) {
									console.log(response);
								}

								// Handle success response
								function onSuccess(response) {
									vm.selectedGr.supplementaryBill.incentivePercent = (response && response.data && response.data.rate) || 0;
									updateIncentive();
								}

								incentiveService.autosuggest({
									customer: vm.selectedGr.customer._id,
									vehicle: vm.selectedGr.vehicle,
									date: new Date(vm.selectedGr.grDate).toISOString(),
								}, onSuccess, onFailure);

								break;
							}

							default:

								switch (vm.newData.incentive.basis) {

									case 'Percent of basic freight':
										vm.selectedGr.supplementaryBill.incentivePercent = vm.newData.incentive.rate;
										updateIncentive();
										break;

									case 'Fixed':
										vm.selectedGr.supplementaryBill.charges.incentive = vm.newData.incentive.rate;
										break;

									default:
										if (typeof vm.selectedGr.supplementaryBill.incentivePercent != "number")
											return;

										let aExp = vm.__FormList.suppIncentive.evalExp.map(e => {
											if (e.toString().indexOf('(RC)') + 1)
												return $parse(e.replace('(RC)', ''))(vm.newData);
											return e;
										});

										vm.selectedGr.supplementaryBill.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
								}

						}
					}
				}
			}

			function onFailure(response) {
				console.log(response);
			}

			CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
		});
	}


	function updateIncentive(newVal) {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.supplementaryBill.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.supplementaryBill.charges.incentive = newVal * (vm.selectedGr.supplementaryBill.incentivePercent || 0) / 100;
		});

	}

	function clearSuppIncentive() {
		vm.selectedGr.supplementaryBill.charges.incentive = 0;
		vm.selectedGr.supplementaryBill.incentivePercent = 0;
	}


	function submit(formData) {

		if(vm.selectedGr && vm.selectedGr.gateoutDate){
			vm.selectedGr.gateoutDate=new Date(new Date(vm.selectedGr.gateoutDate).setHours(vm.gateOuthourSel, vm.gateOutminuteSel));
		}

		if(vm.selectedGr && vm.selectedGr.gatePassDate){
			vm.selectedGr.gatePassDate=new Date(new Date(vm.selectedGr.gatePassDate).setHours(vm.gatePasshourSel, vm.gatePassminuteSel));
		}

		if (vm.selectedGr.invoices.length) {

			if (vm.selectedGr.totalFreight < 0)
				return swal('Error', 'Total Freight should be grater than 0', 'error');
			let flag = false;
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(oInv => {
					if (oInv.paymentBasis !== vm.selectedGr.payment_basis)
						flag = true
				});
			}
			if (flag)
				return swal('Error', 'PaymentBasis should be same for all Item`s', 'error');
		}

		// Client wise validation
		if ((vm.__FormList && vm.__FormList.eWayBillNum.req || vm.__FormList.eWayBillExp.req) && !vm.selectedGr.container) {

			if (vm.selectedGr.eWayBills.length == 0)
				return swal('Error', 'E-WayBill Expiry and Number are Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].number)
				return swal('Error', 'E-WayBill Number is Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].expiry)
				return swal('Error', 'E-WayBill Expiry is Mandatory', 'error');

			if (vm.selectedGr.eWayBills[0].number) {
				// if (vm.selectedGr.eWayBills[0].number.length < 12)
				// 	return swal('Error', 'E-WayBill Number length should not be less than 12', 'error');
			}
		}
		// Validation END

		// if(!(vm.grNumberModel && vm.grNumberModel._id))
		// 	return swal('Error', 'invalid Gr Number.', 'error');

		console.log(formData);

		if (formData.$valid) {

			if (vm.selectedGr.totalFreight > ($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)) {

				return swal('Error', `Bill Amount is cannot be grater than ${($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)}`, 'error')

			} else if (vm.selectedGr.totalFreight > 300000) {
				swal({
						title: 'Bill Amount is Grater Than 3 Lakhs. Are you sure you want to continue?',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: 'rgb(94, 192, 222);',
						confirmButtonText: 'Yes!',
						closeOnConfirm: false
					},
					function (isConfirmU) {
						if (isConfirmU) {
							makeRequest();
						}
					});
			} else {
				makeRequest();
			}

			function makeRequest() {

				// setPodModelTime();

				let request = {
					...vm.selectedGr,
					gr_type: 'Own',
					customer: vm.selectedGr.customer,
					consignor: vm.selectedGr.consignor,
					consignee: vm.selectedGr.consignee,
					billingParty: vm.selectedGr.billingParty,
					branch: vm.selectedGr.branch
				};

				if (typeof vm.grNumberModel == 'object') {
					request.grNumber = vm.grNumberModel.bookNo;
					request.stationaryId = vm.grNumberModel._id;
				} else {
					request.grNumber = vm.grNumberModel;
					request.stationaryId = undefined;
				}

				if(!request.stationaryId && $scope.$configs.GR && !$scope.$configs.GR.manualGr)
					return swal('Error', 'Invalid Gr Number', 'error');

				vm.selectedGr.invoices.forEach((invObj, index) => {
					if (typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
						request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
					if (typeof invObj.billingNoOfUnits === 'undefined' && invObj.noOfUnits)
						request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
					if (invObj.invoiceDate)
						request.invoices[index].invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
					if (invObj.gateoutDate)
						request.invoices[index].gateoutDate = moment(invObj.gateoutDate, 'DD/MM/YYYY').toISOString();
					if (invObj.gatePassDate)
						request.invoices[index].gatePassDate = moment(invObj.gatePassDate, 'DD/MM/YYYY').toISOString();
				});

				if (request) {
					if(request && request.grNumber){
						console.log(oTrip);
						let requestObj = {
							grNumber : request.grNumber,
						};

						tripServices.grNoValidation(requestObj, oSuc, oFail);

						function oSuc(response) {
							console.log('response.data', response.data);
							(response.data);
						}

						function oFail(response) {
							console.log(response);

							swal('Error', response.data.message, 'error');
						}
					}

					// swal('success', 'Gr Added', 'success');
					$modalInstance.dismiss(request);
				}

				function failure(res) {
					swal('Error', res.data.message, 'error');
				}
			}

		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}

	function updateOnFreightChange() {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.charges.incentive = newVal * vm.incentivePercent / 100;
		});

	}
};

