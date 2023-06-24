const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbconnection = require('./config/database');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const rolesRoute = require('./routes/rolesRouter');
const permissionsRoute = require('./routes/permissionsRoute');
const refresh = require('./utils/refresh');
require("./cron").truncateNotificationTable()

// Routes
const authRouter = require('./routes/authRoute');
const customersRouter = require('./routes/customersRoute');
const vendorsRoute = require('./routes/vendors');
const imagesRouter = require('./routes/imagesRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const tagsRouter = require('./routes/tagsRouter');
const EmployeeRoutes = require('./routes/employee');
const reportsRoute = require('./routes/reportsRoute');
const reviewRoute = require('./routes/reviewRoute');
const contactUsRoute = require('./routes/contactUsRoute');
const favoritesRouter = require('./routes/favoritesRouter');
const notificationsRoute = require('./routes/notificationsRoute');
// Middlewares...
const authenticationMiddleware = require('./middlewares/authenticationMiddleware');
const raisedEventListener = require('./utils/webSockets');

dotenv.config({ path: '.env' });

//express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {},
});

//connect with DB
dbconnection();

//github refresher
app.use('/refresh', refresh);

// cors middleware
app.use(cors());

//ssl configuration
app.use(express.static('public'));
//Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(` Mode: ${process.env.NODE_ENV}`);
}

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/contact', contactUsRoute);
app.use('/api/v1/categories', categoriesRouter);

app.use(authenticationMiddleware);

app.use('/api/v1/vendors', vendorsRoute);
app.use('/api/v1/notifications', notificationsRoute);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/employees/', EmployeeRoutes);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/reviews', reviewRoute);

app.use('/api/v1/customers/favorites', favoritesRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/roles', rolesRoute);
app.use('/api/v1/permissions', permissionsRoute);
app.use('/api/v1/reports', reportsRoute);
app.all('*', (req, res, next) => {
  next(new ApiError(`Can not find this Route ${req.originalUrl}`, 400));
});

//err mw
app.use(globalError);

//socket
raisedEventListener(io);

//listening
const { PORT } = process.env;
server.listen(PORT, () => {
  console.log(`app running on Port: ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Error ${err}`);
  server.close(() => {
    console.log(`shutting down....`);
    process.exit(1);
  });
});

module.exports = {
  io: io,
};
