materialAdmin.service('DateUtils', [function() {
  this.format = 'dd-MM-yyyy';

  this.now = function() {
    var now = moment();
    now.format(this.format)
    return now.toDate();
  }

  this.before = function(day) {
    var now = moment();
    now.format(this.format);
    now.subtract(day, 'days');
    return now.toDate();
  }

  this.after = function(day) {
    var now = moment();
    now.format(this.format);
    now.add(day, 'days');
    return now.toDate();
  }

  this.uiStringToDate = function(dateStr) {
    return moment(dateStr, "DD-MM-YYYY").toDate();
  }

  this.formatForRequest = function(date) {
    return moment(date).format("DD-MM-YYYY");
  }

  // date -> it should be date object
  // howMuch -> it should be Numeric
  // span -> it should be 'days/week/month'
  this.addDate = function(date, howMuch, span) {
	  var now = moment(date).add(howMuch, span);
	  return now.toDate();
  }
}]);
