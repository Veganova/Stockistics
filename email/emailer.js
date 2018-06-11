const nodemailer = require('nodemailer');
const util = require('../utils/util');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'stockistics.reporter@gmail.com',
        pass: 'stock#123'
    }
});

module.exports = {
    email : (data) => {
        let today = util.getDate(new Date());
        let receivers = ['virajnova@gmail.com', 'virajnovatest@gmail.com']
        let mailOptions = {
            from: 'stockistics.reporter@gmail.com',
            to: receivers,
            subject: 'Stock report ' + today,
            text: JSON.stringify(data, null, 2)
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};

