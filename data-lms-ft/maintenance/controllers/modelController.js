materialAdmin.controller("modelCommonController", function ($rootScope, $scope, modelService) {
    $("p").text("Model");
    //$rootScope.wantThis = false;
    $rootScope.wantRegSL22 = false;
    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.pageChanged = function () {
        $scope.getAllModels(true);
    };

    ($scope.getAllVehManufacturers =function() {
        function success(response){
            if (response.data && response.data.data){
                $rootScope.arrStrVehManufacturers = response.data.data;
            }
        }
        function failure(response){}
        modelService.getVehManufacturers(success,failure);
    })();

    function prepareFilterObject(isPagination) {
        var myFilter = {};
        if ($scope.sldoName) {
            myFilter.name = $scope.sldoName;
        }
        if (isPagination && $scope.currentPage) {
            myFilter.skip = $scope.currentPage;
        }
        return myFilter;
    }
    $scope.getAllModels = function (isPagination) {
        function success(data) {
            $rootScope.aModelsRoot = data.data.data;
            $scope.aModelsRoot = data.data.data;
            if (data.data && data.data.data.length > 0) {
                $scope.total_pages = data.data.pages;
                $scope.totalItems = 15 * data.data.pages;
                $rootScope.sModel = data.data.data[0];
                setTimeout(function () {
                    listItem = $($('.lv-item')[0]);
                    listItem.addClass('grn');
                }, 500);
            }
        }
        var oFilter = prepareFilterObject(isPagination);
        modelService.getAllModelList(oFilter, success);
    };
    $scope.getAllModels();

    function oSucC(response) {
        $scope.aModelsRoot = response.data.data;
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
            $scope.getAllModels();
        }
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.currentPage = 1;
        $scope.getAllModels();
    };

    $scope.$watch(function () {
        return $rootScope.sModel;
    }, function () {
        try {
            $scope.sModel = $rootScope.sModel;
        } catch (e) {
            //console.log('catch in driverProfileController');
        }
    }, true);


    //$scope.cities = dataServices.loadCities();
    $scope.selectModel = function (sldo, index) {
        var sUrl = "#!/maintenance/models/modelList";
        $rootScope.redirect(sUrl);
        $rootScope.sModel = sldo;
        listItem = $($('.lv-item')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');

    };
    $scope.newDriverReg = function () {
        $rootScope.sModel = {};
        listItem = $($('.lv-item'));
        listItem.siblings().removeClass('grn');
    };
    $rootScope.formateDate = function (date) {
        return new Date(date);
    };
});

materialAdmin.controller("modelProfileCtrl", function ($rootScope, $scope) {
    $("p").text("models");
    //$rootScope.wantThis = false;
    $rootScope.wantRegSL22 = false;
    $scope.$watch(function () {
        return $rootScope.sModel;
    }, function () {
        try {
            $scope.sModel = $rootScope.sModel;
        } catch (e) {
        }
    }, true);
});

materialAdmin.controller("registerModelController", function ($rootScope, $scope, modelService) {
    $("p").text("Models");
    $rootScope.wantRegSL22 = true;
    $scope.modelReg = {};

    function successPost(response) {
        $scope.modelReg = {};
        if (response && response.data && (response.data.status == "OK") && response.data.data) {
            $rootScope.aModelsRoot.push(response.data.data);
            $rootScope.sModel = response.data.data;
            //$scope.model.$dirty = false;
            swal("Model Registered Successfully", "", "success");
            var sUrl = "#!/maintenance/models/modelList";
            $rootScope.redirect(sUrl);
        } else if (response && response.data && (response.data.status == "ERROR")) {
            swal("Model Registration failed", response.data.message, "error");
        }
    }

    function failure(res) {
        swal("Model Registration Failed", "", "error");
        console.log("fail: ", res);
    }

    $scope.createModelerrormsg = false;
    $scope.saveModel = function (form) {
        $scope.modelMsg = '';
        if (form.$valid) {
            modelService.saveModelServ($scope.modelReg, successPost, failure);
        } else if (form.$error && form.$error.required) {
            for (i = 0; i < form.$error.required.length; i++) {
                if (form.$error.required[i].$name) {
                    $scope.modelMsg = $scope.modelMsg + " " + form.$error.required[i].$name + " ,";
                }
            }
            if ($scope.modelMsg) {
                $scope.modelMsg = $scope.modelMsg.substring(0, $scope.modelMsg.length - 1);
                $scope.modelMsg = $scope.modelMsg + ' are require.';
                $scope.createModelerrormsg = true;
                setTimeout(function () {
                    if ($scope.createModelerrormsg) {
                        $scope.$apply(function () {
                            $scope.createModelerrormsg = false;
                        });
                    }
                }, 7000);
            }
        } else if ((form.$error.minlength && form.$error.minlength.length > 0) || (form.$error.maxlength && form.$error.maxlength.length > 0)) {
            $scope.modelMsg = 'Please enter valid mobile number';
            $scope.createModelerrormsg = true;
            setTimeout(function () {
                if ($scope.createModelerrormsg) {
                    $scope.$apply(function () {
                        $scope.createModelerrormsg = false;
                    });
                }
            }, 7000);
        }
    }
});

materialAdmin.controller("editModelController", function ($rootScope, $scope, modelService) {
    $rootScope.wantRegSL22 = false;
    $("p").text("Model");
    $rootScope.wantThis = true;
    $rootScope.wantReg = false;
    $scope.$watch(function () {
        return $rootScope.sModel;
    }, function () {
        try {
            $scope.sModel = $rootScope.sModel;
        } catch (e) {
            //console.log('catch in truckIdentificationController');
        }
    }, true);

    function success(response) {
        if (response && response.data && response.data.data) {
            $rootScope.sModel = response.data.data;
            swal("Model Updated Successfully", "", "success");
        }
    }

    function failure(response) {
        console.error("fail: ", response);
    }

    $scope.updateModel = function () {
        modelService.updateModelServ($scope.sModel, success, failure);
    }
});