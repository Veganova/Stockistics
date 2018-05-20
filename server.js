var request = require('request');

var options = {
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=MSFT&apikey=GS3QITA1XLMESBNL',
    json: true //convert data that request callback gets back to a json object.
};

request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode);
    // console.log(body);
    findHighestDiffWeek(body['Weekly Time Series']);
});

var findHighestDiffWeek = function(weeks) {
    var highestDiff = 0;
    var highestDiffObj;
    for (let date in weeks) {
        let obj = weeks[date];
        let curDiff = obj['2. high'] - obj['3. low'];
        if (curDiff > highestDiff) {
            highestDiff = curDiff;
            highestDiffObj = obj;
        }
    }
    console.log("HIGH:", highestDiff, highestDiffObj);
}

