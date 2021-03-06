var reader = require('../retrieve/alphavantageReader');
var DECIMAL_PRECISION = 4;

var maxDiff = (records) => {
        let filterDate = new Date(minDate);
        let highestDiff = 0;
        let record;
        for (let date in records) {
            if (new Date(date) < filterDate) {
                continue;
            }
            let obj = records[date];
            let curDiff = reader.getHighest(obj) - reader.getLowest(obj);
            if (curDiff > highestDiff) {
                highestDiff = curDiff;
                record = {date, obj};
            }
        }
        return {record};
};


var percentageChange = function(records) {
    let results = [];
    for (let date in records) {
        let record = records[date];
        let curDiff = reader.getHighest(record) - reader.getLowest(record);
        let fracChange = curDiff / reader.getLowest(record);
        // Decimal precision hard set here
        let percentageChange = (fracChange * 100).toFixed(DECIMAL_PRECISION);
        results.push({date, record, percentageChange});
    }
    return results;
};

module.exports = {maxDiff, percentageChange};