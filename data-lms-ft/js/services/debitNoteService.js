/**
 * Created by
 */

 materialAdmin.service('debitNoteService',
 [	'HTTPConnection',
     'URL',
     function(
         HTTPConnection,
         URL
     ){

         // functions Identifiers
         this.getDebitNote = getDebitNote;
         this.addDebitNote = addDebitNote;
         this.editDebitNote = editDebitNote;
         this.unapprove = unapprove;
         this.remove = remove;
         this.rpt = rpt;
         this.addMiscDebitNote = addMiscDebitNote;
         this.editMiscDebitNote = editMiscDebitNote;
         this.deleteMiscDebitNote = deleteMiscDebitNote;


         // Actual Functions

         function getDebitNote(request, successCallback, failureCallback) {
             HTTPConnection.post(URL.GET_DEBIT_NOTE, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function addDebitNote(request, successCallback, failureCallback) {
             HTTPConnection.post(URL.ADD_DEBIT_NOTE, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function editDebitNote(request, successCallback, failureCallback) {
             var url = URL.EDIT_DEBIT_NOTE + request._id; // modify url
             HTTPConnection.put(url, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function unapprove(request, successCallback, failureCallback) {
             var url = URL.UNAPPROVE_DEBIT_NOTE + request._id; // modify url
             HTTPConnection.post(url, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function remove(request, successCallback, failureCallback) {
             var url = URL.REMOVE_DEBIT_NOTE + request._id; // modify url
             HTTPConnection.delete(url, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function rpt(request, successCallback, failureCallback) {
             let url;
             switch (request.download) {
                 case 'dedRpt':
                     url = URL.DEBIT_NOTE_DED_RPT;
                     break;
             }
             HTTPConnection.post(url, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function addMiscDebitNote(request, successCallback, failureCallback) {
             HTTPConnection.post(URL.ADD_MISC_DEBIT_NOTE, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function editMiscDebitNote(request, successCallback, failureCallback) {
             HTTPConnection.post(URL.EDIT_MISC_DEBIT_NOTE + request._id, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function deleteMiscDebitNote(request, successCallback, failureCallback) {
             var url = URL.DELETE_MISC_DEBIT_NOTE + request._id; // modify url
             HTTPConnection.delete(url, request, onSuccess, onFailure);
             function onFailure(data) {
                 if(typeof failureCallback === 'function')
                     failureCallback(data.data);
             }
             function onSuccess(data) {
                 if(typeof successCallback === 'function')
                     successCallback(data.data);
             }
         }

         function prepareParameters(oFilter) {
             var sParam = "";

             for (var property in oFilter) {
                 sParam = sParam + "&" + property + "=" + oFilter[property];
             }
             return sParam;
         }
     }
 ]
);
