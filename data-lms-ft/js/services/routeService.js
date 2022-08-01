materialAdmin.service('Routes', [
	'$rootScope',
	'HTTPConnection',
	'URL',
	"debounceWrapper",
	'otherUtils',
	'utils',
	'constants',
	function (
		$rootScope,
		HTTPConnection,
		URL,
		debounceWrapper,
		otherUtils,
		utils,
		constants
	) {
		function prepareParameters(oFilter) {
			var sParam = "";
			for (var property in oFilter) {
				sParam = sParam + "&" + property + "=" + oFilter[property];
			}
			return sParam;
		}

		this.getAllRoutes = function (oFilter, success) {
			var url_with_params = URL.TransporterRoutes + "?no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		}
		this.getAllTrueRoutes = function (oFilter, success) {
			var url_with_params = URL.TransporterRoutes_ALL + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		}

		this.updateRoute = function (data, success, failure) {
			HTTPConnection.put(URL.TransporterRoutes_UPDATE + data._id, data, success, failure);
		}

		this.saveRoute = function (data, succes, failure) {
			HTTPConnection.post(URL.TransporterRoutes_Post, data, succes, failure);
		}

		this.getTracking = function (data, succes, failure) {
			HTTPConnection.post(URL.GET_TRACKING, data, succes, failure);
		}

		const serialize = function (obj, prefix) {
			var str = [], p;
			for (p in obj) {
				if (obj.hasOwnProperty(p)) {
					var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
					str.push((v !== null && !(v instanceof Date) && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
				}
			}
			return str.join("&");
		};

		this.uploadCommon = (qp = {}, p = {}) => new Promise((rs, rj) => (
			HTTPConnection.post(`${URL.COMMON_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
		));

		this.trackingReport = function (oFilter, success) {
			var url_with_params = URL.Tracking_EXCEL + "?no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		}

		this.addRouteTracking = function (data, succes, failure) {
			HTTPConnection.post(URL.ADD_ROUTE_TRACKING, data, succes, failure);
		}
		this.upsertRouteTracking = function (data, succes, failure) {
			HTTPConnection.post(URL.UPSERT_ROUTE_TRACKING + data._id, data, succes, failure);
		}

		this.updateKm = function(data, succes,failure) {
			HTTPConnection.post(URL.UPDATE_KM + data._id, data, succes,failure);
		}

		this.getName = function (sUser, suc, fail) {
			var sURL = URL.TransporterRoutes;
			if (sUser) {
				sURL = sURL + "?name=" + sUser;
			}
			HTTPConnection.get(sURL, suc, fail);
		};

		this.getLocation = function (query) {
			return new Promise((resolve, reject) => {
				let oUrl = 'http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json';
				let q = {
					location: '28.613459424004414,77.2119140625',
					zoom: 4,
					query: query
				};
				let locationUrl = oUrl + otherUtils.prepareQeury(q);

				HTTPConnection.get(locationUrl, (response) => {
					resolve(response.data.suggestedLocations);
				}, (error) => {
					resolve([]);
					console.log(error);
				});
			}).catch(err => {
				console.error(err)
			});
		};

		this.getDistance = function (srcLat, srcLng, destLat, destLng) {
			return new Promise((resolve, reject) => {
				let distance = utils.getDistanceInKm(srcLat, srcLng, destLat, destLng);
				if(distance < 200)
					distance = distance + distance * 5/100;
				else if(distance < 400)
					distance = distance + distance * 7/100;
				else if(distance < 1000)
					distance = distance + distance * 10/100;
				else
					distance = distance + distance * 15/100;

				distance = Math.round2(distance, 2) || 0;
				resolve(distance);
			});

			// TODO promisify below code
			// let oUrl = $scope.aLocationUrl[3];

			// 	let q = {
			// 		start: $scope.allPoints[0].latitude + "," + $scope.allPoints[0].longitude,
			// 		destination: $scope.allPoints[$scope.allPoints.length-1].latitude + "," + $scope.allPoints[$scope.allPoints.length-1].longitude
			// 	};
			// 	for(i=1;i<$scope.allPoints.length-1;i++){
			// 		if(q.viapoints)
			// 			q.viapoints+="|";
			// 		else
			// 			q.viapoints = "";
			// 		q.viapoints+=$scope.allPoints[i].latitude + "," + $scope.allPoints[i].longitude;
			// 	}
			// 	let locationUrl = oUrl.url + otherUtils.prepareQeury (q);
			// 	return $http ({
			// 		method: "post",
			// 		url: locationUrl
			// 	}).then (function (response) {
			// 		$scope.regRouteNew.route_distance = parseInt(response.data.results.trips[0].length/1000);
			// 		console.log(response);
			// 	});
			// }
		};

		// this.getLocation = function (query) {
		// 	return new Promise((resolve, reject) => {
		// 		let oUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
		// 		let q = {
		// 			input: query,
		// 			types: '(regions)',
		// 			language:"en",
		// 			key: "AIzaSyDvqC-Jo9H1GN6M-VQaDGTc6lUT0Q8rT00",
		// 			components:"country:in"
		// 		};
		// 		let locationUrl = oUrl + otherUtils.prepareQeury(q);
		//
		// 		HTTPConnection.get(locationUrl, (response) => {
		// 			resolve(response.data.suggestedLocations);
		// 		}, (error) => {
		// 			resolve([]);
		// 			console.log(error);
		// 		});
		// 	}).catch(err => {
		// 		console.error(err)
		// 	});
		// };
		//
		// this.getDistance = function (id1, id2) {
		// 	return new Promise((resolve, reject) => {
		// 		let oUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
		// 		let q = {
		// 			origins: `place_id:${id1}`,
		// 			destinations: `place_id:${id2}`,
		// 			key: "AIzaSyDvqC-Jo9H1GN6M-VQaDGTc6lUT0Q8rT00",
		// 		};
		// 		let locationUrl = oUrl + otherUtils.prepareQeury(q);
		//
		// 		HTTPConnection.get(locationUrl, (response) => {
		// 			resolve(response.data.suggestedLocations);
		// 		}, (error) => {
		// 			resolve([]);
		// 			console.log(error);
		// 		});
		// 	}).catch(err => {
		// 		console.error(err)
		// 	});
		// };

		this.getStateShortName = function(stateName){
			let foundState = constants.aGSTstates.find(o => o.state.toLowerCase() === stateName.toLowerCase());
			return foundState ? foundState.state_code : '';
		}

	}]);
