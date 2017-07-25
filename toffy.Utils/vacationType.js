module.exports.getVacationType = function getVacationType(type) {
    if (type == 0) {
        return "Personal"
    } else if (type == 1) {
        return "Death"
    }
    else if (type == 2) {
        return "Maternity"
    } else if (type == 3) {
        return "Paternity"
    } else if (type == 4) {
        return "Sick"
    } else if (type == 8) {
        return "Wedding"
    } else if (type == 9) {
        return "Haj"
    }
}
module.exports.getVacationTypeNum = function (type) {
    if (type == "Personal") {
        return 0;
    } else if (type == "death") {
        return 1;
    }
    else if (type == "Maternity") {
        return 2;
    }
    else if (type == "Paternity") {
        return 3;
    } else if (type == "Sick") {
        return 4;
    } else if (type == "Wedding") {
        return 8;
    } else if (type == "Haj") {
        return 9;
    }
}