const mongoose = require('mongoose');

const DB_URI = process.env.DB_URL
mongoose.connect(DB_URI, {})
    .then(() => {
        console.log('Database Connect Successfully');
    })
    .catch(error => {
        console.log(
            'Database Connect Failed',
            error.message
        );
    });