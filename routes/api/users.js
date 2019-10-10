const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keys = require("../../config/keys");


// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validatePurchaseInput = require("../../validation/stockRequest");

// Load User model
const User = require("../../models/User");
const Stock = require("../../models/Stock");
//const UserTransaction = require("../../models/UserTransaction");

const stockInfoParser = require("../../utils/stockInfoParser");
const stockUpdater = require("../../utils/stockUpdater");


// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);
    
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne( {email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists"});
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password 
            });

            // Hash PW before saving it into databgase
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation

    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    console.log(email + ", " + password)

    // Find user by email
    User.find({ email }).then(user => {
        
        // Check if user exists
        if(!user) res.status(404).json({ emailnotfound: "Email not found"});
        // Check Password
        console.log(user)
        bcrypt.compare(password, user[0].password).then(isMatch => {
            if (isMatch) {
                // User matched
                // make JWT Payload
                const payload = {
                    id: user[0]._id,
                    name: user[0].name,
                    balance: user[0].balance,
                    transactions: user[0].transactions,
                    ownedStocks: user[0].ownedStocks
                };
                console.log("POST PAYLOAD")
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect"});
            }
        });
    });
});

// @route POST api/users/stockRequest
router.post("/stockRequest", (req, res) => {
    // Form Validation
    const { errors, isValid } = validatePurchaseInput(req.body);

    if(!isValid) {
        console.log("stockRequest 400");
        return res.status(400).json(errors);
    }
    else {
        console.log("stockRequest 200");
        res.status(200).send("All is well.");
        return 
        
    } 

   
});

router.post("/buyStock", async (req, res) => {
    console.log("BUY STOCK ROUTE")

    await Stock.findOne({ ticker_symbol: req.body.symbol }).then(stock => {
        // If not found stock, make new entry
        const parsedInfo = stockInfoParser(req.body.stockInfo);
        stock = stockUpdater(parsedInfo, stock, req.body.symbol)
 /*       if(!stock) {
            const newEntry = new Stock({
                ticker_symbol: req.body.symbol,
                price: parsedInfo.price,
                opening_price: parsedInfo.opening_price
            })
            newEntry.save()
            stock = newEntry;
        }
        // Else Update info
        else {
            stock.overwrite({
                ticker_symbol: req.body.symbol,
                price: parsedInfo.price,
                opening_price: parsedInfo.opening_price
            });
            stock.save()
        } */
        
        const id = req.body.userId;
        const quantity = req.body.quantity;
        const stockTotal = quantity * stock.price;

        User.findOne({_id: id}).then((user) => {
            if(user.balance >= stockTotal) {
                // time to do buy calculations
                // and add to transactions
                user.balance -= stockTotal; // first
                user.transactions.push({ 
                    transaction_type: "BUY",
                    symbol: stock.ticker_symbol,
                    stock_price: stock.price,
                    stock_quantity: quantity
                });

                // WAIT MUST DO CHECK AND CHANGE FIRST
                let owned = user.ownedStocks
                let queryEntry = owned.pull({symbol: stock.ticker_symbol})
                console.log("OWNED: " + owned)

                console.log("queryEntry: " + queryEntry)
                console.log("TO(QUERYENTRY): " + typeof(queryEntry))
                if(!queryEntry) {
                    user.ownedStocks.push({
                        symbol: stock.ticker_symbol,
                        quantity: quantity
                    });
                    console.log("Pushed a new")
                } else {

                    User.update(
                        { },
                        { $pull: {ownedStocks: {_id : queryEntry._id}}}
                    )
                    console.log("EXISTING QUANTITY: " + queryEntry.quantity)
                    queryEntry["quantity"] += quantity;

                   // owned.remove(queryEntry._id)
                   User.update(
                    { },
                    { $pull: {ownedStocks: {_id : queryEntry._id}}}
                    )

                    owned = user.ownedStocks
                    console.log("OWNED: " + owned)

                    console.log("queryEntry: " + queryEntry)
                    owned.push(queryEntry)
                    console.log("Pushed an existing")
                }
                user.save()
                .then(user => res.json({
                    id: user._id,
                    name: user.name,
                    balance: user.balance,
                    transactions: user.transactions,
                    ownedStocks: user.ownedStocks
                }))
                .catch(err => console.log(err));
                console.log("POST SAVE")
                return res.status(200)
            } else {
                // return error saying "you broke"
                return res.status(400).send("Insufficient funds")
            }
        })
    })

   // return res.status(200).send("Hopefully this works");
})

router.post("/sellStock", async (req, res) => {

    // Ensure User has the amount of Stocks they are trying to dump
    // Find current stock price
    // Update stock 

})
module.exports = router;