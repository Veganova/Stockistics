// var basicStats = require('./Statistics/basicStats');
// var timeSeries = require('./Retrieve/timeSeries');
var alpha = require('./alphavantageReader');
var u = require('./util');
let date = '2018-05-08';
var av = new alpha.AlphaAvantage('GOOGL', (av) => {console.log(av.focus('daily').getClosestLastDate(date));});
//av.focus('monthly').getClosestLastDate('2018-05-31'));

// todo yargs
// paramtrize the symbol and function



