/**
 * Created by manish on 23/05/18.
 */
materialAdmin.config(function($stateProvider) {

	let reportHome =  {
		name : 'reportsMRP',
		url: '/reports_mrp',
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
	};

	let quotationReport =  {
		name : 'reportsMRP.quotationReport',
		url: '/quotation_report',
		templateUrl: 'views/mrp/reports/quotationReport.html',
		controller: 'quotationReportController'
	};

	let soReport =  {
		name : 'reportsMRP.soReport',
		url: '/so',
		templateUrl: 'views/mrp/reports/soReport.html',
		controller: 'soReportController'
	};

	let invoiceReport =  {
		name : 'reportsMRP.invoiceReport',
		url: '/invoice_report',
		templateUrl: 'views/mrp/reports/invoiceReport.html',
		controller: 'invoiceReportController'
	};

	let poReport =  {
		name : 'reportsMRP.poReport',
		url: '/so',
		templateUrl: 'views/mrp/reports/poReports.html',
		controller: 'poReportController'
	};

	$stateProvider
		.state(reportHome)
		.state(quotationReport)
		.state(soReport)
		.state(invoiceReport)

})
	.run(["$rootScope", "Access", "$state", "growlService", "constants",
		function($rootScope, Access, $state, growlService, constants) {
			$rootScope.headerTitle = constants.app_key_desc_pair["masters_maintenance"];
			$rootScope.headerSubTitle = "";

			$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
				if (error === Access.UNAUTHORIZED) {
					growlService.growl("Your access is unauthorized. Please login again", "danger");
					$state.go("login");
				} else if (error === Access.FORBIDDEN) {
					growlService.growl("Access to this app is forbidden. Please contact your IT administrator ", "danger");
				}
			});

			$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){

					console.log(toState.name);
					switch(toState.name){
						case "reportsMRP.quotationReport":
							$rootScope.headerSubTitle = constants.app_key_desc_pair["quotation_report"];
							break;
						case "reportsMRP.soReport":
							$rootScope.headerSubTitle = constants.app_key_desc_pair["so_report"];
							break;
						case "reportsMRP.invoiceReport":
							$rootScope.headerSubTitle = constants.app_key_desc_pair["invoice_report_so"];
							break;
					}
				});
		}]);
