var request = require('request');
var statUtil = require('../statistics/statUtil');
var formatter = require('./alphavantageReader');

var API_KEY = 'GS3QITA1XLMESBNL';

/**
 * Provides the filtered result from a TIME_SERIES_XXX set of periodic stock data.
 *
 * @param minDate   Minimum date >= which the resulting data will be filtered for
 * @param type      The time series type - MONTLY, WEEKLY
 * @param symbol    The stock symbol to query
 */
var getTimeSeries = (minDate, type, symbol) => {
    return new Promise((resolve, reject) => {
        let functionType = 'TIME_SERIES_MONTHLY';
        let bodyDataKey = 'Monthly Time Series';
        if (type.toUpperCase() === 'MONTHLY') {
            functionType = 'TIME_SERIES_MONTHLY';
            bodyDataKey = 'Monthly Time Series';
        } else if (type.toUpperCase() === 'WEEKLY') {
            functionType = 'TIME_SERIES_WEEKLY';
            bodyDataKey = 'Weekly Time Series';
        }

        let options = {
            url: `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`,
            json: true //convert data that request callback gets back to a json object.
        };

        request(options, function (error, response, body) {
            // console.log(options.url);
            // console.log('statusCode:', response && response.statusCode);

            if (error) {
                reject(error);
            } else {
                let filterDate = new Date(minDate);
                var filteredData = {};
                // Seems like the json is always in order by date but cannot risk
                for (date in body[bodyDataKey]) {
                    if (new Date(date) >= filterDate) {
                        filteredData[date] = (body[bodyDataKey])[date];
                    }
                }
                resolve(filteredData);
            }

        });
    });
};

/**
 * Provides the filtered result from a TIME_SERIES_XXX set of periodic stock data.
 *
 * @param date      The date of the data wanted
 * @param type      The time series type - MONTLY, WEEKLY
 * @param symbol    The stock symbol to query
 */
var getTimeRecord = (date, type, symbol) => {
    return new Promise((resolve, reject) => {
        let functionType, bodyDataKey, targetDate;

        targetDate = formatter.dateToDateString(statUtil.getLastDayOfMonth(date));

        if (type.toUpperCase() === 'MONTHLY') {
            functionType = 'TIME_SERIES_MONTHLY';
            bodyDataKey = 'Monthly Time Series';
        } else if (type.toUpperCase() === 'WEEKLY') {
            functionType = 'TIME_SERIES_WEEKLY';
            bodyDataKey = 'Weekly Time Series';
        }

        let options = {
            url: `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`,
            json: true //convert data that request callback gets back to a json object.
        };

        request(options, function (error, response, body) {
            // console.log(options.url);
            // console.log('statusCode:', response && response.statusCode);

            if (error) {
                reject(error);
            } else {
                let result = {};
                result[targetDate] = body[bodyDataKey][targetDate];
                resolve(result);
            }

        });
    });
};


module.exports = {getTimeSeries, getTimeRecord};