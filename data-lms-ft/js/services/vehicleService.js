materialAdmin.service('Vehicle', [
	'$localStorage',
	'$rootScope',
	'$timeout',
	'cacheData',
	'HTTPConnection',
	'URL',
	'utils',
	function (
		$localStorage,
		$rootScope,
		$timeout,
		cacheData,
		HTTPConnection,
		URL,
		utils,
	) {

		let that = this;

		this.getVehicleTypes = function (suc, failure) {
			var aVehicleTypes = [{"truck_type": "Tata Ace", "code": "A"}, {
				"truck_type": "Pick Up",
				"code": "B"
			}, {"truck_type": "Tata 407", "code": "C"}, {"truck_type": "14 feet", "code": "D"}, {
				"truck_type": "17 feet",
				"code": "E"
			}, {"truck_type": "19 feet", "code": "F"}, {"truck_type": "20 feet", "code": "G"}, {
				"truck_type": "6 tyre",
				"code": "H"
			}, {"truck_type": "10 tyre taurus", "code": "I"}, {
				"truck_type": "12 tyre taurus",
				"code": "J"
			}, {"truck_type": "22 feet single axel", "code": "K"}, {
				"truck_type": "24 feet single axel",
				"code": "L"
			}, {"truck_type": "28 feet single axel", "code": "BB"}, {
				"truck_type": "34 feet single axel",
				"code": "M"
			}, {"truck_type": "34 feet multi axel", "code": "N"}, {
				"truck_type": "20 feet high bed",
				"code": "O"
			}, {"truck_type": "20 feet low bed", "code": "P"}, {
				"truck_type": "40 feet semi low bed",
				"code": "Q"
			}, {"truck_type": "40 feet high bed", "code": "R"}, {
				"truck_type": "24 feet single axel",
				"code": "S"
			}, {"truck_type": "28 feet multi axel", "code": "T"}, {
				"truck_type": "32 feet single axel",
				"code": "U"
			}, {"truck_type": "24 feet multi axel", "code": "V"}, {
				"truck_type": "28 feet multi axel",
				"code": "W"
			}, {"truck_type": "32 feet multi axel", "code": "X"}, {
				"truck_type": "14 tyre taurus",
				"code": "Y"
			}, {"truck_type": "32 feet tripple axel", "code": "Z"}, {"truck_type": "28 feet JCB", "code": "AA"}];
			var response = {"status": "OK"};
			response.data = {};
			response.data.data = aVehicleTypes;
			suc(response);
		};
		this.getMaterialTypes = function (suc, failure) {
			var aMaterisalTypes = [{
				"material_type": "Agricultural products",
				"code": "AGR"
			}, {"material_type": "Building Materials", "code": "BUI"}, {
				"material_type": "Cable Drum(Wooden rolls)",
				"code": "CDM"
			}, {"material_type": "Auto Parts", "code": "AUT"}, {
				"material_type": "Cement",
				"code": "CEM"
			}, {"material_type": "Chemicals", "code": "CHE"}, {
				"material_type": "Coal and Ash",
				"code": "COA"
			}, {"material_type": "Container", "code": "CON"}, {
				"material_type": "Crockery",
				"code": "CRO"
			}, {"material_type": "Electronics/Consumer Durables", "code": "ELC"}, {
				"material_type": "Fabrigation Product",
				"code": "FAB"
			}, {"material_type": "Fruits and Vegetable", "code": "FRT"}, {
				"material_type": "Furniture and wood products",
				"code": "FUR"
			}, {"material_type": "Household Goods", "code": "HOU"}, {
				"material_type": "Fertilizers",
				"code": "FER"
			}, {"material_type": "Industrial Equipments", "code": "IEQ"}, {
				"material_type": "Iron materials",
				"code": "IRM"
			}, {"material_type": "Jumbo bags", "code": "JUB"}, {
				"material_type": "Liquids",
				"code": "LIQ"
			}, {"material_type": "Liquids in drums/Oil", "code": "LQD"}, {
				"material_type": "Machinery",
				"code": "MAC"
			}, {"material_type": "Medicine/Medical material", "code": "MED"}, {
				"material_type": "Mill Jute Oil",
				"code": "MJO"
			}, {"material_type": "Others(Please specify)", "code": "XXX"}, {
				"material_type": "Panel",
				"code": "PNL"
			}, {"material_type": "Packed food", "code": "PKD"}, {
				"material_type": "Plastic Box",
				"code": "PBO"
			}, {"material_type": "Plastic pipe", "code": "PPI"}, {
				"material_type": "Plastic products",
				"code": "PPR"
			}, {"material_type": "Poles", "code": "POL"}, {
				"material_type": "Powder",
				"code": "POW"
			}, {"material_type": "Printed books/paper rolls", "code": "PRI"}, {
				"material_type": "Refrigerator Goods",
				"code": "REF"
			}, {"material_type": "Sand", "code": "SAN"}, {
				"material_type": "Scrap",
				"code": "SCR"
			}, {"material_type": "Spices", "code": "SPC"}, {
				"material_type": "Textiles",
				"code": "TEX"
			}, {"material_type": "Tyres/Rubber products", "code": "TYR"}, {
				"material_type": "Vehicles/Automobiles",
				"code": "VEH"
			}];
			var response = {};
			response.data = {};
			response.data.data = aMaterisalTypes;
			suc(response);
		};

		function prepareParameters(oFilter) {
			var sParam = "";
			for (var property in oFilter) {
				sParam = sParam + "&" + property + "=" + oFilter[property];
			}
			return sParam;
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

		this.getAllregList = function (oFilter, success) {
			var url_with_params = URL.VEHICLE;
			HTTPConnection.post(url_with_params, oFilter, success);
		};

		this.getVehForAlloc = function (oF, Succ) {
			var url_with_params = URL.VEHICLE_FOR_ALLOC;
			HTTPConnection.post(url_with_params, oF, Succ);
		};

		this.getVehicleByNum = function (oFilter, success) {
			var url_with_params = URL.VEHICLE + "?all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getAllVehicles = function (oFilter, success) {
			this.getAllVehicleSuccess = function (data) {
				//$localStorage.availableVehicles = data.data;
				success(data.data);
			};
			var url_with_params = URL.VEHICLE;
			HTTPConnection.post(url_with_params, oFilter, this.getAllVehicleSuccess);
		};

		this.getVehiclesWithPagination = function (oFilter, success) {
			this.getAllVehicleSuccess = function (data) {
				//$localStorage.availableVehicles = data.data;
				success(data.data);
			};
			var url_with_params = URL.VEHICLE;
			HTTPConnection.post(url_with_params, oFilter, this.getAllVehicleSuccess);
		};

		this.getVehiclesNotMaintenance = function (oFilter, success) {
			this.getAllVehicleSucc = function (data) {
				$localStorage.availableVehicles = data.data;
				success(data.data);
			};
			var url_with_params = URL.VEHICLE;
			oFilter.dontshow = 'Maintenance';
			HTTPConnection.post(url_with_params, oFilter, this.getAllVehicleSucc);
		};

		this.getAllVehicleReport = function (oFilter, success, failure) {
			var url_with_params = URL.VEHICLE_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success, failure);
		};

		this.VehCompositeReport = function (oFilter, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_REPORT_MASTER, success);
		};

		this.getOwnedVehicle = function (success) {
			HTTPConnection.get(URL.VEHICLE_OWNED, success);
		};

		this.getOwnHorseVehicle = function (success) {
			HTTPConnection.get(URL.VEHICLE_OWNED_HORSE, success);
		};

		this.getOwnHorseAvailableVehicle = function (success) {
			HTTPConnection.get(URL.VEHICLE_OWNED_HORSE_AVAILABLE, success);
		};

		this.saveVehicle = function (vehicle, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_POST, vehicle, succes, failure);
		};

		this.vehicleCheckExists = function (vehicle, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_CHECK, vehicle, succes, failure);
		};

		this.updateVehicle = function (data, success, failure) {
			HTTPConnection.put(URL.VEHICLE_UPDATE + "/" + data._id, data, success, failure);
		};
		this.updateRegVehicle = function (data, success, failure) {
			HTTPConnection.post(URL.REG_VEHICLE_UPDATE + "/" + data._id, data, success, failure);
		};

		this.uploadVehicle = function (data, success, failure) {
			HTTPConnection.put(URL.VEHICLE_UPLOAD + "/" + data._id, data, success, failure);
		};

		this.deleteVehicles = function (data, success, failure) {
			HTTPConnection.delete(URL.VEHICLE_DELETE + data.id, success, failure);
		};

		this.deleteStatus = function (data, success, failure) {
			HTTPConnection.post(URL.DELETE_STATUS + data._id, data, success, failure);
		};

		this.getAllVehicleBranch = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_BRANCH, succes, failure);
		};

		this.getName = function (sUser, suc, fail) {
			var sURL = URL.VEHICLE;
			if (sUser) {
				HTTPConnection.post(sURL, {vehicle_no: sUser, deleted: false}, suc, fail);
			}
		};
		this.getNameTrim2 = function (filter, success, fail) {
			this.getAllVehicleSucc = function (data) {
				$localStorage.availableVehicles = data.data;
				success(data.data);
			};
			var sURL = URL.VEHICLE;
				HTTPConnection.post(sURL, {dontshow : 'Maintenance',trim: true,vehicle_no: filter, deleted: false}, this.getAllVehicleSucc, fail);
		};
		this.vehAccidentAdd = function (data, successCallback, failureCallback) {
			const sURL = URL.VEHICLE_ACCIDENT_ADD;
			if(sURL) {
				HTTPConnection.post(sURL, data, onSuccess, onFailure);
			}
			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(data) {
				if (typeof successCallback === 'function')
					successCallback(data.data);
			}
		}

		this.vehAccidentGet = function(request, successCallback, failureCallback) {
			var urlWithParams = URL.VEHICLE_ACCIDENT_GET ;
			HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		}

		this.getCurrentVehicle =  function(data, successCallback, failureCallback) {
			var urlWithParams = URL.VEHICLE_ACCIDENT_GET ;
			// var urlWithParams = URL.CURRENT_VEHICLE_GET + '?_id=' + data;
			HTTPConnection.post(urlWithParams, data, onSuccess, onFailure);

			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		}
		this.deleteVehAccident = function(request, successCallback, failureCallback) {

			var url = URL.VEHICLE_ACCIDENT_DELETE + request._id; // modify url

			HTTPConnection.delete(url , request, onSuccess, onFailure);

			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		}
		this.vehAccidentUpdate = function(request, data, successCallback, failureCallback) {

			var url = URL.VEHICLE_ACCIDENT_UPDATE + request; // modify url

			HTTPConnection.put(url , data, onSuccess, onFailure);

			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
		}
		this.getNameTrim = function (sUser, suc, fail) {
			var sURL = URL.VEHICLE_TRIM;
			if (sUser) {
				HTTPConnection.post(sURL, {vehicle_no: sUser}, suc, fail);
			}
		};
		this.getNameTrim1 = function (sUser, suc, fail) {
			var sURL = URL.VEHICLE_TRIM;
			if (sUser) {
				HTTPConnection.post(sURL,  sUser, suc, fail);
			}
		};

		this.getNamePop = function (sUser, popObj = [], suc, fail) {
			var sURL = URL.VEHICLE;
			if (sUser) {
				HTTPConnection.post(sURL, {
					vehicle_no: sUser,
					// vehicle_reg_no: sUser,
					skip: 1,
					no_of_docs: 10,
					deleted: {$ne: true},
					ownershipType: ["Own", "Associate"],
					populate: JSON.stringify(popObj)
				}, suc, fail);
			}
		};

		this.getGroup = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_GROUP_GET,succes, failure);
		};
		this.getallGroup = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_GROUP_GET + '?all=true', succes, failure);
		};
		this.saveGroup = function (vehicle, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_GROUP, vehicle, succes, failure);
		};
		this.saveVehicleType = function (vehicle, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_VEHICLE_POST, vehicle, succes, failure);
		};
		this.getGroupVehicleType = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_GROUPVEHICLE_GET, succes, failure);
		};

		this.getAllRates = function (succes, failure) {
			HTTPConnection.post(URL.VEHICLE_RATES_GET, succes, failure);
		};

		this.getAllDrivers = function (success, fail) {

			HTTPConnection.get(URL.DRIVER + '?all=true', success, fail);
		};
		this.getType = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_TYPEVEHICLE_GET, succes, failure);
		};
		this.getTypes = function (f, succes, failure) {
			HTTPConnection.get(URL.VEHICLE_TYPEVEHICLE_GET + '?' + prepareParameters(f), succes, failure);
		};
		this.getAllType = function (succes, failure) {
			HTTPConnection.get(URL.VEHICLE_TYPEVEHICLE_GET + '?all=true', succes, failure);
		};
		this.deleteVehicleGroup = function (data, succes, failure) {
			var url_with_params = URL.VEHICLE_GROUP_DELETE;
			HTTPConnection.delete(url_with_params + data.id, data, succes, failure);
		};
		this.editGroup = function (vehicle, succes, failure) {
			HTTPConnection.put(URL.VEHICLE_GROUP_EDIT + vehicle._id, vehicle, succes, failure);
		};
		this.editType = function (vehicleT, succes, failure) {
			HTTPConnection.put(URL.VEHICLE_TYPE_EDIT + vehicleT._id, vehicleT, succes, failure);
		};

		this.getVehManufacturers = function (success, failure) {
			HTTPConnection.get(URL.VEHICLE_MANUFACTURER_GET, success, failure);
		};
		this.getGroupReport = function (oFilter, success) {
			var url_with_params = URL.VEHICLE_GROUP_REPORT + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getFleetOwnerReport = function (oFilter, success) {
			var url_with_params = URL.FLEET_OWNER_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getAllTrackingData = function (oFilter, success, failure) {
			HTTPConnection.post(URL.LIVE_TRACKING_DATA, oFilter, success, failure);
		};

		this.saveLiveTrackData = function (data, succes, failure) {
			HTTPConnection.post(URL.SAVE_LIVE_DATA, data, succes, failure);
		};


		/*this.deleteLiveTrack = function(data, succes, failure) {
			HTTPConnection.delete(URL.DELETE_LIVE_DATA, data, succes, failure);
		};*/


		this.deleteliveData = function (request, successCallback, failureCallback) {

			HTTPConnection.delete(URL.DELETE_LIVE_DATA + request._id, request, onSuccess, onFailure);

			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(data) {
				if (typeof successCallback === 'function')
					successCallback(data.data);
			}
		}


		this.updateLiveTrack = function (data, succes, failure) {
			HTTPConnection.put(URL.UPDATE_LIVE_DATA + vehicle._id, data, succes, failure);
		};

		//upload Rates
		this.uploadRates = (qp = {}, p = {}) => new Promise((rs, rj) => {
			qp.request_id = Date.now()+''+Math.round(Math.random()*100);
			HTTPConnection.post(`${URL.VEH_RATE_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
		});

		this.uploadDocs = function (data, success, failure) {
			HTTPConnection.put(`${URL.UNIVERSAL_DOCUMENT_UPLOAD}/${data.modelName}/${data._id}`, data, success, failure);
		}

		//Add Rates

		this.uploadFile = function (data, succes, failure) {
			HTTPConnection.put(URL.DOC_UPLOAD + data._id, data, succes, failure);
		};
		this.validateFile = function (data, succes, failure) {
			HTTPConnection.put(URL.DOC_VALIDATION + data._id, data, succes, failure);
		};
		this.deleteFile = function (data, succes, failure) {
			HTTPConnection.put(URL.DELETE_FILE + data._id, data, succes, failure);
		};
		this.getAllDocs = function (data, succes, failure) {
			HTTPConnection.post(URL.GET_ALL_DOCS, data, succes, failure);
		};
		this.vehAddRates = function (data, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_ADD_RATES + data._id, data, succes, failure);
		};

		this.associateSegment = function (data, succes, failure) {
			HTTPConnection.post(URL.VEHICLE_ASSOCIATE_SEGMENT, data, succes, failure);
		};

		this.vehicleFasttagAttach = function (data, successCallback, failureCallback) {
			HTTPConnection.post(URL.VEHICLE_ATTACH_FASTTAG + data._id, data, onSuccess, onFailure);

			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(data) {
				if (typeof successCallback === 'function')
					successCallback(data.data);
			}
		};

		this.vehicleWise = function (request, successCallback, failureCallback) {
			request['__SRC__'] = 'WEB';

			HTTPConnection.post(URL.LIVE_TRACKER_VEHICLE, request, onSuccess, onFailure);

			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(data) {
				if (typeof successCallback === 'function')
					successCallback(data.data);
			}
		};

		this.vehicleWiseAll = function (cb, initCb, toRefresh) {

			let cached = cacheData.init(3);

			let obj = {
				aTrSheetDevice: [],
				statusCount: 0,
				totalCount: 0,
				gpsStatus: {
					running: 0,
					stopped: 0,
					inactive: 0,
					offline: 0,
					active: 0
				},
				vehicleStatus: {
					inTrip: 0,
					maintenance: 0,
					booked: 0,
					available: 0,
					other: 0,
					empty: 0
				},
				delayStatus: {
					delay: 0,
					early: 0,
					onTime: 0,
					overRan: 0,
				},
				runStats: {
					todayRun: 0,
					weekRun: 0,
					monthRun: 0,
					avgRun: 0
				}
			};

			let cacheKeyRaw = URL.LIVE_TRACKER_VEHICLE + ' rawData',
				cacheKeyModified = URL.LIVE_TRACKER_VEHICLE + ' modifiedData';

			let cDataRaw,
				cDataModified;

			if (!toRefresh && (cDataRaw = cached.load(cacheKeyRaw)) && (cDataModified = cached.load(cacheKeyModified))) {
				$timeout(function () {
					initialize(cb);
				});
			} else {
				initialize(cb, initCb, true);
			}

			// Actual Function

			function getLiveTrackVehicle(pageNumber) {
				let request = {
					skip: pageNumber,
					no_of_docs: 3000,
					__SRC__: 'WEB'
				};

				if($rootScope.$user && $rootScope.$user.vehicle_allowed && $rootScope.$user.vehicle_allowed.length){
					request.vehicle_reg_no = $rootScope.$user.vehicle_allowed;
				}

				if($rootScope.$user && $rootScope.$user.customer && $rootScope.$user.customer.length){
					request.customer = $rootScope.$user.customer.map(obj => obj._id)
				}

				// console.log(`service for page No ${pageNumber} hit at`, moment().format('DD-MMM-YYYY hh:mm:ss'));
				that.vehicleWise(request, successCallback, failureCallback);

				function failureCallback(response) {
					swal('', response.data.message, 'error');
				}

				function successCallback(response) {
					let receviedTime = new Date();

					// console.log(`service for page No ${pageNumber} recived at`, moment(receviedTime).format('DD-MMM-YYYY hh:mm:ss'));
					if (pageNumber < response.data.pages)
						getLiveTrackVehicle(++pageNumber);

					storeTracksheetData(response.data);


					// // get total seconds between the times
					// var delta = Math.abs(Date.now() - receviedTime) / 1000;
					//
					// // calculate (and subtract) whole days
					// var days = Math.floor(delta / 86400);
					// delta -= days * 86400;
					//
					// // calculate (and subtract) whole hours
					// var hours = Math.floor(delta / 3600) % 24;
					// delta -= hours * 3600;
					//
					// // calculate (and subtract) whole minutes
					// var minutes = Math.floor(delta / 60) % 60;
					// delta -= minutes * 60;
					//
					// // what's left is seconds
					// var seconds = delta % 60;
					//
					// console.log(`service for page No ${pageNumber-1} Total Time it took`, days, ':', hours, ':', minutes, ':', seconds);
				}
			}

			function initialize(cb, initCb, refresh) {
				if (refresh) {

					obj = {
						aTrSheetDevice: [],
						statusCount: 0,
						totalCount: 0,
						gpsStatus: {
							running: 0,
							stopped: 0,
							inactive: 0,
							offline: 0,
							active: 0
						},
						vehicleStatus: {
							inTrip: 0,
							maintenance: 0,
							booked: 0,
							available: 0,
							other: 0,
							empty: 0
						},
						delayStatus: {
							delay: 0,
							early: 0,
							onTime: 0,
							overRan: 0,
						},
						runStats: {
							todayRun: 0,
							weekRun: 0,
							monthRun: 0,
							avgRun: 0
						}
					};
					initCb && initCb();

					if (cb)
						obj.cb = cb;

					getLiveTrackVehicle(1);

				} else {
					if (cb) {
						// obj.cb = cb;
						$timeout(function () {

							cb(cDataModified, cDataRaw);
						});
					}
				}
			}

			function setStatus(obj, stoppageTime = 10) {
				let positionTime = new Date(obj.positioning_time);
				let locationTime = new Date(obj.location_time);
				let speed = obj.speed;
				let ptDiffMin = Math.ceil((new Date() - positionTime) / 60000); // in Min
				let ltDiffMin = Math.ceil((new Date() - locationTime) / 60000); // in Min
				if (!obj.status || obj.status === null) {
					obj.s_status = 4;
					return;
				}
				if (ptDiffMin < 300) {//15 hr no offline
					if (ltDiffMin <= stoppageTime && speed > 0) {
						obj.status = "running";
						obj.s_status = 1;
					} else {
						obj.status = "stopped";
						obj.s_status = 2;
						obj.speed = 0;
					}
				} else {
					obj.status = "offline";
					obj.s_status = 3;
				}
			}

			function storeTracksheetData(res) {
				//res = JSON.parse(res);
				if (res.data) {

					tracksheetDataArrange(res.data);
					/////*****************************get all maps and add data on map****************/

					obj.totalCount = res.count;
					if (obj.aTrSheetDevice.length < res.count) {
						obj.aTrSheetDevice = obj.aTrSheetDevice.concat(res.data)
					}

					cached.upsert(cacheKeyModified, obj); // save data
					cached.upsert(cacheKeyRaw, res); // save data

					if (obj.cb) {
						obj.cb(obj, res.data);
					}
				}
			}

			function tracksheetDataArrange(oRes) {
				if (oRes && oRes.length > 0) {
					for (var j = 0; j < oRes.length; j++) {

						obj.statusCount = obj.statusCount || {};
						obj.statusCount[oRes[j].vehicle.status] = obj.statusCount[oRes[j].vehicle.status] ?
							obj.statusCount[oRes[j].vehicle.status] + 1 : 1;

						switch (oRes[j].vehicle.status) {
							case "In Trip" :
								obj.vehicleStatus.inTrip++;
								break;
							case "Maintenance" :
								obj.vehicleStatus.maintenance++;
								break;
							case "Available" :
								obj.vehicleStatus.available++;
								break;
							case "Booked" :
								obj.vehicleStatus.booked++;
								break;
							default:
								obj.vehicleStatus.other++;
						}

						if (!oRes[j].vehicle.gpsData) {
							obj.gpsStatus.inactive++;
							continue;
						} else
							obj.gpsStatus.active++;

						setStatus(oRes[j].vehicle.gpsData);

						oRes[j].vehicle.gpsData.vehicle_no = oRes[j].vehicle.vehicle_reg_no;
						if (oRes[j].vehicle.gpsData.location_time) {
							oRes[j].vehicle.gpsData.stoppage_time = utils.calTimeDiffCurrentToLastInDHM(oRes[j].vehicle.gpsData.location_time);
						}
						oRes[j].lat = oRes[j].vehicle.gpsData.lat;
						oRes[j].lng = oRes[j].vehicle.gpsData.lng;

						switch (oRes[j].vehicle.gpsData.status) {
							case "running":
								oRes[j].vehicle.gpsData.s_status = 0;
								obj.gpsStatus.running++;
								break;
							case "stopped":
								oRes[j].vehicle.gpsData.s_status = 1;
								obj.gpsStatus.stopped++;
								break;
							case "offline":
								oRes[j].vehicle.gpsData.s_status = 2;
								obj.gpsStatus.offline++;
								break;
							default:
								break;
						}

						switch (oRes[j].status) {
							case 'Delayed':
								obj.delayStatus.delay++;
								break;
							case 'Early':
								obj.delayStatus.early++;
								break;
							case 'On Time':
								obj.delayStatus.onTime++;
								break;
						}
					}
				}
			}
		};

		this.vehicleKmWise = function (request, successCallback, failureCallback) {

			HTTPConnection.post(URL.LIVE_TRACKER_KILOMETER_ANALYSIS, request, onSuccess, onFailure);

			function onFailure(data) {
				if (typeof failureCallback === 'function')
					failureCallback(data.data);
			}

			function onSuccess(data) {
				if (typeof successCallback === 'function')
					successCallback(data.data);
			}
		}

	}]);
