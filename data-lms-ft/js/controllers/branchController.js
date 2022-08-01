/**
 * Created by JA on 8/8/16.
 */

materialAdmin.controller("branchController",
    function($rootScope, $state, $scope, $timeout, branchService, billBookService, $localStorage, $uibModal,
             growlService, partCategoryService, departmentService, departmentBranchService, userService) {

		let vm = this;

		vm.callThisFunction = function (){
			console.log(vm.orderBy);
		};

		vm.rowColor = [
			{
				key: 'name',
				value: 'GandhiNagar',
				bgColor: 'yellow',
			},
			{
				key: 'category',
				value: 'Regional Head Office',
				bgColor: '#948985',
				color: 'white'
			},
		];

		vm.tableHead = [
			{
				'header' :'Name',
				'bindingKeys': 'name',
				'sortable': 'active'
			},
			{
				'header' :'Category',
				'bindingKeys': 'category',
				'sortable': true
			},
			{
				'header' :'Type',
				'bindingKeys': 'type',
				'sortable': true
			},
			{
				'header' :'Email',
				'bindingKeys': 'prim_email'
			},
			{
				'header' :'Contact',
				'bindingKeys': 'prim_contact_no'
			},
			{
				'header' :'just a num',
				'bindingKeys': 'num'
			},
			{
				'header' :'test1',
				'bindingKeys': 'aTest[0].keyArr'
			},
			{
				'header' :'test2',
				'bindingKeys': 'oTest.keyObj'
			},
			{
				'header' :'sum',
				'filter': {
					'name': 'sumOfNumber',
					'aParam': [
						'aTest[0].keyArr',
						'oTest.keyObj'
					]
				}
			},
			{
				'header' :'Created at',
				'bindingKeys': 'created_at',
				'sortable': true,
				// 'filter': {
				// 	'name': 'date',
				// 	'aParam': [
				// 		'created_at',
				// 		"dd-MMM-yyyy 'at' h:mm a"
				// 	]
				// }
			}
		];

		vm.orderBy = vm.tableHead.find( obj => obj.sortable === true).bindingKeys;

		$scope.branchStatus = branchStatus;
        $scope.branches=[];
        $scope.removeBooks=[];
        $scope.selectedBranch={};
        $scope.filterObj={};
        $scope.indexSelectedFromList=0;
        $scope.tab_active_branch =1;
        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.searchCodeValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        $scope.users = [];
		$scope.status = ['Enable', 'Disable'];

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

            $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        //************* New Date Picker for multiple date selection in single form ******************//


        /**watches change in selectedBranch and resets
         * and sets speciality parts for corresponding branch **/
        $scope.$watch(function(){
            return $scope.selectedBranch;
        },function(){
            //console.log("changed branch");
        });

		$scope.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			singleSelection:true,
			// selectionLimit: 1,
			smartButtonTextConverter: function(itemText, originalItem)
			{
				return itemText;
			}
		};

		$scope.onMRClick = function(book, index){
			$scope.selectedMRIndex = index;
			$scope.selectedMRRow = book;
		};

		$scope.removeMrBook = function(index){
			if(!$scope.selectedMRRow) {
				return swal('Warning','Please select a Row', 'warning');
			}
			$scope.removeBooks.push($scope.selectedMRRow);
			$scope.mrBook.splice(index, 1)
		};

		$scope.onCRClick = function(book, index){
			$scope.selectedCRIndex = index;
			$scope.selectedCRRow = book;
		};

		$scope.removeCrBook = function(index){
			if(!$scope.selectedCRRow) {
				return swal('Warning','Please select a Row', 'warning');
			}
			$scope.removeBooks.push($scope.selectedCRRow);
			$scope.crBook.splice(index, 1)
		};

		$scope.onHSClick = function(book, index){
			$scope.selectedHSIndex = index;
			$scope.selectedHSRow = book;
		};

		$scope.removeHsBook = function(index){
			if(!$scope.selectedHSRow) {
				return swal('Warning','Please select a Row', 'warning');
			}
			$scope.removeBooks.push($scope.selectedHSRow);
			$scope.lsBook.splice(index, 1)
		};

		$scope.onRefClick = function(book, index){
			$scope.selectedRefIndex = index;
			$scope.selectedRefRow = book;
		};

		$scope.removeRefBook = function(index){
			if(!$scope.selectedRefRow) {
				return swal('Warning','Please select a Row', 'warning');
			}
			$scope.removeBooks.push($scope.selectedRefRow);
			$scope.refNoBook.splice(index, 1)
		};

		$scope.onMiscCNClick = function(book, index){
			$scope.selectedMiscCNIndex = index;
			$scope.selectedMiscCNRow = book;
		};

		$scope.removeMiscBook = function(index){
			if(!$scope.selectedMiscCNRow) {
				return swal('Warning','Please select a Row', 'warning');
			}
			$scope.removeBooks.push($scope.selectedMiscCNRow);
			$scope.miscCNBook.splice(index, 1)
		};

		 $scope.getbillBooks = function(Billtype, key,  input){

			if(input && input.length <= 2)
				return;

			var oFilter = {
				name: {$regex:input, $options:'-i'},
				type: Billtype,
				no_of_docs: 10,
			}; // filter to send

			 if($scope.selectedBranch.autoBook)
				 oFilter.auto = true;

			billBookService.get(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {

			}

			// Handle success response
			function onSuccess(response){
				$scope[key] = response.data.data;


				// if($scope.lsBook && $scope.lsBook.ref && !$scope[key].find( o => o._id === $scope.lsBook.ref))
				// 	$scope[key].unshift({
				// 		_id: $scope.lsBook.ref,
				// 		name: $scope.lsBook.name
				// 	});
				// if($scope.refNoBook && $scope.refNoBook.ref && !$scope[key].find( o => o._id === $scope.refNoBook.ref))
				// 	$scope[key].unshift({
				// 		_id: $scope.refNoBook.ref,
				// 		name: $scope.refNoBook.name
				// 	});
			}
		};

		$scope.getBranchNames = function(viewValue){
			function sucGetBranch(response){
				console.log(response);
				$scope.branchNames = response.data;
			}
			function failGetBranch(response){
				console.log(response);
			}
			if(viewValue && viewValue.length>1){
				var searchValue = {};
				searchValue.name = viewValue;
				branchService.getAllBranches(searchValue,sucGetBranch,failGetBranch);
			}
		};
		$scope.getVname  = function(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {

					let req ={};
					req.name = viewValue;
					branchService.getAllBranches(req, res => {
						$scope.Branchdata = res.data;
						resolve(res.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}

			return [];
		}

		$scope.getBranchCodes = function(viewValue){
			function sucGetBranch(response){
				console.log(response);
				$scope.branchCode = response.data;
			}
			function failGetBranch(response){
				console.log(response);
			}
			if(viewValue && viewValue.length>1){
				var searchCodeValue = {};
				searchCodeValue.code = viewValue;
				branchService.getAllBranches(searchCodeValue,sucGetBranch,failGetBranch);
			}
		};

		$scope.onBranchTypeAheadSelect = function($item, option){
			$scope.currentPage = 1;
			//$scope.driver_id = $item._id;
			$scope.getAllBranches();
		};

        $scope.selectTabBranch = function (tabNo) {
            $scope.tab_active_branch = tabNo;
        };

		$scope.downloadReport = function () {

			// if(!($scope.oSearchTripFilter.start_date && $scope.oSearchTripFilter.end_date)){
			// 	swal('Warning','From and To Date  should be filled','warning');
			// 	return;
			// }
			let request = {
				all: true,
				download: true
			};
			branchService.getAllBranches(request, successCallback, failureCallback);

			function failureCallback(response) {
				swal('', response.data.message, 'error');
			}

			function successCallback(response) {
				const a = document.createElement('a');
				a.href = response.url;
				a.target = '_blank';
				a.click();
			}
		};

        ($scope.getAllBranches = function(reset){
            $scope.branches=[];
            $scope.selectedBranch={};
            if (reset){
                $scope.indexSelectedFromList=0;
            }
            function prepareQueryFilterObj(){
                var queryFilter = {};
                if($scope.searchValue.length>0){
                    queryFilter.name = $scope.searchValue;
                }
                if($scope.searchCodeValue.length>0)
				{
                	queryFilter.code = $scope.searchCodeValue;
				}
				if ($scope.filterObj.status) {
					if($scope.filterObj.status === 'Enable')
						queryFilter.deleted = false;
					else if($scope.filterObj.status === 'Disable')
						queryFilter.deleted = true;
				}else {
					queryFilter.deleted = false;
				}
                //queryFilter.skip = $scope.currentPage;
                queryFilter.all = true;
                return queryFilter;
            }
            function success(response){
                //console.log(data);
                if(response.data && response.data.length>0){
                    $scope.branches = response.data;
                    //$scope.totalPages = response.pages;
                    //$scope.totalItems = 10*response.pages;
                    $scope.selectBranchAtIndex($scope.indexSelectedFromList);
                }
            }
            function failure(response){
                console.log(response);
            }
            branchService.getAllBranches(prepareQueryFilterObj(),success,failure);
        })();

        ($scope.getDepartmentMaster = function(){
            function success(response){
                $scope.departmentMasterList = response.data;
            }
            departmentService.getDepartmentTrims({},success);
        })();

        ($scope.getUsers  = function(){
            function success(response){
                if (response && response.data){
                    $scope.users  = response.data;
                }
            }
            userService.getUsers({"user_type":"Employee"},success);
        })();

		 $scope.getBillBook = function(viewValue, type) {
			if (viewValue && viewValue.toString().length > 1) {

				return new Promise(function (resolve, reject) {

					let request = {
						name :{$regex:viewValue, $options:'i'},
						type: type,
						isLinked: {$ne: true},
						deleted: {$ne: true}
					};

					billBookService.get(request, oSuc, oFail);

					function oSuc(response) {
						resolve(response.data.data);
					}

					function oFail(response) {
						reject([]);
					}
				});
			} else
				return [];
		};

		 $scope.onBookSelect = function(item, type){
		 	if(type === 'Hire Slip'){
		 		if($scope.lsBook.length && item.auto)
		 			return swal('warning', 'you can add only one auto book at a time', 'warning');
				item.newBook = true;
				$scope.lsBook.push(item);
				if(item.auto)
					$scope.hsReadonly = true;

			}else if(type === 'Ref No'){
				if($scope.refNoBook.length && item.auto)
					return swal('warning', 'you can add only one auto book at a time', 'warning');
				item.newBook = true;
				$scope.refNoBook.push(item);
				if(item.auto)
					$scope.refReadonly = true;

			}else if(type === 'Cash Receipt'){
				if($scope.crBook.length && item.auto)
					return swal('warning', 'you can add only one auto book at a time', 'warning');
				item.newBook = true;
              $scope.crBook.push(item);
				if(item.auto)
					$scope.crReadonly = true;

			}else if(type === 'Money Receipt'){
				if($scope.mrBook.length && item.auto)
					return swal('warning', 'you can add only one auto book at a time', 'warning');
				item.newBook = true;
				$scope.mrBook.push(item);
				if(item.auto)
					$scope.mrReadonly = true;
			}else if(type === 'Credit Note'){
				if($scope.miscCNBook.length && item.auto)
					return swal('warning', 'you can add only one auto book at a time', 'warning');
				item.newBook = true;
				$scope.miscCNBook.push(item);
				if(item.auto)
					$scope.cnReadonly = true;
			}
		 };


        $scope.getBranchNameSearched = function(){

        };

        $scope.selectBranchAtIndex = function (index) {
            $scope.selectedBranch = $scope.branches[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };


        $scope.addNewBranchClicked = function () {
            $scope.selectedBranch = {};
            $scope.lsBook = [];
            $scope.crBook = [];
            $scope.mrBook = [];
            $scope.refNoBook = [];
            $scope.miscCNBook = [];
            $scope.currentMode = "add";
        };

        $scope.editBranchClicked = function() {
            $scope.currentMode = "edit";
			$scope.removeBooks=[];
			$scope.lsBook = [];
			$scope.crBook = [];
			$scope.mrBook = [];
			$scope.refNoBook = [];
			$scope.miscCNBook = [];
			$scope.hsReadonly = false;
			$scope.mrReadonly = false;
			$scope.crReadonly = false;
			$scope.refReadonly = false;

			$scope.lsBook.push(...$scope.selectedBranch.lsBook.map(o => ({
				name: o.name,
				_id: o.ref
			})));

			if($scope.lsBook.length === 1) {
				$scope.selectedHSRow = $scope.lsBook[0];
				$scope.selectedHSIndex = 0;
			}

			$scope.crBook.push(...$scope.selectedBranch.crBook.map(o => ({
				name: o.name,
				_id: o.ref
			})));

			if($scope.crBook.length === 1) {
				$scope.selectedCRRow = $scope.crBook[0];
				$scope.selectedCRIndex = 0;
			}

			$scope.mrBook.push(...$scope.selectedBranch.mrBook.map(o => ({
				name: o.name,
				_id: o.ref
			})));

			if($scope.mrBook.length === 1) {
				$scope.selectedMRRow = $scope.mrBook[0];
				$scope.selectedMRIndex = 0;
			}

			$scope.refNoBook.push(...$scope.selectedBranch.refNoBook.map(o => ({
				name: o.name,
				_id: o.ref
			})));

			if($scope.refNoBook.length === 1) {
				$scope.selectedRefRow = $scope.refNoBook[0];
				$scope.selectedRefIndex = 0;
			}

			$scope.miscCNBook.push(...$scope.selectedBranch.miscCNBook.map(o => ({
				name: o.name,
				_id: o.ref
			})));

			if($scope.miscCNBook.length === 1) {
				$scope.selectedMiscCNRow = $scope.miscCNBook[0];
				$scope.selectedMiscCNIndex = 0;
			}

			// Object.assign({}, {
			// 	_id: $scope.selectedBranch.lsBook.ref,
			// 	name: $scope.selectedBranch.lsBook.name,
			// }));
			// $scope.refNoBook.push(Object.assign({}, {
			// 	_id: $scope.selectedBranch.refNoBook ? $scope.selectedBranch.refNoBook.ref: '',
			// 	name: $scope.selectedBranch.refNoBook ? $scope.selectedBranch.refNoBook.name : '',
			// }));
        };

        $scope.pageChanged = function() {
            $scope.getAllBranches();
        };

        $scope.saveBranch = function(branchForm) {

			function successAddBranch(response){
                if(response.message){
                    growlService.growl(response.message,"success",2);
                }
                $scope.getAllBranches(true);
            }

            function successUpdateBranch(response){
                if(response.message){
					swal('Success', response.message, 'success');
                    // growlService.growl(response.message,"success",2);
                }
                $scope.getAllBranches(false);
            }
            function failureAddBranch(response){
					 if(response.message){
                      growlService.growl(response.message,"danger",2);
                }
                console.error("failure add Branch: ",res);
            }
            function parseBeforeSave(){
                $scope.selectedBranch.speciality_parts = [];
                for (var key in $scope.selectedPartCategories){
                    if ($scope.selectedPartCategories[key]===true){
                        //console.log("pushing :"+ key);
                        $scope.selectedBranch.speciality_parts.push(key);
                    }
                }
                return $scope.selectedBranch;
            }

			let res = angular.copy(parseBeforeSave());

			if($scope.lsBook)
				res.lsBook = $scope.lsBook.map(o => ({
					name: o.name,
					ref: o._id,
					newBook: o.newBook,
				}));

			if($scope.crBook)
				res.crBook = $scope.crBook.map(o => ({
					name: o.name,
					ref: o._id,
					newBook: o.newBook,
				}));

			if($scope.mrBook)
				res.mrBook = $scope.mrBook.map(o => ({
					name: o.name,
					ref: o._id,
					newBook: o.newBook,
				}));

			if($scope.refNoBook)
				res.refNoBook = $scope.refNoBook.map(o => ({
					name: o.name,
					ref: o._id,
					newBook: o.newBook,
				}));

			if($scope.miscCNBook)
				res.miscCNBook = $scope.miscCNBook.map(o => ({
					name: o.name,
					ref: o._id,
					newBook: o.newBook,
				}));

			if($scope.removeBooks.length)
				res.removeBooks = $scope.removeBooks;

            if ($scope.currentMode ==="add") {

            	branchService.addBranch(res, successAddBranch, failureAddBranch);

            }else if ($scope.currentMode==="edit"){

            	branchService.updateBranch(res, successUpdateBranch, failureAddBranch);
            }
        };

        // $scope.deleteBranchClicked = function(){
        //     swal({
        //         title: "Confirm delete ?",
        //         text: "Branch "+$scope.selectedBranch.name+" will be removed from maintenance masters",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#F44336",
        //         confirmButtonText: "Delete",
        //         closeOnConfirm: true
        //     }, function(){
        //         function successDeleteBranch(response){
        //             if (response){
        //                 if (response.message) {
        //                     growlService.growl(response.message, "success", 2);
        //                 }
        //                 $scope.getAllBranches(false);
        //             }
        //         }
        //         function failureDeleteBranch(response){
        //             if (response.message){
        //                 growlService.growl(response.message, "danger",2);
        //             }
        //         }
        //         branchService.deleteBranch($scope.selectedBranch,
        //             $scope.selectedBranch, successDeleteBranch, failureDeleteBranch);
        //     });
        // };

		function branchStatus(type){

			swal({
					title: `Are you sure you want to ${type} this Branch? `,
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
							_id:$scope.selectedBranch._id
						};
						if(type === 'Enable')
							oRequest.deleted = false;
						else if(type === 'Disable')
							oRequest.deleted = true;

						branchService.enableDisableBranch(oRequest, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message || err.message, 'error');
						}

						function onSuccess(res) {
							swal('Success', 'Branch updated!!', 'success');
							$scope.getAllBranches();
						}
					}
				});
			return;
		}

        $scope.addDepartmentBranchClicked = function(){
            $scope.modalDepartmentBranch({},$scope.selectedBranch);
        };

        $scope.editDepartmentBranchClicked = function(index){
            $scope.modalDepartmentBranch($scope.selectedBranch.departments[index],$scope.selectedBranch);
        };

        $scope.deleteDepartmentBranchClicked = function(index){
            swal({
                title: "Confirm delete ?",
                text: "Department "+$scope.selectedBranch.departments[index].depName
                +","+$scope.selectedBranch.name
                +" will be removed from masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function success(response){
                    if (response){
                        if (response.message) {
                            growlService.growl(response.message, "success", 2);
                        }
                        $scope.getAllBranches(true);
                    }
                }
                function failure(response){
                    if (response.message){
                        growlService.growl(response.message, "danger",2);
                    }
                }
                departmentBranchService.deleteDepartmentBranch($scope.selectedBranch.departments[index]._id,
                    $scope.selectedBranch.departments[index], success, failure);
            });
        };

        $scope.modalDepartmentBranch = function(objDepartmentBranch,selectedBranch) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/departmentBranchModal.html',
                controller: 'departmentBranchModalController',
                resolve: {
                    objDepartmentBranch: function(){
                        return objDepartmentBranch;
                    },
                    selectedBranch:function () {
                        return selectedBranch;
                    },
                    departmentMasterList:function () {
                        return $scope.departmentMasterList;
                    },
                    userList:function () {
                        return $scope.users;
                    }
                }
            });

            modalInstance.result.then(function(message) {
                if (message) {
                    growlService.growl(message,"success",3);
                    $scope.getAllBranches(false);
                }
            }, function(data) {
                //dialog dismissed
            });
        };
    });

materialAdmin.controller("departmentBranchModalController",
    function($scope, $uibModalInstance, growlService, otherUtils, departmentBranchService, objDepartmentBranch
        , departmentMasterList, selectedBranch, userList) {

        $scope.objDepartmentBranch = objDepartmentBranch ||{};
        $scope.departmentMasterList = departmentMasterList;
        $scope.selectedBranch = selectedBranch;
        $scope.userList = userList;
        $scope.selectedUser = {};

        $scope.$watch(function(){
            return $scope.objDepartmentBranch;
        },function(){
            if ($scope.objDepartmentBranch && $scope.objDepartmentBranch.headEmployeeId && userList.length>0){
                for (var i = 0; i< $scope.userList.length; i++){
                    if ($scope.userList[i].userId===$scope.objDepartmentBranch.headEmployeeId){
                        $scope.selectedUser = $scope.userList[i];
                    }
                }
            }
        });

        if (otherUtils.isEmptyObject(objDepartmentBranch)) {
            $scope.currentMode = "add";
        }else{
            $scope.currentMode = "edit";
        }

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveDepartmentBranch = function(form) {
            function parseBeforeSave() {
                $scope.objDepartmentBranch.branchId = $scope.selectedBranch.id;
                for (var i in $scope.departmentMasterList){
                    if ($scope.departmentMasterList[i].name===$scope.objDepartmentBranch.depName){
                        $scope.objDepartmentBranch.depMasterCode = $scope.departmentMasterList[i].code;
                    }
                }
                $scope.objDepartmentBranch.head = $scope.selectedUser.full_name;
                $scope.objDepartmentBranch.headEmployeeId= $scope.selectedUser.userId;
                return $scope.objDepartmentBranch;
            }
            function success(res) {
                if (res && res.message) {
                    $uibModalInstance.close(res.message);
                }
            }
            function failure(res) {
                growlService.growl(res.message || res.error_message, "danger",3);
            }

            if(true){
                if ($scope.currentMode ==='add'){
                    departmentBranchService.addDepartmentBranch(parseBeforeSave(), success, failure);
                }else{
                    departmentBranchService.updateDepartmentBranch($scope.objDepartmentBranch._id,
                        parseBeforeSave(), success, failure);
                }
            }
        }
    }
);








