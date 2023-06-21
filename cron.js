const CronJob = require("cron").CronJob;
const mongoose = require("mongoose")
require("./models/Notification");

const Notification = mongoose.model("notification");

exports.truncateNotificationTable = () =>{
  console.log("cronJob")
  const job = new CronJob('0 1 * * *', () =>{
    Notification.collection.drop(error => {
      if(error){
        console.log('Error deleting collection:', error);
      } else {
        console.log('Collection deleted successfully.');
      }
    })
  })

  job.start()
}

