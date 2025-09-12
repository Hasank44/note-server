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

    return {
        error,
        isValid: Object.keys(error).length === 0
    };
};

module.exports = validate;