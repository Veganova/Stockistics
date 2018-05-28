var basicStats = require('./Statistics/basicStats');
var timeSeries = require('./Retrieve/timeSeries');


timeSeries.getTimeRecord('2018/02/27', 'MONTHLY', 'GOOGL').then((data) => {
    console.log(data);
}).catch((e) => {
    console.log("ERROR", e);
});



// todo yargs
// paramtrize the symbol and function



