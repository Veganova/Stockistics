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
});

// symbols = ['NFLX', 'GOOGL'];
var settings = require('./settings');
var processed = 0;
var result = {
    message: `Below is a list of stocks which have more than ${settings.minPercentage}% change in their price over the last ${settings.type}. Sorted by most %change`,
    settings: settings,
    symbolsConsidered: symbols,
    goodStocks: []
};



var i = 0;
var interval = setInterval(() => {

    var av = new AVR.AlphaAvantage(symbols[i], settings.type, (av) => {
        av.focus(settings.type);
        let recordsObj = av.getDataInRange();
        let records = basicStats.percentageChange(recordsObj);
        console.log("BEFORE",records.length);
        if (records.length === 0) {
            console.log(av.timeSeries.weekly);
        }
        records = records.filter((record) => AVR.getHighest(record.record) > settings.minStockValue);
        records = records.filter((record) => record.percentageChange > settings.minPercentage);
        console.log("AFTER",records.length);
        // If any left - they meet the constraints, add onto result
        // Currently only one record is returned - dealing with only last week's data for ex. (Multiple record analysis not implemented)
        if (records.length > 0) {
            let record = {};
            record['1. stock'] = av.symbol;
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

    i++;

    if (i === symbols.length) {
        stopInterval();
    }

}, 2000);

function stopInterval() {
    clearInterval(interval);
}


function checkDone() {
    if (processed === symbols.length) {
        // todo add logic to deal with several weeks of data.
        result.goodStocks = result.goodStocks.sort((a, b) => a['2. data'].percentageChange - b['2. data'].percentageChange);
        result.goodStocks = result.goodStocks.reverse();
        emailer.email(AVR, result);
        console.log(new Date());
        console.log(JSON.stringify(result, null, 2));

    }
}


