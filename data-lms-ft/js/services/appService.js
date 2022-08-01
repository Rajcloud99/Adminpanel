/**
 * Created by manish on 8/8/16.
 */
materialAdmin.service('appService', ['$rootScope', 'HTTPConnection', 'URL',
    function($rootScope, HTTPConnection, URL) {

        this.dashBoardStats = function(success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
                //console.log("success response dashboard stats :"+JSON.stringify(data.data));
            };
            var parseFailureResp = function(data) {
                failure(data.data);
                console.log("failure response dashboard stats :" + JSON.stringify(data.data));
            };
            //console.log("made request for dashboard stats");
            HTTPConnection.get(URL.DASHBOARD_STATS, parseSuccessResp, parseFailureResp);
        };
    }
]);


materialAdmin.service('showHideSideBarElement', ['$localStorage', 'constants', 'otherUtils',
    function($localStorage, constants, otherUtils) {

        this.sideBar = function(appKey, opration) {
            var sAccess = constants.app_key_desc_pair[appKey];
            if ($localStorage && $localStorage.ft_data && $localStorage.ft_data.access_control) {
                return otherUtils.hasAccess($localStorage.ft_data.access_control, sAccess, opration);
            } else {
                return false;
            }

        };
    }
]);