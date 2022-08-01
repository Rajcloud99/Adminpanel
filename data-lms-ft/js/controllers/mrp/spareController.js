materialAdmin.controller("spareMsCommonController", function ($rootScope, $scope, spareService) {
    $("p").text("Spare Master");
    //$rootScope.wantThis = false;
    $rootScope.wantRegSL22 = false;
    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.pageChanged = function () {
        $scope.getAllSpares(true);
    };

    function prepareFilterObject(isPagination) {
        var myFilter = {};
        if ($scope.sldoName) {
            myFilter.name = $scope.sldoName;
        }
        if (isPagination && $scope.currentPage) {
            myFilter.skip = $scope.currentPage;
        }
        if($scope.searchData){
            myFilter.find = $scope.searchData;
        }
        return myFilter;
    }
    $scope.getAllSpares = function (isPagination) {
        function success(data) {
            $rootScope.aSpareRoot = data.data.data;
            $scope.aSpareRoot = data.data.data;
            if (data.data && data.data.data) {
                $scope.total_pages = data.data.pages;
                $scope.totalItems = ($scope.items_per_page * (data.data.pages-1)) + data.data.data.length;
                $rootScope.sSpare = data.data.data[0];
                setTimeout(function () {
                    listItem = $($('.lv-item')[0]);
                    listItem.addClass('grn');
                }, 500);

                for(var s=0;s<$scope.aSpareRoot.length;s++){
                    if($scope.aSpareRoot[s].active_status === true){
                        $scope.aSpareRoot[s].active_status = 'YES';
                    }else if($scope.aSpareRoot[s].active_status === false){
                        $scope.aSpareRoot[s].active_status = 'NO';
                    }
                }
            }
        }
        var oFilter = prepareFilterObject(isPagination);
        spareService.getAllSpareList(oFilter, success);
    };
    $scope.getAllSpares();

    function oSucC(response) {
        $scope.aSpareRoot = response.data.data;
    }
    function oFailC(response) {
        console.log(response);
    }

    $scope.getSLDOName = function (viewValue) {
        if (viewValue && viewValue.toString().length > 2) {
            SLDOServices.getCname(viewValue, oSucC, oFailC);
        }
        else if (viewValue == '') {
            $scope.currentPage = 1;
            $scope.getAllSpares();
        }
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.currentPage = 1;
        $scope.getAllSpares();
    };

    $scope.$watch(function () {
        return $rootScope.sSpare;
    }, function () {
        try {
            $scope.sSpare = $rootScope.sSpare;
        } catch (e) {
            //console.log('catch in driverProfileController');
        }
    }, true);

    $scope.resetSearch = function(){
        $scope.getSearch = '';
        $scope.searchData = null;
        $scope.getAllSpares();
    }

    //$scope.cities = dataServices.loadCities();
    $scope.selectSpare = function (sldo, index) {
        var sUrl = "#!/MRP_master/spares/spareList";
        $rootScope.redirect(sUrl);
        $rootScope.sSpare = sldo;
        listItem = $($('.lv-item')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');

    };
    $scope.newDriverReg = function () {
        $rootScope.sSpare = {};
        listItem = $($('.lv-item'));
        listItem.siblings().removeClass('grn');
    };
    $rootScope.formateDate = function (date) {
        return new Date(date);
    };

    $scope.getSearchClick = function(data){
        if(data && data.toString().length>2 || data.toString().length==0){
            $scope.searchData = data;
            $scope.getAllSpares();
        }
    }
});

materialAdmin.controller("spareMsProfileCtrl", function ($rootScope, $scope) {
    $("p").text("Spare Master");
    //$rootScope.wantThis = false;
    $rootScope.wantRegSL22 = false;
    $scope.$watch(function () {
        return $rootScope.sSpare;
    }, function () {
        try {
            $scope.sSpare = $rootScope.sSpare;
        } catch (e) {
        }
    }, true);
});

materialAdmin.controller("registerSpareMsController", function ($rootScope, $scope, spareService, partCategoryService, modelService) {
    $("p").text("Models");
    $rootScope.wantRegSL22 = true;
    $scope.spareReg = {};
    $scope.aStatusActive = ["YES", "NO"];

    $scope.getAllParts = function () {
        function success(data) {
            $scope.aPartCat = data.data;
        }
        partCategoryService.getPartCategories({}, success);
    };
    $scope.getAllParts();

    $scope.getAllModels = function () {
        function succe(data) {
            $scope.aVehModels = data.data.data;
        }
        modelService.getAllModelList({}, succe);
    };
    $scope.getAllModels();

    $scope.modelEnvol = [];
    $scope.addModel = function () {
        $scope.notAdd = false;
        if ($scope.modelEnvol.length > 0) {
            for (var i = 0; i < $scope.modelEnvol.length; i++) {
                if ($scope.modelEnvol[i] === $scope.v_model.model) {
                    $scope.notAdd = true;
                    swal("Already added in list", "", "warning");
                }
            }
        }
        if ($scope.notAdd === false) {
            $scope.modelEnvol.push($scope.v_model.model);
        }
    };

    $scope.removeModel = function ($index) {
        $scope.modelEnvol.splice($index, 1);
    };

    function successPost(response) {
        $scope.spareReg = {};
        if (response && response.data && (response.data.status === "OK") && response.data.data) {
            $rootScope.aSpareRoot.push(response.data.data);
            $rootScope.sSpare = response.data.data;
            //$scope.model.$dirty = false;
            swal("Spare Registered Successfully", "", "success");
            var sUrl = "#!/MRP_master/spares/spareList";
            $rootScope.redirect(sUrl);
        } else if (response && response.data && (response.data.status === "ERROR")) {
            swal("Spare Registration failed", response.data.message, "error");
        }
    }

    function failure(res) {
        swal("Spare Registration Failed", "", "error");
        console.log("fail: ", res);
    }

    $scope.createSparerrormsg = false;
    $scope.saveSpare = function (form) {
        $scope.spareMsg = '';
        if (form.$valid) {
            $scope.spareReg.category_name = $scope.part_cat.name;
            $scope.spareReg.category_code = $scope.part_cat.code;
            if($scope.part_cat && $scope.part_cat.type) {
                $scope.spareReg.type = $scope.part_cat.type;
            }
            $scope.spareReg.vehicle_models = $scope.modelEnvol;
            if ($scope.spareReg.active_status === 'YES') {
                $scope.spareReg.active_status = true;
            } else {
                $scope.spareReg.active_status = false;
            }

           spareService.saveSpareServ($scope.spareReg, successPost, failure);
        } else if (form.$error && form.$error.required) {
            for (i = 0; i < form.$error.required.length; i++) {
                if (form.$error.required[i].$name) {
                    $scope.spareMsg = $scope.spareMsg + " " + form.$error.required[i].$name + " ,";
                }
            }
            if ($scope.spareMsg) {
                $scope.spareMsg = $scope.spareMsg.substring(0, $scope.spareMsg.length - 1);
                $scope.spareMsg = $scope.spareMsg + ' are require.';
                $scope.createSparerrormsg = true;
                setTimeout(function () {
                    if ($scope.createSparerrormsg) {
                        $scope.$apply(function () {
                            $scope.createSparerrormsg = false;
                        });
                    }
                }, 7000);
            }
        } else if ((form.$error.minlength && form.$error.minlength.length > 0) || (form.$error.maxlength && form.$error.maxlength.length > 0)) {
            $scope.spareMsg = 'Please enter valid mobile number';
            $scope.createSparerrormsg = true;
            setTimeout(function () {
                if ($scope.createSparerrormsg) {
                    $scope.$apply(function () {
                        $scope.createSparerrormsg = false;
                    });
                }
            }, 7000);
        }
    }

    $scope.cancel = function(){
        var sUrl = "#!/MRP_master/spares/spareList";
        $rootScope.redirect(sUrl);
    }
});

materialAdmin.controller("editSpareMsController", function (
	$rootScope,
	$scope,
	modelService,
	partCategoryService,
	spareService
) {
    $rootScope.wantRegSL22 = false;
    $("p").text("Spare Master");
    $rootScope.wantThis = true;
    $rootScope.wantReg = false;
    $scope.aStatusActive = ["YES", "NO"];
    if($rootScope.sSpare){

    }else{
        var sUrl = "#!/MRP_master/spares/spareList";
        $rootScope.redirect(sUrl);
    }

    $scope.cancel = function(){
        var sUrl = "#!/MRP_master/spares/spareList";
        $rootScope.redirect(sUrl);
    };

    $scope.$watch(function () {
        return $rootScope.sSpare;
    }, function () {
        try {
            $scope.sSpare = $rootScope.sSpare;
        } catch (e) {
            //console.log('catch in truckIdentificationController');
        }
    }, true);

    if($scope.sSpare.active_status === true){
        $scope.sSpare.active_status = $scope.aStatusActive[0];
    }else if($scope.sSpare.active_status === false){
        $scope.sSpare.active_status = $scope.aStatusActive[1];
    }
    $scope.getAllParts = function () {
        function success(data) {
            $scope.aPartCat = data.data;
              $scope.modelEnvol = $scope.sSpare.vehicle_models;
            for(var p=0;p<$scope.aPartCat.length;p++){
                if($scope.aPartCat[p].code === $rootScope.sSpare.category_code){
                    $scope.part_cat = $scope.aPartCat[p];
                    $scope.changePartCategory( $scope.part_cat);
                }
            }
        }
        partCategoryService.getPartCategories({}, success);
    };
    $scope.getAllParts();
    $scope.changePartCategory = function(pPart_cat){
      if(pPart_cat){
        $scope.sSpare.category_name = pPart_cat.name;
        $scope.sSpare.category_code = pPart_cat.code;
        $scope.sSpare.type = pPart_cat.type;
      }
    };
    $scope.getAllModels = function () {
        function succe(data) {
            $scope.aVehModels = data.data.data;
        }
        modelService.getAllModelList({}, succe);
    };
    $scope.getAllModels();

    $scope.modelEnvol = [];
    $scope.addModel = function () {
        $scope.notAdd = false;
        if ($scope.modelEnvol.length > 0) {
            for (var i = 0; i < $scope.modelEnvol.length; i++) {
                if ($scope.modelEnvol[i] === $scope.v_model.model) {
                    $scope.notAdd = true;
                    swal("Already added in list", "", "warning");
                }
            }
        }
        if ($scope.notAdd === false) {
            $scope.modelEnvol.push($scope.v_model.model);
        }
        $scope.sSpare.vehicle_models = $scope.modelEnvol;
    };

    $scope.removeModel = function ($index) {
        $scope.modelEnvol.splice($index, 1);
    };

    function success(response) {
        if (response && response.data && response.data.data) {
            $rootScope.sSpare = response.data.data;
            swal("Spare Updated Successfully", "", "success");
            var sUrl = "#!/MRP_master/spares/spareList";
            $rootScope.redirect(sUrl);
        }
    }

    function failure(response) {
        console.error("fail: ", response);
    }

    $scope.updateSpare = function () {
        if($scope.sSpare.active_status === 'YES'){
            $scope.sSpare.active_status = true;
        }else if($scope.sSpare.active_status === 'NO'){
            $scope.sSpare.active_status = false;
        }
        spareService.updateSpareServ($scope.sSpare, success, failure);
    }
});
