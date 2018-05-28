function dateEquals(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDay() === date2.getDay();
}

module.exports = {
    /**
     * Returns the earliest last day of the month from the passed in date (logic considers the passed in date as well).
     * Ex:
     * 2018/02/27 -> 2018/01/31
     * 2018/02/28 -> 2018/02/28
     */
    getLastDayOfMonth : (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        let currentMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        if (dateEquals(date, currentMonthLastDate)) {
            // Case where the date passed in is a valid date
            return date;
        }
        return new Date(date.getFullYear(), date.getMonth(), 0);
    }
};