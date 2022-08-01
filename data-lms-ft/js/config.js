materialAdmin.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/auth/login')

    $stateProvider
        .state('login', {
            url: '/auth/login',
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })

    .state('home', {
        url: '/home',
        templateUrl: 'views/home_main.html',
        resolve: {
            access: ['Access', function(Access) {
                // console.log(Access.isAuthenticated())
                return Access.isAuthenticated()
            }],
            client_config: ['$localStorage', function($localStorage) {
                return $localStorage.ft_data.client_config
            }],
            userLoggedIn: ['$localStorage', function($localStorage) {
                return $localStorage.ft_data.userLoggedIn
            }]
        },
        controller: function(client_config, userLoggedIn, $scope) {
            $scope.client_config = client_configc
            $scope.userLoggedIn = userLoggedIn
        }
    })

    .state('home.apps', {
            url: '/apps',
            templateUrl: 'views/apps.html',
            controller: 'appController',
            resolve: {
                access: ['Access', function(Access) {
                    // console.log(Access.isAuthenticated())
                    return Access.isAuthenticated()
                }]
            }
        })
        .state('home.settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'settingsController',
            /*resolve: {
                access: ['Access', function(Access) {
                    // console.log(Access.isAuthenticated())
                    return Access.isAuthenticated()
                }]
            }*/
        })
        .state('masters', {
            url: '/masters',
            templateUrl: 'views/home_common.html',
            resolve: {
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })

    // Branch states
    .state('masters.branch', {
        url: '/branch',
        controller: 'branchController',
        templateUrl: 'views/branch.html'
    })

    // driver states
    .state('masters.driver', {
            url: '/driver',
            templateUrl: 'views/common.html'
        })
        .state('masters.driverDetails', {
            url: '/driverDetails',
            templateUrl: 'views/myDrivers/driverDetails.html'
        })
        .state('masters.driverDetails.profile', {
            url: '/profile',
            templateUrl: 'views/myDrivers/driverProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('driver', 'read')
                }]
            }*/
        })
        .state('masters.driverDetails.register', {
            url: '/register',
            templateUrl: 'views/myDrivers/registerDriver.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('driver', 'add')
                }]
            }*/
        })
        .state('masters.driverDetails.editProfile', {
            url: '/editProfile',
            templateUrl: 'views/myDrivers/editProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('driver', 'edit')
                }]
            }*/
        })
        .state('masters.driverDetails.editDriving', {
            url: '/editDriving',
            templateUrl: 'views/myDrivers/editDriving.html'
        })
        .state('masters.driverDetails.editAddress', {
            url: '/editAddress',
            templateUrl: 'views/myDrivers/editAddress.html'
        })
        .state('masters.driverDetails.editReferences', {
            url: '/editReferences',
            templateUrl: 'views/myDrivers/editReferences.html'
        })
        .state('masters.driverDetails.editGuarantor', {
            url: '/editGuarantor',
            templateUrl: 'views/myDrivers/editGuarantor.html'
        })
        .state('masters.driverDetails.document', {
            url: '/document',
            templateUrl: 'views/myDrivers/uploadDocument.html'
        })

    .state('masters.routeDetails', {
            url: '/routeDetails',
            templateUrl: 'views/myRoutes/routeDetails.html'
        })
        .state('masters.routeDetails.allRoutes', {
            url: '/allRoutes',
            templateUrl: 'views/myRoutes/routeProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('route', 'read')
                }]
            }*/
        })
        .state('masters.routeDetails.register', {
            url: '/register',
            templateUrl: 'views/myRoutes/registerRoute.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('route', 'add')
                }]
            }*/
        })
        .state('masters.routeDetails.editRoute', {
            url: '/editProfile',
            templateUrl: 'views/myRoutes/routeEditProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('route', 'edit')
                }]
            }*/
        })
        .state('masters.routeDetails.routeVehicle', {
            url: '/vehicleType',
            templateUrl: 'views/myRoutes/routeEditVehicleTypes.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('route', 'edit')
                }]
            }*/
        })

    .state('masters.sldoDetails', {
            url: '/sldoDetails',
            templateUrl: 'views/mySLDO/sldoDetails.html'
        })
        .state('masters.sldoDetails.list', {
            url: '/list',
            templateUrl: 'views/mySLDO/sldoProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('sldo', 'read')
                }]
            }*/
        })
        .state('masters.sldoDetails.register', {
            url: '/register',
            templateUrl: 'views/mySLDO/registerSLDO.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('sldo', 'add')
                }]
            }*/
        })
        .state('masters.sldoDetails.editRoute', {
            url: '/editProfile',
            templateUrl: 'views/mySLDO/sldoEditProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('sldo', 'edit')
                }]
            }*/
        })

    // Vendor transport
    .state('masters.vendorRegistration', {
            url: '/vendorRegistration',
            templateUrl: 'views/vendor/vendorRegistration.html'
        })
        .state('masters.vendorRegistration.profile', {
            url: '/profile',
            templateUrl: 'views/vendor/vProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('transportVendor', 'read')
                }]
            }*/
        })
        .state('masters.vendorRegistration.Register', {
            url: '/Register',
            templateUrl: 'views/vendor/createVendor.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('transportVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorRegistration.update', {
            url: '/update',
            templateUrl: 'views/vendor/updateVendor.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('transportVendor', 'edit')
                }]
            }*/
        })
        .state('masters.vendorRegistration.route', {
            url: '/route',
            templateUrl: 'views/vendor/routeVendor.html'
        })
        .state('masters.vendorRegistration.vehicle', {
            url: '/vehicle',
            templateUrl: 'views/vendor/vehicleVendor.html'
        })

    // vendor courier states
    .state('masters.vendorCourier', {
            url: '/vendorCourier',
            templateUrl: 'views/vendorCourier/vendorCourierHome.html',
            controller: 'vendorCourierController'
        })
        .state('masters.vendorCourier.add', {
            url: '/add',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorCourier.view', {
            url: '/view',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'read')
                }]
            }*/
        })
        .state('masters.vendorCourier.edit', {
            url: '/edit',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'edit')
                }]
            }*/
        })

    // ***by Abhishek ****//
    .state('masters.vendorCourierCommon', {
            url: '/vendorCourierCommon',
            templateUrl: 'views/vendorCourier/vendorcourierCommon.html'
        })
        .state('masters.vendorCourierCommon.profile', {
            url: '/profile',
            templateUrl: 'views/vendorCourier/vendorcourierProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'read')
                }]
            }*/
        })
        .state('masters.vendorCourierCommon.add', {
            url: '/add',
            templateUrl: 'views/vendorCourier/vendorcourierAdd.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorCourierCommon.addOffices', {
            url: '/addOffices',
            templateUrl: 'views/vendorCourier/vendorcourieraddOffices.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorCourierCommon.edit', {
            url: '/edit',
            templateUrl: 'views/vendorCourier/vendorcourierEdit.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'edit')
                }]
            }*/
        })
        .state('masters.vendorCourierCommon.editOffices', {
            url: '/editOffices',
            templateUrl: 'views/vendorCourier/vendorcourierEditOffices.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('courierVendor', 'edit')
                }]
            }*/
        })

    // vendor fuel states
    .state('masters.vendorFuel', {
            url: '/vendorFuel',
            templateUrl: 'views/vendorFuel/vendorFuelHome.html',
            controller: 'vendorFuelController'
        })
        .state('masters.vendorFuel.add', {
            url: '/add',
            templateUrl: 'views/vendorFuel/vendorFuelForm.html',
            controller: 'vendorFuelAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorFuel.view', {
            url: '/view',
            templateUrl: 'views/vendorFuel/vendorFuelForm.html',
            controller: 'vendorFuelViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'read')
                }]
            }*/
        })
        .state('masters.vendorFuel.edit', {
            url: '/edit',
            templateUrl: 'views/vendorFuel/vendorFuelForm.html',
            controller: 'vendorFuelEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'edit')
                }]
            }*/
        })

    // ***by ajay ****//
    .state('masters.vendorFuelCommon', {
            url: '/vendorFuelCommon',
            templateUrl: 'views/vendorFuel/vendorfuelCommon.html'
        })
        .state('masters.vendorFuelCommon.profile', {
            url: '/profile',
            templateUrl: 'views/vendorFuel/vendorfuelProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'read')
                }]
            }*/
        })
        .state('masters.vendorFuelCommon.add', {
            url: '/add',
            templateUrl: 'views/vendorFuel/vendorfuelAdd.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorFuelCommon.addStations', {
            url: '/addStations',
            templateUrl: 'views/vendorFuel/vendorfueladdStations.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorFuelCommon.edit', {
            url: '/edit',
            templateUrl: 'views/vendorFuel/vendorfuelEdit.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'edit')
                }]
            }*/
        })
        .state('masters.vendorFuelCommon.editStations', {
            url: '/editStations',
            templateUrl: 'views/vendorFuel/vendorfuelEditStations.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('fuelVendor', 'edit')
                }]
            }*/
        })

    // vendor maintenance registration
    .state('masters.vendorMaintenance', {
            url: '/vendorMaintenance',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceHome.html',
            controller: 'vendorMaintenanceController'
        })
        .state('masters.vendorMaintenance.add', {
            url: '/add',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceForm.html',
            controller: 'vendorMaintenanceAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('maintenanceVendor', 'add')
                }]
            }*/
        })
        .state('masters.vendorMaintenance.edit', {
            url: '/edit',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceForm.html',
            controller: 'vendorMaintenanceEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('maintenanceVendor', 'edit')
                }]
            }*/
        })
        .state('masters.vendorMaintenance.view', {
            url: '/view',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceForm.html',
            controller: 'vendorMaintenanceViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('maintenanceVendor', 'read')
                }]
            }*/
        })

    .state('masters.customer', {
            url: '/customer',
            templateUrl: 'views/customer/customer.html'
        })
        .state('masters.customer.profile', {
            url: '/profile',
            templateUrl: 'views/customer/profile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('customer', 'read')
                }]
            }*/
        })
        .state('masters.customer.register', {
            url: '/register',
            templateUrl: 'views/customer/registerCustomer.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('customer', 'add')
                }]
            }*/
        })
        .state('masters.customer.editProfile', {
            url: '/editProfile',
            templateUrl: 'views/customer/editProfile.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('customer', 'edit')
                }]
            }*/
        })
        .state('masters.customer.editDriving', {
            url: '/editDriving',
            templateUrl: 'views/customer/editDriving.html'
        })
        .state('masters.customer.contract', {
            url: '/contract',
            templateUrl: 'views/customer/contract.html'
        })
        .state('masters.customer.rates', {
            url: '/rates',
            templateUrl: 'views/customer/rates.html'
        })
        .state('masters.customer.editAddress', {
            url: '/editAddress',
            templateUrl: 'views/customer/editAddress.html'
        })
        .state('masters.customer.editReferences', {
            url: '/editReferences',
            templateUrl: 'views/customer/editReferences.html'
        })
        .state('masters.customer.editGuarantor', {
            url: '/editGuarantor',
            templateUrl: 'views/customer/editGuarantor.html'
        })
        .state('customer.document', {
            url: '/document',
            templateUrl: 'views/customer/uploadDocument.html'
        })

    .state('masters.registeredFleet', {
        url: '/registeredFleet',
        templateUrl: 'views/myRegisteredFleet/registeredFleet.html',
        controller: 'FleetController'
    })

    // VEHICLE
    .state('masters.registeredVehicle', {
            url: '/registeredVehicle',
            templateUrl: 'views/myRegisteredVehicle/registeredVehicle.html',
            controller: 'RegisteredVehicleController',
            controllerAs: 'vm'
        })
        /* .state('masters.vehicle', {
                url: '/vehicle',
                templateUrl: 'views/vehicle/vehicle.html'
            })
            .state('masters.vehicle.Register', {
                url: '/vehicleRegister',
                templateUrl: 'views/vehicle/createVehicle.html',
                resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('regvehicle', 'add')
                    }]
                }
            })
            .state('masters.vehicle.profile', {
                url: '/vehicleprofile/',
                templateUrl: 'views/vehicle/vehicleProfile.html',
                resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('regvehicle', 'read')
                    }]
                }
            })
            .state('masters.vehicle.update', {
                url: '/vehicleUpdate',
                templateUrl: 'views/vehicle/updateVehicle.html',
                resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('regvehicle', 'edit')
                    }]
                }
            })
            .state('masters.vehicle.Identification', {
                url: '/Identification',
                templateUrl: 'views/vehicle/updateIdentification.html'
            })
            .state('masters.vehicle.Document', {
                url: '/Document',
                templateUrl: 'views/vehicle/document.html'
            }) */
        .state('masters.vehicle.DriverDoc', {
            url: '/DriverDoc',
            templateUrl: 'views/vehicle/driver-document.html'
        })
        // Send Trip Location
        .state('masters.trip', {
            url: '/trips',
            templateUrl: 'views/sendTripLoc/trips.html'
        })
        .state('masters.trip.getLocInfo', {
            url: '/getTrip',
            templateUrl: 'views/sendTripLoc/getTripLocInfo.html'
        })
        .state('masters.trip.getMap', {
            url: '/getMaps',
            templateUrl: 'views/sendTripLoc/editTripLocMAP.html'
        })
        // GR master
        .state('masters.grMaster', {
            url: '/grMaster',
            templateUrl: 'views/grMaster/grMaster.html'
        })
        .state('masters.addGr', {
            url: '/addGr',
            templateUrl: 'views/grMaster/addGr.html'
        })
        .state('masters.updateGrMaster', {
            url: '/updateGrMaster',
            templateUrl: 'views/grMaster/updateGrMaster.html'
        })
        .state('masters.grMaster.allGrMaster', {
            url: '/allGrMaster',
            templateUrl: 'views/grMaster/allGrMaster.html'
        })
        .state('masters.grMaster.centralizedGR', {
            url: '/centralizedGR',
            templateUrl: 'views/grMaster/centralizedGR.html'
        })
        .state('masters.grMaster.usedGr', {
            url: '/usedGr',
            templateUrl: 'views/grMaster/usedGr.html'
        })
        .state('masters.grMaster.canceledGr', {
            url: '/canceledGr',
            templateUrl: 'views/grMaster/canceledGr.html'
        })
})

/***booking management states***/
.config(function($stateProvider) {
	debugger;
    $stateProvider
        .state('booking_manage', {
            url: '/booking_manage',
            templateUrl: 'views/home_common.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('booking', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })
        .state('booking_manage.bookings', {
            url: '/bookings',
            templateUrl: 'views/myBookings/bookingMain.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('bookings', 'read')
                }]
            }*/
        })
        .state('booking_manage.addorEditBooking', {
            url: '/booking',
            templateUrl: 'views/myBookings/addorEditBooking.html',
            controller: 'addorEditBookingController',
            params: {
                data: null
            }
        })
        .state('booking_manage.quotation', {
            url: '/quotation',
            templateUrl: 'views/myBookings/addOrEditQuotation.html',
            controller: 'addOrEditQuotationController',
            params: {
                data: null
            }
        })
        .state('booking_manage.booking', {
            url: '/bookings',
            templateUrl: 'views/bookings/booking.html'
        })
        /*.state('booking_manage.booking.basic', {
            url: '/addBooking',
            templateUrl: 'views/bookings/addBooking.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','add')
                }]
            }
        })
        .state('booking_manage.booking.extra', {
            url: '/addBookingDetails',
            templateUrl: 'views/bookings/addBookingDetails.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','add')
                }]
            }
        })
        .state('booking_manage.booking.Billing', {
            url: '/addBookingBilling',
            templateUrl: 'views/bookings/addBookingBill.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','add')
                }]
            }
        })*/
        // ***update full booking ***//
        /*.state('booking_manage.updateBooking', {
            url: '/updateBooking',
            templateUrl: 'views/bookings/updateFullBooking.html'
        })
        .state('booking_manage.updateBooking.basic', {
            url: '/updateBookingBasic',
            templateUrl: 'views/bookings/updateBookingBasic.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','edit')
                }]
            }
        })
        .state('booking_manage.updateBooking.extra', {
            url: '/updateBookingExtra',
            templateUrl: 'views/bookings/updateBookingExtra.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','edit')
                }]
            }
        })
        .state('booking_manage.updateBooking.Billing', {
            url: '/updateBookingBilling',
            templateUrl: 'views/bookings/updateBookingBilling.html',
            resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('bookings','edit')
                }]
            }
        })*/

    // Vehicle Allcation ok
    .state('booking_manage.vehicleAllocation', {
            url: '/vehicleAllocation',
            templateUrl: 'views/vehicleAllocation/vehicleAllocation.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'read')
                }]
            }*/
        })
		.state('booking_manage.vehicleAllocation.vehicleProvider', {
			url: '/vehicleProvider',
			templateUrl: 'views/vehicleAllocation/vehicleProvider.html',
			/*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'read')
                }]
            }*/
		})
		.state('booking_manage.vehicleAllocation.vehicleDriver', {
			url: '/vehicleDriver',
			templateUrl: 'views/vehicleAllocation/vehicleDriver.html',
			/*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'read')
                }]
            }*/
		})
		.state('booking_manage.vehicleAllocation.bookingInfo', {
			url: '/bookingInfo',
			templateUrl: 'views/vehicleAllocation/bookingInfo.html',
			/*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'read')
                }]
            }*/
		})
		.state('booking_manage.vehicleAllocation.allocate', {
			url: '/allocate',
			templateUrl: 'views/vehicleAllocation/allocate.html',
			/*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'read')
                }]
            }*/
		})



        .state('booking_manage.AllcationpopUp', {
            url: '/AllcationpopUp',
            templateUrl: 'views/vehicleAllcation/AllcationpopUp.html',
            params: {
                data: null
            },
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'edit')
                }]
            }*/
        })
        .state('booking_manage.vendor_vehicle', {
            url: '/vendor_vehicle',
            templateUrl: 'views/vehicleAllcation/vendorVehicleDetail.html',
            controller: 'vendorVehicleDetail',
            params: {
                data: null
            },
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('vehicleAllocation', 'edit')
                }]
            }*/
        })
        .state('booking_manage.myGR', {
            url: '/grDetails',
            templateUrl: 'views/myGR/myGRmain.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('gr', 'read')
                }]
            }*/
        })
        .state('booking_manage.locationUpdate', {
            url: '/locationUpdate',
            templateUrl: 'views/myGR/tripLocationTab.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('gr', 'read')
                }]
            }*/
        })
        .state('booking_manage.pendingGr', {
            url: '/pendingGrDetails',
            templateUrl: 'views/pendingGR/pendingGRmain.html'
                /*,
                            resolve: {
                                access: ["Access", function(Access) {
                                    return Access.hasAccessTo('pendingGr','read')
                                }]
                            }*/
        })
        /*.state('booking_manage.builty', {
            url: '/grDetails/builty',
            templateUrl: 'views/bills/builty.html',
            controller: 'builtyCtrl',
            params: {
                data: null
            }
        })*/

    .state('booking_manage.myDiesel', {
            url: '/dieselDetails',
            templateUrl: 'views/myDieselSlip/myDieselSlipMain.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('diesel', 'read')
                }]
            }*/
        })
        /*.state('booking_manage.diesel', {
            url: '/dieselDetails/diesel',
            templateUrl: 'views/bills/diesel.html',
            controller: 'dieselCtrl',
            params: {
                data: null
            }
        })*/
        /*.state('booking_manage.driver', {
            url: '/dieselDetails/driver',
            templateUrl: 'views/bills/driver.html',
            controller: 'driverCtrl',
            params: {
                data: null
            }
        })*/
        .state('booking_manage.myTrips', {
            url: '/tripsDetail',
            templateUrl: 'views/myTripsStatus/myTripsStatus.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('trip', 'read')
                }]
            }*/
        })
        .state('booking_manage.updatemyTrips', {
            url: '/updatemyTrips',
            templateUrl: 'views/myTripsStatus/myTripPopUp.html',
            /*resolve: {
                access: ["Access", function(Access) {
                    return Access.hasAccessTo('trip','read')
                }]
            }*/
        })
        .state('booking_manage.tripDetailTab', {
            url: '/tripDetailTab',
            templateUrl: 'views/myTripsStatus/tripDetailTab.html',
            /*resolve: {
             access: ["Access", function(Access) {
             return Access.hasAccessTo('trip','read')
             }]
             }*/
        })
        .state('booking_manage.tripLocationTab', {
            url: '/tripLocationTab',
            templateUrl: 'views/myTripsStatus/tripLocationTab.html',
            /*resolve: {
             access: ["Access", function(Access) {
             return Access.hasAccessTo('trip','read')
             }]
             }*/
        })
        .state('booking_manage.myGR_acknowledge', {
            url: '/grAcknowledgeDetails',
            templateUrl: 'views/myGRacknowledge/myGRackMain.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('grAcknowledge', 'read')
                }]
            }*/
        })
        .state('booking_manage.grAckDetails', {
            url: '/grAckDetails',
            templateUrl: 'views/myGRacknowledge/grAckDetails.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('grAcknowledge', 'read')
                }]
            }*/
        })
        .state('booking_manage.vehicleList', {
            url: '/vehicleList',
            templateUrl: 'views/vehicleAccident/vehicleList.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('grAcknowledge', 'read')
                }]
            }*/
        })
        .state('booking_manage.vehicleAccident', {
            url: '/vehicleAccident',
            templateUrl: 'views/vehicleAccident/vehicleAccident.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('grAcknowledge', 'read')
                }]
            }*/
        })
        .state('booking_manage.tripMemo', {
            url: '/tripMemo',
            templateUrl: 'views/vehicleAccident/vehicleList.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('grAcknowledge', 'read')
                }]
            }*/
        })
})

/***billing management states***/
.config(function($stateProvider) {
    $stateProvider
        .state('billing', {
            url: '/billing',
            templateUrl: 'views/home_common.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('billing', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })
        .state('billing.bills', {
            url: '/bills',
            templateUrl: 'views/bills/bills.html',
            reloadOnSearch: true
        })
        .state('billing.generatedBills', {
            url: '/generatedBills',
            templateUrl: 'views/bills/generatedBills.html',
            reloadOnSearch: true
        })
        .state('billing.combineBills', {
            url: '/combineBills',
            templateUrl: 'views/bills/combineBill.html',
            reloadOnSearch: true
        })
        .state('billing.customerPayment', {
            url: '/customerPayment',
            templateUrl: 'views/bills/customerPayment.html',
            reloadOnSearch: true
        })
        .state('billing.customerPayDetails', {
            url: '/customerPayDetails',
            templateUrl: 'views/bills/customerPayDetails.html',
            reloadOnSearch: true
        })
        .state('billing.vendorPayment', {
            url: '/vendorPayment',
            templateUrl: 'views/bills/vendorPayment.html',
            reloadOnSearch: true
        })
        .state('billing.vendorPayDetails', {
            url: '/vendorPayDetails',
            templateUrl: 'views/bills/vendorPayDetails.html',
            reloadOnSearch: true,
            params: {
                data: null
            }
        })
        .state('billing.bills.builty', {
            url: '/builty',
            templateUrl: 'views/bills/builty.html',
            controller: 'builtyCtrl',
            params: {
                data: null
            }
        })
        .state('billing.bills.diesel', {
            url: '/diesel',
            templateUrl: 'views/bills/diesel.html',
            controller: 'dieselCtrl',
            params: {
                data: null
            }
        })
        .state('billing.bills.driver', {
            url: '/driver',
            templateUrl: 'views/bills/driver.html',
            controller: 'driverCtrl',
            params: {
                data: null
            }
        })
        .state('billing.invoice', {
            url: '/invoice',
            templateUrl: 'views/bills/invoice.html',
            controller: 'editInvoiceCtrl',
            params: {
                data: null
            }
        })
        .state('billing.tripExpense', {
            url: '/tripExpense',
            templateUrl: 'views/bills/tripExpense.html',
            reloadOnSearch: true
        })
        .state('billing.tripExpenseDetail', {
            url: '/tripExpenseDetail',
            templateUrl: 'views/bills/tripExpenseDetail.html',
            reloadOnSearch: true
        })

    .state('billing.billDispatch', {
        url: '/billDispatch',
        templateUrl: 'views/bills/billDispatch.html',
        reloadOnSearch: true
    })
})

/***reports management states***/
.config(function($stateProvider) {
    $stateProvider
        .state('reports', {
            url: '/reports',
            templateUrl: 'views/home_common.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('reports', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })
        .state('reports.billReport', {
            url: '/billReport',
            templateUrl: 'views/report/billReport.html',
            reloadOnSearch: true
        })
        .state('reports.bookingReports', {
            url: '/bookingReports',
            templateUrl: 'views/report/bookingReports.html',
            reloadOnSearch: true
        })
		.state('reports.grReports', {
			url: '/grReports',
			templateUrl: 'views/report/grReport.html',
			reloadOnSearch: true
		})
        .state('reports.billDispatchReport', {
            url: '/billDispatchReport',
            templateUrl: 'views/report/billDispatchReport.html',
            reloadOnSearch: true
        })
        .state('reports.unbilledReport', {
            url: '/unbilledReport',
            templateUrl: 'views/report/unbilledReport.html',
            reloadOnSearch: true
        })

    .state('reports.costingReport', {
            url: '/costingReport',
            templateUrl: 'views/report/costingReport.html',
            reloadOnSearch: true
        })
        .state('reports.profitReport', {
            url: '/profitReport',
            templateUrl: 'views/report/profitReport.html',
            reloadOnSearch: true
        })
        .state('reports.tripReport', {
            url: '/tripReport',
            templateUrl: 'views/report/tripReport.html',
            reloadOnSearch: true
        })
        .state('reports.vehicleReport', {
            url: '/vehicleReport',
            templateUrl: 'views/report/vehicleReport.html',
            reloadOnSearch: true
        })
		.state('reports.fleetOwnerReport', {
			url: '/fleetOwnerReport',
			templateUrl: 'views/report/fleetOwnerReport.html',
			reloadOnSearch: true
		})
		.state('reports.dieselEscalationReport', {
			url: '/dieselEscalationReport',
			templateUrl: 'views/report/dieselEscalationReport.html',
			reloadOnSearch: true
		})
        .state('reports.otherReport', {
            url: '/others',
            templateUrl: 'views/report/otherReport.html',
            reloadOnSearch: true
        })
        .state('reports.dailyKmAnalysis', {
            url: '/dailyKmAnalysis',
            templateUrl: 'views/report/dailyKmAnalysisReport.html',
            reloadOnSearch: true
        })
})

/***Logs management states***/
.config(function($stateProvider) {
    $stateProvider
        .state('logs', {
            url: '/logs',
            templateUrl: 'views/home_common.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('reports', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })
        .state('logs.logReport', {
            url: '/logReport',
            templateUrl: 'views/report/logReport.html',
            reloadOnSearch: true
        })
})

/***user management states ***/
.config(function($stateProvider) {
    $stateProvider
        .state('usermanage', {
            url: '/usermanage',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('user_management', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            templateUrl: 'views/home_common.html',
            controller: 'mastersController'
        })
        .state('usermanage.users', {
            url: '/users',
            templateUrl: 'views/user/userMain.html',
            controller: 'UsersController'
        })
        /*.state('usermanage.users.view', {
            url: '/view',
            templateUrl: 'views/user/userForm.html',
            controller: 'userViewController',
            resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('user', 'read')
                }]
            }
        })
        .state('usermanage.users.add', {
            url: '/add',
            templateUrl: 'views/user/userForm.html',
            controller: 'userAddController',
            resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('user', 'add')
                }]
            }
        })
        .state('usermanage.users.edit', {
            url: '/edit',
            templateUrl: 'views/user/userForm.html',
            controller: 'userEditController',
            resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('user', 'edit')
                }]
            }
        })
        .state('usermanage.users.self', {
            url: '/self',
            templateUrl: 'views/user/userForm.html',
            controller: 'userSelfController'
        })*/
        .state('usermanage.roles', {
            url: '/roles',
            templateUrl: 'views/role/roleHome.html',
            controller: 'roleController'
        })

    // departments manage
    .state('usermanage.departments', {
            url: '/departments',
            templateUrl: 'views/department/departmentHome.html',
            controller: 'departmentController'
        })
        .state('usermanage.departments.add', {
            url: '/add',
            templateUrl: 'views/department/departmentForm.html',
            controller: 'departmentAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('department', 'add')
                }]
            }*/
        })
        .state('usermanage.departments.edit', {
            url: '/edit',
            templateUrl: 'views/department/departmentForm.html',
            controller: 'departmentEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('department', 'edit')
                }]
            }*/
        })
        .state('usermanage.departments.view', {
            url: '/view',
            templateUrl: 'views/department/departmentForm.html',
            controller: 'departmentViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('department', 'read')
                }]
            }*/
        })
})

/***client management states***/
.config(function($stateProvider) {
    $stateProvider
        .state('clients', {
            url: '/clients',
            templateUrl: 'views/home_common.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('client_management', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'mastersController'
        })
        .state('clients.clientInfo', {
            url: '/clientInfo',
            templateUrl: 'views/client/clientHome.html',
            resolve: {
                /*access: ['Access', function(Access) {
                    return Access.hasAccessTo('client_management', 'read')
                }],*/
                userLoggedIn: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function($localStorage) {
                    return $localStorage.ft_data.client_config
                }]
            },
            controller: 'clientController'
        })
        .state('clients.clientInfo.view', {
            url: '/view',
            templateUrl: 'views/client/clientForm.html',
            controller: 'clientViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('client_management', 'read')
                }]
            }*/
        })
        .state('clients.clientInfo.add', {
            url: '/add',
            templateUrl: 'views/client/clientForm.html',
            controller: 'clientAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('client', 'add')
                }]
            }*/
        })
        .state('clients.clientInfo.edit', {
            url: '/edit',
            templateUrl: 'views/client/clientForm.html',
            controller: 'clientEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('client', 'edit')
                }]
            }*/
        })
        .state('clients.clientInfo.self', {
            url: '/self',
            templateUrl: 'views/client/clientForm.html',
            controller: 'clientViewController'
        })

    // material management states
    .state('clients.material', {
            url: '/material',
            controller: 'materialController',
            templateUrl: 'views/material/materialHome.html',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('material', 'read')
                }]
            }*/
        })
        // ICD registration
        .state('clients.icd', {
            url: '/icds',
            templateUrl: 'views/icds/icdHome.html',
            controller: 'icdController'
        })
        .state('clients.icd.add', {
            url: '/add',
            templateUrl: 'views/icds/icdForm.html',
            controller: 'icdAddController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('icd', 'add')
                }]
            }*/
        })
        .state('clients.icd.edit', {
            url: '/edit',
            templateUrl: 'views/icds/icdForm.html',
            controller: 'icdEditController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('icd', 'edit')
                }]
            }*/
        })
        .state('clients.icd.view', {
            url: '/view',
            templateUrl: 'views/icds/icdForm.html',
            controller: 'icdViewController',
            /*resolve: {
                access: ['Access', function(Access) {
                    return Access.hasAccessTo('icd', 'read')
                }]
            }*/
        })
        // Vehicle Group
        .state('clients.vehicle', {
            url: '/vehicleGT',
            templateUrl: 'views/vehicle/vehicleGT.html'
        })
})

.run(['$rootScope', 'Access', '$state', 'growlService', 'constants',
    function($rootScope, Access, $state, growlService, constants) {
        $rootScope.headerTitle = ''
        $rootScope.headerSubTitle = ''

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            // console.log("was here in state change error")
            if (error == Access.UNAUTHORIZED) {
                growlService.growl('Your access is unauthorized. Please login again', 'danger')
                $state.go('login')
            } else if (error == Access.FORBIDDEN) {
                growlService.growl('Access to this app is forbidden. Please contact your' +
                    ' IT administrator', 'danger')
            }
        })

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                // console.log(toState.name)
                switch (toState.name) {
                    case 'masters.branch':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['branch']
                        break
                    case 'masters.driverDetails.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['driver']
                        break
                    case 'masters.registeredVehicle':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['registeredVehicle']
                        break
                    case 'masters.routeDetails.allRoutes':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['route']
                        break
                    case 'masters.sldoDetails.list':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['sldo']
                        break
                    case 'masters.vendorRegistration.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['transportVendor']
                        break
                    case 'masters.vendorMaintenance':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['maintenanceVendor']
                        break
                    case 'masters.vendorCourierCommon.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['courierVendor']
                        break
                    case 'masters.vendorFuelCommon.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['fuelVendor']
                        break
                    case 'masters.customer.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['customer']
                        break
                    case 'masters.vehicle.profile':
                        $rootScope.headerTitle = constants.app_key_desc_pair['masters']
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['regvehicle']
                        break
                    case 'booking_manage.bookings':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['bookings']
                        break
                    case 'booking_manage.vehicleAllcation':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicleAllocation']
                        break
                    case 'booking_manage.myGR':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['gr']
                        break
                    case 'booking_manage.locationUpdate':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['locationUpdate']
                        break
                    case 'booking_manage.myDiesel':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['diesel']
                        break
                    case 'booking_manage.myTrips':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['trip']
                        break
                    case 'booking_manage.updatemyTrips':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['trip']
                        break
                    case 'booking_manage.myGR_acknowledge':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['grAcknowledge']
                        break
                    case 'booking_manage.grAckDetails':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['grAckDetails']
                        break
                    case 'booking_manage.vehicleAccident':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicleAccident']
                        break
                    case 'billing.bills':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['boewise']
                        break
                        /*case "billing.bills":
                            $rootScope.headerTitle = ""
                            $rootScope.headerSubTitle = constants.app_key_desc_pair["savePrintBill"]
                            break;*/
                    case 'billing.tripExpenseDetail':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['tripExpenseDetail']
                        break
                    case 'billing.tripExpense':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['tripExpense']
                        break
                    case 'reports.bookingReports':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['bookingReports']
                        break
                    case 'reports.logreport':
                            $rootScope.headerTitle = ''
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['reports.logreport']
                        break    
					case 'reports.grReports':
						$rootScope.headerTitle = ''
						$rootScope.headerSubTitle = constants.app_key_desc_pair['grReports']
						break
                    case 'reports.billReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['billReport']
                        break
                    case 'billing.billDispatch':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['billDispatch']
                        break
                    case 'reports.billDispatchReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['billDispatchReport']
                        break
                    case 'reports.costingReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['costing']
                        break
                    case 'reports.profitReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['profit']
                        break
                    case 'reports.tripReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['trip']
                        break
                    case 'reports.vehicleReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicle']
                        break
					case 'reports.fleetOwnerReport':
						$rootScope.headerTitle = ''
						$rootScope.headerSubTitle = constants.app_key_desc_pair['fleetOwner']
						break
                    case 'reports.otherReport':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['others']
                        break
                    case 'billing.customerPayment':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['customerPayment']
                        break
                    case 'billing.vendorPayment':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['vendorPayment']
                        break
                    case 'usermanage.users':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['user']
                        break
                    case 'usermanage.department':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['department']
                        break
                    case 'usermanage.role':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['role']
                        break
                    case 'clients.clientInfo':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['client']
                        break
                    case 'clients.material':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['material']
                        break
                    case 'clients.vehicle':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicle']
                        break
                    case 'clients.icd':
                        $rootScope.headerTitle = ''
                        $rootScope.headerSubTitle = constants.app_key_desc_pair['icd']
                        break

                }
            })
    }
])
