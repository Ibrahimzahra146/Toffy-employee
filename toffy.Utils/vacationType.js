module.exports.getVacationType = function getVacationType(type) {
    if (type == 0) {
        return "Personal"
    } else if (type == 4) {
        return "Sick"
    } else if (type == 7) {
        return "WFH"
    }
}