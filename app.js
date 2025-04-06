require('dotenv').config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var productsRouter = require("./routes/products");
var ordersRouter = require("./routes/orders");
var customersRouter = require("./routes/customers");

var app = express();

const cors = require('cors');
app.use(cors());
 
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/customers", customersRouter);

module.exports = app;
