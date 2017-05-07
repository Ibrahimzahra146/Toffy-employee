var dateHelper = require('.././DateEngine/DateHelper.js')
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
    console.log(res + "sssw");
    return res;

}

/** 
 * Convert date format in order to send it to user and server 
 * 
 */
module.exports.convertTimeFormat = function convertTimeFormat(time, callback) {
    console.log("The Time is =" + time)
    var arr = time.toString().split(":")
    var formattedTime = ""
    var midday = "pm";
    var TimeforMilliseconds = ""
    var n = arr[1].length;
    if (n == 1) {
        arr[1] = "0" + arr[1]
    }

    if (arr[0] == "13" || arr[0] == "01" || arr[0] == "1") {
        formattedTime = "01:" + arr[1];
        TimeforMilliseconds = "13:" + arr[1]
    }
    else if (arr[0] == "14" || arr[0] == "02" || arr[0] == "2") {
        formattedTime = "02:" + arr[1];
        TimeforMilliseconds = "14:" + arr[1]
    }
    else if (arr[0] == "15" || arr[0] == "03" || arr[0] == "3") {
        formattedTime = "03:" + arr[1];
        TimeforMilliseconds = "15:" + arr[1]
    }
    else if (arr[0] == "16" || arr[0] == "04" || arr[0] == "4") {
        formattedTime = "04:" + arr[1];
        TimeforMilliseconds = "16:" + arr[1]
    }
    else if (arr[0] == "17" || arr[0] == "05" || arr[0] == "05") {
        formattedTime = "05:" + arr[1];
        TimeforMilliseconds = "17:" + arr[1]
    }
    else if (arr[0] == "19" || arr[0] == "07" || arr[0] == "7") {
        formattedTime = "07:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "7:" + arr[1]

    }
    else if (arr[0] == "20" || arr[0] == "08" || arr[0] == "8") {
        formattedTime = "08:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "8:" + arr[1]

    }
    else if (arr[0] == "21" || arr[0] == "09" || arr[0] == "9") {
        formattedTime = "09:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "9:" + arr[1]
    }
    else if (arr[0] == "22" || arr[0] == "10") {
        formattedTime = "10:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "10:" + arr[1]
    }
    else if (arr[0] == "23" || arr[0] == "11") {
        formattedTime = "11:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "11:" + arr[1]
    }
    else if (arr[0] == "00" || arr[0] == "12") {
        formattedTime = "12:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "12:" + arr[1]
    }

    else {
        formattedTime = arr[0] + ":" + arr[1];
        midday = "am";
    }
    console.log("TimeforMilliseconds" + TimeforMilliseconds)
    callback(formattedTime, midday, TimeforMilliseconds)
}
/**
 * get today date
 */
module.exports.getTodayDate = function getTodayDate(callback) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    callback(today)

}
/**
 * get  day name of any date 
 */

module.exports.getDayNameOfDate = function getDayNameOfDate(date, callback) {
    console.log("arrive getDayNameOfDat e" + date)
    var weekday = new Array(7);
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[0] = "Sunday";
    var d = new Date(date);
    callback(weekday[d.getDay()]);
}
//convert Date to word 
module.exports.converDateToWords = function converDateToWords(fromDate, toDate, callback) {

    var wordFromDate = new Date(fromDate).toDateString()
    var hours = new Date(fromDate).getHours() + 3

    var minutes = new Date(fromDate).getMinutes()
    if (minutes == 0)
        minutes = "00"
    var arr = wordFromDate.toString().split(" ")
  
    dateHelper.convertTimeFormat(hours + ":" + minutes, function (formattedTime, midday, TimeforMilliseconds) {
        var wordTodate = new Date(toDate).toDateString()
        hours = new Date(toDate).getHours() + 3
        minutes = new Date(toDate).getMinutes()
        if (minutes == 0)
            minutes = "00"


        arr = wordTodate.toString().split(" ")
       
        dateHelper.convertTimeFormat(hours + ":" + minutes, function (formattedTime1, midday1, TimeforMilliseconds1) {
            wordFromDate = new Date(fromDate).toDateString() + " " + formattedTime + " " + midday;

            //toDateho


            wordTodate = new Date(toDate).toDateString() + " " + formattedTime1 + " " + midday1;
            callback(wordFromDate, wordTodate)
        })

    })

}