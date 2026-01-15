const express = require('express');
require("dotenv").config();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';
const cors = require('cors');
require('./config/database')
const cookieParser = require('cookie-parser');
const router = require("./routes");
const responseFormat = require("./middlewares/responseFormat");
const notFound = require("./middlewares/notFound");
const exceptionHandler = require("./middlewares/exceptionHandler");

const server = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

server.use(cors({
    origin: function (origin, callback) {
        if(!origin) return callback(null, true)

        if(allowedOrigins.indexOf(origin) !== -1){
            callback(null, true)
        }else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

server.use(express.json());
server.use(cookieParser());
server.use(responseFormat);

server.get('/', (req, res) => {
    res.status(200).json({
        status: "healthy",
    })
});
server.use('/api', router);

server.use(notFound);
server.use(exceptionHandler)

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
})