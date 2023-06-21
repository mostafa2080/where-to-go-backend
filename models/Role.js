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

roleSchema.pre('find', function (next) {
  this.populate('permissions', 'name');
  next();
});

roleSchema.pre('findOne', function (next) {
  this.populate('permissions', 'name');
  next();
});

const Role = mongoose.model('roles', roleSchema);

module.exports = Role;
