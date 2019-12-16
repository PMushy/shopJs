const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (req, res, next) =>{
    Order.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));   
});

router.post("/", (req, res, next) =>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    order.save()
    .then(result => {
        res.status(200).json({
            message: "Dodanie nowego zamówienia",
            createdOrder: order
        });
    })
    .catch(err => res.status(500).json({error: err}));   
});

router.get("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
    .then( doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));   
});

router.patch("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.update({_id: id}, { $set: {
        name: req.body.name,
        price: req.body.price
    }}).exec()
    .then( result => {
        res.status(200).json({message: "Zmieniono zamówienie o id " + id});
    })
    .catch(err => res.status(500).json({error: err}));   
});

router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({message: "Usunięto produktu o id " + id});
    })
});
module.exports = router;