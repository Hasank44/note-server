const validator = require('validator');
const validate = user => {

    let error = {};

    // email validation
    if (!user.email) {
        error.message = 'Please Provide A Email';
    } else if (!validator.isEmail(user.email)) {
        error.message = 'Please Provide A Valid Email';
    };

    // password validation
    if (!user.password) {
        error.message = 'Please Provide Your Password';
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    };
};

module.exports = validate;