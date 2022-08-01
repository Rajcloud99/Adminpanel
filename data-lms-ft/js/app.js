angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

var secretEmptyKey = '[$empty$]';

var materialAdmin = angular.module('materialAdmin', ['ngAnimate',
    'HashBangURLs',
    'ngResource',
    'localytics.directives',
    'ui.router',
    'ui.router.state.events',
	  'ngCookies',
    'ui.bootstrap',
    'angular-loading-bar',
    //'oc.lazyLoad',
    'nouislider',
    'ngTable',
    'ngStorage',
    'ui.bootstrap.datetimepicker',
    'ngMessages',
    'angularjs-dropdown-multiselect',
    'ngFileUpload',
    '720kb.datepicker',
    'htmlToPdfSave',
	  'moment-picker',
      'rzSlider',
    'ngDesktopNotification',
    /* 'ngAria',
    'ngAnimate',
    'ngMaterial', */
    'angular.filter',
    'infinite-scroll',
    'fixed.table.header',
    'nvd3'
]);

//
materialAdmin.controller(
    'materialadminCtrl',
    function($timeout,
			 $state,
			 $uibModal,
			 URL,
			 growlService,
			 $scope,
			 $rootScope,
			 $location,
			 $anchorScroll,
			 branchService,
			 clientChange,
			 HTTPConnection,
			 $localStorage,
			 $sessionStorage,
			 $window,
			 constants,
			 loginService,
			 showHideSideBarElement,
			 clientService,
			 otherUtils,
			 rootScopeCrud,
			 sharedResource,
			 socketFactory,
             filterService,
             ReportService,
             $interval
	) {
		let userLoggedIn;
        $localStorage.ft_data = $localStorage.ft_data || {};
        $sessionStorage.ft_data = $localStorage.ft_data || {};
        $rootScope.getFileURL;
        if ($localStorage && $localStorage.ft_data && $localStorage.ft_data.client_config && $localStorage.ft_data.client_config.clientId) {
            $rootScope.getFileURL = URL.file_server + "users/"+ $localStorage.ft_data.client_config.clientId + "/";
        }

        $rootScope.fileURLClient = URL.FILE_URL;

        $rootScope.showSideBar = function(params1, params2) {
            var x = showHideSideBarElement.sideBar(params1, params2);
            return x;
        };
        $scope.$back = function() {
            window.history.back();
        };
        $scope.$forward = function() {
            window.history.forward();
        };
        $scope.$goToAppHome = function() {
            $state.go(constants.app_key_sref_pair.home);
        };

        $scope.stateRefresh = function(){
        	$rootScope.$broadcast('stateRefresh');
		};

        $rootScope.setLoginDataGlobal = function(roleDataObj) {
            $scope.$loginUserRoleData = roleDataObj
        };

        if(!($rootScope.$constants && $rootScope.$configs && $rootScope.$aBranch))
			sharedResource.shareThisResourceWith($rootScope);  // it share the shared resource with current scope

		if(!$localStorage.ft_data.selectedClient && userLoggedIn)
			$localStorage.ft_data.selectedClient = (userLoggedIn && userLoggedIn.clientId && (userLoggedIn.clientId[0] || userLoggedIn.clientId));

		$rootScope.selectedClient = $localStorage.ft_data.selectedClient;
		clientChange.init();

		this.sideFilter = filterService();

        //$rootScope.user = User.getCurrentUser();

		$rootScope.printDiv = function(elem) {
			var contents = document.getElementById(elem).innerHTML;
			var frame1 = document.createElement('iframe');
			frame1.name = "frame1";
			frame1.style.position = "absolute";
			frame1.style.top = "-1000000px";
			document.body.appendChild(frame1);
			var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
			frameDoc.document.open();
            frameDoc.document.write(`
            <html>
                <head>
                    <title>DIV Contents</title>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                </head>
                <body>
                ${contents}
                </body>
            </html>
            `);
			frameDoc.document.close();
			setTimeout(function () {
				window.frames["frame1"].focus();
				window.frames["frame1"].print();
				document.body.removeChild(frame1);
			}, 500);
		};

        $rootScope.redirect = function(path) {
            window.location.href = path;
        };

        $sessionStorage.$reset(); // remove session for local use remove after some time ...

        $rootScope.scroll = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        };

        // By default template has a boxed layout
        localStorage.setItem('ma-layout-status', 1);
        this.layoutType = localStorage.getItem('ma-layout-status');

        // For Mainmenu Active Class
        this.$state = $state;

        function logoutSucess() {
            $localStorage.$reset();
            $sessionStorage.$reset();
            $state.reload();
			socketFactory.manualSocketDisconnect();
            $rootScope.redirect('index.html');
        }
        this.logout = function() {
            HTTPConnection.post(URL.LOGOUT, { 'Authorization': $sessionStorage.token }, logoutSucess);
        };

		$scope.addManagerRemark = function() {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/report/addRemarkPopUp.html',
				controller: [
					'$scope',
					'$uibModalInstance',
					'lazyLoadFactory',
					'DatePicker',
					'otherData',
					'ReportService',
					'commonTableSettingFactory',
					addRemarkController
				],
				controllerAs: 'arVm',

				resolve: {
					otherData: function () {
						return {
							aLogs: $rootScope.aSelectedLogs,
						};
					}
				}
			});
		}

        $scope.logout = function() {
        	$localStorage.$reset();
			$sessionStorage.$reset();
			window.location.href = new window.URL(window.location.href).origin + '/#!/auth/login';
			window.location.reload();

			// socketFactory.manualSocketDisconnect();
        };

        //Close sidebar on click
        this.sidebarStat = function(event) {
            if (!angular.element(event.target).parent().hasClass(
                    'active')) {
                this.sidebarToggle.left = false;
            }
        };

        //Listview Search (Check listview pages)
        this.listviewSearchStat = false;

        this.lvSearch = function() {
            this.listviewSearchStat = true;
        };

        //Skin Switch
        this.currentSkin = 'blue';
        //Skin Switch
        this.clientAdminSkin = 'bluegray';
        this.ftAdminSkin = 'purple';


        //Listview menu toggle in small screens
        this.lvMenuStat = false;

        //Blog
        this.wallCommenting = [];

        this.wallImage = false;
        this.wallVideo = false;
        this.wallLink = false;

        /*****************start --- When open new tab******************/
        $sessionStorage.token = $sessionStorage.token || $localStorage.token;
        if ($sessionStorage.token && $localStorage.ft_data.userLoggedIn) {
        	userLoggedIn = $localStorage.ft_data.userLoggedIn;
		}
        if ($sessionStorage.token && !$localStorage.user) {
            $timeout(function() {
                if ($location.absUrl().indexOf("main.html") > -1) {
                    $rootScope.redirect('index.html');
                }
            }, 0);
        }
        /*****************end --- When open new tab******************/
        //on route change
        $scope.$watch('$viewContentLoaded', function() {
            $timeout(function() {
                if ($location.absUrl().indexOf("main.html") > -1) {
                    if (!$sessionStorage.token) {
                        $rootScope.redirect('index.html');
                    }
                }
            }, 0);
        });

        // Modal instance
        var modalInstance;
        var modalInstances;
        // Utils for modal
        $rootScope.openModal = function(templatePath, scope) {
            if (modalInstance) {
                // Do nothing when a popup is already open.
            } else {
                modalInstance = $uibModal.open({
                    templateUrl: templatePath,
                    scope: scope
                });
                modalInstance.result.then(function() {}, function() {
                    modalInstance = null;
                });
            }
        };

        $rootScope.closeModal = function() {
            modalInstance.dismiss('cancel');
            modalInstance = null;
        };

        $rootScope.openModals = function(templatePath, scope) {
            if (modalInstances) {
                // Do nothing when a popup is already open.
            } else {
                modalInstances = $uibModal.open({
                    templateUrl: templatePath,
                    scope: scope
                });
            }
        };
        $rootScope.closeModals = function() {
            modalInstances.dismiss('cancel');
            modalInstances = null;
        };

        /*$rootScope.preview = function(logo) {
              function successUpdate(response){
                  if(response && response.data && response.data.format && response.data.completePath){
                     $rootScope.image = true;
                     $rootScope.pdf = false;
                      $rootScope.image1 = response.data.completePath;// window.btoa(unescape(encodeURIComponent(response.data)));
                      var modalInstance = $uibModal.open({
                        templateUrl: 'views/downloadImage.html',
                        controller: 'ImageModalController'
                      });
                  } else if (response.data){
                     $rootScope.pdf = true;
                     $rootScope.image = false;
                     $rootScope.pdf1 = response.data;
                     window.open($rootScope.pdf1,'pdf','resizable=1');
                  }
              }
              function failureUpdate(response){
                  console.log(response);
              }
          clientService.getImage(logo, successUpdate, failureUpdate);
        }*/
        $rootScope.preview = function(doc) {
            $rootScope.image1 = $rootScope.getFileURL + doc;
            var mime = doc.split('.').pop();
            if (mime == "pdf") {
                window.open($rootScope.image1, 'pdf', 'resizable=1');
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/downloadImage.html',
                    controller: 'ImageModalController',
					size: 'lg'
                });
            }
        };

		$rootScope.previewFile = function(doc) {
			$rootScope.image1 = URL.getDBFileURL + doc;
			var mime = doc.split('.').pop();
			if (mime == "pdf") {
				window.open($rootScope.image1, 'pdf', 'resizable=1');
			} else {
				var modalInstance = $uibModal.open({
					templateUrl: 'views/downloadImage.html',
					controller: 'ImageModalController'
				});
			}
		};

        $rootScope.getAllBranchSelect = function() {
            function succBranches(response) {
                //console.log(data);
                if (response.data) {
                    $rootScope.getBranch = response.data;
                }
            }

            function failBranches(response) {
                console.log(response);
            }
            //console.log($scope.oBooking);
            branchService.getBranches({}, succBranches, failBranches);
        };


		$rootScope.getSrefPair = function (module) {
			var moduleKey = otherUtils.getKeyByValueInObject(module,constants.app_key_desc_pair);
			return constants.app_key_sref_pair[moduleKey];
		};

		$rootScope.getaSrefPair = function (aModule) {
			var aSref = [];
			if(aModule && aModule.length>0){
				for (var i=0;i<aModule.length;i++){
					var moduleKey = otherUtils.getKeyByValueInObject(aModule[i],constants.app_key_desc_pair);
					aSref.push( {
						key:aModule[i],
						value:constants.app_key_sref_pair[moduleKey]
					});
				}
			}
			return aSref;
		};
		$rootScope.parseAddressToString = function (address) {
			var parsedAddress = "";
			if (address && address.line1) {
				parsedAddress += (address.line1 + ", ");
			}
			if (address && address.line2) {
				parsedAddress += (address.line2 + ", ");
			}
			if (address && address.city) {
				if (address.district == address.city) {
					delete address.district;
				}
				parsedAddress += (address.city + ", ");
			}
			if (address && address.district) {
				parsedAddress += (address.district + ", ");
			}
			if (address && address.state) {
				parsedAddress += (address.state + ", ");
			}
			if (address && address.pincode) {
				parsedAddress += (address.pincode + ", ");
			}
			if (address && address.country) {
				parsedAddress += address.country;
			}
			return parsedAddress;
		};

		$rootScope.setSidarModules = function(modules,headerTitle){
			$localStorage.ft_data.sideBarApps = modules;
			$localStorage.ft_data.headerTitle = headerTitle;
			//$rootScope.sideBarApps = modules;
			//$rootScope.headerTitle = headerTitle;
		}
        /*$window.onbeforeunload = function(){
            $localStorage.ft_data = undefined;
            $sessionStorage.ft_data = undefined;
        };*/

		$rootScope.changeSelectedClient = function (selectedClient) {
			$localStorage.ft_data.selectedClient = selectedClient;
			$rootScope.selectedClient = selectedClient;
			loginService.loginServer({clientId:selectedClient},function () {
				rootScopeCrud.reset();
				$state.go('home.apps');
			});
        }


    })

// =========================================================================
// Header
// =========================================================================
.controller('headerCtrl', function($timeout, $rootScope, $scope, $localStorage, $sessionStorage, messageService, $location) {

    var getNotif = messageService.getMessage();

    if ($localStorage.notfy) {
        if ($localStorage.notfy.length > getNotif.length) {
            $rootScope.notifications = $localStorage.notfy;
        } else {
            $rootScope.notifications = getNotif;
        }

    } else {
        $rootScope.notifications = getNotif;
    }

    //Clear Notification
    $scope.root = function(w, $index) {
        var sUrls = w.suurl;
        $rootScope.redirect(sUrls);
    };

    $scope.clearNotification = function() {
        $rootScope.notifications = [];
        messageService.clearAllMessages()
    };

    function removeClass(elem, cls) {
        var str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    }

    function addClass(elem, cls) {
        if (elem.className == cls) {

        } else {
            elem.className += (" " + cls);
        }
    }


    var elem = document.getElementById("bdy");
    /*if (window.location.hash == "#/profile/"){
           removeClass(elem, "bottomTabs");
           addClass(elem, "hidden");
       } else {
           addClass(elem, "show");
    }*/

    $rootScope.$watch(function() {
            return $location.path();
        },
        function(a) {
            //console.log('url has changed: ' + a);
            $rootScope.currentPath = $location.path();
            //$sessionStorage.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhmNzkyNTQzZjAzOTc1Mzk3ZjM1MzEiLCJyYW5kX3N0ciI6InhTcUJLOGF3In0.9U-kf1QwtJ1oXzfWk0dRqRQZIfWZp7zI2Xd3dzO4vno";

            $timeout(function() {
                if ($rootScope.currentPath == '/role' || $rootScope.currentPath == '/user/createUser' || $rootScope.currentPath == '/user/profile' || $rootScope.currentPath == '/user/updateUser') {
                    $scope.hideToggle = false;
                    removeClass(elem, "sw-toggled");
                } else {
                    $scope.hideToggle = true;
                    addClass(elem, "sw-toggled");
                }
            }, 100);
        });

    // Top Search
    this.openSearch = function() {
        angular.element('#header').addClass('search-toggled');
        angular.element('#top-search-wrap').find('input').focus();
    };

    this.closeSearch = function() {
        angular.element('#header').removeClass('search-toggled');
    }
})

.controller('gpsCtrl', ['$scope', '$window',
    function($scope, $window) {
        $scope.redirectToGPS = function() {
            $window.open('http://gps.futuretrucks.in', '_blank');
        };

        $scope.redirectToBuyGPS = function() {
            $window.open('http://delhi.quikr.com/GPS-services-for-fleet-management-W0QQAdIdZ249993750', '_blank');
        };
    }
]).directive('compile', function ($compile) {
	return function (scope, element, attrs) {
		scope.$watch(

			function (scope) {
				return scope.$eval(attrs.compile);
			},

			function (value) {
				element.html(value);
				$compile(element.contents())(scope);
			});
	};
})
.filter('grNumbers', function () {
    return function (i) {
        return i.trip.aGR.map(function(item) {
            return item.grNumber;
        }).join(', ') || 'NA';
    };
  });
