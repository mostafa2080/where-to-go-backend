const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
