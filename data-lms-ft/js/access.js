/**
 * Created by manish on 8/8/16.
 */

materialAdmin.factory("Access", ["$q","$localStorage", function ($q, $localStorage) {

    var Access = {
        OK: 200,
        // "we don't know who you are, so we can't say if you're authorized to access
        // this resource or not yet, please sign in first"
        UNAUTHORIZED: 401,
        // "we know who you are, and your profile does not allow you to access this resource"
        FORBIDDEN: 403,

        isAuthenticated: function () {
            //console.log("User in access "+ JSON.stringify($localStorage.ft_data.userLoggedIn));
            if ($localStorage.ft_data.userLoggedIn){
                //console.log("User is logged in");
                return Access.OK;
            }else{
                //console.log("User is un-authorized");
                return $q.reject(Access.UNAUTHORIZED);
            }
        },

        hasAccessTo: function (resourceName, accessType) {
            //console.log("Role data in access "+ JSON.stringify($localStorage.ft_data.role_data));
            if ($localStorage.ft_data.login_user_role_data
                && (resourceName in $localStorage.ft_data.login_user_role_data)
                && $localStorage.ft_data.login_user_role_data[resourceName].indexOf(accessType)>-1){
                return Access.OK;
            }else if ($localStorage.ft_data.login_user_role_data
                && (resourceName in $localStorage.ft_data.login_user_role_data)
                && $localStorage.ft_data.login_user_role_data[resourceName].indexOf(accessType)==-1){
                return $q.reject(Access.FORBIDDEN);
            }else if ($localStorage.ft_data.login_user_role_data
                && !(resourceName in $localStorage.ft_data.login_user_role_data)){
                return $q.reject(Access.FORBIDDEN);
            }else{
                return $q.reject(Access.UNAUTHORIZED);
            }
        }
    };

    return Access;
}]);