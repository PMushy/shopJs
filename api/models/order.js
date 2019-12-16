const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    price: Number
});

module.exports = mongoose.model("Order", orderSchema);