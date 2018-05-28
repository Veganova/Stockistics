var getHighest = (jsonObj) => {
    return jsonObj['2. high'];
};

var getLowest = (jsonObj) => {
    return jsonObj['3. low'];
};

module.exports = {getHighest, getLowest};