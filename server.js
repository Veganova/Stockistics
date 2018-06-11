var basicStats = require('./statistics/basicStats');
var AVR = require('./retrieve/alphavantageReader');
var emailer = require('./email/emailer');
var SR = require('./retrieve/symbolReader');
console.log(new Date());
var symbols = SR.getSymbols();

let count = 10;
symbols = symbols.filter((a) => {
    if (count > 0) {
        count--;
        return true;
    }
    return false;
})
// todo LOAD ONLY THE TYPE SPECIFIED..
var type = 'weekly';
var minPercentage = 3;
var processed = 0;
var minStockValue = 50;
var result = {
    message: `Below is a list of stocks which have more than ${minPercentage}% change in their price over the last ${type}. Sorted by most %change`,
    minPercentage: minPercentage,
    dataType: type,
    minStockValue: minStockValue,
    symbolsConsidered: symbols,
    goodStocks: []
};




for (let i = 0; i < symbols.length; i++) {
    var av = new AVR.AlphaAvantage(symbols[i], (av) => {
        av.focus(type);
        let records = av.getDataInRange();
        records = basicStats.percentageChange(records);
        records = records.filter((record) => AVR.getHighest(record.record) > minStockValue);
        records = records.filter((record) => record.percentageChange > minPercentage);

        // If any left - they meet the constraints, add onto result
        if (records.length > 0) {
            let record = {};
            record['1. stock'] = symbols[i];
            if (records.length === 1) {
                record['2. data'] = records[0];
            } else {
                record['2. data'] = records;
            }
            result.goodStocks.push(record);
        }
        processed += 1;
        checkDone();
    });
}

function checkDone() {
    if (processed === symbols.length) {
        // todo add logic to deal with several weeks of data.
        result.goodStocks = result.goodStocks.sort((a, b) => a['2. data'].percentageChange - b['2. data'].percentageChange);
        result.goodStocks = result.goodStocks.reverse();
        // emailer.email(result);
        console.log(new Date());
        console.log(JSON.stringify(result, null, 2));

    }
}


