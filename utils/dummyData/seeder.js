const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');

const dbConnection = require('../../config/database');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const permissions = JSON.parse(fs.readFileSync('./permissions.json'));
const roles = JSON.parse(fs.readFileSync('./roles.json'));

// Insert data into DB
const insertData = async () => {
  try {
    // Insert permissions
    await Permission.create(permissions);

    // Insert roles
    const rolesWithPermissions = roles.map((role) => {
      const rolePermissions = permissions
        .filter((permission) => permission.role === role.name)
        .map((permission) => permission._id);
      return { ...role, permissions: rolePermissions };
    });

    await Role.create(rolesWithPermissions);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Permission.deleteMany();
    await Role.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
