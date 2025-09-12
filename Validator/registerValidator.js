const validator = require('validator');
const validate = user => {

    let error = {};

    // name validation
    if (!user.name) {
        error.message = 'Please Provide Your Name';
    } else if (user.name.length > 15) {
        error.message = 'Name Must At Latest 15 Characters';
    };

    // email validation
    if (!user.email) {
        error.message = 'Please Provide A Email';
    } else if (!validator.isEmail(user.email)) {
        error.message = 'Please Provide A Valid Email';
    };

    // password validation
    if (!user.password) {
        error.message = 'Please Provide Your Password';
    } else if (user.password.length < 8) {
        error.message = 'Password Must At Latest 8 Characters';
    };

    // confirmPassword validation
    if (!user.confirmPassword) {
        error.message = 'Please Provide Confirm Password';
    } else if (user.password !== user.confirmPassword) {
        error.message = 'Password Don\'t Match';
    };

    return {
        error,
        isValid: Object.keys(error).length === 0
    };
};

module.exports = validate;