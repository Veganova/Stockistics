module.exports = {

    getDate : (dateString) => {
        if (typeof dateString === 'string') {
            return new Date(dateString.replace(/-/g, '/'));
        }
        return dateString;

    }
}