const express = require('express')
const app = express();
require('dotenv').config();
require('./config/databaseConnect');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const port = process.env.PORT || 3000;

// middlewares
const middlewares = [
    helmet(),
    cors(),
    morgan('dev'),
    express.json(),
];
app.use(middlewares);

// routes
const setRoute = require('./routes/routes');
setRoute(app);


app.listen(port, () => console.log(`Server is on port ${port}!`))