const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Note = model('Note', noteSchema);
module.exports = Note;