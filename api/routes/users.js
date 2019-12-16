const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                res.status(409).json({ message: "Email zajęty" });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({ error: err })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({ message: "Użytkownik został utoworzony" });
                            })
                            .catch(err => res.status(500).json({ error: err }));
                    }
                });
            }
        })
        .catch(err => res.status(500).json({ error: err }));
});

router.delete("/:userId", checkAuth, (req, res, next) => {
    User.findByIdAndRemove(req.params.userId).exec()
        .then(result => {
            res.status(200).json({ message: "Użytkownik został usunięty" });
        })
        .catch(err => res.status(500).json({ error: err }));
})

// logowanie
// test@test.pl
// test

router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({ message: "Błąd autoryzacji" });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, process.env.JWT_KEY,{
                            expiresIn: "1H"
                        })
                        res.status(200).json({ message: "Zalogowano", token: token});
                    }
                    return res.status(404).json({ message: "Błąd autoryzacji" });
                });
            } else {
                //nie ma takiego emaila
                return res.status(401).json({ message: "Błąd autoryzacji" })
            }
        })
        .catch(err => res.status(500).json({ error: err }));
})

module.exports = router;