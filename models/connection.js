const mongoose = require("mongoose");

const connectionString =
    process.env.NODE_ENV === "development"
        ? process.env.CONNECTION_STRING_DEVELOPMENT
        : process.env.CONNECTION_STRING_PRODUCTION;

mongoose
    .connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log("Database connected"))
    .catch(error => console.error(error));
