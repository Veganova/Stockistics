var basicStats = require('./statistics/basicStats');
var alpha = require('./retrieve/alphavantageReader');
var emailer = require('./email/emailer');

var symbols = ['GOOGL', 'AAPL', 'MU'];
var type = 'weekly';
var minPercentage = 3.5;
var processed = 0;
var result = {
    minPercentage: minPercentage,
    dataType: type,
    symbolsConsidered: symbols,
    goodStocks: {}
};
for (let i = 0; i < symbols.length; i++) {
    var av = new alpha.AlphaAvantage(symbols[i], (av) => {
        av.focus(type);
        let withPercents = basicStats.percentageChange(av.getDataInRange());
        const filtered = withPercents.filter((record) => record.percentageChange > minPercentage);
        if (filtered.length > 0) {
            result.goodStocks[symbols[i]] = filtered;
        }
        processed += 1;
        checkDone();
    });
}

function checkDone() {
    if (processed === symbols.length) {
        emailer.email(result);
    }
}


