const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const registerValidator = require('../Validator/registerValidator');
const loginValidator = require('../Validator/loginValidator');
const updateValidator = require('../Validator/userUpdateValidator');
const verifyToken = require('../utils/verifyToken');

let SECRET = process.env.JWT_SECRET;

exports.usersGetController = async (req, res) => {
  try {
    let decoded;
    try {
      decoded = await verifyToken(req.headers['authorization'], SECRET);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    };
    const user = await User.findById(decoded._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied: Admin privileges required'
      });
    };
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found'
      });
    };
    return res.status(200).json({
      message: 'Users retrieved successfully',
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt : user.createdAt
      }))
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error occurred',
      error: error.message
    });
  };
};

exports.getOneUserController = async (req, res) => {
  const { id } = req.params;
  try {
    let decoded;
    try {
      decoded = await verifyToken(req.headers['authorization'], process.env.JWT_SECRET);
    } catch (error) {
      return res.status(error.status).json({
        message: error.message
      });
    };
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied: Admin privileges required'
      });
    };
    if (!id) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    };
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    };
    return res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error occurred',
      error: error.message
    });
  };
};

exports.getCurrentUserController = async (req, res) => {
  try {
    let decoded;
    try {
      decoded = await verifyToken(req.headers['authorization'], SECRET);
    } catch (error) {
      return res.status(error.status).json({
        message: error.message
      });
    };
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    };
    return res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error occurred',
      error: error.message
    });
  };
};

exports.userRegisterController = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const validate = registerValidator({ name, email, password, confirmPassword });
  try {
    if (!validate.isValid) {
        return res.status(400).json( validate.error );
      };
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            message: 'Email already in use'
        });
    };
    const hash = await bcrypt.hash(password, 11);
    const user = new User({
      name,
      email,
      password: hash,
      role: 'user',
      notes: []
    });
    const savedUser = await user.save();
    return res.status(201).json({
      message: 'Account created successfully',
        user: {
            name: savedUser.name,
            email: savedUser.email
        }
    });
  } catch (error) {
      return res.status(500).json({
          message: 'Server error occurred',
          error: error.message
      });
    };
};

exports.userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = loginValidator({ email, password });

    if (!validate.isValid) {
        return res.status(400).json(validate.error);
      };
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: 'Email does not exist'
        });
      };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: 'Incorrect password'
        });
      };
      const token = jwtToken.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        notes: user.notes
      },
      SECRET,
          {
              expiresIn: '24h'
          }
    );
    return res.status(200).json({
      message: 'Login successful',
      token: `Bearer ${token}`,
    });
  } catch (error) {
      return res.status(500).json({
          message: 'Server error occurred',
          error: error.message
      });
    };
};

exports.userUpdateController = async (req, res) => {
    const { name, email } = req.body;
    const validate = updateValidator({ name, email });
  try {
    if (!validate.isValid) {
        return res.status(400).json(validate.error);
      };
      let decoded;
        try {
          decoded = await verifyToken(req.headers['authorization'], SECRET);
        } catch (error) {
          return res.status(error.status).json({ message: error.message });
      };
      const updatedUser = await User.findOneAndUpdate({
          _id: decoded._id
      }, {
          $set: {
            name,
            email
          }}, {
          new: true
      });
    if (!updatedUser) {
        return res.status(404).json({
            message: 'User not found'
        });
      };
    return res.status(200).json({
      message: 'Account updated successfully',
        user: {
            name: updatedUser.name,
            email: updatedUser.email
        }
    });
  } catch (error) {
      return res.status(500).json({
          message: 'Server error occurred',
          error: error.message
      });
  };
};

exports.userDeleteController = async (req, res) => {
    try {
        let decoded;
        try {
          decoded = await verifyToken(req.headers['authorization'], SECRET);
        } catch (error) {
          return res.status(error.status).json({ message: error.message });
      };
      
        const deletedUser = await User.findOneAndDelete({
            _id: decoded._id
        });
        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
      };
        return res.status(200).json({
            message: 'Account deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error occurred',
            error: error.message
        });
  };
};
