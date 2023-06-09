const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbconnection = require('./config/database');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const rolesRoute = require('./routes/rolesRouter');
const permissionsRoute = require('./routes/permissionsRoute');

// Routes
const authRouter = require('./routes/authRoute');
const customersRouter = require('./routes/customersRoute');
const vendorsRoute = require('./routes/vendors');
const imagesRouter = require('./routes/imagesRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const tagsRouter = require('./routes/tagsRouter');
// const EmployeeRoutes = require('./routes/employee');

// Middlewares...
const authenticationMiddleware = require('./middlewares/authenticationMiddleware');

//Routes
// const vendorRequestsRoute = require("./routes/vendorRequestsRoute");

dotenv.config({ path: 'config.env' });

//express app
const app = express();

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect with DB
dbconnection();

//Middleware
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(` Mode: ${process.env.NODE_ENV}`);
}

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/tags', tagsRouter);

app.use(authenticationMiddleware);

app.use(customersRouter);
app.use('/api/v1/roles', rolesRoute);
app.use('/api/v1/permissions', permissionsRoute);
app.use('/api/v1/', vendorsRoute);
// app.use(EmployeeRoutes);

app.use(imagesRouter);

app.all('*', (req, res, next) => {
    next(new ApiError(`Can not find this Route ${req.originalUrl}`, 400));
});

//err mw
app.use(globalError);

//listening
const { PORT } = process.env;
const server = app.listen(PORT, () => {
    console.log(`app running on Port: ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`UnhandledRejection Error ${err}`);
    server.close(() => {
        console.log(`shutting down....`);
        process.exit(1);
    });
});
