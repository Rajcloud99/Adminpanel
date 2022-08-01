materialAdmin.controller("customerCommonController", function($rootScope, $scope, $uibModal, $location, $localStorage, $timeout, URL, customer, DatePicker, ReportService, Vehicle, growlService, formValidationgrowlService, dmsService) {
    $("p").text("Customer");
    $rootScope.wantThis = false;
    $rootScope.wantThis2 = false;
    $rootScope.wantThis3 = false;
	$scope.status = ['Enable', 'Disable'];
    //console.log("User logged in "+ JSON.stringify($localStorage.userLoggedIn.clientId));

    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.filterObj={}
    $scope.dateChange = dateChange;
	$scope.DatePicker = angular.copy(DatePicker);
    $scope.pageChanged = function() {
        $scope.getCustomers(true);
    };

	$scope.uploadFiles = function () {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve:{
				oUploadData:{
					modelName: 'customer',
					scopeModel : $scope.customer,
					scopeModelId:$scope.customer._id,
					uploadText: "Upload Customer Documents",
					uploadFunction:customer.updateTheCustomer,
				}
			}
		});
		modalInstance.result.then(function(data) {
			//$state.reload();
			//console.log(data);
			if(data && data.data){
				//$scope.vendor = data.data;
			}
		}, function(data) {
			if (data != 'cancel') {
				//swal("Oops!", data.data.message, "error")
			}
		});
	}

	$scope.previewDocs = function () {
		if(!($scope.customer && $scope.customer._id))
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: $scope.customer._id,
				modelName: "customer"
			};
			dmsService.getAllDocs( req,success,failure);

			function success(res) {
				if (res && res.data) {
					$scope.oDoc = res.data;
					prepareData();
				}else{
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
			let mergeData = {};
			$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj=>{
				mergeData[obj.category] = mergeData[obj.category] || [];
				mergeData[obj.category].push(obj);
			});
			$scope.oDoc = mergeData;

			for (let [key, val] of Object.entries($scope.oDoc)) {
				if(Array.isArray(val)){
					val.forEach((doc, i) => {
						let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
						documents.push({
							name,
							docName:doc.name,
							_id: $scope.customer._id,
							modelName: 'customer',
							url: `${URL.file_server}${doc.name}`
						});
					});
				}else{
					let name = `${key|| 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName:doc.name,
						_id: $scope.customer._id,
						modelName: 'customer',
						url: `${URL.file_server}${doc.name}`
					});
				}
			}

			$uibModal.open({
				templateUrl: 'views/carouselPopup.html',
				controller: 'carouselCtrl',
				resolve: {
					documents: function () {
						return documents;
					}
				}
			});
		}

		// if (documents.length < 1) {
		// 	growlService.growl("No documents to preview", "warning");
		// 	return;
		// }

	};

	$scope.editClientId = function () {
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
					client_type : 'customer',
					name:$scope.customer.name,
					clientId:$scope.customer.clientId,
					clientR:$scope.customer.clientR,
					_id:$scope.customer._id,
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			$rootScope.selectedInfo = data.data.data;
		}, function (data) {
		});
	};

    $scope.downloadReport = function() {

		// if(!($scope.filterObj.start_date && $scope.filterObj.end_date)){
		// 	swal('warning', "Both From and To Date should be Filled",'warning');
		// 	return;
		// }
		var oFilter = prepareFilterObject();
		oFilter.download = true;
		oFilter.all = true;
        ReportService.getCustomerReport(oFilter, function(data) {
            if (data.data.url) {
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            }
        });
    }

	$scope.customersStatus = function(type){

		swal({
				title: `Are you sure you want to ${type} this Customers? `,
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
						_id:$scope.customer._id
					};
					if(type === 'Enable')
						oRequest.deleted = false;
					else if(type === 'Disable')
						oRequest.deleted = true;

					customer.deleteStatus(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Customer updated!!', 'success');
						$scope.getCustomers();
					}
				}
			});
		return;
	};

    function prepareFilterObject(isPagination) {
        var myFilter = {};
        if ($scope.customerName) {
            myFilter._id = $scope.customerName._id;
        }

		if($scope.filterObj.start_date)
			myFilter.from = $scope.filterObj.start_date;

		if($scope.filterObj.end_date)
			myFilter.to = $scope.filterObj.end_date;

		if ($scope.filterObj.status) {
			if($scope.filterObj.status === 'Enable')
				myFilter.deleted = false;
			else if($scope.filterObj.status === 'Disable')
				myFilter.deleted = true;
		}else {
			myFilter.deleted = false;
		}

            myFilter.skip = $scope.currentPage;
        /*else if($stateParams.skip){
             myFilter.skip = $stateParams.skip;
             $scope.currentPage = $stateParams.skip;
           } */
        return myFilter;
    };

	function  dateChange() {
		$scope.filterObj.end_date = new Date($scope.filterObj.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.filterObj.end_date).setMonth($scope.filterObj.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > $scope.filterObj.start_date)
		$scope.filterObj.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23,59,59));
	};

    $rootScope.getCustomers = function(isPagination) {
        function success(data) {
            $rootScope.customers = data.data;
            $scope.customers = data.data;
            if ($rootScope.customers.length > 0) {
                for (var p = 0; p < $rootScope.customers.length; p++) {
                    if ($rootScope.customers[p].last_modified_at) {
                        $rootScope.customers[p].last_modified_at = moment($rootScope.customers[p].last_modified_at).format('LLL');
                    }
                    if ($rootScope.customers[p].created_at) {
                        $rootScope.customers[p].created_at = moment($rootScope.customers[p].created_at).format('LLL');
                    }
                }
            }
            if (data.data && data.data.length > 0) {
                $rootScope.customer = data.data[0];
                // $scope.total_pages = data.pages;
                // $scope.totalItems = 15 * data.pages;
				$scope.total_pages = data.count/$scope.items_per_page;
				$scope.totalItems = data.count;
				$scope.setClientName();
                setTimeout(function() {
                    listItem = $($('.lv-item')[0]);
                    listItem.addClass('grn');
                }, 500);
                // console.log($rootScope.customers);
            }
        };

        $scope.$watch(function() {
            return $rootScope.customer;
        }, function() {
            try {
                $scope.customer = $rootScope.customer;
            } catch (e) {
                //console.log('catch in driverProfileController');
            }
        }, true);
        var oFilter = prepareFilterObject(isPagination);
        customer.getAllcustomers({...oFilter, src:'masters'}, success);
    }
    $rootScope.getCustomers(); // get all customer funtion call

	$scope.setClientName = function() {
		if($rootScope.customer.clientR[0]) {
			$rootScope.customer.clientName = [2];
			var i = 0;
			$rootScope.$configs.clientR.forEach(function (id) {
				if (id.lms_id == $rootScope.customer.clientR[i])
					$rootScope.customer.clientName[i++] = id.name;
			});
		}
	};

    function oSucC(response) {
        $scope.customers = response.data;
    };

    function oFailC(response) {
        console.log(response);
    }

    $scope.clearSearch = function() {
        $scope.customerName = '';
        $scope.getCname($scope.customerName);
    }

    $scope.getCname = function(viewValue) {
        if (viewValue && viewValue.toString().length > 2) {
			var oFilter = prepareFilterObject(false);
			oFilter.name = viewValue;
			delete oFilter._id;
			customer.getAllcustomers({...oFilter, src:'masters'}, oSucC, oFailC);
        } else if (viewValue == '') {
            $scope.currentPage = 1;
            //$stateParams.name = '';
            //var sUrl = "#!/masters/vendorRegistration/profile"+"/" +$scope.currentPage +"/";
            $scope.getCustomers();
        };
    };

    $scope.onSelect = function($item, $model, $label) {
        $scope.currentPage = 1;
        $scope.getCustomers();
    };

    function suc(response) {
        $rootScope.vehicleTypes = response.data.data;
    };

    function fail(response) {
        console.log('failed', response);
    };
    //$scope.cities = dataServices.loadCities();
    $scope.selectCustomer = function(customer, index) {
        var sUrl = "#!/masters/customer/profile";
        $rootScope.redirect(sUrl);
        $rootScope.customer = customer;
		$scope.setClientName();
		$rootScope.aContractS = [];
        listItem = $($('.lv-item')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');

    };
    $scope.newDriverReg = function() {
        $rootScope.driver = {};
        listItem = $($('.lv-item'));
        listItem.siblings().removeClass('grn');
    };
    $rootScope.formateDate = function(date) {
        return new Date(date);
    };

    $rootScope.$watch(function() {
            return $location.path();
        },
        function(a) {
            //console.log('url has changed: ' + a);
            $rootScope.currentPath = $location.path();
            //$sessionStorage.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno";

            $timeout(function() {
                if ($rootScope.currentPath == '/masters/customer/profile') {
                    $scope.hideBtns = false;
                } else {
                    $scope.hideBtns = true;
                }
            }, 100);
        });
});

materialAdmin.controller("customerProfileCtrl", function($rootScope, $localStorage, $scope, customer) {
    $rootScope.wantThis = false;
    $rootScope.wantThis2 = true;
    $rootScope.wantThis3 = false;
});
materialAdmin.controller("gpsViewCtrl", function($rootScope, $localStorage, $scope, customer) {
	$scope.aGpsView = [ $rootScope.customer.gps_view];
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
});

materialAdmin.controller("registerCustomerController", function(
	$rootScope,
	$interval,
	$localStorage,
	$modal,
	$scope,
	accountingService,
	branchService,
	otherUtils,
	customer,
	formValidationgrowlService
) {
    $rootScope.wantThis = false;
    $rootScope.wantThis2 = false;
    $rootScope.wantThis3 = true;
    $scope.customerSel = {};
    $scope.geolocate = function(sUId) {
        googlePlaceAPI.geolocate(sUId);
    };

    // get the list of state code from otherUtils
	$scope.aGSTstates = otherUtils.getState();

	if ($scope.$configs.clientOps) {
		$scope.customerSel.clientR =  $scope.$configs.clientOps;
	}else {
		$scope.customerSel.clientR =  $scope.selectedClient;
	}

    /*var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope, ['city']);

    $scope.searchRegisterCity = function() {
        setTimeout(function() {
            if ($scope.city && $scope.city.d) {
                $scope.$apply(function() {
                    $scope.district = '';
                    $scope.district = $scope.city.d;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.st) {
                $scope.$apply(function() {
                    $scope.state = '';
                    $scope.state = $scope.city.st;
                    $scope.customerSel.state_code = otherUtils.gstStateCode($scope.city.st_s);
                });
                //console.log($scope.city.s);
            }
            if ($scope.city && $scope.city.p) {
                $scope.$apply(function() {
                    $scope.pincode = '';
                    $scope.pincode = $scope.city.p;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.cnt) {
                $scope.$apply(function() {
                    $scope.country = '';
                    $scope.country = $scope.city.cnt;
                });
                //console.log($scope.city.cnt);
            }
        }, 500);
    };*/

    // custTypes
    $scope.custTypes = ($scope.$configs.master && $scope.$configs.master.customer && $scope.$configs.master.customer.aCustType) ?
        $scope.$configs.master.customer.aCustType : $scope.$constants.aCustomerType;

	//categoryTypes
	$scope.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
	if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
		Array.prototype.push.apply($scope.aCategory, $scope.$configs.customer.category);
    }
    // selected fruits
    $scope.selection = [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(custT) {
        var idx = $scope.selection.indexOf(custT);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(custT);
        }
    };

	/*
    * Get all Customer List
    * */
	// (function getAllCustomers() {
	// 	function success(data) {
	// 		$scope.aCustomers = data.data;
	// 	}
	// 	var customerFilter = {
	// 		all: true,
	// 		status: "Active"
	// 	};
	// 	customer.getAllcustomers(customerFilter, success);
	// })();

	// Set the state code when state is selected
	$scope.setStateCode = function(state){
		$scope.customerSel.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};

    $scope.saveCustomerDetails = function(form) {
        function successPost(response) {
            if (response && response.data && response.data.data) {
                $scope.customerSel = ' ';
                $scope.city = {};
                $rootScope.getCustomers();
                swal("Customer Registered Successfully", "", "success");
                var sUrl = "#!/masters/customer/profile";
                $rootScope.redirect(sUrl);
            }
        }

        function failure(res) {
            console.log("fail: ", res);
        }
        if (form.$valid) {
                $scope.cmsg1 = $scope.cmsg2 = $scope.cmsg3 = $scope.cmsg4 = $scope.cmsg4 = '';
                if ($scope.customerSel && $scope.customerSel.black_listed === true) {
                    $scope.customerSel.black_listed = true;
                } else {
                    $scope.customerSel.black_listed = false;
                }
                if ($scope.selection && $scope.selection.length > 0) {
                    $scope.customerSel.type = $scope.selection;
                }
                if ($localStorage.userLoggedIn && $localStorage.userLoggedIn.clientId) {
                    $scope.customerSel.clientId = $localStorage.userLoggedIn.clientId
                }
				$scope.customerSel.address = {};
				$scope.customerSel.address.line1 = $scope.customerSel.line1 || '';
				$scope.customerSel.address.line2 = $scope.customerSel.line2 || '';
				$scope.customerSel.address.city = $scope.customerSel.city;
				// $scope.customerSel.address.clientR = $scope.customerSel.clientR;
				$scope.customerSel.address.district = $scope.customerSel.district;
				$scope.customerSel.address.state = $scope.customerSel.state;
				$scope.customerSel.address.lms_id = $scope.customerSel.lms_id;
				$scope.customerSel.address.pincode = $scope.customerSel.pincode;
				$scope.customerSel.address.country = $scope.customerSel.country;

                customer.saveCustomer($scope.customerSel, successPost, failure);
        } else {
            $scope.dmsg = '';
            $scope.createcustmsg = true;
            $scope.dmsg = formValidationgrowlService.findError(form.$error);
            setTimeout(function() {
                if ($scope.createcustmsg) {
                    $scope.$apply(function() {
                        $scope.createcustmsg = false;
                    });
                }
            }, 7000);
        }
    };

	(function getBranch(){
		if($scope.$aBranch.length > 0){
			$scope.aBranches = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		}
		branchService.getBranches(branchFilter, successBranches);
		function successBranches(data) {
			$scope.aBranches = data.data;
		}
	})();

	// try{
	// 	if($scope.$configs.master.showAccount){
	// 		// Get Account Masters
	// 		(function getAccountMasters(){
    //
	// 			var oFilter = {
	// 				all: true
	// 			}; // filter to send
	// 			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
    //
	// 			// Handle failure response
	// 			function onFailure(response) {
    //
	// 			}
    //
	// 			// Handle success response
	// 			function onSuccess(response){
	// 				response.data.data.unshift({
	// 					'name': "Add New Account",
	// 					'_id':  "addNewAccount"
	// 				});
	// 				$scope.aAccountMaster = response.data.data;
	// 			}
	// 		})();
    //
	// 		$scope.onSelectAccount = function () {
	// 			if($scope.account === "addNewAccount"){
	// 				$scope.account = null;
	// 				var modalInstance = $modal.open({
	// 					templateUrl: 'views/accounting/accountMasterUpsert.html',
	// 					controller: 'accountMasterUpsertController',
	// 					resolve: {
	// 						'selectedAccountMaster': function () {
	// 							return {
	// 								'accountType' : 'Cash in Hand',
	// 								'branch': $scope.oBranch,
	// 								'group': 'Customer',
	// 								'name': $scope.customerSel.name,
	// 								'isAdd': true
	// 							};
	// 						}
	// 					}
	// 				});
    //
	// 				modalInstance.result.then(function(response) {
	// 					if(response)
	// 						$scope.aAccountMaster.push(response);
	// 						$scope.account = response._id;
    //
	// 					console.log('close',response);
	// 				}, function(data) {
	// 					console.log('cancel');
	// 				});
	// 			}
    //
	// 		};
	// 	}
	// }catch(e){}
});

materialAdmin.controller("editCustomerController", function(
	$rootScope,
	$localStorage,
	$scope,
	$state,
	$interval,
	$modal,
	$timeout,
	accountingService,
	otherUtils,
	customer,
	formValidationgrowlService,
	growlService,
	branchService
) {
	try{

		$scope.customer = $rootScope.customer;
		$scope.city = $scope.customer.address.city;
		$scope.clientR = $scope.customer.address.clientR;
		$scope.district = $scope.customer.address.district;
		$scope.state = $scope.customer.address.state;
		$scope.pincode = $scope.customer.address.pincode;
		$scope.country = $scope.customer.address.country;

	}catch(e){}

    $("p").text("Customer");
    $rootScope.wantThis = true;
    $rootScope.wantThis2 = false;
    $rootScope.wantReg = false;
    $rootScope.wantThis3 = false;
    $scope.account = null;

	// custTypes
    $scope.custTypes = ($scope.$configs.master && $scope.$configs.master.customer && $scope.$configs.master.customer.aCustType) ?
        $scope.$configs.master.customer.aCustType : $scope.$constants.aCustomerType;

    //categoryTypes
	$scope.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];

	if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
		Array.prototype.push.apply($scope.aCategory, $scope.$configs.customer.category);
	}

    $scope.aGSTstates = otherUtils.getState();

	if ($scope.$configs.clientOps) {
		$scope.customer.clientR =  $scope.$configs.clientOps;
	}else {
		$scope.customer.clientR =  $scope.selectedClient;
	}

	try{$scope.oBranch = $scope.customer.branch._id || $scope.customer.branch;}catch(e){}

	try{$scope.account = ($scope.customer.account && $scope.customer.account._id) || $scope.customer.account;}catch(e){}
	$scope.showAccountDropdown = ($scope.account) ? false : true;

	try{$scope.customerId = $scope.customer.customer._id || $scope.customer.customer;}catch(e){}

	$scope.onChange = function (customerId) {
		$scope.customerId = customerId;
	};

    $scope.geolocate = function(sUId) {
        googlePlaceAPI.geolocate(sUId);
    };
    /*var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope, ['city']);

    $scope.searchRegisterCity = function() {
        setTimeout(function() {
            if ($scope.city && $scope.city.d) {
                $scope.$apply(function() {
                    $scope.district = '';
                    $scope.district = $scope.city.d;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.st) {
                $scope.$apply(function() {
                    $scope.state = '';
                    $scope.state = $scope.city.st;
                    $scope.customer.state_code = otherUtils.gstStateCode($scope.city.st_s);
                });
                //console.log($scope.city.s);
            }
            if ($scope.city && $scope.city.p) {
                $scope.$apply(function() {
                    $scope.pincode = '';
                    $scope.pincode = $scope.city.p;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.cnt) {
                $scope.$apply(function() {
                    $scope.country = '';
                    $scope.country = $scope.city.cnt;
                });
                //console.log($scope.city.cnt);
            }
        }, 500);
    };*/

    /*$scope.$watch(function() {
        return $rootScope.customer;
    }, function() {
        try {
            $scope.customer = $rootScope.customer;
            //$scope.city = {};
            $scope.city = $scope.customer.address.city;
            $scope.district = $scope.customer.address.district;
            $scope.state = $scope.customer.address.state;
            $scope.pincode = $scope.customer.address.pincode;
            $scope.country = $scope.customer.address.country;
        } catch (e) {
            //console.log('catch in truckIdentificationController');
        }
    }, true);*/

    $scope.setStateCode = function(state){
		$scope.customer.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};

    // selected fruits
    $scope.selection = ($rootScope.customer && $rootScope.customer.type) || [];

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(custT) {
        var idx = $scope.selection.indexOf(custT);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(custT);
        }
    };

	/*
    * Get all Customer List
    * */
	// (function getAllCustomers() {
	// 	function success(data) {
	// 		$scope.aCustomers = data.data;
	// 	}
	// 	var customerFilter = {
	// 		all: true,
	// 		status: "Active"
	// 	};
	// 	customer.getAllcustomers(customerFilter, success);
	// })();

    $scope.saveEditCustDetails = function saveEditCustDetails(vform) {
        function success(response) {
            if (response && response.data && response.data.data) {
                $rootScope.customer = response.data.data;
                //$rootScope.getCustomers();
                growlService.growl(response.data.message, "success");
                //swal(response.data.message,"","success");
				$state.go('masters.customer.profile');
            }
        }

        function failure(response) {
			growlService.growl(response.data.message, "danger");
            console.error("fail: ", response);
        }


		//$scope.customer.address = {};
		//$scope.customer.address.line1 = $scope.customer.address.line1;
		//$scope.customer.address.line2 = $scope.customer.address.line2;
		$scope.customer.branch = $scope.oBranch;
		$scope.customer.customer = $scope.customerId;
		$scope.customer.account = $scope.account;
		$scope.customer.address.city = $scope.city;
		$scope.customer.address.district = $scope.district;
		$scope.customer.address.state = $scope.state;
		// $scope.customer.address.clientR = $scope.clientR;
		$scope.customer.address.pincode = $scope.pincode;
		$scope.customer.address.country = $scope.country;


        if (vform.$valid) {
            $scope.customer.type = $scope.selection;
			delete $scope.customer.sap_id;
            customer.updateCustomer($scope.customer, success, failure);
        } else {
            $scope.dmsg = '';
            $scope.updatecustmsg = true;
            $scope.dmsg = formValidationgrowlService.findError(vform.$error);
            setTimeout(function() {
                if ($scope.updatecustmsg) {
                    $scope.$apply(function() {
                        $scope.updatecustmsg = false;
                    });
                }
            }, 7000);
        }

    };

	(function getBranch(){
		if($scope.$aBranch.length > 0){
			$scope.aBranches = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		}
		branchService.getBranches(branchFilter, successBranches);
		function successBranches(data) {
			$scope.aBranches = data.data;
		}
	})();

	// try{
	// 	if($scope.$configs.master.showAccount){
	// 		// Get Account Masters
	// 		(function getAccountMasters(){
    //
	// 			var oFilter = {
	// 				all: true
	// 			}; // filter to send
	// 			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
    //
	// 			// Handle failure response
	// 			function onFailure(response) {
    //
	// 			}
    //
	// 			// Handle success response
	// 			function onSuccess(response){
	// 				response.data.data.unshift({
	// 					'name': "Add New Account",
	// 					'_id':  "addNewAccount"
	// 				});
	// 				$scope.aAccountMaster = response.data.data;
	// 			}
	// 		})();
    //
	// 		$scope.onSelectAccount = function () {
	// 			if($scope.account === "addNewAccount"){
	// 				$scope.account = null;
	// 				var modalInstance = $modal.open({
	// 					templateUrl: 'views/accounting/accountMasterUpsert.html',
	// 					controller: 'accountMasterUpsertController',
	// 					resolve: {
	// 						'selectedAccountMaster': function () {
	// 							return {
	// 								'accountType' : 'Cash in Hand',
	// 								'branch': $scope.oBranch,
	// 								'group': 'Customer',
	// 								'name': $scope.customer.name,
	// 								'isAdd': true
	// 							};
	// 						}
	// 					}
	// 				});
    //
	// 				modalInstance.result.then(function(response) {
	// 					if(response)
	// 						$scope.aAccountMaster.push(response);
	// 						$scope.account = response._id;
    //
	// 					console.log('close',response);
	// 				}, function(data) {
	// 					console.log('cancel');
	// 				});
	// 			}
    //
	// 		};
	// 	}
	// }catch(e){}
});

materialAdmin.controller("registerContractController", function($rootScope, $localStorage, $uibModal, $scope, $timeout, $interval, customer, formValidationgrowlService, DateUtils, HTTPConnection) {
    $rootScope.wantThis = false;
    $rootScope.wantThis2 = true;
    $rootScope.wantThis3 = false;
    $rootScope.config = $localStorage.ft_data.configs;
    $scope.contract = {};
    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.setMaxDate = function (e) {
    	try{
			$scope.maxDate = $rootScope.config['Customer']['Contract']['setValue']['dateRange'] ? DateUtils.addDate(e,$rootScope.config['Customer']['Contract']['setValue']['dateRange'],'days') : '';
		}catch(e) {
    		return;
		}
	};

	$scope.toggleMin = function(contract) {
		try{
			$scope.minDate = $scope.$configs.master.customer.contract.setting.setDateRangeTo ? new Date((new Date(contract.contract_start_date)).getTime() + $scope.$configs.master.customer.contract.setting.setDateRangeTo*24*60*60*1000) : contract.contract_start_date;
		}catch(e){
			$scope.minDate = contract.contract_start_date;
		}
    };

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.setEndDate = function(contract, dateRange) {
		contract.contract_end_date = new Date((new Date(contract.contract_start_date)).getTime() + dateRange*24*60*60*1000);
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    //************* New Date Picker for multiple date selection in single form ******************//
    $scope.showContract = function() {
        $scope.onShow = true;
        $scope.onEdit = false;
        $scope.onAdd = false;
    }
    $scope.showContract();

    $scope.addNewContract = function() {
        $scope.onAdd = true;
        $scope.onEdit = false;
        $scope.onShow = false;
		$scope.toggleMin($scope.contract);
    };
    $scope.editContract = function() {
        $scope.onEdit = true;
        $scope.onAdd = false;
        $scope.onShow = false;
		$scope.toggleMin($scope.contractUpdate);
        if ($scope.contractUpdate.contractId == $rootScope.customer.active_contractId) {
            $scope.defaultC = true;
        } else {
            $scope.defaultC = false;
        }
    };

    $scope.cloneContract = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/customer/cloneContract.html',
            controller: 'cloneContractCtrl',
            resolve: {
                thatData: function() {
                    return $scope.selectedContract;
                }
            }
        });
    }

    $scope.getContract = function() {
        function success(data) {
        	var count = 0,flag = true;
        	angular.forEach(data.data, function (obj) {
				if(obj.name == "One Time")
					flag = false;

				if(flag)
					count++;
			});
			data.data.splice( count, 1 );
            $rootScope.aContractS = data.data;
            if ($rootScope.aContractS.length > 0) {
                for (var p = 0; p < $rootScope.aContractS.length; p++) {
                    if ($rootScope.aContractS[p].last_modified_at) {
                        $rootScope.aContractS[p].last_modified_at = moment($rootScope.aContractS[p].last_modified_at).format('LLL');
                    }
                    if ($rootScope.aContractS[p].created_at) {
                        $rootScope.aContractS[p].created_at = moment($rootScope.aContractS[p].created_at).format('LLL');
                    }
                    if ($rootScope.aContractS[p].contractId == $rootScope.customer.active_contractId) {
                        $rootScope.contractS = $rootScope.aContractS[p];
                        $scope.selectedContract = $rootScope.aContractS[p];
						$scope.getRates();
                    }
                }
            }
            if (data.data && data.data.length > 0) {
                $scope.contractUpdate = $rootScope.contractS;
				$scope.contractUpdate.credit =  $scope.contractUpdate.credit || {};
				$scope.contractUpdate.total_credit_limit =  $scope.contractUpdate.credit.total_credit_limit;
				$scope.contractUpdate.credit_days =  $scope.contractUpdate.credit.credit_days;
				$scope.contractUpdate.monthly_credit_limit =  $scope.contractUpdate.credit.monthly_credit_limit;
				$scope.contractUpdate.daily_credit_limit =  $scope.contractUpdate.credit.daily_credit_limit;
				$scope.contractUpdate.payment_cycle_days =  $scope.contractUpdate.credit.payment_cycle_days;
				$scope.contractUpdate.usesWeight = $scope.contractUpdate.do_weight - $scope.contractUpdate.remaining_weight;
				$scope.setMaxDate($scope.contractUpdate.contract_start_date);
			} else {
                $rootScope.contractS = ' ';
            }

			 $scope.doWeightChange = function(contract){
			 	contract.remaining_weight = contract.do_weight - (contract.usesWeight || 0);
			 };
        };

        $scope.$watch(function() {
            return $rootScope.contractS;
        }, function() {
            try {
                $scope.contractS = $rootScope.contractS;
            } catch (e) {
                //console.log('catch in driverProfileController');
            }
        }, true);
        customer.getAllContracts(success);
    }
    $scope.getContract(); // get all Contract function call

	$scope.getRates = function() {
		function success(data) {
			$rootScope.aRate = data.data;
			if ($rootScope.aRate.length > 0) {
				for (var p = 0; p < $rootScope.aRate.length; p++) {
					if ($rootScope.aRate[p].last_modified_at) {
						$rootScope.aRate[p].last_modified_at = moment($rootScope.aRate[p].last_modified_at).format('LLL');
					}
					if ($rootScope.aRate[p].created_at) {
						$rootScope.aRate[p].created_at = moment($rootScope.aRate[p].created_at).format('LLL');
					}
				}
			}
			if (data.data && data.data.length > 0) {
				$rootScope.rateSingle = data.data[0];
				$scope.selectedRate = data.data[0];
				$scope.selectedRateS = data.data[0]; //auto selected in dropdown
				$scope.rateUpdate = angular.copy($rootScope.rateSingle);
				console.log($scope.rateUpdate);
			} else {
				$rootScope.rateSingle = ' ';
			}
		};

		$scope.$watch(function() {
			return $rootScope.rateSingle;
		}, function() {
			try {
				$scope.rateSingle = $rootScope.rateSingle;
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		customer.getAllRates(success);
	}
	setTimeout(function() {
		$scope.getRates(); // get all Contract function call
	}, 1000);


	// $scope.getRates = function(){
	// 	function success(data){
	// 		console.log(data);
	// 	}
	// 	function failure(data){
	// 		console.log(data);
	// 	}
	// 	HTTPConnection.get(URL.RATES + "/?all=true&contract__id=" + $scope.selectedContract._id, success,failure);
	// }

	// $scope.doWeightChange = function(contract){
	// 	contract.remaining_weight = contract.do_weight - (contract.usesWeight || 0);
	// };

    $scope.selectedItemChanged = function(dataS) {
        $rootScope.contractS = dataS;
        $scope.contractUpdate = dataS;
		$scope.contractUpdate.usesWeight = $scope.contractUpdate.do_weight - $scope.contractUpdate.remaining_weight;
		$rootScope.selContractAtRoute = dataS;
		$rootScope.selectedContractRate = dataS;
		$scope.getRates();

	}
    $scope.defaultC = true;
    $scope.saveContractDetails = function(form) {
        function successCust(response) {
            if (response && response.data && response.data.data) {
                $rootScope.customer = response.data.data;
                //$rootScope.getCustomers();
                //growlService.growl(response.data.message,"success");
                //swal(response.data.message,"","success");
            }
        }

        function success(response) {
            if (response && response.data && response.data.data) {
                $scope.contractS = response.data.data;
                //$rootScope.getCustomers();
                swal(response.data.message, "", "success");
                $scope.contract = ' ';
                if ($scope.defaultC == true) {
                    $scope.upCustomer = {};
                    $scope.upCustomer.active_contract = $scope.contractS.name;
                    $scope.upCustomer.active_contractId = $scope.contractS.contractId;
                    $scope.upCustomer.active_contract__id = $scope.contractS._id;
                    customer.updateCustomer($scope.upCustomer, successCust);
                }
                $scope.showContract();
            }
        }

        function failure(response) {
            console.error("fail: ", response);
        }

        $rootScope.defaultC = $scope.defaultC;

        $scope.contract.customer__id = $scope.customer._id;
        $scope.contract.clientId = $scope.customer.clientId;
        $scope.contract.customer_name = $scope.customer.name;
        $scope.contract.diesel_escalation_clause = {};
        $scope.contract.diesel_escalation_clause.base_price = $scope.contract.base_price;
        $scope.contract.diesel_escalation_clause.percentage_freight = $scope.contract.percentage_freight;
        $scope.contract.diesel_escalation_clause.increase_in_price = $scope.contract.increase_in_price;
        $scope.contract.diesel_escalation_clause.hike = $scope.contract.hike;
        $scope.contract.credit = {};
        $scope.contract.credit.total_credit_limit = $scope.contract.total_credit_limit;
        $scope.contract.credit.credit_days = $scope.contract.credit_days;
        $scope.contract.credit.monthly_credit_limit = $scope.contract.monthly_credit_limit;
        $scope.contract.credit.daily_credit_limit = $scope.contract.daily_credit_limit;
        $scope.contract.credit.payment_cycle_days = $scope.contract.payment_cycle_days;

        if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
            customer.addContract($scope.contract, success, failure);
        } else {
            $scope.CCmsg = '';
            $scope.upadetContactErrMsg = true;
            $scope.CCmsg = formValidationgrowlService.findError(form.$error);
            setTimeout(function() {
                if ($scope.upadetContactErrMsg) {
                    $scope.$apply(function() {
                        $scope.upadetContactErrMsg = false;
                    });
                }
            }, 7000);
        }
    }

    $scope.UpdateContractDetails = function(form) {
        function success(response) {
            if (response && response.data && response.data.data) {
                $scope.contractS = response.data.data;
                $scope.contractUpdate = response.data.data;
                //$rootScope.getCustomers();
                swal(response.data.message, "", "success");
                if ($scope.defaultC == true) {
                    $scope.upCustomer = {};
                    $scope.upCustomer.active_contract = $scope.contractS.name;
                    $scope.upCustomer.active_contractId = $scope.contractS.contractId;
                    $scope.upCustomer.active_contract__id = $scope.contractS._id;

                    customer.updateCustomer($scope.upCustomer, successUpCust);

					function successUpCust(response) {
						if (response && response.data && response.data.data) {
							$rootScope.customer = response.data.data;
							//$rootScope.getCustomers();
							//growlService.growl(response.data.message,"success");
							// swal(response.data.message,"","success");
						}
					}
                }
                $scope.contractUpdate = ' ';
                $scope.showContract();
            }
        }

        function failure(response) {
            console.error("fail: ", response);
        }

        $scope.contractUpdate.customer__id = $scope.customer._id;
        $scope.contractUpdate.diesel_escalation_clause = {};
        $scope.contractUpdate.diesel_escalation_clause.base_price = $scope.contractUpdate.base_price;
        $scope.contractUpdate.diesel_escalation_clause.percentage_freight = $scope.contractUpdate.percentage_freight;
        $scope.contractUpdate.diesel_escalation_clause.increase_in_price = $scope.contractUpdate.increase_in_price;
        $scope.contractUpdate.diesel_escalation_clause.hike = $scope.contractUpdate.hike;
        $scope.contractUpdate.credit = {};
        $scope.contractUpdate.credit.total_credit_limit = $scope.contractUpdate.total_credit_limit;
        $scope.contractUpdate.credit.credit_days = $scope.contractUpdate.credit_days;
        $scope.contractUpdate.credit.monthly_credit_limit = $scope.contractUpdate.monthly_credit_limit;
        $scope.contractUpdate.credit.daily_credit_limit = $scope.contractUpdate.daily_credit_limit;
        $scope.contractUpdate.credit.payment_cycle_days = $scope.contractUpdate.payment_cycle_days;

        if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
            customer.updateContract($scope.contractUpdate, success, failure);
            console.log('Update Vehicle');
        }
    }

});

materialAdmin.controller("cloneContractCtrl", function($rootScope, $scope, $uibModalInstance, thatData, customer) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.contractData = angular.copy(thatData);
    $scope.contractData.old_contract_name = $scope.contractData.name;
    $scope.contractData.name = $scope.contractData.name + ' 2';

    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
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

    $scope.cloneClick = function() {
        function succCon(response) {
            if (response && response.data) {
                var msgg = response.data.message;
                $scope.closeModal();
                $rootScope.aContractS.push(response.data.data);
                swal("Clone Done", msgg, "success");
            }
        }

        function failCon(res) {
            swal("Some error with Clone Contract.", "", "error");
        }

        var conData = {};
        conData.customer_name = $scope.contractData.customer_name;
        conData.customer__id = $scope.contractData.customer__id;
        //conData.customerId = $scope.contractData.customerId;
        conData.old_contract_name = $scope.contractData.old_contract_name;
        conData.new_contract_name = $scope.contractData.name;
        conData.old_contract__id = $scope.contractData._id;
        conData.contract_start_date = $scope.contractData.start_date;
        conData.contract_end_date = $scope.contractData.end_date;
        conData.contract_status = $scope.contractData.contract_status;
        //if(){};
        conData.set_default = $scope.contractData.default || false;
        customer.cloneContractService(conData, succCon, failCon);
    }

});

materialAdmin.controller("addRatesController", function($rootScope, $localStorage, $scope, $timeout, $interval, constants, customer, Routes, Vehicle, formValidationgrowlService, materialService) {
    $rootScope.wantThis = false;
    $rootScope.wantThis2 = true;
    $rootScope.wantThis3 = false;
    //$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Domestic – Containerized","Import - Cargo","Export – Cargo","Domestic – Cargo","Empty - Containerized","Empty - Vehicle","Transporter Booking"];

    $scope.vehicleTypes = [];
	$scope.appendObj = {};
    $scope.aSelectionType = ['Material', 'Vehicle'];
    $scope.aSelectionType = ['Material', 'Vehicle'];
    $scope.geolocate = function(sUId) {
        googlePlaceAPI.geolocate(sUId);
    };
    var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope, ['city', 'city2']);

    $scope.searchRegisterCity1 = function() {
        setTimeout(function() {
            if ($scope.city && $scope.city.d) {
                $scope.$apply(function() {
                    $scope.district1 = '';
                    $scope.district1 = $scope.city.d;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.st) {
                $scope.$apply(function() {
                    $scope.state1 = '';
                    $scope.state1 = $scope.city.st;
                });
                //console.log($scope.city.s);
            }
            if ($scope.city && $scope.city.p) {
                $scope.$apply(function() {
                    $scope.pincode1 = '';
                    $scope.pincode1 = $scope.city.p;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.city && $scope.city.cnt) {
                $scope.$apply(function() {
                    $scope.country1 = '';
                    $scope.country1 = $scope.city.cnt;
                });
                //console.log($scope.city.cnt);
            }
        }, 500);
    };

    $scope.calculatePricePerMT = function(rate){
    	if(!rate.price_per_trip || !rate.min_payable_mt)
    		return;

    	rate.price_per_mt = rate.price_per_trip / rate.min_payable_mt;
	};

    $scope.searchRegisterCity2 = function() {
        setTimeout(function() {
            if ($scope.city2 && $scope.city2.d) {
                $scope.$apply(function() {
                    $scope.district2 = '';
                    $scope.district2 = $scope.city2.d;
                });
                //console.log($scope.city2.cnt);
            }
            if ($scope.city2 && $scope.city2.st) {
                $scope.$apply(function() {
                    $scope.state2 = '';
                    $scope.state2 = $scope.city2.st;
                });
                //console.log($scope.city2.s);
            }
            if ($scope.city2 && $scope.city2.p) {
                $scope.$apply(function() {
                    $scope.pincode2 = '';
                    $scope.pincode2 = $scope.city2.p;
                });
                //console.log($scope.city2.cnt);
            }
            if ($scope.city2 && $scope.city2.cnt) {
                $scope.$apply(function() {
                    $scope.country2 = '';
                    $scope.country2 = $scope.city2.cnt;
                });
                //console.log($scope.city2.cnt);
            }
        }, 500);
    };
    var gAPIx = new googlePlaceAPI($interval);
    gAPIx.fight($scope, ['cityx']);
    $scope.searchRegisterCityX = function() {
        setTimeout(function() {
            if ($scope.cityx && $scope.cityx.d) {
                $scope.$apply(function() {
                    $scope.rateUpdate.loading_address.district = '';
                    $scope.rateUpdate.loading_address.district = $scope.cityx.d;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.cityx && $scope.cityx.st) {
                $scope.$apply(function() {
                    $scope.rateUpdate.loading_address.state = '';
                    $scope.rateUpdate.loading_address.state = $scope.cityx.st;
                });
                //console.log($scope.city.s);
            }
            if ($scope.cityx && $scope.cityx.p) {
                $scope.$apply(function() {
                    $scope.rateUpdate.loading_address.pincode = '';
                    $scope.rateUpdate.loading_address.pincode = $scope.cityx.p;
                });
                //console.log($scope.city.cnt);
            }
            if ($scope.cityx && $scope.cityx.cnt) {
                $scope.$apply(function() {
                    $scope.rateUpdate.loading_address.country = '';
                    $scope.rateUpdate.loading_address.country = $scope.cityx.cnt;
                });
                //console.log($scope.city.cnt);
            }
        }, 500);
    };
    var gAPIxx = new googlePlaceAPI($interval);
    gAPIxx.fight($scope, ['cityxx']);
    $scope.searchRegisterCityXX = function() {
        setTimeout(function() {
            if ($scope.cityxx && $scope.cityxx.d) {
                $scope.$apply(function() {
                    $scope.rateUpdate.unloading_address.district = '';
                    $scope.rateUpdate.unloading_address.district = $scope.cityxx.d;
                });
            }
            if ($scope.cityxx && $scope.cityxx.st) {
                $scope.$apply(function() {
                    $scope.rateUpdate.unloading_address.state = '';
                    $scope.rateUpdate.unloading_address.state = $scope.cityxx.st;
                });
            }
            if ($scope.cityxx && $scope.cityxx.p) {
                $scope.$apply(function() {
                    $scope.rateUpdate.unloading_address.pincode = '';
                    $scope.rateUpdate.unloading_address.pincode = $scope.cityxx.p;
                });
            }
            if ($scope.cityxx && $scope.cityxx.cnt) {
                $scope.$apply(function() {
                    $scope.rateUpdate.unloading_address.country = '';
                    $scope.rateUpdate.unloading_address.country = $scope.cityxx.cnt;
                });
            }
        }, 500);
    };

    //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();


    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event, opened) {
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

    //************* New Date Picker for multiple date selection in single form ******************//

    $scope.showRates = function() {
        $scope.onShow = true;
        $scope.onEdit = false;
        $scope.onAdd = false;
    }
    $scope.showRates();

    $scope.addNewRates = function() {
        $scope.onAdd = true;
        $scope.onEdit = false;
        $scope.onShow = false;
        $scope.newVehicleTypes = [];
    }
    $scope.editRates = function() {
        $scope.onEdit = true;
        $scope.onAdd = false;
        $scope.onShow = false;
        if ($scope.rateUpdate && $scope.rateUpdate.data.length > 0) {
            $scope.newVehicleTypes = $scope.rateUpdate.data;
        } else {
            $scope.newVehicleTypes = [];
        }
        if ($scope.aRoutes && $scope.aRoutes.length > 0) {
            for (var b = 0; b < $scope.aRoutes.length; b++) {
                if ($scope.rateUpdate.route_name == $scope.aRoutes[b].name) {
                    $scope.rateUpdate.route_name = $scope.aRoutes[b];
                    //$scope.vehicleTypes = $scope.aRoutes[b].route_time;
                    $scope.routeSingle = $scope.aRoutes[b];
                }
            }
        }
        if ($scope.rateUpdate && $scope.rateUpdate.timings && $scope.rateUpdate.timings.loading.holidays.length > 0) {
            $scope.selHolidays = $scope.rateUpdate.timings.loading.holidays;
        }
        if ($scope.rateUpdate && $scope.rateUpdate.timings && $scope.rateUpdate.timings.unloading.holidays.length > 0) {
            $scope.selHolidays2 = $scope.rateUpdate.timings.unloading.holidays;
        }

    }
    $scope.aCargoType = ["Container Import", "Container Export", "Container FS", "Container FDS", "Loose Cargo Import", "Loose Cargo Export", "Loose Cargo Domestic"];
    $scope.selHolidays = [];
    $scope.selHolidays2 = [];
    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(holi) {
        var idx = $scope.selHolidays.indexOf(holi);

        // is currently selected
        if (idx > -1) {
            $scope.selHolidays.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selHolidays.push(holi);
        }
    };
    // toggle selection for a given fruit by name
    $scope.toggleSelection2 = function toggleSelection(holi) {
        var idx = $scope.selHolidays2.indexOf(holi);

        // is currently selected
        if (idx > -1) {
            $scope.selHolidays2.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selHolidays2.push(holi);
        }
    };
    $scope.aHolidays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    $scope.aHours = [];
    $scope.aMinutes = [];
    //Self Invoking Function
    (function() {
        for (i = 0; i < 60; i++) {
            $scope.aMinutes.push(i);
            if (i < 24) {
                $scope.aHours.push(i);
            }
        }
    })();

    $scope.getRates = function() {
        function success(data) {
            $rootScope.aRate = data.data;
            if ($rootScope.aRate.length > 0) {
                for (var p = 0; p < $rootScope.aRate.length; p++) {
                    if ($rootScope.aRate[p].last_modified_at) {
                        $rootScope.aRate[p].last_modified_at = moment($rootScope.aRate[p].last_modified_at).format('LLL');
                    }
                    if ($rootScope.aRate[p].created_at) {
                        $rootScope.aRate[p].created_at = moment($rootScope.aRate[p].created_at).format('LLL');
                    }
                }
            }
            if (data.data && data.data.length > 0) {
                $rootScope.rateSingle = data.data[0];
                $scope.selectedRate = data.data[0];
                $scope.selectedRateS = data.data[0]; //auto selected in dropdown
                $scope.rateUpdate = angular.copy($rootScope.rateSingle);
                console.log($scope.rateUpdate);
            } else {
                $rootScope.rateSingle = ' ';
            }
        };

        $scope.$watch(function() {
            return $rootScope.rateSingle;
        }, function() {
            try {
                $scope.rateSingle = $rootScope.rateSingle;
            } catch (e) {
                //console.log('catch in driverProfileController');
            }
        }, true);
        customer.getAllRates(success);
    }
    setTimeout(function() {
        $scope.getRates(); // get all Contract function call
    }, 1000);

    $scope.getRoutes = function() {
        function success(data) {
            $rootScope.aRoutes = data.data.data;
            if ($rootScope.aRoutes && $rootScope.aRoutes.length > 0) {
                for (var x = 0; x < $rootScope.aRoutes.length; x++) {
                    for (var y = 0; y < $rootScope.aRoutes[x].route_time.length; y++) {
                        if (!$rootScope.aRoutes[x].route_time[y].rate) {
                            $rootScope.aRoutes[x].route_time[y].rate = {};
                            $rootScope.aRoutes[x].route_time[y].rate.vehicle_rate = 0;
                            $rootScope.aRoutes[x].route_time[y].rate.price_per_unit = 0;
                            $rootScope.aRoutes[x].route_time[y].rate.price_per_mt = 0;
                            $rootScope.aRoutes[x].route_time[y].rate.price_per_trip = 0;
                            $rootScope.aRoutes[x].route_time[y].rate.min_payable_mt = 0;
                            /*$rootScope.aRoutes[x].route_time.rate.detention_rate_1-48 = 0;
                            $rootScope.aRoutes[x].route_time.rate.detention_rate_48-96 = 0;
                            $rootScope.aRoutes[x].route_time.rate.detention_rate_above_96 = 0; */
                        }
                        if (!$rootScope.aRoutes[x].route_time[y].allot) {
                            $rootScope.aRoutes[x].route_time[y].allot = {};
                            $rootScope.aRoutes[x].route_time[y].allot.diesel = 0;
                            $rootScope.aRoutes[x].route_time[y].allot.cash = 0;
                        }
                        if (!$rootScope.aRoutes[x].route_time[y].from_date) {
                            $rootScope.aRoutes[x].route_time[y].from_date = '';
                        }
                        if (!$rootScope.aRoutes[x].route_time[y].to_date) {
                            $rootScope.aRoutes[x].route_time[y].to_date = '';
                        }
                    }
                }
            }
        };

        Routes.getAllTrueRoutes({}, success);
    }
    $scope.getRoutes(); // get all Route function call

    $scope.getContractForRate = function() {
        function success(data) {
			var count = 0,flag = true;
			angular.forEach(data.data, function (obj) {
				if(obj.name == "One Time")
					flag = false;

				if(flag)
					count++;
			});
			data.data.splice( count, 1 );
            $rootScope.aContractRate = data.data;
            if ($rootScope.aContractRate.length > 0) {
                for (var p = 0; p < $rootScope.aContractRate.length; p++) {
                    if ($rootScope.aContractRate[p].contractId == $rootScope.customer.active_contractId) {
                        $rootScope.selectedContractRate = $rootScope.aContractRate[p];
                    }
                }
            } else {
                $rootScope.selectedContractRate = ' ';
            }
        };

        $scope.$watch(function() {
            return $rootScope.selectedContractRate;
        }, function() {
            try {
                $rootScope.selectedContractRate = $rootScope.selectedContractRate;
            } catch (e) {
                //console.log('catch in driverProfileController');
            }
        }, true);
        customer.getAllContracts(success);
    }
    $scope.getContractForRate(); // get all Contract function call

    $scope.selectedItemChanged = function(dataS) {
        $rootScope.selContractAtRoute = dataS;
        $rootScope.selectedContractRate = dataS;
        $scope.getRates();
    }
    $scope.selectedRouteChanged = function(dataR) {
        //$scope.vehicleTypes = dataR.route_time;
        $scope.routeSingle = dataR;
        $scope.route_distance = dataR.route_distance;
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

	function getAllMaterialTypes(){
		function succGetMaterials(response){
			if(response.data && response.data.length>0){
				$scope.materialTypes = response.data;
			}
		}
		function failGetMaterials(response){
			console.log(response);
		}
		//var clientId = $localStorage.ft_data.userLoggedIn.clientId;
		materialService.getMaterialTypes({all: true},succGetMaterials,failGetMaterials);
	}

    $scope.selectedRateItemChanged = function(dataP) {
        $scope.rateSingle = dataP;
        //$scope.routeSingle = dataP;
        $scope.rateUpdate = angular.copy(dataP);
    };

    $scope.changeSelectionType = function(oSelectionType) {
    	if($scope.appendObj.oSelectionType === 'Material')
			!$scope.materialTypes && getAllMaterialTypes();
    	else if($scope.appendObj.oSelectionType === 'Vehicle')
			$scope.vehicleTypes.length===0 && getAllVehicleType();
    };

    $scope.newVehicleTypes = [];

    $scope.addVehicleInList = function() {
    	let newObject = {};
		newObject.vehicle_id = $scope.appendObj.oVehicleType;
		newObject.materialType = $scope.appendObj.oMaterialType;
		newObject.rate = {
			price_per_unit : 0,
			price_per_mt : 0,
			price_per_trip : 0,
			min_payable_mt : 0
		};
		newObject.allot = {
			diesel: 0,
			cash: 0,
			toll: 0
		};
		$scope.newVehicleTypes.push(newObject);

		$scope.appendObj = {};
    };

    $scope.mode = 'unit';

    function checkBooking(booking) {
        var count = 0;
        for (var i = 0, len = $scope.newVehicleTypes.length; i < len; i++) {
            if ($scope.newVehicleTypes[i].booking_type == booking) {
                count = count + 1;
            }
        }
        return count;
    }

    function checkVehicle(b, c) {
        for (var i = 0, len = $scope.newVehicleTypes.length; i < len; i++) {
            if (($scope.newVehicleTypes[i].vehicle_type === b) && ($scope.newVehicleTypes[i].booking_type === c)) {
                return true;
            }
        }
        return false;
    }

    $scope.applyOnAll = function(vehicle) {
        var vehicleType = $scope.vehicleTypes || [];
        var countBooking = checkBooking(vehicle.booking_type);
        if ((countBooking < vehicleType.length) && (vehicleType.length > 0)) {
            for (var i = 0; i < vehicleType.length; i++) {
                var check = checkVehicle(vehicleType[i].vehicle_type_name, vehicle.booking_type);
                if (!check) {
                    var oData = {
                        booking_type: vehicle.booking_type,
                        vehicle_id: vehicleType[i].vehicle_type_id,
                        vehicle_type: vehicleType[i].vehicle_type_name,
                        "vehicle_type_id": vehicleType[i].vehicle_type_id,
                        "vehicle_group_name": vehicleType[i].vehicle_group_name,
                        "from_date": vehicle.from_date,
                        "to_date": vehicle.to_date,
                        "allot": vehicle.allot,
                        "rate": vehicle.rate,
                        "loading": vehicle.loading,
                        "unloading": vehicle.unloading,
                        "down_time": vehicle.down_time,
                        "up_time": vehicle.up_time
                    }
                    $scope.newVehicleTypes.push(angular.copy(oData));
                }
            }
        } else {
            for (var j = 0, len = $scope.newVehicleTypes.length; j < len; j++) {
                if ($scope.newVehicleTypes[j].booking_type == vehicle.booking_type) {
                    $scope.newVehicleTypes[j].from_date = angular.copy(vehicle.from_date);
                    $scope.newVehicleTypes[j].to_date = angular.copy(vehicle.to_date);
                    $scope.newVehicleTypes[j].allot = angular.copy(vehicle.allot);
                    $scope.newVehicleTypes[j].rate = angular.copy(vehicle.rate);
                    $scope.newVehicleTypes[j].loading = angular.copy(vehicle.loading);
                    $scope.newVehicleTypes[j].unloading = angular.copy(vehicle.unloading);
                    $scope.newVehicleTypes[j].down_time = angular.copy(vehicle.down_time);
                    $scope.newVehicleTypes[j].up_time = angular.copy(vehicle.up_time);
                }
            }
        }
    }



    $scope.saveRateDetails = function(form) {
        function success(response) {
            if (response && response.data && response.data.data) {
                $scope.rateSingle = response.data.data;
                swal(response.data.message, "", "success");
                rateData = ' ';
                $scope.getRates();
                //$scope.showRates();
            }
        }

        function failure(response) {
            //console.error("fail: ",response);
            var err_msg = response.data.error_message;
            swal(err_msg, "", "warning");
        }
        var rateFullData = {};
        if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
            if ($scope.selectedContractRate && $scope.selectedContractRate.contractId) {
                rateFullData.contract_name = $scope.selectedContractRate.name;
                rateFullData.contractId = $scope.selectedContractRate.contractId;
                rateFullData.contract__id = $scope.selectedContractRate._id;
            }
            rateFullData.customer_name = $scope.customer.name;
            rateFullData.customerId = $scope.customer.customerId;
            rateFullData.customer__id = $scope.customer._id;
            rateFullData.route__id = $scope.routeSingle._id;
            rateFullData.route_name = $scope.routeSingle.name;
            rateFullData.route_distance = $scope.route_distance;
            rateFullData.route_type = $scope.routeSingle.route_type;

            rateFullData.cargo_type = $scope.cargo_type;


            for (var i = 0; i < $scope.newVehicleTypes.length; i++) {
                if ($scope.newVehicleTypes[i].vehicle_type_name) {
                    $scope.newVehicleTypes[i].vehicle_type = $scope.newVehicleTypes[i].vehicle_type_name;
                }
                /*$scope.newVehicleTypes[i].loading = {};
                if($scope.newVehicleTypes[i].up_time && $scope.newVehicleTypes[i].up_time.days){
                  $scope.newVehicleTypes[i].loading.days = $scope.newVehicleTypes[i].up_time.days;
                }
                if($scope.newVehicleTypes[i].up_time && $scope.newVehicleTypes[i].up_time.hours){
                  $scope.newVehicleTypes[i].loading.hours = $scope.newVehicleTypes[i].up_time.hours;
                }
                $scope.newVehicleTypes[i].unloading = {};
                if($scope.newVehicleTypes[i].down_time && $scope.newVehicleTypes[i].down_time.days){
                  $scope.newVehicleTypes[i].unloading.days = $scope.newVehicleTypes[i].down_time.days;
                }
                if($scope.newVehicleTypes[i].down_time && $scope.newVehicleTypes[i].down_time.hours){
                  $scope.newVehicleTypes[i].unloading.hours = $scope.newVehicleTypes[i].down_time.hours;
                }*/

            }

            rateFullData.data = $scope.newVehicleTypes;
            rateFullData.category = 'Rate';


            customer.addRates(rateFullData, success, failure);
        } else {
            $scope.ARmsg = '';
            $scope.addRatesErrMsg = true;
            $scope.ARmsg = formValidationgrowlService.findError(form.$error);
            setTimeout(function() {
                if ($scope.addRatesErrMsg) {
                    $scope.$apply(function() {
                        $scope.addRatesErrMsg = false;
                    });
                }
            }, 7000);
        }

    }

    $scope.UpdateRateDetails = function(form) {
        function success(response) {
            if (response && response.data && response.data.data) {
                $scope.rateSingle = response.data.data;
                $scope.rateUpdate._id = $scope.rateSingle._id;
                $scope.rateUpdate.route_name = {};
                $scope.rateUpdate.route_name.name = $scope.rateSingle.route_name;
                swal(response.data.message, "", "success");
                rateData = ' ';
                //$scope.getRates();
                //$scope.showRates();
            }
        }

        function failure(response) {
            console.error("fail: ", response);
        }

        var rateupdateData = {};
        if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
            $scope.rateUpdate.route_name = $scope.rateUpdate.route_name.name;
            rateupdateData = $scope.rateUpdate;

            customer.updateRates(rateupdateData, success, failure);
        } else {
            $scope.CCmsg = '';
            $scope.upadetRateErrMsg = true;
            $scope.CCmsg = formValidationgrowlService.findError(form.$error);
            setTimeout(function() {
                if ($scope.upadetRateErrMsg) {
                    $scope.$apply(function() {
                        $scope.upadetRateErrMsg = false;
                    });
                }
            }, 7000);
        }
    }

});

materialAdmin.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

materialAdmin.controller("uploadContractController", function($rootScope, $localStorage, $uibModal, $scope, $timeout, $interval, customer, formValidationgrowlService) {

	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	// $scope.contract = {};

	$scope.getContract = function() {
		function success(data) {
			var count = 0,flag = true;
			angular.forEach(data.data, function (obj) {
				if(obj.name == "One Time")
					flag = false;

				if(flag)
					count++;
			});
			data.data.splice( count, 1 );
			$rootScope.aContractS = data.data;
			if ($rootScope.aContractS.length > 0) {
				for (var p = 0; p < $rootScope.aContractS.length; p++) {
					if ($rootScope.aContractS[p].last_modified_at) {
						$rootScope.aContractS[p].last_modified_at = moment($rootScope.aContractS[p].last_modified_at).format('LLL');
					}
					if ($rootScope.aContractS[p].created_at) {
						$rootScope.aContractS[p].created_at = moment($rootScope.aContractS[p].created_at).format('LLL');
					}
					if ($rootScope.aContractS[p].contractId == $rootScope.customer.active_contractId) {
						$rootScope.contractS = $rootScope.aContractS[p];
						$scope.selectedContract = $rootScope.aContractS[p];
					}
				}
			}
			if (data.data && data.data.length > 0) {
				$scope.contractUpdate = $rootScope.contractS;
				$scope.contractUpdate.usesWeight = $scope.contractUpdate.do_weight - $scope.contractUpdate.remaining_weight;
			} else {
				$rootScope.contractS = ' ';
			}
		};

		$scope.$watch(function() {
			return $rootScope.contractS;
		}, function() {
			try {
				$scope.contractS = $rootScope.contractS;
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		customer.getAllContracts(success);
	};

	$scope.getContract();

	$scope.selectedItemChanged = function(dataS) {
		$rootScope.contractS = dataS;
		$scope.contractUpdate = dataS;
	}

	$scope.docPreview = function(doc) {
		$scope.preview(doc);
	}

	function success(response) {
		if(response && response.data){
			$scope.selectedContract.upload_document = response.data.data.upload_document;
			$scope.contractCopy = undefined;
			var msg = response.message;
            // console.log("Updated Driver "+ JSON.stringify($scope.driver));
			swal("Updated",msg,"success");
		}
	}

	function fail(response){
		if (response.message){
			growlService.growl(response.message, "danger",2);
		}
	}

	$scope.uploadContractDoc = function(form) {
		if(form.$valid) {
			var fd = new FormData();
			if($scope.contractCopy){
				fd.append('upload_document', $scope.contractCopy);
			}
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = $scope.contractS._id;
			customer.updateDoc(data, success,fail);
		}
	}
});

materialAdmin.controller("detentionContractController", function(
	$rootScope,
	$localStorage,
	$uibModal,
	$scope,
	$timeout,
	$interval,
	customer,
	formValidationgrowlService,
	$uibModal,
	Vehicle)
{
	$rootScope.wantThis = false;
	$rootScope.wantThis2 = true;
	$rootScope.wantThis3 = false;
	$rootScope.contractS = {};

	$scope.getContract = function() {
		function success(data) {
			var count = 0,flag = true;
			angular.forEach(data.data, function (obj) {
				if(obj.name == "One Time")
					flag = false;

				if(flag)
					count++;
			});
			data.data.splice( count, 1 );
			$rootScope.aContractS = data.data;
			/*
			* It add a 'default' contract option for detention only.
			* Start
			* */
			$rootScope.aContractS.unshift({name: 'default',_id: 'default'});
			/*
			* End
			* */

			if ($rootScope.aContractS.length > 0) {
				for (var p = 0; p < $rootScope.aContractS.length; p++) {
					if ($rootScope.aContractS[p].last_modified_at) {
						$rootScope.aContractS[p].last_modifiedt_at = moment($rootScope.aContractS[p].last_modified_at).format('LLL');
					}
					if ($rootScope.aContractS[p].created_at) {
						$rootScope.aContractS[p].created_at = moment($rootScope.aContractS[p].created_at).format('LLL');
					}
					if ($rootScope.aContractS[p].contractId == $rootScope.customer.active_contractId) {
						$rootScope.contractS = $rootScope.aContractS[p];
						$scope.selectedContract = $rootScope.aContractS[p];
					}
				}
			}
			if (data.data && data.data.length > 0) {
				$scope.contractUpdate = $rootScope.contractS;
				$scope.contractUpdate.usesWeight = $scope.contractUpdate.do_weight - $scope.contractUpdate.remaining_weight;
			} else {
				$rootScope.contractS = ' ';
			}
		};

		$scope.$watch(function() {
			return $rootScope.contractS;
		}, function() {
			try {
				$scope.contractS = $rootScope.contractS;
				$scope.getRemainingVehicle();
			} catch (e) {
				//console.log('catch in driverProfileController');
			}
		}, true);
		customer.getAllContracts(success);
	};
	$scope.getContract(); // get all Contract function call

	$scope.selectedItemChanged = function(dataS) {
		$rootScope.contractS = dataS;
		$scope.contractUpdate = dataS;
	};

	(function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				$scope.vehicleTypes = res.data.data;
				$scope.getRemainingVehicle();
			}
		}

		function failType(res) {
			$scope.vehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	})();

	/*
	* it push vehicleType object to vendor.routes.vehicleTypes array of objects
	* it open model to get vehicleType and Rate to vehicleType object
	* */
	$scope.addDateRangeInDetention = function (detention, dateRangeObj) {
		if(!detention.dateRange)
			detention.dateRange = [];
		detention.dateRange.push(angular.copy(dateRangeObj));
	};

	/*
	* it remove all the vehicle which have already set detention charges
	* */
	$scope.getRemainingVehicle = function() {
		try{
			$scope.remainVehicleObj = [];
			angular.forEach($scope.vehicleTypes,function (vObj) {
				var flag = false;
				angular.forEach(($scope.contractS._id==='default' ? ($scope.customer.detentionCharges || []) : $scope.contractS.detentionCharges), function (dObj) {
					if(vObj.name == dObj.vehicleTypeName)
						flag = true;
				});

				if(!flag)
					$scope.remainVehicleObj.push(vObj);
			});
			// $scope.remainVehicleObj = $scope.vehicleTypes;
		}catch (e){
			console.log(e);
		}
	};

	/*
	* it Remove & Add Date Rages for contract and customer
	* */
	$scope.setDateRange = function() {
		var modalInstance = $uibModal.open({
			backdrop  : 'static',
			templateUrl: 'views/customer/setDetentionCharges.html',
			controller: 'setDetentionChargesCtrl',
			resolve: {
				detentionData: function() {
					var obj = {
						detentionDateRange: ($scope.contractS._id==='default' ? ($scope.customer.detentionDateRange || []) : ($scope.contractS.detentionDateRange || [])),
						isDefault: ($scope.contractS._id==='default' ? true : false),
						_id:  $scope.contractS._id!=="default" ? $scope.contractS._id : $rootScope.customer._id
					};
					return obj;
				}
			}
		});

		modalInstance.result.then(function(response) {
			$scope.selectedContract.detentionDateRange = response;
			$.growl({message: response.data.message}, {type: 'success'});
		}, function(data) {
			swal("Oops!", data.data.message, "error");
		});

	};

	$scope.addDetentionCharges = function() {

		$scope.customer.detentionCharges = $scope.customer.detentionCharges || [];
		$scope.contractS.detentionCharges = $scope.contractS.detentionCharges || [];
		($scope.contractS._id === 'default' ? $scope.customer.detentionCharges : $scope.contractS.detentionCharges).push({
			vehicleTypeName: $scope.detentionData.vehicleType.name,
			vehicleTypeId: $scope.detentionData.vehicleType._id
		});
		$scope.getRemainingVehicle();
	};

	$scope.updateDetentionCharges = function() {

		var oData = {detentionCharges: ($scope.contractS._id!=="default" ? $scope.contractS.detentionCharges : ($rootScope.customer.detentionCharges || []))};
		oData._id = $scope.contractS._id!=="default" ? $scope.contractS._id : $rootScope.customer._id;

		if($scope.contractS._id==="default")
			customer.updateCustomer(oData, success, failure);
		else
			customer.updateContract(oData, success, failure);

		function success(response) {
			if($scope.contractS._id==="default")
				$rootScope.customer = response.data.data;
			else
				$scope.selectedContract.detentionCharges = response.data.data.detentionCharges;
			$.growl({message: response.data.message}, {type: 'success'})
			$scope.getRemainingVehicle();
		}

		function failure(response) {
			console.error("fail: ", response);
		}
	};

});

materialAdmin.controller('setDetentionChargesCtrl', function (
	$rootScope,
	$scope,
	$uibModalInstance,
	customer,
	detentionData
) {

	$scope.response = $scope.detentionDateRange = angular.copy(detentionData.detentionDateRange);

	$scope.setDetentionRange = function () {

		if(checkIfNewDateIsValidForAddition($scope.detentionDateRange, $scope.detentionData)){
			swal("Invalid Date Range",'','error');
			return;
		}

		var oData = {detentionDateRange: ($scope.detentionDateRange || [])};
		oData._id = angular.copy(detentionData._id);

		var dRange = {};
		dRange.start_day = $scope.detentionData.from;
		dRange.end_day = $scope.detentionData.to;
		dRange.label = $scope.detentionData.label;

		oData.detentionDateRange.push(dRange);

		if(angular.copy(detentionData.isDefault))
			customer.updateCustomer(oData, success, failure);
		else
			customer.updateContract(oData, success, failure);

		function success(response) {
			if(angular.copy(detentionData.isDefault))
				$rootScope.customer = response.data.data;
			else
				$scope.response = response.data.data.detentionDateRange;
				$scope.detentionData = {};
				// $uibModalInstance.close(response.data.data.detentionCharges);
				// $scope.selectedContract.detentionCharges = response.data.data.detentionCharges;
			$.growl({message: response.data.message}, {type: 'success'});
		}

		function failure(response) {
			console.error("fail: ", response);
		}

		function checkIfNewDateIsValidForAddition(currentData, newData) {
			var boolArr = currentData.map(function (obj) {
				if((newData.from <= obj.start_day && newData.to <= obj.start_day) || (newData.from >= obj.end_day && newData.to >= obj.end_day))
					return true;
				else
					return false;
			});

			if(boolArr.findIndex(obj => obj===false) === -1)
				return false;
			else
				return true;


			return true;
		}
	};

	$scope.setLabel = function (from,to){
		$scope.detentionData.label = from + ' - ' + to;
	};

	$scope.updateDetentionDateRange = function($index) {

		$scope.detentionDateRange.splice($index, 1);

		var oData = {detentionDateRange: $scope.detentionDateRange};
		oData._id = angular.copy(detentionData._id);

		if(angular.copy(detentionData.isDefault))
			customer.updateCustomer(oData, success, failure);
		else
			customer.updateContract(oData, success, failure);

		function success(response) {
			if(angular.copy(detentionData.isDefault))
				$rootScope.customer = response.data.data;
			else
				$scope.response = response.data.data.detentionDateRange;
				// $uibModalInstance.close(response.data.data.detentionCharges);
			$.growl({message: response.data.message}, {type: 'success'})
		}

		function failure(response) {
			console.error("fail: ", response);
		}
	};

	$scope.closeModal = function(){
		$uibModalInstance.close($scope.response);
	};
});


/*
* return sum of element in an array
* */
materialAdmin.filter('removeSelectedObj',function () {
	return function (input, aObjectToRemove) {
		if(!input || typeof input !== 'object')
			return [];

		aObjectToRemove = aObjectToRemove || [];

		var arr = [];

		input.map(obj => {
			if(aObjectToRemove.findIndex(subObj => subObj.label === obj.label) === -1)
				arr.push(obj);
		});

		return arr;
	}
});
