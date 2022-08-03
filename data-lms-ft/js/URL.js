materialAdmin.service("URL", [
	"DateUtils",
	"$location",
	function (DateUtils, $location) {
		var oConfig;
		var urlParams = $location.search();
		if (urlParams && urlParams.source) {
			oConfig = getAppConfig(urlParams.source);
		} else {
			oConfig = getAppConfig();
		}
		this.BASE_URL = oConfig.base_url;
		this.DOC_URL = oConfig.doc_url;
		this.REPORTING_URL = oConfig.reporting_url;
		this.SEARCH_URL = oConfig.search_url || oConfig.reporting_url;
		this.TRUCKU_URL = oConfig.trucku_url;
		this.GEO_URL = oConfig.geo_url || 'http://13.229.178.235:4242/';
		this.file_server = oConfig.file_server;
		this.app_key = oConfig.app_key;
		this.LOGIN = this.BASE_URL + "auth/login/";
		this.getDBFileURL = this.BASE_URL + "documents/view/";

		// FILES URL
		this.FILE_URL_CLIENT = this.FILE_URL + "clients/";

		this.DASHBOARD_STATS = this.BASE_URL + "api/dashboard/stats/";

		//CREDIT NOTE
		this.GET_CREDIT_NOTE = this.BASE_URL + "api/creditNote/get";
		this.ADD_CREDIT_NOTE = this.BASE_URL + "api/creditNote/add";
		this.EDIT_CREDIT_NOTE = this.BASE_URL + "api/creditNote/edit/";
		this.UNAPPROVE_CREDIT_NOTE = this.BASE_URL + "api/creditNote/unapprove/";
		this.REMOVE_CREDIT_NOTE = this.BASE_URL + "api/creditNote/remove/";
		this.CREDIT_NOTE_DED_RPT = this.BASE_URL + "api/creditNote/dedRpt";
		this.ADD_MISC_CREDIT_NOTE = this.BASE_URL + "api/creditNote/addMisc";
		this.EDIT_MISC_CREDIT_NOTE = this.BASE_URL + "api/creditNote/editMisc/";
		this.DELETE_MISC_CREDIT_NOTE = this.BASE_URL + "api/creditNote/deleteMisc/";

		// DEBIT NOTE
		this.GET_DEBIT_NOTE = this.BASE_URL + "api/debitNote/get";
		this.ADD_DEBIT_NOTE = this.BASE_URL + "api/debitNote/add";
		this.EDIT_DEBIT_NOTE = this.BASE_URL + "api/debitNote/edit/";
		this.UNAPPROVE_DEBIT_NOTE = this.BASE_URL + "api/debitNote/unapprove/";
		this.REMOVE_DEBIT_NOTE = this.BASE_URL + "api/debitNote/remove/";

		//MONEY RECEIPT
		this.GET_MONEY_RECEIPT = this.BASE_URL + "api/moneyReceipt/get";
		this.ADD_MONEY_RECEIPT = this.BASE_URL + "api/moneyReceipt/add";
		this.ADD_MONEY_RECEIPTV2 = this.BASE_URL + "api/moneyReceipt/addV2";
		this.EDIT_MONEY_RECEIPT = this.BASE_URL + "api/moneyReceipt/edit/";
		this.EDIT_MONEY_RECEIPTV2 = this.BASE_URL + "api/moneyReceipt/editV2/";
		this.REMOVE_MONEY_RECEIPT = this.BASE_URL + "api/moneyReceipt/remove/";
		this.PULL_VOUCHER = this.BASE_URL + "api/moneyReceipt/pullVoucher/";
		this.VOUCHER_PRINT = this.BASE_URL + "api/pdf/voucher/";

		//Geo Mis Config
		this.POST_MIS_CONFIG_GET = this.GEO_URL + "mis/get/";
		this.POST_MIS_CONFIG_SAVE = this.GEO_URL + "mis/add/";
		this.PUT_MIS_CONFIG_EDIT = this.GEO_URL + "mis/upsert/";
		this.POST_MIS_CONFIG_DELETE = this.GEO_URL + "mis/delete/";

		// client urls
		this.CLIENT_GET = this.BASE_URL + "api/client/get/";
		this.CLIENT_BY_ID = this.BASE_URL + "api/client/findById/";
		this.CLIENT_ADD = this.BASE_URL + "api/client/add/";
		this.CLIENT_UPDATE = this.BASE_URL + "api/client/update/";
		this.CLIENT_DELETE = this.BASE_URL + "api/client/delete/";
		//this.CLIENT_BUILTY = this.BASE_URL + 'api/client/createBuilty'
		this.CLIENT_BUILTY = this.BASE_URL + "api/pdf/createGR";
		this.GR_WITHOUT_TRIP_BUILTY =
			this.BASE_URL + "api/pdf/createGR_withoutTrip";
		this.TRIP_PERFORMANCE_BUILTY =
			this.BASE_URL + "api/pdf/tripPerfBillGenerate";
		this.MULT_VEND_SLIP_BUILTY = this.BASE_URL + "api/pdf/multiAdvPreview";
		this.TRIP_PRINT =
			this.BASE_URL + "api/pdf/getTrip";
		this.CLIENT_DIESEL = this.BASE_URL + "api/pdf/diesel";
		this.CLIENT_UPLOAD_FILE = this.BASE_URL + "api/upload/client/";
		this.USER_PASS_RESET = this.BASE_URL + "auth/resetPassword/";
		this.USER_PASS_UPDATE = this.BASE_URL + "auth/updatePassword/";

		//trip memo
		this.CLIENT_NEW_BUILTY = this.BASE_URL + "api/pdf/tripMemo";
		this.GET_EWB2  = this.BASE_URL + 'api/ewaybill/get2';
		this.GET_EWB  = this.BASE_URL + 'api/ewaybill/get';

		// user management urls
		this.USER_GET = this.BASE_URL + "api/users/get";
		this.USER_GET_TRIM = this.BASE_URL + "api/users/get?trim=true";
		this.USER_ADD = this.BASE_URL + "api/users/add/";
		this.USER_UPDATE = this.BASE_URL + "api/users/update/";
		this.USER_DELETE = this.BASE_URL + "api/users/delete/";
		this.USER_UPLOAD_FILE = this.BASE_URL + "api/upload/user/";
		this.USER_IS_AVAILIABLE = this.BASE_URL + "api/users/isAvailable/";
		this.GET_PASS = this.BASE_URL + "api/users/fetch_password_lms/";

		// role management urls
		// this.ROLE_GET = this.BASE_URL + "api/roles/get/"
		this.ROLE_GET = this.BASE_URL + "api/roles/get/";
		this.ROLE_ADD = this.BASE_URL + "api/roles/add/";
		this.ROLE_UPDATE = this.BASE_URL + "api/roles/update/";
		this.ROLE_DELETE = this.BASE_URL + "api/roles/delete/";

		// ACCESS CONTROL
		this.ACCESS_GET = this.BASE_URL + "api/accesscontrol/getall/";
		this.ACCESS_UPDATE = this.BASE_URL + "api/accesscontrol/update/";
		this.ACCESS_DELETE = this.BASE_URL + "api/accesscontrol/remove/";

		// department management urls
		this.DEPARTMENT_GET = this.BASE_URL + "api/department/get/";
		this.DEPARTMENT_GET_TRIM = this.BASE_URL + "api/department/get/trim/";
		this.DEPARTMENT_ADD = this.BASE_URL + "api/department/add/";
		this.DEPARTMENT_UPDATE = this.BASE_URL + "api/department/update/";
		this.DEPARTMENT_DELETE = this.BASE_URL + "api/department/delete/";

		// material management url's
		this.MATERIAL_GROUP_ADD = this.BASE_URL + "api/material/group/add/";
		this.MATERIAL_GROUP_GET = this.BASE_URL + "api/material/group/get/";
		this.MATERIAL_GROUP_UPDATE = this.BASE_URL + "api/material/group/update/";
		this.MATERIAL_GROUP_DELETE = this.BASE_URL + "api/material/group/delete/";
		this.MATERIAL_TYPE_ADD = this.BASE_URL + "api/material/type/add/";
		this.MATERIAL_TYPE_GET = this.BASE_URL + "api/material/type/get/";
		this.MATERIAL_TYPE_UPDATE = this.BASE_URL + "api/material/type/update/";
		this.MATERIAL_TYPE_DELETE = this.BASE_URL + "api/material/type/delete/";

		this.CHECK_USER_AVAILABLE = this.BASE_URL + "api/users/isAvailable";
		this.DRIVER = this.BASE_URL + "api/driver/get/";
		this.CUSTOMER = this.BASE_URL + "api/customer/get";
		this.CUSTOMER_SEARCH = this.BASE_URL + "api/customer/get/trim";
		this.CUSTOMER_ADD = this.BASE_URL + "api/customer/add";
		this.CUSTOMER_UPDATE = this.BASE_URL + "api/customer/update";
		this.DELETE_CONFIG = this.BASE_URL + "api/customer/deleteConfig";
		this.CONTRACT = this.BASE_URL + "api/contract/get";
		this.CONTRACT_ADD = this.BASE_URL + "api/contract/add";
		this.CONTRACT_UPDATE = this.BASE_URL + "api/contract/update";
		this.CONTRACT_CLONE = this.BASE_URL + "api/contract/renew";
		this.RATES = this.BASE_URL + "api/routedata/get";
		this.GET_TRACKING = this.BASE_URL + "api/routedata/getTracking";
		this.NEW_RATES = this.BASE_URL + "api/routedata/latest_rate";
		this.RATES_ADD = this.BASE_URL + "api/routedata/add";
		this.ADD_ROUTE_TRACKING = this.BASE_URL + "api/routedata/addRouteTracking";
		this.UPSERT_ROUTE_TRACKING = this.BASE_URL + "api/routedata/editRouteTracking/";
		this.RATE_UPDATE = this.BASE_URL + "api/routedata/update";
		this.UPDATE_CUSTOMER_STATUS = this.BASE_URL + "api/customer/delete/";

		// Fleet
		this.FLEET_GET = this.BASE_URL + "api/fleet/get";
		this.FLEET_SAVE = this.BASE_URL + "api/fleet/add";
		this.FLEET_UPDATE = this.BASE_URL + "api/fleet/update";
		this.FLEET_DELETE = this.BASE_URL + "api/fleet/delete";
		this.VEHICLE_FLEET_SEGMENT = this.BASE_URL + "api/fleet/fleet_segment";

		// Driver
		this.DRIVER_POST = this.BASE_URL + "api/driver/add";
		this.DRIVER_UPDATE = this.BASE_URL + "api/driver/update";
		this.UPLOAD = this.BASE_URL + "api/upload";
		this.DRIVER_TRIM = this.BASE_URL + "api/driver/get/trim";
		this.DRIVER_ALL = this.BASE_URL + "api/driver/get/trim/?all=true";
		this.DRIVER_ATTACH_HAPPAY = this.BASE_URL + "api/driver/addHappay/";
		this.UPDATE_DRIVER_STATUS = this.BASE_URL + "api/driver/delete/";
		this.DRIVER_REPORT = this.BASE_URL + "api/driver/report";

		//BillingParty
		this.BILLING_PARTY_GET = this.SEARCH_URL + "api/billingParty/get";
		this.BILLING_PARTY_ADD = this.BASE_URL + "api/billingParty/add";
		this.BILLING_PARTY_UPDATE = this.BASE_URL + "api/billingParty/update/";
		this.BILLING_PARTY_DELETE = this.BASE_URL + "api/billingParty/delete/";
		this.DELETE_BP_CONFIG = this.BASE_URL + "api/billingParty/deleteConfig/";

		//Consignor/Consignee
		this.CONSIGNOR_CONSIGNEE_GET =
			this.SEARCH_URL + "api/consignor_consignee/get";
		this.CONSIGNOR_CONSIGNEE_ADD =
			this.BASE_URL + "api/consignor_consignee/add";
		this.CONSIGNOR_CONSIGNEE_UPDATE =
			this.BASE_URL + "api/consignor_consignee/update/";
		this.CONSIGNOR_CONSIGNEE_DELETE =
			this.BASE_URL + "api/consignor_consignee/delete/";

		// Get Vendor
		this.VENDOR = this.BASE_URL + "api/vendor/transport/get/";
		this.VENDOR_ID = this.BASE_URL + "api/vendor/transport/id/";
		this.VENDOR_POST = this.BASE_URL + "api/vendor/transport/add";
		this.VENDOR_UPDATE = this.BASE_URL + "api/vendor/transport/update";
		this.VENDOR_DELETE = this.BASE_URL + "api/vendor/transport/delete/";
		this.VENDOR_TRIM = this.BASE_URL + "api/vendor/transport/get/trim";
		this.ADD_VENDOR_ROUTE = this.BASE_URL + "api/vendorRoute/add";
		this.GET_VENDOR_ROUTE = this.BASE_URL + "api/vendorRoute/get";
		this.UPDATE_VENDOR_ROUTE = this.BASE_URL + "api/vendorRoute/update";
		this.REG_ON_THE_GO = this.BASE_URL + "api/vendor/transport/reg_on_the_go";

		// Courier Vendor
		this.VENDORCOURIER_GET = this.BASE_URL + "api/vendor/courier/get/";
		this.VENDORCOURIER_GET_TRIM = this.BASE_URL + "api/vendor/courier/get/trim";
		this.VENDORCOURIER_ALL = this.BASE_URL + "api/vendor/courier/get/?all=true";
		this.VENDORCOURIER_ADD = this.BASE_URL + "api/vendor/courier/add/";
		this.VENDORCOURIER_UPDATE = this.BASE_URL + "api/vendor/courier/update/";
		this.VENDORCOURIER_DELETE = this.BASE_URL + "api/vendor/courier/delete/";
		this.VENDORCOURIER_OFFICES_GET = this.BASE_URL + "api/courier_office/get/";
		this.VENDORCOURIER_OFFICES_ADD = this.BASE_URL + "api/courier_office/add";
		this.VENDORCOURIER_OFFICES_UPDATE =
			this.BASE_URL + "api/courier_office/update/";

		// Fuel Vendor
		this.VENDORFUEL_GET = this.BASE_URL + "api/vendor/fuel/get/";
		this.VENDORFUEL_GET_TRIM = this.BASE_URL + "api/vendor/fuel/get/trim";
		this.VENDORFUEL_ADD = this.BASE_URL + "api/vendor/fuel/add/";
		this.VENDORFUEL_UPDATE = this.BASE_URL + "api/vendor/fuel/update/";
		this.VENDORFUEL_DELETE = this.BASE_URL + "api/vendor/fuel/delete/";

		// Maintenance Vendor
		this.VENDORMAINTENANCE_GET = this.BASE_URL + "api/vendor/maintenance/get/";
		this.VENDORMAINTENANCE_GET_TRIM =
			this.BASE_URL + "api/vendor/maintenance/get/trim";
		this.VENDORMAINTENANCE_ADD = this.BASE_URL + "api/vendor/maintenance/add/";
		this.VENDORMAINTENANCE_DELETE =
			this.BASE_URL + "api/vendor/maintenance/delete/";
		this.VENDORMAINTENANCE_UPDATE =
			this.BASE_URL + "api/vendor/maintenance/update/";

		// ICDs
		this.ICD_GET = this.BASE_URL + "api/icd/get/";
		this.ICD_GET_TRIM = this.BASE_URL + "api/icd/get/trim";
		this.ICD_ADD = this.BASE_URL + "api/icd/add/";
		this.ICD_UPDATE = this.BASE_URL + "api/icd/update/";
		this.ICD_DELETE = this.BASE_URL + "api/icd/delete/";

		// Get Vehicle
		this.VEHICLE = this.SEARCH_URL + "api/regvehicle/get/";
		this.GET_ASSETS = this.REPORTING_URL + "api/assets/get/";
		this.UPDATE_ASSETS_BIll = this.REPORTING_URL + "api/bills/purAssetsUpdate/";
		this.ADD_ASSETS_BILL = this.REPORTING_URL + "api/bills/purAssetsAdd/";
		this.DELETE_ASSETS_BILL = this.REPORTING_URL + "api/bills/purAssetsRemove/";
		this.UNAPPROVE_ASSETS_BILL =
			this.REPORTING_URL + "api/bills/purAssetsUnappove/";
		this.ASSETS_DEP = this.REPORTING_URL + "api/assets/assetsDepreciation/";
		this.VEHICLE_FOR_ALLOC =
			this.BASE_URL + "api/regvehicle/vehicles-for-allocation";
		this.VEHICLE_REPORT = this.BASE_URL + "api/regvehicle/report";
		this.VEHICLE_POST = this.BASE_URL + "api/regvehicle/add";
		this.VEHICLE_CHECK = this.BASE_URL + "api/regvehicle/vehiclecheck";
		this.VEHICLE_ADD_RATES = this.BASE_URL + "api/regvehicle/addrates/";
		this.VEH_RATE_UPLOAD = this.BASE_URL + 'api/regvehicle/uploadRates/';
		this.VEHICLE_RATES_GET = this.BASE_URL + 'api/regvehicle/getrates/';
		this.VEHICLE_ASSOCIATE_SEGMENT =
			this.BASE_URL + "api/regvehicle/associate_segment";
		this.VEHICLE_UPDATE = this.BASE_URL + "api/regvehicle/update";
		this.REG_VEHICLE_UPDATE = this.BASE_URL + "api/regvehicle/updateRegVehicle";
		this.VEHICLE_UPLOAD = this.BASE_URL + "api/regvehicle/upload";
		this.VEHICLE_DELETE = this.BASE_URL + "api/regvehicle/delete/";
		this.DELETE_STATUS = this.BASE_URL + "api/regvehicle/delete/";
		this.VEHICLE_TRIM = this.SEARCH_URL + "api/regvehicle/get/trim";
		this.VEHICLE_OWNED =
			this.BASE_URL + "api/regvehicle/get?own=true&trim=true";
		this.VEHICLE_OWNED_HORSE =
			this.BASE_URL +
			"api/regvehicle/get?own=true&trim=true&category=Horse&all=true";
		this.VEHICLE_OWNED_HORSE_AVAILABLE =
			this.BASE_URL +
			"api/regvehicle/get?all=true&own=true&trim=true&category=Horse&associationFlag=false";
		this.VEHICLE_GROUP = this.BASE_URL + "api/vehicle/group/add";
		this.VEHICLE_GROUP_GET = this.BASE_URL + "api/vehicle/group/get/";
		this.VEHICLE_VEHICLE_POST = this.BASE_URL + "api/vehicle/type/add";
		this.VEHICLE_GROUPVEHICLE_GET = this.BASE_URL + "api/vehicle/get/";
		this.VEHICLE_GROUP_DELETE = this.BASE_URL + "api/vehicle/group/delete/";
		this.VEHICLE_GROUP_EDIT = this.BASE_URL + "api/vehicle/group/update/";
		this.VEHICLE_TYPEVEHICLE_GET = this.BASE_URL + "api/vehicle/type/get/";
		this.VEHICLE_TYPE_EDIT = this.BASE_URL + "api/vehicle/type/update/";
		this.VEH_TYPE_ALL = this.BASE_URL + "api/vehicle/type/get/trim/";
		this.VEH_TYPE_MULTIUPDATE = this.BASE_URL + "api/vehicle/type/updatemulti/";
		this.VEHICLE_ATTACH_FASTTAG = this.BASE_URL + "api/regvehicle/addFasttag/";

		// Accident Vehicle
		this.VEHICLE_ACCIDENT_GET = this.BASE_URL + "api/accidentVehicle/get/";
		this.CURRENT_VEHICLE_GET =
			this.BASE_URL + "api/accidentVehicle/Currentvehicle/get/";
		this.VEHICLE_ACCIDENT_ADD = this.BASE_URL + "api/accidentVehicle/add";
		this.VEHICLE_ACCIDENT_UPDATE =
			this.BASE_URL + "api/accidentVehicle/update/";
		this.VEHICLE_ACCIDENT_DELETE =
			this.BASE_URL + "api/accidentVehicle/delete/";

		// Get Routes
		this.TransporterRoutes = this.SEARCH_URL + "api/transportroute/get/";
		this.TransporterRoutes_UPDATE =
			this.BASE_URL + "api/transportroute/update/";
		this.TransporterRoutes_Post = this.BASE_URL + "api/transportroute/add";
		this.TransporterRoutes_GET_TRIM =
			this.BASE_URL + "api/transportroute/get/trim";
		this.TransporterRoutes_ALL =
			this.BASE_URL + "api/transportroute/get/?all=true";
		this.UPDATE_KM = this.BASE_URL + 'api/transportroute/update/';
		// Get SLDO
		this.SLDO_GET = this.BASE_URL + "api/shippingline/get/";
		this.SLDO_POST = this.BASE_URL + "api/shippingline/add";

		// Branch
		this.BRANCH_GET = this.SEARCH_URL + "api/branch/get/";
		this.BRANCH_ADD = this.BASE_URL + "api/branch/add/";
		this.BRANCH_UPDATE = this.BASE_URL + "api/branch/update/";
		this.BRANCH_DELETE = this.BASE_URL + "api/branch/delete/";
		this.ENABLE_DISABLE = this.BASE_URL + "api/branch/enabledisable/";
		this.BRANCH_GET_TRIM = this.BASE_URL + "api/branch/get/trim/";
		this.BRANCH_MAINTENANCE_GET = this.BASE_URL + "api/branch/get/maintenance/";
		this.BRANCH_ALL = this.BASE_URL + "api/branch/get/trim/?all=true";

		// Department branch
		this.DEPARTMENTBRANCH_ADD = this.BASE_URL + "api/departmentBranch/add/";
		this.DEPARTMENTBRANCH_UPDATE =
			this.BASE_URL + "api/departmentBranch/update/";
		this.DEPARTMENTBRANCH_DELETE =
			this.BASE_URL + "api/departmentBranch/delete/";

		// Booking
		this.BOOKING_GET = this.BASE_URL + "api/bookings/get";
		this.BOOKING_ADD = this.BASE_URL + "api/bookings/add/";
		this.BOOKING_ADD_TRIP_GR = this.BASE_URL + "api/bookings/createGR/";
		this.BOOKING_UPDATE = this.BASE_URL + "api/bookings/update";
		this.BOOKING_ITEMS = this.BASE_URL + "api/bookings/items/";
		this.DELETE_BOOKING = this.BASE_URL + "api/bookings/delete/";
		this.ALLOTE_VEHICLE = this.BASE_URL + "api/trips/allocateVehicle";
		this.ADD_TRAFFIC_MANAGER_ON_BOOKING = this.BASE_URL + "api/bookings/assign";

		// Quotation
		this.QUOTATION_GET = this.BASE_URL + "api/vendorQuotes/getQuote";
		this.QUOTATION_UPDATE = this.BASE_URL + "api/vendorQuotes/updateQuote";
		this.QUOTATION_ADD = this.BASE_URL + "api/vendorQuotes/addQuote";
		this.QUOTATION_DELETE = this.BASE_URL + "api/vendorQuotes/removeQuote";
		this.QUOTATION_REMARK = this.BASE_URL + "api/vendorQuotes/quoteRemark";
		this.QUOTATION_FINALIZE = this.BASE_URL + "api/vendorQuotes/finaliseQuote";
		this.REVERT_QUOTATION_FINALIZE =
			this.BASE_URL + "api/vendorQuotes/revertQuote";

		//GEN BILL
		this.GET_GEN_BILLS = this.BASE_URL + "api/genBill/get";
		this.ADD_GEN_BILL = this.BASE_URL + "api/genBill/add";
		this.UPDATE_GEN_BILL = this.BASE_URL + "api/genBill/update/";
		this.REMOVE_GEN_BILL = this.BASE_URL + "api/genBill/remove/";
		this.UNAPPROVE_GEN_BILL = this.BASE_URL + "api/genBill/unApprove/";
		this.CANCEL_GEN_BILL = this.BASE_URL + "api/genBill/cancel/";
		this.APPROVE_GEN_BILL = this.BASE_URL + "api/genBill/approve/";
		this.DELETE_GEN_BILL = this.BASE_URL + "api/genBill/delete/";

		this.UNIVERSAL_DOCUMENT_UPLOAD = this.BASE_URL + "documents/upload";
		this.DOC_UPLOAD = this.BASE_URL + "api/dms/save/";
		this.DELETE_FILE = this.BASE_URL + "api/dms/deleteImg/";
		this.DOC_VALIDATION = this.BASE_URL + "api/dms/validate/";
		this.GET_ALL_DOCS = this.BASE_URL + "api/dms/get/";
		this.GET_ALL_DOCS_V = this.BASE_URL + "api/dms/getV2/";

		this.VEHICLE_GROUP_REPORT = this.BASE_URL + "api/trips/report_fleet_owner";
		this.FLEET_OWNER_REPORT = this.BASE_URL + "api/trips/report_fleet_owner";
		this.DEALLOTE_VEHICLE = this.BASE_URL + "api/trips/deallocateVehicle";
		this.APPROVE_UPDATE = this.BASE_URL + "api/bookings/approveUpdate";
		this.USERS = this.BASE_URL + "api/users";
		this.TRIP_LOCATION_GET = this.BASE_URL + "api/tripLocation/get/";
		this.VEHICLE_ALLOCATE = this.BASE_URL + "api/trips/vehicle_allocate";
		this.CREATE_TRIP = this.BASE_URL + "api/trips/createTrip";

		this.LIVE_TRACKING_DATA = this.BASE_URL + "api/liveTrack/get";
		this.SAVE_LIVE_DATA = this.BASE_URL + "api/liveTrack/add";
		this.DELETE_LIVE_DATA = this.BASE_URL + "api/liveTrack/delete/";
		this.UPDATE_LIVE_DATA = this.BASE_URL + "api/liveTrack/update";

		this.UPDATE_USER_TABLE_CONFIG =
			this.BASE_URL + "api/tableAccess/updateUserTableConfig";
		this.UPDATE_TABLE_CONFIG =
			this.BASE_URL + "api/tableAccess/updateTableConfig";
		this.ACCESS_TABLE_COL_SET =
			this.BASE_URL + "api/tableAccess/getAllTableCol/";
		// END

		// Trips
		this.GRITEM_GET = this.SEARCH_URL + "api/trip_gr/get";
		this.GET_ALL_GR = this.SEARCH_URL + "api/trip_gr/getGr";
		this.GET_GR_TRIM = this.SEARCH_URL + "api/trip_gr/getGrTrim";
		this.SYNC_STATUS = this.REPORTING_URL + "api/trip_gr/syncStatus";
		this.GET_GR = this.BASE_URL + "api/trip_gr/";
		this.GR_NUMBER_ADD = this.BASE_URL + "api/trip_gr/add_gr_number/";
		this.ADD_GR = this.BASE_URL + "api/trip_gr/addGr/";
		// CHANGE DRIVER
		this.DRIVER_CHANGE = this.BASE_URL + "api/vehicledriverasso/getV2";
		// this.GR_ITEM_UPDATE = this.BASE_URL + 'api/trip_gr/update/';
		this.GR_ITEM_UPDATE = this.BASE_URL + "api/trip_gr/updateProp/";
		this.GR_REMARK_UPDATE = this.BASE_URL + "api/trip_gr/pending_gr_remark/";
		this.TRIP_GET = this.BASE_URL + "api/trips/get";
		this.TRIP_ALERTS = this.BASE_URL + "api/trips/getAlerts";
		this.TRIP_GET_V2 = this.REPORTING_URL + "api/trips/getV2";
		//this.GET_TRIP_V2 = this.REPORTING_URL + 'api/trips/getV2';
		this.GET_TRIP_V2 = this.REPORTING_URL + "api/trips/getTripV2";
		this.GET_ROUND_TRIP = this.REPORTING_URL + "api/trips/roundTrip";
		this.TRIP_SETTLE_PREVIEW = this.REPORTING_URL + "api/pdf/tripSettlPreview/";
		this.TRIP_REPORT_NEW = this.REPORTING_URL + "api/trips/reports";
		this.JOBORDER_REPORT = this.REPORTING_URL + "api/trips/jobOrderReport";
		this.JOBRISKY_REPORT = this.REPORTING_URL + "api/trips/jobOrderRiskyReport";
		this.JOBPOWERCONNECT_REPORT = this.REPORTING_URL + "api/trips/jobOrderPowerConnectReport";
		this.TRIP_MEMO_REPORT = this.REPORTING_URL + "api/trip_memo/get_trip_memo";
		this.TRIP_COMP_REPORT_NEW = this.REPORTING_URL + "api/trips/tripComparison";
		this.TRIP_Settl_REPORT_NEW =
			this.REPORTING_URL + "api/trips/tripsheetSummReport";
		this.TRIP_SETTLE_CSV_NEW = this.REPORTING_URL + "api/trips/settleNew";
		this.TRIP_UNSETTLE_CSV_NEW = this.REPORTING_URL + "api/trips/unSettleNew";
		this.TRIP_RECO_REPORT_NEW = this.REPORTING_URL + "api/trips/recoreports";
		this.TRIP_REPORT_DETAIL_NEW =
			this.REPORTING_URL + "api/trips/detailreports"; // new
		this.CREATE_EMPTY_TRIP = this.BASE_URL + "api/trips/empty-trip";
		this.TRIP_REPORT = this.REPORTING_URL + "api/reports/trip/aggregate";
		this.APPROVED_PAYMENT_REPORT =
			this.REPORTING_URL + "api/trips/approvedBudget/all?";
		this.FUEL_VENDOR_REPORT = this.REPORTING_URL + "api/reports/fuelVendor";
		this.TRIP_IDLE_HOUR_REPORT = this.REPORTING_URL + "api/reports";
		this.TRIP_UPDATE = this.BASE_URL + "api/trips/update";
		this.GR_DETAILS_UPDATE = this.BASE_URL + "api/trips/gr_update/update/";
		this.TRIP_UPDATE_INFO = this.BASE_URL + "api/trips/update";
		this.TRIP_UPDATE_VEH = this.BASE_URL + "api/trips/updateVehicle";
		this.TRIP_ASK_PAYMENT = this.BASE_URL + "api/trips/askpayment";
		this.TRIP_UPDATE_STATUS = this.BASE_URL + "api/trips/update_status";
		this.TRIP_UPDATE_BULK_STATUS = this.BASE_URL + "api/trips/bulkStatusUpdate";
		this.ADM_UPDATE_TRIP = this.BASE_URL + "api/trips/adm_update";
		this.UPDATE_GR_STATUS = this.BASE_URL + "api/trip_gr/update_status";
		this.ADM_UPDATE_GR = this.BASE_URL + "api/trip_gr/adm_update";
		this.ADD_ADV_PAYMENT = this.BASE_URL + "api/trip_gr/advance_payment/";
		this.TRIP_CANCEL = this.BASE_URL + "api/trips/cancel";
		this.GET_MATERIAL = this.BASE_URL + "api/material/get";
		this.GR_ACK = this.BASE_URL + "api/trips/gr_ack/";
		this.REVERT_GR_ACK = this.BASE_URL + "api/trip_gr/revertGrAck/";
		this.GR_ACK_DTL_UPDATE = this.BASE_URL + "api/trip_gr/acknowledge_gr/";
		this.PENDINGGR_GET = this.BASE_URL + "api/trips/gr/pending_ack";
		this.CANCEL_GR_FREE = this.BASE_URL + "api/grStatus/freeGR/";
		this.TRIP_UPDATE_LOCATION =
			this.BASE_URL + "api/trips/trip_location/update/";
		this.TRIP_UPLOAD_SLIP = this.BASE_URL + "api/trips/upload_slip/";
		this.UPDATE_TRIP_LOCATION = this.BASE_URL + "api/trips/add_geofence/";
		this.UPDATE_GR_LOCATION = this.BASE_URL + "api/trip_gr/add_geofence/";
		this.REMOVE_TRIP_LOCATION = this.BASE_URL + "api/trips/rm_geofence/";
		this.REMOVE_GR_LOCATION = this.BASE_URL + "api/trip_gr/rm_geofence/";
		this.TRIP_ADVANCES = this.SEARCH_URL + "api/tripAdvances/get";
		this.TRIP_ADVANCES_DOWNLOADONLYADV = this.REPORTING_URL + "api/tripAdvances/downloadOnlyAdv";
		this.TRIP_ADVANCES_RPT =
			this.REPORTING_URL + "api/tripAdvances/tripAdvDateRpt";
		this.TRIP_ADVANCES_DOWNLOAD =
			this.REPORTING_URL + "api/tripAdvances/download";
		this.DIESEL_TRIP_REPORT =
			this.REPORTING_URL + "api/tripAdvances/dieselTripReport";
		this.TRIP_ADVANCES_UPLOAD = this.BASE_URL + "api/tripAdvances/upload";
		this.UPLOAD_ADVANCES_COMPARE =
			this.BASE_URL + "api/tripAdvances/comparision";
		this.CREATE_VOUCHERS = this.BASE_URL + "api/tripAdvances/createVouchers";
		this.TRIPADV_BILLPREVIEW = this.BASE_URL + "api/pdf/tripAdvBillGenerate/";
		this.FIND_BY_ADVANCE_DATE = this.BASE_URL + "api/trips/findByAdvanceDate";
		this.VENDOR_PAYMENT = this.BASE_URL + "api/trips/vendorPayment";
		this.VENDOR_PAYMENT_DEL = this.BASE_URL + "api/trips/vendorPaymentDel";
		this.VENDOR_DEAL_UPDATE = this.BASE_URL + "api/trips/vendorDeal";
		this.RVT_ACK_DEAL = this.BASE_URL + "api/trips/vendorRvtAck/";
		this.HIRE_PAYMENT_RPT = this.BASE_URL + "api/trips/hirePaymentRpt";
		this.TRIP_MEMO = this.BASE_URL + "api/trip_memo/get_trip_memo";
		this.BROKER_MEMO = this.BASE_URL + "api/brokerMemo/get";
		this.UPDATE_TRIP_MEMO = this.BASE_URL + "api/trip_memo/updateTripMemo/";
		this.UPDATE_BROKER_MEMO = this.BASE_URL + "api/brokerMemo/update/";
		this.CUST_PAYMENT_RECEIPT =
			this.BASE_URL + "api/trip_memo/custPaymentReceipt";
		this.UPDATE_CUST_PAYMENT_RECEIPT =
			this.BASE_URL + "api/trip_memo/custPaymentReceiptEdit";
		this.CUST_PAYMENT_RECEIPT_DEL =
			this.BASE_URL + "api/trip_memo/custPaymentReceiptDel";

		//tirpSettlement
		this.TRIP_ADVANCE_ADD = this.BASE_URL + "api/trips/addAdvance/";
		this.DIESEL_REQ_ADD = this.BASE_URL + "api/trips/dieselReq/";
		this.REVERT_SETTLED_TRIP =
			this.BASE_URL + "api/trips/revertSettleCompletely";
		this.TRIP_ADVANCE_UPDATE = this.BASE_URL + "api/tripAdvances/update/";
		this.TRIP_ADVANCE_REVERSE = this.BASE_URL + "api/tripAdvances/reverse/";
		this.GET_LAST_SETTLE_BAL = this.BASE_URL + "api/trips/vehiclewiseData";
		this.TRIP_ADVANCE_DELETE = this.BASE_URL + "api/tripAdvances/delete/";
		this.TRIP_ADVANCES_DELETE = this.BASE_URL + "api/tripAdvances/delete";
		this.TRIP_ADVANCE_MULTI_ADD = this.BASE_URL + "api/tripAdvances/addMulti";
		this.TRIP_ADVANCE_MULTI_ADD_V2 =
			this.BASE_URL + "api/tripAdvances/addMultiV2";
		this.TRIP_ADVANCE_MULTI_EDIT = this.BASE_URL + "api/tripAdvances/editMulti";
		this.TRIP_ADVANCE_MULTI_DELETE =
			this.BASE_URL + "api/tripAdvances/deleteMulti/";
		this.TRIP_ADVANCE_DELETE_CONTRA =
			this.BASE_URL + "api/tripAdvances/deleteTripContra/";
		this.RE_MAP_TRIP_ADV = this.BASE_URL + "api/tripAdvances/reMapTrip";
		this.UN_MAP_TRIP_ADV = this.BASE_URL + "api/tripAdvances/unMapAdv";
		this.GET_SUMMARY = this.SEARCH_URL + 'api/tripAdvances/summaryGet';
		this.CHECK_CR_DR = this.REPORTING_URL + "api/tripAdvances/checkAdvCrDr";
		this.TRIP_SETTLE = this.BASE_URL + "api/trips/settleTrip/";
		this.UPDATE_SETTLE_TRIP = this.BASE_URL + "api/trips/UpdateSettleTrip/";
		this.TRIP_SETTLE_MARK_COMPLETE = this.BASE_URL + "api/trips/markSettle";
		this.TRIP_SETTLE_ACCMANAGER_RMK =
			this.BASE_URL + "api/trips/settleAcntMangerRmk";
		this.TRIP_SETTLE_COMPLETELY = this.BASE_URL + "api/trips/settleCompletely";
		this.TRIP_PAYMENTS = this.BASE_URL + "api/trips/payments";
		this.TRIP_PAYMENTS_UPDATE = this.BASE_URL + "api/trips/paymentUpdate";
		this.TRIP_SETTLE_ADD_TRIP = this.BASE_URL + "api/trips/advAddTrip";
		this.TRIP_SETTLE_REMOVE_TRIP = this.BASE_URL + "api/trips/advDeleteTrip";
		//// GPS KM GET API
		this.TOTAL_GPS_KM_GET = this.REPORTING_URL + "api/tracking/gpsKmAnalysis";
		this.TRIP_SETTLE_REMOVE_EXPENSE =
			this.BASE_URL + "api/trips/settleExpDeleteTrip";
		this.TRIP_DRIVER_ASSOCIATE = this.BASE_URL + "api/trips/rtTripDriver";

		// Bills
		this.ADDREMARK_MULTIBILLS = this.BASE_URL + "api/bills/addRemarkMultiBills";
		this.PDF_DRIVER = this.BASE_URL + "api/bills/driver";
		this.PDF_DIESEL = this.BASE_URL + "api/bills/diesel";
		this.PDF_BUILTY = this.BASE_URL + "api/bills/builty";
		this.PDF_INVOICE = this.BASE_URL + "api/bills/invoice";
		this.PDF_PO = this.BASE_URL + "api/bills/po";
		this.PDF_PR = this.BASE_URL + "api/bills/prSlip";
		this.PDF_INV_INWARD = this.BASE_URL + "api/bills/inv_inward";
		this.PDF_TOOL_INV_INWARD = this.BASE_URL + "api/bills/tool_inv_inward";
		this.PDF_TYRE_INV_INWARD = this.BASE_URL + "api/bills/tyre_inv_inward";
		this.PDF_JCD = this.BASE_URL + "api/bills/jcd_pdf";
		this.INVOICE_GET = this.BASE_URL + "api/invoice/get/";
		this.INVOICE_UPDATE = this.BASE_URL + "api/invoice/update/";
		this.TRIP_GET_EXPENSE = this.BASE_URL + "api/trip_expenses/get/";
		this.GET_VENDOR_COASTING =
			this.BASE_URL + "api/trip_expenses/getAggregated/";
		this.TRIP_GET_EXPENSE_AGGR =
			this.BASE_URL + "api/trip_expenses/getAggregated/";
		this.TRIP_UPDATE_EXPENSE = this.BASE_URL + "api/trip_expenses/update/";
		this.BILL_DISPATCH_GET = this.BASE_URL + "api/invoice/bill_dispatch/get/";
		this.BILL_DISPATCH_UPDATE =
			this.BASE_URL + "api/invoice/bill_dispatch/update/";
		this.RESET_BILL = this.BASE_URL + "api/invoice/resetBill/";
		this.PREVIEW_TDS = this.BASE_URL + "api/pdf/tds/";
		this.LOADING_SLIP = this.BASE_URL + "api/pdf/loading_slip/";
		this.PREVIEW_TRANSPORTER_SLIP = this.BASE_URL + "api/pdf/loading_slip/";
		this.BILL_PREVIEW = this.REPORTING_URL + "api/pdf/billGenerate/";
		this.GEN_BILL_PREVIEW = this.REPORTING_URL + "api/pdf/genBillGenerate/";
		this.DRIVER_PREVIEW = this.BASE_URL + "api/pdf/driverPreview/";
		this.BILL_PREVIEW_MULTI = this.REPORTING_URL + "api/pdf/multiBillGenerate";
		this.BILL_COVER_NOTE = this.BASE_URL + "api/pdf/coverNote/";
		this.BILL_CREDIT_NOTE = this.BASE_URL + "api/pdf/creditNote/";
		this.BILL_DEBIT_NOTE = this.BASE_URL + "api/pdf/debitNote/";
		this.BILL_MONEY_RECEIPT = this.BASE_URL + "api/pdf/moneyReceipt/";
		this.BILL_PURCHASE_BILL = this.BASE_URL + "api/pdf/purchaseBill/";
		this.TRIP_SUMMARY_PREVIEW = this.BASE_URL + "api/pdf/trip_summary_gen/";
		this.ROUND_TRIP_SUMMARY_PREVIEW =
			this.BASE_URL + "api/pdf/round_trip_summary_gen/";
		this.ROUND_TRIP_DETAILED_SUMMARY_PREVIEW =
			this.BASE_URL + "api/pdf/round_trip_detailed_summary_gen/";
		this.CREDIT_NOTE = this.BASE_URL + "api/bills/creditNote/";
		this.GET_TDS_RATE = this.REPORTING_URL + "api/tdsRate/get/";
		this.LEDGER_PREVIEW = this.REPORTING_URL + "api/pdf/ledgerPreview/";

		this.ADD_EXPENSE_DIESEL = this.BASE_URL + "api/trip_expenses/addExpense";
		this.GET_EXPENSE_DIESEL = this.BASE_URL + "api/trip_expenses/getbytrip/";
		this.ADD_CROSS_DOCKING = this.BASE_URL + "api/trips/crossDocking";

		this.CUSTOMER_PAY_GET = this.BASE_URL + "api/invoice/customer_pay_get/";
		this.CUSTOMER_PAY_UPDATE =
			this.BASE_URL + "api/invoice/customer_pay_update/";
		this.VENDOR_PAY_GET = this.BASE_URL + "api/trip_expenses/vendor_pay_get/";
		this.VENDOR_PAY_UPDATE =
			this.BASE_URL + "api/trip_expenses/vendor_pay_update/";
		this.GET_PROFIT_REPORT =
			this.REPORTING_URL + "api/reports/profitability/post/get";
		this.GET_INITIAL_PROFIT_REPORT =
			this.REPORTING_URL + "api/reports/profitability";
		this.GET_REPORT = this.REPORTING_URL + "api/reports/rtpr";
		this.RTP_EXP_NEW = this.REPORTING_URL + "api/reports/rtprExNew";
		this.POST_RTPR_NEW = this.REPORTING_URL + "api/reports/newRtpr";
		this.RTP_GAP_REPORT = this.REPORTING_URL + "api/reports/rtpGap";
		this.RT_GP_REPORT = this.REPORTING_URL + "api/reports/rtGrossProfit";
		this.COMB_RTWISE_GP_REPORT = this.REPORTING_URL + "api/reports/combineRtWiseGrossProfit";
		this.LAST_SETTLE_RT_REPORT =
			this.REPORTING_URL + "api/reports/lastSettleRtpr";
		this.LAST_SETTLE_RT_REPORT_2 =
			this.REPORTING_URL + "api/reports/lastSettlRtReport";
		this.MONTHLY_PERFORMANCE_REPORT =
			this.REPORTING_URL + "api/trips/vehMonthlyPerformanceRpt";
		this.GET_DLP_DUP_REPORT = this.REPORTING_URL + "api/reports/dlp-dup";
		this.GET_JOB_ORDER_REPORT = this.REPORTING_URL + "api/trips/jobOrderreport";
		this.GET_DRVR_PRF_REPORT =
			this.REPORTING_URL + "api/reports/v2/driverPerformance";
		this.GET_DRVR_ACC_REPORT =
			this.REPORTING_URL + "api/reports/v2/driverAccount";
		this.GET_DRVR_PAYMENT_REPORT =
			this.REPORTING_URL + "api/reports/v2/driverPayment";
		this.GET_FPA_REPORT = this.REPORTING_URL + "api/reports/fpa";
		this.GET_BILLING_PARTY_REPORT = this.REPORTING_URL + "api/bills/report";
		this.GET_BILLINGPARTY_GROUP_REPORT =
			this.REPORTING_URL + "api/trip_gr/grSummary";
		this.GET_CN_DEDUCTION_REPORT =
			this.REPORTING_URL + "api/creditNote/crDeductionReport";
		this.GET_MR_DEDUCTION_REPORT =
			this.REPORTING_URL + "api/moneyReceipt/mrDeductionReport";
		this.GET_MR_CN_DEDUCTION_REPORT =
			this.REPORTING_URL + "api/bills/cn_dr_DeductionReport";
		this.GET_GR_MONTHLY_REPORT = this.REPORTING_URL + "api/trip_gr/report";
		this.GET_UNBILLED_SUMM_REPORT =
			this.REPORTING_URL + "api/trip_gr/outstandingUnbilledReport";
		this.GENE_BILL = this.BASE_URL + "api/invoice/generatebill";
		this.GET_GENE_BILLS = this.BASE_URL + "api/invoice/getbill";
		this.GENE_BILL_DETAILS = this.BASE_URL + "api/invoice/getbill/detail";

		//CoverNote
		this.GET_COVER_NOTE = this.BASE_URL + "api/coverNote/get";
		this.ADD_COVER_NOTE = this.BASE_URL + "api/coverNote/add";
		this.UPDATE_COVER_NOTE = this.BASE_URL + "api/coverNote/edit/";

		//Generate Bill
		this.GEN_BILL = this.BASE_URL + "api/bills/add";
		//Generate Bill WITHOUT GR
		this.GEN_BILL_WITHOUT_GR =
			this.BASE_URL + "api/bills/generateBill_withoutGr";
		this.GEN_MULTI_BILL = this.BASE_URL + "api/bills/genMultiBill";
		this.UPDATE_MULTI_BILL = this.BASE_URL + "api/bills/editMultiBill/";

		this.GEN_MULTI_CR_BILL = this.BASE_URL + "api/bills/genMultiCrBill";
		this.UPDATE_MULTI_crBILL = this.BASE_URL + "api/bills/editMultiCrBill/";
		//Get Generated Bill
		this.GET_GEN_BILL = this.BASE_URL + "api/bills/get";
		this.GET_GEN_BILL_V2 = this.REPORTING_URL + "api/bills/getv2";
		//Update Bill
		this.UPDATE_BILL = this.BASE_URL + "api/bills/update/";
		//Cancel Bill
		this.CANCEL_BILL = this.BASE_URL + "api/bills/cancelBill/";
		//Approve Bill
		this.APPROVE_BILL = this.BASE_URL + "api/bills/approveBill/";
		//Dispatch Bill
		this.DISPATCH_BILL = this.BASE_URL + "api/bills/dispatchBill/";
		//Acknowledge Bill
		this.ACKNOWLEDGE_BILL = this.BASE_URL + "api/bills/acknowledgeBill/";
		//revert ack
		this.REVERT_ACKNOWLEDGE_BILL = this.BASE_URL + "api/bills/revertAckBill/";
		//Bill Settlement Post
		this.BILL_SETTLEMENT = this.REPORTING_URL + "api/bills/bill_settle/";
		this.OUTSTANDING_REPORT =
			this.REPORTING_URL + "api/bills/outstandingReport/";
		this.OUTSTANDING_MONTHLY_REPORT =
			this.REPORTING_URL + "api/bills/outstandingPeriodWiseReport/";
		this.LEDGER_TRANSACTION_REPORT =
			this.REPORTING_URL + "api/bills/ledgerTransactionReport";
		this.LIFE_CYCLE_REPORT = this.REPORTING_URL + "api/bills/billinglifecycle";
		this.MONTHLY_DEDUCTION_REPORT =
			this.REPORTING_URL + "api/moneyReceipt/mrDeductionMonthlyReport";
		this.BP_MONTHLY_REPORT =
			this.REPORTING_URL +
			"api/moneyReceipt/mrDeductionBillingPartyWiseReport/";
		//Bill Amendment Post
		this.BILL_AMENDMENT = this.BASE_URL + "api/bills/amendBill/";
		//cn wise outstanding report
		this.CN_WISE_OUTSTANDING_REPORT =
			this.REPORTING_URL + "api/moneyReceipt/moneyReceiptCNwisereport";
		// GST Sales
		this.GST_SALES_REPORT = this.REPORTING_URL + "api/bills/gstSales";
		// Trip Profit
		this.TRIP_PROFIT_REPORT = this.REPORTING_URL + "api/trips/plReport";
		//ADD DUES Bill
		this.DUES_BILL_ADD = this.BASE_URL + "api/bills/duesBillAdd";
		//UPDATE Dues Bill
		this.DUES_BILL_UPDATE = this.BASE_URL + "api/bills/duesBillUpdate/";

		//Get Purchase Bill
		this.PURCHASE_BILL_GET = this.BASE_URL + "api/bills/purGet";
		//Add Purchase Bill
		this.PURCHASE_BILL_ADD = this.BASE_URL + "api/bills/purAdd";
		//UPDATE Purchase Bill
		this.PURCHASE_BILL_UPDATE = this.BASE_URL + "api/bills/purUpdate/";
		//Diesel Purchase Bill Report
		this.PURCHASE_BILL_DIESEL_REPORT =
			this.BASE_URL + "api/bills/dieselQtyMonthly";
		//Unapprove Purchase Bill
		this.PURCHASE_BILL_UNAPPROVE = this.BASE_URL + "api/bills/purUnappove/";
		//Approve Purchase Bill
		this.PURCHASE_BILL_APPROVE = this.BASE_URL + "api/bills/purAppove/";
		//Remove Purchase Bill
		this.PURCHASE_BILL_REMOVE = this.BASE_URL + "api/bills/purRemove/";
		//add plain_voucher
		this.PLAIN_VOUCHER_ADD = this.BASE_URL + "api/voucher2/add/";
		this.VEHICLE_EXPENSE_ADD = this.BASE_URL + "api/vehicleExp/add/";
		this.VEHICLE_EXPENSE_EDIT = this.BASE_URL + "api/vehicleExp/edit/";
		this.VEHICLE_EXPENSE_DELETE = this.BASE_URL + "api/vehicleExp/delete/";
		this.TDS_PAYMENT = this.BASE_URL + "api/voucher2/tdsPayment/";
		this.GST_PAYMENT_VOUCHER_ADD =
			this.BASE_URL + "api/voucher2/gstPaymentVoucherAdd/";
		this.PLAIN_VOUCHER_EDIT = this.BASE_URL + "api/voucher2/edit/";
		this.BULK_PLAIN_VOUCHER_ADD =
			this.BASE_URL + "api/voucher2/bulkAddPlainVoucher/";
		this.BULK_PLAIN_VOUCHER_UPSERT =
			this.BASE_URL + "api/voucher2/bulkUpsertPlainVoucher/";
		this.PLAIN_VOUCHER_REVERSE = this.BASE_URL + "api/voucher2/reverse/";
		this.GET_BILL_NO = this.REPORTING_URL + "api/voucher2/get/billRefs";
		this.PLAIN_VOUCHER_DELETE = this.BASE_URL + "api/voucher2/delete/";
		//get plain_voucher
		this.PLAIN_VOUCHER_GET = this.REPORTING_URL + "api/voucher2/get/";
		this.VOUCHER_CLEAR_CHEQUE =
			this.REPORTING_URL + "api/voucher2/clearCheque/";
		this.VOUCHER_UNCLEAR_CHEQUE =
			this.REPORTING_URL + "api/voucher2/unclearCheque/";
		this.GSTR1_COMPUTATION_REPORT =
			this.REPORTING_URL + "api/voucher2/getGstComp/";
		// gstr1report summary report and gstr1 monthly report
		this.GSTR1__MONTHLY_REPORT = this.REPORTING_URL + "api/bills/billWise";
		this.GSTR1__SUMMARY_REPORT =
			this.REPORTING_URL + "api/bills/billingPartyWise";
		//  gsrtr1 credit note api
		this.GSTR1__CREDITNOTE_REPORT =
			this.REPORTING_URL + "api/creditNote/creditNoteReport";
		this.GSTR1_PAYMENT_REPORT =
			this.REPORTING_URL + "api/voucher2/getGstPayment/";
		this.PLAIN_VOUCHER_DOWNLOAD =
			this.REPORTING_URL + "api/voucher2/get/report";
		this.TDS_REPORT_DOWNLOAD = this.REPORTING_URL + "api/voucher2/tdsReport";
		// tds report for monthly ,group summary and daywise
		this.TDS_DAY_WISE =
			this.REPORTING_URL + "api/account_balances/TDSGroupSumarryDayWise";
		this.TDS_GROUP_SUMMARY =
			this.REPORTING_URL + "api/account_balances/TDSGroupSumarry";
		this.TDS_MONTHLY =
			this.REPORTING_URL + "api/account_balances/TDSGroupSumarryMonthly";
		///////////////
		this.VOUCHER_TDS_REPORT =
			this.REPORTING_URL + "api/voucher2/tdsMonthlyReport";
		this.CREATE_VOUCHER_COMMON =
			this.BASE_URL + "api/voucher2/create-vouchers-common/";
		//UpdateClientId/ClientR
		this.UPDATE_CLIENT = this.BASE_URL + "api/utility/updateClient";

		// GR MASTER
		this.MASTER_GR_GET_ALL = this.BASE_URL + "api/gr/get";
		this.MASTER_GR_ADD = this.BASE_URL + "api/gr/add";
		this.MASTER_CENTRALIZED_GENERATE = this.BASE_URL + "api/gr/generate_gr";
		this.MASTER_GR_UPDATE = this.BASE_URL + "api/gr/update";
		this.GET_USED_GR_MASTER = this.BASE_URL + "api/grStatus/get";
		this.GET_TRIP_GR = this.REPORTING_URL + "api/trip_gr/get";
		this.CANCEL_TRIP_GR = this.BASE_URL + "api/trip_gr/cancel/";
		this.GR_RECEIVE = this.BASE_URL + "api/trip_gr/grReceive/";
		this.GET_IN = this.BASE_URL + "api/trip_gr/getIn";
		this.ADD_INCIDENTAL = this.BASE_URL + "api/trip_gr/addIn/";
		this.EDIT_INCIDENTAL = this.BASE_URL + "api/trip_gr/editIn/";
		this.UPDATE_NON_BILL_GR = this.BASE_URL + "api/trip_gr/updateNonBillGr/";
		this.MOVE_GR_ANOTHER_TRIP = this.BASE_URL + "api/trip_gr/moveGr/";
		this.MAP_GR_INTO_TRIP = this.BASE_URL + "api/trip_gr/mapGrIntoTrip";
		this.UNMAP_GR_FROM_TRIP = this.BASE_URL + "api/trip_gr/unMapGrFromTrip/";
		this.DELETE_INCIDENTAL = this.BASE_URL + "api/trip_gr/deleteIn/";
		this.GET_FPA_GR = this.BASE_URL + "api/trip_gr/getFpa";
		this.ADD_FPA = this.BASE_URL + "api/trip_gr/addFpa/";
		this.EDIT_FPA = this.BASE_URL + "api/trip_gr/editFpa/";
		this.DELETE_FPA = this.BASE_URL + "api/trip_gr/deleteFpa/";
		this.UPDATE_GR_NUM = this.BASE_URL + "api/trip_gr/updateMultiple/";
		this.COVER_NOTE_FOR_GR = this.BASE_URL + "api/trip_gr/covernotesforgr/";
		this.GR_FOR_COVER_NOTE = this.BASE_URL + "api/trip_gr/grsforcovernote/";
		this.CONVERT_GRS_TO_COVERNOTE =
			this.BASE_URL + "api/trip_gr/convertgrstocovernote/";
		this.CONVERT_COVERNOTES_TO_GR =
			this.BASE_URL + "api/trip_gr/convertcovernotestogr/";

		// TripLocation
		this.MASTER_TRIP_LOC_GET = this.BASE_URL + "api/tripLocation/get/";
		this.MASTER_TRIP_LOC_ADD = this.BASE_URL + "api/tripLocation/add";
		this.MASTER_TRIP_LOC_UPDATE = this.BASE_URL + "api/tripLocation/update/";

		// Driver counselling
		this.MASTER_COUNSELLING_GET = this.BASE_URL + "api/driverCounselling/get/";
		this.MASTER_COUNSELLING_ADD = this.BASE_URL + "api/driverCounselling/add";
		this.MASTER_COUNSELLING_DELETE =
			this.BASE_URL + "api/driverCounselling/delete/";

		// cityState
		this.GET_CITY = this.BASE_URL + "api/city/get";
		this.UPSERT_CITY = this.BASE_URL + "api/city/upsert";
		this.DELETE_CITY = this.BASE_URL + "api/city/remove";
		this.AUTOSUGGESR_CITY = this.BASE_URL + "api/city/autosuggest";

		// cityState
		this.GET_DIRECTORY = this.BASE_URL + "api/directory/get";

		this.GET_IMAGE = this.BASE_URL + "api/download/";
		this.ADD_FUEL_STATION = this.BASE_URL + "api/fuel_station/add";
		this.FUEL_STATION_GET = this.BASE_URL + "api/fuel_station/get";
		this.FUEL_STATION_UPDATE = this.BASE_URL + "api/fuel_station/update";
		this.FUEL_STATION_DELETE = this.BASE_URL + "api/fuel_station/delete";
		this.FUEL_VENDOR_UPDATE = this.BASE_URL + "api/vendor/fuel/update";

		// Reports
		this.LOGS_NOTIFICATION = this.REPORTING_URL + "api/logs/getNotif/";
		this.LOGS_REPORT = this.BASE_URL + "api/logs/getAll/"; //baseUrl to repotingUrl
		this.ADD_REMARK_LOGS = this.BASE_URL + "api/logs/addRemarkLogs/";
		this.BILL_REPORT = this.BASE_URL + "api/invoice/get/";
		this.VEHICLE_REPORT_MASTER = this.BASE_URL + "api/reports/vehicle";
		this.CUSTOMER_REPORT_MASTER = this.BASE_URL + "api/reports/customer/";
		this.BOOKING_REPORT_MASTER =
			this.BASE_URL + "api/reports/booking/aggregate";
		this.GR_REPORT_API = this.BASE_URL + "api/reports/gr/aggregate";
		this.TRIP_REPORT_MASTER = this.REPORTING_URL + "api/reports/trip/";
		this.GR_REPORT_MASTER = this.BASE_URL + "api/reports/gr/";
		this.INVENTORY_REPORT = this.BASE_URL + "api/reports/inventory/";
		this.JOBCARD_REPORT = this.BASE_URL + "api/reports/jobcard/";
		this.PO_REPORT = this.BASE_URL + "api/reports/po/";
		this.SO_REPORT = this.BASE_URL + "api/reports/so/";
		this.TYRE_REPORT = this.BASE_URL + "api/reports/tyre/";
		this.TOOL_REPORT = this.BASE_URL + "api/reports/tool/";
		this.BILL_DISPATCH_REPORT_MASTER = this.BASE_URL + "api/reports/invoice/";
		this.UNBILL_MASTER = this.BASE_URL + "api/reports/unbilled_invoice/";
		this.BILL_MASTER = this.BASE_URL + "api/reports/bills/aggregate";
		this.INCOMPLETE_TRIP = this.BASE_URL + "api/reports/incomplete_trip/";
		this.BILL_DISPATCH_REPORT_FORMATE =
			this.BASE_URL + "api/reports/generated_bills/";
		this.INVENTORY_INWARD_REPORT = this.BASE_URL + "api/reports/spareInward/";
		this.GET_JOBCARD_REPORT = this.BASE_URL + "api/reports/jobcard/aggregate";
		this.GET_JOBCARD_TASK_REPORT =
			this.BASE_URL + "api/reports/mtask/aggregate";
		this.GET_TOOL_REPORT = this.BASE_URL + "api/reports/tool/aggregate";
		this.GET_TOOL_ISSUE_REPORT =
			this.BASE_URL + "api/reports/toolIssue/aggregate";
		this.GET_TYRE_REPORT = this.BASE_URL + "api/reports/tyre/aggregate";
		this.GET_TYRE_SUMMARY_REPORT = this.BASE_URL + "api/reports/tyre/summary";
		this.GET_TYRE_ISSUE_REPORT =
			this.BASE_URL + "api/reports/tyreIssue/aggregate";
		this.GET_TYRE_ISSUE_SUMMARY_REPORT =
			this.BASE_URL + "api/reports/tyreIssue/summary";
		this.GET_TYRE_RETREAD_REPORT =
			this.BASE_URL + "api/reports/tyreRetread/aggregate";
		this.GET_TYRE_ASSOCIATION_REPORT =
			this.BASE_URL + "api/reports/pmtassoc/aggregate";
		this.GET_CONT_EXPENSE_REPORT =
			this.BASE_URL + "api/reports/contractor-expense/aggregate";
		this.GET_EXPENSE_REPORT =
			this.BASE_URL + "api/reports/otherexpense/aggregate";
		this.GET_SPARE_CON_REPORT =
			this.BASE_URL + "api/reports/spareissue/aggregate";
		this.GET_COMBINED_EXP_REPORT =
			this.BASE_URL + "api/reports/combinedexpense";
		this.DIESEL_ESCALATION_REPORT =
			this.BASE_URL + "api/trip_gr/report_diesel_escalation/";
		this.DO_REPORT = this.BASE_URL + "api/reports/contractReport";
		this.PROFIT_REPORT_GR = this.BASE_URL + "api/reports/profitability/gr";

		/****************maintenance module ***********************************************************/
		this.BRAND_ADD = this.BASE_URL + "api/maintenance/brand/add/";
		this.BRAND_GET = this.BASE_URL + "api/maintenance/brand/get/";
		this.BRAND_UPDATE = this.BASE_URL + "api/maintenance/brand/update";

		this.MECHANIC_BASE = this.BASE_URL + "api/maintenance/mechanic/";
		this.MECHANIC_GET = this.MECHANIC_BASE + "get/";
		this.MECHANIC_GET_BY_USER = this.BASE_URL + "api/users/get";
		this.APPROVER_GET = this.BASE_URL + "api/users/get";
		this.MECHANIC_UPDATE = this.MECHANIC_BASE + "update/";
		this.MECHANIC_DELETE = this.MECHANIC_BASE + "delete/";
		this.MECHANIC_ADD = this.MECHANIC_BASE + "add/";

		this.MANUFACTURER_BASE = this.BASE_URL + "api/maintenance/manufacturer/";
		this.MANUFACTURER_GET = this.MANUFACTURER_BASE + "get/";
		this.MANUFACTURER_UPDATE = this.MANUFACTURER_BASE + "update/";
		this.MANUFACTURER_DELETE = this.MANUFACTURER_BASE + "delete/";
		this.MANUFACTURER_ADD = this.MANUFACTURER_BASE + "add/";

		this.PARTCATEGORY_BASE = this.BASE_URL + "api/maintenance/partcategory/";
		this.PARTCATEGORY_GET = this.PARTCATEGORY_BASE + "get/";
		this.PARTCATEGORY_UPDATE = this.PARTCATEGORY_BASE + "update/";
		this.PARTCATEGORY_DELETE = this.PARTCATEGORY_BASE + "delete/";
		this.PARTCATEGORY_ADD = this.PARTCATEGORY_BASE + "add/";

		this.MAINTENANCEVENDOR_ADD = this.BASE_URL + "api/maintenance/vendor/add/";
		this.MAINTENANCEVENDOR_GET = this.BASE_URL + "api/maintenance/vendor/get/";
		this.MAINTENANCEVENDOR_UPDATE =
			this.BASE_URL + "api/maintenance/vendor/update/";
		this.MAINTENANCEVENDOR_DELETE =
			this.BASE_URL + "api/maintenance/vendor/delete/";

		this.DIESEL_GET = this.BASE_URL + "api/maintenance/diesel/get/";
		this.DIESEL_ADD = this.BASE_URL + "api/maintenance/diesel/add/";
		// this.DIESEL_OUT = this.BASE_URL + "api/maintenance/diesel/out/"
		this.DIESEL_SLIP_DOWNLOAD = this.BASE_URL + "api/bills/dieselslip";

		this.CONTRACTOR_GET = this.BASE_URL + "api/maintenance/contractor/get/";
		this.CONTRACTOR_ADD = this.BASE_URL + "api/maintenance/contractor/add/";
		this.CONTRACTOR_UPDATE =
			this.BASE_URL + "api/maintenance/contractor/update/";

		this.HOM_BASE = this.BASE_URL + "api/maintenance/hom/";
		this.HOM_GET = this.HOM_BASE + "get/";
		this.HOM_UPDATE = this.HOM_BASE + "update/";
		this.HOM_DELETE = this.HOM_BASE + "delete/";
		this.HOM_ADD = this.HOM_BASE + "add/";

		this.MODEL_ADD = this.BASE_URL + "api/maintenance/vehicle_model/add/";
		this.MODEL_GET = this.BASE_URL + "api/maintenance/vehicle_model/get/";
		this.MODEL_UPDATE = this.BASE_URL + "api/maintenance/vehicle_model/update";
		this.MODEL_MATRIX_GET =
			this.BASE_URL + "api/maintenance/vehicle_model/matrix/get";
		this.MODEL_MANUFACTURER_GET =
			this.BASE_URL + "api/maintenance/vehicle_model/manufacturers/get/";

		this.TASKMASTER_BASE = this.BASE_URL + "api/maintenance/taskMaster/";
		this.TASKMASTER_GET = this.TASKMASTER_BASE + "get/";
		this.TASKMASTER_UPDATE = this.TASKMASTER_BASE + "update/";
		this.TASKMASTER_DELETE = this.TASKMASTER_BASE + "delete/";
		this.TASKMASTER_ADD = this.TASKMASTER_BASE + "add/";
		this.SPARE_ADD = this.BASE_URL + "api/maintenance/parts/add/";
		this.SPARE_GET = this.BASE_URL + "api/maintenance/parts/get/";
		this.SPARE_UPDATE = this.BASE_URL + "api/maintenance/parts/update";

		// this.GET_LAST_PURCHASE = this.BASE_URL + "api/maintenance/inventory/update"

		this.INVENTORY_ADD = this.BASE_URL + "api/maintenance/inventory/add/";
		this.INVENTORY_GET = this.BASE_URL + "api/maintenance/inventory/get/";
		this.INVENTORY_GET_QTY = this.BASE_URL + "api/maintenance/inventory/getqty";
		this.INVENTORY_UPDATE = this.BASE_URL + "api/maintenance/inventory/update";
		this.INV_SNAPSHOT_GET =
			this.BASE_URL + "api/maintenance/inventory/snapshot";

		this.OTHER_EXPENSES_ADD =
			this.BASE_URL + "api/maintenance/otherExpenses/add/";
		this.OTHER_EXPENSES_GET =
			this.BASE_URL + "api/maintenance/otherExpenses/get/";
		this.OTHER_EXPENSES_UPDATE =
			this.BASE_URL + "api/maintenance/otherExpenses/update";
		this.OTHER_EXPENSES_APPROVE =
			this.BASE_URL + "api/maintenance/otherExpenses/approve";

		this.TOOL_GET = this.BASE_URL + "api/maintenance/tool/get/";
		this.TOOL_ADD = this.BASE_URL + "api/maintenance/tool/add/";

		this.ISSUED_TOOL_GET = this.BASE_URL + "api/maintenance/toolissue/get/";
		this.ISSUE_TOOL = this.BASE_URL + "api/maintenance/toolissue/issue/";
		this.RETURN_TOOL = this.BASE_URL + "api/maintenance/toolissue/return/";

		this.ADD_TYRE = this.BASE_URL + "api/maintenance/tyreMaster/add";
		this.TYREMASTER_GET = this.BASE_URL + "api/maintenance/tyreMaster/get";
		this.TYREMASTER_UPDATE =
			this.BASE_URL + "api/maintenance/tyreMaster/update";

		this.ISSUE_TYRE = this.BASE_URL + "api/maintenance/tyreIssue/issue";
		this.ISSUE_TYRE_REPORT = this.BASE_URL + "api/maintenance/tyreIssue/report";
		this.RETURN_TYRE = this.BASE_URL + "api/maintenance/tyreIssue/return";
		this.GET_ISSUED_TYRE = this.BASE_URL + "api/maintenance/tyreIssue/get";
		this.TYRE_ISSUE_RETREATED =
			this.BASE_URL + "api/maintenance/tyreRetread/issue";
		this.TYRE_ISSUE_RETREATED_GET =
			this.BASE_URL + "api/maintenance/tyreRetread/get";
		this.TYRE_RETURN_RETREATED =
			this.BASE_URL + "api/maintenance/tyreRetread/return";
		this.GET_ASSO_VEH =
			this.BASE_URL + "api/maintenance/primeMoverTrailerAssociation/getAsocVeh";

		this.JOBCARD_GET = this.BASE_URL + "api/maintenance/jobCard/get/";
		this.JOBCARD_ADD = this.BASE_URL + "api/maintenance/jobCard/add/";
		this.UPDATE_JOB_CARD = this.BASE_URL + "api/maintenance/jobCard/update";
		this.JOBCARD_TASK_ADD = this.BASE_URL + "api/maintenance/task/add/";
		this.JOBCARD_TASK_GET = this.BASE_URL + "api/maintenance/task/get/";
		this.JOBCARD_TASK_UPDATE = this.BASE_URL + "api/maintenance/task/update";
		this.UPDATE_EXPENSE =
			this.BASE_URL + "api/maintenance/contractor_expense/update";
		this.GET_EXPENSE = this.BASE_URL + "api/maintenance/contractor_expense/get";
		// this.JOBCARD_TASK_GET = this.BASE_URL + "api/maintenance/spareissue/get/"
		this.TASK_GET_SPARE =
			this.BASE_URL + "api/maintenance/taskmaster/getSpareSuggestion/";
		this.GET_JCD = this.BASE_URL + "api/maintenance/jobCard/jcd";

		this.GET_TASK_CONTRACTOR_EXPENSE =
			this.BASE_URL + "api/maintenance/contractor_expense/get";

		this.USERPREF_BASE = this.BASE_URL + "api/userPref/";
		this.USERPREF_ADD = this.USERPREF_BASE + "add/";
		this.USERPREF_GET = this.USERPREF_BASE + "get/";
		this.USERPREF_UPDATE = this.USERPREF_BASE + "update/";

		this.SPARE_GET_ESTIMATED = this.BASE_URL + "api/maintenance/spareuse/get";
		this.SPARE_ISSUE_ADD = this.BASE_URL + "api/maintenance/spareissue/add";
		this.SPARE_GET_SLIP = this.BASE_URL + "api/maintenance/spareissue/get";

		// this.INVENTORY_GET_PR = this.BASE_URL + "api/maintenance/inventory/getpr/"
		this.PR_ADD = this.BASE_URL + "api/maintenance/pr/add";
		this.PR_UPDATE = this.BASE_URL + "api/maintenance/pr/update";
		this.PR_PROCESS = this.BASE_URL + "api/maintenance/pr/process";
		this.PR_APPROVE = this.BASE_URL + "api/maintenance/pr/approve";
		this.PR_GET = this.BASE_URL + "api/maintenance/pr/get";
		this.DEL_PR = this.BASE_URL + "api/maintenance/pr/delete";
		this.PO_CREATE = this.BASE_URL + "api/maintenance/po/new";
		this.PO_GET = this.BASE_URL + "api/maintenance/po/get";
		this.PO_DOWNLOAD = this.BASE_URL + "api/bills/poQuote";
		this.ISSUE_SLIP_DOWNLOAD = this.BASE_URL + "api/bills/issueSlip";
		this.TYRE_ISSUE_DOWNLOAD = this.BASE_URL + "api/bills/tyreIssueSlip";
		this.TYRE_RETREAD_DOWNLOAD =
			this.BASE_URL + "api/bills/tyreRetreadIssueSlip";

		this.REQ_USER_GET = this.BASE_URL + "api/users/get";

		this.STRUCTURE_BASE = this.BASE_URL + "api/maintenance/structureMaster/";
		this.STRUCTUREMASTER_GET = this.STRUCTURE_BASE + "get/";
		this.STRUCTUREMASTER_ADD = this.STRUCTURE_BASE + "add/";
		this.STRUCTUREMASTER_DELETE = this.STRUCTURE_BASE + "delete/";

		this.TRAILERMASTER_BASE = this.BASE_URL + "api/maintenance/trailerMaster/";
		this.TRAILERMASTER_GET = this.TRAILERMASTER_BASE + "get/";
		this.TRAILERMASTER_ADD = this.TRAILERMASTER_BASE + "add/";
		this.TRAILERMASTER_DELETE = this.TRAILERMASTER_BASE + "delete/";
		this.TRAILERMASTER_UPDATE = this.TRAILERMASTER_BASE + "update/";

		this.PRIMEMOVERTRAILERASSOCIATION_BASE =
			this.BASE_URL + "api/maintenance/primeMoverTrailerAssociation/";
		this.PRIMEMOVERTRAILERASSOCIATION_GET =
			this.PRIMEMOVERTRAILERASSOCIATION_BASE + "get/";
		this.PRIMEMOVERTRAILERASSOCIATION_ADD =
			this.PRIMEMOVERTRAILERASSOCIATION_BASE + "add/";
		this.PRIMEMOVERTRAILERASSOCIATION_DELETE =
			this.PRIMEMOVERTRAILERASSOCIATION_BASE + "delete/";
		this.PRIMEMOVERTRAILERASSOCIATION_UPDATE =
			this.PRIMEMOVERTRAILERASSOCIATION_BASE + "update/";

		this.DRIVER_ON_VEHICLE_BASE = this.BASE_URL + "api/vehicledriverasso/";
		this.DRIVER_ON_VEHICLE_GET = this.DRIVER_ON_VEHICLE_BASE + "get";
		this.DRIVER_VEHICLE_ASSOC_REPORT =
			this.BASE_URL + "api/vehicledriverasso/get";
		this.DRIVER_ON_VEHICLE_ASSOCIATE =
			this.DRIVER_ON_VEHICLE_BASE + "associate/";
		this.DRIVER_ON_VEHICLE_DISASSOCIATE =
			this.DRIVER_ON_VEHICLE_BASE + "disassociate/";
		this.ASSISTANT_ASSOCIATE = this.DRIVER_ON_VEHICLE_BASE + "assistantAssociate/";
		this.ASSISTANT_DISASSOCIATE = this.DRIVER_ON_VEHICLE_BASE + "assistantDisassociate/";
		this.UPDATE_DRIVER_ON_VEHICLE_ASSOCIATE =
			this.DRIVER_ON_VEHICLE_BASE + "update/";
        // backdater driver entery api
        this.BACK_DATE_ENTRY_FOR_DRIVER = this.BASE_URL + "api/vehicledriverasso/backDateassociate";
		this.INVENTORY_GET_PR = this.BASE_URL + "api/maintenance/inventory/getpr/";
		this.INVENTORY_ADD = this.BASE_URL + "api/maintenance/inventory/add";

		this.PO_GET = this.BASE_URL + "api/maintenance/po/get/";
		this.PO_UPDATE = this.BASE_URL + "api/maintenance/po/update";
		this.PO_UPDATE222 = this.BASE_URL + "api/maintenance/po/pr-to-po";

		this.SNAP_DATES =
			this.BASE_URL + "api/maintenance/inventory/snapshot/getDates";

		// Sim master
		this.SIMMASTER_GET = this.BASE_URL + "api/gps/sim_master/get/";
		this.SIMMASTER_ADD = this.BASE_URL + "api/gps/sim_master/add/";
		this.SIMMASTER_UPDATE = this.BASE_URL + "api/gps/sim_master/update/";
		this.SIMMASTER_DELETE = this.BASE_URL + "api/gps/sim_master/delete/";

		//landmark
	this.GET_LANDMARK = this.GEO_URL + 'landmark/get';
	this.ADD_LANDMARK = this.GEO_URL + 'landmark/add';
	this.UPDATE_LANDMARK = this.GEO_URL + 'landmark/update';
	this.REMOVE_LANDMARK = this.GEO_URL + 'landmark/remove';
	this.DOWNLOAD_LANDMARK = this.GEO_URL + 'landmark/reports';


	// Device master
		this.DEVICE_MASTER_GET = this.BASE_URL + "api/gps/device_master/get";
		this.DEVICE_MASTER_INWARD = this.BASE_URL + "api/gps/device_master/inward/";
		this.DEVICE_MASTER_ALLOCATE =
			this.BASE_URL + "api/gps/device_master/allocate";
		this.DEVICE_MASTER_ISSUE = this.BASE_URL + "api/gps/device_master/issue";
		this.DEVICE_MASTER_RETURN_FROM_SALES =
			this.BASE_URL + "api/gps/device_master/returnFromSalesExecutive";
		this.DEVICE_MASTER_RETURN_FROM_CUSTOMER =
			this.BASE_URL + "api/gps/device_master/returnFromCustomer";
		this.DEVICE_MASTER_UPDATE = this.BASE_URL + "api/gps/device_master/update/";
		this.DEVICE_MASTER_DELETE = this.BASE_URL + "api/gps/device_master/delete/";
		this.REPLACE_DEVICE =
			this.BASE_URL + "api/gps/device_master/replaceDevice/";
		this.DEVICE_MASTER_SLIPS_GET = this.BASE_URL + "api/gps/device_master_slip";
		this.PREVIEW_DEVICE_MASTERS_SLIP =
			this.BASE_URL + "api/gps/device_master_slip/preview";

		// sales order url
		this.ALL_QUOTATIONS = this.BASE_URL + "api/quotation/get";
		this.ADD_QUOTATIONS = this.BASE_URL + "api/quotation/add";
		this.UPDATE_QUOTATIONS = this.BASE_URL + "api/quotation/update/";
		this.PREVIEW_QUOTATION = this.BASE_URL + "api/quotation/preview";
		this.DIRECT_CONVERT_TO_SO = "/api/quotation/convert_to_so/";
		this.NEW_SO = this.BASE_URL + "api/so/new";
		this.CUSTOMER_SO = this.BASE_URL + "api/so/get";
		this.UPDATE_SO = this.BASE_URL + "api/so/update/";
		this.PREVIEW_SO = this.BASE_URL + "api/so/preview";
		this.GET_INVOICE = this.BASE_URL + "api/soInvoice/get";
		this.ADD_INVOICE = this.BASE_URL + "api/soInvoice/add";
		this.UPDATE_INVOICE = this.BASE_URL + "api/soInvoice/update/";
		this.PREVIEW_INVOICE = this.BASE_URL + "api/soInvoice/preview";
		this.DISPATCH_INVOICE = this.BASE_URL + "api/soInvoice/update/";
		this.ADD_MOISTURE = this.BASE_URL + "api/trip_gr/update_diesel_escalation";
		this.COMMON_UPLOAD = this.BASE_URL + "api/utility/common-upsert-service";
		this.Tracking_EXCEL = this.BASE_URL + "api/routedata/trackingReport";

		/**Reports mrp **/
		this.QUOTATION_REPORT = this.BASE_URL + "api/reports/quotation";
		this.SO_REPORT = this.BASE_URL + "api/reports/so";
		this.SO_INVOICE_REPORT = this.BASE_URL + "api/reports/soInvoice";

		//add gpsuser in lms with customer id
		this.REGISTER_GPS_USER =
			this.BASE_URL + "api/customer/register_user_gpsgaadi";
		this.UPDATE_GPS_USER = this.BASE_URL + "api/customer/update_user_gpsgaadi";
		this.CHECK_GPS_USER_ID =
			this.BASE_URL + "api/customer/user_id_availability_gpsgaadi";
		this.GET_GPS_USER_PASS =
			this.BASE_URL + "api/customer/check_password_gpsgaadi";
		this.CHANGE_GPS_USER_PASS =
			this.BASE_URL + "api/customer/change_password_gpsgaadi";

		//Account Api's
		this.BALANCE_SHEET_REPORT = this.BASE_URL + "api/accounts/getBalanceSheet/";
		this.ACCOUNT_MASTER_GET = this.BASE_URL + "api/accounts/get/";
		this.ACCOUNT_MASTER_GET_STRUCTURE =
			this.BASE_URL + "api/accounts/structure/";
		this.ACCOUNT_MASTER_GET_STRUCTURE_ALL =
			this.BASE_URL + "api/accounts/structureAll/";
		this.ACCOUNT_MASTER_ADD = this.BASE_URL + "api/accounts/add/";
		this.ACCOUNT_BALANCES = this.REPORTING_URL + "api/account_balances/get";
		this.ACCOUNT_BALANCE =
			this.REPORTING_URL + "api/account_balances/accBalMonthlyReport";
		this.ACCOUNT_BALANCEMONTHLY =
			this.REPORTING_URL + "api/account_balances/accBalMonthlyReport";
		this.ACCOUNT_GROUP_BALANCES =
			this.REPORTING_URL + "api/account_balances/group_ledger";
		this.GROUP_BALANCES_SUMMARY =
			this.REPORTING_URL + "api/account_balances/group_balances";
		this.VEHICLE_PROFIT_REPORT =
			this.REPORTING_URL + "api/reports/vehicleProfitReport";
		this.VEHICLE_EXPENSE_REPORT =
			this.REPORTING_URL + "api/reports/vehicleExpenseReport";
		this.COST_CENTER_REPORT =
			this.REPORTING_URL + "api/account_balances/dailyCostCenterReport";
		this.PROFIT_AND_LOSS_REPORT =
			this.REPORTING_URL + "api/account_balances/profit_loss";
		this.DETAIL_TRIAL_BALANCES =
			this.REPORTING_URL + "api/account_balances/trial_balances";
		this.GROUP_TRIAL_BALANCES =
			this.REPORTING_URL + "api/account_balances/group_trial_balances";
		this.PARTICULAR_TRIAL_BALANCES =
			this.REPORTING_URL + "api/account_balances/particular_trial_balances";
		this.ACCOUNT_OP_BAL_REP = this.REPORTING_URL + "api/voucher/ledgerReport/";
		this.ACCOUNT_MASTER_UPDATE = this.BASE_URL + "api/accounts/update/";
		this.ACCOUNTS_UPLOAD = this.BASE_URL + "api/accounts/upload/";
		this.MODIFIED_ACCOUNTS_UPLOAD =
			this.BASE_URL + "api/accounts/modifiedAccountUpload/";
		this.PLAIN_VOUCHER_UPLOAD = this.BASE_URL + "api/plain_voucher/upload/";
		this.VOUCHER_UPLOAD = this.BASE_URL + "api/voucher2/upload/";
		this.UPDATE_OPEN_BAL = this.BASE_URL + "api/accounts/ob_cb_update/";
		this.ACCOUNT_MASTER_REPORT_TAXES = this.BASE_URL + "api/voucher/taxes/";
		this.ACCOUNT_MASTER_REPORT_TDS = this.BASE_URL + "api/voucher/tds/";
		this.VOUCHER_GET = this.BASE_URL + "api/voucher/get/";
		this.DUES_GET = this.BASE_URL + "api/dues/get/";
		this.DUES_ADD = this.BASE_URL + "api/dues/add/";
		this.DUES_REPORT = this.BASE_URL + "api/reports/duesReport";
		this.DUES_UPDATE = this.BASE_URL + "api/dues/update/";
		this.DUES_DELETE = this.BASE_URL + "api/dues/delete/";
		this.LEGDER_GET = this.SEARCH_URL + "api/voucher2/ledger/";
		this.BANK_RECON_GET = this.SEARCH_URL + "api/voucher2/bankReconciliation/";
		this.RESET_BALANCE = this.BASE_URL + "api/voucher2/resetDailyBal";
		this.BILL_LEDGER_OUTSTANDING_RPT =
			this.REPORTING_URL + "api/bills/billLedgerOutstandingReport";
		this.BILL_LEDGER_OUTSTANDING_MONTHLY_RPT =
			this.REPORTING_URL + "api/bills/billLedgerOutstandingMonthlyReport";
		this.ACCOUNT_BILL_TO_BILL = this.REPORTING_URL + "api/voucher2/bill2bill";
		this.BRANCH_EXPENSE_RPT = this.REPORTING_URL + "api/voucher2/branchExpense";
		this.DELINK_ACCOUNT = this.BASE_URL + "api/accounts/delink/";
		this.ACC_OPENING_BAL =
			this.BASE_URL + "api/account_balances/opening_balance";
		this.VOUCHER_ADD = this.BASE_URL + "api/voucher/add/";
		this.GSTR1_CR_DR_REPORT = this.BASE_URL + "api/voucher/notes";
		this.GSTR1_INVOICE_REPORT = this.BASE_URL + "api/voucher/gstr1";
		this.BILL2BILL_REPORT = this.BASE_URL + "api/voucher2/bill2bill";
		this.ACCOUNT_MASTER_EDIT_NAME = this.BASE_URL + "api/accounts/updateName/";
		this.GET_COST_CATEGORY = this.BASE_URL + "api/accounts/getCostCategory";
		this.GET_COST_CENTER = this.BASE_URL + "api/accounts/getCostCenter";
		this.DELETE_COST_CENTER = this.BASE_URL + "api/accounts/deleteCostCenter";
		this.ADD_COST_CATEGORY = this.BASE_URL + "api/accounts/costCategory";
		this.UPDATE_COST_CATEGORY = this.BASE_URL + "api/accounts/costCategory/";
		this.ADD_COST_CENTER = this.BASE_URL + "api/accounts/costCenter";
		this.UPDATE_COST_CENTER = this.BASE_URL + "api/accounts/costCenter/";

		this.GPS_INVENTORY_REPORT = this.BASE_URL + "api/reports/gpsInventory";

		// Dashboard Api's
		// booking
		this.BOOKING_ANALYTICS = this.BASE_URL + "api/dashboard/booking-analysis";
		this.TRIP_ANALYTICS = this.BASE_URL + "api/dashboard/trip-analysis";
		this.BILL_ANALYTICS = this.BASE_URL + "api/dashboard/bill-analysis";
		this.PROFIT_ANALYTICS = this.BASE_URL + "api/dashboard/profit-analysis";

		this.ACK_DEAL = this.BASE_URL + "api/trips/vendorAcknowledge/";
		this.VENDOR_DEAL_CHARGES = this.BASE_URL + "api/trips/vendorCharges/";
		this.LIVE_TRACKER = this.REPORTING_URL + "api/tracking/tripwise";
		this.LIVE_TRACKER_TRIP_HISTORY =
			this.REPORTING_URL + "api/tracking/trip-history";
		this.LIVE_TRACKER_VEHICLE = this.BASE_URL + "api/tracking/vehiclewise";
		this.LIVE_TRACKER_KILOMETER_ANALYSIS =
			this.BASE_URL + "api/tracking/gpsKmAnalysis";

		this.GET_OR_CREATE_CUSTOMER_RATE_CHART = `${this.BASE_URL}api/customerRateChart/`;
		this.REMOVE_CUSTOMER_RATE_CHART = `${this.BASE_URL}api/customerRateChart/delete/`;

		this.GET_CUSTOMER_RATE_CHART = `${this.SEARCH_URL}api/customerRateChart/aggr`;
		this.GET_RATE = `${this.BASE_URL}api/commanRate/get`;
		this.DELETE_RATE = `${this.BASE_URL}api/commanRate/delete/`;
		this.RATE_UPLOAD = `${this.BASE_URL}api/commanRate/uploadRate`;

		this.LM_START_TRIP = this.BASE_URL + "api/loading_manager/start_trip";
		this.CUSTOMER_RATE_CHART_DOWNLOAD_SAMPLE = `${this.BASE_URL}api/customerRateChart/upload-download`;

		// Bill Book
		this.BILL_BOOK_ADD = this.BASE_URL + "api/billBook/add";
		this.BILL_BOOK_STA_MODIFY =
			this.BASE_URL + "api/billBook/modifyBookStationary";
		this.MISSING_STATIONARY_RPT =
			this.BASE_URL + "api/billBook/stationaryMissingRpt";
		this.BILL_BOOK_GET = this.BASE_URL + "api/billBook/get";
		this.STOCK_BOOK = this.BASE_URL + "api/billBook/fullyUnused";
		this.BILL_BOOK_GETREPORT = this.BASE_URL + "api/billBook/BillBookReport";
		this.BILL_STATIONERY_GET = this.SEARCH_URL + "api/billStationary/get";
		this.BILL_STATIONERY_GETV2 =
			this.REPORTING_URL + "api/billStationary/getV2";
		this.BILL_BOOK_UPDATE = this.BASE_URL + "api/billBook/update/";
		this.BILL_STATIONERY_USE = this.BASE_URL + "api/billStationary/use/";
		this.BILL_STATIONERY_ENABEL = this.BASE_URL + "api/billStationary/disable/";
		this.BILL_STATIONERY_DISABEL = this.BASE_URL + "api/billStationary/enable/";
		this.BILL_STATIONERY_DELETE =
			this.BASE_URL + "api/billStationary/removeStationary/";
		this.BILL_STATIONERY_FREE =
			this.BASE_URL + "api/billStationary/freeStationary/";
		this.BILL_BOOK_DELETE = this.BASE_URL + "api/billBook/remove/";
		this.BILL_BOOK_SOFT_DELETE = this.BASE_URL + "api/billBook/softDelete/";

		// Incentive
		this.INCENTIVE_ADD = this.BASE_URL + "api/incentives/add/";
		this.INCENTIVE_GET = this.BASE_URL + "api/incentives/get/";
		this.INCENTIVE_UPDATE = this.BASE_URL + "api/incentives/update/";
		this.INCENTIVE_AUTO_SUGGEST = this.BASE_URL + "api/incentives/autosuggest/";

		// DPH
		this.DPH_ADD = this.BASE_URL + "api/dph/add/";
		this.DPH_GET = this.BASE_URL + "api/dph/get";
		this.DPH_DELETE = this.BASE_URL +"api/dph/delete/";

		// FPA
		this.FPA_GET = this.BASE_URL + "api/fpa-master/get/";
		this.FPA_ADD = this.BASE_URL + "api/fpa-master/add/";
		this.FPA_AUTOSUGGEST = this.BASE_URL + "api/fpa-master/autosuggest/";
		this.FPA_BILL_GET = this.BASE_URL + "api/fpa-bill/get/";
		this.FPA_BILL_ADD = this.BASE_URL + "api/fpa-bill/add/";
		this.FPA_BILL_REPORT = this.BASE_URL + "api/fpa-bill/report/";

		// CONFIGURATIONS
		this.CONF_GET = this.BASE_URL + "api/configs/";
		this.CONF_ADD = this.BASE_URL + "api/configs/add/";

		this.AGGR_GR_REPORT = this.REPORTING_URL + "api/trip_gr/aggr-report";
		this.DAILY_MIS_REPORT = this.REPORTING_URL + "api/trip_gr/dailyMISreport";
		this.AGGR_GR_REPORTV2 = this.REPORTING_URL + "api/trip_gr/aggr-reportV2";
		this.AGGR_POD_REPORT = this.REPORTING_URL + "api/trip_gr/podReport";
		this.AGGR_GR_REPORT_CRON =
			this.REPORTING_URL + "api/tripGrReportDown/getDownload";
		// this.GR_REPORT_MMT = this.REPORTING_URL + 'api/tripGrReportDown/getDownloadMMT';
		this.UPL_GRS = this.BASE_URL + "api/trip_gr/gr-upload";

		// Gps Report
		this.HALT_REPORT = this.TRUCKU_URL + "api/reports/parking";
		this.OVERSPEED_REPORT = this.TRUCKU_URL + "api/reports/overspeed";
		this.ACTIVITY_REPORT = this.TRUCKU_URL + "api/reports/activity";
		//this.DETAILED_ACTIVITY_REPORT = this.TRUCKU_URL + 'api/reports/slotactivity';
		this.DETAILED_ACTIVITY_REPORT =
			this.TRUCKU_URL + "api/reports/activity_interval";
		this.KILOMITER_REPORT = this.TRUCKU_URL + "api/reports/km";
		this.IDLE_REPORT = this.TRUCKU_URL + "api/reports/idealing";
		this.DETAILED_ANALYSIS_REPORT = this.TRUCKU_URL + "api/reports/detailAnalysis";
		this.DRIVER_ACTIVITY_RPT = this.TRUCKU_URL + "api/reports/driver_activity";
		this.IDLE_SUMMARY = this.TRUCKU_URL + "api/reports/idleSummary";
		this.VEHICLE_PLAYBACK = this.TRUCKU_URL + "api/reports/playback";
		this.VEHICLE_EXCEPTION_RPT = this.GEO_URL + "alert/vehicleExceptionsRpt";
		this.ALERT_REPORT = this.GEO_URL + "alert/getAlerts";
		this.VEHICLE_ALERT = this.GEO_URL + "alert/getV2";

		this.POST_ADD_GR = this.BASE_URL + "api/bookings/addGr";
		this.GEN_MULTI_GR = this.BASE_URL + "api/trips/genMultiGr";
		this.Gen_ADD_GR = this.BASE_URL + "api/trips/addGrNumber";
		this.REVERT_MULTI_GR = this.BASE_URL + "api/trips/revertMultiGr/";

		// daily km analysis report start
		this.DAILY_KM_ANALYSIS = this.BASE_URL + "api/reports/dailyKmAnalysis";
		// daily km analysis report end
	},
]);
