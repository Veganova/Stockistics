
module.exports = {

    getDate : (dateString) => {
        if (typeof dateString === 'string') {
            return new Date(dateString.replace(/-/g, '/'));
        }
        return dateString;

    },

    formatHTML : (AV, obj) => {
        let total = "<!DOCTYPE html>" +
            "<html lang='en'>" +
            "<body>"+
            `<p>Message: ${JSON.stringify(obj.message, null, 2)}</p>` +
            `<p>Settings: ${JSON.stringify(obj.settings, null, 2)}</p>` +
            `<p>Data comes from date =  ${obj.goodStocks.length > 0 ? obj.goodStocks[0]['2. data'].date : '<h1>NO STOCKS MET THE CONSTRAINTS</h1>'}</p>` +
            `<p>Stocks considered: ${JSON.stringify(obj.symbolsConsidered, null, 2)}</p>` +
            "<table class='table table-striped'>" +
            "<thead>" +
                "<tr>" +
                "<th>Stock</th>" +
                "<th>%Change</th>" +
                "<th>Open</th>" +
                "<th>High</th>" +
                "<th>Low</th>" +
                "<th>Close</th>" +
                "<th>Volume</th>" +
                "</tr>" +
            "</thead>" +
            "<tbody>";

        for (let i = 0; i < obj.goodStocks.length; i++) {
            let stock = obj.goodStocks[i];

            total += "<tr>" +
            "<td>" +  stock['1. stock'] + "</td>" +
            "<td>" +  stock['2. data'].percentageChange + "</td>" +
            "<td>" +  AV.getOpen(stock['2. data'].record) + "</td>" +
            "<td>" +  AV.getHighest(stock['2. data'].record) + "</td>" +
            "<td>" +  AV.getLowest(stock['2. data'].record) + "</td>" +
            "<td>" +  AV.getClose(stock['2. data'].record) + "</td>" +
            "<td>" +  AV.getVolume(stock['2. data'].record) + "</td>" +
            "</tr>"
        }


        total += "</tbody>" +
            "</table>" +
            "</html>";


        return total;
    }

};