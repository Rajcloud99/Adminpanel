/**
 * Created by manish on 8/8/16.
 */
materialAdmin.service('loginService',
    ['$rootScope', '$localStorage', '$state', 'HTTPConnection', 'socketio', 'URL', 'clientChange', 'sharedResource',
        function($rootScope, $localStorage, $state, HTTPConnection, socketio, URL, clientChange, sharedResource) {

            this.authenticate = function(objLogin, success,failure) {
                var parseSuccessResp = function(data){
                    success(data.data);
                };
                var parseFailureResp = function(data){
                    failure(data.data);
                };
                HTTPConnection.post(URL.LOGIN, objLogin, parseSuccessResp, parseFailureResp);
            };

			this.loginServer = function(objLogin, success, failure) {
				// /dummy widget////
				let appwidgets = {
					'Logistics': {
						'Masters': ['Branch', 'All Vendor','Driver', 'Fleet', 'Vehicle', 'Registered Vehicle', 'Transport Route', 'Material', 'Customer','Billing Party','Consignor Consignee', 'City State','GR Master', 'Trip Location', 'Courier Vendor', 'Fuel Vendor', 'Rate Chart', 'Incentive','DPH', 'Stationery', 'Configurations', 'FPA Master', 'SLDO', 'Directory', 'Driver Counselling'],
						//'Masters': ['Registered Vehicle', 'GR Masters', 'SLDO', 'Bookings'],
						///'Manage': ['Bookings', 'Department', 'GR Masters']
						'Booking Management': ['Bookings', 'Vehicle Allocation','Create Trip', 'Trip', 'Trip Performance','Trip Settlement', 'Round Trip', 'Trip Advance','Driver And Vehicle Association', 'GR', 'GR WithOut Trip', 'Shipment Tracking', 'Cover Note', 'Diesels', 'GR Acknowledge', 'Create GR', 'Live Tracker','Incidental Expense', 'FPA Gr', 'Vehicle Accident', 'Trip Memo', 'Broker Memo','Cross Docking','Eway Bill', 'Vehicle Expense'],
						'Tracking': ['Map View', 'GPS Dashboard', 'GPS Moniter', 'Analytics', 'GPS Reports', 'Parking Reports', 'Historical Trip Report','Landmark','Playback'],
						'Billing Management': ['Unbilled Gr', 'Generated Bills', 'Gen Multi Debitor Bill', 'Gen Multi Creditor Bill', 'Bill Dispatch', 'Bill Acknowledge', 'Bill Settlement', 'Trip Expense', 'Customer Payment', 'Vendor Payment', 'Purchase Bill', 'Dues Bill', 'Money Receipt', 'Credit Note', 'Debit Note', 'Sales Invoice'],
						'Reports': ['Booking Report', 'GR Report', 'FPA Report', 'Driver Reports','Trip Performance Report', 'Daily KM Analysis', 'Settlement Report', 'Unbilled Report', 'Billing Report', 'Costing Report', 'Profit Report', 'Profit Report - GR', 'Initial Profit Report', 'Trip Report', 'Hire Payment Report', 'Vehicle Report', 'Fleet Owner Report', 'Diesel Escalation', 'DO', "Purchase Bill Report", 'Others'],
						'Logs': ['Log Report']
					},
					'Accounting': {
						'Accounting And Taxation': ['Account Master', 'Voucher',/*'DayBook',*/ 'Reports', 'Ledger', 'Bank Reconciliation', 'Account Report', 'GST Report', 'TDS Report', 'GSTR-1','Dues', 'TDS Reports', 'Direct Op Balance', 'Cost Category', 'Cost Center']
					},
					'Dashboard': {
						'Dashboard': ['Summary', 'Detail']
					},
					'Material Resource Planning': {
						'MRP Master': ['Customers', 'Category', 'Vendor', 'Materials'],
						'PO': ['PR', 'PR-PO', 'PO Detail', 'PO Release'],
						'SO': ['Quotation', 'Quote to SO', 'SO', 'SO Invoice'],
						'Reports': ['Quotation Report', 'SO Report', 'Invoice Report (SO)']
					},
					'Maintenance': {
						'Maintenance Masters': ['Mechanic', 'Contractor', 'Task Master', 'Expenses'],
						'Job Cards': ['Job Cards'],
						'Maintenance Inventory': ['Inventory', 'Aggregated Inventory', 'Tools', 'Spare Slips', 'Diesel'],
						//'Maintenance MRP': ['PR', 'PR-PO', 'PO Detail', 'PO Release'],
						'Maintenance Reports': ['Spare Inventory', 'Spare Inventory Inward', 'Inventory Snapshot', 'Job Card', 'Job Card Task', 'Tool', 'Tool Issue', 'Contractor Expense', 'PR Report', 'Expense Report', 'Spare Consumption', 'Combined Expense']   //
					},
					'GPS Management': {
						'Gps Inventory': ['Device Inventory', 'Device Slips']
					},
					'Tyre Management': {
						'Tyre Masters': ['Tyre Master', 'Trailer Master', 'Structure Master', 'Prime mover trailer association', 'Retreated'],
						'Tyre Report': ['Tyre', 'Tyre Issue', 'Tyre Retreat', 'Prime Trailer association']

					},
					'Admin Apps': {
						'User': ['User', 'Role', 'Client', 'Dashboard']

					},
					'Alerts & Notifications': {
						'Notifications': ['Notification']

					}
				};

				function successLogin(response) {
					// console.log("success user login :" + JSON.stringify(response))
					if(response && response.token) {

						if(!$localStorage.ft_data) {
							$localStorage.ft_data = {};
						}

						if(response.access) {
							$localStorage.ft_data = $localStorage.ft_data || {};
							$localStorage.ft_data.appwidgets = validateWidget(appwidgets, response.access);
						} else {
							swal('Access Denied', 'You Don\'t have access to our system', 'error');
							$localStorage.ft_data = {};
							return;
						}

						$localStorage.ft_data.token = response.token;
						$localStorage.ft_data.userLoggedIn = response.user;
						//socketFactory.connect(response.user.userId);
						if(response.tableAccess)
							$localStorage.ft_data.tableAccess = response.tableAccess;

						$localStorage.ft_data.client_config = response.client_config;
						if($localStorage && $localStorage.ft_data && $localStorage.ft_data.client_config && $localStorage.ft_data.client_config.clientId) {
							$rootScope.getFileURL = URL.file_server + "users/"+ $localStorage.ft_data.client_config.clientId + '/';
						}
						$localStorage.ft_data.access_control = response.access;

						/*response.configs.postBooking = 60;
						response.configs.postAllocation = 60;
						response.configs.postGrAssign = 60;
						response.configs.postTripStart = 60;*/
						$localStorage.ft_data.configs = response.configs;

						if(response.client_config && response.client_config.gpsId && response.client_config.gpsPwd) {
							$rootScope.userLogin({
								user_id : response.client_config.gpsId,
								password : response.client_config.gpsPwd,
								rememberMe : true
							});
						}

						if(!$localStorage.ft_data.selectedClient)
							$localStorage.ft_data.selectedClient = (response.user && response.user.clientId && (response.user.clientId[0] || response.user.clientId));

						$rootScope.selectedClient = $rootScope.selectedClient || (response.user.clientId && response.user.clientId[0]);

						sharedResource.shareThisResourceWith($rootScope);  // it share the shared resource with current scope

						// /////////////////
						if(success && typeof success === 'function')
							success();
					}
				}

				function failureLogin(response) {
					console.log('failure user login :' + JSON.stringify(response));
					if(failure && typeof failure === 'function')
						failure();
				}

				this.authenticate(objLogin, successLogin, failureLogin);

				function validateWidget(awidget, access) {
					var widget = {};
					for(var header in awidget) {
						for(var app in awidget[header]) {
							for(var index in awidget[header][app]) {
								var module = awidget[header][app][index];
								if(access.hasOwnProperty(module)) {
									if(!widget[header]) widget[header] = {};
									if(!widget[header][app]) widget[header][app] = [];
									widget[header][app].push(module);
								}
							}
						}
					}
					return widget;
				}
			};
        }
    ]);
