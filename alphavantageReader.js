const request = require('request');
const util = require('./util');


const API_KEY = 'GS3QITA1XLMESBNL';

function getTimeSeriesData(symbol, functionType, bodyDataKey) {
    return new Promise((resolve, reject) => {
        let options = {
            url: `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${API_KEY}`,
            json: true //convert data that request callback gets back to a json object.
        };

        console.log(options.url);
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body[bodyDataKey]);
            }
        });
    })
}

function dateEquals(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDay() === date2.getDay();
}

/**
 * Returns the earliest last day of the month from the passed in date (logic considers the passed in date as well).
 * Ex:
 * 2018/02/27 -> 2018/01/31
 * 2018/02/28 -> 2018/02/28
 */
function getLastDayOfMonth(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    let currentMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (dateEquals(new Date(), date) || dateEquals(date, currentMonthLastDate)) {
        // Case where the date passed in is a valid date and doesn't need to be transposed to a previous month end date.
        return date;
    }
    return new Date(date.getFullYear(), date.getMonth(), 0);
}


/**
 * Returns the latest date from the object provided. Dates are the keys of the object and can be in any order.
 */
function getLatestDate(data) {
    let largest;
    for (let date in data) {
        largest = date;
        break;
    }

    for (let date in data) {
        if (new Date(date) > new Date(largest)) {
            largest = date;
        }
    }
    return largest;
}

/**
 * Object that stores all the information currently available on a stock. Default focus on weekly.
 */
class AlphaVantage {
    constructor(symbol, callback) {
        this.symbol = symbol;
        this.loaded = 0;

        this.timeSeries = {
            daily : {
                type:'TIME_SERIES_DAILY',
                key: 'Time Series (Daily)'
            },
            weekly : {
                type:'TIME_SERIES_WEEKLY',
                key: 'Weekly Time Series'
            },
            monthly : {
                type:'TIME_SERIES_MONTHLY',
                key: 'Monthly Time Series'
            },
        };

        for (let key in this.timeSeries) {
            this.initData(key).then((type)  => {
                this.loaded += 1;
                this.checkIfAllLoaded(callback);
            });
        }


        //
    }

    checkIfAllLoaded(callback) {
        if (this.loaded === Object.keys(this.timeSeries).length) {
            console.log("All types loaded, running callback");
            callback(this);
        }
    }

    /**
     * Make sure to focus("yyyy-mm-dd") before usage.
     */
    getClosestLastDate(dateString) {
        if (this.type === 'monthly') {
            let date = util.getDate(dateString);
            let currentMonthLastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            //
            if(util.getDate(this.timeSeries[this.type].lastDate) < date || dateEquals(util.getDate(this.timeSeries[this.type].lastDate), date)) {
                return util.getDate(this.timeSeries[this.type].lastDate);
            }
            if (dateEquals(date, currentMonthLastDate)) {
                // Case where the date passed in is a valid date and doesn't need to be transposed to a previous month end date.
                return date;
            }
            return new Date(date.getFullYear(), date.getMonth(), 0);
        } else if (this.type === 'weekly') {
            let date = util.getDate(dateString);
            if(util.getDate(this.timeSeries[this.type].lastDate) < date || dateEquals(util.getDate(this.timeSeries[this.type].lastDate), date)) {
                return util.getDate(this.timeSeries[this.type].lastDate);
            }

            let d = new Date(date),
                day = d.getDay(),
                diff = (day <= 5) ? (7 - 5 + day ) : (day - 5);

            d.setDate(d.getDate() - diff);
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            return d;
        } else if (this.type === 'daily') {
            let date = util.getDate(dateString);
            if(util.getDate(this.timeSeries[this.type].lastDate) < date || dateEquals(util.getDate(this.timeSeries[this.type].lastDate), date)) {
                return util.getDate(this.timeSeries[this.type].lastDate);
            }
            return date;
        }
        throw 'Invalid type';
    }

    /**
     * For ease of use assigns the corresponding timeSeries element (ex daily or weekly or monthly) to higher level this.
     * This prevents doing av.timeSeries.daily.data
     */
    focus(timeSeriesType) {
        for (let seriesType in this.timeSeries) {
            if (seriesType === timeSeriesType) {
                this.type = seriesType;
                this.data = this.timeSeries[seriesType].data
                return this;
            }
        }
    }

    initData(type) {
        return new Promise((resolve, reject) => {
            let series = this.timeSeries[type];
            getTimeSeriesData(this.symbol, series.type, series.key)
                .then((data) => {
                    series.lastDate = getLatestDate(data);
                    series.data = data;
                    resolve(type);
                })
                .catch((e) => console.log(e));
        });

    }
}


module.exports = {
    getHighest : (jsonObj) => {
        return jsonObj['2. high'];
    },

    getLowest : (jsonObj) => {
        return jsonObj['3. low'];
    },

    /**
     * Assumes passed in date is of type Date
     */
    dateToDateString : (date) => {
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        let day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        return `${date.getFullYear()}-${month}-${day}`;
    },
    AlphaAvantage: AlphaVantage
};

