module.exports.getDayNumber = function getDayNumber(date) {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    console.log('Day of year: ' + day);
    now = new Date(date);
    start = new Date(now.getFullYear(), 0, 0);
    diff = now - start;
    day1 = Math.floor(diff / oneDay);
    var res = (day - day1)
    return res;

}