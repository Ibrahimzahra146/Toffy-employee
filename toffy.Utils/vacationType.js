module.exports.getVacationType = function getVacationType(type) {
    if (type == 0) {
        return "Personal time off"
    } else if (type == 4) {
        return "Sick time off"
    } else if (type == 7) {
        return "WFH"
    }
}