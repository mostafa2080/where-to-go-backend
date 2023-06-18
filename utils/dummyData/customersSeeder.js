const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Customer = require('../../models/Customer');

const dbConnection = require('../../config/database');

dotenv.config({ path: '../../.env' });

// Connect to the database
dbConnection();

// Read data from the JSON file
const customersData = JSON.parse(fs.readFileSync('./customers.json'));

// Insert data into the database
const insertData = async () => {
  try {
    // Seed customers
    const customers = await Customer.insertMany(customersData);
    console.log(`${customers.length} customers inserted`);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from the database
const destroyData = async () => {
  try {
    await Customer.deleteMany();
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
