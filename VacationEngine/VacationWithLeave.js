const dateHelper = require('.././DateEngine/DateHelper.js')
const leave = require('.././leave.js')



var vacation_type1 = ""
module.exports.vacationWithLeave = function vacationWithLeave(msg, response, emailValue) {

    var other_vacation_types = ""
    var messageText = ""
    dateHelper.getTodayDate(function (today) {

        var time = "8:00:00";
        var time1 = "17:00:00";
        var date = today
        var date1 = today
        var timeOffCase = -1

        if (response.result.parameters.sick_synonyms) {
            vacation_type1 = "sick"
        }
        else if (response.result.parameters.other_vacation_types) {
            other_vacation_types = response.result.parameters.other_vacation_types;
            if (other_vacation_types == "Wedding")
                vacation_type1 = "Wedding"
            else if (other_vacation_types == "Paternity")
                vacation_type1 = "Paternity"
            else if (other_vacation_types == "death") {
                vacation_type1 = "death"
            }
            else if (other_vacation_types == "Marriage") {
                vacation_type1 = "Marriage"
            }

        }
        else if (response.result.parameters.working_from_home) {
            vacation_type1 = "WFH"
        }
        if (response.result.parameters.time_off_types && !(response.result.parameters.time) && !(response.result.parameters.time1) && !(response.result.parameters.date) && !(response.result.parameters.date1)) {

            msg.say("Please specify the date and/or time ")

            console.log("sick_synonyms1")

        }
        else if (response.result.parameters.sick_synonyms && !(response.result.parameters.time) && !(response.result.parameters.time1) && !(response.result.parameters.date) && !(response.result.parameters.date1)) {
            msg.say("Please specify the date and/or time ")

            console.log("sick_synonyms2")
            vacation_type1 = "sick"

        }
        else if (response.result.parameters.working_from_home && !(response.result.parameters.time) && !(response.result.parameters.time1) && !(response.result.parameters.date) && !(response.result.parameters.date1)) {
            msg.say("Please specify the date and/or time ")

            console.log("sick_synonyms3")
            vacation_type1 = "WFH"

        }
        else if (response.result.parameters.time_off_types && !(response.result.parameters.time) && !(response.result.parameters.time1) && (response.result.parameters.date == "") && !(response.result.parameters.date1)) {
            msg.say("Please specify the date and/or time ")
            console.log("sick_synonyms4")
        }
        else if (response.result.parameters.time_off_types && !(response.result.parameters.time) && !(response.result.parameters.time1) && (response.result.parameters.date == "") && (response.result.parameters.date1 == "")) {
            msg.say("Please specify the date and/or time ")
            console.log("sick_synonyms4")
        } else if (response.result.parameters.sick_synonyms && response.result.parameters.date == "" && !(response.result.parameters.time)) {
            msg.say("Please specify the date and/or time ")
            vacation_type1 = "sick"
            console.log("sick_synonyms5")
        }

        else {
            console.log("vacation_type1" + vacation_type1)
            if (response.result.parameters.time && response.result.parameters.number_of_hours_indicators && response.result.parameters.time_types) {
                time = response.result.parameters.time

                if (response.result.parameters.time1) {


                    time1 = response.result.parameters.time1;
                    time = time1;
                    time1 = response.result.parameters.time;
                    var arr = time1.toString().split(":")
                    var arr1 = time.toString().split(":")



                    arr[0] = (Number(arr[0]) + Number(arr1[0]) + Number("00"));
                    arr[1] = (Number(arr[1]) + Number(arr1[1]) + Number("00"))
                    arr[2] = (Number(arr[2]) + Number(arr1[2]) + Number("00"))
                    time1 = arr[0] + ":" + arr[1] + ":" + arr[2]

                }
                else {
                    var d = new Date(); // for now
                    time1 = (Number(d.getHours()) + 3) + ":" + d.getMinutes() + ":" + d.getSeconds()

                    time = time1;
                    time1 = response.result.parameters.time;
                    var arr = time1.toString().split(":")
                    var arr1 = time.toString().split(":")



                    arr[0] = (Number(arr[0]) + Number(arr1[0]) + Number("00"));
                    arr[1] = (Number(arr[1]) + Number(arr1[1]) + Number("00"))
                    arr[2] = (Number(arr[2]) + Number(arr1[2]) + Number("00"))
                    time1 = arr[0] + ":" + arr[1] + ":" + arr[2]

                }


                timeOffCase = 5
            }
            else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date && response.result.parameters.date1 && response.result.parameters.date1 != "") {

                time = response.result.parameters.time
                time1 = response.result.parameters.time1
                date = response.result.parameters.date;
                date1 = response.result.parameters.date1;
                if (response.result.parameters.date == "") {
                    date = today
                }
                timeOffCase = 1

            }
            else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date1 && response.result.parameters.date1 != "") {

                time = response.result.parameters.time
                time1 = response.result.parameters.time1
                date = response.result.parameters.date1
                date1 = response.result.parameters.date1
                if (response.result.parameters.date1 == "") {
                    date = today
                    date1 = today
                }

                timeOffCase = 2

            } else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date) {
                time = response.result.parameters.time
                time1 = response.result.parameters.time1
                date = response.result.parameters.date
                date1 = response.result.parameters.date
                if (response.result.parameters.date == "") {
                    date = today
                    date1 = today
                }
                timeOffCase = 3

            }

            else if (response.result.parameters.time && response.result.parameters.date && response.result.parameters.date1 && response.result.parameters.date != "" && response.result.parameters.date1 != "") {
                time = response.result.parameters.time

                date = response.result.parameters.date
                date1 = response.result.parameters.date1
                if (response.result.parameters.date == "") {
                    date = today
                }
                timeOffCase = 4

            } else if (response.result.parameters.time && response.result.parameters.time1) {
                time = response.result.parameters.time
                time1 = response.result.parameters.time1
                timeOffCase = 5

            } else if (response.result.parameters.time && response.result.parameters.date && response.result.parameters.date != "") {
                time = response.result.parameters.time
                date = response.result.parameters.date
                date1 = response.result.parameters.date
                if (response.result.parameters.date == "") {
                    date = today
                    date1 = date
                }
                timeOffCase = 6

            }
            else if (response.result.parameters.time && response.result.parameters.date1 && response.result.parameters.date1 != "") {
                time = response.result.parameters.time
                date1 = response.result.parameters.date1
                if (response.result.parameters.date1 == "") {
                    date1 = today
                }
                timeOffCase = 7

            }
            else if (response.result.parameters.date && response.result.parameters.date1 && response.result.parameters.date1 != "" && response.result.parameters.date != "") {

                date = response.result.parameters.date
                date1 = response.result.parameters.date1
                timeOffCase = 8

            }
            else if (response.result.parameters.date && response.result.parameters.date != "") {

                timeOffCase = 9

                var numberOfDaysToAdd = ""

                date = response.result.parameters.date
                date1 = response.result.parameters.date
                if (response.result.parameters.date == "") {
                    date = today;
                    date1 = date

                } else if ((response.result.parameters.date).indexOf(',') > -1) {

                    var arr = (response.result.parameters.date).toString().split(',')
                    date = arr[0];
                    date1 = arr[1]
                }
                if (response.result.parameters.other_vacation_types) {
                    if (vacation_type1 == "Maternity") {
                        numberOfDaysToAdd = 70

                    } else if (response.result.parameters.other_vacation_types == "Paternity") {
                        numberOfDaysToAdd = 3
                    }
                    else if (response.result.parameters.other_vacation_types == "Wedding") {
                        numberOfDaysToAdd = 3
                    }
                    else if (response.result.parameters.other_vacation_types == "death") {
                        numberOfDaysToAdd = 3
                    } else if (response.result.parameters.other_vacation_types == "Haj") {
                        numberOfDaysToAdd = 10
                    }
                    var someDate = new Date(date);
                    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

                    var dd = someDate.getDate();
                    var mm = someDate.getMonth() + 1;
                    var y = someDate.getFullYear();

                    date1 = y + '/' + mm + '/' + dd;
                    timeOffCase = 8
                }

            }
            else if (response.result.parameters.time) {
                time = response.result.parameters.time
                timeOffCase = 10

            }
            console.log("-------timeOffCase" + timeOffCase)


            if (vacation_type1 == "") {
                vacation_type1 = "personal"
            }
            //get the milliseconds for the  end of the vacation 
            dateHelper.convertTimeFormat(time, function (x, y, convertedTime) {
                dateHelper.convertTimeFormat(time1, function (x, y, convertedTime1) {
                    var toDate = date1 + " " + convertedTime1

                    var fromDate = date + " " + convertedTime;
                    var timeMilliseconds = new Date(fromDate);
                    var validPreviousDate = 1;

                    if (timeMilliseconds.getFullYear() == 2018) {
                        // toDate.setFullYear(2017)

                        var res = dateHelper.getDayNumber(timeMilliseconds)
                        if (res < 7 && res >= 0) {
                            timeMilliseconds.setFullYear(2017)
                        } else validPreviousDate = 0
                    }
                    timeMilliseconds = timeMilliseconds.getTime();
                    timeMilliseconds = timeMilliseconds - (3 * 60 * 60 * 1000);
                    toDate = new Date(toDate);
                    if (toDate.getFullYear() == 2018) {
                        // toDate.setFullYear(2017)
                        var res = dateHelper.getDayNumber(toDate)
                        if (res < 7 && res >= 0) {
                            toDate.setFullYear(2017)
                        } else validPreviousDate = 0
                    }
                    var dateMilliSeconds = toDate.getTime();
                    dateMilliSeconds = dateMilliSeconds - (3 * 60 * 60 * 1000)
                    if (validPreviousDate == 1) {
                        leave.sendVacationWithLeaveConfirmation(msg, convertedTime, date, convertedTime1, date1, timeMilliseconds, dateMilliSeconds, emailValue, vacation_type1, timeOffCase)
                        vacation_type1 = ""
                    } else msg.say("Not valid date")
                })

            })



        }
    })

}