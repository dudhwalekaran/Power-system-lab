// models/loggedUsers.js
const mongoose = require('mongoose');

// Define the schema for loggedUsers
const loggedUsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['user', 'professor'],
    default: 'user'  // Default status is user
  },
});

// Create the model for loggedUsers
const LoggedUser = mongoose.model('LoggedUser', loggedUsersSchema);

module.exports = LoggedUser;
