materialAdmin

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])


    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function($resource){
        this.getBestselling = function(img, name, range) {
            var gbList = $resource("data/best-selling.json");

            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])


    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================

    .service('recentpostService', ['$resource', function($resource){
        this.getRecentpost = function(img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");

            return recentpostList.get ({
                img: img,
                user: user,
                text: text
            })
        }
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function() {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis:'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        };

        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500
            });
        };

        return gs;
    })

	.service('rootScopeCrud', [
		'$localStorage',
		'$rootScope',
		'$timeout',
		'otherUtils',
		function (
			$localStorage,
			$rootScope,
			$timeout,
			otherUtils,
		) {
            // this service provide the crud to save data in $rootscope.saveStateObj
			/*
			* Exposed info i.e. saved with data
			* saveTime: Date in Millisec => saved at time
			* */

			//init's
			$rootScope.saveStateObj = {}; // bcos its lost on refresh
			// $rootScope.saveStateObj = $rootScope.saveStateObj || {};

			// function identifier
			this.save = save;
			this.remove = remove;
			this.load = load;
			this.isExist = isExist;
			this.fetchDetail = fetchDetail;
			this.reset = reset;

			// Actual Function
			// save data and other useful info. about data on key
			function save(key, data, filterAllFn = true) {

				let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
				let dataToSave = typeof data !== 'undefined' ? data : false;

				if(typeof data === 'object' && !Array.isArray(data)){
					dataToSave = otherUtils.removeAngularObject(dataToSave); // removed Angular keys
					if(filterAllFn)
						dataToSave = otherUtils.removeAllFn(dataToSave);
				}

				if(path && dataToSave){

					$rootScope.saveStateObj[path] = {
						data: dataToSave,
						saveTime: Date.now()
					};
					return true;
				}else
					return false;
			}

			// remove the data if not required on key
			function remove(key) {
				let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;

				if(path && $rootScope.saveStateObj.hasOwnProperty(path)){
					delete $rootScope.saveStateObj[path];
					return true;
				}else
					return false;
			}

			// assign the data on wrapper/container of key
			function load(key, wrapper) {
				let container = typeof wrapper === 'object' ? wrapper : false;
				let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
				let data = angular.copy($rootScope.saveStateObj[path].data);

				if(path){
					if(container){
						Object.assign(container, data);
						return true;
					}else
						return data;
				}else
					return false;
			}

			// check is key exist or not
			function isExist(key) {
				let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;

				if(path){
					return !!$rootScope.saveStateObj[path];
				}else
					return false;
			}

			// fetch other info. about data
			function fetchDetail(key, keyToFetch) {

				let path = typeof key === 'string' && key.trim().length > 0 ? key.trim() : false;
				keyToFetch = typeof keyToFetch === 'string' && keyToFetch.trim().length > 0 ? keyToFetch.trim() : false;

				if(path && isExist(path) && keyToFetch){
					return $rootScope.saveStateObj[path][keyToFetch];
				}else
					return false;
			}

			function reset() {
				$timeout(function(){
					$rootScope.saveStateObj = {};
				}, 1000);
			}
		}
	])

	.service('stateDataRetain', [
		'$location',
		'$rootScope',
		'$state',
		'rootScopeCrud',
		function (
			$location,
			$rootScope,
			$state,
			rootScopeCrud,
		) {

			let pointer; // points to the data reference that has to updated after state change

			this.init = init;
			this.go = go;
			this.back = back;

			// Function Defination
			function init(scope, vm = null) {

				let content = vm || scope;
				let currentLocation = $location.path();

				scope.$on('$destroy', function(){
					rootScopeCrud.save(currentLocation, content);
				});

				scope.$on('stateRefresh', function () {
					scope.onStateRefresh && scope.onStateRefresh();
				});

				if(rootScopeCrud.isExist(currentLocation))
					return rootScopeCrud.load(currentLocation, content);

				return false;
			}

			function go(state, param = false, path=false){

				if(!param){
					$state.go(state);
					return;
				}

				$state.go(state, {
					data: param
				});

				path = path && path.trim().split('.').map(s=>s.trim());
				if(path){
					pointer = path.reduce((a, c) => a && a[c] || null, param);
					if(!pointer){
						console.log('Invalid path => data cannot be updated at invalid path');
					}
				}else
					pointer = param;
			}

			function back(state, data=false) {
				if(typeof data === "object" && pointer){
					Object.assign(pointer, data);
				}

				$state.go(state);
			}
		}
	])

	.service('cacheData', [
		'rootScopeCrud',
		function (
			rootScopeCrud
		) {

            // private arg
            // 1. timeOE i.e. Number => time of expire of current key data in minutes

            // initalizer
			this.init = init;
			this.getDetail = cacheDetails;

			/*
			* param: key/path
			* return: object/false
			* desc: it fetches the detail of cached date like its saveTime etc.
			* */

			function cacheDetails(key, keyToFetch = 'saveTime') {
				return rootScopeCrud.fetchDetail(key, keyToFetch);
			}

			function init(param) {

				let keyObj = {
					timeOE: 3
				};

				if(typeof param === "number")
					keyObj.timeOE = param;
				else if(typeof param === 'object')
					Object.assign(keyObj, param);

				return {
					load,
					upsert
				};

				/*
				* param: key/path
				* return : bool
				* des: it checks that key/path exist or not and if exist than its expires or not
				* */
				function isOk(key) {

					if(rootScopeCrud.isExist(key)){

						// check that is the cached data expired or not
						let saveTime = rootScopeCrud.fetchDetail(key, 'saveTime') + keyObj.timeOE * 60 * 1000;

						if(Date.now() > saveTime)
							return false;
						else
							return true
					}else
						return false;
				}

				/*
				* param: key/path
				* return : data/false
				* des: it return data if exist else return false
				* */
				function load(key) {
					if(isOk(key)){
						return rootScopeCrud.load(key);
					}else
						return false;
				}

				/*
				* param: key/path
				* return: Boo;
				* des: it save/update data
				* */
				function upsert(key, data) {
					rootScopeCrud.save(key, data);
				}
			}
		}
	])

	.service('clientChange', [
		'$localStorage',
		'$rootScope',
		function (
			$localStorage,
			$rootScope
		) {

			// this service refresh the page on client change

			// initalizer
			this.init = init;

			function init(clientId) {

				$(window).on("focus", function(e) {
					if($rootScope.selectedClient != $localStorage.ft_data.selectedClient){
						window.location.reload();
					}
				})

			}
		}
	])

// =========================================================================
// Auto Narration
// =========================================================================

.service('narrationService', [
	'$state',
	function(
		$state
	){

	const PRECEDENCE = [
		{key: 'Vehicle No', extractionKey: 'vehicleNo'},
		{key: 'Trip No', extractionKey: 'tripNo'},
		{key: 'Route', extractionKey: 'route'},
		{key: 'Vendor', extractionKey: 'vendor'},
		{key: 'Hire Slip', extractionKey: 'hsNo'},
		{key: 'CN Date', extractionKey: 'cnDate'},
		{key: 'GR No', extractionKey: 'grNum'},
		{key: 'From', extractionKey: 'from'},
		{key: 'To', extractionKey: 'to'},
		{key: 'Policy No', extractionKey: 'plcyNo'},
		{key: 'Permit No', extractionKey: 'permitNo'},
	];

	return function (data) {

		let narrationArr = [];

		PRECEDENCE.forEach(o => {
			if(data[o.extractionKey])
				narrationArr.push(`${o.key}: ${data[o.extractionKey]}`);
		});

		return narrationArr.join('; ');
	}
}])

.service('xlsxWrapper', [
	function(
	){
		const config = {};

		return function (json, fileName = Date.now()) {

			if(!Array.isArray(json) || !json.length)
				throw new Error('Invalid JSON');

			/* generate a worksheet */
			let ws = XLSX.utils.json_to_sheet(json);

			/* add to workbook */
			let wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "sheet 1");

			/* write workbook and force a download */
			XLSX.writeFile(wb, `${fileName}.xlsx`);
		};
	}])

	.service('debounceWrapper', [
		"$timeout",
		function(
			$timeout
		){

			let timer = null;
			const DELAY_TIME = 500;

			return function (fn) {
				return wrapFn;

				function wrapFn(...params) {
					if(timer){
						$timeout.cancel(timer);
						timer = null;
					}
					timer = $timeout(function(){
						fn(...params);
					}, DELAY_TIME);
				}
			};
		}]);
