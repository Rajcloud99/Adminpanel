/**
 * Created by Ajay on 22/12/16.
 */
materialAdmin.config(function($stateProvider) {

        $stateProvider
            .state('maintenance', {
                url: '/maintenance',
                templateUrl: 'views/home_common.html',
                resolve: {
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })
            .state('maintenance.brands', {
                url: '/brands',
                templateUrl: 'maintenance/views/brands.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_maintenance','read');
                    }]
                }*/
            })
            .state('maintenance.brands.brandList', {
                url: '/brandList',
                templateUrl: 'maintenance/views/brandProfile.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('brands','add');
                    }]
                }*/
            })
            .state('maintenance.brands.register', {
                url: '/register',
                templateUrl: 'maintenance/views/brandRegister.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('brands','add');
                    }]
                }*/
            })
            .state('maintenance.brands.editBrand', {
                url: '/editBrand',
                templateUrl: 'maintenance/views/brandEdit.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('brand','edit');
                    }]
                }*/
            })

            //***** modal *****//
            .state('maintenance.models', {
                url: '/models',
                templateUrl: 'maintenance/views/models/models.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_maintenance','read');
                    }]
                }*/
            })
            .state('maintenance.models.modelList', {
                url: '/modelList',
                templateUrl: 'maintenance/views/models/modelProfile.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('models','add');
                    }]
                }*/
            })
            .state('maintenance.models.register', {
                url: '/register',
                templateUrl: 'maintenance/views/models/modelRegister.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('models','add');
                    }]
                }*/
            })
            .state('maintenance.models.editModel', {
                url: '/editModel',
                templateUrl: 'maintenance/views/models/modelEdit.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('models','edit');
                    }]
                }*/
            })

            .state('maintenance.manufacturer', {
                url: '/manufacturer',
                templateUrl: 'maintenance/views/manufacturer.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('manufacturer','read');
                    }]
                },*/
                controller:"manufacturerController"
            })

            .state('maintenance.mechanic', {
                url: '/mechanic',
                templateUrl: 'maintenance/views/mechanic.html',
                controller:"mechanicController"
            })

            .state('maintenance.contractor', {
                url: '/contractor',
                templateUrl: 'maintenance/views/contractor.html',
                controller:"contractorController"
            })

            .state('maintenance.hom', {
                url: '/hom',
                templateUrl: 'maintenance/views/hom.html',
                controller:"homController"
            })

            .state('maintenance.taskMaster', {
                url: '/taskMaster',
                templateUrl: 'maintenance/views/taskMaster.html',
                controller:"taskMasterController"
            })

            .state('maintenance_inventory', {
                url: '/maintenance_inventory',
                templateUrl: 'views/home_common.html',
                resolve: {
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })

            .state('maintenance_inventory.inventory', {
                url: '/inventory',
                templateUrl: 'maintenance/views/inventory.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                },*/
                controller:"inventoryController"
            })
            .state('maintenance_inventory.aggreInventory', {
                url: '/aggreInventory',
                templateUrl: 'maintenance/views/aggreInventory.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                },*/
                controller:"aggreInventoryController"
            })
            .state('maintenance_inventory.toolMaster', {
                url: '/tools',
                templateUrl: 'maintenance/views/tools/toolMaster.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_maintenance','read');
                    }]
                },*/
                controller:"toolMasterController"
            })

            .state('maintenance_inventory.toolInward', {
                url: '/toolInward',
                templateUrl: 'maintenance/views/tools/toolInward.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                }*/
            })
            .state('maintenance_inventory.spareIssue', {
                url: '/spareIssue',
                templateUrl: 'maintenance/views/spareMaster/spareIssue.html',
            })
            .state('maintenance_inventory.returnSpare', {
                url: '/returnSpare',
                templateUrl: 'maintenance/views/spareMaster/returnSpare.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                }*/
            })
            .state('maintenance_inventory.inventoryInword', {
                url: '/inventoryInword',
                templateUrl: 'maintenance/views/spareMaster/inventoryInword.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                }*/
            })

            .state('maintenance_inventory.printSlips', {
                url: '/printSlips',
                templateUrl: 'maintenance/views/printSlips.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                },*/
                controller:"printSlipsController"
            })

            .state('maintenance_inventory.dieselMaintenance', {
                url: '/dieselMaintenance',
                templateUrl: 'maintenance/views/dieselMaintenance/dieselMaintenance.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                },*/
                controller:"dieselMaintenanceController"
            })

            .state('maintenance_inventory.dieselIn', {
                url: '/dieselIn',
                templateUrl: 'maintenance/views/dieselMaintenance/dieselIn.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_inventory','read');
                    }]
                },*/
                controller:"dieselInCtrl"
            })

            .state('maintenance.otherExpenses', {
                url: '/otherExpenses',
                templateUrl: 'maintenance/views/otherExpenses.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_maintenance','read');
                    }]
                },*/
                controller:"otherExpensesController"
            })

            .state('maintenance_reports', {
                url: '/maintenance_reports',
                templateUrl: 'views/home_common.html',
                resolve: {
                    /*access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }],*/
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })

            .state('maintenance_reports.spareInventory', {
                url: '/spareInventory',
                templateUrl: 'maintenance/views/reports/spareInventory.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"spareInvReportController"
            })

            .state('maintenance_reports.spareInventoryInward', {
                url: '/spareInventoryInward',
                templateUrl: 'maintenance/views/reports/spareInventoryInward.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"spareInvInwardReportController"
            })
			.state('maintenance_reports.inventorySnapshot', {
				url: '/inventorySnapshot',
				templateUrl: 'maintenance/views/reports/inventorySnapshot.html',
				/*resolve: {
					access: ["Access", function(Access) {
						return Access.hasAccessTo('maintenance_reports','read');
					}]
				},*/
				controller:"inventorySnapshotController"
			})

            .state('maintenance_reports.JobCardReports', {
                url: '/JobCardReports',
                templateUrl: 'maintenance/views/reports/JobCardReports.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"jobCardReportController"
            })

            .state('maintenance_reports.JobCardTaskReports', {
                url: '/JobCardTaskReports',
                templateUrl: 'maintenance/views/reports/JobCardTaskReports.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"jobCardTaskReportController"
            })

            .state('maintenance_reports.toolReports', {
                url: '/toolReports',
                templateUrl: 'maintenance/views/reports/toolReports.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"toolReportsController"
            })

            .state('maintenance_reports.toolIssueReport', {
                url: '/toolIssueReport',
                templateUrl: 'maintenance/views/reports/toolIssueReport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"toolIssueReportController"
            })

            .state('maintenance_reports.contractorExpenseReport', {
                url: '/contractorExpenseReport',
                templateUrl: 'maintenance/views/reports/contractorExpenseReports.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"contractorExpenseReportController"
            })

            .state('maintenance_reports.PRreport', {
                url: '/PRreport',
                templateUrl: 'maintenance/views/reports/PRreport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"PRreportController"
            })

            .state('maintenance_reports.expenseReport', {
                url: '/expenseReport',
                templateUrl: 'maintenance/views/reports/expenseReport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_reports','read');
                    }]
                },*/
                controller:"expenseReportController"
            })
			.state('maintenance_reports.spareConsumption', {
				url: '/spareConsumption',
				templateUrl: 'maintenance/views/reports/spareConsumptionReport.html',
				/*resolve: {
					access: ["Access", function(Access) {
						return Access.hasAccessTo('maintenance_reports','read');
					}]
				},*/
				controller:"spareConsumptionReportController"
			})
			.state('maintenance_reports.combinedExpense', {
				url: '/combinedExpense',
				templateUrl: 'maintenance/views/reports/combinedExpense.html',
				/* resolve: {
					access: ["Access", function(Access) {
						return Access.hasAccessTo('maintenance_reports','read');
					}]
				}, */
				controller:"combinedExpenseReportController"
			})



            .state('maintenance_MRP', {
                url: '/maintenance_MRP',
                templateUrl: 'views/home_common.html',
                resolve: {
                    /*access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_MRP','read');
                    }],*/
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })



            .state('maintenance_process', {
                url: '/maintenance_process',
                templateUrl: 'views/home_common.html',
                resolve: {
                    /*access: ["Access", function(Access) {
                        return Access.hasAccessTo('maintenance_process','read');
                    }],*/
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })

            .state('maintenance_process.jobCardMain', {
                url: '/jobCardMain',
                templateUrl: 'maintenance/views/jobCard/jobCardMain.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('jobCard','read');
                    }]
                }*/
            })
            .state('maintenance_process.addJobCard', {
                url: '/addJobCard',
                templateUrl: 'maintenance/views/jobCard/addJobCard.html'
            })
            .state('maintenance_process.jcdPopup', {
                url: '/jcdPopup',
                templateUrl: 'maintenance/views/jobCard/jcdPopup.html'
            })
            .state('maintenance_process.addContractorExpenses', {
                url: '/addContractorExpenses',
                templateUrl: 'maintenance/views/jobCard/addContractorExpenses.html'
            })
            .state('maintenance_process.jobCard', {
                url: '/jobCard',
                templateUrl: 'maintenance/views/jobCard/jobCard.html'
            })
            .state('maintenance_process.addService', {
                url: '/addService',
                templateUrl: 'maintenance/views/jobCard/addService.html'
            })
            .state('maintenance_process.editService', {
                url: '/editService',
                templateUrl: 'maintenance/views/jobCard/editService.html'
            })
            .state('maintenance_process.jobCard.basic', {
                url: '/addjobCard',
                templateUrl: 'maintenance/views/jobCard/addJobCard.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('jobCard','add');
                    }]
                }*/
            })
            .state('maintenance_process.jobCard.task', {
                url: '/addjobCardTask',
                templateUrl: 'maintenance/views/jobCard/addjobCardTask.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('jobCard','add');
                    }]
                }*/
            })

            .state('maintenance_process.updateJobCard', {
                url: '/updateJobCard',
                templateUrl: 'maintenance/views/jobCard/updateFullJobCard.html'
            })
            .state('maintenance_process.updateJobCard.basic', {
                url: '/updateJobCardBasic',
                templateUrl: 'maintenance/views/jobCard/updateJobCardBasic.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('jobCard','edit');
                    }]
                }*/
            })
            .state('maintenance_process.updateJobCard.task', {
                url: '/updateJobCardTask',
                templateUrl: 'maintenance/views/jobCard/updateJobCardTask.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('jobCard','edit');
                    }]
                }*/
            })

            .state('masters_tyre_management', {
                url: '/mastersTyreManagement',
                templateUrl: 'views/home_common.html',
                resolve: {
                    /*access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_tyre_management','read');
                    }],*/
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })

            .state('masters_tyre_management.tyre_master', {
                url: '/tyreMaster',
                templateUrl: 'maintenance/views/tyreMaster.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyre_master','edit');
                    }]
                },*/
                controller:"tyreMasterController"
            })

            .state('masters_tyre_management.tyre_detail', {
                url: '/tyreDetail',
                templateUrl: 'maintenance/views/tyreDetail.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyre_master','edit');
                    }]
                },*/
                controller:"tyreDetailController"
            })
            .state('masters_tyre_management.tyreInward', {
                url: '/tyreInward',
                templateUrl: 'maintenance/views/tyreInward.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyre_master','edit');
                    }]
                }*/
            })
            .state('masters_tyre_management.tyreIssue', {
                url: '/tyreIssue',
                templateUrl: 'maintenance/views/tyreIssue.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyre_master','edit');
                    }]
                }*/
            })
            .state('masters_tyre_management.retreated', {
                url: '/retreated',
                templateUrl: 'maintenance/views/retreated.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyre_master','edit');
                    }]
                }*/
            })
            .state('masters_tyre_management.trailer_master', {
                url: '/trailerMaster',
                templateUrl: 'maintenance/views/trailerMaster.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('trailer_master','edit');
                    }]
                },*/
                controller:"trailerMasterController"
            })
            .state('masters_tyre_management.structureMaster', {
                url: '/structureMaster',
                templateUrl: 'maintenance/views/structureMaster.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('structure_master','read');
                    }]
                },*/
                controller:"structureMasterController"
            })
            .state('masters_tyre_management.prime_mover_trailer_association', {
                url: '/primeMoverTrailerAssociation',
                templateUrl: 'maintenance/views/primeMoverTrailerAssociation.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('prime_mover_trailer_association','read');
                    }]
                },*/
                controller:"primeMoverTrailerAssociationController"
            })


            .state('masters_tyre_reports', {
                url: '/mastersTyreReports',
                templateUrl: 'views/home_common.html',
                resolve: {
                    /*access: ["Access", function(Access) {
                        return Access.hasAccessTo('masters_tyre_reports','read');
                    }],*/
                    userLoggedIn: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.userLoggedIn;
                    }],
                    client_config: ["$localStorage", function($localStorage) {
                        return $localStorage.ft_data.client_config;
                    }]
                },
                controller: 'mastersController'
            })

            .state('masters_tyre_reports.tyreRetreatReport', {
                url: '/tyreRetreatReport',
                templateUrl: 'maintenance/views/reports/tyreRetreatReport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyreRetreatReport','read');
                    }]
                },*/
                controller:"tyreRetreatReportController"
            })

            .state('masters_tyre_reports.tyreReports', {
                url: '/tyreReports',
                templateUrl: 'maintenance/views/reports/tyreReports.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyreRetreatReport','read');
                    }]
                },*/
                controller:"tyreReportsController"
            })

            .state('masters_tyre_reports.tyreIssueReport', {
                url: '/tyreIssueReport',
                templateUrl: 'maintenance/views/reports/tyreIssueReport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyreRetreatReport','read');
                    }]
                },*/
                controller:"tyreIssueReportController"
            })
            .state('masters_tyre_reports.primeTrailerAssoReport', {
                url: '/primeTrailerAssoReport',
                templateUrl: 'maintenance/views/reports/primeTrailerAssoReport.html',
                /*resolve: {
                    access: ["Access", function(Access) {
                        return Access.hasAccessTo('tyreRetreatReport','read');
                    }]
                },*/
                controller:"primeTrailerAssoReportController"
            })

})
.run(["$rootScope", "Access", "$state", "growlService", "constants",
    function($rootScope, Access, $state, growlService, constants) {
        $rootScope.headerTitle = constants.app_key_desc_pair["masters_maintenance"];
        $rootScope.headerSubTitle = "";

        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            console.log("was here in state change error");
            if (error == Access.UNAUTHORIZED) {
                growlService.growl("Your access is unauthorized. Please login again", "danger");
                $state.go("login");
            } else if (error == Access.FORBIDDEN) {
                growlService.growl("Access to this app is forbidden. Please contact your" +
                    " IT administrator ", "danger");
            }
        });

		$rootScope.$on('$locationChangeSuccess', function() {
			//this function triggers when state is successfully changed
		});

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){

				// TODO Common filter UI
				// its currently under development phase
				$rootScope.$broadcast('resetFilter');

                console.log(toState.name);
                switch(toState.name){
                    case "masters_maintenance.brand":
                        $rootScope.headerTitle = constants.app_key_desc_pair["masters"];
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["branch"];
                        break;
                    case "maintenance.mechanic":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["mechanic"];
                        break;
                    case "maintenance.contractor":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["contractor"];
                        break;
                    case "maintenance.taskMaster":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["taskMaster"];
                        break;


                    case "maintenance_inventory.inventory":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["inventory"];
                        break;
                    case "maintenance_inventory.aggreInventory":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["aggreInventory"];
                        break;
                    case "maintenance_inventory.toolMaster":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["toolMaster"];
                        break;
                    case "maintenance.otherExpenses":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["otherExpenses"];
                        break;
                    case "maintenance_inventory.printSlips":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["printSlips"];
                        break;
                    case "maintenance_process.jobCardMain":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["jobCard"];
                        break;
                    case "masters_maintenance.taskMaster":
                        $rootScope.headerTitle = constants.app_key_desc_pair["masters_maintenance"];
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["taskMaster"];
                        break;
                    case "masters_tyre_management.tyre_master":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["tyre_master"];
                        break;
                    case "masters_tyre_management.trailer_master":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["trailer_master"];
                        break;
                    case "masters_tyre_management.structureMaster":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["structure_master"];
                        break;
                    case "masters_tyre_management.prime_mover_trailer_association":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["prime_mover_trailer_association"];
                        break;
                    case "masters_tyre_management.retreated":
                        $rootScope.headerTitle = '';
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["retreated"];
                        break;
                    case "maintenance_reports.spareInventory":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["spareInventory"];
                        break;
                    case "maintenance_reports.spareInventoryInward":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["spareInventoryInward"];
                        break;
                    case "maintenance_reports.JobCardReports":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["JobCardReports"];
                        break;
                    case "maintenance_reports.JobCardTaskReports":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["JobCardTaskReports"];
                        break;
                    case "maintenance_reports.toolReports":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["toolReports"];
                        break;
                    case "maintenance_reports.toolIssueReport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["toolIssueReport"];
                        break;
                    case "masters_tyre_reports.tyreReports":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["tyreReports"];
                        break;
                    case "masters_tyre_reports.tyreIssueReport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["tyreIssueReport"];
                        break;
                    case "masters_tyre_reports.tyreRetreatReport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["tyreRetreatReport"];
                        break;
                    case "masters_tyre_reports.primeTrailerAssoReport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["primeTrailerAssoReport"];
                        break;
                    case "masters_tyre_reports.contractorExpenseReport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["contractorExpenseReport"];
                        break;
                    case "maintenance_reports.PRreport":
                        $rootScope.headerTitle = "";
                        $rootScope.headerSubTitle = constants.app_key_desc_pair["PRreport"];
                        break;
                }
            });
    }])
.config([
	'$httpProvider',
	function(
		$httpProvider
	) {
		$httpProvider.defaults.timeout = 900000;  // 15 * 60 * 1000
	}]);
