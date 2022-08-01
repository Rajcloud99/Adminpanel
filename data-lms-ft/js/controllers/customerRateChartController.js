materialAdmin.controller("customerRateChartController", function($filter, $rootScope, $scope, $state, $uibModal, $timeout, lazyLoadFactory, stateDataRetain, Pagination, Routes, growlService, Vendor,URL,CustomerRateChartService,customer,DatePicker, tripServices, billingPartyService, cityStateService) {

	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.pagination = angular.copy(Pagination);
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.pagination.items_per_page = 15;
	$scope.totalItems = 0;
	$scope.selectedRateChart = null;
	$scope.orderBy = {'Customer': 1};
	$scope.filterObj = {};
	$scope.selectType = 'multiple';
	$scope.onCustomerSelect =onCustomerSelect;
	$scope.onStateRefresh = function (){
		$scope.getRateChart();
	};

	(function init(){

		if(stateDataRetain.init($scope))
			return;

		$scope.config = 'RATE_CHART';
		// $scope.selectType = 'index';
		$scope.lazyLoad = lazyLoadFactory();
		// $scope.getRateChart(true);
	})();

	const CONFIGS = $scope.$constants.modelConfigs;

	$scope.getRateChart = function(isGetActive, download=false) {

		if(!$scope.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject(download);
		if (oFilter.customer || download) {
			CustomerRateChartService.get(oFilter).then(success);
			function success(response) {
				if(download){
					var a = document.createElement('a');
					a.href = response.url;
					a.download = response.url;
					a.target = '_blank';
					a.click();
					return;
				}else{
					// !response.data.length && swal('error', 'No RateChart Found For This Customer', 'warning');
					$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);
					$scope.tableApi && $scope.tableApi.refresh();
					// $scope.tableApi && $scope.tableApi.refresh();
				}
			}
		} else if (oFilter.billingParty) {
			oFilter.all = true;
			tripServices.getRate(oFilter, function success(response) {
				if(response.data && response.data.data){

					let res = {data: []};
					response.data.data.forEach(aRate => {
						res.data.push(...aRate.rates);
					})

					// !response.data.length && swal('error', 'No RateChart Found For This Customer', 'warning');
					$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res);
					$scope.tableApi && $scope.tableApi.refresh();
					// $scope.tableApi && $scope.tableApi.refresh();
				}
			},function (err) {
				console.log(err);
				reject([]);
			});
		}else {
			swal('error', 'Please Select a Customer', 'error');
		}
	};
	$scope.onCustSelect = function(){
		$scope.filterObj.onSelect = true;
	};
	$scope.clear = function(){
		$scope.rateCharts =  [];
	};

	$scope.onBillingPartySelect = function(){
		$scope.columnSetting = {
			allowedColumn: [
				'Date',
				'Billing Party',
				'HSN Code',
				'Rate',
				'Created At',
				'Created By'
			]
		};

		$scope.tableHead = [
			{
				'header': 'Date',
				'bindingKeys': 'effectiveDate',
				'date': true,
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name'
			},
			{
				'header': 'HSN Code',
				'bindingKeys': 'hsnCode',
				'date': false
			},

			{
				'header': 'Rate',
				'bindingKeys': 'rate'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'uploaded_at || created_at',
				'date': true,
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Created By',
				'bindingKeys': 'uploaded_by'

			},

		];
	}

	function onCustomerSelect($item, $model, $label) {
		if($item.configs && $item.configs[$scope.config] && $item.configs[$scope.config].configs) {
			cachedConfig = {
				...$item.configs[$scope.config].configs,
			};
			$scope.selectedConfig = cachedConfig;
			$scope.prepareTable();
		} else {
			$scope.selectedConfig = CONFIGS[$scope.config];
			$scope.prepareTable();
		}
	}
	$scope.columnSetting = {};
	$scope.prepareTable = function(){
		$scope.tableHead = [];
		$scope.allowedColumn = [];
		for(let key in $scope.selectedConfig){
			if($scope.selectedConfig.hasOwnProperty(key)) {
				if (Array.isArray($scope.selectedConfig[key])) {
					for (let k = 0; k < $scope.selectedConfig[key].length; k++) {
						let d = $scope.selectedConfig[key][k];
						d.fieldValue = `${key}[${k}] && ${key}[${k}].rate || 'NA'`;
						d.reportLabel = `${key}[${k}] && ${key}[${k}].label || 'NA'`;
						$scope.tableHead.push({
							header: d.label,
							bindingKeys:  d.fieldValue,
							visible: d.visible
						});
						$scope.allowedColumn.push(d.label);
					}
				} else {
					if($scope.selectedConfig[key].type === '__date__'){
						$scope.date = 'dd-MMM-yyyy'}
					else{
						$scope.date = false;}
					$scope.tableHead.push({header:$scope.selectedConfig[key].label, bindingKeys:key, visible:$scope.selectedConfig[key].visible, date : $scope.date});
					$scope.allowedColumn.push($scope.selectedConfig[key].label);
				}
			}
		}
		$scope.columnSetting ={isTrue: true,allowedColumn:$scope.allowedColumn};
	};
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
		smartButtonTextConverter: function(itemText, originalItem) {
			return itemText;
		}
	};

	/*
	* Multi Select with Search Dropdown Events*/
	$scope.selectEvents = {
		onSelectionChanged: function () {
			$scope.getRateChart(true);
		}
	};

	$scope.addRateChart = function(op){
		$rootScope.operationType = op || 'add';
		if($rootScope.operationType === 'edit') {
			if (!$scope.selectedRateChart || $scope.selectedRateChart.length > 1) {
				swal('Error', 'Select only 1 rate chart to edit', 'error');
				return;
			}
		}
		var modalInstance = $uibModal.open({
			templateUrl: 'views/customerRateChart/addRateChartPopup.html',
			controller: 'addRateChartPopupCtrl',
			resolve: {
				operationType: function () {
					return $rootScope.operationType;
				},
				oRC: function() {
					return $rootScope.operationType === 'edit' ? $scope.selectedRateChart[0] : null
				}
			}
		});
		modalInstance.result.then(function(data) {
			$scope.getRateChart();
		}, function(data) {
			if (data !== 'cancel') {}
		});
	};

	$scope.uploadRateChart = function() {
		$rootScope.operationType = 'add';
		var modalInstance = $uibModal.open({
			templateUrl: 'views/customerRateChart/uploadRateChartPopup.html',
			controller: 'uploadRateChartPopupCtrl'
		});
		modalInstance.result.then(function(data) {
			$state.reload();
		}, function(data) {
			if (data !== 'cancel') {}
		});
	};


	 $scope.downloadRate = function(download) {

		let request = prepareFilterObject(download);

		 delete request.skip;

			if (!(request.from && request.to)) {
				swal('Warning', 'From and To should be filled', 'warning');
				return;
			}

		 if (!(request.billingParty)) {
			 swal('Warning', 'billingParty should be filled', 'warning');
			 return;
		 }

		 tripServices.getRate(request, function (d) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			});
		}


	$scope.uploadRate = function() {
		$rootScope.operationType = 'add';
		var modalInstance = $uibModal.open({
			templateUrl: 'views/customerRateChart/rateUploadPopup.html',
			controller: 'rateUploadPopupCtrl'
		});
		modalInstance.result.then(function(data) {
			$state.reload();
		}, function(data) {
			if (data !== 'cancel') {}
		});
	};

	$scope.deleteRateChart = function() {
		CustomerRateChartService.remove({ids:$scope.selectedRateChart.map(x=>x._id)}).then((d)=>{
			swal('Success', d.message, 'success');
			$state.reload();
		});
	};

	$scope.deleteRate = function() {

		swal({
				title: 'Do you want to Delete Rate?',
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

					CustomerRateChartService.deleteRate({ids:$scope.selectedRateChart.map(x=>x._id)}).then((d)=>{
						swal('Success', d.message, 'success');
						$scope.filterObj.billingParty = undefined;
						$state.reload();
					});
				} else
					return;
			});
	};

	$scope.getCustomers = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			customer.getCname(viewValue, function success(res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.getBillingParty = function (viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					let req = {
						name: viewValue,
						no_of_docs: 10,
					};

					billingPartyService.getBillingParty(req, res => {
						resolve(res.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}
			return [];
		}

	$scope.getCity = function (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.getRoute = function (viewValue, projection) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			CustomerRateChartService.get({
				_t: 'autosuggest',
				[projection]: viewValue,
				projection
			})
				.then((res) => {
					resolve(res.data);
				})
				.catch(e => reject([]));
		});
	};

	$scope.submit = function (form) {
		if (!form.$valid) {
			swal('error', 'Please Select a Customer', 'error');
			return;
		}

		// if (!($scope.filterObj.customer && $scope.filterObj.customer._id)) {
		// 	swal('error', 'No Valid Customer Selected', 'warning');
		// 	return;
		// }

		$scope.getRateChart(null, false);

	};
	$scope.edit = function(){
		$rootScope.operationType = 'update';
	};

	function prepareFilterObject(download){
		var myFilter = {};
		if($scope.filterObj.customer)
			myFilter.customer = $scope.filterObj.customer._id;
		if($scope.filterObj.billingParty)
			myFilter.billingParty = $scope.filterObj.billingParty._id;
		if($scope.filterObj.hsnCode)
			myFilter.hsnCode = $scope.filterObj.hsnCode;
		if($scope.filterObj.source)
			myFilter.source = $scope.filterObj.source;
		if($scope.filterObj.destination)
			myFilter.destination = $scope.filterObj.destination;
		if($scope.filterObj.from)
			myFilter.from = $scope.filterObj.from.toISOString();
		if($scope.filterObj.to)
			myFilter.to = $scope.filterObj.to.toISOString();
		if(download){
			myFilter.download = download;
			myFilter.all = true;
		}
		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 20;
		return myFilter;
	}

});


materialAdmin.controller('addRateChartPopupCtrl', function($filter, $rootScope, $scope, $state, $uibModal, $timeout, lazyLoadFactory, Pagination, Routes, growlService, Vendor,URL,DatePicker, $uibModalInstance,customer,CustomerRateChartService,materialService,Vehicle, oRC,operationType, cityStateService) {

	$scope.operationType = operationType;
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oRateChart = {
		grCharges: {},
		surCharges: {},
		cartageCharges: {},
		labourCharges: {},
		otherCharges: {},
		prevFreightCharges: {},
		detention: {},
		discount: {},
		incentive: {},
	};
	if ($scope.operationType === 'edit') {
		$scope.oRateChart = {
			...$scope.oRateChart,
			...oRC,
			effectiveDate: new Date(oRC.effectiveDate),
			materialSearchModel: { newName: oRC.materialGroupCode }
		};
	}

	$scope.vehicleRates = [];
	// $scope.baseRate = [];
	// $scope.getMaterialGroup = getMaterialGroup;

	$scope.submit = function (form) {
		if(!form.$valid) return;
		var oSend = Object.assign({}, $scope.oRateChart);
		oSend.customer = oSend.customer._id;
		if ($scope.vehicleRates.length > 0) {
			oSend = $scope.vehicleRates.map(function(vr) {
				return { ...oSend, ...vr };
			});
		}
		var rc = $scope.rateChartConfig.find(z => z.field === 'baseRate');
		if(rc) {
			oSend.baseRate = rc.values.map(v => ({
				rate:v.rate,
				baseVal:v.baseVal,
				label:v.label,
			}));
		}
		CustomerRateChartService.add(oSend)
			.then(d => {
				swal("success", d.message,"success");
				$uibModalInstance.close(d);
			})
			.catch(e => {
				swal(e.data.error,e.data.message,'error');
			});
	};

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getCustomers = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			customer.getCname(viewValue, function success(res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.getMaterialGroup = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			materialService.getMaterialGroups({name:viewValue}, function(res) {
				resolve(slicer(res.data).map(o => {
					o.newName = o.name === o.code ? o.name : o.name + `(${o.code})`;
					return o;
				}));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.materialOnSelect = function($item){
		$scope.oRateChart.materialGroupCode = $item.code;
		$scope.oRateChart.materialGroupName = $item.name;
	};

	$scope.getVehicleType = function(viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			Vehicle.getTypes({name: viewValue}, function(res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.getCity = function (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.getSource = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			CustomerRateChartService.get({_t: 'autosuggest', source: viewValue, projection: 'source'})
				.then((res) => {
					resolve(slicer(res.data, 0, 2));
				})
				.catch(e => reject([]));
		});
	};

	$scope.getDestination = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			CustomerRateChartService.get({_t: 'autosuggest', destination: viewValue, projection: 'destination'})
				.then((res) => {
					resolve(slicer(res.data, 0, 2));
				})
				.catch(e => reject([]));
		});
	};

	$scope.$watch('oRateChart.customer', function(newValue, oldValue) {
		if(typeof newValue === 'object') {
			if(newValue.configs && newValue.configs.RATE_CHART && newValue.configs.RATE_CHART.configs) {
				setConfigs(newValue);
			} else {
				customer.getCustomer(newValue._id, function (cust) {
					setConfigs(cust.data[0]);
				}, function (e) {});
			}
		}
	});

	function setConfigs(newValue) {
		var aRC = [];
		if(newValue.configs && newValue.configs.RATE_CHART && newValue.configs.RATE_CHART.configs) {
			for(let k in newValue.configs.RATE_CHART.configs){
				if(newValue.configs.RATE_CHART.configs.hasOwnProperty(k)) {
					if (k !== "baseRate") {
						aRC.push({...newValue.configs.RATE_CHART.configs[k], field:k});
					} else {
						aRC.push({
							field:k,
							values: newValue.configs.RATE_CHART.configs[k],
						});
					}
				}
			}
		}
		// var aRC = newValue.rateChartConfig || [];
		put(aRC, { field: "effectiveDate", label: "Date" });
		put(aRC, { field: "source", label: "Source" });
		put(aRC, { field: "destination", label: "Destination" });
		put(aRC, { field: "materialGroupCode", label: "Material Group Code" });
		put(aRC, { field: "routeDistance", label: "Route KMs" });
		put(aRC, { field: "unit", label: "Payment Basis" });
		put(aRC, { field: "rate", label: "Rate" });
		$scope.rateChartConfig = aRC;
	}

	$scope.addVehicleRate = function () {
		if(!$scope.Xrate || !$scope.XvehicleType) {
			return;
		}
		$scope.vehicleRates.push({
			rate: $scope.Xrate,
			vehicleTypeCode: $scope.XvehicleType
		});
		$scope.Xrate = undefined;
		$scope.XvehicleType = undefined;
		$scope.errMsg = undefined;
	};

});

materialAdmin.controller('uploadRateChartPopupCtrl', function($filter, $rootScope, $scope, $state, $uibModal, $timeout, lazyLoadFactory, Pagination, Routes, growlService, Vendor,URL,DatePicker, $uibModalInstance,customer,CustomerRateChartService,materialService,Vehicle,$modalInstance,objToCsv) {

	$scope.customer = undefined;

	$scope.getCustomers = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			customer.getCname(viewValue, function success(res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.closeModal = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.upload = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('rateChartExcel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			CustomerRateChartService.uploadDownloadSample({upload: 1}, data, $scope.customer._id)
				.then(function (d) {
					if (d.stats && d.stats.length > 0) {
						const header = ['DATE', 'SOURCE', 'DESTINATION', 'STATUS', 'REJECTION REASON'];
						const body = d.stats.map(o => header.map(s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));
						objToCsv('RateChartLog', header, body);
					}
					swal({
						title:d.message || 'success',
						text:'',
						type:"info"
					});
					$uibModalInstance.close();
				})
				.catch(function (e) {
					swal({title:e.data && e.data.error || 'Something went wrong', type:"error"});
				});
		}
	};

	$scope.downloadSample = function (c) {
		if($scope.customer) {
			CustomerRateChartService.uploadDownloadSample({download: 1}, {}, $scope.customer._id)
				.then(function (d) {
					var $a = document.createElement('a');
					$a.setAttribute("type", "hidden");
					$a.setAttribute("title", d.url);
					$a.setAttribute('href', d.url);
					$a.setAttribute('target','_blank');
					document.body.appendChild($a);
					$a.click();
					document.body.removeChild($a);
				})
				.catch(function (e) {});
		}
	};

});

materialAdmin.controller('rateUploadPopupCtrl', function($scope, $state, $uibModal, DatePicker, $uibModalInstance,CustomerRateChartService,$modalInstance,objToCsv) {

	$scope.closeModal = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.upload = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('commanRateExcel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			CustomerRateChartService.uploadDownloadRate({upload: 1}, data)
				.then(function (d) {
					swal({
						title:d.message || 'success',
						text:'',
						type:"info"
					});
					$uibModalInstance.close();
				})
				.catch(function (e) {
					swal({title:e.data && e.data.message || 'Something went wrong', type:"error"});
				});
		}
	};

	$scope.downloadSample = function (c) {
			CustomerRateChartService.uploadDownloadRate({download: 1}, {})
				.then(function (d) {
					var $a = document.createElement('a');
					$a.setAttribute("type", "hidden");
					$a.setAttribute("title", d.url);
					$a.setAttribute('href', d.url);
					$a.setAttribute('target','_blank');
					document.body.appendChild($a);
					$a.click();
					document.body.removeChild($a);
				})
				.catch(function (e) {});
	};

});

function slicer(arr, f = 0, n = 5) {
	return arr.slice(f, n)
}

function put(arr, o) {
	var isFound = arr.find(function(x) {
		return x.field === o.field;
	});
	if(!isFound) {
		arr.push(o);
	}
}
