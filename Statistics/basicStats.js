var reader = require('./../alphavantageReader');
var DECIMAL_PRECISION = 4;

var maxDiff = (minDate) => {
    return (records) => {
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
    }
};


var filterByMinFractionDiff = function(minDate) {
    var frac = 0.05;

    return (records) => {
        let filterDate = new Date(minDate);

        let results = [];
        // TODO USE FILTER AND MAP ISNTEAD OF LOOP AND CONTINUE
        for (let date in records) {
            if (new Date(date) < filterDate) {
                continue;
            }
            let obj = records[date];
            let curDiff = reader.getHighest(obj) - reader.getLowest(obj);
            let fracChange = curDiff / reader.getLowest(obj);
            if (fracChange > frac)  {
                // Decimal precision hard set here
                let percentageChange = (fracChange * 100).toFixed(DECIMAL_PRECISION);
                results.push({date, obj, percentageChange});
            }
        }
        return results;
    }
};

module.exports = {maxDiff, filterByMinFractionDiff};