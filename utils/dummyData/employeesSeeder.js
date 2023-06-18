const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employees = require('../../models/Employee');
const jsonFile = require('./employees.json');
const dbConnection = require('../../config/database');

dotenv.config({ path: '../../.env' });

// Connect to the database
dbConnection();

// Read employee data from a JSON file
const employeesData = JSON.parse(fs.readFileSync('./employees.json'));

// Insert data into the database
const insertData = async () => {
  try {
    await Employees.insertMany(employeesData);
    console.log(`${employeesData.length} employees inserted`);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete employee data from the database
const destroyData = async () => {
  try {
    await Employees.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node employeeSeeder.js -i
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
