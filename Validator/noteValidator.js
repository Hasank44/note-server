
const validate = notes => {

    let error = {};

    // title validation
    if (!notes.title) {
        error.message = 'Please Provide Your Title';
    } else if (notes.title.length > 20) {
        error.message = 'Title Must At Latest 20 Characters';
    };

    // note validation
    if (!notes.note) {
        error.message = 'Please Provide Note';
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    };
};

module.exports = validate;