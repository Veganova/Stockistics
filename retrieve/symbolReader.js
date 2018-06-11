// todo get this to work

var fs = require('fs');

module.exports = {
    /**
     * Returns the stock symbols in the file store/companylist.csv
     * @returns {Array}
     */
    getSymbols : () => {
        var symbols = [];
        var fileContents = fs.readFileSync('./store/companylist.csv');
        var lines = fileContents.toString().split('\n');

        // skip the header
        for (var i = 1; i < lines.length; i++) {
            // strings are stored as "string" which gets read as ""string"" - this gets rid of the extra ' " '
            let s = lines[i].toString().split(',')[0].split("\"")[1];
            if (s) {
                symbols.push(s);
            }
        }
        return symbols;
    }
};