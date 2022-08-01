/**
 * Created by manish on 29/8/16.
 */
materialAdmin.service('materialService',
    ['$rootScope', 'HTTPConnection', 'URL', 'otherUtils', function($rootScope, HTTPConnection, URL, utils) {

        this.getMaterialGroups = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get materialGroups" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get materialGroups" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.MATERIAL_GROUP_GET + utils.prepareQeuryParams(oQuery) ;
            //console.log("materialGroup get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateMaterialGroup = function(materialGroup_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update materialGroup" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update materialGroup" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialGroup update called" + materialGroup_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.MATERIAL_GROUP_UPDATE + materialGroup_id, data, parseSuccessResp, parseFailureResp);
        };

        this.addMaterialGroup = function(materialGroup, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add materialGroup" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add materialGroup" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialGroup add called " + JSON.stringify(materialGroup));
            HTTPConnection.post(URL.MATERIAL_GROUP_ADD, materialGroup, parseSuccessResp, parseFailureResp);
        };

        this.deleteMaterialGroup = function(materialGroup, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete materialGroup" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete materialGroup" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialGroup delete called" + materialGroup._id + " " + materialGroup.full_name);
            HTTPConnection.delete(URL.MATERIAL_GROUP_DELETE + materialGroup._id, materialGroup, parseSuccessResp, parseFailureResp);
        };


        ////////////////////////////////////////////////////////////////
        this.getMaterialTypes = function(oQuery,success,failure) {
            var parseSuccessResp = function(data){
                //console.log("success get materialTypes" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure get materialTypes" + JSON.stringify(data));
                failure(data.data);
            };
            var url_with_params = URL.MATERIAL_TYPE_GET + utils.prepareQeuryParams(oQuery) ;
            //console.log("materialType get called" + url_with_params);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.updateMaterialType = function(materialType_id, data, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success update materialType" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure update materialType" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialType update called" + materialType_id + " " + JSON.stringify(data));
            HTTPConnection.put(URL.MATERIAL_TYPE_UPDATE + materialType_id, data, parseSuccessResp, parseFailureResp);
        };

        this.addMaterialType = function(materialType, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success add materialType" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure add materialType" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialType add called " + JSON.stringify(materialType));
            HTTPConnection.post(URL.MATERIAL_TYPE_ADD, materialType, parseSuccessResp, parseFailureResp);
        };

        this.deleteMaterialType = function(materialType, success, failure) {
            var parseSuccessResp = function(data){
                //console.log("success delete materialType" + JSON.stringify(data));
                success(data.data);
            };
            var parseFailureResp = function(data){
                //console.log("failure delete materialType" + JSON.stringify(data));
                failure(data.data);
            };
            //console.log("materialType delete called" + materialType._id + " " + materialType.full_name);
            HTTPConnection.delete(URL.MATERIAL_TYPE_DELETE + materialType._id, materialType, parseSuccessResp, parseFailureResp);
        };

        this.getAllMaterial = function(oQuery,success, failure) {
            var url_with_params = URL.GET_MATERIAL + utils.prepareQeuryParams(oQuery) ;
            HTTPConnection.get(url_with_params, success, failure);
        }
    }]);
