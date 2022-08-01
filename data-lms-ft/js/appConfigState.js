materialAdmin

	/***home and masters management states***/
	.config(function ($stateProvider, $urlRouterProvider, $httpProvider, desktopNotificationProvider) {
		desktopNotificationProvider.config({
			autoClose: false,
			showOnPageHidden: true
		});
    $urlRouterProvider.otherwise('/auth/login');

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
                /* acc`ess: ['Access', function (Access) {
                    return Access.isAuthenticated()
                }], */
                client_config: ['$localStorage', function ($localStorage) {
                    return $localStorage.ft_data.client_config
                }],
                userLoggedIn: ['$localStorage', function ($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }]
            },
            controller: function (client_config, userLoggedIn, $scope) {
                $scope.client_config = client_config;
                $scope.userLoggedIn = userLoggedIn
            }
        })

        .state('home.apps', {
            url: '/apps',
            templateUrl: 'views/apps.html',
            controller: 'appController'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.isAuthenticated()
                }]
            } */
        })
        .state('home.settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: 'settingsController'
			/* resolve: {
                access: ['Access', function (Access) {
                    // console.log(Access.isAuthenticated())
                    return Access.isAuthenticated()
                }]
            } */
        })
        .state('home.notification', {
            url: '/notification',
            templateUrl: 'views/notifications.html'/*,
            controller: 'settingsController'*/
			/* resolve: {
                access: ['Access', function (Access) {
                    // console.log(Access.isAuthenticated())
                    return Access.isAuthenticated	()
                }]
            } */
        })
        .state('masters', {
            url: '/masters',
            templateUrl: 'views/home_common.html',
            resolve: {
                userLoggedIn: ['$localStorage', function ($localStorage) {
                    return $localStorage.ft_data.userLoggedIn
                }],
                client_config: ['$localStorage', function ($localStorage) {
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
            templateUrl: 'views/myDrivers/driverDetails.html',
			controller: 'driverCommonController',
        })
        .state('masters.driverDetails.profile', {
            url: '/profile',
            templateUrl: 'views/myDrivers/driverProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('driver', 'read')
                }]
            } */
        })
        .state('masters.driverDetails.register', {
            url: '/register',
            templateUrl: 'views/myDrivers/registerDriver.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('driver', 'add')
                }]
            } */
        })
        .state('masters.driverDetails.editProfile', {
            url: '/editProfile',
            templateUrl: 'views/myDrivers/editProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('driver', 'edit')
                }]
            } */
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
            templateUrl: 'views/myRoutes/routeProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('route', 'read')
                }]
            } */
        })
        .state('masters.routeDetails.register', {
            url: '/register',
            templateUrl: 'views/myRoutes/registerRoute.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('route', 'add')
                }]
            } */
        })
        .state('masters.routeDetails.editRoute', {
            url: '/editProfile',
            templateUrl: 'views/myRoutes/routeEditProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('route', 'edit')
                }]
            } */
        })
		.state('masters.routeDetails.routeRates', {
			url: '/vehicleType',
			templateUrl: 'views/myRoutes/routeRates.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('route', 'edit')
                }]
            } */
		})
        .state('masters.routeDetails.routeVehicle', {
            url: '/vehicleType',
            templateUrl: 'views/myRoutes/routeEditVehicleTypes.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('route', 'edit')
                }]
            } */
        })

		.state('masters.routeDetails.tracking', {
			url: '/tracking',
			templateUrl: 'views/myRoutes/tracking.html'
		})
		.state('masters.routeDetails.budgeting', {
			url: '/budgeting',
			templateUrl: 'views/myRoutes/budgeting.html'
		})

		// material management states
		.state('masters.material', {
			url: '/material',
			controller: 'materialController',
			templateUrl: 'views/material/materialHome.html'
		})
		// Vehicle Group
		.state('masters.vehicle', {
			url: '/vehicleGT',
			templateUrl: 'views/vehicle/vehicleGT.html'
		})

        .state('masters.sldoDetails', {
            url: '/sldoDetails',
            templateUrl: 'views/mySLDO/sldoDetails.html'
        })
        .state('masters.sldoDetails.list', {
            url: '/list',
            templateUrl: 'views/mySLDO/sldoProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('sldo', 'read')
                }]
            } */
        })
        .state('masters.sldoDetails.register', {
            url: '/register',
            templateUrl: 'views/mySLDO/registerSLDO.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('sldo', 'add')
                }]
            } */
        })
        .state('masters.sldoDetails.editRoute', {
            url: '/editProfile',
            templateUrl: 'views/mySLDO/sldoEditProfile.html'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('sldo', 'edit')
                }]
            } */
        })
		.state('masters.billingParty', {
            url: '/billingParty',
            templateUrl: 'views/myBillingParty/billingParty.html',
			controller: "myBillingPartyController"
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('sldo', 'edit')
                }]
            } */
        })
		.state('masters.consignorConsignee', {
            url: '/consignorConsignee',
            templateUrl: 'views/myConsignorConsignee/consignorConsignee.html',
		    controller: "myConsignorConsigneeController"
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('sldo', 'edit')
                }]
            } */
        })

		.state('masters.cityState', {
			url: '/cityState',
			templateUrl: 'views/cityState/cityState.html',
			controller: "cityStateController",
			controllerAs: 'vm'
		})

		.state('masters.directory', {
			url: '/directory',
			templateUrl: 'views/directory/directory.html',
			controller: "directoryController",
			controllerAs: 'dVm'
		})

		.state('masters.view', {
			url: '/view',
			templateUrl: 'views/myBillingParty/billingPartyView.html',
			controller: 'billingPartyViewController',
			params: {
				data: null
			}
		})
		.state('masters.view1', {
			url: '/view',
			templateUrl: 'views/myConsignorConsignee/consignorConsigneeView.html',
			controller: 'ConsignorConsigneeViewController',
			params: {
				data: null
			}
        })
        .state('masters.driverCounselling', {
			url: '/driverCounselling',
			templateUrl: 'views/driverCounselling/driverCounsellingAdd.html',
			controller: "driverCounsellingAddController",
        })
        .state('masters.driverCounsellingList', {
			url: '/driverCounsellingList',
			templateUrl: 'views/driverCounselling/driverCounsellingList.html',
            controller: "driverCounsellingListController",

		})


        // Vendor transport
        .state('masters.vendorRegistration', {
            url: '/vendorRegistration',
            templateUrl: 'views/vendor/vendorRegistration.html'
		})
		.state('masters.vendorRegistration.show', {
			url: '/show',
			templateUrl: 'views/vendor/vendorRegistrationShow.html',
			controller: "vendorRegistrationController"
		})
        .state('masters.vendorRegistration.profile', {
            url: '/profile',
            templateUrl: 'views/vendor/vProfile.html',
			controller: "vendorProfileRegController"
        })
		.state('masters.vendorRegistration.profile.basicInfo', {
			url: '/basicInfo',
			templateUrl: 'views/vendor/basicInfo.html'
		})
		.state('masters.vendorRegistration.profile.routes', {
			url: '/routes',
			templateUrl: 'views/vendor/routes.html'
		})
        // .state('masters.vendorRegistration.Register', {
        //     url: '/Register',
        //     templateUrl: 'views/vendor/createVendor.html',
        //     /* resolve: {
        //         access: ['Access', function (Access) {
        //             return Access.hasAccessTo('transportVendor', 'add')
        //         }]
        //     } */
        // })
        // .state('masters.vendorRegistration.update', {
        //     url: '/update',
        //     templateUrl: 'views/vendor/updateVendor.html',
        //     /* resolve: {
        //         access: ['Access', function (Access) {
        //             return Access.hasAccessTo('transportVendor', 'edit')
        //         }]
        //     } */
        // })
        // .state('masters.vendorRegistration.route', {
        //     url: '/route',
        //     templateUrl: 'views/vendor/routeVendor.html'
        // })
        // .state('masters.vendorRegistration.vehicle', {
        //     url: '/vehicle',
        //     templateUrl: 'views/vendor/vehicleVendor.html'
        // })

        // vendor courier states
        .state('masters.vendorCourier', {
            url: '/vendorCourier',
            templateUrl: 'views/vendorCourier/vendorCourierHome.html',
            controller: 'vendorCourierController'
        })
        .state('masters.vendorCourier.add', {
            url: '/add',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierAddController'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('courierVendor', 'add')
                }]
            } */
        })
        .state('masters.vendorCourier.view', {
            url: '/view',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierViewController'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('courierVendor', 'read')
                }]
            } */
        })
        .state('masters.vendorCourier.edit', {
            url: '/edit',
            templateUrl: 'views/vendorCourier/vendorCourierForm.html',
            controller: 'vendorCourierEditController'
			/* resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('courierVendor', 'edit')
                }]
            } */
        })

        // ***by Abhishek ****//
        .state('masters.vendorCourierCommon', {
            url: '/vendorCourierCommon',
            templateUrl: 'views/vendorCourier/vendorcourierCommon.html'
        })
        .state('masters.vendorCourierCommon.profile', {
            url: '/profile',
            templateUrl: 'views/vendorCourier/vendorcourierProfile.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('courierVendor', 'read')
            //     }]
            // }
        })
        .state('masters.vendorCourierCommon.add', {
            url: '/add',
            templateUrl: 'views/vendorCourier/vendorcourierAdd.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('courierVendor', 'add')
            //     }]
            // }
        })
        .state('masters.vendorCourierCommon.addOffices', {
            url: '/addOffices',
            templateUrl: 'views/vendorCourier/vendorcourieraddOffices.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('courierVendor', 'add')
            //     }]
            // }
        })
        .state('masters.vendorCourierCommon.edit', {
            url: '/edit',
            templateUrl: 'views/vendorCourier/vendorcourierEdit.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('courierVendor', 'edit')
            //     }]
            // }
        })
        .state('masters.vendorCourierCommon.editOffices', {
            url: '/editOffices',
            templateUrl: 'views/vendorCourier/vendorcourierEditOffices.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('courierVendor', 'edit')
            //     }]
            // }
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
            controller: 'vendorFuelAddController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'add')
            //     }]
            // }
        })
        .state('masters.vendorFuel.view', {
            url: '/view',
            templateUrl: 'views/vendorFuel/vendorFuelForm.html',
            controller: 'vendorFuelViewController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'read')
            //     }]
            // }
        })
        .state('masters.vendorFuel.edit', {
            url: '/edit',
            templateUrl: 'views/vendorFuel/vendorFuelForm.html',
            controller: 'vendorFuelEditController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'edit')
            //     }]
            // }
        })

        // ***by ajay ****//
        .state('masters.vendorFuelCommon', {
            url: '/vendorFuelCommon',
            templateUrl: 'views/vendorFuel/vendorfuelCommon.html'
        })
        .state('masters.vendorFuelCommon.profile', {
            url: '/profile',
            templateUrl: 'views/vendorFuel/vendorfuelProfile.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'read')
            //     }]
            // }
        })
		.state('masters.vendorFuelCommon.fuelStation', {
            url: '/fuel Station',
            templateUrl: 'views/vendorFuel/vendorfuelStation.html'

        })
        .state('masters.vendorFuelCommon.add', {
            url: '/add',
            templateUrl: 'views/vendorFuel/vendorfuelAdd.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'add')
            //     }]
            // }
        })
        .state('masters.vendorFuelCommon.addStations', {
            url: '/addStations',
            templateUrl: 'views/vendorFuel/vendorfueladdStations.html',
            resolve: {
                access: ['Access', function (Access) {
                    return Access.hasAccessTo('fuelVendor', 'add')
                }]
            }
        })
        .state('masters.vendorFuelCommon.edit', {
            url: '/edit',
            templateUrl: 'views/vendorFuel/vendorfuelEdit.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'edit')
            //     }]
            // }
        })
        .state('masters.vendorFuelCommon.editStations', {
            url: '/editStations',
            templateUrl: 'views/vendorFuel/vendorfuelEditStations.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('fuelVendor', 'edit')
            //     }]
            // }
        })

		.state('masters.customerRateChart', {
			url: '/customerRateChart',
			templateUrl: 'views/customerRateChart/main.html',
			controller: 'customerRateChartController'
		})

		.state('masters.billBook', {
			url: '/billBook',
			templateUrl: 'views/billBook/billBookHome.html',
			controller: 'billBookHomeController',
		})

		.state('masters.billBook.book', {
			url: '/book',
			templateUrl: 'views/billBook/billBook.html',
			controller: 'billBookController',
			controllerAs: 'billBookVm'
		})

		.state('masters.billBook.stationery', {
			url: '/stationery',
			templateUrl: 'views/billBook/stationery.html',
			controller: 'billStationeryController',
			controllerAs: 'StationeryVm'
		})

		.state('masters.incentive', {
			url: '/incentive',
			templateUrl: 'views/incentive/incentiveMain.html',
			controller: 'incentiveController',
			controllerAs: 'incentiveVm'
		})
        .state('masters.dph',{
            url: '/dph',
            templateUrl: 'views/dph/dphMain.html',
            controller: 'dphController',
            controllerAs: 'dphVm'
        })
		.state('masters.configurations', {
			url: '/configurations',
			templateUrl: 'views/schemaConfiguration/confMain.html',
			controller: 'configurationsController',
			controllerAs: 'confVm'
		})
		.state('masters.fpaMasterMain', {
			url: '/fpa-master-main',
			templateUrl: 'views/fpaMaster/fpaMasterMain.html',
			controller: 'fpaMasterMainCtrl',
			controllerAs: 'fpaVm'
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
            controller: 'vendorMaintenanceAddController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('maintenanceVendor', 'add')
            //     }]
            // }
        })
        .state('masters.vendorMaintenance.edit', {
            url: '/edit',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceForm.html',
            controller: 'vendorMaintenanceEditController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('maintenanceVendor', 'edit')
            //     }]
            // }
        })
        .state('masters.vendorMaintenance.view', {
            url: '/view',
            templateUrl: 'views/vendorMaintenance/vendorMaintenanceForm.html',
            controller: 'vendorMaintenanceViewController'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('maintenanceVendor', 'read')
            //     }]
            // }
        })

        .state('masters.customer', {
            url: '/customer',
            templateUrl: 'views/customer/customer.html'
        })
        .state('masters.customer.profile', {
            url: '/profile',
            templateUrl: 'views/customer/profile.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('customer', 'read')
            //     }]
            // }
        })
        .state('masters.customer.register', {
            url: '/register',
            templateUrl: 'views/customer/registerCustomer.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('customer', 'add')
            //     }]
            // }
        })
        .state('masters.customer.editProfile', {
            url: '/editProfile',
            templateUrl: 'views/customer/editProfile.html'
			// resolve: {
            //     access: ['Access', function (Access) {
            //         return Access.hasAccessTo('customer', 'edit')
            //     }]
            // }
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
		.state('masters.customer.document', {
			url: '/document',
			templateUrl: 'views/customer/document.html'
		})
		.state('masters.customer.detention', {
			url: '/detention',
			templateUrl: 'views/customer/detention.html'
		})
		.state('masters.customer.gpsView', {
			url: '/gpsView',
			templateUrl: 'views/customer/gpsView.html'
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
            controllerAs: 'regVm'
        })
		.state('masters.registeredVehicleDetail', {
            url: '/registeredVehicleDetail',
            templateUrl: 'views/myRegisteredVehicle/registeredVehicleDetail.html',
            controller: 'RegisteredVehicleDetailController',
			controllerAs: 'detailVm',
			params: {
				data: null
			}
        })
		.state('masters.registeredVehicleUpsert', {
            url: '/registeredVehicleUpsert',
            templateUrl: 'views/myRegisteredVehicle/registeredVehicleUpsert.html',
            controller: 'RegisteredVehicleUpsertController',
			controllerAs: 'upsertVm',
			params: {
				data: null
			}
        })
		.state('masters.liveTrackPage', {
			url: '/liveTrackPage',
			templateUrl: 'views/myRegisteredVehicle/liveTrackPage.html',
			controllerAs: 'vm'
        })

        .state('masters.liveTrackMap', {
			url: '/liveTrackMap',
			templateUrl: 'views/myRegisteredVehicle/liveTrackMap.html',
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
            templateUrl: 'views/sendTripLoc/trips.html',
			controller: 'getTripLocController'
        })
        .state('masters.trip.getLocInfo', {
            url: '/getTrip',
            templateUrl: 'views/sendTripLoc/getTripLocInfo.html'
        })
        .state('masters.trip.getMap', {
            url: '/getMap/:id',
            templateUrl: 'views/sendTripLoc/editTripLocMAP.html',
			params: {
				id: {squash: true, value: null}
			}
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
    .config(function ($stateProvider) {
        $stateProvider
            .state('booking_manage', {
                url: '/booking_manage',
                templateUrl: 'views/home_common.html',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('booking', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.client_config
                    }]
                },
                controller: 'mastersController'
            })
            .state('booking_manage.bookings', {
                url: '/bookings',
                templateUrl: 'views/myBookings/bookingMain.html'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('bookings', 'read')
                //     }]
                // }
            })
            .state('booking_manage.addorEditBooking', {
                url: '/booking',
                templateUrl: 'views/myBookings/addorEditBooking.html',
                controller: 'addorEditBookingController',
                params: {
                    data: null
                }
            })
            .state('booking_manage.booking', {
                url: '/bookings',
                templateUrl: 'views/bookings/booking.html'
            })
            .state('booking_manage.quotation', {
                url: '/quotation/:id',
                templateUrl: 'views/myBookings/addOrEditQuotation.html',
                controller: 'addOrEditQuotationController',
                params: {
                    data: null
                }
            })

            .state('booking_manage.liveTracker', {
              url: '/liveTracker',
              templateUrl: 'views/myBookings/liveTracker.html',
              controller: 'liveTrackerController'
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
            .state('booking_manage.vehicleAlollcation', {
                url: '/vehicleAllcation',
                templateUrl: 'views/vehicleAllcation/vehicleAllcation.html'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('vehicleAllocation', 'read')
                //     }]
                // }
            })
			.state('booking_manage.vehicleAlollcation.vehicleProvider', {
				url: '/vehicleProvider',
				templateUrl: 'views/vehicleAllcation/vehicleProvider.html'
				// resolve: {
				//     access: ['Access', function (Access) {
				//         return Access.hasAccessTo('vehicleAllocation', 'read')
				//     }]
				// }
			})
			.state('booking_manage.vehicleAlollcation.vehicleDriver', {
				url: '/vehicleDriver',
				templateUrl: 'views/vehicleAllcation/vehicleDriver.html'
				// resolve: {
				//     access: ['Access', function (Access) {
				//         return Access.hasAccessTo('vehicleAllocation', 'read')
				//     }]
				// }
			})
			.state('booking_manage.vehicleAlollcation.bookingList', {
				url: '/bookingList',
				templateUrl: 'views/vehicleAllcation/bookingList.html'
				// resolve: {
				//     access: ['Access', function (Access) {
				//         return Access.hasAccessTo('vehicleAllocation', 'read')
				//     }]
				// }
			})
			.state('booking_manage.vehicleAlollcation.allocate', {
				url: '/allocate',
				templateUrl: 'views/vehicleAllcation/allocate.html'
				// resolve: {
				//     access: ['Access', function (Access) {
				//         return Access.hasAccessTo('vehicleAllocation', 'read')
				//     }]
				// }
			})




            .state('booking_manage.AllcationpopUp', {
                url: '/AllcationpopUp',
                templateUrl: 'views/vehicleAllcation/AllcationpopUp.html',
                params: {
                    data: null
                }
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('vehicleAllocation', 'edit')
                //     }]
                // }
            })
            .state('booking_manage.vendor_vehicle', {
                url: '/vendor_vehicle',
                templateUrl: 'views/vehicleAllcation/vendorVehicleDetail.html',
                controller: 'vendorVehicleDetail',
                params: {
                    data: null
                }
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('vehicleAllocation', 'edit')
                //     }]
                // }
            })
			.state('booking_manage.myGR', {
				url: '/grDetails',
				templateUrl: 'views/myGR/myGRmain.html',
				controller: 'myGRController',
				params: {
					data: null
				}
			})
			.state('booking_manage.grUpsert', {
                url: '/grUpsert',
                templateUrl: 'views/myGR/grUpsert.html',
				params: {
					data: null
				},
				controller: 'grUpserController',
				controllerAs: 'grUVm',
            })
			.state('booking_manage.moneyReceipt', {
				url: '/moneyReceipt',
				templateUrl: 'views/myGR/moneyReceipt.html',
				params: {
					data: null
				},
				controller: 'moneyReceiptController',
				controllerAs: 'grUVm',
            })
            .state('booking_manage.tmMoneyReceipt', {
				url: '/tmMoneyReceipt',
				templateUrl: 'views/myGR/moneyReceiptTripMemo.html',
				params: {
					data: null
				},
				controller: 'moneyReceiptTripMemoController',
				controllerAs: 'grUVm',
			})
            .state('booking_manage.locationUpdate', {
                url: '/locationUpdate',
                templateUrl: 'views/myGR/tripLocationTab.html'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('gr', 'read')
                //     }]
                // }
            })
			.state('booking_manage.coverNote', {
				url: '/coverNote',
				templateUrl: 'views/coverNote/coverNote.html',
				controller: "coverNoteController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.tripSuspense', {
				url: '/tripSuspense',
				templateUrl: 'views/tripSuspense/tripSuspense.html',
				controller: "tripSuspenseCtrl",
				controllerAs: 'vm'
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
                templateUrl: 'views/myDieselSlip/myDieselSlipMain.html'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('diesel', 'read')
                //     }]
                // }
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
                  params: {
                    data: null
                  }
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('trip', 'read')
                //     }]
                // }
            })
            .state('booking_manage.updatemyTrips', {
                url: '/updatemyTrips',
                templateUrl: 'views/myTripsStatus/myTripPopUp.html'
				/*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('trip','read')
                    }]
                }*/
            })
            .state('booking_manage.tripDetailTab', {
                url: '/tripDetailTab',
                templateUrl: 'views/myTripsStatus/tripDetailTab.html'
				/*resolve: {
                 access: ["Access", function(Access) {
                 return Access.hasAccessTo('trip','read')
                 }]
                 }*/
            })
            .state('booking_manage.tripLocationTab', {
                url: '/tripLocationTab',
                templateUrl: 'views/myTripsStatus/tripLocationTab.html'
				/*resolve: {
                 access: ["Access", function(Access) {
                 return Access.hasAccessTo('trip','read')
                 }]
                 }*/
            })
			.state('booking_manage.tripSettlement', {
				url: '/tripSettlement',
				templateUrl: 'views/myTripSettlement/tripSettlement.html',
				controller: "myTripSettlementController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.roundTrip', {
				url: '/roundTrip',
				templateUrl: 'views/myRoundTrip/roundTrip.html',
				controller: "roundTripController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.tripSettlementView', {
				url: '/settleTrip',
				templateUrl: 'views/myTripSettlement/tripSettlementView.html',
				controller: 'tripSettlementViewController',
				controllerAs: 'vm',
				params: {
					data: null
				}
			})
			.state('booking_manage.tripAdvance', {
				url: '/tripAdvance',
				templateUrl: 'views/myTripAdvance/tripAdvance.html',
				controller: "myTripAdvanceController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.TripAddAdvance', {
				url: '/TripAdvanceUpsert',
				templateUrl: 'views/myTripAdvance/tripAdvanceView.html',
				controller: 'TripAdvanceUpsertController',
				controllerAs: 'upsertVm',
				params: {
					data: null
				}
			})
			.state('booking_manage.multiTripPayment', {
				url: '/Trip Payment',
				templateUrl: 'views/myTripAdvance/multiTripPayment.html',
				controller: 'multiTripPaymentController',
				controllerAs: 'mpcVm',
				params: {
					data: null
				}
			})
			.state('booking_manage.driverOnVehicle', {
				url: '/driverOnVehicle',
				templateUrl: 'views/driverOnVehicle/driverOnVehicle.html',
				controller: "driverOnVehicleController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.createTrip', {
				url: '/createTrip',
				templateUrl: 'views/createTrip/createTrip.html',
				controller: "createTripController",
				controllerAs: 'ctVm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.grWithOutTrip', {
				url: '/grWithOutTrip',
				templateUrl: 'views/grWithOutTrip/grWithOutTrip.html',
				controller: "grWithOutTripController",
				controllerAs: 'vm'
				/* resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('sldo', 'edit')
                    }]
                } */
			})
			.state('booking_manage.upsertGrWithOuttrip', {
				url: '/upsertGrWithOuttrip',
				templateUrl: 'views/grWithOutTrip/grWithoutTripUpsert.html',
				params: {
					data: null
				},
				controller: 'upsertGrWithOutTripController',
				controllerAs: 'grUVm',
			})
            .state('booking_manage.myGR_acknowledge', {
                url: '/grAcknowledgeDetails',
                templateUrl: 'views/myGRacknowledge/myGRackMain.html'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('grAcknowledge', 'read')
                //     }]
                // }
            })
            .state('booking_manage.grAckDetails', {
                url: '/grAckDetails',
                templateUrl: 'views/myGRacknowledge/grAckDetails.html'
				/*resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasAccessTo('grAcknowledge', 'read')
                    }]
                }*/
            })
            .state('booking_manage.createGR', {
              url: '/createGR',
              templateUrl: 'views/createGR/createGR.html',
              controller: 'createGRController',
              params: {
                data: null
              }
              /*resolve: {
                          access: ['Access', function (Access) {
                              return Access.hasAccessTo('grAcknowledge', 'read')
                          }]
                      }*/
            })

			.state('booking_manage.incidental', {
				url: '/incidental',
				templateUrl: 'views/incidental/incidental.html',
				controller: 'incidentalController',
				controllerAs: 'incVm',
				params: {
					data: null
				}
				/*resolve: {
                            access: ['Access', function (Access) {
                                return Access.hasAccessTo('grAcknowledge', 'read')
                            }]
                        }*/
			})
			.state('booking_manage.fpa', {
				url: '/fpa',
				templateUrl: 'views/fpa/fpa.html',
				controller: 'fpaController',
				controllerAs: 'fpaVm'
			})
			.state('booking_manage.fpaUpsert', {
				url: '/fpaUpsert',
				templateUrl: 'views/fpa/fpaUpsert.html',
				controller: 'fpaUpsertController',
				controllerAs: 'vm',
				params: {
					data: null
				}
				/*resolve: {
                            access: ['Access', function (Access) {
                                return Access.hasAccessTo('grAcknowledge', 'read')
                            }]
                        }*/
			})
			.state('booking_manage.shipmentTracking', {
				url: '/shipmentTracking',
				templateUrl: 'views/shipmentTracking/shipmentTracking.html',
				controller: 'shipmentTrackingController',
				controllerAs: 'sTVm',
				params: {
					data: null
				}
            })
            .state('booking_manage.vehicleList', {
                url: '/vehicleList',
                templateUrl: 'views/vehicleAccident/vehicleList.html',
				controller: 'vehicleAccidentListController',
                params: {
                    data: null
                }
            })
            .state('booking_manage.vehicleAccident', {
                url: '/vehicleAccident/:id',
                templateUrl: 'views/vehicleAccident/vehicleAccident.html',
				controller: 'vehicleAccidentController',
                params: {
                    id: {value: null}
                }
            })
            .state('booking_manage.tripMemo', {
                url: '/tripMemo',
                templateUrl: 'views/tripMemo/tripMemoList.html',
				controller: 'tripMemoController',
                params: {
                    data: null
                }
            })
            .state('booking_manage.brokerMemo', {
                url: '/brokerMemo',
                templateUrl: 'views/brokerMemo/brokerMemoList.html',
				controller: 'brokerMemoController',
                params: {
                    data: null
                }
            })
			.state('booking_manage.crossDocking', {
                url: '/crossDocking',
                templateUrl: 'views/crossDocking/crossDocking.html',
				controller: 'crossDockingController',
                params: {
                    data: null
                }
            })
            .state('booking_manage.ewayBill', {
                url: '/ewayBill',
                templateUrl: 'views/ewayBill/ewayBillList.html',
				controller: 'ewayBillController',
                params: {
                    data: null
                }
            })
			.state('booking_manage.multiPayment', {
				url: '/multiPaymentReceiptCtrl',
				templateUrl: 'views/tripMemo/multiPaymentReceipt.html',
				controller: 'multiPaymentReceiptCtrl',
				controllerAs: 'mprVm',
				params: {
					data: null
				}
			})
			.state('booking_manage.vehicleExp', {
				url: '/vehicleExp',
				templateUrl: 'views/vehicleExpense/vehicleExp.html',
				controller: 'vehicleExpController',
				controllerAs: 'veVm'
			})
			.state('booking_manage.upsertVehicleExp', {
				url: '/upsertVehicleExp',
				templateUrl: 'views/vehicleExpense/vehicleExpUpsert.html',
				controller: 'upsertVehicleExpCtrl',
				controllerAs: 'veuVM',
				params: {
					data: null
				}
			})

    })

    /***billing management states***/
    .config(function ($stateProvider) {
        $stateProvider
            .state('billing', {
                url: '/billing',
                templateUrl: 'views/home_common.html',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('billing', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.client_config
                    }]
                },
                controller: 'mastersController'
            })
            .state('billing.bills', {
                url: '/bills',
                templateUrl: 'views/bills/bills.html',
				controller: 'billsController',
                reloadOnSearch: true
            })
			.state('billing.previewBill', {
				url: '/previewBill',
				templateUrl: 'views/bills/preViewBill.html',
				params: {
					data: null
				},
				controller: 'previewBillCtrl',
				controllerAs: 'vm'
			})
			.state('billing.previewLoadingReceipt', {
				url: '/previewLoadingReceipt',
				templateUrl: 'views/bills/previewLoadingReceipt.html',
				params: {
					data: null
				},
				controller: 'previewLoadingReceiptCtrl'
			})
            .state('billing.generatedBills', {
                url: '/generatedBills',
                templateUrl: 'views/bills/generatedBills.html',
				controller: "generatedBillsCntrl",
                reloadOnSearch: true
            })
			.state('billing.genBillOBal', {
				url: '/generatedBillOpBal',
				templateUrl: 'views/bills/generatedBillOpBal.html',
				controller: "genOBBillCtrl",
				reloadOnSearch: true
			})
			.state('billing.genBillOBalUpsert', {
				url: '/genBillOpBalUpsert',
				templateUrl: 'views/bills/genBillOBalUpsert.html',
				controller: "genBillOBalUpsert",
				controllerAs: 'vm',
				reloadOnSearch: true,
				params: {
					data: null
				}
			})
			.state('billing.genCrBillOB', {
				url: '/genCrBillOpBal',
				templateUrl: 'views/bills/genCrBillOB.html',
				controller: "genCrBillOBCtrl",
				controllerAs: 'vm',
				reloadOnSearch: true
			})
			.state('billing.genCrBillOBUpsert', {
				url: '/genCrBillOBUpsert',
				templateUrl: 'views/bills/genCrBillOBUpsert.html',
				controller: "genCrBillOBUpsertCtrl",
				controllerAs: 'vm',
				reloadOnSearch: true,
				params: {
					data: null
				}
			})
			.state('billing.printMultipleBill', {
				url: '/printMultipleBill',
				templateUrl: 'views/bills/generateMultiBill.html',
				controller: 'printMultipleBillController',
				controllerAs: 'pmbVm',
				params: {
					data: null
				}
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
                reloadOnSearch: true,
								params: {
									data: null
								}
            })
            .state('billing.billDispatch', {
                url: '/billDispatch',
                templateUrl: 'views/bills/billDispatch.html',
								controller: 'billDispatchController',
                reloadOnSearch: true
            })

			.state('billing.billAcknowledge', {
				url: '/billAcknowledge',
				templateUrl: 'views/bills/billAcknowledge.html',
				controller: 'billAcknowledgeController',
				reloadOnSearch: true
			})

			.state('billing.billSettlement', {
				url: '/billSettlement',
				templateUrl: 'views/bills/billSettlement.html',
				controller: 'billSettlementController',
				controllerAs: 'vm',
				reloadOnSearch: true
			})

			.state('billing.settleSelectedBill', {
				url: '/MoneyReceiptView',
				templateUrl: 'views/bills/billsMoneyReceipt.html',
				controller: 'billsMoneyReceiptController',
				controllerAs: 'vm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.upsertMR', {
				url: '/MoneyReceiptUpsert',
				templateUrl: 'views/bills/billsMoneyReceiptUpsert.html',
				controller: 'billsMoneyReceiptUpsertController',
				controllerAs: 'vm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.upsertBillMR', {
				url: '/billMoneyReceiptUpsert',
				templateUrl: 'views/bills/billWiseMoneyReceiptUpsert.html',
				controller: 'billWiseMoneyReceiptUpsertCtrl',
				controllerAs: 'vm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.creditNote', {
				url: '/credit_note_view',
				templateUrl: 'views/bills/creditNote.html',
				controller: 'creditNoteController',
				controllerAs: 'vm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.creditNoteUpsert', {
				url: '/credit_note',
				templateUrl: 'views/bills/creditNoteUpsert.html',
				controller: 'creditNoteUpsertController',
				controllerAs: 'crNoteVm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
            .state('billing.debitNote', {
				url: '/debit_note_view',
				templateUrl: 'views/bills/debitNote.html',
				controller: 'debitNoteController',
				controllerAs: 'vm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.debitNoteUpsert', {
				url: '/debit_note',
				templateUrl: 'views/bills/debitNoteUpsert.html',
				controller: 'debitNoteUpsertController',
				controllerAs: 'drNoteVm',
				params: {
					data: null
				},
				reloadOnSearch: true
			})
			.state('billing.purchaseBill', {
				url: '/purchase',
				templateUrl: 'views/bills/purchaseBills.html',
				controller: 'purchaseBillController',
				controllerAs: 'pbVm'
			})
			.state('billing.duesBill', {
				url: '/duesBill',
				templateUrl: 'views/accounting/duesBill.html',
				controller: 'duesBillController',
				controllerAs: 'dbVm'
			})
			.state('billing.addBill', {
				url: '/addBill',        //billing/addBill
				templateUrl: 'views/bills/addPurchaseBill.html',
				controller:"addPurchaseBillController",
				controllerAs: 'pbab',
				params: {
					data: null
				}
			})
			.state('billing.genBill', {
				url: '/genBill',
				templateUrl: 'views/bills/genBill.html',
				controller: 'genBillController',
				controllerAs: 'gbVm'
			})
			.state('billing.genBillUpsert', {
				url: '/genBillUpsert',
				templateUrl: 'views/bills/genBillUpsert.html',
				controller:"genBillUpsertCtrl",
				controllerAs: 'gbuVm',
				params: {
					data: null
				}
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
            .state('reports.logreport', {
                url: '/logreport',
                templateUrl: 'views/report/logreport.html',
                controller: "logsReportCntrl",
				controllerAs: 'vm'
            })
    })

    /***reports management states***/
    .config(function ($stateProvider) {
        $stateProvider
            .state('reports', {
                url: '/reports',
                templateUrl: 'views/home_common.html',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('reports', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
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
			.state('reports.purBillRpt', {
				url: '/purBillRpt',
				templateUrl: 'views/report/purBill.report.html',
				controller: 'purBillRptCtrl',
				controllerAs: 'vm',
				reloadOnSearch: true
			})
			.state('reports.fpaReports', {
				url: '/fpaReports',
				templateUrl: 'views/report/fpaReport.html',
				controller: 'fpaReportController',
				controllerAs: 'fpaVm'
            })
            .state('reports.driverReports', {
				url: '/driverReports',
				templateUrl: 'views/report/driverReports.html',
				controller: 'driverReportController',
				controllerAs: 'drVm'
			})
			.state('reports.tripPerformanceReport', {
				url: '/tripPerformanceReport',
				templateUrl: 'views/report/tripPerformanceReport.html',
				controller: "tripPerformanceReportCntrl",
				controllerAs: 'vm'
            })
            .state('reports.dailyKmAnalysis', {
				url: '/dailyKmAnalysis',
				templateUrl: 'views/report/dailyKmAnalysisReport.html',
				controller: "dailyKmAnalysisController",
			})
			.state('reports.settlementReport', {
				url: '/settlementReport',
				templateUrl: 'views/report/settlementReport.html',
				controller: "settlementReportCntrl",
				controllerAs: 'vm'
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
			.state('reports.profitReportGR', {
				url: '/profitReportGR',
				templateUrl: 'views/report/profitReportGR.html',
				controller: 'profitReportGRCtrl',
				reloadOnSearch: true
			})
			.state('reports.hirePaymentRpt', {
				url: '/hirePaymentRpt',
				templateUrl: 'views/report/hirePayment.html',
				controller: 'hirePaymentCtrl',
				controllerAs: 'vm',
				reloadOnSearch: true
			})
			.state('reports.initialProfitReport', {
				url: '/initialProfitReport',
				templateUrl: 'views/report/initialProfitReport.html',
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
			.state('reports.doReport', {
				url: '/doReport',
				templateUrl: 'views/report/doReport.html',
				reloadOnSearch: true
			})
            .state('reports.otherReport', {
                url: '/others',
                templateUrl: 'views/report/otherReport.html',
                reloadOnSearch: true
            })
    })

    /***user management states ***/
    .config(function ($stateProvider) {
        $stateProvider
            .state('usermanage', {
                url: '/usermanage',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('user_management', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
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
			.state('usermanage.view', {
				url: '/view',
				templateUrl: 'views/user/userInfo.html',
				controller: 'userInfoViewController',
				params: {
					data: null
				}
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
                controller: 'departmentAddController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('department', 'add')
                //     }]
                // }
            })
            .state('usermanage.departments.edit', {
                url: '/edit',
                templateUrl: 'views/department/departmentForm.html',
                controller: 'departmentEditController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('department', 'edit')
                //     }]
                // }
            })
            .state('usermanage.departments.view', {
                url: '/view',
                templateUrl: 'views/department/departmentForm.html',
                controller: 'departmentViewController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('department', 'read')
                //     }]
                // }
            })
    })

    /***client management states***/
    .config(function ($stateProvider) {
        $stateProvider
            .state('clients', {
                url: '/clients',
                templateUrl: 'views/home_common.html',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('client_management', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.client_config
                    }]
                },
                controller: 'mastersController'
            })
            .state('clients.clientInfo', {
                url: '/clientInfo',
                templateUrl: 'views/client/clientHome.html',
                resolve: {
                    // access: ['Access', function (Access) {
                    //     return Access.hasAccessTo('client_management', 'read')
                    // }],
                    userLoggedIn: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.userLoggedIn
                    }],
                    client_config: ['$localStorage', function ($localStorage) {
                        return $localStorage.ft_data.client_config
                    }]
                },
                controller: 'clientController'
            })
            .state('clients.clientInfo.view', {
                url: '/view',
                templateUrl: 'views/client/clientForm.html',
                controller: 'clientViewController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('client_management', 'read')
                //     }]
                // }
            })
            .state('clients.clientInfo.add', {
                url: '/add',
                templateUrl: 'views/client/clientForm.html',
                controller: 'clientAddController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('client', 'add')
                //     }]
                // }
            })
            .state('clients.clientInfo.edit', {
                url: '/edit',
                templateUrl: 'views/client/clientForm.html',
                controller: 'clientEditController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('client', 'edit')
                //     }]
                // }
            })
            .state('clients.clientInfo.self', {
                url: '/self',
                templateUrl: 'views/client/clientForm.html',
                controller: 'clientViewController'
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
                controller: 'icdAddController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('icd', 'add')
                //     }]
                // }
            })
            .state('clients.icd.edit', {
                url: '/edit',
                templateUrl: 'views/icds/icdForm.html',
                controller: 'icdEditController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('icd', 'edit')
                //     }]
                // }
            })
            .state('clients.icd.view', {
                url: '/view',
                templateUrl: 'views/icds/icdForm.html',
                controller: 'icdViewController'
				// resolve: {
                //     access: ['Access', function (Access) {
                //         return Access.hasAccessTo('icd', 'read')
                //     }]
                // }
            })
    })

/**************************** GPS MASTER STATES***************************************/
	.config(function ($stateProvider) {
		$stateProvider
			.state('gps_master', {
				url: '/gps_master',
				resolve: {
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				},
				templateUrl: 'views/home_common.html',
				controller: 'mastersController'
			})
			.state('gps_master.gpsInventory', {
				url: '/gpsInventory',
				templateUrl: 'gpsManagement/views/gpsMaster/gpsInventory.html',
				controller: 'gpsInventoryController'
			})
			.state('gps_master.device_slips', {
				url: '/deviceSlips',
				templateUrl: 'gpsManagement/views/gpsMaster/gpsDeviceSlips.html',
				controller: 'gpsDeviceSlipsController'
			})
			.state('gps_master.inventoryInword', {
				url: '/gpsInword',
				templateUrl: 'gpsManagement/views/gpsMaster/inventoryInword.html'
			})
			.state('gps_master.inventoryAllocate', {
				url: '/gpsAllocate',
				templateUrl: 'gpsManagement/views/gpsMaster/inventoryAllocate.html'
			})
            .state('gps_master.inventoryIssue', {
                url: '/gpsIssue',
                templateUrl: 'gpsManagement/views/gpsMaster/inventoryIssue.html',
                controller: 'deviceIssueCtrl'
            })
            .state('gps_master.returnFromSalesExecutive', {
                url: '/returnFromSalesExecutive',
                templateUrl: 'gpsManagement/views/gpsMaster/returnFromSalesExecutive.html',
                controller: 'returnFromSalesExecutiveCtrl'
            })
            .state('gps_master.returnFromCustomer', {
                url: '/returnFromCustomer',
                templateUrl: 'gpsManagement/views/gpsMaster/returnFromCustomer.html',
                controller: 'returnFromCustomerCtrl'
            });
	})

	/*** MRP master states ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('MRP_master', {
				url: '/MRP_master',
				resolve: {
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				},
				templateUrl: 'views/home_common.html',
				controller: 'mastersController'
			})

			.state('MRP_master.customers', {
				url: '/customers',
				templateUrl: 'views/mrp/customers/customers.html'
			})

			.state('MRP_master.customers.profile', {
				url: '/profile',
				templateUrl: 'views/mrp/customers/profile.html'

			})
			.state('MRP_master.customers.register', {
				url: '/register',
				templateUrl: 'views/mrp/customers/register.html'

			})
			.state('MRP_master.customers.editProfile', {
				url: '/editProfile',
				templateUrl: 'views/mrp/customers/editProfile.html'

			})
			.state('MRP_master.customers.document', {
				url: '/document',
				templateUrl: 'views/mrp/customers/document.html'

			})

			// part category config
			.state('MRP_master.partCategory', {
				url: '/partCategory',
				templateUrl: 'views/mrp/partCategory.html',
				controller:"partCategoryController"
			})

			// mrp vendor config
			.state('MRP_master.mrpVendor', {
				url: '/mrpVendor',
				templateUrl: 'views/mrp/mrpVendor.html',
				controller:"maintenanceVendorController_"
			})

			//material in mrp master
			//***** spare parts *****//
			.state('MRP_master.spares', {
				url: '/spares',
				templateUrl: 'views/mrp/spareMaster/spares.html',
			})
			.state('MRP_master.spares.spareList', {
				url: '/spareList',
				templateUrl: 'views/mrp/spareMaster/spareProfile.html',
			})
			.state('MRP_master.spares.register', {
				url: '/register',
				templateUrl: 'views/mrp/spareMaster/spareRegister.html',
			})
			.state('MRP_master.spares.editSpare', {
				url: '/editSpare',
				templateUrl: 'views/mrp/spareMaster/spareEdit.html',
			})



	})

	/*** MRP PO   ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('mrp_pr_po', {
				url: '/mrp_pr_po',
				resolve: {
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				},
				templateUrl: 'views/home_common.html',
				controller: 'mastersController'
			})

			//PR (purchase requisition) config
			.state('mrp_pr_po.pr', {
				url: '/pr',
				templateUrl: 'views/mrp/prPo/pr.html',
				controller:"prController"
			})

			.state('mrp_pr_po.prAdd', {
				url: '/prAdd',
				templateUrl: 'views/mrp/prPo/prAdd.html',
				controller:"prAddController"
			})

			.state('mrp_pr_po.prEdit', {
				url: '/prEdit',
				templateUrl: 'views/mrp/prPo/prEdit.html',
				controller:"prEditController"
			})
			.state('mrp_pr_po.showPR', {
				url: '/showPR',
				templateUrl: 'views/mrp/prPo/showPR.html',
			})

			//PR-PO PO detail
			.state('mrp_pr_po.PrPo', {
				url: '/PrPo',
				templateUrl: 'views/mrp/prPo/PrPo.html',
			})

			.state('mrp_pr_po.POdetail', {
				url: '/POdetail',
				templateUrl: 'views/mrp/prPo/POdetail.html',
				controller:"POdetailController"
			})

			.state('mrp_pr_po.POrelease', {
				url: '/POrelease',
				templateUrl: 'views/mrp/prPo/POrelease.html',
				controller:"POreleaseController"
			})
	})

	/***gps inventory states ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('gps_inventory', {
				url: '/gps_inventory',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				},
				templateUrl: 'views/home_common.html',
				controller: 'mastersController'
			})
			.state('gps_inventory.sim_inventory', {
				url: '/sim_inventory',
				templateUrl: 'views/simInventory/simMain.html',
				controller: 'simController'
			})
			.state('gps_inventory.device_inventory', {
				url: '/device_inventory',
				templateUrl: 'views/sim/simMain.html',
				controller: 'deviceController'
			})
	})

	/***sales order (so) states ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('sales_order', {
				url: '/sales_order',
				templateUrl: 'views/home_common.html',
				controller: 'mastersController',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				}
			})
			.state('sales_order.quotation', {
				url: '/quotation',
				templateUrl: 'views/quotation/quotationMain.html',
				controller: 'quotationController'
			})
			.state('sales_order.quote-so', {
				url: '/quote-so',
				templateUrl: 'views/quotation/quoteToSO.html',
				controller: 'quoteToSOController'
            })
            .state('sales_order.so', {
                url: '/so',
				templateUrl: 'views/quotation/SO.html',
				controller: 'SOController'
            })
            .state('sales_order.generateInvoice', {
                url: '/generateInvoice',
                templateUrl: 'views/quotation/generateInvoice.html',
                controller: 'generateInvoiceController',
                params: {
                    so_id: null
                }
            })
            .state('sales_order.invoice', {
                url: '/invoice',
                templateUrl: 'views/quotation/invoices.html',
                controller: 'invoicesController'
            });
	})

	/*** Accounting Managment ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('accountManagment', {
				url: '/accountManagment',
				templateUrl: 'views/home_common.html',
				controller: 'mastersController',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				}
			})
			.state('accountManagment.accountMaster', {
				url: '/masters',
				templateUrl: 'views/accounting/accountMaster.html',
				controller: 'accountMasterController'
			})
			// .state('accountManagment.upsert', {
			// 	url: '/upsert',
			// 	templateUrl: 'views/accounting/accountMasterUpsert.html',
			// 	controller: 'accountMasterUpsertController',
			// 	params: {
			// 		data: null
			// 	}
			// })
			.state('accountManagment.view', {
				url: '/view',
				templateUrl: 'views/accounting/accountMasterView.html',
				controller: 'accountMasterViewController',
				params: {
					data: null
				}
			})
			.state('accountManagment.voucher', {
				url: '/voucher',
				templateUrl: 'views/bills/voucher.html',
				controller: 'voucherController',
				controllerAs: 'pvVm'
			})
			.state('accountManagment.voucherAdd', {
				url: '/upsertVoucher',
				templateUrl: 'views/bills/addPlainVoucher.html',
				controller: 'addVoucherController',
				controllerAs: 'addpvVm',
				params: {
					data: null
				}
			})
			.state('accountManagment.tdsPayment', {
				url: '/tdsPayment',
				templateUrl: 'views/accounting/tdsPayment.html',
				controller: 'tdsPaymentController',
				controllerAs: 'tdspVm',
			})
			.state('accountManagment.tdsPaymentAdd', {
				url: '/tdsPaymentAdd',
				templateUrl: 'views/accounting/addTdsPayment.html',
				controller: 'addTdsPaymentrController',
				controllerAs: 'addTpVm',
				params: {
					data: null
				}
			})
			.state('accountManagment.tdsReport', {
				url: '/tdsReport',
				templateUrl: 'views/accounting/tdsReport.html',
				controller: 'tdsReportController',
				controllerAs: 'tdsrVm'
			})
			.state('accountManagment.dayBook', {
				url: '/dayBook',
				templateUrl: 'views/accounting/dayBook.html',
				controller: 'dayBookController'
			})
			.state('accountManagment.daywise', {    //accountManagment/Report
				url: '/Report',
				templateUrl: 'views/accounting/dayWiseReport.html',
				controller: 'dayWiseReportController',
				controllerAs: 'dwrVm'
			})
			.state('accountManagment.ledger', {
				url: '/ledger',
				templateUrl: 'views/accounting/ledger.html',
				controller: 'ledgerController'
			})
			.state('accountManagment.bankReconciliation', {
				url: '/bankReconciliationCtrl',
				templateUrl: 'views/accounting/bankReconciliation.html',
				controller: 'bankReconciliationCtrl'
			})
			.state('accountManagment.accountReport', {
				url: '/accountReport',
				templateUrl: 'views/accounting/accountReport.html',
				controller: 'accountReportController'
			})
			.state('accountManagment.accountGSTReport', {
				url: '/GST Report',
				templateUrl: 'views/accounting/accountGSTReport.html',
				controller: 'accountGSTReportController'
			})
			.state('accountManagment.accountTDSReport', {
				url: '/TDS Report',
				templateUrl: 'views/accounting/accountTDSReport.html',
				controller: 'accountTDSReportController'
			})
			.state('accountManagment.gstr-1', {
				url: '/GSTR-1',
				templateUrl: 'views/accounting/gstr-1.html',
				controller: 'accountgstr-1Controller'
            })
			.state('accountManagment.dues', {
				url: '/dues',
				templateUrl: 'views/accounting/dues.html',
				controller: 'duesController',
				controllerAs: 'dsVm'
			})
            .state('accountManagment.duesUpsert', {
				url: '/duesUpsert',
				views: {

					// the main template will be placed here (relatively named)
					'': { templateUrl: 'views/accounting/duesUpsert.html',
						controller: 'duesUpsertController',
						controllerAs: 'duesVm'
					},

					// the child views(otherDues) will be defined here (absolutely named) with separate controller
					'otherDues@accountManagment.duesUpsert': {
						templateUrl: 'views/accounting/duesOtherType.html',
						controller:'otherDuesController',
						controllerAs: 'duesVm'
					},

					// for insuranceDues, we'll define here with separate controller
					'insuranceDues@accountManagment.duesUpsert': {
						templateUrl: 'views/accounting/insuranceDues.html',
						controller: 'insuranceDuesController',
						controllerAs: 'duesVm'
					},

					// for insuranceDues, we'll define here with separate controller
					'permitDues@accountManagment.duesUpsert': {
						templateUrl: 'views/accounting/permitDues.html',
						controller: 'permitDuesController',
						controllerAs: 'duesVm'
					},

					// for emiDues, we'll define here with separate controller
					'emiDues@accountManagment.duesUpsert': {
						templateUrl: 'views/accounting/emiDues.html',
						controller: 'emiDuesController',
						controllerAs: 'duesVm'
					},

					// for CalibrationDues, we'll define here with separate controller
					'calibrationDues@accountManagment.duesUpsert': {
						templateUrl: 'views/accounting/calibrationDues.html',
						controller: 'calibrationDuesController',
						controllerAs: 'duesVm'
					}
				},
				params: {
					data: null
				}
            })

			.state('accountManagment.duesBillUpsert', {
				url: '/duesBillUpsert',
				templateUrl: 'views/accounting/duesBillUpsert.html',
				controller: 'duesBillUpsertController',
				controllerAs: 'dbuVm',
				params: {
					data: null
				}
			})

            .state('accountManagment.openingBalance', {
                url: '/openingBalance',
                templateUrl: 'views/openingBalance/openingBalance.html',
				controller: 'openingBalanceController',
                params: {
                    data: null
                }
            })
			.state('accountManagment.costCategory', {
				url: '/costCategory',
				templateUrl: 'views/costcategory/costCategory.html',
				controller: 'costCategoryController',
				controllerAs: 'ccVm',
				params: {
					data: null
				}
			})
			.state('accountManagment.costCenter', {
				url: '/costCenter',
				templateUrl: 'views/costCenter/costCenter.html',
				controller: 'costCenterController',
				controllerAs: 'ccVm',
				params: {
					data: null
				}
			})
	})
	/*** Alerts & Notification Managment ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('Alerts&Notification', {
				url: '/Alerts&Notification',
				templateUrl: 'views/home_common.html',
				controller: 'mastersController',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				}
			})
			.state('Alerts&Notification.notification', {
				url: '/notification',
				templateUrl: 'views/notifications.html',
				controller: 'notificationController'
			})
	})

	/*** GPS ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('gps', {
				url: '/Gps',
				templateUrl: 'views/home_common.html',
				controller: 'mastersController',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				}
			})
			.state('gps.tracking', {
				url: '/Tracking',
				templateUrl: 'views/gps/tracking/mapView.html',
				controller: 'mapViewController',
				controllerAs: 'mvcVm'
			})
			.state('gps.landmark', {
				url: '/Landmark',
				templateUrl: 'views/gps/tracking/landmark.html',
				controller: 'landmarkController',
				controllerAs: 'lmVm'
			})
			.state('gps.tracking.vehicleDetailView', {
				url: '/vehicleDetail',
				templateUrl: 'views/gps/tracking/vehicleTrack.html',
				controller: 'vehicleTrackController',
				controllerAs: 'vmvVm',
				params: {
					data: null
				}
			})
			.state('gps.dashboard', {
				url: '/Dashboard',
				templateUrl: 'views/gps/tracking/gpsDashboard.html',
				controller: 'gpsDashboardController',
				controllerAs: 'gdcVm'
			})
			.state('gps.moniter', {
				url: '/Moniter',
				templateUrl: 'views/gps/tracking/gpsMoniter.html',
				controller: 'gpsMoniterController',
				controllerAs: 'gMcVm'
			})
			.state('gps.analytic', {
				url: '/Analytic',
				templateUrl: 'views/gps/tracking/gpsAnalytic.html',
				controller: 'gpsAnalyticController',
				controllerAs: 'gAcVm'
			})
			.state('gps.reports', {
				url: '/Reports',
				templateUrl: 'views/gps/tracking/gpsBasicReport.html',
				controller: 'reportsCtrl',
			})
            .state('gps.parkingReport', {
                url: '/parkingReports',
                templateUrl: 'views/gps/tracking/parkingReport.html',
                controller: 'parkingReportCtrl',
                controllerAs: 'prVm'
            })
			.state('gps.historicalTripReport', {
			  url: '/tripHistoryReport',
			  templateUrl: 'views/gps/tracking/tripHistoryReport.html',
			  controller: 'tripHistoryReportCtrl',
			})
            .state('gps.playback', {
                url: '/Playback',
                templateUrl: 'views/gps/tracking/gpsPlayback.html',
                controller: 'playbackCtrl',
            })
            .state('gps.playPosition', {
               	url: '/PlayPosition',
               	templateUrl: 'views/gps/tracking/playPosition.html',
               	controller: 'playPositionCtrl',
               	params: {
               		data: null
               	}
            })
	})


	/*** Dashboard ***/
	.config(function ($stateProvider) {
		$stateProvider
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'views/home_common.html',
				controller: 'mastersController',
				resolve: {
					// access: ['Access', function (Access) {
					//     return Access.hasAccessTo('gps_', 'read')
					// }],
					userLoggedIn: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.userLoggedIn
					}],
					client_config: ['$localStorage', function ($localStorage) {
						return $localStorage.ft_data.client_config
					}]
				}
			})
			.state('dashboard.summary', {
				url: '/summary',
				templateUrl: 'views/dashboard/summary.html',
				controller: 'summaryController',
				controllerAs: 'summary'
			})
			.state('dashboard.detail', {
				url: '/detail',
				templateUrl: 'views/dashboard/detail.html',
				controller: 'dashboardDetailController',
				controllerAs: 'detailVm'
			})
	})

	.run(['$rootScope', 'Access', '$state', 'growlService', 'constants','$localStorage','socketFactory','desktopNotification',
        function ($rootScope, Access, $state, growlService, constants,$localStorage,socketFactory,desktopNotification) {
            $rootScope.headerTitle = '';
            $rootScope.headerSubTitle = '';

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                // console.log("was here in state change error")
                if (error === Access.UNAUTHORIZED) {
                    growlService.growl('Your access is unauthorized. Please login again', 'danger');
                    $state.go('login')
                } else if (error === Access.FORBIDDEN) {
                    growlService.growl('Access to this app is forbidden. Please contact your' +
                        ' IT administrator', 'danger')
                }
            });

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    // console.log(toState.name)
                    switch (toState.name) {
                        case 'masters.branch':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['branch'];
                            break;
                        case 'masters.driverDetails.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['driver'];
                            break;
                        case 'masters.registeredVehicle':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['registeredVehicle'];
                            break;
						case 'masters.liveTrackPage':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['liveTrackPage'];
							break;
                        case 'masters.routeDetails.allRoutes':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['route'];
                            break;
                        case 'masters.sldoDetails.list':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['sldo'];
                            break;
                        case 'masters.vendorRegistration.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['transportVendor'];
                            break;
                        case 'masters.vendorMaintenance':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['maintenanceVendor'];
                            break;
                        case 'masters.vendorCourierCommon.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['courierVendor'];
                            break;
                        case 'masters.vendorFuelCommon.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['fuelVendor'];
                            break;
                        case 'masters.customer.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['customer'];
                            break;
						case 'MRP_master.customers.profile':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['customers'];
							break;
                        case 'masters.vehicle.profile':
                            $rootScope.headerTitle = constants.app_key_desc_pair['masters'];
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['regvehicle'];
                            break;
                        case 'masters.driverCounsellingList':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['driverCounsellingList'];
                            break;
                        case 'booking_manage.bookings':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['bookings'];
                            break;
						case 'booking_manage.shipmentTracking':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['shipmentTracking'];
							break;
                        case 'booking_manage.vehicleAlollcation':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicleAllocation'];
                            break;
                        case 'booking_manage.myGR':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['gr'];
                            break;
                        case 'booking_manage.locationUpdate':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['locationUpdate'];
                            break;
                        case 'booking_manage.myDiesel':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['diesel'];
                            break;
                        case 'booking_manage.myTrips':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['trip'];
                            break;
						case 'booking_manage.tripAdvance':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['Advance'];
							break;
						case 'booking_manage.tripSettlement':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['Settlement'];
							break;
                        case 'booking_manage.updatemyTrips':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['trip'];
                            break;
                        case 'booking_manage.myGR_acknowledge':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['grAcknowledge'];
                            break;
                        case 'booking_manage.grAckDetails':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['grAckDetails'];
                            break;
                        case 'booking_manage.vehicleAccident':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicleAccident'];
                            break;
                        case 'billing.bills':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['boewise'];
                            break;
                        /*case "billing.bills":
                            $rootScope.headerTitle = ""
                            $rootScope.headerSubTitle = constants.app_key_desc_pair["savePrintBill"]
                            break;*/
                        case 'billing.tripExpenseDetail':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['tripExpenseDetail'];
                            break;
                        case 'billing.tripExpense':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['tripExpense'];
                            break;
                        case 'gps.parkingReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['parkingReport'];
                            break;
                        case 'reports.bookingReports':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['bookingReports'];
                            break;
                        case 'reports.logreport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['logreport'];
                            break;
                        case 'reports.billReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['billReport'];
                            break;
                        case 'billing.billDispatch':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['billDispatch'];
                            break;
                        case 'reports.billDispatchReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['billDispatchReport'];
                            break;
                        case 'reports.costingReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['costing'];
                            break;
                        case 'reports.profitReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['profit'];
                            break;
						case 'reports.initialProfitReport':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['initialProfit'];
							break;
                        case 'reports.tripReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['trip'];
                            break;
                        case 'reports.vehicleReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicle'];
                            break;
						case 'reports.fleetOwnerReport':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['fleetOwner'];
							break;
                        case 'reports.otherReport':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['others'];
                            break;
                        case 'billing.customerPayment':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['customerPayment'];
                            break;
                        case 'billing.vendorPayment':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['vendorPayment'];
                            break;
                        case 'usermanage.users':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['user'];
                            break;
                        case 'usermanage.department':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['department'];
                            break;
                        case 'usermanage.role':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['role'];
                            break;
                        case 'clients.clientInfo':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['client'];
                            break;
                        case 'clients.material':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['material'];
                            break;
                        case 'clients.vehicle':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['vehicle'];
                            break;
                        case 'clients.icd':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['icd'];
                            break;
						case 'gps_master.device_type_master':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['device_type_master'];
							break;
						case 'gps_master.device_master':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['device_master'];
							break;
						case 'gps_master.sim_master':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['sim_master'];
							break;
						case 'sales_order.quotation':
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair['quotation'];
                            break;
                        case 'sales_order.quote-so':
						    $rootScope.headerTitle = '';
						    $rootScope.headerSubTitle = constants.app_key_desc_pair['quote-so'];
                            break;
                        case 'sales_order.so':
						    $rootScope.headerTitle = '';
						    $rootScope.headerSubTitle = constants.app_key_desc_pair['so'];
                            break;
                        case 'sales_order.generateInvoice':
                            $rootScope.headerTitle = '';
						    $rootScope.headerSubTitle = constants.app_key_desc_pair['so_invoice'];
                            break;
                        case 'sales_order.invoice':
                            $rootScope.headerTitle = '';
                            $rootScope.headerSubTitle = constants.app_key_desc_pair['so_invoice'];
                            break;
						case "MRP_master.partCategory":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["partCategory"];
							break;
						case "MRP_master.mrpVendor":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["mrpVendor"];
							break;
						case "MRP_master.spares.spareList":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["spareList"];
							break;
						case "mrp_pr_po.pr":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["pr"];
							break;
						case "mrp_pr_po.prAdd":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["prAdd"];
							break;
						case "mrp_pr_po.PrPo":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["PrPo"];
							break;
						case "mrp_pr_po.POdetail":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["POdetail"];
							break;
						case "mrp_pr_po.POrelease":
							$rootScope.headerTitle = '';
							$rootScope.headerSubTitle = constants.app_key_desc_pair["POrelease"];
							break;
                    }
                })

			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams){
					function callSocket() {
						try {
							socketFactory.connect($localStorage.ft_data.userLoggedIn.userId);
						}catch (e) {
							console.log("User not logged in: "+JSON.stringify(e));
						}
					}
					switch (toState.name){
						case "login":
							return;
						case "home":
							return;
						default:
							callSocket()
					}
				})
        }
    ]);
