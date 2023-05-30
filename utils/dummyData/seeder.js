const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');

const dbConnection = require('../../config/database');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read role and permission data
const rolesData = JSON.parse(fs.readFileSync('./roles.json'));
const permissionsData = JSON.parse(fs.readFileSync('./permissions.json'));

// Insert data into the database
const insertData = async () => {
  try {
    // Seed permissions first
    const permissions = await Permission.insertMany(permissionsData);
    console.log(`${permissions.length} permissions inserted`);

    // Map permission names to their respective IDs
    const permissionMap = {};
    permissions.forEach((permission) => {
      permissionMap[permission.name] = permission._id;
    });

    // Update role data with permission IDs
    const roles = rolesData.map((role) => ({
      ...role,
      permissions: role.permissions.map(
        (permissionName) => permissionMap[permissionName]
      ),
    }));

    // Seed roles with updated permission IDs
    await Role.insertMany(roles);
    console.log(`${roles.length} roles inserted`);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from the database
const destroyData = async () => {
  try {
    await Role.deleteMany();
    await Permission.deleteMany();
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
