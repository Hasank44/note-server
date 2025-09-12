const Note = require('../models/Note');
const User = require('../models/User');
const mongoose = require('mongoose');
const noteValidator = require('../Validator/noteValidator');
const verifyToken = require('../utils/verifyToken');
const SECRET = process.env.JWT_SECRET;

exports.noteGetController = async (req, res) => {
    const { sort = '-createdAt' } = req.query;

    try {
        let decoded;
        try {
            decoded = await verifyToken(req.headers.authorization, SECRET);
        } catch (error) {
            return res.status(401).json({
                message: error.message || 'Invalid or expired token'
            });
        };
        const validSortFields = ['createdAt', '-createdAt', 'title', '-title'];
        if (!validSortFields.includes(sort)) {
            return res.status(400).json({
                message: 'Invalid sort field'
            });
        };
        const notes = await Note.find({ author: decoded._id }).sort(sort);
        return res.status(200).json({
            message: 'Notes retrieved successfully',
            notes
        });
    } catch (error) {
        console.error('Note retrieval error:', error);
        return res.status(500).json({
            message: 'Server error occurred'
        });
    };
};

exports.noteGetOneController = async (req, res) => {
     const { id } = req.params;
    try {
        let decoded;
        try {
            decoded = await verifyToken(req.headers.authorization, SECRET);
        } catch (error) {
            return res.status(401).json({
                message: error.message || 'Invalid or expired token'
            });
        };
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: 'Invalid note ID'
                });
            };
            const note = await Note.findById(id);
            if (!note) {
                return res.status(404).json({
                    message: 'Note not found'
                });
            };
            if (note.author.toString() !== decoded._id) {
                return res.status(403).json({
                    message: 'Unauthorized to access this note'
                });
            };
            return res.status(200).json({
                message: 'Note retrieved successfully',
                note
            });
        };
    } catch (error) {
        return res.status(500).json({
            message: 'Server error occurred'
        });
    };
};

exports.notePostController = async (req, res) => {
    const { title, note } = req.body;
    const validate = noteValidator({ title, note });

    try {
        if (!validate.isValid) {
            return res.status(400).json( validate.error );
        }
        let decoded;
        try {
            decoded = await verifyToken(req.headers.authorization, SECRET);
        } catch (error) {
            return res.status(401).json({ message: error.message || 'Invalid or expired token' });
        }
        const newNote = new Note({
            title,
            note,
            author: decoded._id
        });
        const savedNote = await newNote.save();
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.notes.unshift(savedNote._id);
        await user.save();
        return res.status(201).json({
            message: 'Note created successfully',
            note: savedNote
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error occurred'
        });
    };
};

exports.noteUpdateController = async (req, res) => {
    const { title, note } = req.body;
    const { id } = req.params;
    const validate = noteValidator({ title, note });

    try {
        if (!validate.isValid) {
            return res.status(400).json(validate.error);
        }
        let decoded;
        try {
            decoded = await verifyToken(req.headers.authorization, SECRET);
        } catch (error) {
            return res.status(401).json({
                message: error.message || 'Invalid or expired token'
            });
        };
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid note ID'
            });
        };
        const existingNote = await Note.findById(id);
        if (!existingNote) {
            return res.status(404).json({
                message: 'Note not found'
            });
        };
        if (existingNote.author.toString() !== decoded._id) {
            return res.status(403).json({
                message: 'Unauthorized to update this note'
            });
        };
        const updatedNote = await Note.findOneAndUpdate({
            _id: id
        }, {
            $set: {
                title,
                note
            }
        }, {
            new: true
        }
        );
        return res.status(200).json({
            message: 'Note updated successfully',
            note: updatedNote
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error occurred'
        });
    };
};

exports.noteDeleteController = async (req, res) => {
    const { id } = req.params;

    try {
        let decoded;
        try {
            decoded = await verifyToken(req.headers.authorization, SECRET);
        } catch (error) {
            return res.status(401).json({
                message: error.message || 'Invalid or expired token'
            });
        };
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid note ID'
            });
        };
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({
                message: 'Note not found'
            });
        };
        if (note.author.toString() !== decoded._id) {
            return res.status(403).json({
                message: 'Unauthorized to delete this note'
            });
        };
        await Note.findByIdAndDelete(id);
        const user = await User.findById(decoded._id);
        if (user) {
            user.notes = user.notes.filter(noteId => noteId.toString() !== id);
            await user.save();
        };
        return res.status(200).json({
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Note deletion error:', error);
        return res.status(500).json({
            message: 'Server error occurred'
        });
    };
};