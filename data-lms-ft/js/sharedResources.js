/**
 * Created by JA
 */


// It solves the problem of accessing the shared resource in model

materialAdmin.service('sharedResource',
	[	'$localStorage',
		'constants',
		function(
			$localStorage,
			constants
		){

			// Identifiers
				var obj = {};

			// function Identifier

			this.shareThisResourceWith = shareThisResourceWith;


			// Actual functions

			function shareThisResourceWith(resource) {

				updateResources();
				mergeConfigInConstant();

				for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						resource[prop] = obj[prop];
					}
				}
			}

			function updateResources() {

				obj.$constants = constants;

				try{
					obj.$clientConfigs = $localStorage.ft_data.client_config || {};
				}catch (e) {
					obj.$clientConfigs = {};
				}

				try{
					obj.$role = $localStorage.ft_data.access_control || {};
				}catch (e) {
					obj.$role = {};
				}

				try {
					obj.$configs = $localStorage.ft_data.configs || {};
				}catch (e) {
					obj.$configs = {};
				}

				try{
					obj.$aBranch = $localStorage.ft_data.userLoggedIn.branch || [];
				}catch (e){
					obj.$aBranch = [];
				}

				try{
					obj.$aAccessControl = $localStorage.ft_data.access_control || [];
				}catch (e){
					obj.$aAccessControl = [];
				}

				try{
					obj.$tableAccess = $localStorage.ft_data.tableAccess || [];
				}catch (e){
					obj.$tableAccess = {};
				}

				try{
					obj.$user = $localStorage.ft_data.userLoggedIn || [];
				}catch (e){
					obj.$user = {};
				}
			}

			function mergeConfigInConstant() {
				if(obj.$configs.tripAdv && obj.$configs.tripAdv.maxDieselAmt)
					obj.$constants.maxAdvanceDieselAmount = obj.$configs.tripAdv.maxDieselAmt;
			}

		}
	]
);
