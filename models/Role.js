const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission',
      required: [true, 'Permission Must Belong To One Of the Permissions'],
    },
  ],
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
