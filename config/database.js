const { default: mongoose } = require('mongoose');

const dbconnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`DataBase Connected : ${conn.connection.host}`);
  });
  //=> this catch is handled by the unhandled rejection using process on
  // .catch((err) => {
  //   console.log(`Database Error : ${err}`);
  //   process.exit(1);
  // });
};

module.exports = dbconnection;
