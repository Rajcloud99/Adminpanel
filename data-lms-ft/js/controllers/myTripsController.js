materialAdmin.controller(
	"myTripsController",
	function (
		Vendor,
		$rootScope,
		$scope,
		$modal,
		$uibModal,
		DateUtils,
		$state,
		DatePicker,
		tripServices,
		tableAccessDetailFactory,
		billsService,
		branchService,
		cityStateService,
		Vehicle,
		Routes,
		bookingServices,
		lazyLoadFactory,
		ReportService,
		customer,
		$stateParams,
		growlService,
		stateDataRetain,
		userService,
		URL,
		dmsService,
		xlsxWrapper
	) {
		$("p").text("Trips Details");
		$rootScope.tripStsTime = "";
		$rootScope.tripAddres = "";

		var lastFilter;

		$scope.getAllTrip = getAllTrip;
		$scope.getRoute = getRoute;
		$scope.getTripReport = getTripReport;
		$scope.getTripDetailReport = getTripDetailReport; //added new
		$scope.getAllBranch = getAllBranch;
		$scope.downloadCacheCSV = downloadCacheCSV;
		$scope.onBranchSelect = onBranchSelect;
		$scope.removeBranch = removeBranch;
		$scope.getVendorName = getVendorName;
		$scope.getAllRoute = getAllRoute;
		$scope.setRouteKm = setRouteKm;
		$scope.downloadJobOrderReport = downloadJobOrderReport;
		$scope.downloadJobRiskyReport = downloadJobRiskyReport;
		$scope.downloadJobPowerConnectReport = downloadJobPowerConnectReport;
		$scope.getAllVehicleGroup = getAllVehicleGroup;
		$scope.getCustomer = getCustomer;
		$scope.getGr = getGr;
		$scope.getsearchGr = getsearchGr;
		$scope.showTripDetailPopup = showTripDetailPopup;
		$scope.onStateRefresh = function () {
			getAllTrip();
		};

		// init
		(function init() {
			$scope.DatePicker = angular.copy(DatePicker);
			$scope.aUserBranch =
				($scope.$configs.branchAccessCtl && $scope.$user.branch) || [];
			$scope.selectSettings = {
				displayProp: "name",
				enableSearch: true,
				searchField: "name",
				smartButtonMaxItems: 1,
				tripServices: true,
				showCheckAll: false,
				showUncheckAll: false,
				selectionLimit: 1,
				smartButtonTextConverter: function (itemText, originalItem) {
					return itemText;
				},
			};

			// if (stateDataRetain.init($scope)) {
			// 	TODO remove below code its make a temp call to get populated gr
			// $scope.onStateRefresh();
			// return;
			// }
			if (stateDataRetain.init($scope)) return;

			$scope.lazyLoad = lazyLoadFactory(); // init lazyload

			$scope.tableAccessDetail = tableAccessDetailFactory;

			$scope.selectedTrip = [];
			$scope.aTrip = [];
			$scope.selectType = "index";
			$scope.oSearchTripFilter = {};

			// assign Pagename and tablename
			let pageNameConst = "Booking_Management_Trip";
			let tableNameConst = "Trip";
			if (stateDataRetain.init($scope)) return;

			$scope.tableAccessDetail = tableAccessDetailFactory;

			let oFoundTable = $scope.$tableAccess.find(
				(oTable) =>
					oTable.clientId !== "000000" &&
					oTable.pages === pageNameConst &&
					oTable.table === tableNameConst
			); // // given accesss from  admin
			let oFoundTables = $scope.$tableAccess.find(
				(oTable) =>
					oTable.clientId === "000000" &&
					oTable.pages === pageNameConst &&
					oTable.table === tableNameConst
			); // given accesss from super admin
			if (oFoundTable && oFoundTables) {
				oFoundTable.configs = oFoundTables.configs;
				let orderedAccess = [];
				oFoundTables.access.forEach((item) => {
					if (oFoundTable.access.includes(item)) {
						orderedAccess.push(item);
					}
				});
				oFoundTable.access = orderedAccess;
			}
			oFoundTable = oFoundTable ? oFoundTable : oFoundTables;
			let visible = oFoundTable
				? oFoundTable.visible
				: $scope.tableAccessDetail[pageNameConst][tableNameConst + "Column"];
			let access = oFoundTable
				? oFoundTable.access
				: $scope.tableAccessDetail[pageNameConst][tableNameConst + "Column"];
			let oBinding = $scope.tableAccessDetail[pageNameConst][tableNameConst];

			// only client have these access
			if (true) {
				for (const prop in oBinding) {
					if (oFoundTable && oFoundTable.configs)
						oBinding[prop].header = oFoundTable.configs[tableNameConst][prop];
				}
			}

			$scope.oFoundTableId = false;
			if (oFoundTable && oFoundTable._id)
				$scope.oFoundTableId = oFoundTable._id;

			$scope.columnSetting = {
				allowedColumn: [],
				visibleColumn: visible.map(
					(str) => oBinding[str] && oBinding[str].header
				),
				visibleCb: (columnSetting) => {
					if (!(oFoundTable && oFoundTable._id)) return;

					let currentSetting = columnSetting.visibleColumn;
					let mapTable = $scope.tableAccessDetail[pageNameConst][
						tableNameConst + "Column"
					].reduce((obj, str) => {
						obj[oBinding[str].header] = str;
						return obj;
					}, {});

					let request = {
						pages: pageNameConst,
						table: tableNameConst,
						access: columnSetting.allowedColumn.map((str) => mapTable[str]),
						visible: currentSetting.map((str) => mapTable[str]),
						_id: oFoundTable._id,
					};

					userService.updateOneTableConfig(request, successVis, failureVis);

					function successVis(data) {
						if (data.data && data.data) {
							let d = data.data;
							$scope.$tableAccess.splice(0, $scope.$tableAccess.length);
							for (let i of d) {
								$scope.$tableAccess.push(i);
							}
						}
					}

					function failureVis(res) {
						swal("Error in table column setting", "", "error");
					}
				},
			};
			$scope.tableHead = [];

			access.forEach((str) => {
				if (oBinding[str]) {
					$scope.columnSetting.allowedColumn.push(oBinding[str].header);
					$scope.tableHead.push(oBinding[str]);
				}
			});
			getAllVehicleGroup();
		})();

		function getTableColumnHead(pageName, tableName) {
			let obj = {};
			let aTableHead = [];
			let aAllowedColumn = [];
			let tableConf = $scope.tableAccessDetail;
			let oTableName = tableConf[pageName][tableName];
			let aColumn = tableConf[pageName][tableName + "Column"];
			aColumn.forEach(function (key) {
				aTableHead.push(oTableName[key]);
				aAllowedColumn.push(oTableName[key].header);
			});

			obj.aTableHead = aTableHead;
			obj.aAllowedColumn = aAllowedColumn;
			return obj;
		}

		function prepareFilterObject(download) {
			var myFilter = { summary: true };

			myFilter.isCancelled = false;

			if ($scope.oSearchTripFilter.tripDocType) {
				myFilter.tripDocType = $scope.oSearchTripFilter.tripDocType;
			}

			if (
				$scope.$user &&
				$scope.$user.user_type &&
				$scope.$user.user_type.length
			) {
				if ($scope.$user.user_type.indexOf("Broker") + 1)
					myFilter.createdBy = $scope.$user._id;
			}

			if ($stateParams.data) {
				myFilter.gr = $stateParams.data.grs;
			}
			if (
				$scope.oSearchTripFilter.bookingCustomer &&
				$scope.oSearchTripFilter.bookingCustomer.name
			) {
				myFilter.customer_id = $scope.oSearchTripFilter.bookingCustomer._id;
			}
			if ($scope.oSearchTripFilter.grNumber) {
				myFilter.grNumber = $scope.oSearchTripFilter.grNumber;
			}
			if ($scope.oSearchTripFilter.grData) {
				myFilter._id = $scope.oSearchTripFilter.grData.trip;
			}
			if ($scope.oSearchTripFilter.trip_no) {
				myFilter.trip_no = $scope.oSearchTripFilter.trip_no;
			}
			if ($scope.oSearchTripFilter.tsNo) {
				myFilter["advSettled.tsNo"] = $scope.oSearchTripFilter.tsNo;
			}
			if ($scope.oSearchTripFilter.loading_slip) {
				myFilter["vendorDeal.loading_slip"] =
					$scope.oSearchTripFilter.loading_slip;
			}
			if ($scope.oSearchTripFilter.bPclientId) {
				myFilter["vendor.clientId"] = $scope.oSearchTripFilter.bPclientId;
			}
			if ($scope.oSearchTripFilter.category) {
				myFilter.category = $scope.oSearchTripFilter.category;
			}

			if ($scope.oSearchTripFilter.status) {
				if ($scope.oSearchTripFilter.status === "Trip cancelled") {
					myFilter.isCancelled = true;
				}
				myFilter.status = $scope.oSearchTripFilter.status;
			}
			if ($scope.oSearchTripFilter.vehicle_id) {
				myFilter.vehicle = $scope.oSearchTripFilter.vehicle_id._id;
			}

			if ($scope.oSearchTripFilter.veh_group) {
				myFilter.vehicle_query = {
					veh_group_name: $scope.oSearchTripFilter.veh_group.name,
				};
			}

			if ($scope.aBranch && $scope.aBranch.length) {
				myFilter.branch = $scope.aBranch.map((v) => v._id);
			} else if ($scope.aUserBranch && $scope.aUserBranch.length) {
				myFilter.branch = [];
				$scope.aUserBranch.forEach((obj) => {
					if (obj.read) myFilter.branch.push(obj._id);
				});
			}

			if ($scope.oSearchTripFilter.route_id) {
				myFilter.route = $scope.oSearchTripFilter.route_id._id;
			}
			if ($scope.oSearchTripFilter.source) {
				myFilter.source = $scope.oSearchTripFilter.source.c;
			}
			if ($scope.oSearchTripFilter.destination) {
				myFilter.destination = $scope.oSearchTripFilter.destination.c;
			}

			if ($scope.oSearchTripFilter.vendor) {
				myFilter.vendor = $scope.oSearchTripFilter.vendor._id;
			}
			if ($scope.oSearchTripFilter.start_date) {
				myFilter.from = $scope.oSearchTripFilter.start_date.toISOString();
			}
			if ($scope.oSearchTripFilter.end_date) {
				myFilter.to = $scope.oSearchTripFilter.end_date.toISOString();
			}
			if ($scope.oSearchTripFilter.dateType) {
				myFilter.dateType = $scope.oSearchTripFilter.dateType;
			}

			if ($scope.oSearchTripFilter.vendPaymStatus) {
				//
				myFilter.vendPaymStatus = $scope.oSearchTripFilter.vendPaymStatus;
			}

			if ($scope.oSearchTripFilter.segment_type) {
				myFilter.segment_type = $scope.oSearchTripFilter.segment_type;
			}

			if ($scope.oSearchTripFilter.ownershipType) {
				myFilter.ownershipType = $scope.oSearchTripFilter.ownershipType;
			}
			if ($scope.oSearchTripFilter.grGenerated) {
				if ($scope.oSearchTripFilter.grGenerated === "GR Generated") {
					myFilter.grGenerated = { grNumber: { $exists: true } };
				} else if (
					$scope.oSearchTripFilter.grGenerated === "GR Not-Generated"
				) {
					myFilter.grGenerated = { grNumber: { $exists: false } };
				}
			}
			if (download) {
				myFilter.download = download;
				// myFilter.fDownload = download;
				myFilter.all = true;
			}

			if ($scope.oFoundTableId) {
				myFilter.tableId = $scope.oFoundTableId;
			} else {
				myFilter.tableId = false;
			}

			if (
				$scope.oSearchTripFilter.sortBy &&
				$scope.oSearchTripFilter.sortBy === "Assending"
			) {
				myFilter.sort = { allocation_date: 1 };
			} else if (
				$scope.oSearchTripFilter.sortBy &&
				$scope.oSearchTripFilter.sortBy === "Dessending"
			) {
				myFilter.sort = { allocation_date: -1 };
			}

			myFilter.no_of_docs = 8;
			myFilter.skip = $scope.lazyLoad.getCurrentPage();

			// myFilter.sort = JSON.stringify({_id: -1});

			return myFilter;
		}

		function getCustomer(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
					};

					customer.getCustomerSearch(
						viewValue,
						(res) => {
							resolve(res.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function getGr(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						grNumber: viewValue,
						no_of_docs: 10,
						skip: 1,
					};
					tripServices.getAllGRItem(
						req,
						(res) => {
							resolve(res.data.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}
		function getsearchGr(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						grNumber: viewValue,
						no_of_docs: 10,
						skip: 1,
					};
					tripServices.getGrTrim(
						req,
						(res) => {
							resolve(res.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function onBranchSelect(item) {
			$scope.aBranch = $scope.aBranch || [];
			$scope.aBranch.push(item);
			$scope.oSearchTripFilter.branch = "";
		}

		function removeBranch(select, index) {
			$scope.aBranch.splice(index, 1);
		}

		function getAllVehicleGroup() {
			Vehicle.getGroupVehicleType(
				successGroupVehicleType,
				failGroupVehicleType
			);

			function successGroupVehicleType(response) {
				if (response && response.data && response.data.data) {
					$scope.aVehicleGroups = response.data.data;
				}
			}

			function failGroupVehicleType(res) {
				console.error("fail: ", res);
			}
		}

		function getAllBranch(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
					};

					if ($scope.$configs.client_allowed)
						req.cClientId = JSON.stringify(
							$scope.$configs.client_allowed.map((v) => v.clientId)
						);

					if ($scope.aUserBranch && $scope.aUserBranch.length) {
						let branch = [];
						$scope.aUserBranch.forEach((obj) => {
							if (obj.read) branch.push(obj);
						});
						resolve(branch);
					} else
						branchService.getAllBranches(
							req,
							(res) => {
								resolve(res.data);
							},
							(err) => {
								console.log`${err}`;
								reject([]);
							}
						);
				});
			}

			return [];
		}

		$scope.liveTrack = function () {
			if (!$scope.selectedTrip) {
				return;
			}
			$rootScope.selectedVehicleData = $scope.selectedTrip.vehicle;
			$rootScope.selectedTripData = $scope.selectedTrip;
			$rootScope.redirect("#!/masters/liveTrackPage");
		};

		$scope.emptyTrip = function (oTrip) {
			if (oTrip.length > 1) {
				swal("Warning", "Please select only One Row", "warning");
				return;
			}
			$scope.selectedTrip = oTrip[0] || oTrip;
			if ($scope.selectedTrip && !Array.isArray($scope.selectedTrip)) {
				var modalInstance = $uibModal.open({
					templateUrl: "views/myTripSettlement/emptyTripPopup.html",
					controller: "emptyTripController",
					resolve: {
						trip: function () {
							return angular.copy($scope.selectedTrip);
						},
					},
				});
				modalInstance.result.then(
					function (data) {
						$state.reload();
					},
					function (data) {
						if (data !== "cancel") {
						}
					}
				);
			}
		};

		$scope.printBill = function (oTrip) {
			console.log(oTrip);
			$scope.selectedTrip = oTrip[0] || oTrip;
			var oFilter = { _id: $scope.selectedTrip._id };
			var modalInstance = $uibModal.open({
				templateUrl: "views/bills/builtyRender.html",
				controller: "tripPrintCtrl",
				resolve: {
					thatTrip: oFilter,
				},
			});
		};

		$scope.dateChange = function (dateType) {
			if (
				dateType === "startDate" &&
				$scope.oSearchTripFilter.end_date &&
				$scope.oSearchTripFilter.start_date
			) {
				let isDate = $scope.oSearchTripFilter.end_date instanceof Date,
					monthRange =
						$scope.oSearchTripFilter.end_date.getMonth() -
						$scope.oSearchTripFilter.start_date.getMonth(),
					dateRange =
						$scope.oSearchTripFilter.end_date.getDate() -
						$scope.oSearchTripFilter.start_date.getDate(),
					isNotValid = false;
				monthRange +=
					($scope.oSearchTripFilter.end_date.getFullYear() -
						$scope.oSearchTripFilter.start_date.getFullYear()) *
					12;

				if (monthRange === 0) isNotValid = dateRange < 0;
				else if (
					monthRange === 1 &&
					!$scope.oSearchTripFilter.vehicle_id &&
					!$scope.oSearchTripFilter.vendor
				)
					isNotValid =
						monthRange < 0
							? true
							: 30 -
									$scope.oSearchTripFilter.start_date.getDate() +
									$scope.oSearchTripFilter.end_date.getDate() >
							  30
							? true
							: false;
				else if (
					monthRange <= 3 &&
					!$scope.oSearchTripFilter.vehicle_id &&
					!$scope.oSearchTripFilter.vendor
				)
					isNotValid = true;
				else if (
					monthRange === 3 &&
					$scope.oSearchTripFilter.start_date.getDate() <
						$scope.oSearchTripFilter.end_date.getDate()
				)
					isNotValid = true;
				else if (monthRange === 1 || monthRange === 2 || monthRange === 3)
					isNotValid = false;
				else isNotValid = true;

				if (
					isDate &&
					isNotValid &&
					($scope.oSearchTripFilter.vehicle_id ||
						$scope.oSearchTripFilter.vendor)
				) {
					let date = new Date($scope.oSearchTripFilter.start_date);
					$scope.oSearchTripFilter.end_date = new Date(
						date.setMonth(date.getMonth() + 3)
					);
				} else if (isDate && isNotValid) {
					let date = new Date($scope.oSearchTripFilter.start_date);
					$scope.oSearchTripFilter.end_date = new Date(
						date.setMonth(date.getMonth() + 1)
					);
				}
			} else if (
				dateType === "endDate" &&
				$scope.oSearchTripFilter.end_date &&
				$scope.oSearchTripFilter.start_date
			) {
				let isDate = $scope.oSearchTripFilter.start_date instanceof Date,
					monthRange =
						$scope.oSearchTripFilter.end_date.getMonth() -
						$scope.oSearchTripFilter.start_date.getMonth(),
					dateRange =
						$scope.oSearchTripFilter.end_date.getDate() -
						$scope.oSearchTripFilter.start_date.getDate(),
					isNotValid = false;
				monthRange +=
					($scope.oSearchTripFilter.end_date.getFullYear() -
						$scope.oSearchTripFilter.start_date.getFullYear()) *
					12;

				if (monthRange === 0) isNotValid = dateRange < 0;
				else if (
					monthRange === 1 &&
					!$scope.oSearchTripFilter.vehicle_id &&
					!$scope.oSearchTripFilter.vendor
				)
					isNotValid =
						monthRange < 0
							? true
							: 30 -
									$scope.oSearchTripFilter.start_date.getDate() +
									$scope.oSearchTripFilter.end_date.getDate() >
							  30
							? true
							: false;
				else if (
					monthRange <= 3 &&
					!$scope.oSearchTripFilter.vehicle_id &&
					!$scope.oSearchTripFilter.vendor
				)
					isNotValid = true;
				else if (
					monthRange === 3 &&
					$scope.oSearchTripFilter.start_date.getDate() <
						$scope.oSearchTripFilter.end_date.getDate()
				)
					isNotValid = true;
				else if (monthRange === 1 || monthRange === 2 || monthRange === 3)
					isNotValid = false;
				else isNotValid = true;

				if (
					isDate &&
					isNotValid &&
					($scope.oSearchTripFilter.vehicle_id ||
						$scope.oSearchTripFilter.vendor)
				) {
					let date = new Date($scope.oSearchTripFilter.end_date);
					$scope.oSearchTripFilter.start_date = new Date(
						date.setMonth(date.getMonth() - 3)
					);
				} else if (isDate && isNotValid) {
					let date = new Date($scope.oSearchTripFilter.end_date);
					$scope.oSearchTripFilter.start_date = new Date(
						date.setMonth(date.getMonth() - 1)
					);
				}
			}
		};

		function getRoute(viewValue) {
			if (viewValue.length < 1) return;
			return new Promise(function (resolve, reject) {
				cityStateService.getCity(
					{ c: viewValue },
					function success(res) {
						resolve(slicer(res.data));
					},
					function (err) {
						reject([]);
					}
				);
			});
		}

		function getAllTrip(isGetActive) {
			if (
				$scope.oSearchTripFilter.status === "Trip not started" ||
				$scope.oSearchTripFilter.status === "Trip started"
			) {
				$scope.selectType = "multiple";
				$scope.aSelectedTrips = [];
			} else {
				$scope.selectType = "index";
			}

			$scope.currOwnershipType = $scope.oSearchTripFilter.ownershipType;

			if (!$scope.lazyLoad.update(isGetActive)) return;

			var oFilter = prepareFilterObject();
			lastFilter = oFilter;
			oFilter.__SRC__ = "WEB";
			tripServices.getAllTripsWithPagination(oFilter, success);

			function success(res) {
				if (res.data.data && res.data.data.data) {
					if (res.data.data.data.length > 0) {
						for (var i = 0; i < res.data.data.data.length; i++) {
							res.data.data.data[i].containers = [];
							if (
								res.data.data.data[i].gr &&
								res.data.data.data[i].gr.length > 0
							) {
								for (var x = 0; x < res.data.data.data[i].gr.length; x++) {
									if (
										res.data.data.data[i].gr[x].booking_info &&
										res.data.data.data[i].gr[x].booking_info.length > 0
									) {
										for (
											var m = 0;
											m < res.data.data.data[i].gr[x].booking_info.length;
											m++
										) {
											res.data.data.data[i].containers.push(
												res.data.data.data[i].gr[x].booking_info[m].container_no
											);
										}
									}
								}
							}
							let obj = res.data.data.data[i];
							if (
								obj.start_date &&
								(obj.rKm || (obj.route && obj.route.route_distance)) &&
								obj.category != "Empty"
							) {
								let km = obj.rKm || (obj.route && obj.route.route_distance);
								let totDay = Math.ceil(km / $scope.$constants.totalKM);
								let date = new Date(obj.start_date);
								obj.ewayBillExpiry = new Date(
									date.setDate(date.getDate() + (totDay || 0))
								);
								// obj.ewayBill_expiry = new Date(new Date().setDate(new Date(date).getDate() + (totDay || 0)));
							}
						}
					}
					res = res.data;
					$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res.data);
					// $scope.tableApi && $scope.tableApi.refresh();
				}
			}
		}

		function downloadCacheCSV() {
			let oFilter = prepareFilterObject();

			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal(
					"Warning",
					"AllocationDate From and To should be filled",
					"warning"
				);
				return;
			}

			let allowedTime = ["1", "year"];

			if (
				moment($scope.oSearchTripFilter.end_date).isAfter(
					moment($scope.oSearchTripFilter.start_date).add(...allowedTime)
				)
			)
				return swal(
					"Error",
					`Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`,
					"error"
				);

			delete oFilter.skip;
			delete oFilter.no_of_docs;
			oFilter.all = true;
			oFilter.reportType = "onTrip";

			tripServices.getUnSettlementCSV(oFilter, success);

			function success(d) {
				if (d.data.url) {
					var a = document.createElement("a");
					a.href = d.data.url;
					a.download = d.data.url;
					a.target = "_blank";
					a.click();
				} else {
					swal("", d.data.message, "success");
				}
			}
		}

		function getTripReport(type) {
			let oFilter = prepareFilterObject(type);
			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal("Warning", "From and To Date should be filled", "warning");
				return;
			}

			let allowedTime = ["1", "month"];

			if (
				moment($scope.oSearchTripFilter.end_date).isAfter(
					moment($scope.oSearchTripFilter.start_date).add(...allowedTime)
				)
			)
				return swal(
					"Error",
					`Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`,
					"error"
				);

			tripServices.getTripReportsNew(oFilter, function (res) {
				if (oFilter.fDownload) {
					xlsxWrapper(res.data.data, "trip_report");
				} else if (res.data.url) {
					var a = document.createElement("a");
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = "_blank";
					a.click();
				} else {
					swal("", res.data.message, "success");
				}
			});
		}

		function downloadJobRiskyReport(type) {
			let oFilter = prepareFilterObject(type);
			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal("Warning", "From and To Date should be filled", "warning");
				return;
			}
			oFilter.download = true;
			tripServices.getJobRiskyReports(oFilter, function (res) {
				if (oFilter.fDownload) {
					xlsxWrapper(res.data.data, "job_risky_report");
				} else if (res.data.url) {
					var a = document.createElement("a");
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = "_blank";
					a.click();
				} else {
					swal("", res.data.message, "success");
				}
			});
		}

		function downloadJobOrderReport(type) {
			let oFilter = prepareFilterObject(type);
			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal("Warning", "From and To Date should be filled", "warning");
				return;
			}
			oFilter.download = true;
			tripServices.getJobOrderReports(oFilter, function (res) {
				if (oFilter.fDownload) {
					xlsxWrapper(res.data.data, "job_order_report");
				} else if (res.data.url) {
					var a = document.createElement("a");
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = "_blank";
					a.click();
				} else {
					swal("", res.data.message, "success");
				}
			});
		}

		function downloadJobPowerConnectReport(type) {
			let oFilter = prepareFilterObject(type);
			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal("Warning", "From and To Date should be filled", "warning");
				return;
			}
			oFilter.download = true;
			tripServices.getJobPowerConnectReports(oFilter, function (res) {
				if (oFilter.fDownload) {
					xlsxWrapper(res.data.data, "job_power_connect_report");
				} else if (res.data.url) {
					var a = document.createElement("a");
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = "_blank";
					a.click();
				} else {
					swal("", res.data.message, "success");
				}
			});
		}

		function getTripDetailReport(type) {
			let oFilter = prepareFilterObject(type);
			if (
				!(
					$scope.oSearchTripFilter.start_date &&
					$scope.oSearchTripFilter.end_date
				)
			) {
				swal("Warning", "From and To Date should be filled", "warning");
				return;
			}
			tripServices.getTripDetailReportsNew(oFilter, function (d) {
				var a = document.createElement("a");
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = "_blank";
				a.click();
			});
		}

		function getVendorName(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
						deleted: false,
					};

					Vendor.getName(
						req,
						(res) => {
							resolve(res.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		$scope.uploadDocs = function (oTrip) {
			if (oTrip.length > 1) {
				swal("Warning", "Please select only One Row", "warning");
				return;
			}
			$rootScope.selectedTrip = oTrip[0] || oTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/uploadFiles.html",
				controller: "uploadFilesPopUpCtrl",
				resolve: {
					oUploadData: {
						modelName: "trip",
						scopeModel: $rootScope.selectedTrip,
						scopeModelId: $rootScope.selectedTrip._id,
						uploadText: "Upload Trip Documents",
						uploadFunction: Vehicle.uploadDocs,
					},
				},
			});
			modalInstance.result.then(
				function (data) {
					$state.reload();
				},
				function (data) {
					$state.reload();
				}
			);
		};

		// $scope.previewDocs = function (oTrip) {
		// 	if (oTrip.length > 1) {
		// 		swal('Warning', 'Please select only One Row', 'warning');
		// 		return;
		// 	}
		// 	$rootScope.selectedTrip = oTrip[0] || oTrip;
		// 	let documents = [];
		// 	for (let [key, val] of Object.entries(oTrip.doc)) {
		// 		if(Array.isArray(val)){
		// 			val.forEach((doc, i) => {
		// 				let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
		// 				documents.push({
		// 					name,
		// 					url: `${URL.BASE_URL}documents/view/${doc}`
		// 				});
		// 			});
		// 		}else{
		// 			let name = `${key|| 'misc'}`.toUpperCase();
		// 			documents.push({
		// 				name,
		// 				url: `${URL.BASE_URL}documents/view/${val}`
		// 			});
		// 		}
		// 	}
		// 	if (documents.length < 1) {
		// 		growlService.growl("No documents to preview", "warning");
		// 		return;
		// 	}
		// 	// var documents = $rootScope.selectedTrip.documents.map(curr => ({
		// 	// 	...curr,
		// 	// 	url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		// 	// }));
		// 	var modalInstance = $uibModal.open({
		// 		templateUrl: 'views/carouselPopup.html',
		// 		controller: 'carouselCtrl',
		// 		resolve: {
		// 			documents: function () {
		// 				return documents;
		// 			}
		// 		}
		// 	});
		// };

		// $scope.previewDocs = function (oTrip) {
		// 	if (oTrip.length > 1) {
		// 		swal('Warning', 'Please select only One Row', 'warning');
		// 		return;
		// 	}
		// 	$rootScope.selectedTrip = oTrip[0] || oTrip;
		// 	let documents = [];
		// 	for (let [key, val] of Object.entries(oTrip.doc)) {
		// 		if(Array.isArray(val)){
		// 			val.forEach((doc, i) => {
		// 				let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
		// 				documents.push({
		// 					name,
		// 					url: `${URL.BASE_URL}documents/view/${doc}`
		// 				});
		// 			});
		// 		}else{
		// 			let name = `${key|| 'misc'}`.toUpperCase();
		// 			documents.push({
		// 				name,
		// 				url: `${URL.BASE_URL}documents/view/${val}`
		// 			});
		// 		}
		// 	}
		// 	if (documents.length < 1) {
		// 		growlService.growl("No documents to preview", "warning");
		// 		return;
		// 	}
		// 	// var documents = $rootScope.selectedTrip.documents.map(curr => ({
		// 	// 	...curr,
		// 	// 	url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		// 	// }));
		// 	var modalInstance = $uibModal.open({
		// 		templateUrl: 'views/carouselPopup.html',
		// 		controller: 'carouselCtrl',
		// 		resolve: {
		// 			documents: function () {
		// 				return documents;
		// 			}
		// 		}
		// 	});
		// };

		$scope.previewDocs = function (oTrip) {
			if (!oTrip._id) return;
			$scope.getAllDocs = getAllDocs;
			// Vehicle , Trip , Gr

			let documents = [];
			(function init() {
				getAllDocs();
			})();

			function getAllDocs() {
				let req = {
					_id: oTrip._id,
					modelName: "trip",
				};

				let aAllDoc = [];
				aAllDoc.push(oTrip._id);
				if (oTrip.gr && oTrip.gr.length > 0) {
					for (let i = 0; i < oTrip.gr.length; i++) {
						aAllDoc.push(oTrip.gr[i]._id);
					}
				}
				if (oTrip.vehicle && oTrip.vehicle._id) {
					aAllDoc.push(oTrip.vehicle._id);
				}
				let reqId = {};
				let _id = [];
				reqId._id = aAllDoc;
				// dmsService.getAllDocs( req,success,failure);
				dmsService.getAllDocsV2(reqId, success, failure);

				function success(res) {
					if (res && res.data.length > 0) {
						let aDocData = [];
						let aDocRes = [];
						let obTrip = {};
						let livedObj = {};
						aDocData = res.data;
						livedObj = aDocData.reduce(function (o, i) {
							if (!o.hasOwnProperty(i.linkTo)) {
								o[i.linkTo] = [];
							}

							var grouped = {};
							if (i.files && i.files.length > 0) {
								i.files.forEach(function (t) {
									if (!grouped[t.category]) {
										grouped[t.category] = [];
									}

									if (i.linkTo == "gr") {
										if (oTrip.gr && oTrip.gr.length > 0) {
											oTrip.gr.forEach(function (g) {
												if (g._id == i.linkToId && g.grNumber) {
													grouped[t.category].push({
														name: `${URL.file_server}${t.name}`,
														iName: t.name,
														_id: i._id,
														sId: g._id,
														sNumber: g.grNumber,
													});
												}
											});
										}
									}

									if (i.linkTo == "trip") {
										if (oTrip._id == i.linkToId && oTrip.trip_no) {
											grouped[t.category].push({
												name: `${URL.file_server}${t.name}`,
												iName: t.name,
												_id: i._id,
												sId: oTrip._id,
												sNumber: oTrip.trip_no,
											});
										}
									}

									if (i.linkTo == "regVehicle") {
										if (
											oTrip.vehicle._id == i.linkToId &&
											oTrip.vehicle.vehicle_reg_no
										) {
											grouped[t.category].push({
												name: `${URL.file_server}${t.name}`,
												iName: t.name,
												_id: i._id,
												sId: oTrip.vehicle._id,
												sNumber: oTrip.vehicle.vehicle_reg_no,
											});
										}
									}
								});
							}
							o[i.linkTo].push(grouped);
							return o;
						}, {});

						//$scope.oDoc = res.data;
						$scope.oDoc = livedObj;
						prepareData();
					} else {
						growlService.growl("No documents to preview", "warning");
						return;
					}
				}

				function failure(res) {
					var msg = res.data.message;
					growlService.growl(msg, "error");
					return;
				}
			}

			function prepareData() {
				// let mergeData = {};
				// $scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj=>{
				// 	mergeData[obj.category] = mergeData[obj.category] || [];
				// 	mergeData[obj.category].push(obj);
				// });
				// $scope.oDoc = mergeData;
				//
				// for (let [key, val] of Object.entries($scope.oDoc)) {
				// 	if(Array.isArray(val)){
				// 		val.forEach((doc, i) => {
				// 			let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
				// 			documents.push({
				// 				name,
				// 				docName:doc.name,
				// 				_id: oTrip._id,
				// 				modelName: 'trip',
				// 				url: `${URL.file_server}${doc.name}`
				// 			});
				// 		});
				// 	}else{
				// 		let name = `${key|| 'misc'}`.toUpperCase();
				// 		documents.push({
				// 			name,
				// 			docName:doc.name,
				// 			_id: oTrip._id,
				// 			modelName: 'trip',
				// 			url: `${URL.file_server}${doc.name}`
				// 		});
				// 	}
				// }

				$uibModal.open({
					templateUrl: "views/previewDocumentPopup.html", //'views/carouselPopup.html',
					controller: "preiveDocPopupCtrl",
					resolve: {
						documents: function () {
							return $scope.oDoc;
						},
					},
				});
			}

			// if (documents.length < 1) {
			// 	growlService.growl("No documents to preview", "warning");
			// 	return;
			// }
		};

		$scope.onSelect = function ($item, $model, $label) {
			$scope.getAllTrip(false, true);
		};

		function setRouteKm() {
			if (
				$scope.oSearchTripFilter.source &&
				$scope.oSearchTripFilter.destination &&
				$scope.oSearchTripFilter.source.location &&
				$scope.oSearchTripFilter.destination.location
			) {
				if (google && google.maps && google.maps.DistanceMatrixService) {
					new google.maps.DistanceMatrixService().getDistanceMatrix(
						{
							origins: [$scope.oSearchTripFilter.source.location],
							destinations: [$scope.oSearchTripFilter.destination.location],
							travelMode: "DRIVING",
						},
						(response) => {
							console.log(response);
							if (
								response &&
								Array.isArray(response.rows) &&
								response.rows[0]
							) {
								let element = response.rows[0].elements;
								$scope.oSearchTripFilter.rKm = Math.round2(
									element[0].distance.value / 1000,
									2
								);
								$scope.$apply();
							}
						}
					);
				}
			}
		}

		function getAllRoute(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					Routes.getName(
						viewValue,
						(res) => {
							resolve(res.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function showTripDetailPopup() {
			if (!$scope.$role["Trip"]["show trip details"]) return;
			$uibModal.open({
				templateUrl: "views/myTripsStatus/myTripDetailPopup.html",
				controller: [
					"$rootScope",
					"$filter",
					"$scope",
					"$uibModal",
					"$uibModalInstance",
					"$timeout",
					"DatePicker",
					"growlService",
					"objToCsv",
					"oTrip",
					"tripServices",
					"utils",
					"Vehicle",
					tripDetailPopupCtrl,
				],
				controllerAs: "vm",
				size: "xl",
				resolve: {
					oTrip: $scope.selectedTrip,
				},
			});
			$rootScope.tripUpdate = true;
		}

		$scope.getVname = function (viewValue) {
			// if ((viewValue + '').length < 2)
			// 	return;

			return new Promise(function (resolve, reject) {
				function oSuc(response) {
					$scope.aVehicles = response.data.data;
					resolve(response.data.data);
				}

				function oFail(response) {
					reject([]);
					console.log(response);
				}

				Vehicle.getNameTrim(viewValue, oSuc, oFail);
			});
		};

		$scope.tripIds = [];

		$scope.aStatusChange = ["Trip not started", "Trip started", "Trip ended"];

		$scope.addForStatusChange = function (oTrip, index) {
			if (oTrip.select === true) {
				$scope.tripIds.push(oTrip._id);
			} else {
				for (var s = 0; s < $scope.tripIds.length; s++) {
					if ($scope.tripIds[s] === oTrip._id) {
						$scope.tripIds.splice(s, 1);
					}
				}
			}
		};

		$scope.changeStatusMultiTrip = function (valueStatus, len) {
			if ($scope.selectedTrip.length) {
				for (var s = 0; s < $scope.selectedTrip.length; s++) {
					$scope.tripIds.push($scope.selectedTrip[s]._id);
				}
			}
			var sendTrip = $scope.selectedTrip[$scope.selectedTrip.length - 1];
			$rootScope.tripUpdate = true;
			$rootScope.tripGRUpdate = false;
			$rootScope.tripDriverUpdate = false;
			var selectedTrip = {};
			selectedTrip.updatedStatus = valueStatus;
			selectedTrip.tripIds = $scope.tripIds;
			selectedTrip.isBulk = true;
			$rootScope.selectedTrip = selectedTrip;
			console.log("se", selectedTrip);
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/myTripInfoPopUp.html",
				controller: "myTripPopUpUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
					tripFull: function () {
						return sendTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					//$rootScope.selectedTrip = data.data.data;

					$rootScope.responseData = data.data.response;
					var modalInstance = $uibModal.open({
						templateUrl: "views/myTripsStatus/responseTableForBulkUpdate.html",
						controller: "responseTableForBulkUpdateCtrl",
					});
					$state.reload();
				},
				function (data) {
					//	todo on error
				}
			);
		};

		$scope.editGrNumber = function (aTrips) {
			if (!aTrips.gr[0])
				return swal("Warning", "No Gr Found on selected Trip", "warning");
			$modal
				.open({
					templateUrl: "views/myGR/editGrNumber.html",
					controller: [
						"$uibModalInstance",
						"$scope",
						"$stateParams",
						"branchService",
						"billBookService",
						"DatePicker",
						"oTrip",
						"tripServices",
						editGrNumberController,
					],
					controllerAs: "grVm",
					resolve: {
						oTrip: function () {
							return {
								aTrips,
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		};

		$scope.myTripDeatils = function (oTrip, index) {
			if (oTrip.length > 1) {
				swal("Warning", "Please select only One Row", "warning");
				return;
			}
			$rootScope.selectedTrip = oTrip[0] || oTrip;
			setTimeout(function () {
				listItem = $($(".selectItem")[index]);
				listItem.siblings().removeClass("grn");
				listItem.addClass("grn");
			}, 200);
			$scope.redirectForDetailPage();
		};

		$scope.redirectForDetailPage = function () {
			var sUrl = "#!/booking_manage/updatemyTrips";
			$rootScope.redirect(sUrl);
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
			formatYear: "yy",
			startingDay: 1,
		};

		$scope.formats = [
			"dd-MMM-yyyy",
			"dd-MMMM-yyyy",
			"yyyy/MM/dd",
			"dd.MM.yyyy",
			"shortDate",
		];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************
	}
);

materialAdmin.controller(
	"preiveDocPopupCtrl",
	function (
		$rootScope,
		$scope,
		$uibModal,
		$uibModalInstance,
		dmsService,
		documents
	) {
		$scope.images = documents;
		$scope.closeModal = closeModal;

		(function init() {})();

		function closeModal() {
			$uibModalInstance.dismiss();
		}

		$scope.onDownloadButtonClicked = function (title, name) {
			var $a = document.createElement("a");
			$a.setAttribute("type", "hidden");
			$a.setAttribute("title", title);
			$a.setAttribute("href", name);
			$a.setAttribute("target", "_blank");
			document.body.appendChild($a);
			$a.click();
			document.body.removeChild($a);
			22;
		};

		$scope.deleteDoc = function (modelName, iName, id) {
			if (iName) {
				let req = {
					_id: id,
					modelName: modelName,
					name: iName,
				};
				dmsService.deleteFile(req, success, failure);

				function success(res) {
					if (res) {
						var msg = res.message;
						swal("", msg, "success");
						closeModal();
						return;
					}
				}

				function failure(res) {
					var msg = res.message;
					swal("", msg, "error");
					return;
				}
			}
		};

		$scope.printDoc = function (source) {
			Pagelink = "about:blank";
			var pwa = window.open(Pagelink, "_new");
			pwa.document.open();
			pwa.document.write($scope.DocPrint(source));
			pwa.document.close();
		};
		$scope.DocPrint = function (source) {
			return (
				"<html><head><script>function step1(){\n" +
				"setTimeout('step2()', 10);}\n" +
				"function step2(){window.print();window.close()}\n" +
				"</scri" +
				"pt></head><body onload='step1()'>\n" +
				"<img src='" +
				source +
				"' /></body></html>"
			);
		};

		$scope.$watch("currentItemIndex", function (newVal, oldVal) {
			if (oldVal > newVal) {
				if (typeof $scope.onPrevious === "function") {
					$scope.onPrevious();
				}
			} else {
				if (typeof $scope.onNext === "function") {
					$scope.onNext();
				}
			}
		});
	}
);

materialAdmin.controller(
	"myTripPopUpCtrl",
	function (
		$rootScope,
		$scope,
		$filter,
		$modal,
		$state,
		$uibModal,
		$interval,
		tripServices,
		customer,
		tripLocatioService,
		growlService
	) {
		$scope.tabs = [
			{
				title: "Trip Detail",
				content: "./../../views/myTripsStatus/tripDetailTab.html",
			},
			//{title: 'Locations', content: './../../views/myTripsStatus/tripLocationTab.html'}
		];
		$scope.aStatusChange = ["Trip not started", "Trip started", "Trip ended"];
		$scope.aCustomerSel = [];
		$scope.aGtypeSearch = ["Trip", "GR"];
		$scope.vendorDealPopUp = vendorDealPopUp;

		$rootScope.selectedTrip;

		$scope.getTrip = function (id) {
			var oFilter = {
				_id: id,
			};
			oFilter.__SRC__ = "WEB";
			tripServices.getAllTripsWithPagination(oFilter, success);

			function success(res) {
				if (res.data.data) {
					if (res.data.data.length > 0) {
						$rootScope.selectedTrip = $scope.selectedTrip = res.data.data;
					}
				}
			}
		};

		/*$scope.startTrip = function (selectedTrip) {
      $rootScope.selectedTrip = selectedTrip;
      var modalInstance = $uibModal.open({
        templateUrl: 'views/myTripsStatus/startTripPopup.html',
        controller: 'startTripPopupController',
        resolve: {
          selectedTrip: function () {
            return selectedTrip;
          }
        }
      });
      modalInstance.result.then(function (data) {
        console.log(data);
        $rootScope.selectedTrip = data.data.data;
      }, function (data) {

      });
    };*/

		if (!$rootScope.selectedTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		}
		$scope.globalGeoPoint = $scope.globalGeoPoint || [];
		if ($rootScope.selectedTrip.gr && $rootScope.selectedTrip.gr.length > 0) {
			for (var g = 0; g < $rootScope.selectedTrip.gr.length; g++) {
				if (
					$rootScope.selectedTrip.gr[g].booking &&
					$rootScope.selectedTrip.gr[g].booking.customer
				) {
					$scope.aCustomerSel[g] = {};
					$scope.aCustomerSel[g].name =
						$rootScope.selectedTrip.gr[g].booking.customer.name;
					$scope.aCustomerSel[g]._id =
						$rootScope.selectedTrip.gr[g].booking.customer._id;
					$scope.aCustomerSel[g].category = "GR";
					if (
						$rootScope.selectedTrip.gr[g].geofence_points &&
						$rootScope.selectedTrip.gr[g].geofence_points.length > 0
					) {
						for (
							var h = 0;
							h < $rootScope.selectedTrip.gr[g].geofence_points.length > 0;
							h++
						) {
							$rootScope.selectedTrip.gr[g].geofence_points[h].category = "GR";
							$rootScope.selectedTrip.gr[g].geofence_points[h].gr_id =
								$rootScope.selectedTrip.gr[g]._id;
							$rootScope.selectedTrip.gr[g].geofence_points[h].gCustomer =
								$rootScope.selectedTrip.gr[g].booking.customer.name;
							$scope.globalGeoPoint.push(
								$rootScope.selectedTrip.gr[g].geofence_points[h]
							);
						}
					}
				}
			}
		}

		generateTripHistory();

		function generateTripHistory() {
			try {
				$scope.tripHistory = [];
				$rootScope.selectedTrip.gr.map(function (obj) {
					Array.prototype.push.apply($scope.tripHistory, obj.statuses);
				});
				Array.prototype.push.apply(
					$scope.tripHistory,
					$rootScope.selectedTrip.statuses
				);
			} catch (e) {
				$scope.tripHistory = [];
			}
		}

		if (
			$rootScope.selectedTrip.geofence_points &&
			$rootScope.selectedTrip.geofence_points.length > 0
		) {
			for (
				var f = 0;
				f < $rootScope.selectedTrip.geofence_points.length > 0;
				f++
			) {
				$rootScope.selectedTrip.geofence_points[f].category = "Trip";
			}
			$scope.globalGeoPoint = $rootScope.selectedTrip.geofence_points;
		}
		$scope.grUpdateTime = "";

		$scope.addMoreGR = function (selectedTrip) {
			/*var totalWeight = selectedTrip.gr.reduce((acc, curr) => acc + curr.weight, 0);
		var maxWeight = selectedTrip.vehicle.capacity_tonne || 0;
		if(totalWeight >= maxWeight) {
			growlService.growl("Vehicle already full, max capacity reached", "danger");
			return;
		}*/
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/addMoreGRPopup.html",
				controller: "askMoreGRPopupController",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});
			modalInstance.result.then(
				function (data) {
					swal(data, "success");
					$state.go("booking_manage.myTrips", {}, { reload: true });
				},
				function (data) {}
			);
		};

		$scope.updateStatus = function (selectedTrip) {
			$rootScope.selectedTrip = selectedTrip;
			if (
				selectedTrip &&
				selectedTrip.advSettled &&
				selectedTrip.advSettled.tsNo
			) {
				return swal(
					"Error",
					"RT already generated you can't update Status",
					"error"
				);
			}

			$uibModal.open({
				templateUrl: "views/myTripsStatus/statusUpdatePopup.html",
				controller: "statusUpdateCtrl",
				resolve: {
					callback: function () {
						return function (request) {
							return new Promise(function (resolve, reject) {
								tripServices.admUpdateTrip(request, success, failure);

								function success(res) {
									console.log(res);
									if (!res.data.error) {
										$rootScope.selectedTrip = $scope.selectedTrip =
											res.data.data;
										generateTripHistory();
										swal(
											"success",
											res.data.message || "Update successfully",
											"success"
										);
									}
									resolve();
								}

								function failure(err) {
									swal("Error", err.data.message, "error");
									reject(err);
								}
							});
						};
					},
					modelData: function () {
						return {
							header: "Trip Number " + selectedTrip.trip_no,
						};
					},
					otherData: function f() {
						return {
							aStatuses: (
								$scope.$configs.trip_statuses || $scope.$constants.aTripStatus
							).filter(
								(s) =>
									s.key !== "Trip started" &&
									s.key !== "Trip ended" &&
									s.key !== "Trip cancelled"
							),
							selectedData: $rootScope.selectedTrip,
							adminAccess: $scope.$role["Trip"]["Admin Edit"],
						};
					},
				},
			});
		};

		$scope.askPayment = function (selectedTrip) {
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/askPaymentPopup.html",
				controller: "askPaymentPopupController",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.updateVehicle = function (selectedTrip) {
			if (
				selectedTrip &&
				selectedTrip.advSettled &&
				selectedTrip.advSettled.tsNo
			) {
				return swal(
					"Error",
					"RT already generated you can't update vehicle",
					"error"
				);
			}
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/updateVehiclePopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"Driver",
					"selectedTrip",
					"tripServices",
					"Vehicle",
					updateVehiclePopUpController,
				],
				controllerAs: "uvVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		$scope.addRemark = function (selectedTrip) {
			selectedTrip.updateEwayBill = false;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/addRemarkPopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"selectedTrip",
					"tripServices",
					addRemarkPopUpController,
				],
				controllerAs: "arVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		$scope.updateEwayBill = function (selectedTrip) {
			selectedTrip.updateEwayBill = true;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/addRemarkPopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"selectedTrip",
					"tripServices",
					addRemarkPopUpController,
				],
				controllerAs: "arVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		$scope.transShipment = function (selectedTrip) {
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/transShipmentPopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"Driver",
					"selectedTrip",
					"tripServices",
					"Vehicle",
					transShipmentPopUpController,
				],
				controllerAs: "transVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		function vendorDealPopUp(selectedTrip) {
			// if(vm.oTrip.advSettled.aVoucher.length>0){
			// 	swal('Error','Voucher already created!! vendorDealPopUp Can Not editable','error');
			// 	return
			// }
			$modal
				.open({
					templateUrl: "views/myTripAdvance/vendorDealPopUp.html",
					controller: [
						"$scope",
						"$uibModalInstance",
						"accountingService",
						"billBookService",
						"branchService",
						"billsService",
						"bookingServices",
						"callback",
						"constants",
						"DateUtils",
						"DatePicker",
						"formulaFactory",
						"growlService",
						"oTrip",
						"sharedResource",
						"tripServices",
						"userService",
						"Vendor",
						vendorDealPopUpController,
					],
					controllerAs: "ackDealVm",
					size: "xl",
					resolve: {
						callback: function () {
							return false;
						},
						oTrip: function () {
							return {
								...selectedTrip,
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
						$rootScope.selectedTrip = response;
						generateTripHistory();
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		}

		$scope.updateTripData = function (selectedTrip, index) {
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/updateTripData.html",
				controller: "updateTripDataController",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.changeDriver = function (selectedTrip, index) {
			if (
				selectedTrip &&
				selectedTrip.advSettled &&
				selectedTrip.advSettled.tsNo
			) {
				return swal(
					"Error",
					"RT already generated you can't update Driver",
					"error"
				);
			}
			$rootScope.tripGRUpdate = false;
			$rootScope.tripUpdate = false;
			$rootScope.selectedTrip = selectedTrip;
			$rootScope.tripDriverUpdate = true;

			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/myTripInfoPopUp.html",
				controller: "myTripPopUpUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
					tripFull: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.myTripUpdate = function (selectedTrip, valueStatus) {
			$scope.tripEnded = true;
			/*if($rootScope.selectedTrip.status==='Trip started') {
        if($rootScope.selectedTrip.gr && $rootScope.selectedTrip.gr.length>0){
          for(var x=0;x<$rootScope.selectedTrip.gr.length;x++){
            if($rootScope.selectedTrip.gr[x].status === 'Unloading Ended'){
              $scope.tripEnded = true;
            }else {
              $scope.tripEnded = false;
              break;
            }
          }
        }
      }*/
			if ($scope.tripEnded === true) {
				var sendTrip = $rootScope.selectedTrip;
				console.log("sdsd", sendTrip);
				$rootScope.tripUpdate = true;
				$rootScope.tripGRUpdate = false;
				$rootScope.tripDriverUpdate = false;
				selectedTrip.updatedStatus = valueStatus;
				$rootScope.selectedTrip = selectedTrip;
				var modalInstance = $uibModal.open({
					templateUrl: "views/myTripsStatus/myTripInfoPopUp.html",
					controller: "myTripPopUpUpdateCtrl",
					resolve: {
						thatTrip: function () {
							return selectedTrip;
						},
						tripFull: function () {
							return sendTrip;
						},
					},
				});

				modalInstance.result.then(
					function (data) {
						console.log(data);
						$rootScope.selectedTrip = data.data.data;
						generateTripHistory();
					},
					function (data) {}
				);
			} else {
				swal("warning", "All gr are not Unloading Ended state.", "warning");
			}
		};

		$scope.routeUpdate = function (selectedTrip, index) {
			if (
				selectedTrip &&
				selectedTrip.advSettled &&
				selectedTrip.advSettled.tsNo
			) {
				return swal(
					"Error",
					"RT already generated you can't update route",
					"error"
				);
			}
			$rootScope.tripRouteUpdate = true;
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/myTripRouteUpdate.html",
				controller: "myTripRouteUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.updateTripRoute = function (selectedTrip, index) {
			$rootScope.tripRouteUpdate = true;
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/updateTripRoutePopup.html",
				controller: "updateTripRoutePopupCtrl",
				controllerAs: "utrVm",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.setRoute = function (selectedTrip, index) {
			$rootScope.tripRouteUpdate = true;
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/setRoutePopup.html",
				controller: "setRoutePopupCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		$scope.addIMDs = function (selectedTrip) {
			$rootScope.intermediateRoute = $rootScope.intermediateRoute;
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/addImds.html",
				controller: [
					"$scope",
					"$rootScope",
					"$uibModalInstance",
					"DatePicker",
					"tripServices",
					"cityStateService",
					addImdPopUpController,
				],
				controllerAs: "aiVm",
				resolve: {
					thatData: function () {
						return $rootScope.selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function () {},
				function (data) {
					if (data != "close") {
						swal("Oops!", data.message, "error");
					}
				}
			);
		};
		$scope.myTripGrUpdate = function (selectedTrip, oGrinfo, index) {
			$rootScope.tripUpdate = false;
			$rootScope.tripGRUpdate = true;
			$rootScope.selectedTrip = selectedTrip;
			$rootScope.selectedTripGr = oGrinfo;
			$uibModal.open({
				templateUrl: "views/myTripsStatus/statusUpdatePopup.html",
				controller: "statusUpdateCtrl",
				resolve: {
					callback: function () {
						return function (request) {
							return new Promise(function (resolve, reject) {
								// if ($scope.$role['GR']['Admin Edit'])
								// 	tripServices.admUpdateGr(request, success, failure);
								// else
								tripServices.updateGrStatus(request, success, failure);

								function success(res) {
									console.log(res);
									swal("Success", res.data.message, "success");
									selectedTrip.gr[index] = $rootScope.selectedTripGr =
										res.data.data;
									resolve();
									generateTripHistory();
								}

								function failure(err) {
									swal("Error", err.data.message, "error");
									reject(err);
								}
							});
						};
					},
					modelData: function () {
						return {
							header: "Gr Number " + oGrinfo.grNumber,
						};
					},
					otherData: function f() {
						let statuses = [
							{ key: "GR Assigned", label: "GR Assigned" },
							{
								key: "Vehicle Arrived for loading",
								label: "Vehicle Arrived for loading",
							},
							{ key: "Loading Started", label: "Loading Started" },
							{ key: "Loading Ended", label: "Loading Ended" },
							{ key: "Departure", label: "Departure " },
							{
								key: "Vehicle Arrived for unloading",
								label: "Vehicle Arrived for unloading",
							},
							{ key: "Unloading Started", label: "Unloading Started" },
							{ key: "Unloading Ended", label: "Unloading Ended" },
							{ key: "Trip cancelled", label: "Trip cancelled" },
							{ key: "GR Acknowledged", label: "GR Acknowledged" },
							{ key: "GR Received", label: "GR Received" },
						];

						statuses = statuses.filter(
							(s) => !(oGrinfo.statuses || []).find((o) => o.status === s.key)
						);
						if (
							$scope.userLoggedIn.clientId[0] === "11309" ||
							$scope.userLoggedIn.clientId[0] === "10806"
						) {
							statuses = statuses.filter((s) => s.key != "Departure");
						}
						return {
							aStatuses: statuses,
							selectedData: oGrinfo,
							adminAccess: false,
						};
					},
				},
			});
		};

		$scope.analyticsTrip = function (selectedTrip, index) {
			$rootScope.selectedTrip = selectedTrip;
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip started" })[0]
			) {
				tripStartDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip started",
				})[0].date;
			} else {
				swal("Trip has no start date");
				return;
			}
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip ended" })[0]
			) {
				tripEndDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip ended",
				})[0].date;
			} else {
				tripEndDate = new Date();
			}
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/analyticsPopUp.html",
				controller: "analyticsPopUpCtrl",
				backdrop: "static",
				controllerAs: "aVm",
				size: "xl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		$scope.playbackTrip = function (selectedTrip, index) {
			$rootScope.selectedTrip = selectedTrip;
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip started" })[0]
			) {
				tripStartDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip started",
				})[0].date;
			} else {
				swal("Trip has no start date");
				return;
			}
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip ended" })[0]
			) {
				tripEndDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip ended",
				})[0].date;
			} else {
				tripEndDate = new Date();
			}
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/playbackPopUp.html",
				controller: "playbackPopUpCtrl",
				backdrop: "static",
				controllerAs: "pbpVm",
				size: "xl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};

		$scope.itineraryTrip = function (selectedTrip, index) {
			$rootScope.selectedTrip = selectedTrip;
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip started" })[0]
			) {
				tripStartDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip started",
				})[0].date;
			} else {
				swal("Trip has no start date");
				return;
			}
			if (
				$filter("filter")(selectedTrip.statuses, { status: "Trip ended" })[0]
			) {
				tripEndDate = $filter("filter")(selectedTrip.statuses, {
					status: "Trip ended",
				})[0].date;
			} else {
				tripEndDate = new Date();
			}
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/itineraryPopUp.html",
				controller: "itineraryPopUpCtrl",
				backdrop: "static",
				controllerAs: "ipVm",
				size: "xl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
				},
				function (data) {}
			);
		};
		$scope.cancelTrip = function (selectedTrip, index) {
			$rootScope.tripUpdate = true;
			$rootScope.tripGRUpdate = false;
			$rootScope.selectedTrip = selectedTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/myTripCancelPopUp.html",
				controller: "myTripCancelCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			});

			modalInstance.result.then(
				function (data) {
					console.log(data);
					$rootScope.selectedTrip = data.data.data;
					generateTripHistory();
				},
				function (data) {}
			);
		};

		var selectedCustomerData;
		$scope.selectedGeoFence = function (customer) {
			selectedCustomerData = customer;
			$scope.aGeofences = customer
				? getSelectedCustomerLocation(customer._id)
				: [];
		};
		//****** location tab code *******//
		var locationUpdateQuery = {};
		$scope.addlocation = function (sLocation) {
			if (sLocation) {
				sLocation.trip_id = $rootScope.selectedTrip._id;
				var modalInstance = $uibModal.open({
					templateUrl: "views/myTripsStatus/addlocation.html",
					controller: "tripAddLocation",
					resolve: {
						thatFilter: function () {
							return sLocation;
						},
					},
				});

				modalInstance.result.then(
					function (data) {},
					function (data) {
						if (data != "cancel") {
							swal("Oops!", "", "error");
						} else {
							$state.reload();
						}
					}
				);
			} else {
				swal("warning", "Please select row first", "warning");
			}
		};

		$scope.removeLocation = function (sLocation) {
			sLocation.trip_id = $rootScope.selectedTrip._id;
			$rootScope.selectLocationData = sLocation;
			proceed = function () {
				function success(res) {
					if (res && res.data && res.data.success == "OK") {
						$scope.selectedLocation.deleted = true;
						swal("Removed", res.data.message, "success");
					} else {
						swal("Error", res.data.message, "error");
					}
				}

				function failure(res) {
					var msg = res.data.message;
					swal("Error", msg, "error");
				}

				var oRemove = {};
				oRemove.name = sLocation.name;
				oRemove.l_id = sLocation._id;

				if (sLocation.category === "Trip") {
					oRemove.trip_id = sLocation.trip_id;
					tripServices.removeTripLocation(oRemove, success, failure);
				} else if (sLocation.category === "GR") {
					oRemove.gr_id = sLocation.gr_id;
					tripServices.removeGrLocation(oRemove, success, failure);
				} else {
					swal("warning", "Category not defined", "warning");
				}
			};
			if (sLocation && sLocation.deleted != true) {
				swal(
					{
						title: "Do you really want to remove?",
						text: "!!!!!!!!!!!!!!!!!!!!!!!",
						type: "warning",
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Yes, remove it",
						cancelButtonText: "No, cancel it!",
						closeOnConfirm: true,
						closeOnCancel: true,
					},
					function (isConfirm) {
						if (isConfirm) {
							proceed();
						} else {
							return;
						}
					}
				);
			} else {
				swal("warning", "Already deleted!!!!!", "warning");
			}
		};

		$scope.detailViewgeofence = function (sLocation) {
			var modalInstance = $uibModal.open({
				templateUrl: "views/myTripsStatus/detailGeofence.html",
				controller: "detailGeofenceController",
				resolve: {
					thatFilter: function () {
						return sLocation;
					},
				},
			});
		};

		function getSelectedCustomerLocation(customer_id) {
			var aLocations = [];
			if (
				$rootScope.selectedTrip &&
				$rootScope.selectedTrip.gr &&
				$rootScope.selectedTrip.gr.length > 0
			) {
				for (var i = 0; i < $rootScope.selectedTrip.gr.length; i++) {
					if (customer_id === $rootScope.selectedTrip.gr[i].customer_id) {
						aLocations = $rootScope.selectedTrip.gr[i].geofence_points;
						locationUpdateQuery = {
							_id: $rootScope.selectedTrip._id,
							trip_no: $rootScope.selectedTrip.trip_no,
							gr_id: $rootScope.selectedTrip.gr[i].gr_id,
						};
					}
				}
			}
			return aLocations;
		}

		$scope.selectedItem = function (location, index) {
			$scope.selectedLocation = location;
			listItem = $($(".lst-item")[index]);
			listItem.siblings().removeClass("grn");
			listItem.addClass("grn");
		};

		function successLoc(res) {
			if (res && res.data && res.data.status == "OK") {
				$rootScope.selectedTrip = res.data.data;
				$scope.selectedGeoFence({ _id: selectedCustomerData._id });
				swal("Updated", res.data.message, "success");
			} else {
				swal("Error", res.data.message, "error");
			}
		}

		function failureLoc(res) {
			var msg = res.data.message;
			swal("Error", msg, "error");
		}

		$scope.delLocation = function () {
			var oUpdate = { data_id: angular.copy($scope.selectedLocation.data_id) };
			oUpdate._id = angular.copy(locationUpdateQuery._id);
			oUpdate.trip_no = angular.copy(locationUpdateQuery.trip_no);
			oUpdate.gr_id = angular.copy(locationUpdateQuery.gr_id);
			oUpdate.pushData = false;
			tripServices.updateLocation(oUpdate, successLoc, failureLoc);
		};

		$scope.uploadLoadingSlip = function (loading_slip) {
			//console.log(loading_slip);
			var fd = new FormData();
			fd.append("loading_slip", loading_slip);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = angular.copy($scope.selectedTrip._id);
			tripServices.uploadSlip(data, successLoc, failureLoc);
		};
	}
);

/*materialAdmin.controller('startTripPopupController', function(URL, $rootScope, $scope,Vehicle, consignorConsigneeService, $uibModalInstance, tripServices, selectedTrip,HTTPConnection) {

  $scope.selectedTrip = selectedTrip;
  // console.log('trip',$scope.selectedTrip);

  $scope.closeModal = () => {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.getConsignee = (gr, i) => {
    consignorConsigneeService.getConsignorConsignee({customer : gr.booking.customer._id, type: 'Consignee'},
        res => {$scope[`aConsignee${i}`] = res.data},
        err => err
    );
  };

  $scope.grRoutes = selectedTrip.gr.reduce((acc, curr, i) => acc.concat(curr.booking.route), []);

  $scope.submit = function(form) {
    var selectedTripCopy = angular.copy($scope.selectedTrip);
    var oSend = {trip: {}, vehicle: {}};
    oSend.trip._id = selectedTripCopy._id;
    oSend.trip.route_name = selectedTripCopy.route.name;
    oSend.trip.route = selectedTripCopy.route._id;
    oSend.trip.status = 'Trip started';
    oSend.trip.gr = selectedTripCopy.gr.map(curr => ({_id: curr._id, consignee: curr.consignee, consignor: curr.consignor, status: 'GR Assigned'}));
    oSend.vehicle._id = selectedTripCopy.vehicle._id;
    oSend.vehicle.status = 'In Trip';
    // console.log('osend =>', oSend);
    HTTPConnection.put(URL.LM_START_TRIP, oSend, (res) => {}, (err) => {});
  };

});*/

materialAdmin.controller(
	"tripAddLocation",
	function (
		$rootScope,
		$scope,
		$uibModalInstance,
		thatFilter,
		tripLocatioService,
		tripServices,
		bookingServices
	) {
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		if (thatFilter) {
			$scope.selectedLocationData = thatFilter;
		}
		$scope.oLocation = {};

		$scope.aTypeKeyTrip = ["start", "end", "toll", "boarder"];
		$scope.aTypeKeyGR = ["loading", "unloading", "parking"];
		$scope.aCategory = ["Trip", "GR"];

		/*
		 * Setting default value
		 * Multi Select with Search Dropdown Settings
		 * */
		$scope.oLocation.location = [];
		$scope.aLocations = [];
		$scope.selectLocationSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: "name",
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			},
		};

		/*
		 * Multi Select with Search Dropdown Settings
		 * */
		$scope.selectLocationEvents = {
			onSelectionChanged: function () {},
		};

		/*
		 * get Locations for filters in Multiple select dropdown with search
		 * */
		$scope.getLocations = function (inputModel) {
			if (inputModel.length <= 2) return;

			function success(response) {
				$scope.oLocation.aLocations = response.data.data;
			}

			function failure(response) {
				console.log(response);
			}

			bookingServices.getAllTripLocation(
				{ name: inputModel },
				success,
				failure
			);
		};

		function success(res) {
			if (
				res &&
				res.data &&
				(res.data.status === "OK" || res.data.success === "OK")
			) {
				$uibModalInstance.close(res);
				swal("Updated", res.data.message, "success");
			} else {
				swal("Error", res.data.message, "error");
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			var msg = res.data.message;
			$uibModalInstance.dismiss(res);
			swal("Error", msg, "error");
		}

		$scope.saveLocation = function () {
			var oUpdate = angular.copy($scope.oLocation.location[0]);
			//oUpdate._id = $scope.selectedLocationData.trip_id;
			oUpdate.type = $scope.oLocation.type;

			if ($scope.oLocation.category === "Trip") {
				oUpdate._id = $scope.selectedLocationData.trip_id;
				tripServices.updateTripLocation(oUpdate, success, failure);
			} else if ($scope.oLocation.category === "GR") {
				oUpdate._id = $scope.oLocation.grId;
				tripServices.updateGrLocation(oUpdate, success, failure);
			} else {
				swal("warning", "Please select category", "warning");
			}
		};
	}
);

materialAdmin.controller(
	"detailGeofenceController",
	function ($rootScope, $scope, $uibModalInstance, thatFilter) {
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		if (thatFilter) {
			$scope.selectedLocationData = thatFilter;
		}
	}
);
materialAdmin.controller(
	"myTripPopUpUpdateCtrl",
	function (
		$rootScope,
		$scope,
		$localStorage,
		Driver,
		growlService,
		clientConfig,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices,
		driverOnVehicleService,
		Vehicle,
		tripFull,
		consignorConsigneeService,
		$state
	) {
		$scope.tripstDisabled = false;
		if (tripFull && !tripFull.gr) {
			$state.go($state.current, {}, { reload: true });
		}

		if (tripFull && tripFull.tripdetails) {
			if (tripFull && tripFull.tripDriverUpdate) $scope.tripDriverUpdate = true;
			else $scope.tripDriverUpdate = false;

			if (tripFull && tripFull.tripUpdate) $scope.tripUpdate = true;
			else $scope.tripUpdate = false;
		}

		$scope.selectedTrip1 = tripFull;
		// console.log('t', tripFull);

		$scope.getConsignee = (gr, i) => {
			consignorConsigneeService.getConsignorConsignee(
				{
					customer: gr.customer._id,
					type: "Consignee",
					all: "true",
				},
				(res) => {
					$scope[`aConsignee${i}`] = res.data;
				},
				(err) => err
			);
		};

		$scope.grRoutes =
			$scope.selectedTrip1 &&
			$scope.selectedTrip1.gr.reduce(
				(acc, curr, i) => acc.concat(curr.route),
				[]
			);

		/*$scope.submit = function(form) {
      var selectedTripCopy = angular.copy($scope.selectedTrip1);
      var oSend = {trip: {}, vehicle: {}};
      oSend.trip._id = selectedTripCopy._id;
      oSend.trip.route_name = selectedTripCopy.route.name;
      oSend.trip.route = selectedTripCopy.route._id;
      oSend.trip.status = 'Trip started';
      oSend.trip.gr = selectedTripCopy.gr.map(curr => ({_id: curr._id, consignee: curr.consignee, consignor: curr.consignor, status: 'GR Assigned'}));
      oSend.vehicle._id = selectedTripCopy.vehicle._id;
      oSend.vehicle.status = 'In Trip';
      // console.log('osend =>', oSend);
      HTTPConnection.put(URL.LM_START_TRIP, oSend, (res) => {}, (err) => {});
    };*/

		//*************** New Date Picker for multiple date selection in single form ************
		$scope.today = function () {
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.toggleMin = function () {
			//var clientTripDateConfig = clientConfig.getFeatureValue("trip", "trip_start_date");
			$scope.maxDate = new Date();
			var tripStartPostDate = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2

			var daysBack = $localStorage.ft_data.configs.postTripStart || 365;
			tripStartPostDate.setDate(tripStartPostDate.getDate() - daysBack);
			$scope.minDate = new Date(tripStartPostDate);
			var tripStartDate = new Date();
			var grDate = new Date();

			//var fourtyEight = (clientTripDateConfig && clientTripDateConfig.min_hour) ? moment().subtract(clientTripDateConfig.min_hour, "hours")._d : angular.copy(aloc_date);
			/*if (thatTrip && thatTrip.trip_start && thatTrip.trip_start.time) {
                thatTrip.trip_start.time = new Date(thatTrip.trip_start.time);
                aloc_date = thatTrip.trip_start.time;
            }
            else*/
			if (thatTrip && thatTrip.allocation_date) {
				thatTrip.allocation_date = new Date(thatTrip.allocation_date);
				var vehAlocDate = thatTrip.allocation_date;
			}
			if ($scope.$configs.tripStatusCheck) {
				if (thatTrip && thatTrip.statuses) {
					thatTrip.statuses.forEach((obj) => {
						if (obj.status === "Trip started")
							tripStartDate = new Date(obj.date);
					});
				}
				if (
					thatTrip &&
					thatTrip.gr &&
					thatTrip.gr[0] &&
					thatTrip.gr[0].grDate
				) {
					grDate = new Date(thatTrip.gr[0].grDate);
				}
				var minDate =
					new Date(vehAlocDate) > new Date(grDate)
						? new Date(grDate)
						: new Date(vehAlocDate);
				minDate =
					new Date(minDate) > new Date(tripStartDate)
						? new Date(tripStartDate)
						: new Date(minDate);
			} else {
				var minDate = vehAlocDate;
			}
			if (minDate > tripStartPostDate) {
				$scope.minDate = new Date(minDate);
			} else {
				$scope.minDate = new Date(tripStartPostDate);
			}
			//$scope.minDate = new Date(tripStartPostDate);
		};
		$scope.toggleMin();
		$scope.open = function ($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = true;
		};

		$scope.dateOptions = {
			formatYear: "yy",
			startingDay: 1,
		};

		$scope.formats = [
			"dd-MMM-yyyy",
			"dd-MMMM-yyyy",
			"yyyy/MM/dd",
			"dd.MM.yyyy",
			"shortDate",
		];
		$scope.format = $scope.formats[0];
		//************* New Date Picker for multiple date selection in single form ******************

		$scope.aHours = [];
		for (var h = 0; h < 24; h++) {
			$scope.aHours[h] = h;
		}
		$scope.aMinutes = [];
		for (var m = 0; m < 60; m++) {
			$scope.aMinutes[m] = m;
		}

		$scope.hourSel1 = 0;
		$scope.minuteSel1 = 0;
		if ($scope.minDate) {
			//**** custom time add with date ******//
			var xxx = $scope.minDate;
			$scope.matchDay = xxx.getDate();
			$scope.hour1 = xxx.getHours();
			$scope.matchHour = angular.copy($scope.hour1);
			$scope.minute1 = xxx.getMinutes();
			$scope.matchMinute = angular.copy($scope.minute1);
		}
		$scope.changeTime1 = function (hr) {
			$scope.hourSel1 = hr;
			$scope.changeTime();
		};
		$scope.changeTime2 = function (mt) {
			$scope.minuteSel1 = mt;
			$scope.changeTime();
		};
		$scope.changeTime3 = function (date) {
			$scope.trip.time = date;
			$scope.changeTime();
		};
		$scope.changeTime = function () {
			var yyy = $scope.trip.time;
			$scope.trip_day = yyy.getDate();
			var zzz = new Date();
			$scope.current_day = zzz.getDate();
			$scope.c_hr = zzz.getHours();
			$scope.currentHour = angular.copy($scope.c_hr);
			$scope.c_min = zzz.getMinutes();
			$scope.currentMinute = angular.copy($scope.c_min);
			if ($scope.trip_day === $scope.matchDay) {
				if ($scope.hourSel1 < $scope.matchHour) {
					swal(
						"warning",
						"Please select hour greater then " + $scope.matchHour,
						"warning"
					);
					$scope.hourSel1 = $scope.matchHour;
					$scope.minuteSel1 = $scope.matchMinute;
				} else if ($scope.hourSel1 === $scope.matchHour) {
					if ($scope.minuteSel1 <= $scope.matchMinute) {
						swal(
							"warning",
							"Please select minute greater then " + $scope.matchMinute,
							"warning"
						);
						$scope.minuteSel1 = $scope.matchMinute;
					}
				}
			}
			if ($scope.trip_day === $scope.current_day) {
				if ($scope.hourSel1 > $scope.currentHour) {
					swal(
						"warning",
						"Please select hour less then or equal to " + $scope.currentHour,
						"warning"
					);
					$scope.hourSel1 = $scope.currentHour;
					$scope.minuteSel1 = $scope.currentMinute;
				} else if ($scope.hourSel1 === $scope.currentHour) {
					if ($scope.minuteSel1 > $scope.currentMinute) {
						swal(
							"warning",
							"Please select minute less then or equal to " +
								$scope.currentMinute,
							"warning"
						);
						$scope.minuteSel1 = $scope.currentMinute;
					}
				}
			}
		};

		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};
		$scope.allowableDelay = true;

		$scope.aStatusChange = ["Trip not started", "Trip started", "Trip ended"];

		function timediff(start, end) {
			if (start && end) {
				duration = moment.duration(moment(end).diff(moment(start)));
				hours = duration.asHours();
				return parseInt(hours);
			} else {
				return 0;
			}
		}
		var UserDATA = $localStorage.ft_data.userLoggedIn;
		if (UserDATA) {
			$scope.person = UserDATA.full_name;
		}

		if (!thatTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		} else {
			/////////////
			$scope.trip = thatTrip;
			$scope.driver_notchange = false;
			$scope.trip.driver_data = $scope.trip && $scope.trip.driver;
			if ($scope.trip && $scope.trip.start_date && $scope.trip.vehicle._id) {
				let tripstartdate = $scope.trip.start_date;
				let vehicle_id = $scope.trip.vehicle._id;
				//  tripServices.driverchange({
				// 	date: tripstartdate,
				// 	vehicle:vehicle_id,
				// 	no_of_docs: 1
				// }, success, fail);
				//
				//   function success(res) {
				// 	                 if (res && res.data && res.data.data[0]) {
				// 	                    	            $scope.trip.driver_data = res.data.data[0].driver;
				//                                         $scope.driver_notchange = true;
				// 										}
				// 					}
				//   function fail(res) {
				// 	             console.log(res);
				//     }
			}
		}

		$scope.updated_status = {};

		if ($rootScope.tripUpdate) {
			$scope.trip.date = new Date();
			var nDT = $scope.trip.date;
			$scope.hourSel1 = nDT.getHours();
			$scope.minuteSel1 = nDT.getMinutes();

			if ($scope.trip.isBulk === true) {
				function bulk_success(res) {
					if (
						res &&
						res.data &&
						(res.data.status === "OK" || res.data.success === "OK")
					) {
						$uibModalInstance.close(res);
						var msg = res.data.status;
						swal("Updated", msg, "success");
						$uibModalInstance.close(res.data.data);
					} else {
						var msg = res.data.message;
						swal("Error", msg, "error");
						$uibModalInstance.dismiss(res);
					}
				}

				function bulk_failure(res) {
					var msg = res.data.message;
					$uibModalInstance.dismiss(res);
					growlService.growl(msg, "danger", 2);
				}

				$scope.updateTripInfo = function () {
					var selectedTripCopy = angular.copy($scope.selectedTrip1);
					var oSend = {};
					oSend.status = $scope.trip.updatedStatus;
					oSend.remark = $scope.trip.remark;
					oSend.updated_status = $scope.updated_status;

					if ($scope.trip.updatedStatus === "Trip started") {
						oSend.route_name =
							selectedTripCopy.route && selectedTripCopy.route.name;
						oSend.route = selectedTripCopy.route && selectedTripCopy.route._id;
						oSend.trip = {};
						oSend.trip.gr = selectedTripCopy.gr.map((curr) => ({
							_id: curr._id,
							consignee: curr.consignee,
							consignor: curr.consignor,
							status: "GR Assigned",
						}));
					}

					if ($scope.trip.date) {
						//**** custom time add with date ******//
						var xx = $scope.trip.date;
						xx.setHours($scope.hourSel1);
						xx.setMinutes($scope.minuteSel1);
						xx.setMilliseconds(0);
						$scope.trip.date = xx;
						//**** custom time add with date ******//
						oSend.date = $scope.trip.date;
					}
					oSend.tripIds = $scope.trip.tripIds;
					tripServices.updateBulkStatus(oSend, bulk_success, bulk_failure);
				};
			} else {
				function success(res) {
					$scope.tripstDisabled = false;
					$scope.isDisable = false;
					if (
						res &&
						res.data &&
						(res.data.status === "OK" || res.data.success === "OK")
					) {
						$uibModalInstance.close(res);
						$scope.trip.status = res.data.data.status;
						$rootScope.tripUpdate = false;
						var msg = res.data.status;
						swal("Updated", msg, "success");
						$uibModalInstance.close(res.data.data);
					} else {
						var msg = res.data.message;
						swal("Error", msg, "error");
						$uibModalInstance.dismiss(res);
					}
				}

				function failure(res) {
					$scope.tripstDisabled = false;
					$scope.isDisable = false;
					var msg = res.data.message;
					$uibModalInstance.dismiss(res);
					growlService.growl(msg, "danger", 2);
				}

				$scope.updateTripInfo = function () {
					var selectedTripCopy = angular.copy($scope.selectedTrip1);
					var oSend = {};
					oSend.status = $scope.trip.updatedStatus;
					oSend.remark = $scope.trip.remark;
					oSend.updated_status = $scope.updated_status;

					if ($scope.trip.updatedStatus === "Trip started") {
						oSend.startOdo = $scope.trip.startOdo;
						if (selectedTripCopy.route) {
							oSend.route_name = selectedTripCopy.route.name;
							oSend.route = selectedTripCopy.route._id;
						}
						oSend.trip = {};
						oSend.trip.gr = selectedTripCopy.gr.map((curr) => ({
							_id: curr._id,
							consignee: curr.consignee,
							consignor: curr.consignor,
							status: "GR Assigned",
						}));
					} else {
						oSend.endOdo = $scope.trip.endOdo;
					}

					if ($scope.trip.date) {
						//**** custom time add with date ******//
						var xx = $scope.trip.date;
						xx.setHours($scope.hourSel1);
						xx.setMinutes($scope.minuteSel1);
						xx.setMilliseconds(0);
						$scope.trip.date = xx;
						//**** custom time add with date ******//
						oSend.date = $scope.trip.date;
					}
					oSend._id = $scope.trip._id;
					// console.log(oSend);
					$scope.isDisable = true;
					$scope.tripstDisabled = true;
					tripServices.updateStatus(oSend, success, failure);
				};
			}
		}

		$scope.getAllDriverData = function (viewValue) {
			return new Promise(function (resolve, reject) {
				function oSuc(response) {
					resolve(response.data.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}

				Driver.getName(viewValue, oSuc, oFail);
			});

			// function success(data) {
			//  $scope.aDriver = data.data;t
			//  if ($rootScope.tripDriverUpdate) {
			//    if (($scope.trip.vehicle && $scope.trip.vehicle.driver_name) && ($scope.aDriver) && ($scope.aDriver.length > 0)) {
			//      for (var i = 0; i < $scope.aDriver.length; i++) {
			//        if ($scope.trip.driver._id == $scope.aDriver[i]._id) {
			//          $scope.trip.driver_data = $scope.aDriver[i];
			//        }
			//      }
			//    }
			//  }
			// }
			//
			// Driver.getAllDrivers({
			// 	no_of_docs: 10
			// }, success);
		};

		$scope.updated_status = {};

		$scope.saveDriver = function () {
			function success(res) {
				if (res && res.data && res.data.status === "OK") {
					$rootScope.selectedTrip.driver = $scope.trip.driver_data;
					// $rootScope.selectedTrip.vehicle.driver_name = $scope.trip.driver_data.name;
					// $rootScope.selectedTrip.vehicle.driver_contact_no = $scope.trip.driver_data.prim_contact_no;
					// $rootScope.selectedTrip.vehicle.driver_license = $scope.trip.driver_data.license_no;
					// $rootScope.selectedTrip.vehicle.driver_employee_code = $scope.trip.driver_data.employee_code;

					$uibModalInstance.close(res);
					$rootScope.tripDriverUpdate = false;
					var msg = res.data.message;
					swal("Updated", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				growlService.growl(msg, "danger", 2);
			}

			if ($scope.trip.driver_data) {
				oUpdate = {};
				oUpdate.driver = $scope.trip.driver_data._id;

				oUpdate.updated_status = $scope.updated_status;
				//oUpdate.driver_name = $scope.trip.driver_data.name;
				//oUpdate.driver_contact_no = $scope.trip.driver_data.prim_contact_no;
				//oUpdate.driver_license = $scope.trip.driver_data.license_no;
				//oUpdate.driver_employee_code = $scope.trip.driver_data.employee_code;

				oUpdate._id = $scope.trip._id;
				tripServices.updateInfo(oUpdate, success, failure);
			}
		};
	}
);

materialAdmin.controller(
	"responseTableForBulkUpdateCtrl",
	function ($rootScope, $scope, clientConfig, $uibModalInstance) {
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};
		if ($rootScope.responseData) {
			$scope.tableData = $rootScope.responseData;
		} else {
			$scope.tableData = [];
		}
	}
);

function approvalPopupController(
	$scope,
	$modal,
	$uibModalInstance,
	accountingService,
	branchService,
	callback,
	DatePicker,
	lazyLoadFactory,
	modelDetail,
	otherData,
	billBookService,
	tripServices,
	Vehicle,
	narrationService,
	vendorFuelService
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.clearTrip = clearTrip;
	vm.getAccount = getAccount;
	vm.getAccountAsync = getAccountAsync;
	vm.getFuelStation = getFuelStation;
	vm.getFuelVendor = getFuelVendor;
	vm.getTrips = getTrips;
	vm.getVname = getVname;
	vm.preserveData = preserveData;
	vm.onVehicleSelect = onVehicleSelect;
	vm.setContraAcc = setContraAcc;
	vm.setUnsetAccountMasterVendor = setUnsetAccountMasterVendor;
	vm.setAccount = setAccount;
	vm.calculatebudget = calculatebudget;
	vm.setAmount = setAmount;
	vm.setLiter = setLiter;
	vm.generateRemark = generateRemark;
	vm.setAmountRate = setAmountRate;
	vm.setLiterRate = setLiterRate;
	vm.getSingleBranch = getSingleBranch;
	vm.tableRowClick = tableRowClick;
	vm.validateAmount = validateAmount;
	vm.advanceDateType = advanceDateType;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.onBranchSelect = onBranchSelect;
	vm.onVendorSelect = onVendorSelect;
	vm.getAllBranch = getAllBranch;
	vm.onRefSelect = onRefSelect;
	vm.getRefNo = getRefNo;
	vm.getGr = getGr;
	vm.onToAcSelect = onToAcSelect;
	vm.associateDriver = associateDriver;
	vm.submit = submit;
	vm.submitRemark = submitRemark;
	vm.addExtraChrges = addExtraChrges;
	vm.remove = remove;

	// init
	(function init() {
		vm.showGr = false;
		let date = new Date();
		vm.allocationDate = $scope.$configs.tripAdv.futureDay
			? new Date(
					date.setDate(date.getDate() + $scope.$configs.tripAdv.futureDay)
			  )
			: new Date();
		vm.aUserBranch =
			($scope.$configs.branchAccessCtl && $scope.$user.branch) || [];
		vm.oAdvance = {
			account_data: {
				// from: {},
				// to: {}
			},
			diesel_info: {
				// 	vendor: {}
			},
		};
		vm.DatePicker = angular.copy(DatePicker);
		vm.dealAcc = $scope.$configs.client_allowed.filter(
			(o) => o.clientId === $scope.selectedClient
		)[0];
		vm.columnSetting = {
			allowedColumn: [
				"Trip No",
				"Gr No",
				"Vehicle No",
				"Vehicle Type",
				"Route",
				"Customer",
				"Driver Name",
				"Trip Allocation",
				"Trip Started",
				"Trip Ended",
				"Trip Status",
			],
		};
		vm.tableHead = [
			{
				header: "Trip No",
				bindingKeys: "trip_no",
			},
			{
				header: "Gr No",
				filter: {
					name: "arrayOfGrToString",
					aParam: ["gr"],
				},
			},
			{
				header: "Vehicle No",
				bindingKeys: "vehicle_no",
				date: false,
			},
			{
				header: "Vehicle Type",
				bindingKeys: "vehicle.veh_type_name",
			},

			{
				header: "Route",
				bindingKeys: "route_name || rName",
			},
			{
				header: "Customer",
				bindingKeys: "agr.customer.name || gr[0].customer.name",
			},
			{
				header: "Driver Name",
				bindingKeys: "driver.name",
			},
			{
				header: "Trip Allocation",
				bindingKeys: "allocation_date",
				date: true,
			},
			{
				header: "Trip Started",
				bindingKeys:
					'((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
			},
			{
				header: "Trip Ended",
				bindingKeys:
					'((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
			},
			{
				header: "Trip Status",
				bindingKeys: "status",
			},
		];
		vm.selectAccountSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: "name",
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			},
		};
		vm.selectAccountEvents = {
			onSelectionChanged: function () {
				vm.oAdvance.person = vm.oAdvance.account_data.to.name;
			},
		};
		vm.aTrip = [];
		vm.lazyLoad = lazyLoadFactory();
		vm.showAdvanceType = true;
		vm.showCategory = false;
		vm.modelDetail = modelDetail;
		vm.showInAdd = modelDetail.type === "add";
		vm.showInEdit = modelDetail.type === "edit";
		vm.showTripForm =
			typeof modelDetail.showTripForm == "undefined"
				? true
				: modelDetail.showTripForm;
		vm.accounts = {};
		vm.mandatory = {
			vehicle: true,
			...modelDetail.mandatory,
		};
		vm.oAdvance.aExtraCharges = [];
		vm.oAdvance.totalExtraChrges = 0;
		if (
			$scope.$configs &&
			$scope.$configs.tripAdv &&
			$scope.$configs.tripAdv.driverDetails
		) {
			vm.driverLable = "Driver Name";
		}

		if (typeof vm.showTripForm == "object") {
			vm.showTripForm = {
				showVehicle: true,
				showAdvanceDate: true,
				showTripSearchBtn: true,
				showTripTable: true,
				...vm.showTripForm,
			};
		} else if (typeof vm.showTripForm == "boolean") {
			let bool = !!vm.showTripForm;
			vm.showTripForm = {};
			vm.showTripForm.showVehicle = bool;
			vm.showTripForm.showAdvanceDate = bool;
			vm.showTripForm.showTripSearchBtn = bool;
			vm.showTripForm.showTripTable = bool;
		}

		for (let i in vm.showTripForm)
			if (vm.showTripForm.hasOwnProperty(i) && vm.showTripForm[i]) {
				vm.showTripForm.toShow = true;
				break;
			}

		if (otherData.advanceCategory === "other") {
			vm.showCategory = true;
			vm.showAdvanceType = false;
			vm.oAdvance.advanceType = "Diesel";
			vm.aCatagory = otherData.aCatagory;
		}

		vm.selectedAdv = otherData.selectedAdv;
		vm.selectedTrip = otherData.selectedTrip || {};
		setAdvType();

		if (vm.modelDetail.type === "add") {
			vm.oAdvance.date = new Date();
			vm.date = vm.oAdvance.date;
			if (vm.selectedTrip && vm.selectedTrip.vehicle_no) {
				vm.oAdvance.vehicle = vm.selectedTrip.vehicle;
				setAccount();
				// if(vm.selectedTrip.ownershipType == "Market")
				// 	vm.oAdvance.narration = narrationService({vehicleNo: vm.selectedTrip.vehicle_no, tripNo: vm.selectedTrip.trip_no, vendor: vm.selectedTrip.vendor && vm.selectedTrip.vendor.name});
			}
		} else if (vm.modelDetail.type === "edit") {
			vm.oAdvance = {
				...vm.selectedAdv,
				branch: vm.selectedAdv.branch && vm.selectedAdv.branch._id,
				diesel_info: vm.selectedAdv.dieseInfo || vm.selectedAdv.diesel_info,
				account_data: {
					from: vm.selectedAdv.from_account,
					to: vm.selectedAdv.to_account,
				},
				from_account_name:
					(vm.selectedAdv.from_account && vm.selectedAdv.from_account.name) ||
					vm.selectedAdv.from_account_name,
				to_account_name:
					(vm.selectedAdv.to_account && vm.selectedAdv.to_account.name) ||
					vm.selectedAdv.to_account_name,
				aExtraCharges: vm.selectedAdv.aExtraCharges,
			};

			// vm.oldAmount = angular.copy(vm.oAdvance.amount);
			vm.prevSelectedVehicle =
				vm.selectedAdv.vehicle && vm.selectedAdv.vehicle._id;

			vm.selectedRefNo = {
				bookNo: vm.selectedAdv.reference_no,
				_id: vm.selectedAdv.stationaryId,
			};

			vm.oAdvance.date = vm.oAdvance.date && new Date(vm.oAdvance.date);

			vm.date = vm.oAdvance.date;

			if (vm.oAdvance.grData && vm.oAdvance.grData.length)
				vm.oAdvance.gr = vm.oAdvance.grData[0];

			getSingleBranch();

			if (
				!(otherData.selectedTrip && otherData.selectedTrip._id) &&
				vm.selectedAdv.trip_no
			) {
				getTripFromTripNo(vm.selectedAdv.trip_no);
			} else {
				tableRowClick();
			}
		} else {
			vm.oAdvance.slip = {};
		}
	})();

	/*
	 * Get All Branches List
	 * */

	function clearTrip() {
		vm.aTrip = [];
		vm.selectedTrip = undefined;
		vm.tableApi && vm.tableApi.refresh();
	}
	function onToAcSelect(item) {
		vm.oAdvance.person = item.name;
	}

	function addExtraChrges(obj, type) {
		vm.oExtraCharges = {
			amtType: obj.amtType,
			amtTypeAmount: obj.amtTypeAmount,
		};
		vm.oAdvance.aExtraCharges.push(vm.oExtraCharges);
		vm.oAdvance.totalExtraChrges += obj.amtTypeAmount;
		vm.oAdvance.amount = vm.oAdvance.totalExtraChrges;
		vm.oAdvance.amtType = "";
		vm.oAdvance.amtTypeAmount = "";
	}

	function remove(obj, key) {
		vm.oAdvance.totalExtraChrges -= obj.aExtraCharges[key].amtTypeAmount;

		vm.oAdvance.aExtraCharges.splice(key, 1);
		vm.oAdvance.amount = vm.oAdvance.totalExtraChrges;
	}

	function getSingleBranch() {
		let req = {
			_id: vm.oAdvance.branch,
		};

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			vm.oAdvance.branch = data.data[0];
			vm.billBookId = vm.oAdvance.branch.refNoBook
				? vm.oAdvance.branch.refNoBook.map((o) => o.ref)
				: "";
			// if(vm.oAdvance.branch && !vm.aBranch.find( o => o._id === vm.oAdvance.branch))
			// 	vm.aBranch.unshift(vm.oAdvance.branch);
		}
	}

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function associateDriver() {
		// if( !(vm.selectedTrip && vm.selectedTrip._id))
		// 	return swal('Warning', 'No Trip Selected', 'warning');

		var modalInstances = $modal
			.open({
				templateUrl: "views/driverOnVehicle/addDriverOnVehiclePopup.html",
				controller: [
					"$uibModalInstance",
					"callback",
					"otherUtils",
					"Driver",
					"Vehicle",
					"DatePicker",
					"driverOnVehicleService",
					"otherData",
					addDriverOnVehicleController,
				],
				controllerAs: "vm",
				resolve: {
					callback: function () {
						return function (data) {
							return new Promise(function (resolve, reject) {
								if (!(data.driver && data.driver._id)) {
									swal("Error", "No Driver Found", "error");
									return reject();
								}
								if (!(data.vehicle && data.vehicle._id)) {
									swal("Error", "No Driver Found", "error");
									return reject();
								}

								let oFilter = {
									driver: data.driver._id,
									vehicle: data.vehicle._id,
									ass_date: data.ass_date,
									fromAdv: true,
								};

								tripServices.associatedriverOnVehicle(oFilter, success, fail);

								function success(response) {
									if (response.data && response.status === "OK") {
										swal("Success", response.message, "success");
										getTrips();
										return resolve();
									} else if (response.status != "OK") {
										swal("warning", response.message, "warning");
										reject();
									}
								}

								function fail(response) {}
							});
						};
					},
					otherData: function () {
						let selectedTripVehicle =
							vm.selectedTrip && vm.selectedTrip.vehicle;
						return {
							vehicle: selectedTripVehicle,
						};
					},
					fromSettlement: function () {
						return true;
					},
				},
			})
			.result.then(
				function (data) {
					// console.log(data);
					getTrips();
				},
				function (data) {
					// console.log(data);
				}
			);
	}

	function getRefNo(viewValue) {
		if (!vm.billBookId) {
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}

		return new Promise(function (resolve, reject) {
			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: "Ref No",
				status: "unused",
			};

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getGr(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1,
				};
				tripServices.getAllGRItem(
					req,
					(res) => {
						resolve(res.data.data.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function onRefSelect(item, model, label) {
		vm.selectedRefNo = item;
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (
					vm.selectedTrip &&
					vm.selectedTrip.vendor &&
					vm.selectedTrip.vendor.clientId
				)
					req.cClientId = vm.selectedTrip.vendor.clientId;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					req._ids = [];
					vm.aUserBranch.forEach((obj) => {
						if (obj.write) req._ids.push(obj._id);
					});
					if (!(req._ids && req._ids.length)) {
						return;
					} else {
						req._ids = JSON.stringify(req._ids);
					}
				}

				branchService.getAllBranches(
					req,
					(res) => {
						resolve(res.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function onBranchSelect(item) {
		vm.oAdvance.reference_no = "";
		vm.billBookId = item.refNoBook ? item.refNoBook.map((o) => o.ref) : "";
		getCostCenter();
	}

	function getCostCenter() {
		if (!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if (!vm.oAdvance.advanceType)
			return swal("Error", "Select Advance Type first", "error");

		accountingService.getCostCenter(
			{
				branch: vm.oAdvance.branch._id,
				feature: vm.oAdvance.advanceType,
				projection: { _id: 1, name: 1, category: "$category.name" },
			},
			(res) => {
				vm.oAdvance.ccBranch = res.data[0];
			},
			(res) => console.error(response)
		);
	}

	function getAutoStationaryNo(viewValue) {
		// if (!(vm.billBookId && vm.billBookId.length))
		// 	return swal('warning', 'Ref Book not found on this branch', 'warning');

		if (viewValue != "centrailized" && !vm.oAdvance.branch) {
			swal("Warning", "Please Select Branch", "warning");
			return [];
		}

		if (viewValue != "centrailized" && !(vm.billBookId && vm.billBookId.length))
			return [];

		if (!vm.oAdvance.date) {
			swal("Error", "Advance Date is required", "error");
			return [];
		}

		let req = {
			billBookId: vm.billBookId,
			type: "Ref No",
			auto: true,
			sch: "onBook",
			status: "unused",
		};

		if (viewValue === "centrailized") {
			delete req.billBookId;
			req.centralize = true;
		}

		if (vm.oAdvance.date)
			// req.backDate = backDate;
			req.useDate = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oAdvance.reference_no = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
		}
	}

	function getVname(viewValue) {
		if (viewValue.length < 3) return;

		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}

			Vehicle.getNamePop(
				viewValue,
				["vendor_id", "vendor_id.account"],
				oSuc,
				oFail
			);
		});
	}

	function getAccount(key, aGroup, viewValue) {
		if (viewValue.length < 1) return;

		return new Promise(function (resolve, reject) {
			function onSuccess(response) {
				resolve(response.data.data);
			}

			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			if (!aGroup) return;

			var oFilter = {
				no_of_docs: 10,
				group: aGroup,
			}; // filter to send

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (viewValue) oFilter.name = viewValue;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
		});
	}

	function getAccountAsync(name, aGroup) {
		return new Promise(function (resolve, reject) {
			if (!aGroup) return;

			var oFilter = {
				no_of_docs: 10,
			}; // filter to send

			if (aGroup) oFilter.group = aGroup;

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (name) oFilter.name = name;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}
		});
	}

	function getFuelStation(item) {
		if (
			!(
				vm.oAdvance.diesel_info.vendor &&
				vm.oAdvance.diesel_info.vendor.vendorId
			)
		)
			return;
		if (!vm.oAdvance.date) {
			swal("error", "Plz select Allocation Date", "error");
			return;
		}

		function successGetStation(response) {
			if (!response.data || !response.data.data || !response.data.data.length) {
				swal(
					"warning",
					"No Rate Found in This Date Range for this FuelVendor",
					"warning"
				);
				return;
			}

			vm.oAdvance.diesel_info.station = response.data.data[0];
			vm.oAdvance.diesel_info.rate = vm.oAdvance.diesel_info.station.fuel_price;

			$scope.$configs.tripAdv.calLitre
				? setLiter(vm.oAdvance.amount)
				: setAmount(vm.oAdvance.diesel_info.litre);
		}

		function failGetStation(res) {}

		let oFilter = {
			vendorId: item.vendorId,
		};

		if (vm.oAdvance.date)
			oFilter.to = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		vendorFuelService.GetFuelStationObj(
			oFilter,
			successGetStation,
			failGetStation
		);
	}

	function getFuelVendor(viewValue) {
		return new Promise(function (resolve, reject) {
			function success(response) {
				vm.aFuelVendor = response.data;
				resolve(response.data);
			}

			function failure(response) {
				reject([]);
				console.log(response);
			}

			let req = {
				name: viewValue,
				no_of_docs: 10,
			};

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				req.cClientId = vm.selectedTrip.vendor.clientId;

			vendorFuelService.getVendorFuels(req, success, failure);
		});
	}

	function getTrips(isGetActive) {
		// if(!(vm.vehicle_no && vm.date)){
		// 	swal('warning', "Both Vehicle and Date should be Filled",'warning');
		// 	return;
		// }

		if (!vm.lazyLoad.update(isGetActive)) return;

		let oFilter = prepareFilter();
		oFilter.project={
			agr : 1,
			vehicle : 1,
			vehicle_no : 1,
			trip_no : 1,
			tripBudget : 1,
			status : 1,
			start_date : 1,
			end_date : 1,
			serviceTyp : 1,
			"route.route_distance" : 1,
			driver : 1,
			allocation_date : 1,
			statuses : 1,
			clientId : 1,
			markSettle: 1,
			ownershipType: 1,
			payments: 1,
			route_name: 1,
			segment_type: 1,
			settled: 1,
			suspenseAdv: 1,
			type: 1,
			vendorDeal:1,
			vendor : 1,
		};

		tripServices.findByAdvanceDate(oFilter, function (res) {
			if (res && res.data) {
				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
				vm.tableApi && vm.tableApi.refresh();
				tableRowClick();
			}
		});
	}

	function getTripFromTripNo(tripNo) {
		let oFilter = {
			trip_no: tripNo,
			vehicle_no: vm.oAdvance.vehicle_no,
			popolate: {
				vendor: 1,
				"vendor.account": 1,
			},
		};

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, false, res);
				vm.tableApi && vm.tableApi.refresh();
				vm.selectedTrip = res.data[0];
				tableRowClick();
			}
		});
	}

	function prepareFilter(item) {
		let request = {};

		if (vm.oAdvance.vehicle)
			request.vehicle_no = vm.oAdvance.vehicle.vehicle_reg_no;

		if (vm.date)
			request.advanceDate = moment(vm.date, "DD/MM/YYYY").toISOString();

		if (item) request.vendorId = item.vendorId;

		request.no_of_docs = 5;

		return request;
	}

	function advanceDateType() {
		// vm.oAdvance.date =  moment(vm.date, 'DD/MM/YYYY').toISOString();

		if (vm.oAdvance.editable != false)
			vm.oAdvance.date = moment(vm.date, "DD/MM/YYYY").toDate();

		if (vm.oAdvance.diesel_info.vendor)
			getFuelStation(vm.oAdvance.diesel_info.vendor);

		if (
			vm.oAdvance &&
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.vehicle_reg_no &&
			vm.showTripForm.autoMap
		)
			getTrips();
	}

	function onVehicleSelect($item, $model) {
		setAccount();
		setAdvType();
		clearTrip();
		setContraAcc();
		getBalance();
		if (vm.advanceDate && vm.showTripForm.autoMap) getTrips();
		vm.oAdvance.ccVehicle = vm.oAdvance.vehicle.costCenter;
	}

	function getBalance() {
		if (vm.oAdvance.vehicle) {
			let oFilter = {
				vehicle:
					(vm.oAdvance.vehicle && vm.oAdvance.vehicle._id) ||
					vm.oAdvance.vehicle,
			};

			tripServices.getLastSettleBal(oFilter, successGetStation, failGetStation);

			function successGetStation(response) {
				if (response.data && response.data.data) {
					response = response.data;
					vm.advanceAfterRt = response.data.advanceAfterRt;
					vm.closingBal = response.data.closing;
				}
			}

			function failGetStation(res) {}
		}
	}

	function setContraAcc() {
		if (
			vm.modelDetail.type == "edit" &&
			vm.oAdvance.voucher &&
			vm.prevSelectedVehicle != vm.oAdvance.vehicle._id
		) {
			vm.oAdvance.internalAccount = vm.dealAcc.advContraAcc;
		}
	}

	function onVendorSelect() {
		getFuelStation(vm.oAdvance.diesel_info.vendor);
		vm.oAdvance.account_data.from = {};
		setAccount();
		if (vm.oAdvance.advanceType && !vm.showAdvanceType)
			vm.showCategory &&
				setUnsetAccountMasterVendor(vm.oAdvance.advanceType, "advType");
		else vm.showCategory && setUnsetAccountMasterVendor(vm.oAdvance.category);
	}

	function setAmount(liter) {
		let amt;
		if (
			(amt = Math.round(liter * vm.oAdvance.diesel_info.rate * 100) / 100) >
			$scope.$constants.advanceAmount
		) {
			swal("warning", "Amount Can't be grater than 2 Lakh", "warning");
			return;
		}
		vm.oAdvance.amount = amt;
	}
	function calculatebudget(){
		if(vm.selectedTrip){
			let totKm = vm.selectedTrip.agr && vm.selectedTrip.agr.acknowledge && vm.selectedTrip.agr.acknowledge.routeDistance || vm.selectedTrip.route && vm.selectedTrip.route.route_distance || vm.selectedTrip.rKm;
			vm.Budgeted_Diesel = 0;
			vm.Budgeted_Advance = 0;
			if(totKm) {
				if (vm.selectedTrip.tripBudget) {
					vm.Budgeted_Diesel = totKm / vm.selectedTrip.tripBudget.dieselKm;
					vm.Budgeted_Advance = totKm * vm.selectedTrip.tripBudget.rateKm;

				} else if (vm.selectedTrip.vehicle && vm.selectedTrip.vehicle.current_budget && vm.selectedTrip.vehicle.current_budget[vm.selectedTrip.serviceTyp]) {
					vm.Budgeted_Diesel = totKm / vm.selectedTrip.vehicle.current_budget[vm.selectedTrip.serviceTyp].mileage;
					vm.Budgeted_Advance = totKm * vm.selectedTrip.vehicle.current_budget[vm.selectedTrip.serviceTyp].rpk;

				}
			}
		}
	}

	function setAmountRate(rate) {
		if (rate > 100) {
			swal("warning", "Rate can't be that high", "warning");
		} else if (rate < 50) {
			swal("warning", "Rate can't be that low", "warning");
		}

		let amt;
		if (
			(amt = Math.round(rate * vm.oAdvance.diesel_info.litre * 100) / 100) >
			100000
		) {
			swal("warning", "Amount Can't be grater than 1 Lakh", "warning");
			return;
		}

		vm.oAdvance.amount = amt;
	}
	function setLiter(amt) {
		if (!amt) return;
		vm.oAdvance.diesel_info.litre = amt / vm.oAdvance.diesel_info.rate;
		vm.oAdvance.diesel_info.litre = parseFloat(
			vm.oAdvance.diesel_info.litre.toFixed(2)
		);
		if (
			(amt =
				Math.round(
					vm.oAdvance.diesel_info.liter * vm.oAdvance.diesel_info.rate * 100
				) / 100) > $scope.$constants.advanceAmount
		) {
			swal("warning", "Amount Can't be grater than 2 Lakh", "warning");
			return;
		}
	}

	function setLiterRate(rate) {
		if (rate > 100) {
			swal("warning", "Rate can't be that high", "warning");
		} else if (rate < 50) {
			swal("warning", "Rate can't be that low", "warning");
		}

		let amt;
		if (
			(amt = Math.round(rate * vm.oAdvance.diesel_info.litre * 100) / 100) >
			100000
		) {
			swal("warning", "Amount Can't be grater than 1 Lakh", "warning");
			return;
		}

		// vm.oAdvance.amount = amt;
		vm.oAdvance.diesel_info.litre = vm.oAdvance.amount / rate;
		vm.oAdvance.diesel_info.litre = parseFloat(
			vm.oAdvance.diesel_info.litre.toFixed(2)
		);
	}

	function setUnsetAccountMasterVendor(type, advType) {
		onAdvanceTypeChange(type);

		vm.oAdvance.account_data = vm.oAdvance.account_data || {};

		if (!type) {
			vm.oAdvance.account_data = {};
			return;
		}

		let index;

		try {
			if (vm.oAdvance.vehicle.ownershipType == "Market") index = 1;
			else index = 0;
		} catch (e) {
			index = 0;
		}

		vm.aToAccount = [];
		vm.aFromAccount = [];

		let expenseTypeConfig;
		if (!vm.showAdvanceType) {
			if (!vm.showAdvanceType && advType === "advType") {
				expenseTypeConfig = vm.aAdvanceType.find((o) => o.name === type);
				setAccount();
			} else {
				expenseTypeConfig = vm.aCatagory.find((o) => o.name === type);
			}
		} else {
			expenseTypeConfig = (vm.aCatagory || vm.aAdvanceType).find(
				(o) => o.name === type
			);
		}

		if (!expenseTypeConfig && vm.showAdvanceType) {
			swal("", "Account config not found!", "error");
			return;
		}

		if (
			!vm.showAdvanceType
				? advType === "advType"
				: true &&
				  !Array.isArray(expenseTypeConfig.a1) &&
				  expenseTypeConfig.a1 &&
				  expenseTypeConfig.a1.substr(0, 1) === "$"
		) {
			if (!vm.accounts[expenseTypeConfig.a1]) {
				// swal('Error', expenseTypeConfig.a1.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aFromAccount.push(vm.accounts[expenseTypeConfig.a1]);
			vm.oAdvance.account_data.from =
				vm.accounts[expenseTypeConfig.a1] &&
				vm.accounts[expenseTypeConfig.a1]._id
					? vm.accounts[expenseTypeConfig.a1]
					: undefined;
			vm.aFromGroup = [];
		} else {
			vm.aFromGroup = Array.isArray(expenseTypeConfig.a1)
				? expenseTypeConfig.a1
				: [expenseTypeConfig.a1];
			// getAccount('aFromAccount', vm.aFromGroup = Array.isArray(expenseTypeConfig.a1) ? expenseTypeConfig.a1 : [expenseTypeConfig.a1]);
		}

		// let key = 'a2';
		let key =
			vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType === "Associate"
				? "a3"
				: "a2";
		if (
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.ownershipType === "Associate" &&
			!expenseTypeConfig[key]
		) {
			vm.aToGroup = [];
			key = "a2";
		}

		let expConfigA2 = Array.isArray(expenseTypeConfig[key])
			? expenseTypeConfig[key][index]
			: expenseTypeConfig[key];

		if (expConfigA2 && expConfigA2.substr(0, 1) === "$") {
			if (!vm.accounts[expConfigA2]) {
				// swal('Error', expConfigA2.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aToAccount.push(vm.accounts[expConfigA2]);
			vm.oAdvance.account_data.to =
				vm.accounts[expConfigA2] && vm.accounts[expConfigA2]._id
					? vm.accounts[expConfigA2]
					: undefined;
			vm.aToGroup = [];
			vm.oAdvance.person = vm.oAdvance.account_data.to.name;
			if (
				$scope.$configs &&
				$scope.$configs.tripAdv &&
				$scope.$configs.tripAdv.driverDetails
			) {
				if (
					vm.selectedTrip &&
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.name
				)
					vm.oAdvance.person = vm.selectedTrip.driver.name;
				else {
					vm.oAdvance.person =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.name) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_name);
					vm.oAdvance.driverCode =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.employee_code) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_employee_code);
				}
			}
		} else {
			// vm.aToGroup = [expConfigA2];
			vm.aToGroup = Array.isArray(expenseTypeConfig.a2)
				? expenseTypeConfig.a2
				: [expenseTypeConfig.a2];
			// getAccount('aToAccount', vm.aToGroup = [expConfigA2]);
		}
	}

	function submit(formData) {
		if (vm.disableButton) {
			return;
		}
		let cat = ["Car", "Market", "Generator"];
		if (
			!(vm.selectedTrip && vm.selectedTrip._id) &&
			$scope.$configs.tripAdv.tripSusnotAllow &&
			!(cat.indexOf(vm.oAdvance.category) + 1)
		) {
			swal("Error", "Trip Suspence not Allowed", "error");
			return;
		}

		if (vm.oAdvance.advanceType == "Diesel" && !vm.oAdvance.diesel_info.rate) {
			swal("Error", "No Rate Selected", "error");
			return;
		}

		if (vm.oAdvance.date)
			vm.oAdvance.date = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		if (
			formData.$valid &&
			vm.oAdvance.account_data.from._id &&
			vm.oAdvance.account_data.to._id
		) {
			if (vm.oAdvance.advanceType === "Diesel" && vm.showInEdit) {
				let diesel_info =
					vm.selectedAdv.diesel_info || vm.selectedAdv.dieseInfo;
				if (
					vm.oAdvance.diesel_info.litre !== diesel_info.litre &&
					vm.oAdvance.diesel_info.rate !== diesel_info.rate
				) {
					swal("Error", "Both Rate and Liter cannot be modified", "error");
					return;
				}
			}
			if (
				vm.oAdvance.advanceType === "Diesel" &&
				vm.oAdvance.amount > $scope.$constants.maxAdvanceDieselAmount
			)
				return swal(
					"Error",
					`Limit boundation amount cannot be greater than ${$scope.$constants.maxAdvanceDieselAmount}`,
					"error"
				);

			vm.selectedTrip = vm.selectedTrip || {};
			let vehicle =
				(vm.selectedTrip && vm.selectedTrip.vehicle) || vm.oAdvance.vehicle;

			if (vm.mandatory.vehicle && !vehicle) {
				swal("Error", "Please Provide Vehicle", "error");
				return;
			}
			if ($scope.$configs.tripAdv && $scope.$configs.tripAdv.AdvAmtGt) {
				if (vm.oAdvance.amount <= 0) {
					swal("Error", "amount should be greater than 0", "error");
					return;
				}
			}

			let request = {
				oAdvance: {
					...vm.oAdvance,
					account_data: {
						from: vm.oAdvance.account_data.from._id,
						to: vm.oAdvance.account_data.to._id,
					},
					aExtraCharges: vm.oAdvance.aExtraCharges,
				},

				_id: vm.selectedTrip._id,
			};

			if (request.oAdvance.internalAccount)
				request.oAdvance.internalAccount = request.oAdvance.internalAccount._id;

			if (
				vm.oAdvance.account_data &&
				vm.oAdvance.account_data.from &&
				vm.oAdvance.account_data.from._id
			)
				request.oAdvance.from_account_name = vm.oAdvance.account_data.from.name;

			if (
				vm.oAdvance.account_data &&
				vm.oAdvance.account_data.to &&
				vm.oAdvance.account_data.to._id
			)
				request.oAdvance.to_account_name = vm.oAdvance.account_data.to.name;

			if (
				request.oAdvance.to_account ||
				(request.oAdvance.account_data && request.oAdvance.account_data.to)
			)
				request.oAdvance.to_account = request.oAdvance.account_data.to;

			if (
				request.oAdvance.from_account ||
				(request.oAdvance.account_data && request.oAdvance.account_data.from)
			)
				request.oAdvance.from_account = request.oAdvance.account_data.from;

			if (vehicle) {
				request.oAdvance.vehicle = vehicle._id;
				request.oAdvance.vehicle_no = vehicle.vehicle_reg_no;
			}

			if (vm.oAdvance.branch) request.oAdvance.branch = vm.oAdvance.branch._id;

			if (
				$scope.$configs.costCenter &&
				$scope.$configs.costCenter.show &&
				!vm.oAdvance.ccBranch
			)
				return swal(
					"Error",
					vm.oAdvance.advanceType + " Cost Center not Found",
					"error"
				);

			if (
				$scope.$configs.costCenter &&
				$scope.$configs.costCenter.show &&
				vm.oAdvance.vehicle &&
				vm.oAdvance.vehicle._id &&
				!vm.oAdvance.ccVehicle
			)
				return swal("Error", "Cost Center not linked on vehicle", "error");

			if (vm.oAdvance.gr) {
				request.oAdvance.gr = [vm.oAdvance.gr._id];
				request.oAdvance.grData = [
					{
						_id: vm.oAdvance.gr._id,
						grNumber: vm.oAdvance.gr.grNumber,
					},
				];
			}

			if (vm.selectedTrip.vendor && vm.selectedTrip.vendor._id)
				request.oAdvance.vendor = vm.selectedTrip.vendor._id;

			if (vm.selectedTrip.driver && vm.selectedTrip.driver._id)
				request.oAdvance.driver = vm.selectedTrip.driver._id;

			if (!request.oAdvance.driver && vehicle && vehicle.driver)
				request.oAdvance.driver =
					(vehicle.driver && vehicle.driver._id) || vehicle.driver;

			if (vm.oAdvance.advanceType === "Driver Cash")
				request.oAdvance.narration =
					"Being Cash Paid; " +
					narrationService({
						vehicleNo: vehicle && vehicle.vehicle_reg_no,
						tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
					});
			if (
				vm.oAdvance.advanceType === "Happay" ||
				vm.oAdvance.advanceType === "Fastag"
			)
				request.oAdvance.narration = narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
					tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
				});

			if (vm.oAdvance.advanceType === "Diesel") {
				request.oAdvance.narration =
					vm.oAdvance.diesel_info.litre +
					" lit@ " +
					vm.oAdvance.diesel_info.rate;
				let foundVeh = narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
				});
				if (foundVeh)
					request.oAdvance.narration =
						request.oAdvance.narration + "; " + foundVeh;
				request.oAdvance.diesel_info = {
					...vm.oAdvance.diesel_info,
					// station: vm.oAdvance.diesel_info.station._id,
					vendor: vm.oAdvance.diesel_info.vendor._id,
				};
			} else {
				delete request.oAdvance.diesel_info;
			}

			// request.oAdvance.narration = vm.oAdvance.remark ? (request.oAdvance.narration + ';  ' +  vm.oAdvance.remark) : request.oAdvance.narration;

			if (
				vm.selectedRefNo &&
				vm.selectedRefNo.bookNo === vm.oAdvance.reference_no
			)
				request.oAdvance.stationaryId = vm.selectedRefNo._id;
			else delete request.oAdvance.stationaryId;

			let reqStationary = false;
			if ($scope.$configs.tripAdv && $scope.$configs.tripAdv.advType)
				reqStationary =
					$scope.$configs.tripAdv.advType.indexOf(vm.oAdvance.advanceType) !=
					-1;

			if (
				reqStationary &&
				$scope.$configs.tripAdv &&
				$scope.$configs.tripAdv.branch
			)
				reqStationary = !(
					$scope.$configs.tripAdv.branch.indexOf(
						vm.oAdvance.branch && vm.oAdvance.branch.name
					) != -1
				);

			if (reqStationary) {
				if (!request.oAdvance.stationaryId)
					return swal("", "Invalid Selected Ref No", "error");
			}

			vm.disableButton = true;
			callback(request)
				.then(function (res) {
					if (vm.dataPreserve && vm.showInAdd) {
						vm.disableButton = false;
						preserveData();
					} else {
						$uibModalInstance.close(res);
					}
				})
				.catch(function (err) {
					vm.disableButton = false;
					console.log(err);
				});
		} else {
			console.log(formData.required);
			swal("", "All Mandatory Field are not Filled", "error");
		}
	}

	function submitRemark(formData) {
		// if (selectedAdv.trip) {
		// 	let oFilter = {
		// 		_id: selectedAdv.trip,
		// 		'advSettled.isCompletelySettled': false
		// 	};

		// pr = new Promise(function (resolve, reject) {
		// 	tripServices.getAllTripsWithPagination(oFilter, success);

		if (formData.$valid && vm.oAdvance && vm.selectedAdv._id) {
			vm.selectedAdv.deleteRemark = vm.oAdvance.deleteRemark;

			let request = {
				oAdvance: {
					...vm.selectedAdv,
				},
				// _id: vm.selectedTrip._id
			};

			callback(request)
				.then(function (res) {
					$uibModalInstance.close(res);
				})
				.catch(function (err) {
					console.log(err);
				});
		} else {
			console.log(formData.required);
			swal("", "Please Fill Remark", "error");
		}
	}

	function preserveData() {
		vm.disableButton = false;
		vm.oAdvance.reference_no = undefined;
		vm.oAdvance.bill_no = undefined;
		vm.oAdvance.amount = 0;
		if (vm.oAdvance.diesel_info.litre) vm.oAdvance.diesel_info.litre = 0;
	}

	function tableRowClick() {
		if (vm.selectedTrip.length) {
			vm.selectedTrip = vm.selectedTrip[0];
		}
		if($scope.$configs.tripAdv && $scope.$configs.tripAdv.AdvisedBudget) {
			calculatebudget();
		}
		setAccount();
		setAdvType();
		vm.showInAdd && (vm.oAdvance.advanceType = null);
		vm.showInAdd && setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function generateRemark() {
		vm.oAdvance.narration =
			vm.oAdvance.diesel_info.litre + " lit@ " + vm.oAdvance.diesel_info.rate;
	}

	function setAccount() {
		vm.accounts = {
			$vendor: false,
			$driver: false,
			$vehicle:
				/*vm.oAdvance.account_data.to |`| */ (vm.oAdvance.vehicle &&
					vm.oAdvance.vehicle.account) ||
				false,
			$vehicleVendor:
				/*vm.oAdvance.account_data.to || */ (vm.oAdvance.vehicle &&
					vm.oAdvance.vehicle.vendor_id &&
					vm.oAdvance.vehicle.vendor_id.account) ||
				false,
			$fvendor: {},
			$happayAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.hpAcc) || {},
			$fastagAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.ftAcc) ||
				($scope.$configs &&
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.accounts &&
					$scope.$configs.tripAdv.accounts.ftAcc) ||
				{},
			$dieselAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.dlAcc) || {},
			$driverCAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.drAcc) || {},
			$chalanAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.chAcc) || {},
			$shortageAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.stAcc) || {},
		};

		if (vm.selectedTrip && vm.selectedTrip.vendor)
			vm.accounts.$vendor = {
				_id:
					vm.selectedTrip.vendorDeal.lorryAc &&
					vm.selectedTrip.vendorDeal.lorryAc.id,
				name:
					vm.selectedTrip.vendorDeal.lorryAc &&
					vm.selectedTrip.vendorDeal.lorryAc.name,
			}; //vm.selectedTrip.vendor.account || false;

		if (vm.selectedTrip && vm.selectedTrip.driver)
			vm.accounts.$driver = {
				_id:
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.account &&
					vm.selectedTrip.driver.account._id,
				name:
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.account &&
					vm.selectedTrip.driver.account.name,
			}; //vm.selectedTrip.driver.account || false;

		if (
			vm.oAdvance.diesel_info &&
			vm.oAdvance.diesel_info.vendor &&
			vm.oAdvance.diesel_info.vendor.account &&
			vm.oAdvance.diesel_info.vendor.account._id
		)
			vm.accounts.$fvendor = vm.oAdvance.diesel_info.vendor.account;
		else if (
			vm.oAdvance.diesel_info &&
			vm.oAdvance.diesel_info.vendor &&
			vm.oAdvance.diesel_info.vendor.account
		)
			vm.accounts.$fvendor = vm.oAdvance.account_data.from;

		if (
			vm.oAdvance.advanceType &&
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.ownershipType
		)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
		else if (vm.showCategory && vm.oAdvance.category)
			setUnsetAccountMasterVendor(vm.oAdvance.category);
		else if (vm.oAdvance.advanceType && vm.showInEdit)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function validateAmount(amt) {
		if (Number(amt) > $scope.$constants.advanceAmount) {
			swal("Warning", "Amount Should Be Less Than 2 Lakh", "warning");
			vm.oAdvance.amount = 200000;
			return;
		}
	}

	function setAdvType() {
		let ownerShipType;
		if (vm.selectedTrip)
			ownerShipType =
				vm.selectedTrip.ownershipType ||
				(vm.selectedTrip.vehicle && vm.selectedTrip.vehicle.ownershipType);

		if (!ownerShipType)
			ownerShipType = vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType;

		vm.aAdvanceType = (
			$scope.$configs.master.expenseObj ||
			$scope.$constants.expenseObj ||
			[]
		).filter((o) => {
			let bool =
				o.c === "n" &&
				(ownerShipType === "Market"
					? true
					: !(o.name.toString().indexOf("Vendor") + 1));
			return bool;
		});
	}

	function onAdvanceTypeChange(type) {
		let adv = vm.aAdvanceType.find((o) => o.name == type);
		if (adv) vm.showGr = !!adv.gr;
	}
	if (!vm.showAdvanceType) {
		vm.aAdvanceType = vm.aAdvanceType.filter((o) => {
			return o.otherExp;
		});
	}
}

function requestPopupController(
	$scope,
	$uibModalInstance,
	accountingService,
	branchService,
	callback,
	DatePicker,
	lazyLoadFactory,
	modelDetail,
	otherData,
	billBookService,
	tripServices,
	Vehicle,
	narrationService,
	vendorFuelService
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.clearTrip = clearTrip;
	vm.getAccount = getAccount;
	vm.getAccountAsync = getAccountAsync;
	vm.getFuelStation = getFuelStation;
	vm.getFuelVendor = getFuelVendor;
	vm.getTrips = getTrips;
	vm.getVname = getVname;
	vm.preserveData = preserveData;
	vm.onVehicleSelect = onVehicleSelect;
	vm.setContraAcc = setContraAcc;
	vm.setUnsetAccountMasterVendor = setUnsetAccountMasterVendor;
	vm.setAccount = setAccount;
	vm.setAmount = setAmount;
	vm.setLiter = setLiter;
	vm.generateRemark = generateRemark;
	vm.setAmountRate = setAmountRate;
	vm.setLiterRate = setLiterRate;
	vm.getSingleBranch = getSingleBranch;
	vm.tableRowClick = tableRowClick;
	vm.validateAmount = validateAmount;
	vm.advanceDateType = advanceDateType;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.onBranchSelect = onBranchSelect;
	vm.onVendorSelect = onVendorSelect;
	vm.getAllBranch = getAllBranch;
	vm.onRefSelect = onRefSelect;
	vm.getRefNo = getRefNo;
	vm.getGr = getGr;
	vm.onToAcSelect = onToAcSelect;
	vm.submit = submit;
	vm.submitRemark = submitRemark;

	// init
	(function init() {
		vm.showGr = false;
		vm.allocationDate = new Date();
		vm.aUserBranch =
			($scope.$configs.branchAccessCtl && $scope.$user.branch) || [];
		vm.oAdvance = {
			account_data: {
				// from: {},
				// to: {}
			},
			diesel_info: {
				// 	vendor: {}
			},
		};
		vm.DatePicker = angular.copy(DatePicker);
		vm.dealAcc = $scope.$configs.client_allowed.filter(
			(o) => o.clientId === $scope.selectedClient
		)[0];
		vm.columnSetting = {
			allowedColumn: [
				"Trip No",
				"Gr No",
				"Vehicle No",
				"Vehicle Type",
				"Route",
				"Customer",
				"Driver Name",
				"Trip Allocation",
				"Trip Started",
				"Trip Ended",
				"Trip Status",
			],
		};
		vm.tableHead = [
			{
				header: "Trip No",
				bindingKeys: "trip_no",
			},
			{
				header: "Gr No",
				filter: {
					name: "arrayOfGrToString",
					aParam: ["gr"],
				},
			},
			{
				header: "Vehicle No",
				bindingKeys: "vehicle_no",
				date: false,
			},
			{
				header: "Vehicle Type",
				bindingKeys: "vehicle.veh_type_name",
			},

			{
				header: "Route",
				bindingKeys: "route_name || rName",
			},
			{
				header: "Customer",
				bindingKeys: "agr.customer.name || gr[0].customer.name",
			},
			{
				header: "Driver Name",
				bindingKeys: "driver.name",
			},
			{
				header: "Trip Allocation",
				bindingKeys: "allocation_date",
				date: true,
			},
			{
				header: "Trip Started",
				bindingKeys:
					'((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
			},
			{
				header: "Trip Ended",
				bindingKeys:
					'((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
			},
			{
				header: "Trip Status",
				bindingKeys: "status",
			},
		];

		vm.aTrip = [];
		vm.lazyLoad = lazyLoadFactory();
		vm.showAdvanceType = true;
		vm.showCategory = false;
		vm.modelDetail = modelDetail;
		vm.showInAdd = modelDetail.type === "add";
		vm.showInEdit = modelDetail.type === "edit";
		vm.showTripForm =
			typeof modelDetail.showTripForm == "undefined"
				? true
				: modelDetail.showTripForm;
		vm.accounts = {};
		vm.mandatory = {
			vehicle: true,
			...modelDetail.mandatory,
		};
		if (
			$scope.$configs &&
			$scope.$configs.tripAdv &&
			$scope.$configs.tripAdv.driverDetails
		) {
			vm.driverLable = "Driver Name";
		}

		if (typeof vm.showTripForm == "object") {
			vm.showTripForm = {
				showVehicle: true,
				showAdvanceDate: true,
				showTripSearchBtn: true,
				showTripTable: true,
				...vm.showTripForm,
			};
		} else if (typeof vm.showTripForm == "boolean") {
			let bool = !!vm.showTripForm;
			vm.showTripForm = {};
			vm.showTripForm.showVehicle = bool;
			vm.showTripForm.showAdvanceDate = bool;
			vm.showTripForm.showTripSearchBtn = bool;
			vm.showTripForm.showTripTable = bool;
		}

		for (let i in vm.showTripForm)
			if (vm.showTripForm.hasOwnProperty(i) && vm.showTripForm[i]) {
				vm.showTripForm.toShow = true;
				break;
			}

		if (otherData.advanceCategory === "other") {
			vm.showCategory = true;
			vm.showAdvanceType = false;
			vm.oAdvance.advanceType = "Diesel";
			vm.aCatagory = otherData.aCatagory;
		}

		vm.selectedAdv = otherData.selectedAdv;
		vm.selectedTrip = otherData.selectedTrip || {};
		setAdvType();

		if (vm.modelDetail.type === "add") {
			vm.oAdvance.date = new Date();
			vm.date = vm.oAdvance.date;
			if (vm.selectedTrip && vm.selectedTrip.vehicle_no) {
				vm.oAdvance.vehicle = vm.selectedTrip.vehicle;
				setAccount();
				// if(vm.selectedTrip.ownershipType == "Market")
				// 	vm.oAdvance.narration = narrationService({vehicleNo: vm.selectedTrip.vehicle_no, tripNo: vm.selectedTrip.trip_no, vendor: vm.selectedTrip.vendor && vm.selectedTrip.vendor.name});
			}
		} else if (vm.modelDetail.type === "edit") {
			vm.oAdvance = {
				...vm.selectedAdv,
				branch: vm.selectedAdv.branch && vm.selectedAdv.branch._id,
				diesel_info: vm.selectedAdv.dieseInfo || vm.selectedAdv.diesel_info,
				account_data: {
					from: vm.selectedAdv.from_account,
					to: vm.selectedAdv.to_account,
				},
				from_account_name:
					(vm.selectedAdv.from_account && vm.selectedAdv.from_account.name) ||
					vm.selectedAdv.from_account_name,
				to_account_name:
					(vm.selectedAdv.to_account && vm.selectedAdv.to_account.name) ||
					vm.selectedAdv.to_account_name,
			};

			// vm.oldAmount = angular.copy(vm.oAdvance.amount);
			vm.prevSelectedVehicle =
				vm.selectedAdv.vehicle && vm.selectedAdv.vehicle._id;

			vm.selectedRefNo = {
				bookNo: vm.selectedAdv.reference_no,
				_id: vm.selectedAdv.stationaryId,
			};

			vm.oAdvance.date = vm.oAdvance.date && new Date(vm.oAdvance.date);

			vm.date = vm.oAdvance.date;

			if (vm.oAdvance.grData && vm.oAdvance.grData.length)
				vm.oAdvance.gr = vm.oAdvance.grData[0];

			getSingleBranch();

			if (
				!(otherData.selectedTrip && otherData.selectedTrip._id) &&
				vm.selectedAdv.trip_no
			) {
				getTripFromTripNo(vm.selectedAdv.trip_no);
			} else {
				tableRowClick();
			}
		} else {
			vm.oAdvance.slip = {};
		}
	})();

	/*
	 * Get All Branches List
	 * */

	function clearTrip() {
		vm.aTrip = [];
		vm.selectedTrip = undefined;
		vm.tableApi && vm.tableApi.refresh();
	}
	function onToAcSelect(item) {
		vm.oAdvance.person = item.name;
	}

	function getSingleBranch() {
		let req = {
			_id: vm.oAdvance.branch,
		};

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			vm.oAdvance.branch = data.data[0];
			vm.billBookId = vm.oAdvance.branch.refNoBook
				? vm.oAdvance.branch.refNoBook.map((o) => o.ref)
				: "";
			// if(vm.oAdvance.branch && !vm.aBranch.find( o => o._id === vm.oAdvance.branch))
			// 	vm.aBranch.unshift(vm.oAdvance.branch);
		}
	}

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getRefNo(viewValue) {
		if (!vm.billBookId) {
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}

		return new Promise(function (resolve, reject) {
			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: "Ref No",
				status: "unused",
			};

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getGr(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1,
				};
				tripServices.getAllGRItem(
					req,
					(res) => {
						resolve(res.data.data.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function onRefSelect(item, model, label) {
		vm.selectedRefNo = item;
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (
					vm.selectedTrip &&
					vm.selectedTrip.vendor &&
					vm.selectedTrip.vendor.clientId
				)
					req.cClientId = vm.selectedTrip.vendor.clientId;

				if (vm.aUserBranch && vm.aUserBranch.length) {
					req._ids = [];
					vm.aUserBranch.forEach((obj) => {
						if (obj.write) req._ids.push(obj._id);
					});
					if (!(req._ids && req._ids.length)) {
						return;
					} else {
						req._ids = JSON.stringify(req._ids);
					}
				}

				branchService.getAllBranches(
					req,
					(res) => {
						resolve(res.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function onBranchSelect(item) {
		vm.oAdvance.reference_no = "";
		vm.billBookId = item.refNoBook ? item.refNoBook.map((o) => o.ref) : "";
		getCostCenter();
	}

	function getCostCenter() {
		if (!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if (!vm.oAdvance.advanceType)
			return swal("Error", "Select Advance Type first", "error");

		accountingService.getCostCenter(
			{
				branch: vm.oAdvance.branch._id,
				feature: vm.oAdvance.advanceType,
				projection: { _id: 1, name: 1, category: "$category.name" },
			},
			(res) => {
				vm.oAdvance.ccBranch = res.data[0];
			},
			(res) => console.error(response)
		);
	}

	function getAutoStationaryNo(viewValue) {
		// if (!(vm.billBookId && vm.billBookId.length))
		// 	return swal('warning', 'Ref Book not found on this branch', 'warning');

		if (viewValue != "centrailized" && !vm.oAdvance.branch) {
			swal("Warning", "Please Select Branch", "warning");
			return [];
		}

		if (viewValue != "centrailized" && !(vm.billBookId && vm.billBookId.length))
			return [];

		if (!vm.oAdvance.date) {
			swal("Error", "Advance Date is required", "error");
			return [];
		}

		let req = {
			billBookId: vm.billBookId,
			type: "Ref No",
			auto: true,
			sch: "onBook",
			status: "unused",
		};

		if (viewValue === "centrailized") {
			delete req.billBookId;
			req.centralize = true;
		}

		if (vm.oAdvance.date)
			// req.backDate = backDate;
			req.useDate = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oAdvance.reference_no = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
		}
	}

	function getVname(viewValue) {
		if (viewValue.length < 3) return;

		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}

			Vehicle.getNamePop(
				viewValue,
				["vendor_id", "vendor_id.account"],
				oSuc,
				oFail
			);
		});
	}

	function getAccount(key, aGroup, viewValue) {
		if (viewValue.length < 1) return;

		return new Promise(function (resolve, reject) {
			function onSuccess(response) {
				resolve(response.data.data);
			}

			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			if (!aGroup) return;

			var oFilter = {
				no_of_docs: 10,
				group: aGroup,
			}; // filter to send

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (viewValue) oFilter.name = viewValue;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
		});
	}

	function getAccountAsync(name, aGroup) {
		return new Promise(function (resolve, reject) {
			if (!aGroup) return;

			var oFilter = {
				no_of_docs: 10,
			}; // filter to send

			if (aGroup) oFilter.group = aGroup;

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				oFilter.cClientId = vm.selectedTrip.vendor.clientId;

			if (name) oFilter.name = name;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}
		});
	}

	function getFuelStation(item) {
		if (
			!(
				vm.oAdvance.diesel_info.vendor &&
				vm.oAdvance.diesel_info.vendor.vendorId
			)
		)
			return;
		if (!vm.oAdvance.date) {
			swal("error", "Plz select Allocation Date", "error");
			return;
		}

		function successGetStation(response) {
			if (!response.data || !response.data.data || !response.data.data.length) {
				swal(
					"warning",
					"No Rate Found in This Date Range for this FuelVendor",
					"warning"
				);
				return;
			}

			vm.oAdvance.diesel_info.station = response.data.data[0];
			vm.oAdvance.diesel_info.rate = vm.oAdvance.diesel_info.station.fuel_price;

			$scope.$configs.tripAdv.calLitre
				? setLiter(vm.oAdvance.amount)
				: setAmount(vm.oAdvance.diesel_info.litre);
		}

		function failGetStation(res) {}

		let oFilter = {
			vendorId: item.vendorId,
		};

		if (vm.oAdvance.date)
			oFilter.to = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		vendorFuelService.GetFuelStationObj(
			oFilter,
			successGetStation,
			failGetStation
		);
	}

	function getFuelVendor(viewValue) {
		return new Promise(function (resolve, reject) {
			function success(response) {
				vm.aFuelVendor = response.data;
				resolve(response.data);
			}

			function failure(response) {
				reject([]);
				console.log(response);
			}

			let req = {
				name: viewValue,
				no_of_docs: 10,
			};

			if (
				vm.selectedTrip &&
				vm.selectedTrip.vendor &&
				vm.selectedTrip.vendor.clientId
			)
				req.cClientId = vm.selectedTrip.vendor.clientId;

			vendorFuelService.getVendorFuels(req, success, failure);
		});
	}

	function getTrips(isGetActive) {
		// if(!(vm.vehicle_no && vm.date)){
		// 	swal('warning', "Both Vehicle and Date should be Filled",'warning');
		// 	return;
		// }

		if (!vm.lazyLoad.update(isGetActive)) return;

		let oFilter = prepareFilter();

		tripServices.findByAdvanceDate(oFilter, function (res) {
			if (res && res.data) {
				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
				vm.tableApi && vm.tableApi.refresh();
				tableRowClick();
			}
		});
	}

	function getTripFromTripNo(tripNo) {
		let oFilter = {
			trip_no: tripNo,
			vehicle_no: vm.oAdvance.vehicle_no,
			popolate: {
				vendor: 1,
				"vendor.account": 1,
			},
		};

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, false, res);
				vm.tableApi && vm.tableApi.refresh();
				vm.selectedTrip = res.data[0];
				tableRowClick();
			}
		});
	}

	function prepareFilter(item) {
		let request = {};

		if (vm.oAdvance.vehicle)
			request.vehicle_no = vm.oAdvance.vehicle.vehicle_reg_no;

		if (vm.date)
			request.advanceDate = moment(vm.date, "DD/MM/YYYY").toISOString();

		if (item) request.vendorId = item.vendorId;

		request.no_of_docs = 5;

		return request;
	}

	function advanceDateType() {
		// vm.oAdvance.date =  moment(vm.date, 'DD/MM/YYYY').toISOString();

		if (vm.oAdvance.editable != false)
			vm.oAdvance.date = moment(vm.date, "DD/MM/YYYY").toDate();

		// if (vm.oAdvance.diesel_info.vendor)
		// 	getFuelStation(vm.oAdvance.diesel_info.vendor);

		if (
			vm.oAdvance &&
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.vehicle_reg_no &&
			vm.showTripForm.autoMap
		)
			getTrips();
	}

	function onVehicleSelect($item, $model) {
		setAccount();
		setAdvType();
		clearTrip();
		setContraAcc();
		if (vm.advanceDate && vm.showTripForm.autoMap) getTrips();
		vm.oAdvance.ccVehicle = vm.oAdvance.vehicle.costCenter;
	}

	function setContraAcc() {
		if (
			vm.modelDetail.type == "edit" &&
			vm.oAdvance.voucher &&
			vm.prevSelectedVehicle != vm.oAdvance.vehicle._id
		) {
			vm.oAdvance.internalAccount = vm.dealAcc.advContraAcc;
		}
	}

	function onVendorSelect() {
		// getFuelStation(vm.oAdvance.diesel_info.vendor);
		vm.oAdvance.account_data.from = {};
		setAccount();
		vm.showCategory && setUnsetAccountMasterVendor(vm.oAdvance.category);
	}

	function setAmount(liter) {
		let amt;
		if (
			(amt = Math.round(liter * vm.oAdvance.diesel_info.rate * 100) / 100) >
			$scope.$constants.advanceAmount
		) {
			swal("warning", "Amount Can't be grater than 2 Lakh", "warning");
			return;
		}
		vm.oAdvance.amount = amt;
	}

	function setAmountRate(rate) {
		if (rate > 100) {
			swal("warning", "Rate can't be that high", "warning");
		} else if (rate < 50) {
			swal("warning", "Rate can't be that low", "warning");
		}

		let amt;
		if (
			(amt = Math.round(rate * vm.oAdvance.diesel_info.litre * 100) / 100) >
			100000
		) {
			swal("warning", "Amount Can't be grater than 1 Lakh", "warning");
			return;
		}

		vm.oAdvance.amount = amt;
	}
	function setLiter(amt) {
		if (!amt) return;
		vm.oAdvance.diesel_info.litre = amt / vm.oAdvance.diesel_info.rate;
		vm.oAdvance.diesel_info.litre = parseFloat(
			vm.oAdvance.diesel_info.litre.toFixed(2)
		);
		if (
			(amt =
				Math.round(
					vm.oAdvance.diesel_info.liter * vm.oAdvance.diesel_info.rate * 100
				) / 100) > $scope.$constants.advanceAmount
		) {
			swal("warning", "Amount Can't be grater than 2 Lakh", "warning");
			return;
		}
	}

	function setLiterRate(rate) {
		if (rate > 100) {
			swal("warning", "Rate can't be that high", "warning");
		} else if (rate < 50) {
			swal("warning", "Rate can't be that low", "warning");
		}

		let amt;
		if (
			(amt = Math.round(rate * vm.oAdvance.diesel_info.litre * 100) / 100) >
			100000
		) {
			swal("warning", "Amount Can't be grater than 1 Lakh", "warning");
			return;
		}

		// vm.oAdvance.amount = amt;
		vm.oAdvance.diesel_info.litre = vm.oAdvance.amount / rate;
		vm.oAdvance.diesel_info.litre = parseFloat(
			vm.oAdvance.diesel_info.litre.toFixed(2)
		);
	}

	function setUnsetAccountMasterVendor(type) {
		onAdvanceTypeChange(type);

		vm.oAdvance.account_data = vm.oAdvance.account_data || {};

		if (!type) {
			vm.oAdvance.account_data = {};
			return;
		}

		let index;

		try {
			if (vm.oAdvance.vehicle.ownershipType == "Market") index = 1;
			else index = 0;
		} catch (e) {
			index = 0;
		}

		vm.aToAccount = [];
		vm.aFromAccount = [];

		let expenseTypeConfig = (vm.aCatagory || vm.aAdvanceType).find(
			(o) => o.name === type
		);
		if (!expenseTypeConfig) {
			swal("", "Account config not found!", "error");
			return;
		}

		if (
			!Array.isArray(expenseTypeConfig.a1) &&
			expenseTypeConfig.a1 &&
			expenseTypeConfig.a1.substr(0, 1) === "$"
		) {
			if (!vm.accounts[expenseTypeConfig.a1]) {
				// swal('Error', expenseTypeConfig.a1.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aFromAccount.push(vm.accounts[expenseTypeConfig.a1]);
			vm.oAdvance.account_data.from =
				vm.accounts[expenseTypeConfig.a1] &&
				vm.accounts[expenseTypeConfig.a1]._id
					? vm.accounts[expenseTypeConfig.a1]
					: undefined;
			vm.aFromGroup = [];
		} else {
			vm.aFromGroup = Array.isArray(expenseTypeConfig.a1)
				? expenseTypeConfig.a1
				: [expenseTypeConfig.a1];
			// getAccount('aFromAccount', vm.aFromGroup = Array.isArray(expenseTypeConfig.a1) ? expenseTypeConfig.a1 : [expenseTypeConfig.a1]);
		}

		// let key = 'a2';
		let key =
			vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType === "Associate"
				? "a3"
				: "a2";
		if (
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.ownershipType === "Associate" &&
			!expenseTypeConfig[key]
		) {
			vm.aToGroup = [];
			key = "a2";
		}

		let expConfigA2 = Array.isArray(expenseTypeConfig[key])
			? expenseTypeConfig[key][index]
			: expenseTypeConfig[key];

		if (expConfigA2 && expConfigA2.substr(0, 1) === "$") {
			if (!vm.accounts[expConfigA2]) {
				// swal('Error', expConfigA2.substr(1) + ' account not found.', 'error');
				return;
			}
			vm.aToAccount.push(vm.accounts[expConfigA2]);
			vm.oAdvance.account_data.to =
				vm.accounts[expConfigA2] && vm.accounts[expConfigA2]._id
					? vm.accounts[expConfigA2]
					: undefined;
			vm.aToGroup = [];
			vm.oAdvance.person = vm.oAdvance.account_data.to.name;
			if (
				$scope.$configs &&
				$scope.$configs.tripAdv &&
				$scope.$configs.tripAdv.driverDetails
			) {
				if (
					vm.selectedTrip &&
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.name
				)
					vm.oAdvance.person = vm.selectedTrip.driver.name;
				else {
					vm.oAdvance.person =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.name) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_name);
					vm.oAdvance.driverCode =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.employee_code) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_employee_code);
				}
			}
		} else {
			// vm.aToGroup = [expConfigA2];
			vm.aToGroup = Array.isArray(expenseTypeConfig.a2)
				? expenseTypeConfig.a2
				: [expenseTypeConfig.a2];
			// getAccount('aToAccount', vm.aToGroup = [expConfigA2]);
		}
	}

	function submit(formData) {
		if (vm.disableButton) {
			return;
		}
		vm.oAdvance.amount = vm.oAdvance.amount || 0;
		vm.oAdvance.status = "Diesel Request";
		if (
			!(vm.selectedTrip && vm.selectedTrip._id) &&
			$scope.$configs.tripAdv.tripSusnotAllow
		) {
			swal("Error", "Trip Suspence not Allowed", "error");
			return;
		}

		// if (vm.oAdvance.advanceType == 'Diesel' && !vm.oAdvance.diesel_info.rate) {
		// 	swal('Error', 'No Rate Selected', 'error');
		// 	return;
		// }

		if (vm.oAdvance.date)
			vm.oAdvance.date = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

		if (
			formData.$valid &&
			vm.oAdvance.account_data.from._id &&
			vm.oAdvance.account_data.to._id
		) {
			if (vm.oAdvance.advanceType === "Diesel" && vm.showInEdit) {
				let diesel_info =
					vm.selectedAdv.diesel_info || vm.selectedAdv.dieseInfo;
				// if (vm.oAdvance.diesel_info.litre !== diesel_info.litre) {
				// 	swal('Error', 'Liter cannot be modified', 'error');
				// 	return;
				// }
			}
			if (
				vm.oAdvance.advanceType === "Diesel" &&
				vm.oAdvance.amount > $scope.$constants.maxAdvanceDieselAmount
			)
				return swal(
					"Error",
					`Limit boundation amount cannot be greater than ${$scope.$constants.maxAdvanceDieselAmount}`,
					"error"
				);

			vm.selectedTrip = vm.selectedTrip || {};
			let vehicle =
				(vm.selectedTrip && vm.selectedTrip.vehicle) || vm.oAdvance.vehicle;

			if (vm.mandatory.vehicle && !vehicle) {
				swal("Error", "Please Provide Vehicle", "error");
				return;
			}

			let request = {
				oAdvance: {
					...vm.oAdvance,
					account_data: {
						from: vm.oAdvance.account_data.from._id,
						to: vm.oAdvance.account_data.to._id,
					},
				},
				_id: vm.selectedTrip._id,
			};

			if (request.oAdvance.internalAccount)
				request.oAdvance.internalAccount = request.oAdvance.internalAccount._id;

			if (
				request.oAdvance.to_account ||
				(request.oAdvance.account_data && request.oAdvance.account_data.to)
			)
				request.oAdvance.to_account = request.oAdvance.account_data.to;

			if (
				request.oAdvance.from_account ||
				(request.oAdvance.account_data && request.oAdvance.account_data.from)
			)
				request.oAdvance.from_account = request.oAdvance.account_data.from;

			if (vehicle) {
				request.oAdvance.vehicle = vehicle._id;
				request.oAdvance.vehicle_no = vehicle.vehicle_reg_no;
			}

			if (vm.oAdvance.branch) request.oAdvance.branch = vm.oAdvance.branch._id;

			if (
				$scope.$configs.costCenter &&
				$scope.$configs.costCenter.show &&
				!vm.oAdvance.ccBranch
			)
				return swal(
					"Error",
					vm.oAdvance.advanceType + " Cost Center not Found",
					"error"
				);

			if (
				$scope.$configs.costCenter &&
				$scope.$configs.costCenter.show &&
				!vm.oAdvance.ccVehicle
			)
				return swal("Error", "Cost Center not linked on vehicle", "error");

			if (vm.oAdvance.gr) {
				request.oAdvance.gr = [vm.oAdvance.gr._id];
				request.oAdvance.grData = [
					{
						_id: vm.oAdvance.gr._id,
						grNumber: vm.oAdvance.gr.grNumber,
					},
				];
			}

			if (vm.selectedTrip.vendor && vm.selectedTrip.vendor._id)
				request.oAdvance.vendor = vm.selectedTrip.vendor._id;

			if (vm.selectedTrip.driver && vm.selectedTrip.driver._id)
				request.oAdvance.driver = vm.selectedTrip.driver._id;

			if (vm.oAdvance.advanceType === "Driver Cash")
				request.oAdvance.narration =
					"Being Cash Paid; " +
					narrationService({
						vehicleNo: vehicle && vehicle.vehicle_reg_no,
						tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
					});
			if (
				vm.oAdvance.advanceType === "Happay" ||
				vm.oAdvance.advanceType === "Fastag"
			)
				request.oAdvance.narration = narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
					tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
				});

			if (vm.oAdvance.advanceType === "Diesel") {
				request.oAdvance.narration =
					vm.oAdvance.diesel_info.litre +
					" lit@ " +
					vm.oAdvance.diesel_info.rate;
				let foundVeh = narrationService({
					vehicleNo: vehicle && vehicle.vehicle_reg_no,
				});
				if (foundVeh)
					request.oAdvance.narration =
						request.oAdvance.narration + "; " + foundVeh;
				request.oAdvance.diesel_info = {
					...vm.oAdvance.diesel_info,
					// station: vm.oAdvance.diesel_info.station._id,
					vendor: vm.oAdvance.diesel_info.vendor._id,
					_vendorName:
						vm.oAdvance.diesel_info.vendor.name ||
						vm.oAdvance.diesel_info._vendorName,
				};
			} else {
				delete request.oAdvance.diesel_info;
			}

			// request.oAdvance.narration = vm.oAdvance.remark ? (request.oAdvance.narration + ';  ' +  vm.oAdvance.remark) : request.oAdvance.narration;

			if (
				vm.selectedRefNo &&
				vm.selectedRefNo.bookNo === vm.oAdvance.reference_no
			)
				request.oAdvance.stationaryId = vm.selectedRefNo._id;
			else delete request.oAdvance.stationaryId;

			let reqStationary = false;
			if ($scope.$configs.tripAdv && $scope.$configs.tripAdv.advType)
				reqStationary =
					$scope.$configs.tripAdv.advType.indexOf(vm.oAdvance.advanceType) !=
					-1;

			if (
				reqStationary &&
				$scope.$configs.tripAdv &&
				$scope.$configs.tripAdv.branch
			)
				reqStationary = !(
					$scope.$configs.tripAdv.branch.indexOf(
						vm.oAdvance.branch && vm.oAdvance.branch.name
					) != -1
				);

			if (reqStationary) {
				if (!request.oAdvance.stationaryId)
					return swal("", "Invalid Selected Ref No", "error");
			}

			vm.disableButton = true;
			callback(request)
				.then(function (res) {
					if (vm.dataPreserve && vm.showInAdd) {
						vm.disableButton = false;
						preserveData();
					} else {
						$uibModalInstance.close(res);
					}
				})
				.catch(function (err) {
					vm.disableButton = false;
					console.log(err);
				});
		} else {
			console.log(formData.required);
			swal("", "All Mandatory Field are not Filled", "error");
		}
	}

	function submitRemark(formData) {
		// if (selectedAdv.trip) {
		// 	let oFilter = {
		// 		_id: selectedAdv.trip,
		// 		'advSettled.isCompletelySettled': false
		// 	};

		// pr = new Promise(function (resolve, reject) {
		// 	tripServices.getAllTripsWithPagination(oFilter, success);

		if (formData.$valid && vm.oAdvance && vm.selectedAdv._id) {
			vm.selectedAdv.deleteRemark = vm.oAdvance.deleteRemark;

			let request = {
				oAdvance: {
					...vm.selectedAdv,
				},
				// _id: vm.selectedTrip._id
			};

			callback(request)
				.then(function (res) {
					$uibModalInstance.close(res);
				})
				.catch(function (err) {
					console.log(err);
				});
		} else {
			console.log(formData.required);
			swal("", "Please Fill Remark", "error");
		}
	}

	function preserveData() {
		vm.disableButton = false;
		vm.oAdvance.reference_no = undefined;
		vm.oAdvance.bill_no = undefined;
		vm.oAdvance.amount = 0;
		if (vm.oAdvance.diesel_info.litre) vm.oAdvance.diesel_info.litre = 0;
	}

	function tableRowClick() {
		if (vm.selectedTrip.length) {
			vm.selectedTrip = vm.selectedTrip[0];
		}
		setAccount();
		setAdvType();
		vm.showInAdd && (vm.oAdvance.advanceType = null);
		vm.showInAdd && setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function generateRemark() {
		vm.oAdvance.narration =
			vm.oAdvance.diesel_info.litre + " lit@ " + vm.oAdvance.diesel_info.rate;
	}

	function setAccount() {
		vm.accounts = {
			$vendor: false,
			$driver: false,
			$vehicle:
				/*vm.oAdvance.account_data.to |`| */ (vm.oAdvance.vehicle &&
					vm.oAdvance.vehicle.account) ||
				false,
			$vehicleVendor:
				/*vm.oAdvance.account_data.to || */ (vm.oAdvance.vehicle &&
					vm.oAdvance.vehicle.vendor_id &&
					vm.oAdvance.vehicle.vendor_id.account) ||
				false,
			$fvendor: {},
			$happayAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.hpAcc) || {},
			$fastagAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.ftAcc) ||
				($scope.$configs &&
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.accounts &&
					$scope.$configs.tripAdv.accounts.ftAcc) ||
				{},
			$dieselAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.dlAcc) || {},
			$driverCAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.drAcc) || {},
			$chalanAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.chAcc) || {},
			$shortageAcc:
				($scope.$configs.costCenter && $scope.$configs.costCenter.stAcc) || {},
		};

		if (vm.selectedTrip && vm.selectedTrip.vendor)
			vm.accounts.$vendor = {
				_id:
					vm.selectedTrip.vendorDeal.lorryAc &&
					vm.selectedTrip.vendorDeal.lorryAc.id,
				name:
					vm.selectedTrip.vendorDeal.lorryAc &&
					vm.selectedTrip.vendorDeal.lorryAc.name,
			}; //vm.selectedTrip.vendor.account || false;

		if (vm.selectedTrip && vm.selectedTrip.driver)
			vm.accounts.$driver = {
				_id:
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.account &&
					vm.selectedTrip.driver.account._id,
				name:
					vm.selectedTrip.driver &&
					vm.selectedTrip.driver.account &&
					vm.selectedTrip.driver.account.name,
			}; //vm.selectedTrip.driver.account || false;

		if (
			vm.oAdvance.diesel_info &&
			vm.oAdvance.diesel_info.vendor &&
			vm.oAdvance.diesel_info.vendor.account &&
			vm.oAdvance.diesel_info.vendor.account._id
		)
			vm.accounts.$fvendor = vm.oAdvance.diesel_info.vendor.account;
		else if (
			vm.oAdvance.diesel_info &&
			vm.oAdvance.diesel_info.vendor &&
			vm.oAdvance.diesel_info.vendor.account
		)
			vm.accounts.$fvendor = vm.oAdvance.account_data.from;

		if (
			vm.oAdvance.advanceType &&
			vm.oAdvance.vehicle &&
			vm.oAdvance.vehicle.ownershipType
		)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
		else if (vm.showCategory && vm.oAdvance.category)
			setUnsetAccountMasterVendor(vm.oAdvance.category);
		else if (vm.oAdvance.advanceType && vm.showInEdit)
			setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
	}

	function validateAmount(amt) {
		if (Number(amt) > $scope.$constants.advanceAmount) {
			swal("Warning", "Amount Should Be Less Than 2 Lakh", "warning");
			vm.oAdvance.amount = 200000;
			return;
		}
	}

	function setAdvType() {
		let ownerShipType;
		if (vm.selectedTrip)
			ownerShipType =
				vm.selectedTrip.ownershipType ||
				(vm.selectedTrip.vehicle && vm.selectedTrip.vehicle.ownershipType);

		if (!ownerShipType)
			ownerShipType = vm.oAdvance.vehicle && vm.oAdvance.vehicle.ownershipType;

		vm.aAdvanceType = (
			$scope.$configs.master.expenseObj ||
			$scope.$constants.expenseObj ||
			[]
		).filter((o) => {
			let bool =
				o.c === "n" &&
				(ownerShipType === "Market"
					? true
					: !(o.name.toString().indexOf("Vendor") + 1));
			return bool;
		});
	}

	function onAdvanceTypeChange(type) {
		let adv = vm.aAdvanceType.find((o) => o.name == type);
		if (adv) vm.showGr = !!adv.gr;
	}
}

materialAdmin.controller(
	"multiAdvanceUpsertController",
	function (
		$scope,
		$timeout,
		$uibModalInstance,
		accountingService,
		branchService,
		callback,
		DatePicker,
		lazyLoadFactory,
		modelDetail,
		otherData,
		billBookService,
		tripServices,
		Vehicle,
		narrationService,
		vendorFuelService
	) {
		let vm = this;

		vm.closeModal = closeModal;
		vm.clearTrip = clearTrip;
		vm.getAccount = getAccount;
		vm.getAccountAsync = getAccountAsync;
		vm.getFuelStation = getFuelStation;
		vm.getFuelVendor = getFuelVendor;
		vm.getTrips = getTrips;
		vm.getVname = getVname;
		vm.preserveData = preserveData;
		vm.onVehicleSelect = onVehicleSelect;
		vm.setContraAcc = setContraAcc;
		vm.setUnsetAccountMasterVendor = setUnsetAccountMasterVendor;
		vm.setAccount = setAccount;
		vm.setAmount = setAmount;
		vm.generateRemark = generateRemark;
		vm.setAmountRate = setAmountRate;
		vm.getSingleBranch = getSingleBranch;
		vm.tableRowClick = tableRowClick;
		vm.validateAmount = validateAmount;
		vm.advanceDateType = advanceDateType;
		vm.getAutoStationaryNo = getAutoStationaryNo;
		vm.onBranchSelect = onBranchSelect;
		vm.getCostCenter = getCostCenter;
		vm.onVendorSelect = onVendorSelect;
		vm.getAllBranch = getAllBranch;
		vm.onRefSelect = onRefSelect;
		vm.getRefNo = getRefNo;
		vm.usedUnusedRefNo = usedUnusedRefNo;
		vm.addAdvance = addAdvance;
		vm.editAdvance = editAdvance;
		vm.removeAdvance = removeAdvance;
		vm.softReset = softReset;
		vm.stopEvent = stopEvent;
		vm.onToAcSelect = onToAcSelect;
		vm.submitForm = submitForm;
		vm.submit = submit;

		// init
		(function init() {
			vm.aAdvance = [];
			vm.allocationDate = new Date();
			vm.aUserBranch =
				($scope.$configs.branchAccessCtl && $scope.$user.branch) || [];
			vm.oAdvance = {
				account_data: {
					// from: {},
					// to: {}
				},
				diesel_info: {
					// 	vendor: {}
				},
			};
			vm.DatePicker = angular.copy(DatePicker);
			vm.dealAcc = $scope.$configs.client_allowed.filter(
				(o) => o.clientId === $scope.selectedClient
			)[0];
			vm.columnSetting = {
				allowedColumn: [
					"Trip No",
					"Gr No",
					"Vehicle No",
					"Route",
					"Driver Name",
					"Trip Allocation",
					"Trip Started",
					"Trip Ended",
					"Trip Status",
				],
			};
			vm.tableHead = [
				{
					header: "Trip No",
					bindingKeys: "trip_no",
				},
				/*{
				'header': 'Gr No',
				'filter': {
					'name': 'arrayOfGrToString',
					'aParam': [
						'gr',
					]
				}
			},*/
				{
					header: "Vehicle No",
					bindingKeys: "vehicle_no",
					date: false,
				},
				{
					header: "Route",
					bindingKeys: "route_name",
				},
				{
					header: "Driver Name",
					bindingKeys: "driver.name",
				},
				{
					header: "Trip Allocation",
					bindingKeys: "allocation_date",
					date: true,
				},
				{
					header: "Trip Started",
					bindingKeys: "statuses[1].date" || "NA",
				},
				{
					header: "Trip Ended",
					bindingKeys: "statuses[2].date" || "NA",
				},
				{
					header: "Trip Status",
					bindingKeys: "status",
				},
			];

			vm.advColumnSetting = {
				allowedColumn: [
					"ADVANCE TYPE",
					"Ref No",
					"PERSON",
					"AMOUNT",
					"Credit Ac",
					"Debit Ac",
					"Branch",
					"TOTAL DIESEL(LIT.)",
					"DIESEL RATE",
					"Bill No",
					"Vendor",
					"Remark",
				],
			};
			vm.advTableHead = [
				{
					header: "ADVANCE TYPE",
					bindingKeys: "advanceType",
				},
				{
					header: "PERSON",
					bindingKeys: "person",
				},
				{
					header: "Ref No",
					bindingKeys: "reference_no",
					date: false,
				},
				{
					header: "DATE",
					bindingKeys: "date",
					date: "dd-MMM-yyyy",
				},
				{
					header: "AMOUNT",
					bindingKeys: "amount.toFixed(2)",
				},
				{
					header: "Credit Ac",
					bindingKeys: "account_data.from.name",
				},
				{
					header: "Debit Ac",
					bindingKeys: "account_data.to.name",
				},
				{
					header: "Branch",
					bindingKeys: "branch.name",
				},
				{
					header: "TOTAL DIESEL(LIT.)",
					bindingKeys: "(dieseInfo.litre || diesel_info.litre).toFixed(2)",
				},
				{
					header: "DIESEL RATE",
					bindingKeys: "(dieseInfo.rate || diesel_info.rate).toFixed(2)",
				},
				{
					header: "Bill No",
					bindingKeys: "bill_no",
					date: false,
				},
				{
					header: "Vendor",
					bindingKeys: "dieseInfo.vendor.name",
				},
				{
					header: "Remark",
					bindingKeys: "remark || narration",
				},
			];

			vm.aTrip = [];
			vm.lazyLoad = lazyLoadFactory();
			vm.showAdvanceType = true;
			vm.showCategory = false;
			vm.modelDetail = modelDetail;
			vm.showInAdd = modelDetail.type === "add";
			vm.showInEdit = modelDetail.type === "edit";
			vm.showTripForm =
				typeof modelDetail.showTripForm == "undefined"
					? true
					: modelDetail.showTripForm;
			vm.accounts = {};
			vm.mandatory = {
				vehicle: true,
				...modelDetail.mandatory,
			};
			if (
				$scope.$configs &&
				$scope.$configs.tripAdv &&
				$scope.$configs.tripAdv.driverDetails
			) {
				vm.driverLable = "Driver Name";
			}

			if (typeof vm.showTripForm == "object") {
				vm.showTripForm = {
					showVehicle: true,
					showAdvanceDate: true,
					showTripSearchBtn: true,
					showTripTable: true,
					...vm.showTripForm,
				};
			} else if (typeof vm.showTripForm == "boolean") {
				let bool = !!vm.showTripForm;
				vm.showTripForm = {};
				vm.showTripForm.showVehicle = bool;
				vm.showTripForm.showAdvanceDate = bool;
				vm.showTripForm.showTripSearchBtn = bool;
				vm.showTripForm.showTripTable = bool;
			}

			for (let i in vm.showTripForm)
				if (vm.showTripForm.hasOwnProperty(i) && vm.showTripForm[i]) {
					vm.showTripForm.toShow = true;
					break;
				}

			if (otherData.advanceCategory === "other") {
				vm.showCategory = true;
				vm.showAdvanceType = false;
				vm.oAdvance.advanceType = "Diesel";
				vm.aCatagory = otherData.aCatagory;
			}

			getAdv();
		})();

		//Actual Function
		function getAdv() {
			vm.selectedAdv = otherData.selectedAdv;
			vm.selectedTrip = otherData.selectedTrip || {};
			setAdvType();

			if (vm.modelDetail.type === "add") {
				vm.oAdvance.date = new Date();
				vm.date = vm.oAdvance.date;
				if (vm.selectedTrip && vm.selectedTrip.vehicle_no) {
					vm.oAdvance.vehicle = vm.selectedTrip.vehicle;
					setAccount();
					// if(vm.selectedTrip.ownershipType == "Market")
					// 	vm.oAdvance.narration = narrationService({vehicleNo: vm.selectedTrip.vehicle_no, tripNo: vm.selectedTrip.trip_no, vendor: vm.selectedTrip.vendor && vm.selectedTrip.vendor.name});
				}
			} else if (vm.modelDetail.type === "edit") {
				vm.oAdvance = {
					...vm.selectedAdv,
					branch: vm.selectedAdv.branch && vm.selectedAdv.branch._id,
					diesel_info: vm.selectedAdv.dieseInfo || vm.selectedAdv.diesel_info,
					ccVehicle: vm.selectedAdv.ccVehicle,
					account_data: {
						from: vm.selectedAdv.from_account,
						to: vm.selectedAdv.to_account,
					},
				};

				// vm.oldAmount = angular.copy(vm.oAdvance.amount);
				vm.prevSelectedVehicle =
					vm.selectedAdv.vehicle && vm.selectedAdv.vehicle._id;

				vm.selectedRefNo = {
					bookNo: vm.selectedAdv.reference_no,
					_id: vm.selectedAdv.stationaryId,
				};

				vm.oAdvance.date = vm.oAdvance.date && new Date(vm.oAdvance.date);

				vm.date = vm.oAdvance.date;

				getSingleBranch();

				if (
					!(otherData.selectedTrip && otherData.selectedTrip._id) &&
					vm.selectedAdv.trip_no
				) {
					getTripFromTripNo(vm.selectedAdv.trip_no);
				} else {
					tableRowClick();
				}

				tripServices.tripAdvances(
					{
						reference_no: vm.selectedAdv.reference_no,
						no_of_docs: 500,
					},
					(res) => {
						if (res && res.data) {
							res = res.data;
							res.data.forEach((o) => {
								if (o.voucher) {
									swal("Error", "Advances Imported to A/c", "error");
									closeModal();
								}

								if (o.purchaseBill) {
									swal("Error", "Purchase bill generated", "error");
									closeModal();
								}

								o.branch = o.branch && o.branch._id;
								o.diesel_info = o.dieseInfo || o.diesel_info;
								o.account_data = {
									from: o.from_account,
									to: o.to_account,
								};

								o.date = o.date && new Date(o.date);
							});

							vm.aAdvance = res.data;
							vm.advTableApi.refresh();
							setAdvType();
						}
					}
				);

				softReset();
			} else {
				vm.oAdvance.slip = {};
			}
		}

		function clearTrip() {
			vm.aTrip = [];
			vm.selectedTrip = undefined;
			vm.tableApi && vm.tableApi.refresh();
		}

		function onToAcSelect(item) {
			vm.oAdvance.person = item.name;
		}

		function getSingleBranch() {
			let req = {
				_id: vm.oAdvance.branch,
			};

			branchService.getAllBranches(req, success);

			function success(data) {
				vm.aBranch = data.data;
				vm.oAdvance.branch = data.data[0];
				vm.billBookId = vm.oAdvance.branch.refNoBook
					? vm.oAdvance.branch.refNoBook.map((o) => o.ref)
					: "";
				// if(vm.oAdvance.branch && !vm.aBranch.find( o => o._id === vm.oAdvance.branch))
				// 	vm.aBranch.unshift(vm.oAdvance.branch);
			}
		}

		function stopEvent($event) {
			$event.stopPropagation();
		}

		function submitForm($event) {
			$timeout(() => {
				angular.element("#submitForm").triggerHandler("submit");
			});
		}

		function addAdvance(formData) {
			if (!formData.$valid)
				return swal("", "All Mandatory Field are not Filled", "error");

			vm.aAdvance.push(vm.oAdvance);
			softReset();
			vm.advTableApi.refresh();
			usedUnusedRefNo();
		}

		function editAdvance() {
			// removeAdvance();
			vm.oAdvance = vm.selectedAdvance;
			vm.aToAccount = [vm.oAdvance.account_data.to];
			vm.aFromAccount = [vm.oAdvance.account_data.from];
		}

		function removeAdvance() {
			let fdIndex = vm.aAdvance.findIndex(
				(o) => o.reference_no === vm.selectedAdvance.reference_no
			);
			if (fdIndex != -1) vm.aAdvance.splice(fdIndex, 1);
			// softReset();
			usedUnusedRefNo();
		}

		function softReset() {
			vm.oAdvance = {
				vehicle: angular.copy(vm.oAdvance.vehicle),
				branch: angular.copy(vm.oAdvance.branch),
				date: angular.copy(vm.oAdvance.date),
				// reference_no: angular.copy(vm.oAdvance.reference_no),
				ccVehicle: angular.copy(vm.oAdvance.ccVehicle),
			};
			setAdvType();
		}

		function closeModal() {
			$uibModalInstance.dismiss();
		}

		function getRefNo(viewValue) {
			if (!vm.billBookId) {
				// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
				return;
			}

			return new Promise(function (resolve, reject) {
				let requestObj = {
					bookNo: viewValue,
					billBookId: vm.billBookId,
					type: "Ref No",
					status: "unused",
				};
				if (vm.usedRef && vm.usedRef.length) requestObj._id = vm.usedRef;

				billBookService.getStationery(requestObj, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}
			});
		}

		function onRefSelect(item, model, label) {
			vm.oAdvance.selectedRefNo = item;
		}

		function usedUnusedRefNo() {
			vm.usedRef = [];
			vm.aAdvance.forEach((obj) => {
				if (obj.selectedRefNo && obj.selectedRefNo._id)
					vm.usedRef.push(obj.selectedRefNo._id);
			});
		}

		function getAllBranch(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
					};
					if (
						vm.selectedTrip &&
						vm.selectedTrip.vendor &&
						vm.selectedTrip.vendor.clientId
					)
						req.cClientId = vm.selectedTrip.vendor.clientId;

					if (vm.aUserBranch && vm.aUserBranch.length) {
						req._ids = [];
						vm.aUserBranch.forEach((obj) => {
							if (obj.write) req._ids.push(obj._id);
						});
						if (!(req._ids && req._ids.length)) {
							return;
						} else {
							req._ids = JSON.stringify(req._ids);
						}
					}

					branchService.getAllBranches(
						req,
						(res) => {
							resolve(res.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function onBranchSelect(item, model, label) {
			vm.oAdvance.reference_no = "";
			vm.billBookId = item.refNoBook ? item.refNoBook.map((o) => o.ref) : "";
			getCostCenter();
		}

		function getCostCenter() {
			if (!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
				return;

			if (
				!(
					vm.oAdvance.branch &&
					vm.oAdvance.branch._id &&
					vm.oAdvance.advanceType
				)
			)
				return;

			accountingService.getCostCenter(
				{
					branch: vm.oAdvance.branch._id,
					feature: vm.oAdvance.advanceType,
					projection: { _id: 1, name: 1, category: "$category.name" },
				},
				(res) => (vm.oAdvance.ccBranch = res.data[0]),
				(res) => console.error(res)
			);
		}

		function getAutoStationaryNo(backDate) {
			if (!(vm.billBookId && vm.billBookId.length))
				return swal("warning", "Ref Book not found on this branch", "warning");

			let req = {
				billBookId: vm.billBookId,
				type: "Ref No",
				auto: true,
				sch: "vch",
				status: "unused",
			};

			if (backDate)
				// req.backDate = backDate;
				req.backDate = moment(backDate, "DD/MM/YYYY").toISOString();

			billBookService.getStationery(req, success);

			function success(response) {
				vm.aAutoStationary = response.data[0];
				vm.oAdvance.reference_no = vm.aAutoStationary.bookNo;
				vm.selectedRefNo = vm.aAutoStationary;
			}
		}

		function getVname(viewValue) {
			if (viewValue.length < 3) return;

			return new Promise(function (resolve, reject) {
				function oSuc(response) {
					resolve(response.data.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}

				Vehicle.getNamePop(
					viewValue,
					["vendor_id", "vendor_id.account"],
					oSuc,
					oFail
				);
			});
		}

		function getAccount(key, aGroup, viewValue) {
			if (viewValue.length < 1) return;

			return new Promise(function (resolve, reject) {
				function onSuccess(response) {
					resolve(response.data.data);
				}

				function onFailure(response) {
					console.log(response);
					reject([]);
				}

				if (!aGroup) return;

				var oFilter = {
					no_of_docs: 10,
					group: aGroup,
				}; // filter to send

				if (
					vm.selectedTrip &&
					vm.selectedTrip.vendor &&
					vm.selectedTrip.vendor.clientId
				)
					oFilter.cClientId = vm.selectedTrip.vendor.clientId;

				if (viewValue) oFilter.name = viewValue;

				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
			});
		}

		function getAccountAsync(name, aGroup) {
			return new Promise(function (resolve, reject) {
				if (!aGroup) return;

				var oFilter = {
					no_of_docs: 10,
				}; // filter to send

				if (aGroup) oFilter.group = aGroup;

				if (
					vm.selectedTrip &&
					vm.selectedTrip.vendor &&
					vm.selectedTrip.vendor.clientId
				)
					oFilter.cClientId = vm.selectedTrip.vendor.clientId;

				if (name) oFilter.name = name;

				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {
					reject([]);
				}

				// Handle success response
				function onSuccess(response) {
					resolve(response.data.data);
				}
			});
		}

		function getFuelStation(item) {
			if (
				!(
					vm.oAdvance.diesel_info.vendor &&
					vm.oAdvance.diesel_info.vendor.vendorId
				)
			)
				return;
			if (!vm.oAdvance.date) {
				swal("error", "Plz select Allocation Date", "error");
				return;
			}

			function successGetStation(response) {
				if (
					!response.data ||
					!response.data.data ||
					!response.data.data.length
				) {
					swal(
						"warning",
						"No Rate Found in This Date Range for this FuelVendor",
						"warning"
					);
					return;
				}

				vm.oAdvance.diesel_info.station = response.data.data[0];
				vm.oAdvance.diesel_info.rate =
					vm.oAdvance.diesel_info.station.fuel_price;
				setAmount(vm.oAdvance.diesel_info.litre);
			}

			function failGetStation(res) {}

			let oFilter = {
				vendorId: item.vendorId,
			};

			if (vm.oAdvance.date)
				oFilter.to = moment(vm.oAdvance.date, "DD/MM/YYYY").toISOString();

			vendorFuelService.GetFuelStationObj(
				oFilter,
				successGetStation,
				failGetStation
			);
		}

		function getFuelVendor(viewValue) {
			return new Promise(function (resolve, reject) {
				function success(response) {
					vm.aFuelVendor = response.data;
					resolve(response.data);
				}

				function failure(response) {
					reject([]);
					console.log(response);
				}

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				if (
					vm.selectedTrip &&
					vm.selectedTrip.vendor &&
					vm.selectedTrip.vendor.clientId
				)
					req.cClientId = vm.selectedTrip.vendor.clientId;

				vendorFuelService.getVendorFuels(req, success, failure);
			});
		}

		// function getFuelVendor(inputModel) {
		// 	function success(response) {
		// 		vm.aFuelVendor = response.data;
		// 		vm.oAdvance.diesel_info.vendor = angular.extend({}, vm.aFuelVendor.find( o => o._id === vm.oAdvance.diesel_info.vendor._id) || {});
		// 	}
		//
		// 	function failure(response) {
		// 		console.log(response);
		// 	}
		//
		// 	let req = {
		// 		no_of_docs: 10
		// 	};
		//
		// 	if(vm.selectedTrip.vendor && vm.selectedTrip.vendor.clientId)
		// 		req.cClientId = vm.selectedTrip.vendor.clientId;
		//
		// 	if (inputModel)
		// 		req.name = inputModel;
		//
		// 	vendorFuelService.getVendorFuels(req, success, failure);
		// }

		function getTrips(isGetActive) {
			// if(!(vm.vehicle_no && vm.date)){
			// 	swal('warning', "Both Vehicle and Date should be Filled",'warning');
			// 	return;
			// }

			if (!vm.lazyLoad.update(isGetActive)) return;

			let oFilter = prepareFilter();

			tripServices.findByAdvanceDate(oFilter, function (res) {
				if (res && res.data) {
					res = res.data;
					vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
					vm.tableApi && vm.tableApi.refresh();
					tableRowClick();
				}
			});
		}

		function getTripFromTripNo(tripNo) {
			let oFilter = {
				trip_no: tripNo,
				vehicle_no: vm.oAdvance.vehicle_no,
				popolate: {
					vendor: 1,
					"vendor.account": 1,
				},
			};

			tripServices.getAllTripsWithPagination(oFilter, function (res) {
				if (res && res.data) {
					res = res.data.data;
					vm.lazyLoad.putArrInScope.call(vm, false, res);
					vm.tableApi && vm.tableApi.refresh();
					vm.selectedTrip = res.data[0];
					tableRowClick();
				}
			});
		}

		function prepareFilter(item) {
			let request = {};

			if (vm.oAdvance.vehicle)
				request.vehicle_no = vm.oAdvance.vehicle.vehicle_reg_no;

			if (vm.date)
				request.advanceDate = moment(vm.date, "DD/MM/YYYY").toISOString();

			if (item) request.vendorId = item.vendorId;

			request.no_of_docs = 5;

			return request;
		}

		function advanceDateType() {
			// vm.oAdvance.date =  moment(vm.date, 'DD/MM/YYYY').toISOString();

			if (vm.oAdvance.editable != false)
				vm.oAdvance.date = moment(vm.date, "DD/MM/YYYY").toDate();

			if (vm.oAdvance.diesel_info.vendor)
				getFuelStation(vm.oAdvance.diesel_info.vendor);

			if (
				vm.oAdvance &&
				vm.oAdvance.vehicle &&
				vm.oAdvance.vehicle.vehicle_reg_no &&
				vm.showTripForm.autoMap
			)
				getTrips();
		}

		function onVehicleSelect($item, $model) {
			setAccount();
			setAdvType();
			clearTrip();
			setContraAcc();
			if (vm.advanceDate && vm.showTripForm.autoMap) getTrips();
			// vm.oAdvance.ccVehicle = vm.oAdvance.vehicle.costCenter;
		}

		function setContraAcc() {
			if (
				vm.modelDetail.type == "edit" &&
				vm.oAdvance.voucher &&
				vm.prevSelectedVehicle != vm.oAdvance.vehicle._id
			) {
				vm.oAdvance.internalAccount = vm.dealAcc.advContraAcc;
			}
		}

		function onVendorSelect() {
			getFuelStation(vm.oAdvance.diesel_info.vendor);
			vm.oAdvance.account_data.from = {};
			setAccount();
			vm.showCategory && setUnsetAccountMasterVendor(vm.oAdvance.category);
		}

		function setAmount(liter) {
			let amt;
			if (
				(amt = Math.round(liter * vm.oAdvance.diesel_info.rate * 100) / 100) >
				$scope.$constants.advanceAmount
			) {
				swal("warning", "Amount Can't be grater than 2 Lakh", "warning");
				return;
			}
			vm.oAdvance.amount = amt;
		}

		function setAmountRate(rate) {
			if (rate > 100) {
				swal("warning", "Rate can't be that high", "warning");
			} else if (rate < 50) {
				swal("warning", "Rate can't be that low", "warning");
			}

			let amt;
			if ((amt = Math.round(vm.oAdvance.amount * 100) / 100) > 100000) {
				swal("warning", "Amount Can't be grater than 1 Lakh", "warning");
				return;
			}

			vm.oAdvance.amount = amt;
		}

		function setUnsetAccountMasterVendor(type) {
			vm.oAdvance.account_data = vm.oAdvance.account_data || {};

			if (!type) {
				vm.oAdvance.account_data = {};
				return;
			}

			let index;

			try {
				if (vm.oAdvance.vehicle.ownershipType == "Market") index = 1;
				else index = 0;
			} catch (e) {
				index = 0;
			}

			vm.aToAccount = [];
			vm.aFromAccount = [];

			let expenseTypeConfig = (vm.aCatagory || vm.aAdvanceType).find(
				(o) => o.name === type
			);
			if (!expenseTypeConfig) {
				swal("", "Account config not found!", "error");
				return;
			}

			if (
				!Array.isArray(expenseTypeConfig.a1) &&
				expenseTypeConfig.a1 &&
				expenseTypeConfig.a1.substr(0, 1) === "$"
			) {
				if (!vm.accounts[expenseTypeConfig.a1]) {
					// swal('Error', expenseTypeConfig.a1.substr(1) + ' account not found.', 'error');
					return;
				}
				vm.aFromAccount.push(vm.accounts[expenseTypeConfig.a1]);
				vm.oAdvance.account_data.from =
					vm.accounts[expenseTypeConfig.a1] &&
					vm.accounts[expenseTypeConfig.a1]._id
						? vm.accounts[expenseTypeConfig.a1]
						: undefined;
				vm.aFromGroup = [];
			} else {
				vm.aFromGroup = Array.isArray(expenseTypeConfig.a1)
					? expenseTypeConfig.a1
					: [expenseTypeConfig.a1];
				// getAccount('aFromAccount', vm.aFromGroup = Array.isArray(expenseTypeConfig.a1) ? expenseTypeConfig.a1 : [expenseTypeConfig.a1]);
			}

			let expConfigA2 = Array.isArray(expenseTypeConfig.a2)
				? expenseTypeConfig.a2[index]
				: expenseTypeConfig.a2;

			if (expConfigA2 && expConfigA2.substr(0, 1) === "$") {
				if (!vm.accounts[expConfigA2]) {
					// swal('Error', expConfigA2.substr(1) + ' account not found.', 'error');
					return;
				}
				vm.aToAccount.push(vm.accounts[expConfigA2]);
				vm.oAdvance.account_data.to =
					vm.accounts[expConfigA2] && vm.accounts[expConfigA2]._id
						? vm.accounts[expConfigA2]
						: undefined;
				vm.aToGroup = [];
				vm.oAdvance.person = vm.oAdvance.account_data.to.name;
				if (
					$scope.$configs &&
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.driverDetails
				) {
					vm.oAdvance.person =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.name) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_name);
					vm.oAdvance.driverCode =
						(vm.aTrip &&
							vm.aTrip.length &&
							vm.aTrip[0].driver &&
							vm.aTrip[0].driver.employee_code) ||
						(vm.oAdvance.vehicle && vm.oAdvance.vehicle.driver_employee_code);
				}
			} else {
				vm.aToGroup = [expConfigA2];
				// getAccount('aToAccount', vm.aToGroup = [expConfigA2]);
			}
		}

		function submit(formData) {
			vm.usedRefNo = [];

			if (!vm.aAdvance.length)
				return swal("Error", "Please add atleast on advance", "error");

			if (!formData.$valid) {
				return swal("", "All Mandatory Field are not Filled", "error");
			}

			if ($scope.$configs.costCenter && $scope.$configs.costCenter.show) {
				if (!vm.oAdvance.ccVehicle)
					return swal("Error", "Cost Center not linked on vehicle", "error");
			}

			let aReqAdv = [];
			let error = false;
			vm.aAdvance.forEach((oAdvance) => {
				oAdvance.vehicle = angular.copy(vm.oAdvance.vehicle);
				vm.usedRefNo = vm.usedRefNo || [];
				if (vm.usedRefNo.indexOf(oAdvance.reference_no) === -1) {
					vm.usedRefNo.push(oAdvance.reference_no);
				} else {
					error = "Dupalicate Ref No:" + oAdvance.reference_no;
				}

				if (
					$scope.$configs.costCenter &&
					$scope.$configs.costCenter.show &&
					!oAdvance.ccBranch
				)
					return swal("Error", "Advance Cost Center not Linked", "error");

				if (oAdvance.advanceType == "Diesel" && !oAdvance.diesel_info.rate) {
					error = "No Rate Selected";
				}

				// if (oAdvance.date)
				// 	oAdvance.date = moment(oAdvance.date, 'DD/MM/YYYY').toISOString();

				// if (oAdvance.advanceType === 'Diesel' && vm.showInEdit) {
				// 	let diesel_info = vm.selectedAdv.diesel_info || vm.selectedAdv.dieseInfo;
				// 	if (oAdvance.diesel_info.litre !== diesel_info.litre && oAdvance.diesel_info.rate !== diesel_info.rate) {
				// 		error = 'Both Rate and Liter cannot be modified';
				// 	}
				// }

				if (
					oAdvance.advanceType === "Diesel" &&
					oAdvance.amount > $scope.$constants.maxAdvanceDieselAmount
				)
					error = `Advance amount cannot be greater than ${$scope.$constants.maxAdvanceDieselAmount}`;

				vm.selectedTrip = vm.selectedTrip || {};
				let vehicle =
					(vm.selectedTrip && vm.selectedTrip.vehicle) || oAdvance.vehicle;

				if (vm.mandatory.vehicle && !vehicle) {
					error = "Please Provide Vehicle";
				}

				let request = {
					...oAdvance,
					vehicle: angular.copy(vm.oAdvance.vehicle._id),
					vehicle_no: angular.copy(vm.oAdvance.vehicle.vehicle_reg_no),
					// branch: angular.copy(oAdvance.branch._id),
					// date: moment(vm.oAdvance.date, 'DD/MM/YYYY').toISOString(),
					// reference_no: angular.copy(vm.oAdvance.reference_no),
					account_data: {
						from: oAdvance.account_data.from._id,
						to: oAdvance.account_data.to._id,
					},
					dieseInfo: oAdvance.diesel_info,
					trip: vm.selectedTrip._id,
					trip_no: vm.selectedTrip.trip_no,
				};

				if (request.selectedRefNo) delete request.selectedRefNo;

				if (request.internalAccount)
					request.internalAccount = request.internalAccount._id;

				if (
					request.to_account ||
					(request.account_data && request.account_data.to)
				)
					request.to_account = request.account_data.to;

				if (
					request.from_account ||
					(request.account_data && request.account_data.from)
				)
					request.from_account = request.account_data.from;

				if (vehicle) {
					request.vehicle = vehicle._id;
					request.vehicle_no = vehicle.vehicle_reg_no;
				}

				if (oAdvance.branch) request.branch = oAdvance.branch._id;

				if (oAdvance.date)
					request.date = moment(request.date, "DD/MM/YYYY").toISOString();

				if (vm.selectedTrip.vendor && vm.selectedTrip.vendor._id)
					request.vendor = vm.selectedTrip.vendor._id;

				if (vm.selectedTrip.driver && vm.selectedTrip.driver._id)
					request.driver = vm.selectedTrip.driver._id;

				if (oAdvance.advanceType === "Driver Cash")
					request.narration =
						"Being Cash Paid; " +
						narrationService({
							vehicleNo: vehicle && vehicle.vehicle_reg_no,
							tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
						});
				if (
					oAdvance.advanceType === "Happay" ||
					oAdvance.advanceType === "Fastag"
				)
					request.narration = narrationService({
						vehicleNo: vehicle && vehicle.vehicle_reg_no,
						tripNo: vm.selectedTrip && vm.selectedTrip.trip_no,
					});

				if (oAdvance.advanceType === "Diesel") {
					request.narration =
						oAdvance.diesel_info.litre + " lit@ " + oAdvance.diesel_info.rate;
					let foundVeh = narrationService({
						vehicleNo: vehicle && vehicle.vehicle_reg_no,
					});
					if (foundVeh) request.narration = request.narration + "; " + foundVeh;

					request.diesel_info = {
						...oAdvance.diesel_info,
						vendor: oAdvance.diesel_info.vendor._id,
					};
				} else {
					delete request.diesel_info;
				}

				// request.narration = oAdvance.remark ? request.narration + '; ' +  oAdvance.remark : request.narration ;

				if (
					oAdvance.selectedRefNo &&
					oAdvance.selectedRefNo.bookNo === oAdvance.reference_no
				)
					request.stationaryId = oAdvance.selectedRefNo._id;
				else delete request.stationaryId;

				let reqStationary = false;
				if ($scope.$configs.tripAdv && $scope.$configs.tripAdv.advType)
					reqStationary =
						$scope.$configs.tripAdv.advType.indexOf(oAdvance.advanceType) != -1;

				if (
					reqStationary &&
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.branch
				)
					reqStationary = !(
						$scope.$configs.tripAdv.branch.indexOf(
							vm.oAdvance.branch && vm.oAdvance.branch.name
						) != -1
					);

				if (reqStationary) {
					if (!request.stationaryId)
						error = "Invalid Selected Ref No: " + oAdvance.reference_no;
				}

				aReqAdv.push(request);
			});

			if (error) return swal("Error", error, "error");

			callback(aReqAdv)
				.then(function (res) {
					if (vm.dataPreserve && vm.showInAdd) {
						preserveData();
					} else {
						$uibModalInstance.close(res);
					}
				})
				.catch(function (err) {
					console.log(err);
				});
		}

		function preserveData() {
			vm.oAdvance.reference_no = undefined;
			vm.oAdvance.bill_no = undefined;
			vm.oAdvance.amount = 0;
			if (vm.oAdvance.diesel_info.litre) vm.oAdvance.diesel_info.litre = 0;
		}

		function tableRowClick() {
			if (vm.selectedTrip.length) {
				vm.selectedTrip = vm.selectedTrip[0];
			}
			setAccount();
			setAdvType();
			vm.showInAdd && (vm.oAdvance.advanceType = null);
			vm.showInAdd && setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
		}

		function generateRemark() {
			vm.oAdvance.narration =
				vm.oAdvance.diesel_info.litre + " lit@ " + vm.oAdvance.diesel_info.rate;
		}

		function setAccount() {
			vm.accounts = {
				$vendor: false,
				$vehicle:
					/*vm.oAdvance.account_data.to || */ (vm.oAdvance.vehicle &&
						vm.oAdvance.vehicle.account) ||
					false,
				$fvendor: {},
				$happayAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.hpAcc) ||
					{},
				$fastagAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.ftAcc) ||
					{},
				$dieselAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.dlAcc) ||
					{},
				$driverCAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.drAcc) ||
					{},
				$chalanAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.chAcc) ||
					{},
				$shortageAcc:
					($scope.$configs.costCenter && $scope.$configs.costCenter.stAcc) ||
					{},
			};

			if (vm.selectedTrip && vm.selectedTrip.vendor)
				vm.accounts.$vendor = {
					_id:
						vm.selectedTrip.vendorDeal.lorryAc &&
						vm.selectedTrip.vendorDeal.lorryAc.id,
					name:
						vm.selectedTrip.vendorDeal.lorryAc &&
						vm.selectedTrip.vendorDeal.lorryAc.name,
				}; //vm.selectedTrip.vendor.account || false;

			if (
				vm.oAdvance.diesel_info &&
				vm.oAdvance.diesel_info.vendor &&
				vm.oAdvance.diesel_info.vendor.account &&
				vm.oAdvance.diesel_info.vendor.account._id
			)
				vm.accounts.$fvendor = vm.oAdvance.diesel_info.vendor.account;
			else if (
				vm.oAdvance.diesel_info &&
				vm.oAdvance.diesel_info.vendor &&
				vm.oAdvance.diesel_info.vendor.account
			)
				vm.accounts.$fvendor = vm.oAdvance.account_data.from;

			if (
				vm.oAdvance.advanceType &&
				vm.oAdvance.vehicle &&
				vm.oAdvance.vehicle.ownershipType
			)
				setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
			else if (vm.showCategory && vm.oAdvance.category)
				setUnsetAccountMasterVendor(vm.oAdvance.category);
			else if (vm.oAdvance.advanceType && vm.showInEdit)
				setUnsetAccountMasterVendor(vm.oAdvance.advanceType);
		}

		function validateAmount(amt) {
			if (Number(amt) > $scope.$constants.advanceAmount) {
				swal("Warning", "Amount Should Be Less Than 2 Lakh", "warning");
				vm.oAdvance.amount = 200000;
				return;
			}
		}

		function setAdvType() {
			let ownerShipType =
				(vm.selectedTrip && vm.selectedTrip.ownershipType) ||
				(vm.selectedTrip.vehicle && vm.selectedTrip.vehicle.ownershipType);

			if (!ownerShipType)
				ownerShipType =
					vm.oAdvance &&
					vm.oAdvance.vehicle &&
					vm.oAdvance.vehicle.ownershipType;

			vm.aAdvanceType = (
				$scope.$configs.master.expenseObj ||
				$scope.$constants.expenseObj ||
				[]
			).filter((o) => {
				return (
					o.c === "n" &&
					(ownerShipType === "Market"
						? true
						: !(o.name.toString().indexOf("Vendor") + 1))
				);
			});
		}
	}
);

function updateVehiclePopUpController(
	$scope,
	$uibModalInstance,
	DatePicker,
	Driver,
	selectedTrip,
	tripServices,
	Vehicle
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.getVname = getVname;

	// init
	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.trip = angular.copy(selectedTrip);
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getVname(viewValue) {
		if (viewValue.length < 3) return;

		return new Promise(function (resolve, reject) {
			let req = {
				vehicle_no: viewValue,
				status: "Available",
			};

			Vehicle.getAllVehicles(req, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function submit() {
		let request = {
			vehNo: vm.vehicle.vehicle_reg_no,
			vehId: vm.vehicle._id,
			rmk: vm.remark,
			_id: vm.trip._id,
		};
		tripServices.updateVeh(request, success, failure);

		function success(res) {
			var msg = res.data.message;
			swal("Update", msg, "success");
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.data.message;
			swal("Error", msg, "error");
			$uibModalInstance.dismiss(res);
		}
	}
}

function transShipmentPopUpController(
	$scope,
	$uibModalInstance,
	DatePicker,
	Driver,
	selectedTrip,
	tripServices,
	Vehicle
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.getVname = getVname;
	vm.getDriver = getDriver;
	vm.onSelect = onSelect;
	vm.onSelectDriver = onSelectDriver;
	var vehicleDriver = {};

	// init
	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.trip = angular.copy(selectedTrip);
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getVname(viewValue) {
		if (viewValue.length < 3) return;

		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		});
	}

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			Driver.getName(
				viewValue,
				(res) => (vm.aDriver = res.data.data),
				(err) => console.log`${err}`
			);
		}
	}

	function onSelect($item, $model, $label) {
		vm.vehicleInfo = $model;
		vm.driver_name = $model.driver_name;
		vehicleDriver.driver_name = $model.driver_name;
		vehicleDriver.driver = $model.driver;
		vehicleDriver.driver_contact_no = $model.driver_contact_no;
		vehicleDriver.driver_employee_code = $model.driver_employee_code;
		vehicleDriver.driver_license = $model.driver_license;
	}

	function onSelectDriver($item, $model, $label) {
		vm.driverInfo = $model;
	}

	function submit() {
		function success(res) {
			var msg = res.data.message;
			swal("Update", msg, "success");
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.data.message;
			growlService.growl(msg, "danger", 2);
			$uibModalInstance.dismiss(res);
		}

		let request = {
			transShipment: {
				vehicle_no: vm.vehicleInfo.vehicle_reg_no,
				vehicle: vm.vehicleInfo._id,
				driver: vm.driverInfo ? vm.driverInfo._id : vehicleDriver.driver,
				driver_name: vm.driverInfo
					? vm.driverInfo.name
					: vehicleDriver.driver_name,
				created_by: vm.trip.created_by,
				date: vm.date,
				remark: vm.remark,
			},
			_id: vm.trip._id,
		};
		tripServices.updateInfo(request, success, failure);
	}
}

function addRemarkPopUpController(
	$scope,
	$uibModalInstance,
	DatePicker,
	selectedTrip,
	tripServices
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;

	// init
	(function init() {
		vm.trip = angular.copy(selectedTrip);
		vm.DatePicker = angular.copy(DatePicker);
		vm.ewayBill_expiry = vm.trip.ewayBill_expiry || vm.trip.ewayBillExpiry;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit() {
		function success(res) {
			var msg = res.data.message;
			swal("Update", msg, "success");
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.data.message;
			growlService.growl(msg, "danger", 2);
			$uibModalInstance.dismiss(res);
		}

		let request = {
			remarks: vm.remark,
			_id: vm.trip._id,
		};
		if (vm.ewayBill_expiry) request.ewayBill_expiry = vm.ewayBill_expiry;
		tripServices.updateInfo(request, success, failure);
	}
}

function addImdPopUpController(
	$scope,
	$rootScope,
	$uibModalInstance,
	DatePicker,
	tripServices,
	cityStateService,
	thatData
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.DatePicker = angular.copy(DatePicker);
	vm.getIntermediatePoint = getIntermediatePoint;
	vm.onSelectIntermediate = onSelectIntermediate;
	vm.addMoreImds = addMoreImds;
	vm.selectedTrip = thatData;
	//init
	(function init() {
		// vm.trip = angular.copy(selectedTrip);
		vm.DatePicker = angular.copy(DatePicker);
		vm.imd = $rootScope.selectedTrip.imd;
		vm.trip = $rootScope.selectedTrip;
		vm.sCode = vm.trip.ld && vm.trip.ld.code;
		vm.dCode = vm.trip.uld && vm.trip.uld.code;
		vm.intermediateRoute = vm.imd;
		if (vm.trip.rName) {
			let route = vm.trip.rName.split(" to ").map((o) => o.trim());
			vm.source = route[0];
			vm.destination = route[1];
		}
	})();

	function addMoreImds() {
		vm.intermediateRoute = vm.intermediateRoute || [];

		vm.intermediateRoute.push({});
	}

	function getIntermediatePoint(viewValue) {
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
	}
	function onSelectIntermediate(item, index) {
		if (vm.intermediateRoute && vm.intermediateRoute.length > 8) {
			return swal(
				"Error",
				"Sorry you cannot add more than 8 intermediate routes",
				"error"
			);
		}
		//   $rootScope.intermediateRoute = vm.intermediateRoute;
		vm.intermediateRoute[index] = item;
	}

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(trip) {
		if (vm.intermediateRoute && vm.intermediateRoute.length > 8) {
			return swal(
				"Error",
				"Sorry you cannot add more than 8 intermediate routes",
				"error"
			);
		}
		function success(res) {
			var msg = res.data.message;
			swal("Update", msg, "success");
			$uibModalInstance.close(res);
		}

		function failure(res) {
			var msg = res.data.message;
			growlService.growl(msg, "danger", 2);
			$uibModalInstance.dismiss(res);
		}

		let request = {
			ld: vm.trip.ld || {},
			uld: vm.trip.uld || {},
			imd: vm.intermediateRoute,
			remark: "Intermediate Point Updated",
			_id: trip._id || vm.selectedTrip._id,
		};

		if (request.ld && request.uld) {
			request.ld.c = vm.source;
			request.uld.c = vm.destination;
			request.ld.code = vm.sCode;
			request.uld.code = vm.dCode;
		}
		tripServices.updateInfo(request, success, failure);
	}
}

materialAdmin.controller(
	"tripSuspenseCtrl",
	function (
		$modal,
		$scope,
		$timeout,
		$uibModal,
		$state,
		accountingService,
		DateUtils,
		DatePicker,
		Driver,
		lazyLoadFactory,
		objToCsv,
		stateDataRetain,
		tripServices,
		commonTableSettingFactory,
		Vendor,
		Vehicle,
		voucherService,
		branchService,
		userService,
		$templateCache
	) {
		let vm = this;

		vm.addMultiAdv = addMultiAdv;
		vm.advanceOper = advanceOper;
		vm.dieselReqAdv = dieselReqAdv;
		vm.multiAdv = multiAdv;
		vm.reverseAdv = reverseAdv;
		vm.shouldHideReverse = shouldHideReverse;
		vm.addOtherExpense = addOtherExpense;
		vm.createVouchers = createVouchers;
		vm.createVouchersCommon = createVouchersCommon;
		vm.getAllTripSus = getAllTripSus;
		vm.getSummary = getSummary;
		vm.getAdvCrDr = getAdvCrDr;
		vm.generateBill = generateBill;
		vm.generateDieselBill = generateDieselBill;
		vm.getVname = getVname;
		vm.getVendorName = getVendorName;
		vm.getDriver = getDriver;
		vm.accountmaster = accountmaster;
		vm.getAllBranch = getAllBranch;
		vm.onSelect = onSelect;
		vm.selectedAdvance = selectedAdvance;
		vm.dateChange = dateChange;
		vm.downloadReport = downloadReport;
		vm.dieselTripReport = dieselTripReport;
		vm.downloadCsv = downloadCsv;
		vm.upload = uploadHandler;
		vm.UnMapAdvance = UnMapAdvance;
		vm.printBill = printBill;
		// this function trigger on state refresh
		$scope.onStateRefresh = function () {
			getAllTripSus();
		};

		// INIT functions
		(function init() {
			vm.isDisabled = false;
			vm.maxEndDate = new Date();
			vm.DatePicker = angular.copy(DatePicker);
			vm.lazyLoad = lazyLoadFactory(); // init lazyload
			vm.commonTableSetting = commonTableSettingFactory;
			vm.aUserBranch =
				($scope.$configs.branchAccessCtl && $scope.$user.branch) || [];
			if (stateDataRetain.init($scope, vm)) return;

			vm.aType = ["On Trip", "In Suspense"];
			vm.aIsSettle = ["Settle", "UnSettle"];
			vm.aBill = ["PurBill Generated", "PurBill not Generated", "All"];
			vm.aAcType = ["Imported", "NotImported", "All"];
			vm.aVoucher = ["Account exported", "Account not exported", "Reversed"];
			vm.oFilter = {};
			vm.showTable = true;
			vm.aTripSuspense = [];
			vm.selectType = "index";

			// assign Pagename and tablename
			vm.pageName = "Booking_Management_TripAdv";
			vm.tableName = "TripAdv";
			// vm.columnSetting = {};
			// vm.tableColumnHead = getTableColumnHead(vm.pageName, vm.tableName);
			let pageName = vm.pageName;
			let tableName = vm.tableName;

			let oFoundTable = $scope.$tableAccess.find(
				(oTable) => oTable.pages === pageName && oTable.table === tableName
			);

			let obj = {};
			// let aTableHead = [];
			let aAllowedColumn = [];
			let tableConf = vm.commonTableSetting;
			let oTableName = tableConf[pageName][tableName]; //obinding
			let visibleCol = oFoundTable
				? oFoundTable.visible
				: tableConf[pageName][tableName + "Column"]; //visible
			let aColumn = oFoundTable
				? oFoundTable.access
				: tableConf[pageName][tableName + "Column"]; //access

			vm.visibleDownload = visibleCol.map((str) => oTableName[str].header);
			vm.oFoundTableId = false;
			if (oFoundTable && oFoundTable._id) vm.oFoundTableId = oFoundTable._id;

			vm.columnSetting = {
				allowedColumn: [],
				visibleColumn: visibleCol.map((str) => oTableName[str].header),
				visibleCb: (columnSetting) => {
					if (!(oFoundTable && oFoundTable._id)) return;

					let currentSetting = columnSetting.visibleColumn;
					let mapTable = tableConf[pageName][tableName + "Column"].reduce(
						(obj, str) => {
							obj[oTableName[str].header] = str;
							return obj;
						},
						{}
					);

					let request = {
						visible: currentSetting.map((str) => mapTable[str]),
						_id: oFoundTable._id,
					};
					userService.updateOneTableConfig(request, successVis, failureVis);

					function successVis(data) {
						if (data && data.data) {
							let d = data.data;
							$scope.$tableAccess.splice(0, $scope.$tableAccess.length);
							for (let i of d) {
								$scope.$tableAccess.push(i);
							}
						}
					}

					function failureVis(res) {
						swal("Error in table column setting", "", "error");
					}
				},
			};
			vm.tableHead = [];

			aColumn.forEach(function (key) {
				//for visible
				vm.columnSetting.allowedColumn.push(oTableName[key].header); //visible access
				vm.tableHead.push(oTableName[key]); //visible obinding
			});
			if (!($scope.$configs.tripAdv && $scope.$configs.tripAdv.showStatusCol))
				delete vm.columnSetting.allowedColumn[19];
			// getAllTripSus();

			// vm.columnSetting.allowedColumn = vm.tableColumnHead.aAllowedColumn;

			// vm.columnSetting = {
			// 	allowedColumn: [
			// 		'TRIP NO.',
			// 		'VEHICLE NO',
			// 		'ADVANCE TYPE',
			// 		'CATEGORY',
			// 		'PERSON',
			// 		'DATE',
			// 		'AMOUNT',
			// 		'Credit Ac',
			// 		'Debit Ac',
			// 		'TOTAL DIESEL(LIT.)',
			// 		'DIESEL RATE',
			// 		'Bill No',
			// 		'Reference No',
			// 		'Driver',
			// 		'`Vendor',
			// 		'Vehicle Owner Name',
			// 		'Branch',
			// 		'No Of Days',
			// 		'Remark',
			// 		'Reversed By',
			// 		'Reversed At',
			// 		'Reversed',
			// 		'Entry By',
			// 		'Entry Date',
			// 		'Modification Date',
			// 	],
			// };

			// vm.tableHead = vm.tableColumnHead.aTableHead;
		})();

		function printBill() {
			$uibModal.open({
				templateUrl: "views/bills/builtyRender.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"tripServices",
					"excelDownload",
					"otherData",
					function (
						$scope,
						$uibModalInstance,
						tripServices,
						excelDownload,
						otherData
					) {
						$scope.showSubmitButton = !!otherData.showSubmitButton;
						$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
						$scope.downloadExcel = downloadExcel;

						$scope.aTemplate = $scope.$configs.Bill.tripAdvBill;
						$scope.templateKey = $scope.aTemplate[0];

						$scope.getGR = function (templateKey = "default_") {
							var oFilter = {
								_id: otherData._id,
								billName: templateKey,
								reference_no: otherData.reference_no,
							};

							tripServices.tripAdvBillPreview(oFilter, success, fail);
						};

						$scope.getGR($scope.templateKey && $scope.templateKey.key);

						function success(res) {
							$scope.html = angular.copy(res.data);
						}

						function fail(res) {
							swal("Error", "Something Went Wrong", "error");
							$scope.closeModal();
						}

						$scope.closeModal = function () {
							$uibModalInstance.dismiss("cancel");
						};

						$scope.submit = function () {
							$uibModalInstance.close(true);
						};

						function downloadExcel(id) {
							excelDownload.html(
								id,
								"sheet 1",
								`${
									($scope.aTemplate[0] && $scope.aTemplate[0].key) || "default"
								}_${moment().format("DD-MM-YYYY")}`
							);
						}
					},
				],
				resolve: {
					otherData: function () {
						return {
							_id: vm.aSelectedTrips[0]._id,
							reference_no: vm.aSelectedTrips[0].reference_no,
						};
					},
				},
			});
		}

		function addMultiAdv(type = "add") {
			let pr = false;

			let selectedAdv;
			if (type != "add") {
				if (Array.isArray(vm.aSelectedTrips)) {
					if (vm.aSelectedTrips.length === 0) {
						return swal("Warning", "Select an Advance", "warning");
					} else if (vm.aSelectedTrips.length > 1) {
						return swal("Warning", "Select Single Advance to edit", "warning");
					} else {
						selectedAdv = vm.aSelectedTrips[0];
					}
				} else if (typeof vm.aSelectedTrips !== "object") {
					return swal("Warning", "Invalid selected type", "warning");
				} else {
					selectedAdv = vm.aSelectedTrips;
				}

				if (!selectedAdv.multiAdv)
					return swal(
						"Warning",
						"Please use Single Advance feature",
						"warning"
					);
			}

			if (type === "edit") {
				if (selectedAdv.trip) {
					let oFilter = {
						_id: selectedAdv.trip,
						"advSettled.isCompletelySettled": false,
					};

					pr = new Promise(function (resolve, reject) {
						tripServices.getAllTripsWithPagination(oFilter, success);

						function success(res) {
							if (res.data.data.data.length) {
								vm.markSettle =
									res.data.data.data[0].markSettle &&
									res.data.data.data[0].markSettle.isSettled;
								if (vm.markSettle)
									return swal(
										"Warning",
										"Advance Cannot Be Modified. Trip is Marked Settled",
										"warning"
									);
								resolve();
							} else return swal("Warning", "Advance Cannot Be Modified. Trip Already Settled", "warning");
						}
					});
				}

				if (
					selectedAdv.voucher &&
					!$scope.$role["Trip Advance"]["Edit Vehicle"]
				)
					return swal(
						"Warning",
						"Advance Cannot Be Modified. It is already imported",
						"warning"
					);

				// if (selectedAdv.purchaseBill && !$scope.$role['Trip Advance']['Edit Vehicle'])
				// 	return swal('Warning', 'Advance Cannot Be Modified. Purchase Bill Generated', 'warning');
			}

			if (type === "delete") {
				if (selectedAdv.voucher) {
					swal("Warning", "Advance Cannot Be Deleted.", "warning");
					return;
				}

				selectedAdv.disableStationery = false;

				if (
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.disableStationery
				)
					selectedAdv.disableStationery =
						$scope.$configs.tripAdv.disableStationery;

				swal(
					{
						title: "Are you sure you want to delete this advance?",
						// text: '1. GST Not Registerd',
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true,
						allowOutsideClick: true,
					},
					function (isConfirm) {
						if (isConfirm) {
							tripServices.deleteMultiAdvance(
								{
									reference_no: selectedAdv.reference_no,
									disableStationery: selectedAdv.disableStationery,
								},
								onSuccess,
								onFailure
							);

							function onFailure(err) {
								swal("Error", err.data.message, "error");
							}

							function onSuccess(res) {
								swal("Success", res.data.message, "success");
								getAllTripSus();
							}
						}
					}
				);
				return;
			}

			if (pr instanceof Promise)
				pr.then(openModal).catch(function (err) {
					console.log(err);
				});
			else openModal();

			function openModal() {
				$modal
					.open({
						templateUrl: "views/tripSuspense/advanceUpsert.html",
						controller: [
							"$scope",
							"$timeout",
							"$uibModalInstance",
							"accountingService",
							"branchService",
							"callback",
							"DatePicker",
							"lazyLoadFactory",
							"modelDetail",
							"otherData",
							"billBookService",
							"tripServices",
							"Vehicle",
							"narrationService",
							"vendorFuelService",
							advancePopupUpsertController,
						],
						controllerAs: "vm",
						resolve: {
							callback: function () {
								return function (aAdvances) {
									return new Promise(function (resolve, reject) {
										let request = {
											aAdvances,
										};

										if (type !== "add") {
											request.reference_no = selectedAdv.reference_no;
											tripServices.editMultiAdvance(
												request,
												onSuccess,
												onFailure
											);
										} else {
											tripServices.addMultiAdvance(
												request,
												onSuccess,
												onFailure
											);
										}

										function onFailure(err) {
											swal("Error", err.data.message, "error");
											reject(err.data.message);
										}

										function onSuccess(res) {
											console.log(res);
											swal("Success", res.data.message, "success");
											resolve(res.data.data);
										}
									});
								};
							},
							modelDetail: function () {
								let tripAdvConfig = $scope.$configs.tripAdv || {};
								let config = {
									autoMap: tripAdvConfig.automap || true,
								};
								if (tripAdvConfig.showTripSecOnAdv == false) {
									Object.assign(config, {
										showAdvanceDate: false,
										showTripSearchBtn: false,
										showTripTable: false,
									});
								}
								if (tripAdvConfig.editRate)
									Object.assign(config, {
										editRate: true,
									});

								return {
									type,
									showTripForm: config,
								};
							},
							otherData: function () {
								return {
									selectedAdv: angular.copy(selectedAdv),
								};
							},
						},
					})
					.result.then(
						function (response) {
							console.log("close", response);
							getAllTripSus();
						},
						function (data) {
							console.log("cancel", data);
						}
					);
			}
		}

		// function getTableColumnHead(pageName, tableName) {
		// 	let oFoundTable = $scope.$tableAccess.find(oTable => oTable.pages === pageName && oTable.table === tableName);
		//
		// 	let obj = {};
		// 	// let aTableHead = [];
		// 	let aAllowedColumn = [];
		// 	let tableConf = vm.commonTableSetting;
		// 	let oTableName = tableConf[pageName][tableName];  //obinding
		// 	let visibleColumn = oFoundTable ? oFoundTable.visible :tableConf[pageName][tableName + 'Column']; //access
		// 	let aColumn = oFoundTable ? oFoundTable.access :tableConf[pageName][tableName + 'Column']; //visible
		//
		// 	$scope.visibleDownload = visibleColumn.map(str => oTableName[str].header);
		// 	$scope.oFoundTableId = false;
		// 	if (oFoundTable && oFoundTable._id)
		// 		$scope.oFoundTableId = oFoundTable._id;
		//
		//
		// 	$scope.columnSetting = {
		// 		allowedColumn: [],
		// 		visibleColumn: visibleColumn.map(str => oTableName[str].header),
		// 		visibleCb: (columnSetting) => {
		//
		// 			if (!(oFoundTable && oFoundTable._id))
		// 				return;
		//
		// 			let currentSetting = columnSetting.visibleColumn;
		// 			let mapTable = $scope.tableAccessDetail[pageName][tableName + 'Column'].reduce((obj, str) => {
		// 				obj[oTableName[str].header] = str;
		// 				return obj;
		// 			}, {});
		//
		// 			let request ={
		// 				visible: currentSetting.map(str => mapTable[str]),
		// 				_id: oFoundTable._id
		// 			};
		// 			userService.updateOneTableConfig(request, successVis, failureVis);
		//
		// 			function successVis(data) {
		// 				if (data.data && data.data) {
		// 					let d = data.data;
		// 					$scope.$tableAccess.splice(0, $scope.$tableAccess.length);
		// 					for (let i of d) {
		// 						$scope.$tableAccess.push(i);
		// 					}
		// 				}
		// 			}
		//
		// 			function failureVis(res) {
		// 				swal("Error in table column setting", "", "error");
		// 			}
		//
		// 		}
		// 	}
		// 	$scope.tableHead = [];
		//
		// 	aColumn.forEach(function (key) {    //for visible
		// 		$scope.columnSetting.allowedColumn.push(oTableName[key].header); //visible access
		// 		$scope.tableHead.push(oTableName[key]);  //visible obinding
		// 	});
		//
		// 	obj.aTableHead = $scope.tableHead;
		// 	obj.aAllowedColumn = $scope.columnSetting.allowedColumn;
		// 	return obj;
		// }

		function createVouchers(selectedTrip) {
			let request = { reqQuery: {} };
			if (selectedTrip && selectedTrip.length > 0) {
				request = {
					advances: selectedTrip.map((o) => o._id),
				};
			} else {
				request.reqQuery = prepareFilter();
			}

			swal(
				{
					title: "Are you sure!!! you want to Create Voucher?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#03A218",
					cancelButtonColor: "btn-danger",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true,
					allowOutsideClick: true,
				},
				function (isConfirmU) {
					if (isConfirmU) {
						tripServices.createVouchers(request, onSuccess, onFailure);
					}
				}
			);

			function onFailure(err) {
				swal("Error", err.data.message, "error");
				reject(err.data.message);
			}

			function onSuccess(res) {
				console.log(res);
				swal(res.data.message);
				// resolve(res.data.data);
			}
		}

		function createVouchersCommon() {
			let request = {
				schema: "tripadvances",
				findQuery: {
					from: vm.oFilter.start_date,
					to: vm.oFilter.end_date,
					account: vm.oFilter.account._id,
				},
			};

			swal(
				{
					title: "Are you sure!!! you want to Create Voucher?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#03A218",
					cancelButtonColor: "btn-danger",
					confirmButtonText: "Yes",
					cancelButtonText: "No",
					closeOnConfirm: true,
					closeOnCancel: true,
					allowOutsideClick: true,
				},
				function (isConfirmU) {
					if (isConfirmU) {
						voucherService.createVouchersCommon(request, onSuccess, onFailure);
					}
				}
			);

			function onFailure(err) {
				swal("Error", err.message, "error");
				reject(err.message);
			}

			function onSuccess(res) {
				console.log(res);
				swal(res.message);
				// resolve(res.data.data);
			}
		}

		function getAllTripSus(isGetActive) {
			if (vm.oFilter.start_date && vm.oFilter.end_date) {
				if (vm.oFilter.start_date > vm.oFilter.end_date) {
					return swal(
						"warning",
						"To date should be greater than From date",
						"warning"
					);
				}
			}

			if (
				vm.oFilter.voucher === "Account not exported" ||
				vm.oFilter.voucher === "Account exported" ||
				vm.oFilter.voucher === "Reversed" ||
				(vm.oFilter.account && vm.oFilter.advanceType)
			) {
				vm.selectType = "multiple";
			} else {
				vm.selectType = "index";
			}

			if (!vm.lazyLoad.update(isGetActive)) return;

			let oFilter = prepareFilter();
			oFilter.sort = "-date";
			tripServices.tripAdvances(oFilter, function (res) {
				if (res && res.data) {
					if (vm.oFilter.voucher === "Account exported") {
						res.data.data = res.data.data.filter((x) => Boolean(x.voucher));
					}
					res = res.data;
					if (!res.data.length) {
						vm.totdr = 0;
						vm.totcr = 0;
					}
					for (var i = 0; i < res.data.length; i++) {
						for (var j = 0; j < res.data[i].reverseHistory.length; j++) {
							res.data[i].reversed_by =
								res.data[i].reverseHistory[j].reversed_by;
							res.data[i].reversed_at =
								res.data[i].reverseHistory[j].reversed_at;
						}
						let oTA = res.data[i];
						oTA.dieselAdv = false;
						let dieselAdvHighlight =
							$scope.$configs &&
							$scope.$configs.tripAdv &&
							$scope.$configs.tripAdv.dieselAdvHighlight;
						if (
							dieselAdvHighlight &&
							oTA.advanceType === "Diesel" &&
							oTA.amount > 0
						) {
							oTA.dieselAdv = true;
						}
					}

					vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
				}
			});
		}

		function getSummary() {
			if (vm.oFilter.start_date && vm.oFilter.end_date) {
				if (vm.oFilter.start_date > vm.oFilter.end_date) {
					return swal(
						"warning",
						"To date should be greater than From date",
						"warning"
					);
				}
			}

			if (
				vm.oFilter.voucher === "Account not exported" ||
				vm.oFilter.voucher === "Account exported" ||
				vm.oFilter.voucher === "Reversed" ||
				(vm.oFilter.account && vm.oFilter.advanceType)
			) {
				vm.selectType = "multiple";
			} else {
				vm.selectType = "index";
			}

			let oFilter = prepareFilter();
			delete oFilter.skip;
			delete oFilter.no_of_docs;
			tripServices.getSummary(oFilter, function (res) {
				if (res && res.data) {
					if (vm.oFilter.voucher === "Account exported") {
						res.data.data = res.data.data.filter((x) => Boolean(x.voucher));
					}
					res = res.data;
					vm.totalCr = res.data[0].totalCr;
					vm.totalDr = res.data[0].totalDr;
					vm.totalLtr = res.data[0].totalLtr;
					vm.count = res.data[0].count;
				}
			});
		}

		function getAdvCrDr(isGetActive) {
			let oFilter = { reqQuery: {} };
			oFilter.reqQuery = prepareFilter();

			tripServices.checkAdvCrDr(oFilter, function (res) {
				if (res && res.data) {
					vm.advSum = {};
					vm.advSum = res.data.data;
				}
			});
		}

		function downloadReport(d) {
			if (d !== "issues" && !vm.aSelectedTrips) {
				if (!(vm.oFilter.start_date && vm.oFilter.end_date)) {
					vm.disableDownloadBtn = false;
					swal("Warning", "From and To Date  should be filled", "warning");
					return;
				}
			}

			if (vm.oFilter.start_date && vm.oFilter.end_date) {
				if (vm.oFilter.start_date > vm.oFilter.end_date) {
					vm.disableDownloadBtn = false;
					return swal(
						"warning",
						"End date should be greater than Start date",
						"warning"
					);
				}

				if (
					moment(vm.oFilter.end_date)
						.add(-6, "month")
						.isAfter(moment(vm.oFilter.start_date))
				) {
					vm.disableDownloadBtn = false;
					return swal("warning", "Only 6 Month Report allowed", "warning");
				}
				// let allowedTime = ['3', 'Months'];
				//
				// if (d === 'csv')
				// 	allowedTime = ['1', 'year'];
				//
				// if (moment(vm.oFilter.end_date).isAfter(moment(vm.oFilter.start_date).add(...allowedTime))) {
				// vm.disableDownloadBtn = false;
				// return swal('warning', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'warning');
				// }
			}

			var oFilter = prepareFilter();
			if (d === "tally-xml") {
				if (vm.aSelectedTrips && vm.aSelectedTrips instanceof Array) {
					oFilter._id = vm.aSelectedTrips.map((t) => t._id);
				}
				oFilter.voucher = { $exists: true };
			}
			if (d === "csv") oFilter.downloadCSV = true;

			vm.disableDownloadBtn = true;
			tripServices.downloadTripAdvances(
				{ downloadType: d },
				oFilter,
				function (response) {
					vm.disableDownloadBtn = false;
					if (d === "tally-xml") {
						let excelBlob = new Blob([response.data], {
							type: "text/plain",
						});
						let fName = new Date().getDate();
						fName = "TripAdvancesVouchers" + fName + ".xml";
						saveAs(excelBlob, fName);
					} else if (response.data.url) {
						var a = document.createElement("a");
						a.href = response.data.url;
						a.download = response.data.url;
						a.target = "_blank";
						a.click();
					} else {
						swal("", response.data.message, "success");
					}
				}
			);
		}

		function dieselTripReport() {
			if (vm.oFilter.start_date && vm.oFilter.end_date) {
				if (vm.oFilter.start_date > vm.oFilter.end_date) {
					vm.disableDownloadBtn = false;
					return swal(
						"warning",
						"End date should be greater than Start date",
						"warning"
					);
				}

				if (
					moment(vm.oFilter.end_date)
						.add(-1, "month")
						.isAfter(moment(vm.oFilter.start_date))
				) {
					vm.disableDownloadBtn = false;
					return swal("warning", "Only 1 Month Report allowed", "warning");
				}
			} else {
				vm.disableDownloadBtn = false;
				return swal("Warning", "From and To Date  should be filled", "warning");
			}

			vm.disableDownloadBtn = true;

			tripServices.downloadDieselTripReport(
				prepareFilter(),
				function (response) {
					vm.disableDownloadBtn = false;

					if (response.data.url) {
						var a = document.createElement("a");
						a.href = response.data.url;
						a.download = response.data.url;
						a.target = "_blank";
						a.click();
					} else {
						swal("", response.data.message, "success");
					}
				}
			);
		}

		function prepareFilter() {
			var myFilter = {};
			//myFilter.trip_stage = true;
			myFilter.advanceType = {
				$nin: ["Vendor Advance", "Vendor Diesel", "Vendor Balance"],
			};

			if (vm.oFilter.trip_no) {
				myFilter.trip_no = vm.oFilter.trip_no;
			}
			if (vm.oFilter.bill_no) {
				myFilter.bill_no = vm.oFilter.bill_no;
			}
			if (vm.oFilter.ref_no) {
				myFilter.reference_no = vm.oFilter.ref_no;
			}

			if (vm.oFilter.category) {
				myFilter.category = vm.oFilter.category;
			}

			if (vm.oFilter.dateType) {
				myFilter.dateType = vm.oFilter.dateType;
			}
			if (vm.oFilter.vehicle) {
				myFilter.vehicle_no = vm.oFilter.vehicle.vehicle_reg_no;
			}
			if (vm.oFilter.driver) {
				myFilter.driver = vm.oFilter.driver._id;
			}
			if (vm.oFilter.vendor) {
				myFilter.vendor = vm.oFilter.vendor._id;
			}
			if (vm.oFilter.advanceType) {
				myFilter.advanceType = vm.oFilter.advanceType;
			}

			if (vm.aBranch && vm.aBranch.length) {
				myFilter.branch = vm.aBranch.map((v) => v._id);
			} else if (vm.aUserBranch && vm.aUserBranch.length) {
				myFilter.branch = [];
				vm.aUserBranch.forEach((obj) => {
					if (obj.read) myFilter.branch.push(obj._id);
				});
			}

			if (vm.oFilter.isSettle) {
				myFilter["advSettled"] = vm.oFilter.isSettle;
			} else {
				myFilter["advSettled"] = false;
			}

			if (vm.oFilter.bill) {
				if (vm.oFilter.bill == "PurBill Generated") {
					myFilter.purchaseBill = { $exists: true };
				} else if (vm.oFilter.bill == "PurBill not Generated") {
					myFilter.purchaseBill = { $exists: false };
				}
			}

			if (vm.oFilter.voucher) {
				if (vm.oFilter.voucher == "Account exported") {
					myFilter.voucher = { $exists: true }; //{ $not: { $eq: true }};
				} else if (vm.oFilter.voucher == "Account not exported") {
					myFilter.voucher = { $exists: false }; //{ $not: { $eq: false }};
				} else if (vm.oFilter.voucher == "Reversed") {
					myFilter.reversed = true;
				}
			}
			if (vm.oFilter.start_date) {
				///////myFilter.from = moment(vm.oFilter.start_date, 'DD/MM/YYYY').startOf('day').toISOString();
				myFilter.from = vm.oFilter.start_date;
				// myFilter.from = new Date((vm.oFilter.start_date).setHours(0,0,0));
			}
			if (vm.oFilter.end_date) {
				//myFilter.to = moment(vm.oFilter.end_date, 'DD/MM/YYYY').endOf('day').toISOString();
				myFilter.to = vm.oFilter.end_date;
			}
			if (vm.oFilter.status) {
				if (vm.oFilter.status === "On Trip") {
					myFilter.trip = { $exists: true };
				} else if (vm.oFilter.status === "In Suspense") {
					myFilter.trip = { $exists: false };
				} else {
					myFilter.trip = vm.oFilter.status;
				}
			}
			if (vm.oFilter.account) {
				myFilter.account = vm.oFilter.account._id;
			}
			if (vm.oFilter.branch) {
				myFilter.branch = vm.oFilter.branch._id;
			}
			myFilter.skip = vm.lazyLoad.getCurrentPage();

			if (vm.oFilter.sR) {
				myFilter.sR = vm.oFilter.sR;
			}
			if (vm.oFilter.eR) {
				myFilter.eR = vm.oFilter.eR;
			}

			if (
				vm.oFilter.bill_no &&
				vm.oFilter.account &&
				vm.oFilter.advanceType === "Diesel"
			)
				myFilter.no_of_docs = 100;
			else myFilter.no_of_docs = 10;

			return myFilter;
		}

		function uploadHandler(
			files,
			file,
			newFiles,
			duplicateFiles,
			invalidFiles,
			event
		) {
			if (file && event.type === "change") {
				var fd = new FormData();
				fd.append("advancesExcel", file);
				var data = {};
				data.fileUpload = true;
				data.formData = fd;
				tripServices
					.uploadTripAdvances({}, data)
					.then(function (d) {
						if (d.stats && d.stats.length > 0) {
							const header = [
								"ADVANCE DATE",
								"ADVANCE TYPE",
								"REFERENCE NO",
								"VEHICLE NO",
								"STATUS",
								"REJECTION REASON",
							];
							const body = d.stats.map((o) =>
								header.map(
									(s) =>
										(s &&
											o[s] &&
											(Array.isArray(o[s]) ? o[s].join(", ") : o[s])) ||
										""
								)
							);
							objToCsv("AdvancesLog", header, body);
						}
						swal({ title: "Info", text: d.message, type: "info" });
					})
					.catch(function (err) {
						swal(err.data.message, err.data.error, "error");
					});
			}
		}

		function downloadCsv() {
			const headers = [
				"ADVANCE DATE",
				"ADVANCE TYPE",
				"AMOUNT",
				"REFERENCE NO",
				"DIESEL VENDOR",
				"DIESEL RATE",
				"DIESEL LITRE",
				"REMARK",
				"BRANCH ACCOUNT",
				"HAPPAY ACCOUNT",
				"BILL NO",
				"VEHICLE NO",
				"BRANCH",
				"STATUS",
				"TRIP NO",
			];
			if (!($scope.$configs.tripAdv && $scope.$configs.tripAdv.showStatusCol))
				headers.splice(13, 1);
			objToCsv(null, headers, []);
		}

		function generateBill() {
			if (!(/*vm.oFilter.bill_no && */ vm.oFilter.account)) {
				swal(
					"Error",
					"Please choose a Vendor Account and Diesel Type Advance only",
					"error"
				);
				return;
			}

			if (
				!(
					typeof vm.aSelectedTrips === "object" &&
					(vm.aSelectedTrips._id ||
						(Array.isArray(vm.aSelectedTrips) && !!vm.aSelectedTrips[0]))
				)
			) {
				swal("Error", "No Advance Selected", "error");
				return;
			}

			let aAdvances = Array.isArray(vm.aSelectedTrips)
				? vm.aSelectedTrips
				: [vm.aSelectedTrips];

			let billNo = aAdvances[0].bill_no || false,
				account = (aAdvances[0] && aAdvances[0].from_account._id) || false,
				advanceType = (aAdvances[0] && aAdvances[0].advanceType) || false;
			// || adv.advanceType !== advanceType
			if (
				aAdvances.find((adv) =>
					adv.from_account
						? /*adv.bill_no !== billNo || */ adv.from_account._id !== account
						: true
				)
			) {
				swal(
					"Error",
					"All Selected Advance should have same Bill No., Vendor Account & Advance Type",
					"error"
				);
				return;
			}

			$modal
				.open({
					templateUrl: "views/bills/purchaseBillUpsert.html",
					controller: [
						"$timeout",
						"$uibModalInstance",
						"accountingService",
						"billBookService",
						"billsService",
						"branchService",
						"DatePicker",
						"modelDetail",
						"otherData",
						"tripServices",
						"NumberUtil",
						purchaseBillUpsertController,
					],
					controllerAs: "pbuVm",
					resolve: {
						modelDetail: function () {
							return {
								type: "add",
							};
						},
						otherData: function () {
							return {
								aAdvances,
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
						getAllTripSus();
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		}

		function generateDieselBill() {
			if (
				!(vm.oFilter.voucher === "Account not exported" && vm.oFilter.account)
			) {
				swal(
					"Error",
					"Please choose a Vendor Account and Diesel Type Advance & Account not exported only",
					"error"
				);
				return;
			}

			if (
				!(
					typeof vm.aSelectedTrips === "object" &&
					(vm.aSelectedTrips._id ||
						(Array.isArray(vm.aSelectedTrips) && !!vm.aSelectedTrips[0]))
				)
			) {
				swal("Error", "No Advance Selected", "error");
				return;
			}

			let aAdvances = Array.isArray(vm.aSelectedTrips)
				? vm.aSelectedTrips
				: [vm.aSelectedTrips];

			let billNo = aAdvances[0].bill_no || false,
				account = (aAdvances[0] && aAdvances[0].from_account._id) || false,
				advanceType = (aAdvances[0] && aAdvances[0].advanceType) || false;
			// || adv.advanceType !== advanceType
			if (
				aAdvances.find((adv) =>
					adv.from_account
						? /*adv.bill_no !== billNo || */ adv.from_account._id !== account
						: true
				)
			) {
				swal(
					"Error",
					"All Selected Advance should have same Bill No., Vendor Account & Advance Type",
					"error"
				);
				return;
			}

			$modal
				.open({
					templateUrl: "views/tripSuspense/genDieselBillPopup.html",
					controller: "genDieselBillPopupController",
					controllerAs: "gdbVm",
					resolve: {
						modelDetail: function () {
							return {
								type: "add",
							};
						},
						otherData: function () {
							return {
								aAdvances,
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
						getAllTripSus();
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		}

		function getVname(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				function oSuc(response) {
					vm.aVehicles = response.data.data;
				}

				function oFail(response) {
					console.log(response);
				}

				Vehicle.getNameTrim(viewValue, oSuc, oFail);
			} else if (viewValue == "") {
				getAllTripSus();
			}
		}

		function getVendorName(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				Vendor.getName(
					{
						name: viewValue,
						deleted: false,
					},
					(res) => (vm.aVendor = res.data.data),
					(err) => console.log`${err}`
				);
			}
		}

		function getDriver(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				Driver.getName(
					viewValue,
					(res) => (vm.aDriver = res.data.data),
					(err) => console.log`${err}`
				);
			}
		}

		function accountmaster(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					accountingService.getAccountMaster(
						{ name: viewValue },
						(res) => {
							resolve(res.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function getAllBranch(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
					};

					if ($scope.$configs.client_allowed)
						req.cClientId = JSON.stringify(
							$scope.$configs.client_allowed.map((v) => v.clientId)
						);

					if ($scope.aUserBranch && $scope.aUserBranch.length) {
						let branch = [];
						$scope.aUserBranch.forEach((obj) => {
							if (obj.read) branch.push(obj);
						});
						resolve(branch);
					} else
						branchService.getAllBranches(
							req,
							(res) => {
								resolve(res.data);
							},
							(err) => {
								console.log`${err}`;
								reject([]);
							}
						);
				});
			}

			return [];
		}
		function onSelect() {
			getTrips();
		}

		function selectedAdvance() {
			vm.totcr = 0;
			vm.totdr = 0;
			if (!Array.isArray(vm.aSelectedTrips))
				vm.aSelectedTrips = [vm.aSelectedTrips];

			vm.aSelectedTrips.forEach((obj) => {
				if (obj.amount > 0) {
					vm.totdr += obj.amount;
				} else if (obj.amount < 0) {
					vm.totcr += Math.abs(obj.amount);
				}
			});
		}

		function dateChange(dateType) {
			if (dateType === "startDate" && vm.oFilter.end_date) {
				if (
					moment(vm.oFilter.end_date)
						.add(-12, "month")
						.isAfter(moment(vm.oFilter.start_date))
				) {
					vm.oFilter.end_date = moment(vm.oFilter.start_date)
						.add(12, "month")
						.toDate();
				}

				if (vm.oFilter.start_date > vm.oFilter.end_date)
					vm.oFilter.end_date = vm.oFilter.start_date;
			} else if (dateType === "endDate" && vm.oFilter.start_date) {
				if (
					moment(vm.oFilter.start_date)
						.add(-12, "month")
						.isAfter(moment(vm.oFilter.end_date))
				) {
					vm.oFilter.start_date = moment(vm.oFilter.end_date)
						.add(12, "month")
						.toDate();
				}
			}
			vm.maxEndDate = Math.min(
				moment(vm.oFilter.start_date).add(12, "month").toDate(),
				new Date()
			);
		}

		function reverseAdv() {
			const request = {};
			if (!Array.isArray(vm.aSelectedTrips)) {
				request.ids = [vm.aSelectedTrips._id];
			} else {
				request.ids = vm.aSelectedTrips.map((t) => t._id);
			}
			vm.isDisabled = true;
			tripServices.reverseAdvance(request, onSuccess, onFailure);

			function onFailure(err) {
				vm.isDisabled = false;
				swal("Error", err.data.message, "error");
				reject(err.data.message);
			}

			function onSuccess(res) {
				vm.isDisabled = false;
				console.log(res);
				swal("Success", res.data.message, "success");
				resolve(res.data.data);
			}
		}

		function UnMapAdvance() {
			if (!(vm.aSelectedTrips && vm.aSelectedTrips[0]._id))
				return swal("Warning", "No Row Selected", "warning");

			if (!(vm.aSelectedTrips && vm.aSelectedTrips[0].trip))
				return swal("Warning", "trip not found on select Advance", "warning");

			vm.aSelectedTrips[0].trip_Id = vm.aSelectedTrips[0].trip;

			$modal
				.open({
					templateUrl: "views/myTripSettlement/suspenseRemarkPopUp.html",
					controller: [
						"$uibModalInstance",
						"otherData",
						"tripServices",
						suspenseRemarkPopUpCtrl,
					],
					controllerAs: "sRVm",
					resolve: {
						otherData: function () {
							return {
								oSelectedAdv: vm.aSelectedTrips,
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
						vm.getAllTripSus();
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		}

		function shouldHideReverse() {
			if (vm.aSelectedTrips) {
				if (!Array.isArray(vm.aSelectedTrips)) {
					return vm.aSelectedTrips.reversed;
				} else {
					return Boolean(vm.aSelectedTrips.find((t) => t.reversed));
				}
			} else {
				return true;
			}
		}

		function advanceOper(type = "add") {
			let pr = false;

			let selectedAdv;
			if (type === "mapTripOnAdv") {
				let selTrips = Array.isArray(vm.aSelectedTrips)
					? vm.aSelectedTrips
					: [vm.aSelectedTrips];

				let voucherTrips = selTrips.filter((t) => t.voucher);

				if (voucherTrips.length) {
					swal(
						"Warning",
						`Advance Can\'t Be Re-mapped, voucher created of trip ${voucherTrips
							.map((t) => t.trip_no)
							.join(", ")}`,
						"warning"
					);
					return;
				}

				swal(
					{
						title: "Are you sure you want to remap trip on selected advances?",
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true,
						allowOutsideClick: true,
					},
					function (isConfirm) {
						if (isConfirm) {
							tripServices.mapTripOnAdv(
								{ _id: selTrips.map((t) => t._id) },
								onSuccess,
								onFailure
							);

							function onSuccess(res) {
								swal("Success", res.data.message, "success");
								getAllTripSus();
							}

							function onFailure(err) {
								swal("Error", err.data.message, "error");
								if (err.data.stats && err.data.stats.length > 0) {
									const header = [
										"ADVANCE DATE",
										"ADVANCE TYPE",
										"REFERENCE NO",
										"VEHICLE NO",
										"STATUS",
										"REJECTION REASON",
									];
									const body = err.data.stats.map((o) =>
										header.map(
											(s) =>
												(s &&
													o[s] &&
													(Array.isArray(o[s]) ? o[s].join(", ") : o[s])) ||
												""
										)
									);
									objToCsv("AdvancesLog", header, body);
								}
							}
						}
					}
				);
				return;
			}
			// vm.aSelectedTrips refer to array of advances

			if (type !== "add") {
				if (Array.isArray(vm.aSelectedTrips)) {
					if (vm.aSelectedTrips.length === 0) {
						swal("Warning", "No Trip Selected", "warning");
						return;
					} else if (vm.aSelectedTrips.length > 1) {
						// swal('Warning', 'Select Single Trip to edit', 'warning');
						// return;
						selectedAdv = vm.aSelectedTrips;
					} else {
						selectedAdv = vm.aSelectedTrips[0];
					}
				} else if (typeof vm.aSelectedTrips !== "object") {
					swal("Warning", "Invalid selected type", "warning");
					return;
				} else {
					selectedAdv = vm.aSelectedTrips;
				}

				if (selectedAdv.category !== "trip" && type === "edit")
					return addOtherExpense("edit");

				if (selectedAdv.multiAdv)
					return swal("Warning", "Please use Multi Advance Feature", "warning");
			}

			if (type === "edit") {
				if (selectedAdv.trip) {
					let oFilter = {
						_id: selectedAdv.trip,
						"advSettled.isCompletelySettled": false,
					};

					pr = new Promise(function (resolve, reject) {
						tripServices.getAllTripsWithPagination(oFilter, success);

						function success(res) {
							if (res.data.data.data.length) {
								vm.markSettle =
									res.data.data.data[0].markSettle &&
									res.data.data.data[0].markSettle.isSettled;
								if (vm.markSettle)
									return swal(
										"Warning",
										"Advance Cannot Be Modified. Trip is Marked Settled",
										"warning"
									);
								resolve();
							} else return swal("Warning", "Advance Cannot Be Modified. Trip Already Settled", "warning");
						}
					});
				}

				if (
					selectedAdv.voucher &&
					!$scope.$role["Trip Advance"]["Edit Vehicle"]
				)
					return swal(
						"Warning",
						"Advance Cannot Be Modified. It is already imported",
						"warning"
					);

				if (
					selectedAdv.purchaseBill &&
					!$scope.$role["Trip Advance"]["Edit Vehicle"]
				)
					return swal(
						"Warning",
						"Advance Cannot Be Modified. Purchase Bill Generated",
						"warning"
					);
			}

			if (type === "deleteContra") {
				swal(
					{
						title: "Are you sure you want to delete this trip advance contra?",
						// text: '1. GST Not Registerd',
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true,
						allowOutsideClick: true,
					},
					function (isConfirm) {
						if (isConfirm) {
							tripServices.deleteAdvanceContra(
								{
									_id: selectedAdv._id,
									reference_no: selectedAdv.reference_no,
									bill_no: selectedAdv.bill_no,
								},
								onSuccess,
								onFailure
							);

							function onFailure(err) {
								swal("Error", err.data.message, "error");
							}

							function onSuccess(res) {
								swal("Success", res.data.message, "success");
								getAllTripSus();
							}
						}
					}
				);
				return;
			}

			if (type === "delete") {
				if (selectedAdv.voucher)
					return swal("Warning", "Advance Cannot Be Deleted.", "warning");

				selectedAdv.disableStationery = false;

				if (
					$scope.$configs.tripAdv &&
					$scope.$configs.tripAdv.disableStationery
				)
					selectedAdv.disableStationery =
						$scope.$configs.tripAdv.disableStationery;

				return swal(
					{
						title: "Are you sure you want to delete this advance?",
						type: "warning",
						showCancelButton: true,
						confirmButtonClass: "btn-danger",
						confirmButtonText: "Yes",
						cancelButtonText: "No",
						closeOnConfirm: true,
						closeOnCancel: true,
						allowOutsideClick: true,
					},
					function (isConfirm) {
						if (isConfirm) {
							$modal
								.open({
									templateUrl: "views/tripSuspense/deleteRemarkPopup.html",
									size: "sm",
									controller: [
										"$uibModalInstance",
										function ($uibModalInstance) {
											let vm = this;

											vm.closeModal = closeModal;
											vm.submitRemark = submit;

											// Actual Functions

											function closeModal() {
												$uibModalInstance.dismiss();
											}

											function submit() {
												if (!vm.remark)
													return swal("Error", "Remark is mandatory", "error");

												$uibModalInstance.close({
													remark: vm.remark,
												});
											}
										},
									],
									controllerAs: "vm",
								})
								.result.then(
									function (response) {
										// Call on Modal Close
										id = [];
										if (vm.aSelectedTrips.length > 1) {
											id = selectedAdv.map((t) => t._id);
										} else {
											id.push(selectedAdv._id);
										}

										tripServices.deleteAdvances(
											{
												ids: id,
												deleteRemark: response.remark,
												disableStationery: selectedAdv.disableStationery,
											},
											onSuccess,
											onFailure
										);

										function onFailure(err) {
											swal("Error", err.data.message, "error");
										}

										function onSuccess(res) {
											swal("Success", res.data.message, "success");
											getAllTripSus();
										}
									},
									function (response) {
										// Call on Modal Dismiss
									}
								);
						}
					}
				);
			}

			if (pr instanceof Promise)
				pr.then(openModal).catch(function (err) {
					console.log(err);
				});
			else openModal();

			function openModal() {
				$templateCache.remove("views/tripSuspense/approvalPopup.html");
				$modal
					.open({
						templateUrl: "views/tripSuspense/approvalPopup.html",
						controller: [
							"$scope",
							"$modal",
							"$uibModalInstance",
							"accountingService",
							"branchService",
							"callback",
							"DatePicker",
							"lazyLoadFactory",
							"modelDetail",
							"otherData",
							"billBookService",
							"tripServices",
							"Vehicle",
							"narrationService",
							"vendorFuelService",
							/*'associatedriverOnVehicle',*/ approvalPopupController,
						],
						controllerAs: "approvalVm",
						resolve: {
							callback: function () {
								return function (oTrip) {
									let oAdvance = oTrip.oAdvance;
									return new Promise(function (resolve, reject) {
										// if (oAdvance.advanceType === 'Diesel')
										// 	oAdvance.amount = oAdvance.diesel_info.rate * oAdvance.diesel_info.litre;

										if (oAdvance.advanceType === "Diesel") {
											oAdvance.diesel_info.litre =
												oAdvance.amount / oAdvance.diesel_info.rate;
											oAdvance.diesel_info.litre = parseFloat(
												oAdvance.diesel_info.litre.toFixed(2)
											);
										}
										// oAdvance.amount = oAdvance.diesel_info.rate * oAdvance.diesel_info.litre;
										// if (type !== 'add' && oAdvance.amount === selectedAdv.amount) {
										// 	swal('Warning', 'Amount Not changed', 'warning');
										// 	reject();
										// 	return;
										// }
										if (type !== "add") {
											let request = {
												...oAdvance,
												trip: oTrip._id,
											};

											tripServices.updateAdvance(request, onSuccess, onFailure);
										} else {
											let request = {
												...oAdvance,
												_id: oTrip._id,
											};

											tripServices.addAdvance(request, onSuccess, onFailure);
										}

										function onFailure(err) {
											swal("Error", err.data.message, "error");
											reject(err.data.message);
										}

										function onSuccess(res) {
											console.log(res);
											swal("Success", res.data.message, "success");
											resolve(res.data.data);
										}
									});
								};
							},
							modelDetail: function () {
								let tripAdvConfig = $scope.$configs.tripAdv || {};
								let config = {
									autoMap: tripAdvConfig.automap || true,
								};
								if (tripAdvConfig.showTripSecOnAdv == false) {
									Object.assign(config, {
										showAdvanceDate: false,
										showTripSearchBtn: false,
										showTripTable: false,
									});
								}
								if (tripAdvConfig.editRate)
									Object.assign(config, {
										editRate: true,
									});

								return {
									type,
									showTripForm: config,
								};
							},
							otherData: function () {
								return {
									selectedAdv,
								};
							},
						},
					})
					.result.then(
						function (response) {
							console.log("close", response);
							getAllTripSus();
						},
						function (data) {
							console.log("cancel", data);
						}
					);
			}
		}

		function dieselReqAdv(type = "add") {
			let pr = false;

			let selectedAdv;

			if (type !== "add") {
				if (Array.isArray(vm.aSelectedTrips)) {
					if (vm.aSelectedTrips.length === 0) {
						swal("Warning", "No Trip Selected", "warning");
						return;
					} else if (vm.aSelectedTrips.length > 1) {
						swal("Warning", "Select Single Trip to edit", "warning");
						return;
					} else {
						selectedAdv = vm.aSelectedTrips[0];
					}
				} else if (typeof vm.aSelectedTrips !== "object") {
					swal("Warning", "Invalid selected type", "warning");
					return;
				} else {
					selectedAdv = vm.aSelectedTrips;
				}

				if (selectedAdv.multiAdv)
					return swal("Warning", "Please use Multi Advance Feature", "warning");
			}

			if (type === "edit") {
				if (selectedAdv.trip) {
					let oFilter = {
						_id: selectedAdv.trip,
						"advSettled.isCompletelySettled": false,
					};

					pr = new Promise(function (resolve, reject) {
						tripServices.getAllTripsWithPagination(oFilter, success);

						function success(res) {
							if (res.data.data.data.length) {
								vm.markSettle =
									res.data.data.data[0].markSettle &&
									res.data.data.data[0].markSettle.isSettled;
								if (vm.markSettle)
									return swal(
										"Warning",
										"Advance Cannot Be Modified. Trip is Marked Settled",
										"warning"
									);
								resolve();
							} else return swal("Warning", "Advance Cannot Be Modified. Trip Already Settled", "warning");
						}
					});
				}

				if (
					selectedAdv.voucher &&
					!$scope.$role["Trip Advance"]["Edit Vehicle"]
				)
					return swal(
						"Warning",
						"Advance Cannot Be Modified. It is already imported",
						"warning"
					);

				if (
					selectedAdv.purchaseBill &&
					!$scope.$role["Trip Advance"]["Edit Vehicle"]
				)
					return swal(
						"Warning",
						"Advance Cannot Be Modified. Purchase Bill Generated",
						"warning"
					);
			}

			if (pr instanceof Promise)
				pr.then(openModal).catch(function (err) {
					console.log(err);
				});
			else openModal();

			function openModal() {
				$templateCache.remove("views/tripSuspense/requestPopup.html");
				$modal
					.open({
						templateUrl: "views/tripSuspense/requestPopup.html",
						controller: [
							"$scope",
							"$uibModalInstance",
							"accountingService",
							"branchService",
							"callback",
							"DatePicker",
							"lazyLoadFactory",
							"modelDetail",
							"otherData",
							"billBookService",
							"tripServices",
							"Vehicle",
							"narrationService",
							"vendorFuelService",
							requestPopupController,
						],
						controllerAs: "requestVm",
						resolve: {
							callback: function () {
								return function (oTrip) {
									let oAdvance = oTrip.oAdvance;
									return new Promise(function (resolve, reject) {
										if (oAdvance.advanceType === "Diesel") {
											// oAdvance.diesel_info.litre = oAdvance.amount / oAdvance.diesel_info.rate;
											oAdvance.diesel_info.litre = parseFloat(
												oAdvance.diesel_info.litre.toFixed(2)
											);
										}

										if (type !== "add") {
											let request = {
												...oAdvance,
												trip: oTrip._id,
											};

											tripServices.updateAdvance(request, onSuccess, onFailure);
										} else {
											let request = {
												...oAdvance,
												_id: oTrip._id,
											};

											tripServices.dieselReq(request, onSuccess, onFailure);
										}

										function onFailure(err) {
											swal("Error", err.data.message, "error");
											reject(err.data.message);
										}

										function onSuccess(res) {
											console.log(res);
											swal("Success", res.data.message, "success");
											resolve(res.data.data);
										}
									});
								};
							},
							modelDetail: function () {
								let tripAdvConfig = $scope.$configs.tripAdv || {};
								let config = {
									autoMap: tripAdvConfig.automap || true,
								};
								if (tripAdvConfig.showTripSecOnAdv == false) {
									Object.assign(config, {
										showAdvanceDate: false,
										showTripSearchBtn: false,
										showTripTable: false,
									});
								}
								if (tripAdvConfig.editRate)
									Object.assign(config, {
										editRate: true,
									});

								return {
									type,
									showTripForm: config,
								};
							},
							otherData: function () {
								return {
									selectedAdv,
								};
							},
						},
					})
					.result.then(
						function (response) {
							console.log("close", response);
							getAllTripSus();
						},
						function (data) {
							console.log("cancel", data);
						}
					);
			}
		}

		function multiAdv(type = "add") {
			let pr = false;

			let selectedAdv;

			if (pr instanceof Promise)
				pr.then(openModal).catch(function (err) {
					console.log(err);
				});
			else openModal();

			function openModal() {
				$modal
					.open({
						templateUrl: "views/tripSuspense/multiAdvanceUpsert.html",
						controller: "multiAdvanceUpsertController",
						controllerAs: "vm",
						resolve: {
							callback: function () {
								return function (aAdvances) {
									return new Promise(function (resolve, reject) {
										let request = {
											aAdvances,
										};

										tripServices.addMultiAdvanceV2(
											request,
											onSuccess,
											onFailure
										);

										function onFailure(err) {
											swal("Error", err.data.message, "error");
											reject(err.data.message);
										}

										function onSuccess(res) {
											console.log(res);
											swal("Success", res.data.message, "success");
											resolve(res.data.data);
										}
									});
								};
							},
							modelDetail: function () {
								let tripAdvConfig = $scope.$configs.tripAdv || {};
								let config = {
									autoMap: tripAdvConfig.automap || true,
								};
								if (tripAdvConfig.showTripSecOnAdv == false) {
									Object.assign(config, {
										showAdvanceDate: false,
										showTripSearchBtn: false,
										showTripTable: false,
									});
								}
								if (tripAdvConfig.editRate)
									Object.assign(config, {
										editRate: true,
									});

								return {
									type,
									showTripForm: config,
								};
							},
							otherData: function () {
								return {
									selectedAdv: angular.copy(selectedAdv),
								};
							},
						},
					})
					.result.then(
						function (response) {
							console.log("close", response);
							getAllTripSus();
						},
						function (data) {
							console.log("cancel", data);
						}
					);
			}
		}

		function addOtherExpense(type = "add") {
			let selectedAdv;
			if (type !== "add") {
				if (Array.isArray(vm.aSelectedTrips)) {
					if (vm.aSelectedTrips.length === 0) {
						swal("Warning", "No Trip Selected", "warning");
						return;
					} else if (vm.aSelectedTrips.length > 1) {
						swal("Warning", "Select Single Trip to edit", "warning");
						return;
					} else {
						selectedAdv = vm.aSelectedTrips[0];
					}
				} else if (typeof vm.aSelectedTrips !== "object") {
					swal("Warning", "Invalid selected type", "warning");
					return;
				} else {
					selectedAdv = vm.aSelectedTrips;
				}
			}

			if (type === "edit" && selectedAdv.voucher) {
				swal("Warning", "Advance Cannot Be Modified.", "warning");
				return;
			}

			$modal
				.open({
					templateUrl: "views/tripSuspense/approvalPopup.html",
					controller: [
						"$scope",
						"$modal",
						"$uibModalInstance",
						"accountingService",
						"branchService",
						"callback",
						"DatePicker",
						"lazyLoadFactory",
						"modelDetail",
						"otherData",
						"billBookService",
						"tripServices",
						"Vehicle",
						"narrationService",
						"vendorFuelService",
						approvalPopupController,
					],
					controllerAs: "approvalVm",
					resolve: {
						callback: function () {
							return function (oTrip) {
								let oAdvance = oTrip.oAdvance;
								return new Promise(function (resolve, reject) {
									if (oAdvance.advanceType === "Diesel") {
										let amt =
											oAdvance.diesel_info.rate * oAdvance.diesel_info.litre;
										if (Math.abs(amt - oAdvance.amount) > 10)
											return swal(
												"Error",
												"advance amount limit boundation",
												"error"
											);
									}

									if (type !== "add") {
										let request = {
											...oAdvance,
											trip: oTrip._id,
										};

										tripServices.updateAdvance(request, onSuccess, onFailure);
									} else {
										let request = {
											...oAdvance,
											_id: oTrip._id,
										};

										tripServices.addAdvance(request, onSuccess, onFailure);
									}

									function onFailure(err) {
										swal("Error", err.data.message, "error");
										reject(err.data.message);
									}

									function onSuccess(res) {
										console.log(res);
										swal("Success", res.data.message, "success");
										resolve(res.data.data);
									}
								});
							};
						},
						modelDetail: function () {
							return {
								type,
								showTripForm: false,
								mandatory: {
									vehicle: false,
								},
							};
						},
						otherData: function () {
							return {
								selectedAdv,
								aCatagory: $scope.$constants.aOtherExpense,
								advanceCategory: "other",
								selectedTrip:
									(selectedAdv && {
										_id: selectedAdv.trip,
										trip_no: selectedAdv.trip_no,
									}) ||
									{},
							};
						},
					},
				})
				.result.then(
					function (response) {
						console.log("close", response);
						getAllTripSus();
					},
					function (data) {
						console.log("cancel", data);
					}
				);
		}

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
			formatYear: "yy",
			startingDay: 1,
		};

		$scope.formats = [
			"dd-MMM-yyyy",
			"dd-MMMM-yyyy",
			"yyyy/MM/dd",
			"dd.MM.yyyy",
			"shortDate",
		];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form ******************
	}
);

materialAdmin.controller(
	"statusUpdateCtrl",
	function (
		$scope,
		$uibModalInstance,
		callback,
		DatePicker,
		modelData,
		otherData
	) {
		console.log("otherData.aStatuses => ", otherData.aStatuses);

		$scope.selectedData = otherData.selectedData;
		$scope.adminAccess = otherData.adminAccess || false;
		$scope.header = modelData.header || "Status";
		$scope.selectedStatus = {};
		$scope.DatePicker = DatePicker;
		$scope.aStatuses = otherData.aStatuses;

		$scope.aHours = [];
		$scope.aMinutes = [];
		$scope.tripStartDate = $scope.selectedData.start_date;

		for (var h = 0; h < 24; h++) $scope.aHours.push(h);

		for (var m = 0; m < 60; m++) $scope.aMinutes.push(m);

		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.hourSel1 = new Date().getHours();
		$scope.minuteSel1 = new Date().getMinutes();

		$scope.updateStatus = function () {
			let date = new Date(
				new Date($scope.updated_status.date).setHours(
					$scope.hourSel1,
					$scope.minuteSel1
				)
			);

			let oSend = {
				status: $scope.status,
				location2: $scope.updated_status.location2,
				updated_status: {
					remark: $scope.updated_status.remark,
					startOdo: $scope.updated_status.startOdo,
					endOdo: $scope.updated_status.endOdo,
					date: date.toISOString(),
				},
				_id: $scope.selectedData._id,
			};

			callback(oSend)
				.then(function () {
					$scope.closeModal();
				})
				.catch(function (err) {
					console.log(err);
				});
		};

		$scope.fillStatus = function (oStatus) {
			$scope.selectedStatus = oStatus;

			$scope.status = oStatus.status;
			$scope.updated_status = $scope.updated_status || {};
			$scope.updated_status.date = oStatus.date;
			$scope.hourSel1 = new Date(oStatus.date).getHours();
			$scope.minuteSel1 = new Date(oStatus.date).getMinutes();
			$scope.updated_status.remark = oStatus.remark;
			$scope.updated_status.startOdo = $scope.selectedData.startOdo;
			$scope.updated_status.endOdo = $scope.selectedData.endOdo;
			$scope.status = oStatus.status;
		};
	}
);

materialAdmin.controller(
	"itineraryPopUpCtrl",
	function (
		$scope,
		$modal,
		$modalInstance,
		$state,
		$filter,
		$http,
		$interval,
		$modal,
		$localStorage,
		$rootScope,
		$timeout,
		$window,
		$uibModal,
		Driver,
		DatePicker,
		FleetService,
		gpsSocketService,
		lazyLoadFactory,
		objToCsv,
		otherUtils,
		parseTableDataFilter,
		Routes,
		socketio,
		utils,
		Vehicle,
		HTTPConnection,
		URL,
		thatTrip
	) {
		// object Identifiers
		let vm = this,
			map,
			toolTipMap;
		let vehiclePopup;
		var timer;

		vm.oLiveData = {};
		vm.trip = $rootScope.selectedTrip;
		vm.aDateBy = [
			{
				name: "Expected ETA",
				value: "expected_eta",
			},
			{
				name: "Loading Date",
				value: "vehicle.gr.loading_ended_status.date",
			},
			{
				name: "Last Position",
				value: "vehicle.gpsData.datetime",
			},
		];
		vm.oFilter = {
			dateBy: vm.aDateBy[0],
		};
		vm.DatePicker = angular.copy(DatePicker);

		vm.aGrStatus = [
			"Vehicle Arrived for loading",
			"Vehicle Arrived for unloading",
		];

		//vm.lazyLoad = lazyLoadFactory(); // init lazyload
		$rootScope.maps = {};
		$rootScope.plottedMarkers = [];

		vm.orderBy = {};

		// functions Identifiers
		vm.closeModal = closeModal;
		vm.detailView = detailView;
		vm.focusOnMap = focusOnMap;
		vm.focusOnVehicle = focusOnVehicle;
		vm.getColor = getColor;
		vm.getLivetrackVehicleData = getLivetrackVehicleData;
		vm.onPress = onPress;
		vm.placeMarker = placeMarker;
		vm.getplayData = getplayData;
		vm.showDetailVehicleView = showDetailVehicleView;
		vm.triggerDelay = triggerDelay;
		vm.zoomIn = zoomIn;
		vm.zoomOut = zoomOut;

		// INIT functions
		(function init() {
			vm.map = {
				event: {
					onClusterPopupClickEvent: function (marker) {
						vm.oFilter.vehicle_reg_no = marker.content;
					},
					onButtonClickEvent: function (marker) {},
				},
			};
			vm.running = 0;
			vm.stopped = 0;
			vm.inactive = 0;
			vm.offline = 0;
			vm.tableView = false;
			vm.aVehicleStatus = ["Running", "Stopped", "Offline"];
			vm.aHour = Array(24)
				.fill("")
				.map((o, i) => i);
			vm.aMin = Array(60)
				.fill("")
				.map((o, i) => i);
			vm.aTime = [
				"15 min",
				"30 min",
				"1 hr",
				"2 hr",
				"3 hr",
				"4 hr",
				"5 hr",
				"6 hr",
			];
			$scope.showMap = true;
			vm.aGpsVendorApi = [];
			vm.aGpsVendorApi = Object.keys($scope.$configs.gpsVendorApi || {});
			if (vm.aGpsVendorApi.length) vm.aGpsVendorApi.push("Umbrella");

			if (
				$rootScope.$clientConfigs &&
				$rootScope.$clientConfigs.gpsId &&
				$rootScope.$clientConfigs.gpsPwd
			) {
				$rootScope.userLogin({
					user_id: $rootScope.$clientConfigs.gpsId,
					password: $rootScope.$clientConfigs.gpsPwd,
					rememberMe: true,
				});
			}

			$scope.$on("stateRefresh", function () {
				getLivetrackVehicleData(true);
				getLivetrackVehicleDataInThreeMinutes(true);
				vm.oFilter = {
					dateBy: "expected_eta",
				};
				trackingVehicle();
			});

			vm.pageNumber = 1;

			getLivetrackVehicleDataInThreeMinutes(true);
			getLivetrackVehicleData();

			$scope.$on("$destroy", function () {
				vm.tracking && $interval.cancel(vm.tracking);
				vm.vehiclewiseDataInterval &&
					$interval.cancel(vm.vehiclewiseDataInterval);
			});
		})();

		// Actual Functions

		function getLivetrackVehicleDataInThreeMinutes(activate = false) {
			if (activate) {
				vm.vehiclewiseDataInterval &&
					$interval.cancel(vm.vehiclewiseDataInterval);
				vm.vehiclewiseDataInterval = $interval(function () {
					getLivetrackVehicleData();
				}, 1000 * 60);
			} else
				vm.vehiclewiseDataInterval &&
					$interval.cancel(vm.vehiclewiseDataInterval);
		}

		function triggerDelay() {
			if (timer) {
				$timeout.cancel(timer);
				timer = null;
			}
			timer = $timeout(function () {}, 300);
		}

		function detailView(vehicle) {
			let request = {
				_id: vehicle._id,
			};

			Vehicle.getVehiclesWithPagination(request, onSuccess, onFailure);

			function onFailure(err) {
				swal("Error", err.data.message, "error");
			}

			function onSuccess(res) {
				console.log(res);
				callModal(res.data[0]);
			}

			function callModal(oVehicle) {
				$modal
					.open({
						templateUrl: "views/myRegisteredVehicle/detailViewPopup.html",
						controller: [
							"$scope",
							"$uibModalInstance",
							"modelDetail",
							"otherData",
							"Vehicle",
							vehicleDetailPopupController,
						],
						controllerAs: "detailVm",
						resolve: {
							modelDetail: function () {
								return {
									hideEditButton: true,
									hideKey: {
										device_imei: true,
									},
								};
							},
							otherData: function () {
								return {
									oVehicle,
								};
							},
						},
					})
					.result.then(
						function (response) {
							console.log("close", response);
						},
						function (data) {
							console.log("cancel", data);
						}
					);
			}
		}

		function getColor(status) {
			switch (status) {
				case "running":
					return "ja-green";
				case "stopped":
					return "ja-red";
				default:
					return "ja-grey";
			}
		}

		function getLivetrackVehicleData(toRefresh) {
			removeAllMarkerOnMap();
			setTimeout(() => {
				getplayData();
			}, 500);
		}

		function zoomIn() {
			if ($rootScope.maps.map) {
				curZoom = $rootScope.maps.map.getZoom();
				if (curZoom && curZoom < 17) $rootScope.maps.map.setZoom(++curZoom);
			}
		}

		function zoomOut() {
			if ($rootScope.maps.map) {
				curZoom = $rootScope.maps.map.getZoom();
				if (curZoom && curZoom > 2) $rootScope.maps.map.setZoom(--curZoom);
			}
		}

		function showDetailVehicleView(vehicleObj, index) {
			$scope.selectedIndex = index;
			vm.oPlayBackVehicle = vehicleObj;
			getplayData();
		}

		function onPress(keyEvent) {
			if (keyEvent.which === 13) {
				$timeout(function () {
					$(".listVehicleView").first().find(".vehicleNo").trigger("click");
				}, 500);
			}
		}
		function closeModal() {
			$modalInstance.dismiss();
		}

		function focusOnMap(status, oData) {
			if (status == "running") {
				vm.map.position(
					oData.points.map((ping) => ({ lat: ping.lat, lng: ping.lng }))
				);
			} else if (status == "stop") {
				vm.map.position(
					{
						lat: oData.stop.latitude,
						lng: oData.stop.longitude,
					},
					9
				);
				oData.marker.openPopup();
			}
		}

		function trackingVehicle(tracking = false, oVehicle = {}) {
			if (
				tracking &&
				oVehicle.vehicle &&
				oVehicle.vehicle.gpsData.status === "running"
			) {
				vm.trackingVehicle = oVehicle;
				$interval.cancel(vm.tracking);
				setIntervalForGetVehicle();
				vm.tracking = $interval(function () {
					setIntervalForGetVehicle();
				}, 1000 * 10);

				function setIntervalForGetVehicle() {
					getVehicle(vm.trackingVehicle.vehicle._id);
					vm.map.traffic.show();
				}
			} else {
				vm.trackingVehicle = {};
				vm.trackingVehicle.liveCordinate = [];
				vm.trackingVehicle.liveCordinatePtr = 0;
				$interval.cancel(vm.tracking);
				renderOnMap();
				vm.map && vm.map.traffic && vm.map.traffic.hide();
			}

			function getVehicle(id) {
				Vehicle.getVehiclesWithPagination(
					{
						_id: id,
						project: {
							gpsData: 1,
						},
					},
					function (res) {
						if (res && res.data) {
							vm.trackingVehicle.vehicle.gpsData = res.data[0].gpsData;

							setStatus(vm.trackingVehicle.vehicle.gpsData);

							vm.trackingVehicle.liveCordinate =
								vm.trackingVehicle.liveCordinate || [];
							vm.trackingVehicle.liveCordinatePtr =
								vm.trackingVehicle.liveCordinatePtr || 0;
							vm.trackingVehicle.liveCordinate[
								vm.trackingVehicle.liveCordinatePtr
							] =
								vm.trackingVehicle.liveCordinate[
									vm.trackingVehicle.liveCordinatePtr
								] || [];

							if (
								vm.trackingVehicle.liveCordinate[
									vm.trackingVehicle.liveCordinatePtr
								].length
									? utils.getDistanceInKm(
											vm.trackingVehicle.vehicle.gpsData.lat,
											vm.trackingVehicle.vehicle.gpsData.lng,
											vm.trackingVehicle.liveCordinate[
												vm.trackingVehicle.liveCordinatePtr
											][
												vm.trackingVehicle.liveCordinate[
													vm.trackingVehicle.liveCordinatePtr
												].length - 1
											].lat,
											vm.trackingVehicle.liveCordinate[
												vm.trackingVehicle.liveCordinatePtr
											][
												vm.trackingVehicle.liveCordinate[
													vm.trackingVehicle.liveCordinatePtr
												].length - 1
											].lng
									  ) <= 10
									: true
							)
								vm.trackingVehicle.liveCordinate[
									vm.trackingVehicle.liveCordinatePtr
								].push({
									lat: vm.trackingVehicle.vehicle.gpsData.lat,
									lng: vm.trackingVehicle.vehicle.gpsData.lng,
								});
							else {
								vm.trackingVehicle.liveCordinate[
									++vm.trackingVehicle.liveCordinatePtr
								] = [];
								vm.trackingVehicle.liveCordinate[
									vm.trackingVehicle.liveCordinatePtr
								].push({
									lat: vm.trackingVehicle.vehicle.gpsData.lat,
									lng: vm.trackingVehicle.vehicle.gpsData.lng,
								});
							}
							renderOnMap(true);
						} else renderOnMap(false);
					}
				);
			}

			function renderOnMap(render = false) {
				let lastEle;
				if (
					render &&
					(lastEle =
						vm.trackingVehicle.liveCordinate[
							vm.trackingVehicle.liveCordinate.length - 1
						][
							vm.trackingVehicle.liveCordinate[
								vm.trackingVehicle.liveCordinate.length - 1
							].length - 1
						])
				) {
					// removing marker
					vm.trackingVehicle.mapMarker && vm.trackingVehicle.mapMarker.remove();
					Array.isArray(vm.trackingVehicle.mapPolyline) &&
						vm.trackingVehicle.mapPolyline.forEach((o) => {
							o.remove();
						});

					let color;
					switch (vm.trackingVehicle.vehicle.gpsData.status) {
						case "running":
							color = "#15e425";
							break;
						case "online":
							color = "#15e425";
							break;
						case "stopped":
							color = "#FF0000";
							break;
						default:
							color = "#808080";
							break;
					}

					// applying marker
					vm.trackingVehicle.mapMarker = vm.map.marker.add(
						{
							position: { lat: lastEle.lat, lng: lastEle.lng },
							content: vm.trackingVehicle.vehicle.vehicle_reg_no,
							popup: {
								on: "click",
								content: ` <span>${vm.trackingVehicle.vehicle.vehicle_reg_no}
						<span uib-tooltip="Add"
							tooltip-placement="bottom"
							data-lat="${lastEle.lat}"
							data-lng="${lastEle.lng}"
							data-addr="${vm.trackingVehicle.vehicle.gpsData.address}"
                        	class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark"></span>&nbsp;
					</span>`,
								buttonEvent: {
									selector: ".addLandMark",
									onClick: function (lat, lng, addr) {
										vm.addMarkerLandmark({
											lat,
											lng,
											addr,
										});
									},
								},
							},
							icon: vm.map.icon(
								{
									name: "truck",
								},
								{
									rotation: vm.trackingVehicle.vehicle.gpsData.course,
									fillColor: color,
								}
							),
						},
						{
							position: true,
						}
					);

					vm.trackingVehicle.mapPolyline = vm.trackingVehicle.mapPolyline || [];
					vm.trackingVehicle.liveCordinate.forEach((aCord, i) => {
						vm.trackingVehicle.mapPolyline.push(vm.map.polyline.add(aCord));
					});
				} else {
					Array.isArray(vm.trackingVehicle.mapPolyline) &&
						vm.trackingVehicle.mapPolyline.forEach((o) => {
							o.remove();
						});
					vm.trackingVehicle.mapMarker && vm.trackingVehicle.mapMarker.show();
				}
			}

			function setStatus(obj, stoppageTime = 10) {
				let positionTime = new Date(obj.positioning_time);
				let locationTime = new Date(obj.location_time);
				let speed = obj.speed;
				let ptDiffMin = Math.ceil((new Date() - positionTime) / 60000); // in Min
				let ltDiffMin = Math.ceil((new Date() - locationTime) / 60000); // in Min
				if (!obj.status || obj.status === null) {
					obj.s_status = 4;
					return;
				}
				if (ptDiffMin < 300) {
					//15 hr no offline
					if (ltDiffMin <= stoppageTime && speed > 0) {
						obj.status = "running";
						obj.s_status = 1;
					} else {
						obj.status = "stopped";
						obj.s_status = 2;
						obj.speed = 0;
					}
				} else {
					obj.status = "offline";
					obj.s_status = 3;
				}
			}
		}

		function focusOnVehicle(oVehicle) {
			$scope.showMap = true;
			$scope.selectedIndex = null;
			vm.playbackFullscreen = false;
			vm.map.reset();

			let color;
			switch (oVehicle.vehicle.gpsData.status) {
				case "running":
					color = "#15e425";
					break;
				case "online":
					color = "#15e425";
					break;
				case "stopped":
					color = "#FF0000";
					break;
				default:
					color = "#808080";
					break;
			}

			oVehicle.mapMarker = vm.map.marker.add(
				{
					position: {
						lat: oVehicle.vehicle.gpsData.lat,
						lng: oVehicle.vehicle.gpsData.lng,
					},
					content: oVehicle.vehicle.vehicle_reg_no,
					popup: {
						on: "click",
						content: `
					<span>${oVehicle.vehicle.vehicle_reg_no}
						<span uib-tooltip="Add"
							tooltip-placement="bottom"
							data-lat="${oVehicle.vehicle.gpsData.lat}"
							data-lng="${oVehicle.vehicle.gpsData.lng}"
							data-addr="${oVehicle.vehicle.gpsData.address}"
                        	class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark"></span>&nbsp;
					</span>`,
						buttonEvent: {
							selector: ".addLandMark",
							onClick: function (lat, lng, addr) {
								vm.addMarkerLandmark({
									lat,
									lng,
									addr,
								});
							},
						},
					},
					icon: vm.map.icon(
						{
							name: "truck",
						},
						{
							fillColor: color,
						}
					),
				},
				{ position: true, zoom: 14 }
			);

			oVehicle.mapMarker.openPopup();

			// $('.container').on('click', '.location', function (e) {
			// 	vm.map.event.onButtonClickEvent();
			// });

			trackingVehicle();
			getLivetrackVehicleDataInThreeMinutes();
			trackingVehicle(true, oVehicle);
		}

		function getplayData() {
			let playBack = {};
			playBack.request = "playback";
			playBack.version = 2;
			playBack.device_id = vm.trip.vehicle.device_imei;

			playBack.start_time = vm.trip.start_date;

			playBack.end_time = vm.trip.end_date || new Date();

			playBack.selected_uid = $scope.$clientConfigs.gpsId;
			playBack.login_uid = $scope.$clientConfigs.gpsId;
			if (vm.map) vm.map.reset();
			trackingVehicle();
			getLivetrackVehicleDataInThreeMinutes();

			gpsSocketService.getplayData(playBack, playBackResponse);

			function playBackResponse(oRes) {
				if (oRes && oRes.status === "OK") {
					let data = oRes.data;
					vm.playbackRes = oRes;
					vm.playbackRes.data = vm.playbackRes.data.filter(
						(oPoint) => typeof oPoint.drive != "undefined" && oPoint.stop
					);
					for (let i = 0; i < data.length; i++) {
						data[i].start_time_cal = data[i].start_time;
						data[i].end_time_cal = data[i].end_time;
						data[i].start_time = moment(data[i].start_time).format("LLL");
						data[i].end_time = moment(data[i].end_time).format("LLL");
						if (data[i].duration) {
							data[i].duration = data[i].duration / 3600;
							data[i].duration = data[i].duration.toFixed(2);
							data[i].duration = parseFloat(data[i].duration);
						}
						if (data[i].distance) {
							data[i].distance = data[i].distance / 1000;
							data[i].distance = data[i].distance.toFixed(2);
						}
						data[i].points = data[i].points || [];
					}
					if (oRes.tot_dist) {
						oRes.tot_dist = oRes.tot_dist / 1000;
						oRes.tot_dist = oRes.tot_dist.toFixed(2);
					}

					let coord = [];
					let landMarkCoord = [];
					let coordPointer = 0;

					data.forEach((oPoint, i) => {
						let tDrive = oPoint.drive ? "start" : "stop";

						if (i == 0) tDrive = oPoint.drive ? "start" : "stop";
						else if (i === data.length - 1)
							tDrive = oPoint.drive ? "stop" : "start";

						oPoint.tDrive = tDrive;

						coord[coordPointer] = coord[coordPointer] || [];
						if (oPoint.drive) {
							oPoint.points.forEach((ping, i) => {
								// console.log(utils.getDistanceInKm(ping.lat, ping.lng, coord[coordPointer][coord[coordPointer].length-1][1], coord[coordPointer][coord[coordPointer].length-1][2]));
								if (
									coord[coordPointer].length
										? utils.getDistanceInKm(
												ping.lat,
												ping.lng,
												coord[coordPointer][coord[coordPointer].length - 1][1],
												coord[coordPointer][coord[coordPointer].length - 1][2]
										  ) <= 10
										: true
								)
									coord[coordPointer].push([
										oPoint.drive,
										ping.lat,
										ping.lng,
										oPoint,
									]);
								else {
									coord[++coordPointer] = [];
									coord[coordPointer].push([
										oPoint.drive,
										ping.lat,
										ping.lng,
										oPoint,
									]);
								}
							});
						} else {
							if (oPoint.lmark && oPoint.landmark) {
								landMarkCoord.push({
									position: {
										lat: oPoint.lmark.latitude,
										lng: oPoint.lmark.longitude,
									},
									popup: {
										on: "click",
										content: oPoint.landmark,
									},
									icon: vm.map.icon({ name: "greenMarker" }),
								});
							}
							// console.log(utils.getDistanceInKm(oPoint[tDrive].latitude, oPoint[tDrive].longitude, coord[coordPointer][coord[coordPointer].length-1][1], coord[coordPointer][coord[coordPointer].length-1][2]));
							if (
								coord[coordPointer].length
									? utils.getDistanceInKm(
											oPoint[tDrive].latitude,
											oPoint[tDrive].longitude,
											coord[coordPointer][coord[coordPointer].length - 1][1],
											coord[coordPointer][coord[coordPointer].length - 1][2]
									  ) <= 10
									: true
							)
								coord[coordPointer].push([
									oPoint.drive,
									oPoint[tDrive].latitude,
									oPoint[tDrive].longitude,
									oPoint,
								]);
							else {
								coord[++coordPointer] = [];
								coord[coordPointer].push([
									oPoint.drive,
									oPoint[tDrive].latitude,
									oPoint[tDrive].longitude,
									oPoint,
								]);
							}
						}
					});

					let counter = 1;
					coord.forEach((aCord) => {
						aCord.slice(1, -1).forEach((o) => {
							if (!o[0]) {
								o[3].counter = counter;
								o[3].marker = vm.map.marker.add(
									{
										position: {
											lat: o[3][o[3].tDrive].latitude,
											lng: o[3][o[3].tDrive].longitude,
										},
										label: o[3].counter + "",
										popup: {
											on: "click",
											content:
												o[3][o[3].tDrive + "_addr"] +
													`<span>&nbsp;<span uib-tooltip="Add"
							             tooltip-placement="bottom"
							             data-lat="${o[3][o[3].tDrive].latitude}"
										 data-lng="${o[3][o[3].tDrive].longitude}"
										 data-addr="${o[3][o[3].tDrive + "_addr"]}"
                        	             class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark"></span>&nbsp;
					                     </span>` || "NA",
											buttonEvent: {
												selector: `.addLandMark-${counter}`,
												onClick: function (lat, lng, addr) {
													vm.addMarkerLandmark({
														lat,
														lng,
														addr,
													});
												},
											},
											callback: function () {
												$("#playbackDetail").animate(
													{
														scrollTop:
															$(`#stop${o[3].counter}`).position().top +
															37 /*- $(`#stop${o[3].counter}`).height()*/,
													},
													2000
												);
											},
										},
									},
									{
										cluster: false,
									}
								);

								counter++;
							}
						});
					});

					coord[0][0][3].counter = 0;
					coord[0][0][3].marker = vm.map.marker.add(
						{
							position: {
								lat: coord[0][0][3][coord[0][0][3].tDrive].latitude,
								lng: coord[0][0][3][coord[0][0][3].tDrive].longitude,
							},
							icon: vm.map.icon({ name: "start" }),
							popup: {
								on: "click",
								content: `<b>Start Point</b><br>${
									coord[0][0][3][coord[0][0][3].tDrive + "_addr"] || "NA"
								}
						                 <span uib-tooltip="Add"
							             tooltip-placement="bottom"
							             data-lat="${coord[0][0][3][coord[0][0][3].tDrive].latitude}"
										 data-lng="${coord[0][0][3][coord[0][0][3].tDrive].longitude}"
										 data-addr="${coord[0][0][3][coord[0][0][3].tDrive + "_addr"]}"
						class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark"></span>&nbsp;
					                     </span>`,
								buttonEvent: {
									selector: ".addLandMark",
									onClick: function (lat, lng, addr) {
										vm.addMarkerLandmark({
											lat,
											lng,
											addr,
										});
									},
								},
								callback: function () {
									$("#playbackDetail").animate(
										{
											scrollTop: $(`#stop${coord[0][0][3].counter}`).position()
												.top /*- $(`#stop${coord[0][0][3].counter}`).height()*/,
										},
										2000
									);
								},
							},
						},
						{
							cluster: false,
						}
					);

					coord[coord.length - 1][
						coord[coord.length - 1].length - 1
					][3].marker = vm.map.marker.add(
						{
							position: {
								lat: coord[coord.length - 1][
									coord[coord.length - 1].length - 1
								][3][
									coord[coord.length - 1][coord[coord.length - 1].length - 1][3]
										.tDrive
								].latitude,
								lng: coord[coord.length - 1][
									coord[coord.length - 1].length - 1
								][3][
									coord[coord.length - 1][coord[coord.length - 1].length - 1][3]
										.tDrive
								].longitude,
							},
							icon: vm.map.icon({ name: "stop" }),
							popup: {
								on: "click",
								content: `<b>End Point</b><br>${
									coord[coord.length - 1][
										coord[coord.length - 1].length - 1
									][3][
										coord[coord.length - 1][
											coord[coord.length - 1].length - 1
										][3].tDrive + "_addr"
									] || "NA"
								}
						                 <span uib-tooltip="Add"
							             tooltip-placement="bottom"
							             data-lat="${
															coord[coord.length - 1][
																coord[coord.length - 1].length - 1
															][3][
																coord[coord.length - 1][
																	coord[coord.length - 1].length - 1
																][3].tDrive
															].latitude
														}"
										 data-lng="${
												coord[coord.length - 1][
													coord[coord.length - 1].length - 1
												][3][
													coord[coord.length - 1][
														coord[coord.length - 1].length - 1
													][3].tDrive
												].longitude
											}"
										 data-addr="${
												coord[coord.length - 1][
													coord[coord.length - 1].length - 1
												][3][
													coord[coord.length - 1][
														coord[coord.length - 1].length - 1
													][3].tDrive + "_addr"
												] || "NA"
											}"
                        	             class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark"></span>&nbsp;
					                     </span>`,
								buttonEvent: {
									selector: ".addLandMark",
									onClick: function (lat, lng, addr) {
										vm.addMarkerLandmark({
											lat,
											lng,
											addr,
										});
									},
								},
								callback: function () {
									$("#playbackDetail").animate(
										{
											scrollTop: $(
												`#stop${
													coord[coord.length - 1][
														coord[coord.length - 1].length - 1
													][3].counter
												}`
											).position()
												.top /*- $(`#stop${coord[coord.length-1][coord[coord.length-1].length-1][3].counter}`).height()*/,
										},
										2000
									);
								},
							},
						},
						{
							cluster: false,
						}
					);

					vm.playbackRes.num_stops = counter - 1;

					landMarkCoord.forEach((o) => {
						vm.map.marker.add(o);
					});

					coord.forEach((aCord, index) => {
						vm.map.polyline.add(
							aCord.map((o) => ({ lat: o[1], lng: o[2] })),
							{ position: true }
						);
						if (aCord && coord[index + 1]) {
							let start = aCord.slice(-1)[0];
							let end = coord[index + 1].slice(0, 1)[0];
							vm.map.polyline.plotInBetween(
								{ lat: start[1], lng: start[2] },
								{ lat: end[1], lng: end[2] }
							);
						}
					});
				}
			}
		}

		//////////////////////////////////////////////////
		function plotMarkerOnMap(data) {
			if (data && data.length > 0) {
				let aMarkerCluster = [];

				for (let i = 0; i < data.length; i++) {
					if (!data[i].vehicle.gpsData) continue;

					if (data[i].vehicle.gpsData.lat && data[i].vehicle.gpsData.lng) {
						let color;
						switch (data[i].vehicle.gpsData.status) {
							case "running":
								color = "#15e425";
								break;
							case "online":
								color = "#15e425";
								break;
							case "stopped":
								color = "#FF0000";
								break;
							default:
								color = "#808080";
								break;
						}
						aMarkerCluster.push({
							position: {
								lat: data[i].vehicle.gpsData.lat,
								lng: data[i].vehicle.gpsData.lng,
							},
							content: data[i].vehicle.vehicle_reg_no,
							popup: {
								on: "click",
								content: `
								<span>${data[i].vehicle.vehicle_reg_no}
									<span uib-tooltip="Add"
										tooltip-placement="bottom"
										data-lat="${data[i].vehicle.gpsData.lat}"
										 data-lng="${data[i].vehicle.gpsData.lng}"
										 data-addr="${data[i].vehicle.gpsData.address}"
										class="zmdi zmdi-pin-drop zmdi-hc-fw pointer addLandMark-${i}"></span>&nbsp;
								</span>`,
								buttonEvent: {
									selector: `.addLandMark-${i}`,
									onClick: function (lat, lng, addr) {
										vm.addMarkerLandmark({
											lat,
											lng,
											addr,
										});
									},
								},
							},
							icon: vm.map.icon(
								{
									name: "truck",
								},
								{
									fillColor: color,
								}
							),
						});
					}
				}

				vm.map.cluster(aMarkerCluster);
			} else {
			}
		}

		function removeAllMarkerOnMap() {
			if ($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.map) {
				$rootScope.maps.map.removeLayer($rootScope.maps.clusterL);
				$rootScope.maps.clusterL = utils.initializeCluster(map);
			}
		}

		function placeMarker(oVehicle) {
			if (!oVehicle.lng || !oVehicle.lat) return;
			vm.mapTooltTip.marker.removeAll();
			vm.mapTooltTip.marker.add(
				{ lat: oVehicle.lat, lng: oVehicle.lng },
				{ position: true }
			);
		}
	}
);

materialAdmin.controller(
	"playbackPopUpCtrl",
	function (
		$rootScope,
		$modal,
		$modalInstance,
		$scope,
		$rootScope,
		$filter,
		$timeout,
		$interval,
		$localStorage,
		growlService,
		utils,
		DateUtils,
		$uibModalInstance,
		objToCsv,
		gpsSocketService,
		thatTrip
	) {
		let vm = this;
		vm.closeModal = closeModal;
		vm.playB = playB;
		vm.showAlerts=showAlerts;
		vm.thatTrip = thatTrip;
		vm.againInitialiseCtrl = againInitialiseCtrl;
		$scope.showDiv = false;
		var map = null;
		(function init() {
			playB();
		})();

		function playB() {
			$rootScope.playData = {};
			let tripStartDate = false;
			let tripEndDate = false;
			if ($filter("filter")(thatTrip.statuses, { status: "Trip started" })[0]) {
				tripStartDate = $filter("filter")(thatTrip.statuses, {
					status: "Trip started",
				})[0].date;
			} else {
				swal("Trip has no start date");
			}
			if ($filter("filter")(thatTrip.statuses, { status: "Trip ended" })[0]) {
				tripEndDate = $filter("filter")(thatTrip.statuses, {
					status: "Trip ended",
				})[0].date;
			} else {
				tripEndDate = new Date();
			}
			let imei = thatTrip.vehicle && thatTrip.vehicle.device_imei;
			if (tripStartDate && tripEndDate && imei) {
				$rootScope.reportData = [];

				var playBack = {};
				playBack.request = "playback";
				playBack.version = 2;
				playBack.device_id = imei;
				playBack.start_time = tripStartDate;
				playBack.end_time = tripEndDate;

				$rootScope.selectedDevicekGlobalData = $scope.selTruck;
				gpsSocketService.getplayData(playBack, playBackResponse);

				$rootScope.loader = true;
				$timeout(function () {
					$rootScope.loader = false;
				}, 50000);
			} else {
				swal(
					"Please Trip start or Trip end date or device imei no are not found."
				);
			}
		}
		function closeModal() {
			$modalInstance.dismiss();
		}
		function playBackResponse(response) {
			var oRes = response;
			vm.playbackRes = oRes;
			$rootScope.loader = false;

			if (oRes) {
				if (oRes.status === "OK") {
					for (var i = 0; i < (oRes.data && oRes.data.length); i++) {
						oRes.data[i].start_time_cal = oRes.data[i].start_time;
						oRes.data[i].end_time_cal = oRes.data[i].end_time;
						oRes.data[i].start_time = moment(oRes.data[i].start_time).format(
							"LLL"
						);
						oRes.data[i].end_time = moment(oRes.data[i].end_time).format("LLL");
						if (oRes.data[i].duration) {
							oRes.data[i].duration = oRes.data[i].duration / 3600;
							oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
							oRes.data[i].duration = parseFloat(oRes.data[i].duration);
						}
						if (oRes.data[i].distance) {
							oRes.data[i].distance = oRes.data[i].distance / 1000;
							oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
						}
					}
					if (oRes.tot_dist) {
						oRes.tot_dist = oRes.tot_dist / 1000;
						oRes.tot_dist = oRes.tot_dist.toFixed(2);
					}
					$rootScope.playData = oRes;
					againInitialiseCtrl();
					// $state.go('gps.playPosition', {
					// 	data: {
					// 		oRes
					// 	}
					// });
				} else if (oRes.status === "ERROR") {
					//swal(oRes.message, "", "error");
				}
			}
		}



		function onMarkerClick(e) {
			console.log(e);
		}
		function showAlerts() {
			if (vm.alertStatus) {
				let imei = thatTrip.vehicle && thatTrip.vehicle.device_imei;
				if (tripStartDate && tripEndDate && imei) {
					var alert = {};
					alert.imei = [imei];
					alert.from = tripStartDate;
					alert.to = tripEndDate;
					gpsSocketService.getAlertData(alert, alertResponse);
				}
				function alertResponse(response) {
					let data = response;
					var LeafIcon = L.Icon.extend({
						options: {
							iconSize: [36, 45],
							iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
							popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
						},
					});
					data.forEach((point)=>{
					let alertIcon = new LeafIcon({ iconUrl: "img/bell.png" });
					var alertPopup ='<div class="map-popup">'+
					'<p> Alert Type: <span>'+ point.code +'</span></p>'+
					'<p> Time: <span>'+ moment(point.datetime).format("LLL")  +'</span></p>'+
					'</div>';
						if (point.location) {
							let pointLatLng = new L.LatLng(point.location.lat, point.location.lng);
							let alertMarker = L.marker(pointLatLng,{icon: alertIcon}).bindPopup(alertPopup).on('click',onMarkerClick);
							alertMarker.addTo(map);
						}
					});
				}
			}
		};



		$scope.playData = $rootScope.playData;
		function againInitialiseCtrl() {
			$rootScope.showSideBar = false;
			$rootScope.states = {};
			$rootScope.states.actItm = "playback";
			if (!$rootScope.selectedUser) {
				$rootScope.selectedUser = $localStorage.user;
			}

			//*************** custome Date time Picker for multiple date selection in single form ************
			$scope.today = function () {
				$scope.dt = new Date();
			};
			$scope.today();

			$scope.toggleMinMaxDate = function (type) {
				$scope.dateOptions1.maxDate = $scope.end_date_cal || new Date();
				$scope.dateOptions2.minDate = $scope.start_date_cal || new Date();
			};
			//$scope.toggleMin();

			$scope.open = function ($event, opened) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope[opened] = true;
			};

			$scope.dateOptions1 = {
				//dateDisabled: disabled,
				formatYear: "yy",
				maxDate: $scope.end_date_cal || new Date(),
				//minDate: $scope.minDate ? null : new Date(),
				startingDay: 1,
			};
			$scope.dateOptions2 = {
				//dateDisabled: disabled,
				formatYear: "yy",
				maxDate: new Date(),
				minDate: $scope.start_date_cal || new Date(),
				startingDay: 1,
			};

			$scope.formats = [
				"dd-MMM-yyyy",
				"dd-MMMM-yyyy",
				"yyyy/MM/dd",
				"dd.MM.yyyy",
				"shortDate",
			];
			$scope.format = $scope.formats[0];
			$scope.format = DateUtils.format;
			$scope.formateDate = function (date) {
				return new Date(date).toDateString();
			};
			//********************/end/**********************//*****************//

			$scope.aHours = [];
			for (var h = 0; h < 24; h++) {
				$scope.aHours[h] = h;
			}
			$scope.aMinutes = [];
			for (var m = 0; m < 60; m++) {
				$scope.aMinutes[m] = m;
			}
			//************* custome Date time Picker for multiple date selection in single form ******************

			$scope.wrongDateRange = false;
			var dateTimeStart;
			var dateTimeEnd;
			$scope.getNoti = function () {
				if ($scope.dateTimeStart && $scope.dateTimeEnd) {
					if ($scope.dateTimeEnd > $scope.dateTimeStart) {
						$scope.wrongDateRange = false;
						dateTimeStart = $scope.dateTimeStart;
						dateTimeEnd = $scope.dateTimeEnd;
					} else {
						$scope.wrongDateRange = true;
					}
				}
			};
			$scope.hourSel1 = 0;
			$scope.hourSel2 = 0;
			$scope.minuteSel1 = 0;
			$scope.minuteSel2 = 0;

			/**
			 * Convert seconds to hh-mm-ss format.
			 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
			 **/
			var SecondsTohhmmss = function (totalSeconds) {
				totalSeconds = totalSeconds * 3600;
				var hours = Math.floor(totalSeconds / 3600);
				var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
				var seconds = totalSeconds - hours * 3600 - minutes * 60;

				// round seconds
				seconds = Math.round(seconds * 100) / 100;

				var result = (hours < 10 ? "0" + hours : hours) + " hours ";
				result += (minutes < 10 ? "0" + minutes : minutes) + " minutes ";
				//result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
				return result;
			};

			$scope.slider = {
				value: 40,
				options: {
					floor: 10,
					ceil: 100,
					step: 10,
					showSelectionBar: true,
					getSelectionBarColor: function (value) {
						if (value <= 30) return "#2AE02A";
						if (value <= 50) return "yellow";
						if (value <= 70) return "orange";
						return "red";
					},
				},
			};
			//**********secnds into hours minutes seconds end **********//

			if (
				$localStorage.onLocalselectedUser &&
				$localStorage.onLocalselectedUser.devices
			) {
				for (
					var j = 0;
					j < $localStorage.onLocalselectedUser.devices.length;
					j++
				) {
					if (
						$localStorage.onLocalselectedUser.devices[j].imei ===
						$rootScope.playData.device_id
					) {
						$rootScope.playData.reg_no =
							$localStorage.onLocalselectedUser.devices[j].reg_no;
					}
				}
			} else {
				for (
					var j = 0;
					j < $localStorage.user &&
					$localStorage.user.devices &&
					$localStorage.user.devices.length;
					j++
				) {
					if (
						$localStorage.user.devices[j].imei === $rootScope.playData.device_id
					) {
						$rootScope.playData.reg_no = $localStorage.user.devices[j].reg_no;
					}
				}
			}
			$scope.aPlayPosiData = $rootScope.playData && $rootScope.playData.data;
			var p = $scope.aPlayPosiData && $scope.aPlayPosiData.length - 1;
			$scope.firstLocation = $scope.aPlayPosiData && $scope.aPlayPosiData[0]; //first location data
			$scope.lastLocation = $scope.aPlayPosiData && $scope.aPlayPosiData[p]; //last location data

			//*********************//
			var id = document.getElementById("playMap");

			if (id && id.children.length > 0) {
				if ($rootScope.countPlay === 2) {
					var ccc =
						"<div id='" +
						$rootScope.countPlay +
						"' style='width: 100%; height: 100%;'></div>";
					document.getElementById("playMap").innerHTML = ccc;
				} else {
					var minusCount = $rootScope.countPlay - 1;
					document.getElementById(minusCount.toString()).innerHTML =
						"<div id='" +
						$rootScope.countPlay +
						"' style='width: 100%; height: 100%;'></div>";
				}
				map = utils.initializeMapView(
					$rootScope.countPlay.toString(),
					false,
					false
				).map;
			} else {
				 map = utils.initializeMapView("pbpMap", false, false).map;
				$rootScope.countPlay = 1;
			}

			function getSVG() {
				var iColor = "#15e425";
				var svgCode = utils.takeIcon(
					$rootScope.selectedDevicekGlobalData &&
						$rootScope.selectedDevicekGlobalData.icon,
					iColor
				);
				return "data:image/svg+xml;charset=UTF-8;base64," + btoa(svgCode);
			}

			function getLineIconSvg(color) {
				var iColor = color || "blue";
				var svgCode = utils.lineMarkerSvg(iColor);
				return "data:image/svg+xml;charset=UTF-8;base64," + btoa(svgCode);
			}

			var LeafIcon = L.Icon.extend({
				options: {
					iconSize: [36, 45],
					iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
					popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
				},
			});

			var lineIconOptions = L.Icon.extend({
				options: {
					iconSize: [15, 15],
					iconAnchor: [7.5, 7.5],
				},
			});

			var runIconLeaf = L.Icon.extend({
				options: {
					iconSize: [50, 50],
					iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
					popupAnchor: [0, -51], // point from which the popup should open relative to the iconAnchor
				},
			});

			var startIcon = new LeafIcon({ iconUrl: "img/start.png" }),
				stopIcon = new LeafIcon({ iconUrl: "img/stop.png" }),
				lineIcon = new lineIconOptions({ iconUrl: getLineIconSvg() }),
				runIcon = new runIconLeaf({ iconUrl: getSVG() }),
				flagIcon = new LeafIcon({ iconUrl: "img/stopFlag.png" }),
				h = $scope.aPlayPosiData && $scope.aPlayPosiData.length - 1;

			//map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
			var polylinePoints = [];
			$scope.newDriveAllPoints = [];
			var arrLatLng = [];

			var pointA = new L.LatLng(
				$scope.aPlayPosiData &&
					$scope.aPlayPosiData[0] &&
					$scope.aPlayPosiData[0].start &&
					$scope.aPlayPosiData[0].start.latitude,
				$scope.aPlayPosiData &&
					$scope.aPlayPosiData[0] &&
					$scope.aPlayPosiData[0].start &&
					$scope.aPlayPosiData[0].start.longitude
			);
			polylinePoints.push(pointA);
			arrLatLng.push([
				$scope.aPlayPosiData[0].start.latitude,
				$scope.aPlayPosiData[0].start.longitude,
			]);
			$scope.newDriveAllPoints.push($scope.aPlayPosiData[0]);
			for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
				if ($scope.aPlayPosiData[i].drive === false) {
					var pointmid = new L.LatLng(
						$scope.aPlayPosiData[i].stop.latitude,
						$scope.aPlayPosiData[i].stop.longitude
					);
					polylinePoints.push(pointmid);
					arrLatLng.push([
						$scope.aPlayPosiData[i].stop.latitude,
						$scope.aPlayPosiData[i].stop.longitude,
					]);
					$scope.newDriveAllPoints.push($scope.aPlayPosiData[i]);
					var stopPopup =
						'<div class="map-popup">' +
						'<p class="pp-hd">Stop Info</p>' +
						"<p>Strt Time: <span>" +
						$scope.aPlayPosiData[i].start_time +
						"</span></p>" +
						"<p>End Time: <span>" +
						$scope.aPlayPosiData[i].end_time +
						"</span></p>" +
						"<p>Residence : <span>" +
						SecondsTohhmmss($scope.aPlayPosiData[i].duration) +
						"</span></p>" +
						"<p>Address &nbsp;&nbsp;&nbsp; : <span>" +
						$scope.aPlayPosiData[i].start_addr +
						"</span></p>" +
						"<p>Nearest Landmark : <span>" +
						$scope.aPlayPosiData[i].NearLandMark +
						"</span></p>" +
						"</div>";
					var marker = L.marker(
						[
							$scope.aPlayPosiData &&
								$scope.aPlayPosiData[i] &&
								$scope.aPlayPosiData[i].stop &&
								$scope.aPlayPosiData[i].stop.latitude,
							$scope.aPlayPosiData &&
								$scope.aPlayPosiData[i] &&
								$scope.aPlayPosiData[i].stop &&
								$scope.aPlayPosiData[i].stop.longitude,
						],
						{ icon: flagIcon }
					)
						.bindPopup(stopPopup)
						.openPopup()
						.on("click", onMarkerClick);
					marker.addTo(map);
				}
				//else {
				if (
					$scope.aPlayPosiData[i].points &&
					$scope.aPlayPosiData[i].points.length > 0
				) {
					for (var q = 0; q < $scope.aPlayPosiData[i].points.length; q++) {
						var pointX = new L.LatLng(
							$scope.aPlayPosiData[i].points[q].lat,
							$scope.aPlayPosiData[i].points[q].lng
						);
						polylinePoints.push(pointX);
						arrLatLng.push([
							$scope.aPlayPosiData[i].points[q].lat,
							$scope.aPlayPosiData[i].points[q].lng,
						]);
						$scope.newDriveAllPoints.push($scope.aPlayPosiData[i].points[q]);
					}
				}
				//}
			}
			var startPoint = $scope.aPlayPosiData[0],
				endPoint = $scope.aPlayPosiData[h],
				title = "start point";

			var startPopup =
				'<div class="map-popup">' +
				'<p class="pp-hd">Start Info</p>' +
				"<p>Start Time: <span>" +
				$scope.firstLocation.start_time +
				"</span></p>" +
				"</div>";
			var endPopup =
				'<div class="map-popup">' +
				'<p class="pp-hd">End Info</p>' +
				"<p>End Time: <span>" +
				$scope.lastLocation.end_time +
				"</span></p>" +
				"</div>";
			var arrowPopup = function (date) {
				return (
					'<div class="map-popup">' +
					"<p>" +
					moment(date).format("LLL") +
					"</p>" +
					"</div>"
				);
			};

			L.marker(
				[
					startPoint.lat || (startPoint.start && startPoint.start.latitude),
					startPoint.lng || (startPoint.start && startPoint.start.longitude),
				],
				{ icon: startIcon }
			)
				.bindPopup(startPopup)
				.openPopup()
				.on("click", onMarkerClick)
				.addTo(map);
			L.marker(
				[
					endPoint.lat || (endPoint.stop && endPoint.stop.latitude),
					endPoint.lng || (endPoint.stop && endPoint.stop.longitude),
				],
				{ icon: stopIcon }
			)
				.bindPopup(endPopup)
				.openPopup()
				.on("click", onMarkerClick)
				.addTo(map);

			//Define an array of Latlng objects (points along the line)
			var polylineOptions = {
				color: "blue",
				weight: 5,
				opacity: 0.4,
			};
			var fixedPolylineOptions = {
				color: "green",
				weight: 5,
				opacity: 0.6,
			};
			var fixedPolylineLayer = new L.layerGroup().addTo(map);
			var fixedPolyline = new L.Polyline(polylinePoints, fixedPolylineOptions);
			fixedPolylineLayer.addLayer(fixedPolyline);

			var lineLayer = new L.layerGroup().addTo(map);
			var polyline = new L.Polyline([], polylineOptions);

			// add arrow marker to the map line
			var arrowMarkerList = [],
				arrowLineMarker;
			var skipThreshold = 5;
			var skip = 5; //parseInt($scope.newDriveAllPoints.length/5);
			for (var i = 0; i < $scope.newDriveAllPoints.length; i += skip) {
				arrowLineMarker = L.marker(
					[
						$scope.newDriveAllPoints[i].lat ||
							$scope.newDriveAllPoints[i].start.latitude,
						$scope.newDriveAllPoints[i].lng ||
							$scope.newDriveAllPoints[i].start.longitude,
					],
					{ icon: new lineIconOptions({ iconUrl: getLineIconSvg("green") }) }
				);
				arrowLineMarker.setRotationAngle(
					$scope.newDriveAllPoints[i].course || 90
				);
				fixedPolylineLayer.addLayer(arrowLineMarker);
			}

			//map.addLayer(fixedPolyline);
			lineLayer.addLayer(polyline);

			var runMarker = L.marker(
				[
					$scope.newDriveAllPoints[0].lat ||
						$scope.newDriveAllPoints[0].start.latitude,
					$scope.newDriveAllPoints[0].lng ||
						$scope.newDriveAllPoints[0].start.longitude,
				],
				{ icon: runIcon }
			).addTo(map);
			runMarker.setRotationAngle($scope.newDriveAllPoints[0].course || 90);

			// zoom the map to the polyline
			map.fitBounds(fixedPolyline.getBounds());

			//map.fitBounds(arrLatLng);

			function onMarkerClick(e) {
				console.log(this.options);
			}

			//************************//
			$scope.start_date_cal = $scope.aPlayPosiData[0].start_time_cal; //for inner calander
			$scope.end_date_cal = $scope.aPlayPosiData[h].end_time_cal; //for inner calander
			var sDT = new Date($scope.aPlayPosiData[0].start_time_cal);
			$scope.start_date_cal = sDT;
			$scope.hourSel1 = sDT.getHours();
			$scope.minuteSel1 = sDT.getMinutes();

			var eDT = new Date($scope.aPlayPosiData[h].end_time_cal);
			$scope.end_date_cal = eDT;
			$scope.hourSel2 = eDT.getHours();
			$scope.minuteSel2 = eDT.getMinutes();

			$scope.totalDistance = 0;

			for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
				if ($scope.aPlayPosiData[i]) {
					$scope.totalDistance =
						$scope.totalDistance + parseFloat($scope.aPlayPosiData[i].distance);
				}
			}
			$scope.totalDistance = $scope.totalDistance.toFixed(2);
			//$scope.totalDistance = $scope.totalDistance/1000;
			$scope.playData.tot_dist = $scope.totalDistance;

			//********play marker ************/
			$scope.showStop = false;
			$scope.showPlay = true;
			$scope.watchSlider = false;
			var runningMarkers = [];
			var flightPath;
			var stop;
			var markerOk;
			$scope.play = function () {
				$scope.showPlay = false;
				$scope.showStop = true;
				$scope.watchSlider = true;
				if (angular.isDefined(stop)) return;
				$scope.$watch("slider.value", function () {
					if ($scope.watchSlider) {
						$interval.cancel(stop);
						if ($scope.slider.value === 10) {
							$scope.speedControll = 100 * 10;
						} else if ($scope.slider.value === 20) {
							$scope.speedControll = 200 * 4;
						} else if ($scope.slider.value === 30) {
							$scope.speedControll = 300 * 2;
						} else if ($scope.slider.value === 40) {
							$scope.speedControll = 400 * 1;
						} else if ($scope.slider.value === 50) {
							$scope.speedControll = 500 / 5;
						} else if ($scope.slider.value === 60) {
							$scope.speedControll = 600 / 10;
						} else if ($scope.slider.value === 70) {
							$scope.speedControll = 700 / 15;
						} else if ($scope.slider.value === 80) {
							$scope.speedControll = 800 / 20;
						} else if ($scope.slider.value === 90) {
							$scope.speedControll = 900 / 25;
						} else if ($scope.slider.value === 100) {
							$scope.speedControll = 1000 / 30;
						}
						stop = $interval(doSomething, $scope.speedControll);
					}
				});

				stop = $interval(doSomething, $scope.speedControll);
			};
			var i = 0;
			var ppline = [],
				linePoints;

			function doSomething() {
				if (i < $scope.newDriveAllPoints.length) {
					if (
						($scope.newDriveAllPoints[i].lat ||
							$scope.newDriveAllPoints[i].start.latitude) &&
						($scope.newDriveAllPoints[i].lng ||
							$scope.newDriveAllPoints[i].start.longitude)
					) {
						$scope.newDriveAllPoints[i].average_speed =
							$scope.newDriveAllPoints[i].speed ||
							$scope.newDriveAllPoints[i].top_speed;

						if (map.hasLayer(fixedPolylineLayer)) {
							fixedPolylineLayer.remove();
						}
						if ($scope.newDriveAllPoints[i].drive === false) {
							linePoints = {
								lat:
									$scope.newDriveAllPoints[i].lat ||
									$scope.newDriveAllPoints[i].stop.latitude,
								lng:
									$scope.newDriveAllPoints[i].lng ||
									$scope.newDriveAllPoints[i].stop.longitude,
							};
						} else {
							linePoints = {
								lat:
									$scope.newDriveAllPoints[i].lat ||
									$scope.newDriveAllPoints[i].start.latitude,
								lng:
									$scope.newDriveAllPoints[i].lng ||
									$scope.newDriveAllPoints[i].start.longitude,
							};
						}

						polyline.addLatLng(linePoints);

						$scope.speedChange = parseFloat(
							Math.round($scope.newDriveAllPoints[i].average_speed * 100) / 100
						).toFixed(2);
						if ($scope.newDriveAllPoints[i].cum_dist) {
							$scope.runningDistance =
								$scope.newDriveAllPoints[i].cum_dist / 1000;
							$scope.runningDistance = $scope.runningDistance.toFixed(2);
						}

						$scope.dateChange = moment(
							$scope.newDriveAllPoints[i].datetime ||
								$scope.newDriveAllPoints[i].start_time
						).format("LLL");

						var newLatLng = new L.LatLng(
							$scope.newDriveAllPoints[i].lat ||
								$scope.newDriveAllPoints[i].start.latitude,
							$scope.newDriveAllPoints[i].lng ||
								$scope.newDriveAllPoints[i].start.longitude
						);
						runMarker.setLatLng(newLatLng);
						runMarker.setRotationAngle(
							$scope.newDriveAllPoints[i].course || 90
						);
						vm.speed = $scope.newDriveAllPoints[i].speed || 0;

						if (i % skip === 0) {
							var lineMarker = L.marker(newLatLng, {
								icon: lineIcon,
							}).bindPopup(arrowPopup($scope.newDriveAllPoints[i].datetime));
							lineMarker.setRotationAngle(
								$scope.newDriveAllPoints[i].course || 90
							);
							lineLayer.addLayer(lineMarker);
						}

						runMarker.setZIndexOffset(9999);

						var getzoom = map.getZoom();
						if (getzoom <= 12) {
							map.setZoom(12);
						} else if (getzoom >= 13) {
							map.setZoom(15);
						}
						map.panTo(newLatLng);
					}
					i++;
				} else {
					$scope.stopFight();
				}
			}

			$scope.stopFight = function () {
				$scope.showStop = false;
				$scope.showPlay = true;
				$scope.watchSlider = false;
				if (angular.isDefined(stop)) {
					$interval.cancel(stop);
					stop = undefined;
				}
			};
			$scope.resetFight = function () {
				i = 0;
				var newLatLng = new L.LatLng(
					$scope.newDriveAllPoints[0].lat ||
						$scope.newDriveAllPoints[0].start.latitude,
					$scope.newDriveAllPoints[i].lng ||
						$scope.newDriveAllPoints[i].start.longitude
				);
				runMarker.setLatLng(newLatLng);

				map.removeLayer(lineLayer); // remove polylline for reset
				polyline = new L.Polyline([], polylineOptions); // again add new polyline initialization
				lineLayer = new L.layerGroup([polyline]).addTo(map);

				$scope.stopFight();
			};
			$scope.$on("$destroy", function () {
				// Make sure that the interval is destroyed too
				$scope.stopFight();
			});

			//***********ROUTING line draw****************//
			$scope.clickOnce = true;
			$scope.line = function () {
				if (map.hasLayer(fixedPolylineLayer)) {
					fixedPolylineLayer.remove();
				} else {
					fixedPolylineLayer.addTo(map);
				}
			};
			/***********ROUTING line draw end****************/

			// GET LANDMARKS ARRAY
			var control = L.control.layers(null, null, { collapsed: true });

			control.addTo(map);

			//********play marker ************/

			//PLAYBACK HOME PAGE FUNCTION
			$scope.homePage = function () {
				$rootScope.redirect("/#!/main/user");
			};
			$scope.playBack = function () {
				$rootScope.redirect("/#!/main/playBack");
			};
		}

		function playBackResponseIn(response) {
			var oRes = JSON.parse(response);
			if (oRes) {
				if (oRes.status === "OK") {
					$rootScope.countPlay = $rootScope.countPlay + 1;
					for (var i = 0; i < (oRes.data && oRes.data.length); i++) {
						oRes.data[i].start_time = moment(oRes.data[i].start_time).format(
							"LLL"
						);
						oRes.data[i].end_time = moment(oRes.data[i].end_time).format("LLL");
						if (oRes.data[i].duration) {
							oRes.data[i].duration = oRes.data[i].duration / 3600;
							oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
						}
						if (oRes.data[i].distance) {
							oRes.data[i].distance = oRes.data[i].distance / 1000;
							oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
						}
					}
					$rootScope.playData = oRes;
					$rootScope.againInitialiseCtrl();
				} else if (oRes.status === "ERROR") {
					//swal(oRes.message, "", "error");
				}
			}
		}

		$scope.inPlayBack = function () {
			var newObject = angular.copy($rootScope.playData);
			$scope.selTruck = newObject;
			$rootScope.playData = {};

			if ($scope.start_date_cal && $scope.end_date_cal) {
				//**** custom time add with date ******//
				$scope.start_date_cal = new Date($scope.start_date_cal);
				$scope.end_date_cal = new Date($scope.end_date_cal);
				var xx = $scope.start_date_cal;
				xx.setHours($scope.hourSel1);
				xx.setMinutes($scope.minuteSel1);
				$scope.start_date_cal = xx;
				var yy = $scope.end_date_cal;
				yy.setHours($scope.hourSel2);
				yy.setMinutes($scope.minuteSel2);
				$scope.end_date_cal = yy;

				//**** custom time add with date ******//
				if ($scope.selTruck) {
					$rootScope.reportData = [];

					var playBack = {};
					playBack.request = "playback";
					playBack.version = 2;
					playBack.device_id = $scope.selTruck.device_id;
					playBack.start_time = $scope.start_date_cal;
					playBack.end_time = $scope.end_date_cal;

					gpsSocketService.getplayData(playBack, playBackResponseIn);

					$rootScope.loader = true;
					$timeout(function () {
						$rootScope.loader = false;
					}, 3000);
				} else {
					swal("Please select vehicle ");
				}
			} else {
				swal("Please select date 'from' and 'to' ");
			}
		};

		//*********toggle list view ***********//
		$scope.iconChange = true;
		$scope.toggle = true;

		$scope.$watch("toggle", function () {
			$scope.toggleText = $scope.toggle ? "Show List" : "Track on Map";
		});

		$scope.callFirst = true;

		$scope.showInList = function (tripD) {
			$scope.showDiv = !$scope.showDiv;
			$scope.toggle = !$scope.toggle;
			if ($scope.callFirst === true) {
				document.getElementById("map-togg2").style.display = "none";
				$scope.callFirst = false;
			} else {
				$scope.callFirst = true;
				document.getElementById("map-togg2").style.display = "inline";
			}
		};

		$scope.viewOnMap = function (listData) {
			if (listData.start && listData.start.latitude) {
				listData.reg_no = $rootScope.playData.reg_no;
				$rootScope.sMapViewData = listData;
				var modalInstance = $uibModal.open({
					templateUrl: "views/playback/singleViewOnMap.html",
					controller: "sViewOnMapCtrl",
				});
			}
		};

		$scope.downloadCsv = function (aData) {
			let cnt = 1;
			objToCsv(
				"PlaybackSheet",
				[
					"S.No",
					"Start Time",
					"End Time",
					"Location",
					"Latitude",
					"Longitude",
					"Nearest Landmark",
					"Speed(Kmph)",
					"Duration(Hour)",
					"Distance(Kms)",
				],
				aData.map((o) => {
					let arr = [];
					try {
						arr.push(cnt++ || 0);
					} catch (e) {
						arr.push(0);
					}

					try {
						arr.push((o.start_time && o.start_time.replace(/,/g, " ")) || "NA");
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push((o.end_time && o.end_time.replace(/,/g, " ")) || "NA");
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push((o.start_addr && o.start_addr.replace(/,/g, " ")) || "NA");
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push((o.start && o.start.latitude) || "NA");
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push((o.start && o.start.longitude) || "NA");
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push(
							o.nearest_landmark &&
								o.nearest_landmark.name &&
								o.nearest_landmark.dist
								? o.nearest_landmark.dist / 1000 +
										" KM from " +
										o.nearest_landmark.name
								: "NA"
						);
					} catch (e) {
						arr.push("NA");
					}

					try {
						arr.push(o.top_speed || "0");
					} catch (e) {
						arr.push("0");
					}

					try {
						arr.push(o.duration || "0");
					} catch (e) {
						arr.push("0");
					}

					try {
						arr.push(o.distance || "0");
					} catch (e) {
						arr.push("0");
					}
					return arr;
				})
			);
		};
	}
);

materialAdmin.controller(
	"analyticsPopUpCtrl",
	function (
		$modal,
		$modalInstance,
		$localStorage,
		$rootScope,
		$scope,
		$filter,
		$timeout,
		DatePicker,
		dateUtils,
		tripServices,
		gpsSocketService,
		thatTrip
	) {
		let vm = this;
		vm.closeModal = closeModal;
		vm.getAlert = getAlert;
		vm.thatTrip = thatTrip;
		vm.trip = $rootScope.selectedTrip;
		vm.playB = playB;
		vm.playBackResponse = playBackResponse;

		(function init() {
			vm.showGraph = true;
			vm.arr = [
				{
					name: "Exception Report",
					graphType: [
						{
							type: "pieChart",
							xAxisKey: function (e) {
								return e.code;
							},
							yAxisKey: function (e) {
								return e.count;
							},
						},
					],
					fullscreen: false,
				},
				{
					name: "Running and Stopped Duration",
					graphType: [
						{
							type: "pieChart",
							xAxisKey: function (e) {
								return e.code;
							},
							yAxisKey: function (e) {
								return e.count;
							},
							color: function (e) {
								return e.color;
							},
						},
					],
					fullscreen: false,
				},
			];
			vm.gData = [];
			vm.graphData = [];
			vm.graphData2 = [];
			vm.filter = { type: "" };
			vm.filter.group = "exception";
			vm.DatePicker = angular.copy(DatePicker);
			vm.oReportType = {
				"": "All Exception",
				over_speed: "Overspeed Alert",
				sos: "Panic Alert",
				hb: "Harsh Braking",
				ha: "Rapid Acceleration",
				fw: "Free Wheeling",
				nd: "Night Drive",
				cd: "Continuous Driving",
				idle: "Excessive Idle",
				tl: "Tilt",
				bettery_reconnect: "Power Connect",
				wire_disconnect: "Wire Disconnect",
				power_cut: "Power cut",
				tempering: "Tempering",
				engine_on: "Engine On",
				engine_off: "Engine off",
				emergency: "Emergency",
				low_internal_battery: "Low Battery",
				rfid: "Driver Tag Swiped",
				hb: "Harsh Break",
				ha: "Rapid Acceleration",
				rt: "Harsh Cornering",
				halt: "Halt Alert",
				low_internal_battery: "Low Battery",
			};
			playB();
			getAlert();
		})();

		// Actual Function
		function closeModal() {
			$modalInstance.dismiss();
		}

		function getAlert() {
			let request = {};
			if (vm.trip && vm.trip.vehicle && vm.trip.vehicle.device_imei)
				request.device_imei = vm.trip.vehicle.device_imei;
			if (vm.trip && vm.trip.start_date) {
				request.startDate = vm.trip.start_date;
			}
			if (vm.trip && vm.trip.end_date) {
				request.endDate = vm.trip.end_date;
			} else {
				request.endDate = new Date();
			}
			tripServices.getAlerts(request, function (response) {
				console.log(response.data);
				response.data = response.data && response.data.data;
				response.data.forEach((o) => {
					o.code = vm.oReportType[o.code];
				});
				updateKpi(response.data);
			});
		}

		function updateKpi(data) {
			switch (vm.filter.group) {
				case "day":
				case "month":
					vm.oGraphKpi = {
						name: "Exception Report",
						graphType: [
							{
								type: "multiBarChart",
								stacked: true,
							},
						],
						fullscreen: false,
					};

					let dateWise = {};
					let aDate = [];
					data.forEach((oData) => {
						oData.aCode.forEach((oCode) => {
							dateWise[oCode.code] = dateWise[oCode.code] || {
								key: vm.oReportType[oCode.code],
								values: [],
							};
							dateWise[oCode.code].values.push({
								x: oData.date,
								y: oCode.count,
							});
						});
						aDate.push(oData.date);
					});
					vm.graphData = Object.values(dateWise);
					vm.graphData.forEach((o) => {
						aDate.forEach((date, index) => {
							if (!o.values.find((oVal) => oVal.x === date)) {
								o.values.splice(index, 0, {
									x: date,
									y: 0,
								});
							}
						});
					});

					break;
				case "runningVstopped":
					vm.oGraphKpi = {
						name: "Running and Stopped Duration",
						graphType: [
							{
								type: "pieChart",
								xAxisKey: function (e) {
									return e.code;
								},
								yAxisKey: function (e) {
									return e.count;
								},
								color: function (e) {
									return e.color;
								},
							},
						],
						fullscreen: false,
					};
					vm.graphData2 = data;
					break;
				case "exception":
				default:
					vm.oGraphKpi = {
						name: "Exception Report",
						graphType: [
							{
								type: "pieChart",
								xAxisKey: function (e) {
									return e.code;
								},
								yAxisKey: function (e) {
									return e.count;
								},
							},
						],
						fullscreen: false,
					};
					vm.graphData = data;
			}

			vm.graphApi && vm.graphApi.refresh();
			toggleGraph();
		}

		function toggleGraph() {
			vm.showGraph = false;
			$timeout(function () {
				vm.showGraph = true;
			});
		}

		function playB() {
			$rootScope.playData = {};
			let tripStartDate = false;
			let tripEndDate = false;
			if ($filter("filter")(thatTrip.statuses, { status: "Trip started" })[0]) {
				tripStartDate = $filter("filter")(thatTrip.statuses, {
					status: "Trip started",
				})[0].date;
			} else {
				swal("Trip has no start date");
			}
			if ($filter("filter")(thatTrip.statuses, { status: "Trip ended" })[0]) {
				tripEndDate = $filter("filter")(thatTrip.statuses, {
					status: "Trip ended",
				})[0].date;
			} else {
				tripEndDate = new Date();
			}
			let imei = thatTrip.vehicle && thatTrip.vehicle.device_imei;
			if (tripStartDate && tripEndDate && imei) {
				$rootScope.reportData = [];

				var playBack = {};
				playBack.request = "playback";
				playBack.version = 2;
				playBack.device_id = imei;
				playBack.start_time = tripStartDate;
				playBack.end_time = tripEndDate;

				$rootScope.selectedDevicekGlobalData = $scope.selTruck;
				gpsSocketService.getplayData(playBack, playBackResponse);

				$rootScope.loader = true;
				$timeout(function () {
					$rootScope.loader = false;
				}, 500);
			} else {
				swal(
					"Please Trip start or Trip end date or device imei no are not found."
				);
			}
		}

		function playBackResponse(response) {
			var oRes = response;
			vm.playbackRes = oRes;
			// let running_time = $filter('calHourMinfromSecs')(oRes.dur_wo_stop);
			// let stoppage_time = $filter('calHourMinfromSecs')(oRes.dur_stop)
			let running_percent = oRes.dur_wo_stop / oRes.dur_total;
			let stoppage_percent = oRes.dur_stop / oRes.dur_total;
			let data = [
				{ code: "Running (%)", count: running_percent * 100, color: "green" },
				{ code: "Stopped (%)", count: stoppage_percent * 100, color: "red" },
			];
			vm.gData = [];
			vm.gData[0] = vm.graphData;
			vm.gData[1] = data;
			vm.filter.group = "runningVstopped";
			updateKpi(data);
			$rootScope.loader = false;
		}
	}
);

materialAdmin.controller(
	"myTripCancelCtrl",
	function (
		$rootScope,
		$scope,
		$localStorage,
		Driver,
		growlService,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices
	) {
		//*************** New Date Picker for multiple date selection in single form ************
		$scope.today = function () {
			$scope.dt = new Date();
		};
		if (thatTrip && thatTrip.tripUpdate) $rootScope.tripUpdate = true;
		$scope.today();
		$scope.toggleMin = function () {
			$scope.maxDate = new Date();
			var aloc_date = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2
			var fourtyEight = angular.copy(aloc_date);
			fourtyEight.setDate(fourtyEight.getDate() - 2);
			if (thatTrip && thatTrip.trip_start && thatTrip.trip_start.time) {
				thatTrip.trip_start.time = new Date(thatTrip.trip_start.time);
				aloc_date = thatTrip.trip_start.time;
			} else if (thatTrip && thatTrip.allocation_date) {
				thatTrip.allocation_date = new Date(thatTrip.allocation_date);
				aloc_date = thatTrip.allocation_date;
			}
			if (aloc_date > fourtyEight) {
				aloc_date = aloc_date;
			} else {
				aloc_date = fourtyEight;
			}
			$scope.minDate = new Date(aloc_date);
		};
		$scope.toggleMin();
		$scope.aTripCancelReason = [
			"Vehicle is not availabel.",
			"Driver is not availabel.",
			"Price not match",
			"Other",
		];
		$scope.open = function ($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = true;
		};

		$scope.dateOptions = {
			formatYear: "yy",
			startingDay: 1,
		};

		$scope.formats = [
			"dd-MMM-yyyy",
			"dd-MMMM-yyyy",
			"yyyy/MM/dd",
			"dd.MM.yyyy",
			"shortDate",
		];
		$scope.format = $scope.formats[0];
		//************* New Date Picker for multiple date selection in single form ******************

		$scope.aHours = [];
		for (var h = 0; h < 24; h++) {
			$scope.aHours[h] = h;
		}
		$scope.aMinutes = [];
		for (var m = 0; m < 60; m++) {
			$scope.aMinutes[m] = m;
		}

		$scope.hourSel1 = 0;
		$scope.minuteSel1 = 0;
		if ($scope.minDate) {
			//**** custom time add with date ******//
			var xxx = $scope.minDate;
			$scope.matchDay = xxx.getDate();
			$scope.hour1 = xxx.getHours();
			$scope.matchHour = angular.copy($scope.hour1);
			$scope.minute1 = xxx.getMinutes();
			$scope.matchMinute = angular.copy($scope.minute1);
		}
		$scope.changeTime1 = function (hr) {
			$scope.hourSel1 = hr;
			$scope.changeTime();
		};
		$scope.changeTime2 = function (mt) {
			$scope.minuteSel1 = mt;
			$scope.changeTime();
		};
		$scope.changeTime3 = function (date) {
			$scope.trip.time = date;
			$scope.changeTime();
		};
		$scope.changeTime = function () {
			var yyy = $scope.trip.time;
			$scope.trip_day = yyy.getDate();
			var zzz = new Date();
			$scope.current_day = zzz.getDate();
			$scope.c_hr = zzz.getHours();
			$scope.currentHour = angular.copy($scope.c_hr);
			$scope.c_min = zzz.getMinutes();
			$scope.currentMinute = angular.copy($scope.c_min);
			if ($scope.trip_day == $scope.matchDay) {
				if ($scope.hourSel1 < $scope.matchHour) {
					swal(
						"warning",
						"Please select hour greater then " + $scope.matchHour,
						"warning"
					);
					$scope.hourSel1 = $scope.matchHour;
					$scope.minuteSel1 = $scope.matchMinute;
				} else if ($scope.hourSel1 == $scope.matchHour) {
					if ($scope.minuteSel1 <= $scope.matchMinute) {
						swal(
							"warning",
							"Please select minute greater then " + $scope.matchMinute,
							"warning"
						);
						$scope.minuteSel1 = $scope.matchMinute;
					}
				}
			}
			if ($scope.trip_day == $scope.current_day) {
				if ($scope.hourSel1 > $scope.currentHour) {
					swal(
						"warning",
						"Please select hour less then or equal to " + $scope.currentHour,
						"warning"
					);
					$scope.hourSel1 = $scope.currentHour;
					$scope.minuteSel1 = $scope.currentMinute;
				} else if ($scope.hourSel1 == $scope.currentHour) {
					if ($scope.minuteSel1 > $scope.currentMinute) {
						swal(
							"warning",
							"Please select minute less then or equal to " +
								$scope.currentMinute,
							"warning"
						);
						$scope.minuteSel1 = $scope.currentMinute;
					}
				}
			}
		};

		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};
		var UserDATA = $localStorage.ft_data.userLoggedIn;
		if (UserDATA) {
			$scope.person = UserDATA.full_name;
		}

		if (!thatTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		} else {
			$scope.trip = thatTrip;
		}
		if ($rootScope.tripUpdate) {
			$scope.trip.date = new Date();
			var nDT = $scope.trip.date;
			$scope.hourSel1 = nDT.getHours();
			$scope.minuteSel1 = nDT.getMinutes();

			$scope.isInfo = false;
			$scope.trip.setStatus = "Trip cancelled";

			function success(res) {
				if (
					res &&
					res.data &&
					(res.data.status === "OK" || res.data.success === "OK")
				) {
					$rootScope.selectedTrip.status = res.data.data.status;
					$uibModalInstance.close(res);
					$rootScope.tripUpdate = false;
					var msg = res.data.message;
					swal("Updated", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				growlService.growl(msg, "danger", 2);
			}

			$scope.cancelTripInfo = function () {
				var oSend = {};
				oSend.status = $scope.trip.setStatus;
				oSend.remark = $scope.trip.remark1;
				oSend.reason = $scope.trip.reason1;

				if ($scope.trip.date) {
					/**** custom time add with date ******/
					var xx = $scope.trip.date;
					xx.setHours($scope.hourSel1);
					xx.setMinutes($scope.minuteSel1);
					xx.setMilliseconds(0);
					$scope.trip.date = xx;
					/**** custom time add with date ******/
					oSend.date = $scope.trip.date;
				}

				oSend._id = $scope.trip._id;
				tripServices.tripCancel(oSend, success, failure);
			};
		}
	}
);

materialAdmin.controller(
	"myTripRouteUpdateCtrl",
	function (
		$rootScope,
		$scope,
		$localStorage,
		Driver,
		growlService,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices,
		Routes
	) {
		var last_route;
		$scope.getAllRoute = getAllRoute;
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		if (!thatTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		} else {
			$scope.trip = thatTrip;
			last_route = thatTrip && thatTrip.route && thatTrip.route.name;
		}
		$scope.route_full = $scope.trip.route;

		var UserDATA = $localStorage.ft_data.userLoggedIn;
		if (UserDATA) {
			$scope.person = UserDATA.full_name;
		}

		$scope.selectRoute = function (dt) {
			$scope.route_full = dt;
		};

		$scope.updateTripInfo = function () {
			function success(res) {
				if (
					res &&
					res.data &&
					(res.data.status == "OK" || res.data.success == "OK")
				) {
					$scope.trip.route = $scope.route_full;
					$uibModalInstance.close(res);
					var msg = res.data.message;
					swal("Update", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				growlService.growl(msg, "danger", 2);
			}

			var oSend = {};
			if ($scope.route_full && $scope.trip._id) {
				oSend._id = $scope.trip._id;
				oSend.route = $scope.route_full;
				oSend.route_name = $scope.route_full.name;
				oSend.remark = $scope.remark;
				tripServices.updateInfo(oSend, success, failure);
			}
		};

		function getAllRoute(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
					};

					Routes.getAllRoutes(
						req,
						(res) => {
							resolve(res.data.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		// function getAllRoute() {
		// 	function success(data) {
		// 		$scope.aRoute = data.data.data;
		// 		if ($scope.aRoute && $scope.aRoute.length > 0) {
		// 			for (var r = 0; r < $scope.aRoute.length; r++) {
		// 				if ($scope.aRoute[r]._id == $scope.trip.route._id) {
		// 					$scope.route_full = $scope.aRoute[r];
		// 				}
		// 			}
		// 		}
		// 	}
		//
		// 	Routes.getAllTrueRoutes({}, success);
		// }

		// getAllRoute();
	}
);

materialAdmin.controller(
	"updateTripRoutePopupCtrl",
	function (
		$scope,
		$localStorage,
		Driver,
		growlService,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices,
		Routes
	) {
		let vm = this;
		vm.getLocation = getLocation;
		vm.onSelectSource = onSelectSource;
		vm.onSelectSource = onSelectSource;
		vm.onSelectDest = onSelectDest;
		vm.setRouteKm = setRouteKm;
		vm.closeModal = closeModal;
		vm.submit = submit;

		(function init() {
			vm.trip = thatTrip;
			if(vm.trip.ld && vm.trip.uld){
				vm.ld =vm.trip.ld ;
				vm.uld = vm.trip.uld;
			}else {
				if(vm.trip.rName){
					let route = vm.trip.rName.split(" to ").map((o) => o.trim());
					vm.ld = { c: route[0] };
					vm.uld = { c: route[1] };
				}

			}
			vm.rKm = vm.trip.rKm || 0;

		})();
		function getLocation(viewValue) {
			return new Promise((resolve, reject) => {
				Routes.getLocation(viewValue).then((aAddress) => {
					resolve(
						(aAddress || []).map((oAddress) => {
							let aSplitAddress = (oAddress.placeAddress || "")
								.match(/([A-z0-9 \-\._\/\(\)]*)/g)
								.reduce((acc, str) => {
									if (str) acc.push(str.trim());
									return acc;
								}, [])
								.reverse();

							let pincode;
							if (aSplitAddress.length && aSplitAddress[0].match(/^\d{4,10}$/))
								pincode = aSplitAddress.shift();
							let state = aSplitAddress.length ? aSplitAddress.shift() : "";
							let district = aSplitAddress.length ? aSplitAddress.shift() : "";
							let city = aSplitAddress.length
								? aSplitAddress.shift()
								: oAddress.placeName;

							return {
								c: city,
								d: district,
								s: state,
								f: Routes.getStateShortName(state),
								lat: oAddress.latitude,
								lng: oAddress.latitude,
							};
						})
					);
				});
			}).catch((err) => {
				console.error(err);
			});
		}

		function onSelectSource() {
			setRouteKm();
		}

		function onSelectDest(viewValue) {
			setRouteKm();
		}

		function setRouteKm() {
			if (vm.ld && vm.uld && vm.ld.location && vm.uld.location) {
				if (google && google.maps && google.maps.DistanceMatrixService) {
					new google.maps.DistanceMatrixService().getDistanceMatrix(
						{
							origins: [vm.ld.location],
							destinations: [vm.uld.location],
							travelMode: "DRIVING",
							// unitSystem: UnitSystem,
						},
						(response) => {
							console.log(response);
							if (
								response &&
								Array.isArray(response.rows) &&
								response.rows[0]
							) {
								let element = response.rows[0].elements;
								vm.rKm = Math.round2(element[0].distance.value / 1000, 2);
								$scope.$apply();
							}
						}
					);
				}
			}
		}

		function closeModal() {
			$uibModalInstance.dismiss("cancel");
		}

		function submit() {
			var oSend = {};
			if (vm.ld && vm.uld && vm.trip._id) {
				oSend._id = vm.trip._id;
				oSend.rName = `${vm.ld.c} to ${vm.uld.c}`;
				oSend.rKm = vm.rKm;
				oSend.remark = vm.remark;
				tripServices.updateInfo(oSend, success, failure);
			}

			function success(res) {
				if (res && res.data && res.data.status == "OK") {
					$uibModalInstance.close(res);
					var msg = res.data.message;
					swal("Update", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				swal("Error", msg, "error");
			}
		}
	}
);

materialAdmin.controller(
	"setRoutePopupCtrl",
	function (
		$rootScope,
		$scope,
		$localStorage,
		Driver,
		growlService,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices,
		Routes
	) {
		var last_route;
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		if (!thatTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		} else {
			$scope.trip = thatTrip;
			last_route = thatTrip.route.name;
		}

		var UserDATA = $localStorage.ft_data.userLoggedIn;
		if (UserDATA) {
			$scope.person = UserDATA.full_name;
		}

		$scope.selectRoute = function (dt) {
			$scope.route_full = dt;
		};

		$scope.updateTripInfo = function () {
			function success(res) {
				if (
					res &&
					res.data &&
					(res.data.status == "OK" || res.data.success == "OK")
				) {
					$scope.trip.route = $scope.route_full;
					$uibModalInstance.close(res);
					var msg = res.data.message;
					swal("Update", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				growlService.growl(msg, "danger", 2);
			}

			var oSend = {};
			if ($scope.route_full && $scope.trip._id) {
				oSend._id = $scope.trip._id;
				oSend.route = $scope.route_full;
				oSend.route_name = $scope.route_full.name;
				oSend.remark = $scope.remark;
				tripServices.updateInfo(oSend, success, failure);
			}
		};

		function getAllRoute() {
			function success(data) {
				$scope.aRoute = data.data.data;
				if ($scope.aRoute && $scope.aRoute.length > 0) {
					for (var r = 0; r < $scope.aRoute.length; r++) {
						if ($scope.aRoute[r]._id == $scope.trip.route._id) {
							$scope.route_full = $scope.aRoute[r];
						}
					}
				}
			}

			Routes.getAllTrueRoutes({}, success);
		}

		getAllRoute();
	}
);

materialAdmin.controller(
	"updateTripDataController",
	function (
		$rootScope,
		$scope,
		$localStorage,
		branchService,
		constants,
		DateUtils,
		growlService,
		$uibModalInstance,
		$interval,
		thatTrip,
		tripServices,
		userService,
		Vendor
	) {
		var last_route;
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.updated_status = {};

		if (!thatTrip) {
			var bUrl = "#!/booking_manage/tripsDetail";
			$rootScope.redirect(bUrl);
		} else {
			$scope.trip = thatTrip;
		}

		$scope.aType = ["Liter", "Amount"];

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
			formatYear: "yy",
			startingDay: 1,
		};

		$scope.formats = [
			"dd-MMM-yyyy",
			"dd-MMMM-yyyy",
			"yyyy/MM/dd",
			"dd.MM.yyyy",
			"shortDate",
		];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		//************* New Date Picker for multiple date selection in single form **************

		//vendor deal data

		if (!$scope.trip.vendorDeal) {
			$scope.trip.vendorDeal = {};
			$scope.trip.vendorDeal.diesel = {};
		}
		$scope.$constants = constants;

		if ($scope.trip.vendorDeal) {
			$scope.trip.vendorDeal.advance_due_date = new Date();
			$scope.trip.vendorDeal.tdsPercent = $scope.trip.vendor.tdsRate;
			$scope.trip.vendorDeal.deductTDS = !!(
				$scope.trip.vendor.tdsRate && $scope.trip.vendor.tdsRate > 0
			);
		}

		$scope.changePayType = function (pType) {
			if (pType === "To pay" || pType === "To be billed") {
				$scope.trip.vendorDeal.toPay =
					($scope.trip.vendorDeal.total_expense || 0) -
					($scope.trip.vendorDeal.munshiyana || 0);
				$scope.trip.vendorDeal.advance = 0;
				if ($scope.trip.vendorDeal.diesel) {
					$scope.trip.vendorDeal.diesel.quantity = 0;
					$scope.trip.vendorDeal.diesel.rate = 0;
					$scope.trip.vendorDeal.diesel.amount = 0;
				}
				$scope.trip.vendorDeal.driver_cash = 0;
				$scope.trip.vendorDeal.toll_tax = 0;
				$scope.trip.vendorDeal.other_charges = 0;
				$scope.trip.vendorDeal.other_charges_remark = "";
				$scope.trip.vendorDeal.account_payment = 0;
			}
		};

		/*$scope.changeAmount = function () {
      if($scope.trip.vendorDeal.diesel.quantity && $scope.trip.vendorDeal.diesel.rate) {
        $scope.trip.vendorDeal.diesel.amount = $scope.trip.vendorDeal.diesel.quantity * $scope.trip.vendorDeal.diesel.rate;
      }else {
        $scope.trip.vendorDeal.diesel.amount = 0;
      }
    };*/
		$scope.changeAmount = function () {
			if (
				$scope.trip.vendorDeal.diesel.quantity &&
				$scope.trip.vendorDeal.diesel.rate
			) {
				$scope.trip.vendorDeal.diesel.amount =
					$scope.trip.vendorDeal.diesel.quantity *
					$scope.trip.vendorDeal.diesel.rate;
			} else {
				$scope.trip.vendorDeal.diesel.amount = 0;
			}
		};
		$scope.changeTotal = function () {
			if ($scope.trip.vendorDeal.diesel.amount >= 0) {
				$scope.trip.vendorDeal.total_expense =
					($scope.trip.vendorDeal.diesel.amount || 0) +
					($scope.trip.vendorDeal.driver_cash || 0) +
					($scope.trip.vendorDeal.toll_tax || 0) +
					($scope.trip.vendorDeal.other_charges || 0);
			} else {
				//$scope.trip.deal.total_expense = 0;
			}
		};
		$scope.calculateTotalPMT = function () {
			$scope.trip.vendorDeal.total_expense =
				($scope.trip.vendorDeal.pmtWeight || 0) *
				($scope.trip.vendorDeal.pmtRate || 0);
			$scope.changeAdvance("total");
			$scope.changeAcPayment();
		};
		$scope.calculateTotalPUnit = function () {
			$scope.trip.vendorDeal.total_expense =
				($scope.trip.vendorDeal.perUnitPrice || 0) *
				($scope.trip.vendorDeal.totalUnits || 0);
			$scope.changeAdvance("total");
			$scope.changeAcPayment();
		};
		$scope.resetAll = function () {
			$scope.trip.vendorDeal.total_expense = undefined;
			$scope.trip.vendorDeal.munshiyana = undefined;
			$scope.trip.vendorDeal.advance = undefined;
			$scope.trip.vendorDeal.toPay = undefined;
			$scope.trip.vendorDeal.pmtWeight = undefined;
			$scope.trip.vendorDeal.pmtRate = undefined;
			$scope.trip.vendorDeal.perUnitPrice = undefined;
			$scope.trip.vendorDeal.totalUnits = undefined;
		};

		$scope.getMarketVehicleVendor = function (viewValue = "") {
			if (viewValue.length <= 2) return;

			function success(data) {
				if (data.data && data.data.length > 0) {
					$scope.aMarketVehVendors = data.data;
				} else {
					$scope.aMarketVehVendors = [];
				}
			}

			function failure(data) {
				console.log(data);
			}

			var oFilter = {
				name: viewValue,
				no_of_docs: 5,
				deleted: false,
				// ownershipType: $scope.formDataSelected.vehicle_type
			};
			Vendor.getTransportVendor(oFilter, success, failure);
		};
		$scope.onVendorSelect = function ($item, $model, $label) {
			$scope.trip.vendor = $item._id;
			$scope._vendor_ = $item;
			$scope.trip.vendorDeal.tdsPercent = $item.tdsRate;
			$scope.trip.vendorDeal.deductTDS = !!($item.tdsRate && $item.tdsRate > 0);
		};
		/*$scope.changeAdvance = function () {
      $scope.trip.vendorDeal.advance = ($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.toPay || 0);
    };*/
		$scope.changeAdvance = function (type) {
			$scope.trip.vendorDeal.tdsAmount =
				(($scope.trip.vendorDeal.total_expense || 0) *
					($scope.trip.vendorDeal.tdsPercent || 0)) /
				100;
			if (
				$scope.trip.vendorDeal.total_expense <=
				$scope.trip.vendorDeal.advance + ($scope.trip.tdsAmount || 0)
			) {
				$scope.trip.vendorDeal.advance =
					$scope.trip.vendorDeal.total_expense - ($scope.trip.tdsAmount || 0);
			}
			if (
				$scope.trip.vendorDeal.munshiyana > $scope.trip.vendorDeal.total_expense
			) {
				$scope.trip.vendorDeal.munshiyana =
					$scope.trip.vendorDeal.total_expense;
			}
			$scope.trip.vendorDeal.toPay =
				($scope.trip.vendorDeal.total_expense || 0) -
				($scope.trip.vendorDeal.munshiyana || 0) -
				($scope.trip.vendorDeal.advance || 0) -
				($scope.trip.tdsAmount || 0);
			if (
				$scope.trip.vendorDeal.payment_type === "To pay" ||
				$scope.trip.vendorDeal.payment_type === "To be billed"
			) {
				$scope.trip.vendorDeal.toPay =
					($scope.trip.vendorDeal.total_expense || 0) -
					($scope.trip.vendorDeal.munshiyana || 0) -
					($scope.trip.tdsAmount || 0);
				$scope.trip.vendorDeal.advance = 0;
			}
		};

		/*$scope.changeAcPayment = function () {
      $scope.trip.vendorDeal.account_payment = ($scope.trip.vendorDeal.advance || 0) - ($scope.trip.vendorDeal.diesel.amount || 0) - ($scope.trip.vendorDeal.driver_cash || 0) - ($scope.trip.vendorDeal.toll_tax || 0) - ($scope.trip.vendorDeal.other_charges || 0);
    };*/
		$scope.changeAcPayment = function () {
			$scope.trip.vendorDeal.account_payment =
				($scope.trip.vendorDeal.advance || 0) -
				($scope.trip.vendorDeal.diesel
					? $scope.trip.vendorDeal.diesel.amount || 0
					: 0) -
				($scope.trip.vendorDeal.driver_cash || 0) -
				($scope.trip.vendorDeal.toll_tax || 0) -
				($scope.trip.vendorDeal.other_charges || 0);
		};

		// end vendor deal data

		$scope.updateTripDataCall = function () {
			function success(res) {
				if (
					res &&
					res.data &&
					(res.data.status === "OK" || res.data.success === "OK")
				) {
					$rootScope.selectedTrip.branch = res.data.data.oBranch;
					$rootScope.selectedTrip.route = res.data.data.oRoute;
					$rootScope.selectedTrip.driver = res.data.data.oDriver;
					$rootScope.selectedTrip.trip_manager = res.data.data.oManager;
					$rootScope.selectedTrip.vendorDeal = res.data.data.vendorDeal;
					$uibModalInstance.close(res);
					var msg = res.data.message;
					swal("Update", msg, "success");
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				var msg = res.data.message;
				$uibModalInstance.dismiss(res);
				growlService.growl(msg, "danger", 2);
			}

			var oSend = {};

			oSend._id = $scope.trip._id;
			oSend.branch = $scope.trip.oBranch._id;
			oSend.vendor =
				typeof $scope.trip.vendor === "string"
					? $scope.trip.vendor
					: $scope.trip.vendor._id;
			oSend.trip_manager =
				$scope.trip.oTripManager && $scope.trip.oTripManager._id;
			oSend.vendorDeal = $scope.trip.vendorDeal;
			oSend.updated_status = $scope.updated_status;
			oSend.allocation_date = $scope.trip.allocation_date;
			tripServices.updateInfo(oSend, success, failure);
		};

		$scope.getAllBranch = function () {
			function success(response) {
				//console.log(data);
				if (response.data && response.data.length > 0) {
					$scope.aBranch = response.data;
					for (var b = 0; b < $scope.aBranch.length; b++) {
						if ($scope.trip.branch) {
							if ($scope.trip.branch._id == $scope.aBranch[b]._id) {
								$scope.trip.oBranch = $scope.aBranch[b];
							}
						}
					}
				}
			}

			function failure(response) {
				console.log(response);
			}

			branchService.getAllBranches({ all: true }, success, failure);
		};
		$scope.getAllBranch();

		//Get all users for trip manager dropdown at final page
		$scope.getAllUsers = function () {
			function succGetUsers(response) {
				console.log(response.data);
				if (response.data && response.data.length > 0) {
					$scope.aUsers = response.data;
					for (var m = 0; m < $scope.aUsers.length; m++) {
						if ($scope.trip.trip_manager) {
							if ($scope.trip.trip_manager._id === $scope.aUsers[m]._id) {
								$scope.trip.oTripManager = $scope.aUsers[m];
							}
						}
					}
				}
			}

			function failGetUsers(response) {
				console.log(response);
			}

			userService.getUsers(
				{ all: true, user_type: "Trip Manager" },
				succGetUsers,
				failGetUsers
			);
		};
		$scope.getAllUsers();
	}
);

materialAdmin.controller(
	"askPaymentPopupController",
	function (
		$scope,
		$uibModalInstance,
		DatePicker,
		selectedTrip,
		sharedResource,
		tripServices
	) {
		sharedResource.shareThisResourceWith($scope);
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.selectedTrip = selectedTrip;
		$scope.disableSubmit = false;

		$scope.upsertAskPaymet = function (form) {
			$scope.disableSubmit = true;
			if (form.$valid) {
				console.log(form);
				let oRequest = {
					askPayment: {
						type: $scope.payType,
						amount: $scope.amount,
						date: $scope.date.toISOString(),
						remark: $scope.remark,
					},
					_id: $scope.selectedTrip._id,
				};

				tripServices.askPayment(oRequest, success, failure);

				function success(res) {
					swal("", res.data.message, "success");
					$scope.amount = undefined;
					$scope.remark = undefined;
					console.log(res);
					$scope.disableSubmit = false;
				}

				function failure(res) {
					console.log(res);
					swal("", res.data.message, "error");
					// var msg = res.data.message;
					// $uibModalInstance.dismiss(res);
					$scope.disableSubmit = false;
				}
			} else {
				$scope.disableSubmit = false;
			}
		};
	}
);

materialAdmin.controller(
	"askMoreGRPopupController",
	function (
		$scope,
		$uibModalInstance,
		DatePicker,
		selectedTrip,
		sharedResource,
		bookingServices,
		Routes,
		tripServices,
		customer,
		consignorConsigneeService
	) {
		sharedResource.shareThisResourceWith($scope);
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.selectedTrip = selectedTrip;
		$scope.aBookings = selectedTrip.gr[0] &&
			selectedTrip.gr[0].booking && [
				selectedTrip.gr[0] && selectedTrip.gr[0].booking,
			];
		$scope.selectedBooking = $scope.aBookings && $scope.aBookings[0];
		$scope.disableSubmit = false;
		var lastFilter;

		$scope.submit = function (form) {
			if (!$scope.selectedBooking) {
				$scope.err = "Please select booking";
				return;
			}
			if (!$scope.route) {
				$scope.err = "Please select route";
				return;
			}
			if (!$scope.weight) {
				$scope.err = "Please select weight";
				return;
			}
			/*var totalWeight = selectedTrip.gr.reduce((acc, curr) => acc + curr.weight, 0);
		var maxWeight = selectedTrip.vehicle.capacity_tonne || 0;
		if($scope.weight > (maxWeight - totalWeight)) {
			$scope.err = 'max weight allowed : ' + (maxWeight - totalWeight);
			return;
		}*/
			var booking_remaining_weight =
				$scope.selectedBooking.total_weight -
				(($scope.selectedBooking.served &&
					$scope.selectedBooking.served.servedWeight) ||
					0);
			let oRequest = {
				trip: {
					_id: $scope.selectedTrip._id,
					gr: [
						{
							booking: $scope.selectedBooking._id,
							consignor: $scope.selectedBooking.consigner._id,
							geofence_points: $scope.selectedBooking.geofence_points,
							container: $scope.selectedBooking.container,
							weight:
								booking_remaining_weight < $scope.weight
									? booking_remaining_weight
									: $scope.weight,
							branch: $scope.selectedBooking.branch_id._id,
							route: $scope.route._id,
						},
					],
				},
			};
			if (
				$scope.selectedTrip.route.route_distance < $scope.route.route_distance
			) {
				oRequest.route = $scope.route._id;
				oRequest.route_name = $scope.route.name;
			}
			tripServices.addMoreGRInTrip(
				oRequest,
				function (d) {
					$uibModalInstance.close(d.data.message);
				},
				function (d) {
					$uibModalInstance.close(d.data.message);
				}
			);
		};

		$scope.getCname = function (viewValue) {
			if (viewValue && viewValue.toString().length > 2) {
				function oSucC(response) {
					$scope.aCustomer = response.data;
				}

				function oFailC(response) {
					console.log(response);
				}

				customer.getCustomerSearch(viewValue, oSucC, oFailC);
			}
		};

		$scope.getConsignees = function () {
			var oFilter = prepareFilterObject($scope.oFilter);
			consignorConsigneeService.getConsignorConsignee(
				oFilter,
				onSuccess,
				onFailure
			);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				//swal('Error!','Message not defined','error');
			}

			// Handle success response
			function onSuccess(response) {
				$scope.aConsignorConsignee = response.data;
			}
		};

		$scope.getDname = function (viewValue) {
			function oSucD(response) {
				$scope.aRoute = response.data.data;
			}

			function oFailD(response) {
				//console.log(response);
			}

			if (viewValue && viewValue.toString().length > 2) {
				Routes.getAllRoutes({ name: viewValue }, oSucD, oFailD);
			}
		};

		function prepareFilterObject(isPagination) {
			var myFilter = {};
			if ($scope.booking && $scope.booking.length <= 5) {
				myFilter.booking_no = $scope.booking;
			} else if ($scope.booking && $scope.booking.length > 5) {
				myFilter.bookingId = $scope.booking;
			}
			if ($scope.bookingType) {
				myFilter.booking_type = $scope.bookingType;
			}
			/*else if(!$scope.bookingType){
             myFilter.booking_type = '';
           }*/
			if ($scope.boe_no) {
				myFilter.boe_no = $scope.boe_no;
			}
			if ($scope.bookingCustomer && $scope.bookingCustomer.name) {
				myFilter.customer_id = $scope.bookingCustomer._id;
			}
			if ($scope.bookingConsignor && $scope.bookingConsignor.name) {
				myFilter.consigner = $scope.bookingConsignor._id;
			}
			if ($scope.branch) {
				myFilter.branch = $scope.branch;
			}
			if ($scope.start_date) {
				myFilter.start_date = $scope.start_date;
			}
			if ($scope.end_date) {
				myFilter.end_date = $scope.end_date;
			}
			if ($scope.searchBy) {
				myFilter.status = $scope.searchBy;
			}
			if (isPagination && $scope.currentPage) {
				myFilter.skip = $scope.currentPage;
			}

			return myFilter;
		}

		$scope.selectBookingFromList = function (selectedBooking) {
			$scope.selectedBooking = selectedBooking;
		};

		$scope.getConsignor = function (name) {
			if (name.length < 2) return;

			let oFilter = {
				type: "Consignor",
				all: "true",
				name,
			};
			consignorConsigneeService.getConsignorConsignee(
				oFilter,
				onSuccess,
				onFailure
			);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				//swal('Error!','Message not defined','error');
			}

			// Handle success response
			function onSuccess(response) {
				$scope.aConsignor = response.data;
			}
		};

		$scope.getBooking = function (isPagination) {
			function success(data) {
				if (data.data && data.data.data) {
					$scope.aBookings = data.data.data;
				}
			}

			function failure(res) {
				swal("Some error with GET booking.", "", "error");
			}

			var oFilter = prepareFilterObject(isPagination);
			lastFilter = oFilter;
			bookingServices.getAllBookings(oFilter, success, failure);
		};
		if (!$scope.aBookings) {
			$scope.getBooking();
		}
	}
);

function tripDetailPopupCtrl(
	$rootScope,
	$filter,
	$scope,
	$uibModal,
	$uibModalInstance,
	$timeout,
	DatePicker,
	growlService,
	objToCsv,
	oTrip,
	tripServices,
	utils,
	Vehicle
) {
	let vm = this,
		map,
		toolTipMap;

	// function Declaration
	vm.acknowledgeDeal = acknowledgeDeal;
	vm.addMoreLocation = addMoreLocation;
	vm.addMoreGR = addMoreGR;
	vm.cancelTrip = cancelTrip;
	// vm.playbackTrip = playbackTrip;
	vm.changeDriver = changeDriver;
	vm.close = closeModal;
	vm.deleteliveData = deleteliveData;
	vm.downloadLiveTrackCsv = downloadLiveTrackCsv;
	vm.getAllLiveTrack = getAllLiveTrack;
	vm.getLivetrackVehicleData = getLivetrackVehicleData;
	vm.myTripUpdate = myTripUpdate;
	vm.myTripGrUpdate = myTripGrUpdate;
	vm.mapInit = mapInit;
	vm.previewDocs = previewDocs;
	vm.plotMarketArry = plotMarketArry;
	vm.removeAllMarkerOnMap = removeAllMarkerOnMap;
	vm.revertAck = revertAck;
	vm.routeUpdate = routeUpdate;
	vm.selectThisRow = selectThisRow;
	vm.transShipment = transShipment;
	vm.updateStatus = updateStatus;
	vm.updateVehicle = updateVehicle;
	vm.updateliveData = updateliveData;
	vm.uploadLoadingSlip = uploadLoadingSlip;
	vm.vendorDealPopUp = vendorDealPopUp;
	vm.addIMDs = addIMDs;

	// init
	(function init() {
		vm.oTrip = oTrip;
		vm.selectedVehicleData = vm.oTrip.vehicle;
		vm.aStatusChange = ["Trip not started", "Trip started", "Trip ended"];
		if (
			vm.oTrip.manualTracking &&
			vm.oTrip.vehicle &&
			vm.oTrip.vehicle.status != "In Trip"
		) {
			vm.from = new Date();
			vm.from = moment(vm.from).format("DD/MM/YYYY");
			vm.to = new Date();
			vm.to = moment(vm.to).format("DD/MM/YYYY");
		}
		generateTripHistory();
		getAllLiveTrack();
		$timeout(function () {
			mapInit();
		});
	})();

	// function Definition

	function addIMDs(selectedTrip) {
		$rootScope.intermediateRoute = $rootScope.intermediateRoute;
		$rootScope.selectedTrip = selectedTrip;
		var modalInstance = $uibModal.open({
			templateUrl: "views/myTripsStatus/addImds.html",
			controller: [
				"$scope",
				"$rootScope",
				"$uibModalInstance",
				"DatePicker",
				"tripServices",
				"cityStateService",
				addImdPopUpController,
			],
			controllerAs: "aiVm",
			resolve: {
				thatData: function () {
					return $rootScope.selectedTrip;
				},
			},
		});

		modalInstance.result.then(
			function () {},
			function (data) {
				if (data != "close") {
					swal("Oops!", data.message, "error");
				}
			}
		);
	}
	function vendorDealPopUp() {
		// if(vm.oTrip.advSettled.aVoucher.length>0){
		// 	swal('Error','Voucher already created!! vendorDealPopUp Can Not editable','error');
		// 	return
		// }
		$uibModal
			.open({
				templateUrl: "views/myTripAdvance/vendorDealPopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"accountingService",
					"billBookService",
					"branchService",
					"billsService",
					"bookingServices",
					"callback",
					"constants",
					"DateUtils",
					"DatePicker",
					"formulaFactory",
					"growlService",
					"oTrip",
					"sharedResource",
					"tripServices",
					"userService",
					"Vendor",
					vendorDealPopUpController,
				],
				controllerAs: "ackDealVm",
				size: "xl",
				resolve: {
					callback: function () {
						return false;
					},
					oTrip: function () {
						return {
							...vm.oTrip,
						};
					},
				},
			})
			.result.then(
				function (response) {
					console.log("close", response);
					vm.oTrip = response;
					getTrips();
				},
				function (data) {
					console.log("cancel", data);
				}
			);
	}
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAllLiveTrack(isPagination) {
		var oFilter = prepareFilterObject(isPagination);
		if (oFilter.from && oFilter.to) {
			let a = moment(oFilter.to);
			let b = moment(oFilter.from);
			let no_of_days = a.diff(b, "days");
			if (no_of_days > 15 && vm.oTrip.manualTracking) {
				return swal(
					"Error",
					"Please select date range less than 15 days.",
					"error"
				);
			}
		}

		if (oFilter.trip || vm.oTrip.manualTracking)
			Vehicle.getAllTrackingData(oFilter, succGetTracking, failGetTraking);

		function succGetTracking(res) {
			if (res.data.status === "OK") {
				//alert("in....");
				console.log(res);
				vm.aLiveTrackData = res.data.data.data;
			} else {
				alert("Errrrr.......");
			}
		}

		function failGetTraking(res) {
			alert("res");
		}
	}

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if (vm.oTrip && !vm.oTrip.manualTracking) {
			myFilter.trip = vm.oTrip._id;
		}
		if (
			vm.oTrip &&
			vm.oTrip.vehicle &&
			vm.oTrip.vehicle.trip &&
			vm.oTrip.vehicle.trip._id
		) {
			myFilter.trip = vm.oTrip.vehicle.trip._id;
		}
		if (vm.oTrip && vm.oTrip.vehicle && vm.oTrip.vehicle.vehicle_reg_no) {
			myFilter.vehicle_number = vm.oTrip.vehicle.vehicle_reg_no;
		}
		if (vm.from) {
			myFilter.from = moment(vm.from, "DD/MM/YYYY")
				.startOf("day")
				.toISOString();
		}
		if (vm.to) {
			myFilter.to = moment(vm.to, "DD/MM/YYYY").startOf("day").toISOString();
		}
		if (
			vm.oTrip.manualTracking &&
			vm.oTrip.vehicle &&
			vm.oTrip.vehicle.status != "In Trip"
		) {
			myFilter.to = moment(vm.to, "DD/MM/YYYY").format("YYYY-MM-DD");
			myFilter.to = new Date(myFilter.to).setHours(
				new Date().getHours(),
				new Date().getMinutes(),
				new Date().getSeconds()
			);
			myFilter.to = new Date(myFilter.to).toISOString();
			//   moment(vm.to, 'DD/MM/YYYY').toISOString();
		}
		if (vm.address) {
			myFilter.address = vm.address;
		}
		return myFilter;
	}

	function deleteliveData() {
		swal(
			{
				title: "Confirm delete ?",
				text:
					"Live Track Address:  " +
					vm.selectedliveData.address +
					" will be removed.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#F44336",
				confirmButtonText: "Delete",
				closeOnConfirm: true,
			},
			function () {
				function succDeleteliveData(response) {
					if (response.message) {
						swal("Done!", response.message, "success");
						// $state.go('masters.liveTrackPage', {}, {reload: true});
					}
				}

				function failDeleteliveData(response) {
					if (response.message) {
						// growlService.growl(response.message, "danger");
						swal("Opps!", response.message, "error");
					}
				}

				Vehicle.deleteliveData(
					vm.selectedliveData,
					succDeleteliveData,
					failDeleteliveData
				);
			}
		);
	}

	// add more locations
	function addMoreLocation() {
		if (vm.selectedVehicleData && vm.selectedVehicleData.vehicle_reg_no) {
			$rootScope.selectedVehicleData = vm.selectedVehicleData;
			$rootScope.selectedTripData = vm.oTrip;
			var modalInstance = $uibModal.open({
				templateUrl: "views/myRegisteredVehicle/addMoreLocation.html",
				controller: "addMoreLocationCtrl",
				resolve: {
					oLiveData: function () {
						return {};
					},
				},
			});
		} else {
			swal(
				"Warning",
				"Please go back and select vehicle for add more live track.",
				"warning"
			);
		}
	}

	// update more locations
	function updateliveData(oLiveData) {
		if (vm.selectedVehicleData && vm.selectedVehicleData.vehicle_reg_no) {
			var modalInstance = $uibModal.open({
				templateUrl: "views/myRegisteredVehicle/addMoreLocation.html",
				controller: "addMoreLocationCtrl",
				resolve: {
					oLiveData: function () {
						return oLiveData;
					},
				},
			});

			modalInstance.result.then(
				function (response) {
					if (response)
						if (vm.selectedliveData) vm.selectedliveData = response;
						else vm.aLiveTrackData.push(response);

					console.log("close", response);
				},
				function (data) {
					console.log("cancel");
				}
			);
		} else {
			swal(
				"Warning",
				"Please go back and select vehicle for add more live track.",
				"warning"
			);
		}
	}

	function removeAllMarkerOnMap() {
		if (vm.maps && vm.maps.clusterL && vm.maps.map) {
			vm.maps.map.removeLayer(vm.maps.clusterL);
			vm.maps.clusterL = utils.initializeCluster(map);
		}
	}

	function getLivetrackVehicleData(toRefresh) {
		let initCb = function () {
			removeAllMarkerOnMap();
		};
		let cb = function (obj, resData) {
			vm.aTrSheetDevice = obj.aTrSheetDevice;
			plotMarkerOnMap(resData || obj.aTrSheetDevice);
		};
	}

	function plotMarketArry() {
		vm.showMap = !vm.showMap;
		if (!vm.showMap) return;

		$rootScope.maps.map &&
			$timeout(function () {
				$rootScope.maps.map.invalidateSize();
			});

		utils.removeAllMarker();
		let cords = [];
		//let cordsAddr = [];
		let sLatLng = {
			lat: oTrip.route.source.latitude,
			lng: oTrip.route.source.longitude,
			address: oTrip.route.source.c,
		};
		let dLatLng = {
			lat: oTrip.route.destination.latitude,
			lng: oTrip.route.destination.longitude,
			address: oTrip.route.destination.c,
		};
		cords.push(sLatLng);
		vm.aLiveTrackData.forEach((oData) => {
			if (oData.lat && oData.lng) {
				cords.push({ lat: oData.lat, lng: oData.lng, address: oData.address });
				//cordsAddr.push({address: oData.address});
			}
		});
		cords.push(dLatLng);
		cords.forEach((oCords) => utils.addMarker(oCords));
		utils.fitMap(cords);
		utils.addPolyline(cords);
	}

	function mapInit() {
		//alert('in....');
		$rootScope.maps = utils.initializeMapView(
			"mapViewLiveTracking",
			{
				zoomControl: false,
				hybrid: true,
				zoom: 4,
				search: true,
				location: false,
				center: new L.LatLng(21, 90),
			},
			true
		);
	}

	function downloadLiveTrackCsv() {
		if (!(vm.aLiveTrackData || []).length) return;

		let title = "Live Track";
		let header = [
			"DATE",
			"ADDRESS",
			"STATUS",
			"SPEED",
			"DURATION",
			"REMARK",
			"CREATED BY",
			"ENTRY DATE",
		];

		let body = vm.aLiveTrackData.map((o) => {
			let arr = [];
			try {
				arr.push($filter("date")(o.datetime, "dd-MMM-yyyy 'at' h:mma") || "");
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.address.split(",").join(" ") || "");
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.status || "");
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.speed || "");
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.duration || "");
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.remarks || "");
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.created_by || "");
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push($filter("date")(o.created_at, "dd-MMM-yyyy 'at' h:mma") || "");
			} catch (e) {
				arr.push("");
			}

			return arr;
		});

		objToCsv(title, header, body);
	}

	function selectThisRow(oliveData, index) {
		var row = $(".selectItem");
		$(row).removeClass("grn");
		$(row[index]).addClass("grn");
		vm.selectedliveData = oliveData;
	}

	function acknowledgeDeal() {
		try {
			vm.oTrip.vendor.account._id;
		} catch (e) {
			swal("Error", "No Vendor Account Attached", "error");
			return;
		}
		$uibModal
			.open({
				templateUrl: "views/myTripAdvance/editVendorDealPopup.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"accountingService",
					"constants",
					"DateUtils",
					"DatePicker",
					"growlService",
					"oTrip",
					"sharedResource",
					"tripServices",
					acknowledgeDealController,
				],
				controllerAs: "acknowledgeDealVm",
				size: "lg",
				resolve: {
					oTrip: function () {
						return {
							...vm.oTrip,
						};
					},
				},
			})
			.result.then(
				function (response) {
					console.log("close", response);
					// vm.oTrip = response;
					getTrips();
				},
				function (data) {
					console.log("cancel", data);
				}
			);
	}

	function revertAck() {
		swal(
			{
				title: "Do you want to Revert Acknowledge Deal?",
				type: "warning",
				showCancelButton: true,
				confirmButtonClass: "btn-danger",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true,
			},
			function (isConfirm) {
				if (isConfirm) {
					tripServices.revertAcknowledgeDeal(
						{
							_id: vm.oTrip._id,
						},
						success,
						failure
					);

					function success(res) {
						console.log(res);
						swal("Success", res.data.message, "success");
						// vm.oTrip = res.data.data[0];
						getTrips();
					}

					function failure(res) {
						swal("Failed!", res.data.message, "error");
					}
				} else return;
			}
		);
	}

	function getTrips() {
		let request = {
			summary: true,
		};
		request.trip_no = vm.oTrip.trip_no;
		tripServices.getAllTripsWithPagination(request, success, failure);

		function success(res) {
			vm.oTrip = res.data.data.data[0];
			generateTripHistory();
		}

		function failure(res) {
			swal("Failed!", res.data.data.data, "error");
		}
	}

	function uploadLoadingSlip(loading_slip) {
		//console.log(loading_slip);
		var fd = new FormData();
		fd.append("loading_slip", loading_slip);
		var data = {};
		data.fileUpload = true;
		data.formData = fd;
		data._id = vm.oTrip._id;
		tripServices.uploadSlip(data, successLoc, failureLoc);

		function successLoc(res) {
			if (res && res.data && res.data.status == "OK") {
				vm.oTrip = res.data.data;
				swal("Updated", res.data.message, "success");
			} else {
				swal("Error", res.data.message, "error");
			}
		}

		function failureLoc(res) {
			var msg = res.data.message;
			swal("Error", msg, "error");
		}
	}

	function previewDocs() {
		if (
			!Array.isArray(vm.oTrip.vendor.documents) ||
			vm.oTrip.vendor.documents.length < 1
		) {
			swal("No documents to preview", "", "warning");
			return;
		}

		var documents = vm.oTrip.vendor.documents.map((curr) => ({
			...curr,
			url: `${URL.BASE_URL}documents/view/${curr.docReference}`,
		}));

		$uibModal.open({
			templateUrl: "views/carouselPopup.html",
			controller: "carouselCtrl",
			resolve: {
				documents: function () {
					return documents;
				},
			},
		});
	}

	//////////////////////////////////

	function addMoreGR(selectedTrip) {
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/addMoreGRPopup.html",
				controller: "askMoreGRPopupController",
				// size: ''
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					swal("", data, "success");
					getTrips();
				},
				function (data) {}
			);
	}

	function cancelTrip(selectedTrip) {
		selectedTrip.tripUpdate = true;
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/myTripCancelPopUp.html",
				controller: "myTripCancelCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {}
			);
	}

	function generateTripHistory() {
		try {
			vm.tripHistory = [];
			vm.oTrip.gr.map(function (obj) {
				Array.prototype.push.apply(vm.tripHistory, obj.statuses);
			});
			Array.prototype.push.apply(vm.tripHistory, vm.oTrip.statuses);
		} catch (e) {
			vm.tripHistory = [];
		}
	}

	function changeDriver(selectedTrip) {
		selectedTrip.tripdetails = true;
		selectedTrip.tripDriverUpdate = true;
		selectedTrip.tripUpdate = false;
		selectedTrip.tripGRUpdate = false;
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/myTripInfoPopUp.html",
				controller: "myTripPopUpUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
					tripFull: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {}
			);
	}

	function myTripUpdate(selectedTrip, valueStatus) {
		selectedTrip.tripdetails = true;
		selectedTrip.tripDriverUpdate = false;
		selectedTrip.tripUpdate = true;
		selectedTrip.tripGRUpdate = false;
		selectedTrip.updatedStatus = valueStatus;

		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/myTripInfoPopUp.html",
				controller: "myTripPopUpUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
					tripFull: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {
					console.log(data);
				}
			);
	}

	function routeUpdate(selectedTrip) {
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/myTripRouteUpdate.html",
				controller: "myTripRouteUpdateCtrl",
				resolve: {
					thatTrip: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {
					console.log(data);
				}
			);
	}

	function myTripGrUpdate(selectedTrip, oGrinfo, index) {
		// $rootScope.tripUpdate = false;
		// $rootScope.tripGRUpdate = true;
		// $rootScope.selectedTrip = selectedTrip;
		// $rootScope.selectedTripGr = oGrinfo;
		$uibModal.open({
			templateUrl: "views/myTripsStatus/statusUpdatePopup.html",
			controller: "statusUpdateCtrl",
			resolve: {
				callback: function () {
					return function (request) {
						return new Promise(function (resolve, reject) {
							tripServices.updateGrStatus(request, success, failure);

							function success(res) {
								console.log(res);
								swal("Status Updated", res.data.message, "success");
								getTrips();
								resolve();
							}

							function failure(err) {
								swal("Error", err.data.message, "error");
								reject(err);
							}
						});
					};
				},
				modelData: function () {
					return {
						header: "Gr Number " + oGrinfo.grNumber,
					};
				},
				otherData: function f() {
					let statuses = [
						{ key: "GR Assigned", label: "GR Assigned" },
						{
							key: "Vehicle Arrived for loading",
							label: "Vehicle Arrived for loading",
						},
						{ key: "Loading Started", label: "Loading Started" },
						{ key: "Loading Ended", label: "Loading Ended" },
						{
							key: "Vehicle Arrived for unloading",
							label: "Vehicle Arrived for unloading",
						},
						{ key: "Unloading Started", label: "Unloading Started" },
						{ key: "Unloading Ended", label: "Unloading Ended" },
						{ key: "Trip cancelled", label: "Trip cancelled" },
						{ key: "GR Acknowledged", label: "GR Acknowledged" },
						{ key: "GR Received", label: "GR Received" },
					];

					statuses = statuses.filter(
						(s) => !(oGrinfo.statuses || []).find((o) => o.status === s.key)
					);

					return {
						aStatuses: statuses,
						selectedData: oGrinfo,
						adminAccess: false,
					};
				},
			},
		});
	}

	function transShipment(selectedTrip) {
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/transShipmentPopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"Driver",
					"selectedTrip",
					"tripServices",
					"Vehicle",
					transShipmentPopUpController,
				],
				controllerAs: "transVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {}
			);
	}

	function updateVehicle(selectedTrip) {
		$uibModal
			.open({
				templateUrl: "views/myTripsStatus/updateVehiclePopUp.html",
				controller: [
					"$scope",
					"$uibModalInstance",
					"DatePicker",
					"Driver",
					"selectedTrip",
					"tripServices",
					"Vehicle",
					updateVehiclePopUpController,
				],
				controllerAs: "uvVm",
				resolve: {
					selectedTrip: function () {
						return selectedTrip;
					},
				},
			})
			.result.then(
				function (data) {
					getTrips();
				},
				function (data) {}
			);
	}

	function updateStatus(selectedTrip) {
		$uibModal.open({
			templateUrl: "views/myTripsStatus/statusUpdatePopup.html",
			controller: "statusUpdateCtrl",
			resolve: {
				callback: function () {
					return function (request) {
						return new Promise(function (resolve, reject) {
							tripServices.admUpdateTrip(request, success, failure);

							function success(res) {
								if (!res.data.error) getTrips();
								resolve();
							}

							function failure(err) {
								swal("Error", err.data.message, "error");
								reject(err);
							}
						});
					};
				},
				modelData: function () {
					return {
						header: "Trip Number " + selectedTrip.trip_no,
					};
				},
				otherData: function f() {
					return {
						aStatuses: (
							$scope.$configs.trip_statuses || $scope.$constants.aTripStatus
						).filter(
							(s) =>
								s.key !== "Trip started" &&
								s.key !== "Trip ended" &&
								s.key !== "Trip cancelled"
						),
						selectedData: selectedTrip,
						adminAccess: $scope.$role["Trip"]["Admin Edit"],
					};
				},
			},
		});
	}
}

materialAdmin.controller(
	"genDieselBillPopupController",
	function (
		$timeout,
		$uibModalInstance,
		accountingService,
		billBookService,
		billsService,
		branchService,
		objToCsv,
		$filter,
		DatePicker,
		modelDetail,
		otherData,
		tripServices,
		NumberUtil
	) {
		let vm = this;

		// function identifier
		vm.closeModal = closeModal;
		vm.getBranch = getBranch;
		vm.getRefNo = getRefNo;
		vm.onBranchSelect = onBranchSelect;
		vm.onRefSelect = onRefSelect;
		vm.delAdvance = delAdvance;
		vm.refreshRemark = refreshRemark;
		vm.getAccount = getAccount;
		vm.addAdvance = addAdvance;
		vm.addDiscount = addDiscount;
		vm.deleteDiscount = deleteDiscount;
		vm.process = process;
		vm.uploadLoadingSlip = uploadLoadingSlip;
		vm.calAdjAmount = calAdjAmount;
		vm.calTds = calTds;
		vm.downloadCsv = downloadCsv;
		vm.submit = submit;

		// init
		(function init() {
			otherData = otherData || {};

			vm.type = modelDetail.type || "view";
			vm.aAdvances = otherData.aAdvances || [];
			vm.DatePicker = angular.copy(DatePicker);
			vm.aFromGroup = ["Diesel-Bill"];
			vm.aDiscountGroup = ["Discount"];

			// if (vm.aAdvances.length == 0) {
			// 	swal('Warning', 'No Advance Selected', 'error');
			// 	closeModal();
			// 	return;
			// }

			vm.billObj = otherData.billObj;

			if (vm.type !== "add") {
				vm.billNo = vm.billObj.billNo;
				vm.vendor = vm.billObj.account.name;
				vm.remark = vm.billObj.remark;
				vm.from = vm.billObj.from_account;
				vm.billDate = vm.billObj.billDate;
				vm.aDiscount = vm.billObj.aDiscount || [];
				vm.remark = vm.billObj.remark;
				vm.branch = vm.billObj.branch;
				vm.selectedRefNo = {};
				vm.branch && onBranchSelect(vm.branch);
				vm.refNo = vm.billObj.refNo;
				vm.adjAmount = vm.billObj.adjAmount;
				vm.adjDebitAc = vm.billObj.adjDebitAc;
				vm.billAmount = $filter("roundOff")(vm.billObj.billAmount);
				vm.billAmount = parseFloat(vm.billObj.billAmount.toFixed(2));
				vm.totItem = vm.billObj.totItem;
				vm.remark = vm.billObj.remark;
				vm.discount = vm.billObj.totDiscount;
				vm.totalAmount = vm.billObj.totalAmount;

				if (vm.billObj.refNo) vm.selectedRefNo.bookNo = vm.billObj.refNo;

				if (vm.billObj.stationaryId)
					vm.selectedRefNo._id = vm.billObj.stationaryId;
				refreshRemark();
				// calculateAdvance();
			} else {
				// vm.billAmount = vm.aAdvances[0].amount || 0;
				vm.billNoDef = !!vm.aAdvances[0].bill_no;
				vm.billNo = vm.aAdvances[0].bill_no;
				vm.vendor = vm.aAdvances[0].from_account.name;
				//vm.billDate = new Date();
				vm.aDiscount = [];
				calculateAdvance();
			}
			// sum of all advances amount
			getAccount("aFromAccount", vm.aFromGroup);
		})();

		// Actual Function
		function process(oDiscount) {
			if (oDiscount) vm.discount -= oDiscount.amount;
			else vm.discount += vm.discountAmount;

			vm.totalAmount = vm.totItem - vm.discount;
			vm.billAmount = parseFloat(vm.totItem.toFixed(2));
			vm.adjAmount = vm.adjAmount || 0;
			vm.billAmount += vm.adjAmount;
		}

		function addDiscount() {
			if (vm.discountAccount && vm.discountAmount) {
				vm.aDiscount.push({
					amount: vm.discountAmount,
					accountRef: vm.discountAccount._id,
					accountName: vm.discountAccount.name,
					remark: vm.discountRemark,
				});
				process();
				vm.discountAccount = vm.discountAmount = discountRemark = undefined;
			}
		}

		function deleteDiscount(oDiscount, index) {
			process(oDiscount);
			vm.aDiscount.splice(index, 1);
		}

		function calTds() {
			vm.billAmount = vm.totItem || 0;
			if (vm.tdsAmt) {
				vm.billAmount = vm.billAmount - NumberUtil.toFixed(vm.tdsAmt);
			}
		}

		function calAdjAmount() {
			vm.adjPercent = (vm.billAmount * 1) / 100;
			vm.adjCalAmount = vm.billAmount - vm.totItem;
			if (vm.adjCalAmount > -vm.adjPercent && vm.adjCalAmount < vm.adjPercent) {
				vm.adjAmount = vm.adjCalAmount;
				vm.dupBillAmount = vm.billAmount;
				vm.flag = false;
			} else {
				vm.flag = true;
				$timeout(function () {
					vm.billAmount = vm.dupBillAmount || vm.totItem;
					vm.flag = false;
				}, 2000);
			}
		}

		function closeModal() {
			$uibModalInstance.close();
		}

		function uploadLoadingSlip(excelFile) {
			//console.log(loading_slip);
			if (!vm.aAdvances.length) return;

			if (!excelFile) return;

			var fd = new FormData();
			fd.append("advancesExcel", excelFile);
			var data = {};
			let _ids = [];
			data.fileUpload = true;
			vm.aAdvances.forEach((obj) => {
				if (obj._id) _ids.push(obj._id);
			});
			// data._ids = vm.aAdvances && vm.aAdvances.map(o => o._id);
			fd.append("_ids", _ids);
			data.formData = fd;

			tripServices.uploadForComparision(data, successLoc, failureLoc);

			function successLoc(res) {
				if (res && res.data && res.data.status == "OK") {
					vm.rowsInExl = res.data.ExcelCount;
					if (res.data && res.data.data && res.data.data.length) {
						vm.totActualLit = 0;
						vm.billNo = res.data.data[0].bill_no;
						vm.aAdvances = res.data.data;

						// res.data.data.forEach(item => {
						// 	if(!item._id)
						// 	vm.aAdvances.push(item);
						// });
					}
					calculateAdvance();
					swal("Updated", "compare Data successfully", "success");
				} else {
					swal("Error", res.data.message, "error");
				}
			}

			function failureLoc(res) {
				var msg = res.data.message;
				swal("Error", msg, "error");
			}
		}

		function calculateAdvance() {
			let aRate = [];
			vm.totalLit = 0;
			vm.totActualLit = 0;
			vm.rowsInAdv = 0;
			vm.aAdvances.sort((a, b) => new Date(a.date) - new Date(b.date));
			vm.aAdvances.forEach((obj) => {
				vm.totActualLit += obj.dieseInfo.actualLit || 0;
				if (obj._id) vm.rowsInAdv++;
			});
			vm.totItem = vm.totAdv = vm.aAdvances.reduce((acc, cur) => {
				let foundRate = aRate.find(
					(o) => o.rate === ((cur.dieseInfo && cur.dieseInfo.rate) || 0)
				);

				if (foundRate) {
					foundRate.liter += (cur.dieseInfo && cur.dieseInfo.litre) || 0;
				} else {
					aRate.push({
						rate: (cur.dieseInfo && cur.dieseInfo.rate) || 0,
						liter: (cur.dieseInfo && cur.dieseInfo.litre) || 0,
					});
				}

				vm.totalLit += (cur.dieseInfo && cur.dieseInfo.litre) || 0;
				return acc + (cur.amount || 0);
			}, 0);

			refreshRemark();
			vm.discount = vm.aDiscount.reduce((a, b) => a + (b.amount || 0), 0);
			vm.totalAmount = vm.amount = vm.totItem - vm.discount;
			vm.totItem = parseFloat(vm.totItem.toFixed(2));
			vm.billAmount = vm.totItem || 0;
			calTds();
		}

		function refreshRemark() {
			vm.totalLit = 0;
			vm.remark =
				vm.aAdvances
					.reduce((aRate, cur) => {
						let foundRate = aRate.find(
							(o) => o.rate === ((cur.dieseInfo && cur.dieseInfo.rate) || 0)
						);

						if (foundRate) {
							foundRate.liter += (cur.dieseInfo && cur.dieseInfo.litre) || 0;
						} else {
							aRate.push({
								rate: (cur.dieseInfo && cur.dieseInfo.rate) || 0,
								liter: (cur.dieseInfo && cur.dieseInfo.litre) || 0,
							});
						}
						vm.totalLit += (cur.dieseInfo && cur.dieseInfo.litre) || 0;

						return aRate;
					}, [])
					.map(
						(o) =>
							`${NumberUtil.toFixed(o.liter)} Ltr. @ ${NumberUtil.toFixed(
								o.rate
							)}`
					)
					.join(" + ") + `,Total ${NumberUtil.toFixed(vm.totalLit)} Ltr.`;
		}

		function delAdvance(index) {
			if (!vm.aAdvances.length) {
				swal("Error", "No Advance Selected", "error");
				closeModal();
				return;
			}
			vm.aAdvances.splice(index, 1);
			calculateAdvance();
		}

		//In case of advance type is equal to Diesel or Driver Case then bill no of  advance and purchase bill should be same
		//In case of advance type is equal to Vendor advance then vendor paymentMode should be Diesel and Diesel Cash and bill no not required

		function addAdvance() {
			vm.oFilter = vm.oFilter || {};

			if (!(vm.oFilter.reference_no || (vm.oFilter.from && vm.oFilter.to)))
				return swal("Error", "Reference No./Date Range is required", "error");

			let oFilter = {
				status: "Diesel Request",
				account:
					vm.aAdvances[0] &&
					vm.aAdvances[0].from_account &&
					vm.aAdvances[0].from_account._id,
				cond: [
					{
						$or: [
							{
								advanceType: { $in: ["Diesel", "Driver Cash"] },
							},
							{
								advanceType: "Vendor Advance",
								"vendorPayment.paymentMode": { $in: ["Diesel", "Diesel Cash"] },
							},
						],
					},
				],
			};

			if (vm.oFilter.reference_no) {
				oFilter.reference_no = vm.oFilter.reference_no;
				oFilter.no_of_docs = 1;
				// oFilter['cond'][0]['$or'][0].bill_no = vm.billNo;
			} else oFilter.no_of_docs = 500;

			if (vm.oFilter.from && vm.oFilter.from) {
				oFilter.from = moment(vm.oFilter.from, "DD/MM/YYYY").toISOString();
				oFilter.to = moment(vm.oFilter.to, "DD/MM/YYYY").toISOString();
			}

			if (vm.billObj && vm.billObj._id)
				oFilter["cond"].push({
					$or: [
						{
							purchaseBill: { $exists: false },
						},
						{
							purchaseBill: vm.billObj._id,
						},
					],
				});
			else
				oFilter["purchaseBill"] = {
					$exists: false,
				};

			if (vm.aAdvances.find((o) => o.reference_no === vm.oFilter.reference_no))
				return swal("Warning", "Advance Already Exist!!!", "warning");

			tripServices.tripAdvances(oFilter, function (res) {
				if (res && res.data && res.data.data && res.data.data.length) {
					res = res.data.data;
					vm.aAdvances.push(
						...res.reduce((arr, obj) => {
							if (!vm.aAdvances.find((o) => o._id === obj._id)) arr.push(obj);
							return arr;
						}, [])
					);
					calculateAdvance();
					vm.oFilter = {};
				} else swal("Warning", "No Advance Found!!!", "warning");
			});
		}

		function getAccount(name, aGroup) {
			if (!(aGroup && name)) return [];

			return new Promise(function (resolve, reject) {
				var oFilter = {
					all: true,
					no_of_docs: 10,
					group: aGroup,
				}; // filter to send

				if (name) oFilter.name = name;

				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {
					rejcet([]);
				}

				// Handle success response
				function onSuccess(response) {
					resolve(response.data.data);
				}
			});
		}

		function getBranch(viewValue, id) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						no_of_docs: 10,
					};

					if (id) req._id = id;
					else if (viewValue) req.name = viewValue;

					branchService.getAllBranches(
						req,
						(res) => {
							resolve(res.data);
						},
						(err) => {
							console.log`${err}`;
							reject([]);
						}
					);
				});
			}

			return [];
		}

		function getRefNo(viewValue, auto) {
			if (!vm.billBookId) {
				// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
				return;
			}

			if (!vm.billDate) {
				swal("Error", "Bill Date is Mandatory", "error");
				return [];
			}

			return new Promise(function (resolve, reject) {
				let requestObj = {
					billBookId: vm.billBookId,
					type: "Ref No",
					useDate: moment(vm.billDate, "DD/MM/YYYY").startOf("day").toDate(),
					status: "unused",
				};

				if (viewValue) requestObj.bookNo = viewValue;

				if (auto) requestObj.auto = true;

				billBookService.getStationery(requestObj, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}
			});
		}

		function onBranchSelect(item) {
			vm.refNo = "";

			vm.billBookId = item.refNoBook ? item.refNoBook.map((o) => o.ref) : "";

			if (item.autoBook) {
				vm.autoBranch = vm.autoBranch || []; // to preserve the auto branch refNo

				let foundBranch = vm.autoBranch.find((o) => o._id === item._id);

				if (foundBranch) vm.refNo = foundBranch.refNo;
				else {
					let pr = getRefNo();
					if (pr instanceof Promise)
						pr.then(function (res) {
							vm.refNo = res.data && res.data[0] && res.data[0].bookNo;
							onRefSelect(res.data[0]);
							vm.autoBranch.push({
								_id: item._id,
								refNo: vm.refNo,
							});
						});
				}
			}
		}

		function onRefSelect(item) {
			vm.selectedRefNo = item;
		}

		function downloadCsv(aData) {
			let cnt = 1;
			objToCsv(
				"Diesel Advances",
				[
					"S. No.",
					"Advance Date",
					"Vehicle No.",
					"Reference No.",
					"Requested Lit",
					"Actual Litre",
					"Difference Lit",
					"Rate",
					"Amount",
					"Status",
				],
				aData.map((o) => {
					let arr = [];
					try {
						arr.push(cnt++ || 0);
					} catch (e) {
						arr.push(0);
					}
					try {
						arr.push($filter("date")(o.date, "dd-MMM-yyyy") || "NA");
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(o.vehicle_no ? o.vehicle_no : o.category);
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(o.reference_no || "NA");
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(o.dieseInfo.litre || 0);
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(o.dieseInfo.actualLit || 0);
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(
							o.dieseInfo.actualLit || 0
								? (o.dieseInfo.actualLit || 0) - (o.dieseInfo.litre || 0)
								: 0
						);
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push($filter("roundOff")(o.dieseInfo.rate, 0) || "NA");
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push($filter("roundOff")(o.amount, 2) || 0);
					} catch (e) {
						arr.push("NA");
					}
					try {
						arr.push(o.checkstatus || "NA");
					} catch (e) {
						arr.push("NA");
					}
					return arr;
				})
			);
		}

		function submit(isAcknowledge = false) {
			if (!vm.from || !vm.from._id)
				return swal("Error", "No From A/c Selected", "error");

			if (vm.from._id == vm.aAdvances[0].from_account._id)
				return swal(
					"Error",
					"Credit A/c and Debit A/c cannot be same account",
					"error"
				);

			if (!vm.aAdvances.length) {
				swal("Error", "No Advance Selected", "error");
				return;
			}

			if (isAcknowledge) {
				if (!vm.refNo) return swal("Error", "Ref No. is Mandatory", "error");

				if (!(vm.branch && vm.branch._id))
					return swal("Error", "Branch is Mandatory", "error");
			}

			if (vm.adjAmount && !(vm.adjDebitAc && vm.adjDebitAc._id))
				return swal("Error", "Adjustment A/c is Mandatory", "error");

			if (vm.tdsAmt && !(vm.tdsAc && vm.tdsAc._id))
				return swal("Error", "TDS A/c is Mandatory", "error");

			let misMatchAdv = false;
			if (vm.aAdvances && vm.aAdvances.length) {
				for (let oAdvance of vm.aAdvances) {
					if (oAdvance.checkstatus != "Matched") misMatchAdv = true;
				}
			}

			if (misMatchAdv) return swal("Error", "Advance are misMatch", "error");

			let request = {
				account: vm.aAdvances[0].from_account._id,
				accountName: vm.vendor,
				billType: "Diesel",
				adjDebitAc: vm.adjDebitAc && vm.adjDebitAc._id,
				adjDebitAcName: vm.adjDebitAc && vm.adjDebitAc.name,
				adjAmount: vm.adjAmount,
				tdsAc: vm.tdsAc && vm.tdsAc._id,
				tdsAcName: vm.tdsAc && vm.tdsAc.name,
				tdsAmt: vm.tdsAmt,
				from_account: vm.from._id,
				from_accountName: vm.from.name,
				billNo: vm.billNo,
				items: vm.aAdvances.map((adv) => adv._id),
				aAdvances: vm.aAdvances,
				totItem: vm.totItem,
				amount: vm.amount,
				totDiscount: vm.discount,
				totalAmount: vm.totalAmount,
				billAmount: vm.billAmount,
				ltr: vm.totalLit,
				remark: vm.remark || "",
				billDate: moment(vm.billDate, "DD/MM/YYYY").toDate(),
				aDiscount: vm.aDiscount || [],
				refNo: vm.refNo,
				branch: vm.branch._id,
			};
			if (vm.aAdvances[0].diesel_info)
				request.vendorFuel = vm.aAdvances[0].diesel_info.vendor;

			if ((vm.selectedRefNo && vm.selectedRefNo.bookNo) === vm.refNo)
				request.stationaryId = vm.selectedRefNo._id;
			else delete request.stationaryId;

			if (isAcknowledge) request.acknowledge = true;

			if (vm.type === "add") {
				billsService.purchaseBillAdd(request, successCallback);
			} else {
				request._id = vm.billObj._id;
				request.account = vm.billObj.account._id;
				billsService.purchaseBillUpdate(request, successCallback);
			}

			function successCallback(response) {
				swal("Success", response.err, "success");
				closeModal();
				return;
			}
		}
	}
);

materialAdmin.controller(
	"tripMemoPreviewCtrl",
	function (
		$rootScope,
		$scope,
		$uibModalInstance,
		customer,
		excelDownload,
		thatTrip,
		clientService,
		sharedResource,
		clientConfig
	) {
		console.log("thatTrip", thatTrip);
		$scope.aTemplate = clientConfig.getFeature("GR", "GR Templates")
			? clientConfig.getFeature("GR", "GR Templates")
			: [];
		$scope.showSubmitButton = !!thatTrip.showSubmitButton;
		$scope.showSubmitAndApproveButton = !!thatTrip.showSubmitAndApproveButton;
		$scope.hidePrintButton = !!thatTrip.billPreviewBeforeGenerate;
		$scope.downloadExcel = downloadExcel;

		$scope.getGR = function (templateKey) {
			var oFilter = angular.copy(thatTrip);
			if (templateKey && templateKey != "default") {
				oFilter.builtyName = templateKey;
			}
			clientService.createBuilty(oFilter, success, fail);
		};

		if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
			$scope.getGR($scope.aTemplate[0].key);
		} else {
			$scope.templateKey = $scope.aTemplate[0];
			$scope.getGR($scope.aTemplate[0].key);
		}

		$scope.printDiv = function (elem) {
			var contents = document.getElementById(elem).innerHTML;
			var frame1 = document.createElement("iframe");
			frame1.name = "frame1";
			frame1.style.position = "absolute";
			frame1.style.top = "-1000000px";
			document.body.appendChild(frame1);
			var frameDoc = frame1.contentWindow
				? frame1.contentWindow
				: frame1.contentDocument.document
				? frame1.contentDocument.document
				: frame1.contentDocument;
			frameDoc.document.open();
			frameDoc.document.write("<html><head><title></title>");
			frameDoc.document.write("</head><body>");
			frameDoc.document.write(contents);
			frameDoc.document.write("</body></html>");
			frameDoc.document.close();
			setTimeout(function () {
				window.frames["frame1"].focus();
				window.frames["frame1"].print();
				document.body.removeChild(frame1);
			}, 500);
		};

		function success(res) {
			$scope.html = angular.copy(res.data);
		}

		function fail(res) {
			swal("Error", "Something Went Wrong", "error");
		}

		function downloadExcel(id) {
			excelDownload.html(
				id,
				"sheet 1",
				`${$scope.aTemplate[0].key}_${moment().format("DD-MM-YYYY")}`
			);
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.submit = function (approve) {
			$uibModalInstance.close(approve ? "approve" : true);
		};
	}
);

materialAdmin.controller(
	"tripPrintCtrl",
	function (
		$rootScope,
		$scope,
		$uibModalInstance,
		customer,
		excelDownload,
		thatTrip,
		clientService,
		sharedResource,
		clientConfig
	) {
		console.log("thatTrip", thatTrip);
		$scope.aTemplate = clientConfig.getFeature("trips", "Trip Templates")
			? clientConfig.getFeature("trips", "Trip Templates")
			: [];
		$scope.showSubmitButton = !!thatTrip.showSubmitButton;
		$scope.showSubmitAndApproveButton = !!thatTrip.showSubmitAndApproveButton;
		$scope.hidePrintButton = !!thatTrip.billPreviewBeforeGenerate;
		$scope.downloadExcel = downloadExcel;

		$scope.getGR = function (templateKey) {
			var oFilter = angular.copy(thatTrip);
			if (templateKey && templateKey != "default") {
				oFilter.pBillName = templateKey;
			}
			clientService.tripBuiltyPrint(oFilter, success, fail);
		};

		if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
			$scope.getGR($scope.aTemplate[0].key);
		} else {
			$scope.templateKey = $scope.aTemplate[0];
			$scope.getGR($scope.aTemplate[0].key);
		}

		$scope.printDiv = function (elem) {
			var contents = document.getElementById(elem).innerHTML;
			var frame1 = document.createElement("iframe");
			frame1.name = "frame1";
			frame1.style.position = "absolute";
			frame1.style.top = "-1000000px";
			document.body.appendChild(frame1);
			var frameDoc = frame1.contentWindow
				? frame1.contentWindow
				: frame1.contentDocument.document
				? frame1.contentDocument.document
				: frame1.contentDocument;
			frameDoc.document.open();
			frameDoc.document.write("<html><head><title></title>");
			frameDoc.document.write("</head><body>");
			frameDoc.document.write(contents);
			frameDoc.document.write("</body></html>");
			frameDoc.document.close();
			setTimeout(function () {
				window.frames["frame1"].focus();
				window.frames["frame1"].print();
				document.body.removeChild(frame1);
			}, 500);
		};

		function success(res) {
			$scope.html = angular.copy(res.data);
		}

		function fail(res) {
			swal("Error", "Something Went Wrong", "error");
		}

		function downloadExcel(id) {
			excelDownload.html(
				id,
				"sheet 1",
				`${$scope.aTemplate[0].key}_${moment().format("DD-MM-YYYY")}`
			);
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss("cancel");
		};

		$scope.submit = function (approve) {
			$uibModalInstance.close(approve ? "approve" : true);
		};
	}
);
