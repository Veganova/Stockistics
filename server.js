var basicStats = require('./statistics/basicStats');
// var timeSeries = require('./Retrieve/timeSeries');
var alpha = require('./retrieve/alphavantageReader');
var u = require('./util');
let date = '2018-05-08';
var av = new alpha.AlphaAvantage('GOOGL', (av) => {
    console.log(av.focus('monthly').getClosestLastDate(date));
    console.log('records', Object.keys(av.data).length);
    console.log('range', av.getDataInRange('2018-03', '2018-05-31'));
    // console.log(basicStats.filterByMinFractionDiff(av.data));
});


