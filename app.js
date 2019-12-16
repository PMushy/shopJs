const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRutes = require("./api/routes/users");

mongoose.connect("mongodb+srv://shop:" + process.env.MONGO_PASS + "@sklep-wyh1o.mongodb.net/cluster0?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRutes);

app.use((req, res, next) => {
    const error = new Error("Nie znaleziono");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) =>{
    res.status(error.status || 500).json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;

